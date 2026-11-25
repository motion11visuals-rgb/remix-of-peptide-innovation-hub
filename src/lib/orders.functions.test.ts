import { beforeEach, describe, expect, it, vi } from "vitest";
import { submitOrder } from "./orders.functions";
import { MAX_PROOF_BYTES } from "./order-logic";
import { POLICY_VERSION } from "./store-policy";

import { beforeAll as __ba, afterAll as __aa, vi as __vi } from "vitest";
__ba(() => { __vi.useFakeTimers({ toFake: ["Date"], now: new Date("2026-12-10T00:00:00Z") }); });
__aa(() => { __vi.useRealTimers(); });


const storage = vi.hoisted(() => ({
  upload: vi.fn().mockResolvedValue({ error: null }),
  insert: vi.fn().mockResolvedValue({ error: null }),
  remove: vi.fn().mockResolvedValue({ error: null }),
  recent: vi.fn().mockResolvedValue({ error: null, count: 0 }),
  sendEmail: vi.fn().mockResolvedValue({ sent: true }),
}));

vi.mock("@tanstack/react-start", () => ({
  createServerFn: () => ({ inputValidator: () => ({ handler: (handler: unknown) => handler }) }),
}));
vi.mock("@/integrations/supabase/client.server", () => ({
  supabaseAdmin: {
    storage: { from: () => ({ upload: storage.upload, remove: storage.remove }) },
    from: () => ({ insert: storage.insert, select: () => ({ eq: () => ({ gte: storage.recent }) }) }),
  },
}));
vi.mock("./email-templates/send-email", () => ({ sendTemplateEmail: storage.sendEmail }));

function submission(file: File) {
  const data = new FormData();
  const fields = {
    orderRef: "AU-ABCDEF", customerName: "Upload Test", email: "upload-test@example.com",
    organization: "Upload Test Lab", address: "123 Test Street", city: "Miami", state: "FL", zip: "33182",
    paymentMethod: "zelle", researchOnly: "true", termsAccepted: "true", policyVersion: POLICY_VERSION,
    items: JSON.stringify([{ slug: "retatrutide", size: "5 mg", qty: 1 }]),
  };
  for (const [key, value] of Object.entries(fields)) data.set(key, value);
  data.set("proof", file);
  return data;
}

describe("payment screenshot submission", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    storage.upload.mockResolvedValue({ error: null });
    storage.insert.mockResolvedValue({ error: null });
    storage.recent.mockResolvedValue({ error: null, count: 0 });
    storage.sendEmail.mockResolvedValue({ sent: true });
  });

  it("normalizes a phone screenshot with missing MIME type before uploading and saving", async () => {
    const result = await submitOrder({ data: submission(new File(["screenshot"], "Screenshot.PNG")) });
    expect(result.ok).toBe(true);
    expect(storage.upload).toHaveBeenCalledWith(expect.stringMatching(/^AU-ABCDEF\//), expect.objectContaining({ type: "image/png" }), { contentType: "image/png", upsert: false });
    expect(storage.insert).toHaveBeenCalledTimes(1);
  });

  it("rejects unsupported file types before storage or order writes", async () => {
    const result = await submitOrder({ data: submission(new File(["document"], "proof.pdf", { type: "application/pdf" })) });
    expect(result.ok).toBe(false);
    expect(storage.upload).not.toHaveBeenCalled();
    expect(storage.insert).not.toHaveBeenCalled();
  });

  it("keeps the 10 MB limit on the server without writing rejected orders", async () => {
    const file = new File([new Uint8Array(MAX_PROOF_BYTES + 1)], "Screenshot.PNG", { type: "image/png" });
    const result = await submitOrder({ data: submission(file) });
    expect(result).toEqual({ ok: false, error: "Screenshot must be 10 MB or smaller." });
    expect(storage.upload).not.toHaveBeenCalled();
    expect(storage.insert).not.toHaveBeenCalled();
  });

  it("emails each saved order with its server-priced details and event idempotency key", async () => {
    const result = await submitOrder({ data: submission(new File(["proof"], "proof.png", { type: "image/png" })) });
    expect(result).toMatchObject({ ok: true, total: 46.99, emailStatus: "sent" });
    expect(storage.sendEmail).toHaveBeenCalledTimes(1);
    expect(storage.sendEmail).toHaveBeenCalledWith("order-confirmation", "upload-test@example.com", {
      idempotencyKey: "order-confirmation-AU-ABCDEF", replyTo: "synthesialabs1@gmail.com",
      templateData: {
        customerName: "Upload Test", orderRef: "AU-ABCDEF",
        items: [{ slug: "retatrutide", name: "GLP-RT", size: "5 mg", qty: 1, unitPrice: 35, total: 35 }],
        subtotal: 35, shipping: 9, processingFee: 2.99, total: 46.99,
        paymentMethod: "Zelle", shippingAddress: "123 Test Street, Miami, FL 33182",
      },
    });
    const savedAt = storage.insert.mock.invocationCallOrder[0];
    const sentAt = storage.sendEmail.mock.invocationCallOrder[0];
    expect(savedAt).toBeDefined();
    expect(sentAt).toBeDefined();
    if (savedAt === undefined || sentAt === undefined) throw new Error("Missing save/send calls");
    expect(savedAt).toBeLessThan(sentAt);
  });

  it("never emails an order whose screenshot or order save fails", async () => {
    storage.upload.mockResolvedValueOnce({ error: { message: "upload failed" } });
    expect(await submitOrder({ data: submission(new File(["proof"], "proof.png", { type: "image/png" })) })).toMatchObject({ ok: false });
    storage.insert.mockResolvedValueOnce({ error: { code: "save_failed" } });
    expect(await submitOrder({ data: submission(new File(["proof"], "proof.png", { type: "image/png" })) })).toMatchObject({ ok: false });
    expect(storage.sendEmail).not.toHaveBeenCalled();
  });

  it("keeps the order successful when email sending fails", async () => {
    storage.sendEmail.mockRejectedValueOnce(new Error("email unavailable"));
    const result = await submitOrder({ data: submission(new File(["proof"], "proof.png", { type: "image/png" })) });
    expect(result).toMatchObject({ ok: true, emailStatus: "unavailable", orderRef: "AU-ABCDEF" });
    expect(storage.remove).not.toHaveBeenCalled();
  });

  it("does not retry a suppressed recipient", async () => {
    storage.sendEmail.mockResolvedValueOnce({ sent: false, reason: "recipient_suppressed" });
    const result = await submitOrder({ data: submission(new File(["proof"], "proof.png", { type: "image/png" })) });
    expect(result).toMatchObject({ ok: true, emailStatus: "suppressed" });
    expect(storage.sendEmail).toHaveBeenCalledTimes(1);
  });

  it("limits email sends to five existing orders per recipient per hour without rejecting the order", async () => {
    storage.recent.mockResolvedValueOnce({ error: null, count: 5 });
    const result = await submitOrder({ data: submission(new File(["proof"], "proof.png", { type: "image/png" })) });
    expect(result).toMatchObject({ ok: true, emailStatus: "unavailable" });
    expect(storage.sendEmail).not.toHaveBeenCalled();
    expect(storage.insert).toHaveBeenCalledTimes(1);
  });
});
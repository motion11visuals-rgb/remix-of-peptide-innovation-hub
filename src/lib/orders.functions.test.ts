import { beforeEach, describe, expect, it, vi } from "vitest";
import { submitOrder } from "./orders.functions";
import { MAX_PROOF_BYTES } from "./order-logic";
import { POLICY_VERSION } from "./store-policy";

const storage = vi.hoisted(() => ({
  upload: vi.fn().mockResolvedValue({ error: null }),
  insert: vi.fn().mockResolvedValue({ error: null }),
}));

vi.mock("@tanstack/react-start", () => ({
  createServerFn: () => ({ inputValidator: () => ({ handler: (handler: unknown) => handler }) }),
}));
vi.mock("@/integrations/supabase/client.server", () => ({
  supabaseAdmin: {
    storage: { from: () => ({ upload: storage.upload }) },
    from: () => ({ insert: storage.insert }),
  },
}));

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
});
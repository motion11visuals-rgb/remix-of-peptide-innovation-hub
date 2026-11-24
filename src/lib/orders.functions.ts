import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { normalizeProof, orderFieldsSchema, orderItemSchema, priceOrder, validateProof } from "./order-logic";

type SubmitResult = { ok: true; orderRef: string; subtotal: number; shipping: number; total: number; emailStatus: "sent" | "suppressed" | "unavailable" } | { ok: false; error: string };

function str(fd: FormData, key: string): string | undefined {
  const v = fd.get(key);
  return typeof v === "string" && v.trim() !== "" ? v : undefined;
}

export const submitOrder = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => {
    if (!(data instanceof FormData)) throw new Error("Invalid order submission");
    return data;
  })
  .handler(async ({ data }): Promise<SubmitResult> => {
    const fields = orderFieldsSchema.safeParse({
      orderRef: str(data, "orderRef"),
      customerName: str(data, "customerName"),
      email: str(data, "email"),
      phone: str(data, "phone"),
      organization: str(data, "organization"),
      affiliation: str(data, "affiliation"),
      address: str(data, "address"),
      city: str(data, "city"),
      state: str(data, "state"),
      zip: str(data, "zip"),
      paymentMethod: str(data, "paymentMethod"),
      paymentName: str(data, "paymentName"),
      notes: str(data, "notes"),
      researchOnly: str(data, "researchOnly"),
      termsAccepted: str(data, "termsAccepted"),
      policyVersion: str(data, "policyVersion"),
    });
    if (!fields.success) return { ok: false, error: fields.error.issues[0]?.message ?? "Check your details" };

    let rawItems: unknown;
    try {
      rawItems = JSON.parse(str(data, "items") ?? "[]");
    } catch {
      return { ok: false, error: "Your cart could not be read. Please try again." };
    }
    const items = z.array(orderItemSchema).max(50).safeParse(rawItems);
    const priced = items.success ? priceOrder(items.data, new Date(), str(data, "promoCode")) : null;
    if (!priced) return { ok: false, error: "Your cart has an item that is sold out or no longer carried. Please update your cart." };

    const proof = data.get("proof");
    const file = proof instanceof File ? normalizeProof(proof) : null;
    const proofError = validateProof(file);
    if (proofError || !file) return { ok: false, error: proofError ?? "Upload your payment screenshot." };

    // Visitors cannot read or write orders directly; this public checkout writes with server privileges
    // after validating every field and recomputing prices from the catalog.
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const f = fields.data;
    // Limit this public trigger using existing order events, not an email queue/table.
    // Fail closed for email only: email issues must never prevent saving an order.
    const recent = await supabaseAdmin.from("orders")
      .select("id", { count: "exact", head: true })
      .eq("email", f.email.toLowerCase())
      .gte("created_at", new Date(Date.now() - 60 * 60 * 1000).toISOString());
    const canEmail = !recent.error && recent.count !== null && recent.count < 5;
    const ext = (file.name.split(".").pop() ?? "png").toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 5) || "png";
    const path = `${f.orderRef}/${crypto.randomUUID()}.${ext}`;

    const upload = await supabaseAdmin.storage
      .from("payment-proofs")
      .upload(path, file, { contentType: file.type, upsert: false });
    if (upload.error) {
      console.error("proof upload failed", upload.error);
      return { ok: false, error: "We couldn't upload your screenshot. Please try again." };
    }

    const insert = await supabaseAdmin.from("orders").insert({
      order_ref: f.orderRef,
      customer_name: f.customerName,
      email: f.email.toLowerCase(),
      phone: f.phone ?? null,
      organization: f.organization,
      affiliation: f.affiliation ?? null,
      address: f.address,
      city: f.city,
      state: f.state,
      zip: f.zip,
      items: priced.lines,
      subtotal: priced.subtotal,
      shipping: priced.shipping,
      processing_fee: priced.processingFee,
      total: priced.total,
      policy_version: f.policyVersion,
      payment_method: f.paymentMethod,
      payment_name: f.paymentName ?? null,
      proof_path: path,
      notes: [priced.discount > 0 ? `Promo LABS20: -$${priced.discount.toFixed(2)}` : null, f.notes ?? null].filter(Boolean).join(" | ") || null,
    });
    if (insert.error) {
      console.error("order insert failed", insert.error);
      await supabaseAdmin.storage.from("payment-proofs").remove([path]);
      const duplicate = insert.error.code === "23505";
      return {
        ok: false,
        error: duplicate
          ? "This order reference was already submitted. Refresh the page to start a new order."
          : "We couldn't save your order. Please try again.",
      };
    }

    let emailStatus: "sent" | "suppressed" | "unavailable" = "unavailable";
    if (canEmail) {
      try {
        const { sendTemplateEmail } = await import("./email-templates/send-email");
        const { PAYMENT_METHODS } = await import("./payments");
        const result = await sendTemplateEmail("order-confirmation", f.email.toLowerCase(), {
          idempotencyKey: `order-confirmation-${f.orderRef}`,
          replyTo: "synthesialabs1@gmail.com",
          templateData: {
            customerName: f.customerName,
            orderRef: f.orderRef,
            items: priced.lines,
            subtotal: priced.subtotal,
            shipping: priced.shipping,
            processingFee: priced.processingFee,
            total: priced.total,
            paymentMethod: PAYMENT_METHODS.find((method) => method.id === f.paymentMethod)?.label ?? f.paymentMethod,
            shippingAddress: `${f.address}, ${f.city}, ${f.state} ${f.zip}`,
          },
        });
        emailStatus = result.sent ? "sent" : "suppressed";
      } catch (error) {
        // Do not log customer details, credentials, or full provider errors.
        const code = error && typeof error === "object" && "code" in error ? error.code : "email_send_failed";
        console.error("order confirmation email failed", { code });
      }
    }

    return { ok: true, orderRef: f.orderRef, subtotal: priced.subtotal, shipping: priced.shipping, total: priced.total, emailStatus };
  });

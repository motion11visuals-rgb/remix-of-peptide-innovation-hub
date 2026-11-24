import { createServerFn } from "@tanstack/react-start";
import { requireOrderAuth } from "@/lib/order-auth";
import { parseOrderStatusInput } from "@/lib/order-status";

// Uses the signed-in owner's own session (admin-only access rules in the database),
// so the orders page works without any private server key.
export const listOrders = createServerFn({ method: "GET" })
  .middleware([requireOrderAuth])
  .handler(async ({ context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" });
    if (!isAdmin) return { ok: false as const, error: null, orders: [] };
    const { data, error } = await context.supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(200);
    if (error) {
      console.error("listOrders failed", error);
      return { ok: false as const, error: error.message, orders: [] };
    }
    const orders = await Promise.all((data ?? []).map(async (o) => {
      const { data: s } = await context.supabase.storage.from("payment-proofs").createSignedUrl(o.proof_path, 3600);
      return { ...o, items: JSON.stringify(o.items), proofUrl: s?.signedUrl ?? null };
    }));
    return { ok: true as const, error: null, orders };
  });

export const setOrderStatus = createServerFn({ method: "POST" })
  .middleware([requireOrderAuth])
  .inputValidator(parseOrderStatusInput)
  .handler(async ({ context, data }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" });
    if (!isAdmin) throw new Error("Not allowed");
    const { data: rows, error } = await context.supabase.from("orders").update({ status: data.status }).eq("id", data.id).select("id, status");
    if (error) throw new Error(error.message);
    if (!rows || rows.length === 0) throw new Error("Order not found or not allowed");
    return rows[0];
  });

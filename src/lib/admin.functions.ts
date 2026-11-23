import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const listOrders = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" });
    if (!isAdmin) return { ok: false as const, orders: [] };
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data } = await supabaseAdmin.from("orders").select("*").order("created_at", { ascending: false }).limit(200);
    const orders = await Promise.all((data ?? []).map(async (o) => {
      const { data: s } = await supabaseAdmin.storage.from("payment-proofs").createSignedUrl(o.proof_path, 3600);
      return { ...o, items: JSON.stringify(o.items), proofUrl: s?.signedUrl ?? null };
    }));
    return { ok: true as const, orders };
  });

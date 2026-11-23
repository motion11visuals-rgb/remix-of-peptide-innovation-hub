import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { listOrders } from "@/lib/admin.functions";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/admin/orders")({
  head: () => ({ meta: [{ title: "Orders — Synthesia Labs admin" }, { name: "description", content: "Store orders." }, { name: "robots", content: "noindex" }, { property: "og:title", content: "Orders — Synthesia Labs admin" }, { property: "og:description", content: "Store orders." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: OrdersPage,
});

type Item = { name?: string; slug?: string; size?: string; qty?: number };

function OrdersPage() {
  const fetchOrders = useServerFn(listOrders);
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({ queryKey: ["admin-orders"], queryFn: () => fetchOrders() });
  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-3xl">Orders</h1>
        <Button variant="outline" onClick={signOut}>Sign out</Button>
      </div>
      {isLoading && <p>Loading…</p>}
      {data && !data.ok && <p>This account doesn't have owner access.</p>}
      {data?.ok && data.orders.length === 0 && <p>No orders yet.</p>}
      <div className="space-y-4">
        {data?.ok && data.orders.map((o) => {
          let items: Item[] = [];
          try { items = JSON.parse(o.items) as Item[]; } catch { /* ignore */ }
          return (
            <div key={o.id} className="rounded-lg border border-border bg-card p-5">
              <div className="flex flex-wrap justify-between gap-2">
                <div className="font-semibold">{o.order_ref} · {o.customer_name}</div>
                <div className="text-sm text-muted-foreground">{new Date(o.created_at).toLocaleString()}</div>
              </div>
              <div className="mt-2 grid gap-1 text-sm md:grid-cols-2">
                <div>{o.email}{o.phone ? ` · ${o.phone}` : ""}</div>
                <div>{o.organization}</div>
                <div>{o.address}, {o.city}, {o.state} {o.zip}</div>
                <div>Paid by {o.payment_method}{o.payment_name ? ` (${o.payment_name})` : ""}</div>
              </div>
              <ul className="mt-3 text-sm list-disc pl-5">
                {items.map((it, i) => <li key={i}>{it.qty ?? 1} × {it.name ?? it.slug} {it.size ?? ""}</li>)}
              </ul>
              {o.notes && <p className="mt-2 text-sm italic">Note: {o.notes}</p>}
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                <div className="font-semibold">Total ${Number(o.total ?? o.subtotal).toFixed(2)}</div>
                {o.proofUrl && <a href={o.proofUrl} target="_blank" rel="noreferrer" className="text-sm underline">View payment screenshot</a>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

import { siteUrl } from "@/lib/site-url";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Minus, Plus, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { KitPhoto } from "@/components/site/KitPhoto";
import { WarehousePromo } from "@/components/site/WarehousePromo";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import { MAX_QTY } from "@/lib/cart-logic";
import { getKit, WAREHOUSE_SHIPPING_LABEL } from "@/lib/china-warehouse";
import { BRAND, formatPrice } from "@/lib/products";
import { SalePrice } from "@/components/site/SalePrice";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/china-warehouse/$slug")({
  staticData: { sitemap: false },
  loader: ({ params }) => {
    const kit = getKit(params.slug);
    if (!kit) throw notFound();
    return { kit };
  },
  head: ({ loaderData }) => {
    const kit = loaderData?.kit;
    if (!kit) return { meta: [{ title: "Kit unavailable | Synthesia Labs" }, { name: "robots", content: "noindex" }] };
    const strengths = kit.sizes.map((s) => s.label.replace(" × 10 vials", "")).join(", ");
    const title = `${kit.name} 10-Vial Kit (${strengths}) | Synthesia Labs`;
    const desc = `${kit.name} research kit of 10 vials in ${strengths}. ${kit.summary}. Ships from our China warehouse in ${WAREHOUSE_SHIPPING_LABEL}; 35% off for Black Friday. Research use only.`;
    const url = siteUrl(`/china-warehouse/${kit.slug}`);
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "product" },
        { property: "og:url", content: url },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [{
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Product",
          name: `${kit.name} 10-vial research kit`,
          description: desc,
          brand: { "@type": "Brand", name: BRAND.name },
          url,
          offers: kit.sizes.map((s) => ({ "@type": "Offer", name: s.label, price: s.price.toFixed(2), priceCurrency: "USD", availability: "https://schema.org/InStock", url })),
        }),
      }],
    };
  },
  component: KitPage,
});

function KitPage() {
  const { kit } = Route.useLoaderData();
  const cart = useCart();
  const [size, setSize] = useState(0);
  const [qty, setQty] = useState(1);
  const current = kit.sizes[size];
  return (
    <section className="mx-auto max-w-7xl px-6 pt-10">
      <WarehousePromo />
      <Link to="/china-warehouse" className="mt-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> All China warehouse kits
      </Link>
      <div className="mt-6 grid gap-12 lg:grid-cols-2">
        <KitPhoto name={kit.name} clear={kit.clear} className="aspect-square w-full rounded-lg border" />
        <div>
          <p className="eyebrow">China Warehouse · 10-vial kit</p>
          <h1 className="mt-3 text-4xl font-semibold text-foreground md:text-5xl">{kit.name} 10-vial kit</h1>
          <p className="mt-4 text-muted-foreground">{kit.summary}. Each kit contains 10 vials of the strength you choose.</p>
          <p className="mt-6 font-display text-sm text-foreground">Strength per vial</p>
          <div className="mt-3 flex flex-wrap gap-3">
            {kit.sizes.map((s, i) => (
              <button key={s.label} onClick={() => setSize(i)} className={cn("rounded-md border px-5 py-3 text-left transition-colors", size === i ? "border-primary bg-accent" : "hover:border-primary/50")}>
                <div className="font-display text-sm text-foreground">{s.label}</div>
                <div className="text-sm text-primary"><SalePrice warehouse price={s.price} oldClassName="text-xs" /></div>
              </button>
            ))}
          </div>
          <p className="mt-8 font-display text-3xl font-semibold text-primary-glow"><SalePrice warehouse price={current?.price ?? 0} oldClassName="text-xl font-normal" /></p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <div className="flex h-12 items-center rounded-md border">
              <button aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid h-full w-11 place-items-center text-muted-foreground hover:text-foreground"><Minus className="size-4" /></button>
              <span className="w-10 text-center font-display text-foreground">{qty}</span>
              <button aria-label="Increase quantity" onClick={() => setQty((q) => Math.min(MAX_QTY, q + 1))} className="grid h-full w-11 place-items-center text-muted-foreground hover:text-foreground"><Plus className="size-4" /></button>
            </div>
            <Button variant="gold" size="xl" onClick={() => {
              if (!current) return;
              cart.add({ slug: kit.slug, size: current.label, qty });
              toast.success(`Added ${kit.name} ${current.label} × ${qty}`, { action: { label: "View cart", onClick: () => cart.setOpen(true) } });
              setQty(1);
            }}>
              <ShoppingBag className="size-4" /> Add kit to cart
            </Button>
          </div>
          <p className="mt-6 text-sm text-muted-foreground">Ships from our China warehouse · Normal shipping {WAREHOUSE_SHIPPING_LABEL}.</p>
          <p className="mt-4 text-xs text-muted-foreground">{BRAND.disclaimer}</p>
        </div>
      </div>
    </section>
  );
}

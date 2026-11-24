import { createFileRoute, Link } from "@tanstack/react-router";
import kitImage from "@/assets/kit-black.png.asset.json";
import { WarehousePromo } from "@/components/site/WarehousePromo";
import { KITS } from "@/lib/china-warehouse";
import { BRAND, formatPrice } from "@/lib/products";

const TITLE = "China Warehouse 10-Vial Research Peptide Kits | Synthesia Labs";
const DESC = "Buy 10-vial research peptide kits from our China warehouse: Retatrutide, Tirzepatide, Semaglutide, BPC-157, HGH and more. Free shipping November & December. Research use only.";

export const Route = createFileRoute("/china-warehouse/")({
  staticData: { sitemap: true },
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/china-warehouse" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/china-warehouse" }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Synthesia Labs China warehouse 10-vial kits",
        url: "/china-warehouse",
        mainEntity: { "@type": "ItemList", numberOfItems: KITS.length, itemListElement: KITS.map((k, i) => ({ "@type": "ListItem", position: i + 1, name: `${k.name} 10-vial kit`, url: `/china-warehouse/${k.slug}` })) },
      }),
    }],
  }),
  component: Warehouse,
});

function Warehouse() {
  return (
    <section className="mx-auto max-w-7xl px-6 pt-10">
      <WarehousePromo />
      <p className="eyebrow mt-12">China Warehouse</p>
      <h1 className="mt-3 text-5xl font-semibold text-foreground md:text-6xl">10-vial kits</h1>
      <p className="mt-4 max-w-xl text-muted-foreground">
        Everything from our China warehouse is sold only as kits of 10 vials. Pick your peptide and strength. {BRAND.disclaimer}
      </p>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {KITS.map((k) => (
          <Link key={k.slug} to="/china-warehouse/$slug" params={{ slug: k.slug }} className="group overflow-hidden rounded-lg border bg-card transition-colors hover:border-primary/50">
            <img src={kitImage.url} alt={`${k.name} 10-vial research kit`} className="aspect-square w-full object-cover" loading="lazy" />
            <div className="p-5">
              <h2 className="font-display text-lg font-semibold text-foreground">{k.name} · 10-vial kit</h2>
              <p className="mt-1 text-sm text-muted-foreground">{k.summary}</p>
              <p className="mt-2 text-xs text-muted-foreground">{k.sizes.map((s) => s.label.replace(" × 10 vials", "")).join(" · ")}</p>
              <p className="mt-3 text-primary">From {formatPrice(Math.min(...k.sizes.map((s) => s.price)))}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ProductCard } from "@/components/site/ProductCard";
import { CATEGORIES, PRODUCTS, isSoldOut, type Category } from "@/lib/products";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/products/")({
  head: () => ({
    meta: [
      { title: "Peptide Catalog — Synthesia Labs" },
      { name: "description", content: "Browse BPC-157, TB-500, GHK-Cu, Ipamorelin and more research peptides, with facility COAs on request." },
      { property: "og:title", content: "Peptide Catalog — Synthesia Labs" },
      { property: "og:description", content: "Research-grade peptides with facility Certificates of Analysis available on request." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Catalog,
});

function Catalog() {
  const [cat, setCat] = useState<Category | "All">("All");
  const filtered = cat === "All" ? PRODUCTS : PRODUCTS.filter((p) => p.category === cat);
  // In-stock compounds first, sold-out ones after, keeping catalog order within each group.
  const list = [...filtered.filter((p) => !isSoldOut(p)), ...filtered.filter((p) => isSoldOut(p))];
  return (
    <section className="mx-auto max-w-7xl px-6 pt-20">
      <p className="eyebrow">Catalog</p>
      <h1 className="mt-3 text-5xl font-semibold text-foreground md:text-6xl">Research peptides</h1>
      <p className="mt-4 font-classic text-xl font-semibold text-primary">Best prices. Best quality.</p>
      <p className="mt-4 max-w-xl text-muted-foreground">
        Every vial comes with laboratory-use directions and applicable COA information. Lipo-C with B12 is
        supplied as a red liquid; peptide forms are listed on each product page. Full facility Certificates of
        Analysis are available on request — text us on WhatsApp for your lot. For research use only.
      </p>
      <div className="mt-10 flex flex-wrap gap-2">
        {(["All", ...CATEGORIES] as const).map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm transition-colors",
              cat === c
                ? "border-primary bg-primary text-primary-foreground"
                : "text-muted-foreground hover:border-primary/50 hover:text-foreground",
            )}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
    </section>
  );
}

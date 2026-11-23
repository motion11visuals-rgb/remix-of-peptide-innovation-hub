import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, FileCheck2, Minus, Plus, ShoppingBag, Snowflake } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/lib/cart";
import { MAX_QTY } from "@/lib/cart-logic";
import { useState } from "react";
import { VialImage } from "@/components/site/VialImage";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/site/ProductCard";
import { BRAND, PRODUCTS, formatPrice, getProduct, isSizeAvailable, isSoldOut } from "@/lib/products";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/products/$slug")({
  loader: ({ params }) => {
    const product = getProduct(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Product not found — Synthesia Labs" }, { name: "robots", content: "noindex" }] };
    const p = loaderData.product;
    const title = `${p.name} — ${p.fullName} | Synthesia Labs`;
    return {
      meta: [
        { title },
        { name: "description", content: `${p.name} research peptide, ${p.purity} purity. ${p.summary}` },
        { property: "og:title", content: title },
        { property: "og:description", content: p.summary },
        { property: "og:type", content: "product" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: `/products/${p.slug}` }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: `${p.name} — ${p.fullName}`,
            description: `${p.description} For laboratory research use only.`,
            sku: p.slug,
            category: p.category,
            brand: { "@type": "Brand", name: "Synthesia Labs" },
            additionalProperty: [
              { "@type": "PropertyValue", name: "CAS number", value: p.cas },
              { "@type": "PropertyValue", name: "Purity", value: p.purity },
              { "@type": "PropertyValue", name: "Form", value: p.form },
            ],
            offers: p.sizes.map((s) => ({
              "@type": "Offer",
              name: `${p.name} ${s.label}`,
              price: s.price.toFixed(2),
              priceCurrency: "USD",
              url: `/products/${p.slug}`,
              availability: isSizeAvailable(p, s.label) ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            })),
          }),
        },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-xl px-6 py-32 text-center">
      <h1 className="text-4xl font-semibold text-foreground">Compound not found</h1>
      <Link to="/products" className="mt-6 inline-block text-primary">Back to catalog</Link>
    </div>
  ),
  component: ProductPage,
});

function ProductPage() {
  const { product } = Route.useLoaderData();
  const soldOut = isSoldOut(product);
  const [size, setSize] = useState(() => {
    const i = product.sizes.findIndex((s) => isSizeAvailable(product, s.label));
    return i === -1 ? 0 : i;
  });
  const [qty, setQty] = useState(1);
  const cart = useCart();
  const current = product.sizes[size];
  const currentAvailable = !!current && isSizeAvailable(product, current.label);
  const related = PRODUCTS.filter((p) => p.slug !== product.slug && p.category === product.category).slice(0, 3);
  const specs = [
    ["Sequence", product.sequence],
    ["Molecular formula", product.formula],
    ["Molecular weight", product.molecularWeight],
    ["CAS number", product.cas],
    ["Purity (HPLC)", product.purity],
    ["Form", product.form],
  ];

  return (
    <div className="mx-auto max-w-7xl px-6 pt-12">
      <Link to="/products" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Catalog
      </Link>
      <div className="mt-8 grid gap-12 lg:grid-cols-2">
        <div className="self-start overflow-hidden rounded-lg border bg-background lg:sticky lg:top-32">
          <VialImage name={product.name} liquid={product.slug === "lipo-c-b12"} alt={`${product.name} (${product.fullName}) ${product.purity} purity, ${product.slug === "lipo-c-b12" ? "red liquid, " : ""}${product.form.toLowerCase()} — Synthesia Labs research vial`} size="lg" className="w-full" />
        </div>
        <div>
          <p className="eyebrow">{product.category}</p>
          <h1 className="mt-3 text-5xl font-semibold text-foreground md:text-6xl">{product.name}</h1>
          <p className="mt-2 text-lg text-muted-foreground">{product.fullName}</p>
          <p className="mt-6 text-foreground/85">{product.description}</p>

          <div className="mt-8">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Vial size</p>
            <div className="mt-3 flex flex-wrap gap-3">
              {product.sizes.map((s, i) => {
                const available = isSizeAvailable(product, s.label);
                return (
                  <button
                    key={s.label}
                    onClick={() => setSize(i)}
                    disabled={!available}
                    className={cn(
                      "rounded-md border px-5 py-3 text-left transition-colors",
                      !available
                        ? "cursor-not-allowed opacity-50"
                        : size === i
                          ? "border-primary bg-accent"
                          : "hover:border-primary/50",
                    )}
                  >
                    <div className={cn("font-display text-sm text-foreground", !available && "line-through")}>{s.label}</div>
                    <div className={cn("text-sm", available ? "text-primary" : "text-muted-foreground")}>
                      {available ? formatPrice(s.price) : "Sold out"}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            {soldOut ? (
              <span className="rounded-sm border px-4 py-2 font-display text-lg uppercase tracking-[0.2em] text-muted-foreground">
                Sold out
              </span>
            ) : (
              <span className="font-display text-3xl font-semibold text-primary-glow">
                {formatPrice(current?.price ?? 0)}
              </span>
            )}
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <div className="flex h-12 items-center rounded-md border">
              <button
                aria-label="Decrease quantity"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="grid h-full w-11 place-items-center text-muted-foreground hover:text-foreground"
              >
                <Minus className="size-4" />
              </button>
              <span className="w-10 text-center font-display text-foreground">{qty}</span>
              <button
                aria-label="Increase quantity"
                onClick={() => setQty((q) => Math.min(MAX_QTY, q + 1))}
                className="grid h-full w-11 place-items-center text-muted-foreground hover:text-foreground"
              >
                <Plus className="size-4" />
              </button>
            </div>
            <Button
              variant="gold"
              size="xl"
              disabled={!currentAvailable}
              onClick={() => {
                if (!current || !currentAvailable) return;
                cart.add({ slug: product.slug, size: current.label, qty });
                toast.success(`Added ${product.name} ${current.label} × ${qty}`, {
                  action: { label: "View cart", onClick: () => cart.setOpen(true) },
                });
                setQty(1);
              }}
            >
              <ShoppingBag /> {currentAvailable ? "Add to cart" : "Sold out"}
            </Button>
            <Link
              to="/contact"
              search={{ product: `${product.name} ${current?.label ?? ""}`.trim() }}
              className="text-sm text-muted-foreground underline-offset-4 hover:text-primary hover:underline"
            >
              {soldOut ? "Ask about restock" : "Bulk inquiry"}
            </Link>
          </div>

          <div className="mt-6 flex flex-wrap gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-2"><FileCheck2 className="size-4 text-primary" /> COA on request</span>
            <span className="flex items-center gap-2"><Snowflake className="size-4 text-primary" /> Store at −20°C</span>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">Every vial comes with laboratory-use directions and applicable COA information. Full facility COAs are available on request. Not for human consumption.</p>

          <dl className="mt-10 divide-y rounded-lg border bg-surface">
            {specs.map(([k, v]) => (
              <div key={k} className="grid grid-cols-3 gap-4 px-5 py-3 text-sm">
                <dt className="text-muted-foreground">{k}</dt>
                <dd className="col-span-2 break-words font-mono text-foreground">{v}</dd>
              </div>
            ))}
          </dl>

          <p className="mt-6 rounded-md border border-primary/30 bg-accent/40 p-4 text-xs leading-relaxed text-muted-foreground">
            <span className="font-semibold text-primary">Research use only. </span>
            {BRAND.disclaimer}
          </p>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-28">
          <h2 className="text-3xl font-semibold text-foreground">Related compounds</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => <ProductCard key={p.slug} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}

import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { VialImage } from "./VialImage";
import { formatPrice, isSoldOut, startingPrice, type Product } from "@/lib/products";
import { cn } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  const soldOut = isSoldOut(product);
  return (
    <Link
      to="/products/$slug"
      params={{ slug: product.slug }}
      className="group relative flex flex-col overflow-hidden rounded-lg border bg-card-gradient shadow-card transition-all duration-500 hover:-translate-y-1 hover:border-primary/50"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-background">
        <div className="grid h-full place-items-center bg-foreground">
          <VialImage
            name={product.name}
            liquid={product.slug === "lipo-c-b12"}
            alt={`${product.name} (${product.fullName}) ${product.purity} ${product.slug === "lipo-c-b12" ? "red liquid " : ""}research vial — Synthesia Labs, research use only`}
            className={cn(
              "h-full transition-transform duration-700 group-hover:scale-105",
              soldOut && "opacity-40 grayscale",
            )}
          />
        </div>
        {soldOut && (
          <div className="absolute inset-0 grid place-items-center">
            <span className="rounded-sm border border-border bg-background/80 px-4 py-2 font-display text-sm uppercase tracking-[0.25em] text-foreground backdrop-blur">
              Sold out
            </span>
          </div>
        )}
        <div className="absolute left-4 top-4 rounded-sm border border-primary/40 bg-background/70 px-2 py-1 font-display text-[10px] uppercase tracking-[0.2em] text-primary backdrop-blur">
          {product.category}
        </div>
        <div className="absolute bottom-4 right-4 font-display text-xs text-primary-glow">
          {product.purity}
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-xl font-semibold text-foreground">{product.name}</h3>
          <ArrowUpRight className="size-5 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
        </div>
        <p className="text-sm text-muted-foreground">{product.summary}</p>
        <div className="mt-auto flex items-baseline justify-between pt-4">
          <span className="font-mono text-xs text-muted-foreground">CAS {product.cas}</span>
          {soldOut ? (
            <span className="font-display text-sm text-muted-foreground">Sold out</span>
          ) : (
            <span className="font-display text-sm text-foreground">
              {product.compareAt && (
                <span className="mr-2 text-muted-foreground line-through">
                  {formatPrice(product.compareAt)}
                </span>
              )}
              from <span className="text-primary">{formatPrice(startingPrice(product))}</span>
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

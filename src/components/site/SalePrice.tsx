import { formatPrice } from "@/lib/products";
import { salePrice } from "@/lib/store-policy";
import { cn } from "@/lib/utils";

/** Old price crossed out next to the Black Friday price while the sale runs. */
export function SalePrice({ price, warehouse = false, className, oldClassName }: { price: number; warehouse?: boolean; className?: string; oldClassName?: string }) {
  const now = salePrice(price, warehouse);
  if (now === price) return <span className={className}>{formatPrice(price)}</span>;
  return (
    <span className="inline-flex flex-wrap items-baseline gap-x-2">
      <span className={cn("text-muted-foreground line-through decoration-destructive/70", oldClassName)}>{formatPrice(price)}</span>
      <span className={className}>{formatPrice(now)}</span>
    </span>
  );
}

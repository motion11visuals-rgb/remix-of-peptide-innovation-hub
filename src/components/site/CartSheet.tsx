import { Link } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { KitPhoto } from "@/components/site/KitPhoto";
import { VialImage } from "./VialImage";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useCart } from "@/lib/cart";
import { lineDetails } from "@/lib/cart-logic";
import { formatPrice } from "@/lib/products";

export function CartButton() {
  const { count, setOpen } = useCart();
  return (
    <button
      onClick={() => setOpen(true)}
      aria-label={`Open cart, ${count} items`}
      className="relative grid size-9 place-items-center rounded-md text-foreground transition-colors hover:bg-accent"
    >
      <ShoppingBag className="size-5" />
      {count > 0 && (
        <span className="absolute -right-1 -top-1 grid min-w-5 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
          {count}
        </span>
      )}
    </button>
  );
}

export function CartSheet() {
  const { lines, subtotal, open, setOpen, setQty } = useCart();
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="flex w-full flex-col border-l bg-background sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="font-display text-2xl text-foreground">Your cart</SheetTitle>
          <SheetDescription className="text-muted-foreground">Research use only. Not for human consumption.</SheetDescription>
        </SheetHeader>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
            <ShoppingBag className="size-10 text-muted-foreground" />
            <p className="text-muted-foreground">Your cart is empty.</p>
            <Button asChild variant="goldOutline" onClick={() => setOpen(false)}>
              <Link to="/products">Browse catalog</Link>
            </Button>
          </div>
        ) : (
          <>
            <ul className="-mx-6 flex-1 divide-y overflow-y-auto border-y px-6">
              {lines.map((l) => {
                const d = lineDetails(l);
                if (!d) return null;
                return (
                  <li key={`${l.slug}-${l.size}`} className="flex gap-4 py-4">
                    {d.kit ? (
                      <KitPhoto name={d.product.name} clear={d.clear} compact className="size-16 shrink-0 rounded-md border" />
                    ) : (
                      <VialImage name={d.product.name} liquid={d.liquid} className="size-16 shrink-0 overflow-hidden rounded-md border" />
                    )}
                    <div className="flex flex-1 flex-col">
                      <div className="flex justify-between gap-2">
                        <div>
                          <p className="font-display font-semibold text-foreground">{d.product.name}</p>
                          <p className="text-xs text-muted-foreground">{l.size} · {formatPrice(d.unitPrice)}</p>
                        </div>
                        <p className="font-display text-sm text-primary">{formatPrice(d.total)}</p>
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <div className="flex items-center rounded-md border">
                          <button
                            aria-label="Decrease quantity"
                            onClick={() => setQty(l.slug, l.size, l.qty - 1)}
                            className="grid size-8 place-items-center text-muted-foreground hover:text-foreground"
                          >
                            <Minus className="size-3.5" />
                          </button>
                          <span className="w-8 text-center text-sm text-foreground">{l.qty}</span>
                          <button
                            aria-label="Increase quantity"
                            onClick={() => setQty(l.slug, l.size, l.qty + 1)}
                            className="grid size-8 place-items-center text-muted-foreground hover:text-foreground"
                          >
                            <Plus className="size-3.5" />
                          </button>
                        </div>
                        <button
                          aria-label={`Remove ${d.product.name}`}
                          onClick={() => setQty(l.slug, l.size, 0)}
                          className="ml-auto text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
            <SheetFooter className="flex-col gap-4 sm:flex-col">
              <div className="flex items-baseline justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-display text-2xl font-semibold text-primary-glow">{formatPrice(subtotal)}</span>
              </div>
              <p className="text-xs text-muted-foreground">Pay by Zelle, PayPal or Cash App at checkout.</p>
              <Button asChild variant="gold" size="xl" className="w-full" onClick={() => setOpen(false)}>
                <Link to="/checkout">Checkout</Link>
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

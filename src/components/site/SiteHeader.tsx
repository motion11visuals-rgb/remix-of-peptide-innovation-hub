import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BRAND } from "@/lib/products";
import { CartButton } from "./CartSheet";
const mark = { url: "/images/synthesia_mark.png" };

const NAV = [
  { to: "/products", label: "Catalog" },
  { to: "/quality", label: "Quality & Testing" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <img src={mark.url} alt="Synthesia Labs logo" className="size-10 object-contain" />
      <span className="font-display text-lg font-semibold tracking-tight text-foreground">
        <span className="font-classic tracking-[0.12em]">SYNTHESIA</span>
        <span className="ml-1.5 font-classic font-normal tracking-[0.12em] text-primary">LABS</span>
      </span>
    </Link>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-xl">
      <div className="border-b bg-surface pt-3">
        <p className="mx-auto max-w-7xl px-6 py-1.5 text-center font-display text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          For laboratory research use only · Not for human consumption
        </p>
      </div>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Logo />
        <nav className="hidden items-center gap-8 md:flex">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "text-primary" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Button asChild variant="gold" size="sm" className="hidden md:inline-flex">
            <Link to="/products">Shop peptides</Link>
          </Button>
          <CartButton />
          <button
            className="text-foreground md:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>
      {open && (
        <nav className="flex flex-col gap-1 border-t px-6 py-4 md:hidden">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              onClick={() => setOpen(false)}
              className="py-2 text-base text-muted-foreground"
              activeProps={{ className: "text-primary" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}

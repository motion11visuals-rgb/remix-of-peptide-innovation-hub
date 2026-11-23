import { Link } from "@tanstack/react-router";
import { BRAND } from "@/lib/products";
import { BUSINESS_ADDRESS, POLICY_LINKS } from "@/lib/store-policy";
import { Logo } from "./SiteHeader";
import { INSTAGRAM_HANDLE, INSTAGRAM_URL, WHATSAPP_URL } from "./WhatsAppButton";

export function SiteFooter() {
  return (
    <footer className="mt-32 border-t bg-surface">
      <div aria-hidden className="greek-key h-3 w-full" />
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">
            Synthetic peptides supplied exclusively for controlled in vitro laboratory research.
          </p>
          <address className="mt-4 max-w-sm text-sm not-italic leading-relaxed text-muted-foreground">{BUSINESS_ADDRESS}</address>
        </div>
        <div>
          <h4 className="eyebrow">Explore</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/products" className="hover:text-foreground">Catalog</Link></li>
            <li><Link to="/quality" className="hover:text-foreground">Quality & Testing</Link></li>
            <li><Link to="/about" className="hover:text-foreground">About</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="eyebrow">Contact</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li><a href={`mailto:${BRAND.email}`} className="hover:text-foreground">{BRAND.email}</a></li>
            <li><Link to="/contact" className="hover:text-foreground">Send an inquiry</Link></li>
            <li>
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="hover:text-foreground">
                Instagram: {INSTAGRAM_HANDLE}
              </a>
            </li>
            <li>
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="hover:text-foreground">
                Text us on WhatsApp: +1 (786) 526-8228
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <p className="text-xs leading-relaxed text-muted-foreground">
            <strong className="text-foreground">For research use only. Not for human consumption.</strong>
          </p>
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
            Products are intended only for controlled in vitro laboratory research, not to diagnose, treat, cure, or prevent disease. This site does not provide medical advice.
          </p>
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
            <span className="font-semibold text-primary">Disclaimer: </span>
            {BRAND.disclaimer}
          </p>
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
            <span className="font-semibold text-primary">FDA Notice: </span>
            {BRAND.fdaDisclaimer}
          </p>
          <p className="mt-3 text-xs text-muted-foreground">© {new Date().getFullYear()} {BRAND.name}. All rights reserved.</p>
          <nav aria-label="Legal policies" className="mt-5 flex flex-wrap gap-x-5 gap-y-3 pb-12 text-xs text-muted-foreground">
            {POLICY_LINKS.map((link) => <Link key={link.to} to={link.to} className="underline-offset-4 hover:text-primary hover:underline">{link.label}</Link>)}
          </nav>
          {/* Extra space so the fixed social buttons never cover footer content. */}
          <div className="h-28" aria-hidden />
        </div>
      </div>
    </footer>
  );
}

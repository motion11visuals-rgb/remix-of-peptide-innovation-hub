import { siteUrl } from "@/lib/site-url";
import { Link } from "@tanstack/react-router";
import { BRAND } from "@/lib/products";
import type { PolicyContent } from "@/lib/policy-content";
import { POLICY_DATE, POLICY_LINKS } from "@/lib/store-policy";

export function policyHead(policy: PolicyContent, path: string) {
  const title = `${policy.title} — ${BRAND.name}`;
  return { meta: [
    { title },
    { name: "description", content: policy.description },
    { property: "og:title", content: title },
    { property: "og:description", content: policy.description },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ], links: [{ rel: "canonical", href: siteUrl(path) }] };
}

export function PolicyPage({ policy }: { policy: PolicyContent }) {
  return (
    <div className="mx-auto max-w-7xl px-6 pt-16">
      <p className="eyebrow">Synthesia Labs · Policies</p>
      <h1 className="mt-4 break-words text-3xl font-semibold text-foreground sm:text-5xl">{policy.title}</h1>
      <p className="mt-4 text-sm text-muted-foreground">Last updated {POLICY_DATE}</p>
      <div className="mt-10 grid gap-12 lg:grid-cols-[220px_minmax(0,1fr)]">
        <nav aria-label="Policies" className="flex flex-wrap gap-x-6 gap-y-3 border-y py-5 text-sm lg:flex-col lg:self-start lg:border-y-0 lg:border-l lg:pl-5">
          {POLICY_LINKS.map((link) => <Link key={link.to} to={link.to} className="text-muted-foreground hover:text-primary" activeProps={{ className: "font-semibold text-primary", "aria-current": "page" }}>{link.label}</Link>)}
        </nav>
        <article className="min-w-0 max-w-3xl space-y-9">
          {policy.sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-xl font-semibold text-foreground">{section.title}</h2>
              {section.paragraphs.map((text) => <p key={text} className="mt-3 text-sm leading-7 text-muted-foreground">{text}</p>)}
              {section.title === "Visitor analytics" && <a href="https://lovable.dev/privacy" target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-sm text-primary underline underline-offset-4">Lovable’s privacy policy</a>}
            </section>
          ))}
          <p className="border-t pt-6 text-sm text-muted-foreground">Questions? <a href={`mailto:${BRAND.email}`} className="break-all text-primary underline underline-offset-4">{BRAND.email}</a></p>
        </article>
      </div>
    </div>
  );
}
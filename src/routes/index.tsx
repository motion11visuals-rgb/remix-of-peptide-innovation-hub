import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, FlaskConical, ShieldCheck, Snowflake, Truck } from "lucide-react";
import hero from "@/assets/hero-vials.jpg";
import lab from "@/assets/lab-analysis.jpg";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/site/ProductCard";
import { PRODUCTS } from "@/lib/products";
import { ORDER_PROCESSING_LABEL } from "@/lib/store-policy";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Synthesia Labs — Research-Grade Synthetic Peptides" },
      {
        name: "description",
        content: "≥99% purity research peptides with facility Certificates of Analysis on request. Ships cold, fast.",
      },
      { property: "og:title", content: "Synthesia Labs — Research-Grade Synthetic Peptides" },
      {
        property: "og:description",
        content: "≥99% purity research peptides with facility Certificates of Analysis on request.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const STATS = [
  { value: "≥99%", label: "Typical HPLC purity" },
  { value: "100%", label: "COAs on request" },
  { value: ORDER_PROCESSING_LABEL, label: "Order processing" },
  { value: "−20°C", label: "Cold-chain storage" },
];

const PILLARS = [
  { icon: FlaskConical, title: "Verified synthesis", body: "Solid-phase synthesis with HPLC and mass spec confirmation on every batch." },
  { icon: ShieldCheck, title: "COAs on request", body: "Certificates of Analysis from the manufacturing facility — text us and we will send the one for your lot." },
  { icon: Snowflake, title: "Cold-chain handling", body: "Lyophilized and stored frozen until dispatch to preserve stability." },
  { icon: Truck, title: "Fast, discreet shipping", body: `Order processing takes ${ORDER_PROCESSING_LABEL} after payment verification and research eligibility review. Carrier transit time is additional.` },
];

function Index() {
  const featured = PRODUCTS.filter((p) => p.featured);
  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        <img
          src={hero}
          alt="Research peptide vials with gold caps"
          width={1672}
          height={941}
          className="absolute inset-0 -z-20 hidden h-full w-full object-cover object-right md:block"
        />
        <div className="absolute inset-0 -z-10 hidden bg-fade-left md:block" />
        <div className="absolute inset-0 -z-10 hidden bg-fade-bottom md:block" />
        <div className="mx-auto flex max-h-[900px] max-w-7xl flex-col justify-center px-6 py-16 md:min-h-[78vh] md:py-24">
          <p className="eyebrow animate-rise">Research-grade synthetic peptides</p>
          <h1 className="mt-6 max-w-2xl animate-rise text-5xl font-semibold leading-[1.02] text-foreground [animation-delay:100ms] md:text-7xl">
            Purity you can <span className="text-gold">measure.</span>
          </h1>
          <p className="mt-5 font-classic text-xl font-semibold text-primary md:text-2xl">Best prices. Best quality.</p>
          <p className="mt-6 max-w-lg animate-rise text-lg text-muted-foreground [animation-delay:200ms]">
            Precision-synthesized peptides for serious laboratories — facility Certificates of Analysis on request,
            and a full refund plus website credit if a test fails.
          </p>
          <div className="mt-10 flex animate-rise flex-wrap gap-3 [animation-delay:300ms]">
            <Button asChild variant="gold" size="xl">
              <Link to="/products">
                Browse catalog <ArrowRight />
              </Link>
            </Button>
            <Button asChild variant="goldOutline" size="xl">
              <Link to="/quality">View testing</Link>
            </Button>
          </div>
          <img
            src={hero}
            alt="Synthesia Labs research peptide vials with gold caps"
            width={1672}
            height={941}
            className="mt-12 w-full rounded-lg border object-cover md:hidden"
          />
        </div>
      </section>

      {/* Stats */}
      <section className="border-y bg-surface">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-border md:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="px-6 py-8 text-center">
              <div className="font-display text-3xl font-semibold text-primary-glow md:text-4xl">{s.value}</div>
              <div className="mt-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured grid */}
      <section className="mx-auto max-w-7xl px-6 pt-28">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow">Featured compounds</p>
            <h2 className="mt-3 text-4xl font-semibold text-foreground md:text-5xl">Most requested</h2>
            <p className="mt-4 font-classic text-lg font-semibold text-primary">Best prices. Best quality.</p>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">Every vial comes with laboratory-use directions and applicable COA information. For research use only.</p>
          </div>
          <Link to="/products" className="flex items-center gap-2 text-sm text-primary hover:text-primary-glow">
            Full catalog <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>

      {/* Pillars */}
      <section className="mx-auto mt-32 max-w-7xl px-6">
        <div className="grid overflow-hidden rounded-lg border lg:grid-cols-2">
          <div className="relative min-h-[360px]">
            <img
              src={lab}
              alt="Analyst holding a vial beside an HPLC instrument"
              loading="lazy"
              width={1536}
              height={1024}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
          <div className="grid-lines bg-surface p-10 md:p-14">
            <p className="eyebrow">The Synthesia standard</p>
            <h2 className="mt-3 text-3xl font-semibold text-foreground md:text-4xl">Built for reproducible research</h2>
            <div className="mt-10 grid gap-8 sm:grid-cols-2">
              {PILLARS.map((p) => (
                <div key={p.title}>
                  <p.icon className="size-6 text-primary" />
                  <h3 className="mt-3 text-base font-semibold text-foreground">{p.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{p.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto mt-32 max-w-4xl px-6 text-center">
        <h2 className="text-4xl font-semibold text-foreground md:text-5xl">
          Need bulk or custom <span className="text-gold">synthesis?</span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          Institutional pricing, custom sequences and lot reservations are available for research teams.
        </p>
        <Button asChild variant="gold" size="xl" className="mt-8">
          <Link to="/contact" search={{ product: undefined }}>Talk to our team</Link>
        </Button>
      </section>
    </>
  );
}

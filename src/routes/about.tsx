import { createFileRoute, Link } from "@tanstack/react-router";
import hero from "@/assets/hero-vials.jpg";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Synthesia Labs" },
      { name: "description", content: "Synthesia Labs supplies research laboratories with rigorously tested synthetic peptides." },
      { property: "og:title", content: "About — Synthesia Labs" },
      { property: "og:description", content: "Our mission: transparent, reproducible peptide supply for research." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: About,
});

const VALUES = [
  { title: "Transparency", body: "Lot-level data for every vial. If we can't prove it, we don't ship it." },
  { title: "Consistency", body: "Tight specifications so results replicate from one order to the next." },
  { title: "Responsibility", body: "We supply qualified researchers only, and every product is labeled for research use." },
];

function About() {
  return (
    <div className="mx-auto max-w-7xl px-6 pt-20">
      <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="eyebrow">About us</p>
          <h1 className="mt-4 text-5xl font-semibold text-foreground md:text-6xl">
            Supplying science with <span className="text-gold">certainty.</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            Synthesia Labs was founded by analytical chemists frustrated by inconsistent peptide quality. We built the supplier
            we wanted: verified compounds, honest documentation and responsive support.
          </p>
          <Button asChild variant="gold" size="xl" className="mt-8">
            <Link to="/products">Explore the catalog</Link>
          </Button>
        </div>
        <div className="overflow-hidden rounded-lg border">
          <img src={hero} alt="Synthesia Labs peptide vials" width={1672} height={941} className="aspect-[4/3] w-full object-cover object-right" />
        </div>
      </div>
      <div className="mt-28 grid gap-6 md:grid-cols-3">
        {VALUES.map((v, i) => (
          <div key={v.title} className="rounded-lg border bg-card-gradient p-8 shadow-card">
            <span className="font-display text-sm text-primary">0{i + 1}</span>
            <h2 className="mt-4 text-2xl font-semibold text-foreground">{v.title}</h2>
            <p className="mt-2 text-muted-foreground">{v.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

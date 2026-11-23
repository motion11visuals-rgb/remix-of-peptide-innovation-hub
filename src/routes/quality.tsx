import { createFileRoute, Link } from "@tanstack/react-router";
import { MessageCircle } from "lucide-react";
import lab from "@/assets/lab-analysis.jpg";
import { WHATSAPP_URL } from "@/components/site/WhatsAppButton";
import { BRAND } from "@/lib/products";
import { QUALITY_REFUND_CREDIT } from "@/lib/store-policy";

export const Route = createFileRoute("/quality")({
  head: () => ({
    meta: [
      { title: "Quality & Testing — Synthesia Labs" },
      {
        name: "description",
        content:
          "Facility Certificates of Analysis on request, independent testing welcome, and a full refund plus website credit if a peptide fails.",
      },
      { property: "og:title", content: "Quality & Testing — Synthesia Labs" },
      {
        property: "og:description",
        content:
          "COAs from the manufacturing facility on request. Test it yourself — full refund plus website credit if anything fails.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Quality,
});

const STEPS = [
  {
    n: "01",
    title: "Synthesis",
    body: "Fmoc solid-phase peptide synthesis under controlled conditions, followed by cleavage and preparative purification.",
  },
  {
    n: "02",
    title: "HPLC purity",
    body: "Reverse-phase HPLC quantifies purity for every lot. Lots below specification are rejected, never blended.",
  },
  {
    n: "03",
    title: "Mass spectrometry",
    body: "ESI-MS confirms molecular identity against the theoretical mass of the target sequence.",
  },
  {
    n: "04",
    title: "Certificate of Analysis",
    body: "The facility that makes each lot issues its own COA — purity, observed mass, appearance and lot number. Text us and we will send it to you before you order.",
  },
  {
    n: "05",
    title: "Lyophilization & sealing",
    body: "Freeze-dried, nitrogen-flushed and crimp-sealed, then stored at −20°C until dispatch.",
  },
];

function Quality() {
  return (
    <>
      <section className="relative isolate overflow-hidden">
        <img
          src={lab}
          alt="Laboratory analysis"
          width={1536}
          height={1024}
          className="absolute inset-0 -z-20 hidden h-full w-full object-cover md:block"
        />
        <div className="absolute inset-0 -z-10 hidden bg-fade-left md:block" />
        <div className="absolute inset-0 -z-10 hidden bg-fade-bottom md:block" />
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-32">
          <p className="eyebrow">Quality & testing</p>
          <h1 className="mt-4 max-w-2xl text-5xl font-semibold text-foreground md:text-6xl">
            Good product, <span className="text-gold">honest price.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            We hold Certificates of Analysis from the facility each lot comes from, and we know the
            product is good quality. We keep prices as low as possible instead of paying for extra
            testing layers and passing that cost on to you — so if you want the COA, just text us
            and we will send it over.
          </p>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-whatsapp px-5 py-3 font-display text-sm font-semibold text-whatsapp-foreground shadow-lg transition-transform hover:scale-105"
          >
            <MessageCircle className="size-5" />
            Text us for a COA
          </a>
          <img
            src={lab}
            alt="Synthesia Labs laboratory analysis bench"
            width={1536}
            height={1024}
            className="mt-12 w-full rounded-lg border object-cover md:hidden"
          />
        </div>
      </section>

      <section className="mx-auto mt-20 grid max-w-7xl gap-16 px-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <h2 className="text-3xl font-semibold text-foreground">How each lot is made</h2>
          <ol className="mt-10 space-y-8">
            {STEPS.map((s) => (
              <li key={s.n} className="grid grid-cols-[4rem_1fr] gap-4 border-t pt-6">
                <span className="font-display text-2xl text-primary">{s.n}</span>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{s.title}</h3>
                  <p className="mt-1 text-muted-foreground">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <aside className="lg:col-span-2">
          <div className="sticky top-32 rounded-lg border bg-card-gradient p-8 shadow-card">
            <p className="eyebrow">Your lot documentation</p>
            <h3 className="mt-2 text-2xl font-semibold text-foreground">Certificate of Analysis</h3>
            <p className="mt-6 text-sm text-muted-foreground">
              Every vial comes with laboratory-use directions and applicable COA information. All
              directions are strictly for laboratory research, not human or animal use.
            </p>
            <p className="mt-6 text-xs text-muted-foreground">
              COAs are issued by the manufacturing facility for each lot. They are available on
              request — text us on WhatsApp with the peptide and size you want, and we will send the
              COA for that lot before you order.
            </p>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 font-display text-sm font-semibold text-primary hover:text-primary-glow"
            >
              <MessageCircle className="size-4" /> Request a COA on WhatsApp
            </a>
          </div>
        </aside>
      </section>

      <section className="mx-auto mt-24 max-w-7xl px-6">
        <div className="rounded-lg border bg-surface p-10 md:p-14">
          <p className="eyebrow">Verify it yourself</p>
          <h2 className="mt-3 max-w-2xl text-3xl font-semibold text-foreground md:text-4xl">
            Send it to your own lab. If it fails, we make it right.
          </h2>
          <p className="mt-5 max-w-2xl text-muted-foreground">
            You are welcome to have any vial tested by the laboratory of your choice — that is the
            best way to confirm what you are getting. If a peptide arrives cloudy, or an independent
            test fails against the specification on its COA, send us the photos or the lab report
            and we refund that peptide in full and add ${QUALITY_REFUND_CREDIT} in website credit.
          </p>{" "}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-whatsapp px-5 py-3 font-display text-sm font-semibold text-whatsapp-foreground shadow-lg transition-transform hover:scale-105"
            >
              <MessageCircle className="size-5" />
              Text us on WhatsApp
            </a>
            <a
              href={`mailto:${BRAND.email}`}
              className="font-display text-sm font-semibold text-primary hover:text-primary-glow"
            >
              or email {BRAND.email}
            </a>
          </div>
          <p className="mt-6 text-xs text-muted-foreground">
            Refunds and credit are reviewed by our team against the evidence you provide; see our{" "}
            <Link to="/return-policy" className="underline underline-offset-4 hover:text-primary">
              Return Policy
            </Link>{" "}
            for how a claim works. Products are for controlled in vitro laboratory research only.
          </p>
        </div>
      </section>
    </>
  );
}

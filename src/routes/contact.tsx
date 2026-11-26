import { siteUrl } from "@/lib/site-url";
import { createFileRoute } from "@tanstack/react-router";
import { Mail, MessageCircle, Clock } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { BRAND } from "@/lib/products";
import { WHATSAPP_URL } from "@/components/site/WhatsAppButton";

type ContactSearch = { product?: string | undefined };

export const Route = createFileRoute("/contact")({
  validateSearch: (search: Record<string, unknown>): ContactSearch => ({
    product: typeof search["product"] === "string" ? search["product"] : undefined,
  }),
  staticData: { sitemap: true },
  head: () => ({
    meta: [
      { title: "Contact & Orders — Synthesia Labs" },
      { name: "description", content: "Request an order, bulk pricing or custom synthesis from Synthesia Labs." },
      { property: "og:title", content: "Contact & Orders — Synthesia Labs" },
      { property: "og:description", content: "Order requests, institutional pricing and custom synthesis." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: siteUrl("/contact") }],
  }),
  component: Contact,
});

function Contact() {
  const { product } = Route.useSearch();
  const [agreed, setAgreed] = useState(false);
  const [org, setOrg] = useState("");


  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!agreed) {
      toast.error("Please confirm research-use-only terms.");
      return;
    }
    toast.success("Request received", { description: "Our team will reply within one business day." });
    e.currentTarget.reset();
    setAgreed(false);
  }

  return (
    <div className="mx-auto grid max-w-7xl gap-16 px-6 pt-20 lg:grid-cols-5">
      <div className="lg:col-span-2">
        <p className="eyebrow">Contact & orders</p>
        <h1 className="mt-4 text-5xl font-semibold text-foreground">Let's talk research.</h1>
        <p className="mt-6 text-muted-foreground">
          Order requests, bulk pricing, custom sequences or COA questions — we usually reply within one business day.
        </p>
        <div className="mt-10 space-y-4 text-sm">
          <a href={`mailto:${BRAND.email}`} className="flex items-center gap-3 text-foreground hover:text-primary">
            <Mail className="size-5 text-primary" /> {BRAND.email}
          </a>
          <p className="flex items-center gap-3 text-muted-foreground">
            <Clock className="size-5 text-primary" /> Mon–Fri, 9am–6pm ET
          </p>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-foreground hover:text-primary"
          >
            <MessageCircle className="size-5 text-whatsapp" /> WhatsApp: +1 (786) 526-8228
          </a>
        </div>
      </div>
      <form onSubmit={onSubmit} className="space-y-5 rounded-lg border bg-card-gradient p-8 shadow-card lg:col-span-3">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="org">Institution / Lab</Label>
          <Input id="org" name="org" value={org} onChange={(e) => setOrg(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="product">Order details</Label>
          <Textarea id="product" name="product" rows={3} defaultValue={product ?? ""} placeholder="e.g. BPC-157 10 mg × 5" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="message">Message</Label>
          <Textarea id="message" name="message" rows={5} required />
        </div>
        <label className="flex items-start gap-3 text-sm text-muted-foreground">
          <Checkbox checked={agreed} onCheckedChange={(v) => setAgreed(v === true)} className="mt-0.5" />
          I confirm these products are for laboratory research use only and not for human consumption.
        </label>
        <Button type="submit" variant="gold" size="xl" className="w-full">
          Send request
        </Button>
      </form>
    </div>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Check, CheckCircle2, Copy, ImageUp, Loader2, ShieldCheck, X } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { VialImage } from "@/components/site/VialImage";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/lib/cart";
import { lineDetails } from "@/lib/cart-logic";
import { generateOrderRef, validateProof } from "@/lib/order-logic";
import { submitOrder } from "@/lib/orders.functions";
import { PAYMENT_METHODS, type PaymentMethodId } from "@/lib/payments";
import { BRAND, formatPrice } from "@/lib/products";
import { AFFILIATIONS, readGateRecord } from "@/lib/research-gate";
import { cn } from "@/lib/utils";
import {
  orderTotals,
  POLICY_VERSION,
  ORDER_PROCESSING_LABEL,
  SHIPPING_FLAT_RATE,
  FREE_SHIPPING_THRESHOLD,
} from "@/lib/store-policy";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — Synthesia Labs" },
      {
        name: "description",
        content: "Complete your research peptide order with Zelle, PayPal or Cash App.",
      },
      { property: "og:title", content: "Checkout — Synthesia Labs" },
      {
        property: "og:description",
        content: "Pay by Zelle, PayPal or Cash App and upload your payment confirmation.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Checkout,
});

function CopyField({ value, display }: { value: string; display: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch {
          toast.error("Couldn't copy — please copy it manually.");
        }
      }}
      className="flex w-full items-center justify-between gap-3 rounded-md border border-primary/40 bg-background px-4 py-3 text-left transition-colors hover:border-primary"
    >
      <span className="font-display text-lg font-semibold text-primary-glow">{display}</span>
      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
        {copied ? <Check className="size-4 text-primary" /> : <Copy className="size-4" />}
        {copied ? "Copied" : "Copy"}
      </span>
    </button>
  );
}

function Checkout() {
  const cart = useCart();
  const send = useServerFn(submitOrder);
  const [orderRef, setOrderRef] = useState("");
  const [method, setMethod] = useState<PaymentMethodId>("zelle");
  const [proof, setProof] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [agreed, setAgreed] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [org, setOrg] = useState("");
  const [affiliation, setAffiliation] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<{ orderRef: string; total: number; method: string } | null>(
    null,
  );
  const totals = orderTotals(cart.subtotal);
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setOrderRef(generateOrderRef());
    const gate = readGateRecord();
    if (gate) {
      setOrg(gate.organization);
      const label = AFFILIATIONS.find((a) => a.value === gate.affiliation)?.label ?? "";
      setAffiliation(
        gate.affiliation === "other" && gate.otherDetail ? `Other: ${gate.otherDetail}` : label,
      );
    }
  }, []);

  useEffect(() => {
    if (!proof) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(proof);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [proof]);

  const selected = PAYMENT_METHODS.find((m) => m.id === method) ?? PAYMENT_METHODS[0];
  if (!selected) return null;

  function onPickFile(file: File | undefined) {
    if (!file) return;
    const err = validateProof(file);
    if (err) {
      toast.error(err);
      return;
    }
    setProof(file);
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selected) return;
    if (!agreed) {
      toast.error("Please accept the research-use-only terms.");
      return;
    }
    if (!termsAgreed) {
      toast.error("Please accept the terms and store policies.");
      return;
    }
    const proofErr = validateProof(proof);
    if (proofErr || !proof) {
      toast.error(proofErr ?? "Upload your payment screenshot.");
      return;
    }

    const fd = new FormData(e.currentTarget);
    fd.set("orderRef", orderRef);
    fd.set("paymentMethod", method);
    fd.set("researchOnly", "true");
    fd.set("termsAccepted", "true");
    fd.set("policyVersion", POLICY_VERSION);
    fd.set("items", JSON.stringify(cart.lines));
    fd.set("proof", proof);

    setSubmitting(true);
    try {
      const res = await send({ data: fd });
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      setDone({ orderRef: res.orderRef, total: res.total, method: selected.label });
      cart.clear();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong sending your order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="mx-auto max-w-xl px-6 pt-24 text-center">
        <CheckCircle2 className="mx-auto size-14 text-primary" />
        <h1 className="mt-6 text-4xl font-semibold text-foreground">Order received</h1>
        <p className="mt-4 text-muted-foreground">
          Thanks! We'll verify your {done.method} payment of{" "}
          <span className="text-foreground">{formatPrice(done.total)}</span>, including shipping and
          the processing fee. This receipt does not confirm payment settlement.
        </p>
        <div className="mx-auto mt-8 inline-block rounded-lg border bg-card-gradient px-8 py-5 shadow-card">
          <p className="eyebrow">Order reference</p>
          <p className="mt-2 font-display text-3xl font-semibold text-primary-glow">
            {done.orderRef}
          </p>
        </div>
        <p className="mt-6 text-sm text-muted-foreground">
          Keep this reference for any questions about your order.
        </p>
        <Button asChild variant="goldOutline" size="lg" className="mt-8">
          <Link to="/products">Back to catalog</Link>
        </Button>
      </div>
    );
  }

  if (cart.ready && cart.lines.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-6 pt-24 text-center">
        <h1 className="text-4xl font-semibold text-foreground">Your cart is empty</h1>
        <p className="mt-4 text-muted-foreground">
          Add some compounds to your cart before checking out.
        </p>
        <Button asChild variant="gold" size="lg" className="mt-8">
          <Link to="/products">Browse catalog</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 pt-16">
      <p className="eyebrow">Checkout</p>
      <h1 className="mt-3 text-5xl font-semibold text-foreground">Complete your order</h1>

      <form onSubmit={onSubmit} className="mt-12 grid gap-12 lg:grid-cols-5">
        <div className="space-y-10 lg:col-span-3">
          {/* Step 1 */}
          <section>
            <h2 className="flex items-center gap-3 text-xl font-semibold text-foreground">
              <span className="grid size-7 place-items-center rounded-full bg-gold text-sm text-primary-foreground">
                1
              </span>
              Your details
            </h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="customerName">Full name</Label>
                <Input id="customerName" name="customerName" required autoComplete="name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required autoComplete="email" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone (optional)</Label>
                <Input id="phone" name="phone" type="tel" autoComplete="tel" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="organization">Institution / lab</Label>
                <Input
                  id="organization"
                  name="organization"
                  required
                  value={org}
                  onChange={(e) => setOrg(e.target.value)}
                />
              </div>
              <input type="hidden" name="affiliation" value={affiliation} />
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="address">Shipping address</Label>
                <Input id="address" name="address" required autoComplete="street-address" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" name="city" required autoComplete="address-level2" />
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input id="state" name="state" required autoComplete="address-level1" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zip">ZIP</Label>
                  <Input id="zip" name="zip" required autoComplete="postal-code" />
                </div>
              </div>
            </div>
          </section>

          {/* Step 2 */}
          <section>
            <h2 className="flex items-center gap-3 text-xl font-semibold text-foreground">
              <span className="grid size-7 place-items-center rounded-full bg-gold text-sm text-primary-foreground">
                2
              </span>
              Send your payment
            </h2>
            <div
              className="mt-6 grid grid-cols-3 gap-3"
              role="radiogroup"
              aria-label="Payment method"
            >
              {PAYMENT_METHODS.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  role="radio"
                  aria-checked={method === m.id}
                  onClick={() => setMethod(m.id)}
                  className={cn(
                    "rounded-md border px-4 py-4 font-display text-base font-semibold transition-colors",
                    method === m.id
                      ? "border-primary bg-accent text-primary-glow"
                      : "text-muted-foreground hover:border-primary/50 hover:text-foreground",
                  )}
                >
                  {m.label}
                </button>
              ))}
            </div>
            <div className="mt-5 rounded-lg border bg-card-gradient p-6 shadow-card">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                {selected.handleLabel}
              </p>
              <div className="mt-2">
                <CopyField value={selected.copyValue} display={selected.handle} />
              </div>
              <div className="mt-5 flex flex-col items-center gap-2">
                <img
                  src={selected.qr}
                  alt={`${selected.label} QR code`}
                  className="w-56 max-w-full rounded-md border bg-background p-2"
                />
                <p className="text-xs text-muted-foreground">Scan with your {selected.label} app</p>
              </div>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    Amount
                  </p>
                  <p className="mt-1 font-display text-2xl font-semibold text-foreground">
                    {formatPrice(totals.total)}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Includes {formatPrice(totals.shipping)} shipping and{" "}
                    {formatPrice(totals.processingFee)} processing fee
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    Memo / note
                  </p>
                  <p className="mt-1 font-display text-2xl font-semibold text-primary">
                    {orderRef || "…"}
                  </p>
                </div>
              </div>
              <ol className="mt-5 list-decimal space-y-1 pl-5 text-sm text-muted-foreground">
                {selected.steps.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ol>
              <div className="mt-5 space-y-2">
                <Label htmlFor="paymentName">
                  Name on your {selected.label} account (optional)
                </Label>
                <Input
                  id="paymentName"
                  name="paymentName"
                  placeholder="Helps us match your payment"
                />
              </div>
            </div>
          </section>

          {/* Step 3 */}
          <section>
            <h2 className="flex items-center gap-3 text-xl font-semibold text-foreground">
              <span className="grid size-7 place-items-center rounded-full bg-gold text-sm text-primary-foreground">
                3
              </span>
              Upload your payment screenshot
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Take a screenshot of the completed payment showing the amount and recipient.
            </p>
            <input
              ref={fileInput}
              id="proof"
              type="file"
              accept="image/png,image/jpeg,image/webp,image/heic,image/heif"
              className="sr-only"
              aria-label="Payment screenshot"
              onChange={(e) => onPickFile(e.target.files?.[0])}
            />
            {proof && preview ? (
              <div className="mt-5 flex items-center gap-5 rounded-lg border bg-surface p-4">
                <img
                  src={preview}
                  alt="Payment screenshot preview"
                  className="h-28 w-20 rounded-md border object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-foreground">{proof.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(proof.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  <button
                    type="button"
                    onClick={() => fileInput.current?.click()}
                    className="mt-2 text-sm text-primary hover:text-primary-glow"
                  >
                    Replace
                  </button>
                </div>
                <button
                  type="button"
                  aria-label="Remove screenshot"
                  onClick={() => {
                    setProof(null);
                    if (fileInput.current) fileInput.current.value = "";
                  }}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <X className="size-5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInput.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  onPickFile(e.dataTransfer.files[0]);
                }}
                className="mt-5 flex w-full flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-primary/30 bg-surface px-6 py-10 text-center transition-colors hover:border-primary/60"
              >
                <ImageUp className="size-8 text-primary" />
                <span className="text-sm text-foreground">
                  Click to upload or drag your screenshot here
                </span>
                <span className="text-xs text-muted-foreground">
                  PNG, JPG, WEBP or HEIC · up to 10 MB
                </span>
              </button>
            )}
            <div className="mt-5 space-y-2">
              <Label htmlFor="notes">Order notes (optional)</Label>
              <Textarea id="notes" name="notes" rows={3} />
            </div>
          </section>
        </div>

        {/* Summary */}
        <aside className="lg:col-span-2">
          <div className="sticky top-32 rounded-lg border bg-card-gradient p-6 shadow-card">
            <h2 className="text-xl font-semibold text-foreground">Order summary</h2>
            <ul className="mt-5 divide-y">
              {cart.lines.map((l) => {
                const d = lineDetails(l);
                if (!d) return null;
                return (
                  <li key={`${l.slug}-${l.size}`} className="flex items-center gap-3 py-3">
                    <VialImage
                      name={d.product.name}
                      liquid={d.product.slug === "lipo-c-b12"}
                      className="size-12 shrink-0 overflow-hidden rounded-md border"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-foreground">{d.product.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {l.size} × {l.qty}
                      </p>
                    </div>
                    <p className="text-sm text-foreground">{formatPrice(d.total)}</p>
                  </li>
                );
              })}
            </ul>
            <dl className="mt-4 space-y-3 border-t pt-4 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Merchandise subtotal</dt>
                <dd>{formatPrice(totals.subtotal)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Processing fee</dt>
                <dd>{formatPrice(totals.processingFee)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Shipping</dt>
                <dd>{totals.shipping === 0 ? "Free" : formatPrice(totals.shipping)}</dd>
              </div>
            </dl>
            <p className="mt-3 text-xs text-muted-foreground">
              {formatPrice(SHIPPING_FLAT_RATE)} flat-rate shipping · Free on merchandise orders over
              ${FREE_SHIPPING_THRESHOLD}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              Processing: {ORDER_PROCESSING_LABEL} after payment verification and research
              eligibility review. Carrier transit time is additional.
            </p>
            <div className="mt-4 flex items-baseline justify-between border-t pt-4">
              <span className="text-muted-foreground">Total</span>
              <span className="font-display text-3xl font-semibold text-primary-glow">
                {formatPrice(totals.total)}
              </span>
            </div>
            <label className="mt-6 flex items-start gap-3 text-xs leading-relaxed text-muted-foreground">
              <Checkbox
                checked={agreed}
                onCheckedChange={(v) => setAgreed(v === true)}
                className="mt-0.5"
                aria-label="Accept research use only terms"
              />
              I confirm this order is for laboratory research use only. {BRAND.disclaimer}
            </label>
            <div className="mt-4 flex items-start gap-3 text-xs leading-relaxed text-muted-foreground">
              <Checkbox
                id="store-terms"
                checked={termsAgreed}
                onCheckedChange={(value) => setTermsAgreed(value === true)}
                aria-label="Accept terms and store policies"
                className="mt-0.5"
              />
              <div>
                <label htmlFor="store-terms">I agree to the </label>
                <Link to="/terms" target="_blank" rel="noopener" className="text-primary underline">
                  Terms & Conditions
                </Link>
                ,{" "}
                <Link
                  to="/research-use-only"
                  target="_blank"
                  rel="noopener"
                  className="text-primary underline"
                >
                  Research Use Only Policy
                </Link>
                ,{" "}
                <Link
                  to="/shipping-policy"
                  target="_blank"
                  rel="noopener"
                  className="text-primary underline"
                >
                  Shipping Policy
                </Link>
                , and{" "}
                <Link
                  to="/return-policy"
                  target="_blank"
                  rel="noopener"
                  className="text-primary underline"
                >
                  Return Policy
                </Link>
                , and acknowledge the{" "}
                <Link
                  to="/privacy-policy"
                  target="_blank"
                  rel="noopener"
                  className="text-primary underline"
                >
                  Privacy Policy
                </Link>
                .
              </div>
            </div>
            <Button
              type="submit"
              variant="gold"
              size="xl"
              className="mt-6 w-full"
              disabled={submitting || !orderRef}
            >
              {submitting ? <Loader2 className="animate-spin" /> : <ShieldCheck />}
              {submitting ? "Submitting…" : "Submit order"}
            </Button>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              Orders are processed in {ORDER_PROCESSING_LABEL} after payment verification and
              research eligibility review.
            </p>
          </div>
        </aside>
      </form>
    </div>
  );
}

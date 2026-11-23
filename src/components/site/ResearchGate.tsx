import { FlaskConical } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { BRAND } from "@/lib/products";
import {
  AFFILIATIONS,
  GATE_STORAGE_KEY,
  isGateValid,
  readGateRecord,
  validateGate,
  type GateErrors,
  type GateInput,
  type GateRecord,
} from "@/lib/research-gate";
import { cn } from "@/lib/utils";
import { subscribeMarketing } from "@/lib/marketing.functions";
import { Link, useLocation } from "@tanstack/react-router";
import { isPolicyPath } from "@/lib/store-policy";

const EMPTY: GateInput = {
  affiliation: "",
  otherDetail: "",
  organization: "",
  isAdult: false,
  researchOnly: false,
};

export function ResearchGate() {
  const pathname = useLocation({ select: (location) => location.pathname });
  const policyPage = isPolicyPath(pathname);
  const [show, setShow] = useState(false);
  const [form, setForm] = useState<GateInput>(EMPTY);
  const [errors, setErrors] = useState<GateErrors>({});
  const [promoEmail, setPromoEmail] = useState("");
  const [promoOptIn, setPromoOptIn] = useState(false);
  const [promoError, setPromoError] = useState("");

  useEffect(() => {
    if (!isGateValid(readGateRecord(), Date.now())) setShow(true);
  }, []);

  useEffect(() => {
    if (!show || policyPage) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [show, policyPage]);

  if (!show || policyPage) return null;

  function update<K extends keyof GateInput>(key: K, value: GateInput[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const errs = validateGate(form);
    setErrors(errs);
    const wantsPromo = promoOptIn || promoEmail.trim() !== "";
    if (wantsPromo && (!promoOptIn || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(promoEmail.trim()))) {
      setPromoError(
        !promoOptIn ? "Tick the box to receive deals, or clear the email." : "Enter a valid email.",
      );
      return;
    }
    if (Object.keys(errs).length > 0 || !form.affiliation) return;
    if (wantsPromo) {
      void subscribeMarketing({
        data: { email: promoEmail.trim(), organization: form.organization },
      }).catch(() => {});
    }
    const record: GateRecord = {
      affiliation: form.affiliation,
      organization: form.organization.trim(),
      acceptedAt: Date.now(),
      ...(form.affiliation === "other" ? { otherDetail: form.otherDetail.trim() } : {}),
    };
    window.localStorage.setItem(GATE_STORAGE_KEY, JSON.stringify(record));
    setShow(false);
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="gate-title"
      className="fixed inset-0 z-[100] grid place-items-center overflow-y-auto bg-background/90 p-4 backdrop-blur-md"
    >
      <form
        onSubmit={onSubmit}
        noValidate
        className="my-8 w-full max-w-xl animate-rise rounded-lg border bg-card-gradient p-6 shadow-card sm:p-8"
      >
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-md bg-gold text-primary-foreground">
            <FlaskConical className="size-5" />
          </span>
          <p className="eyebrow">Researcher verification</p>
        </div>
        <h2 id="gate-title" className="mt-4 text-3xl font-semibold text-foreground">
          Welcome to {BRAND.name}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Our products are supplied exclusively for laboratory research. Please tell us who you're
          with before entering.
        </p>

        <fieldset className="mt-6">
          <legend className="text-sm font-medium text-foreground">I'm affiliated with a…</legend>
          <RadioGroup
            value={form.affiliation}
            onValueChange={(v) => update("affiliation", v as GateInput["affiliation"])}
            className="mt-3 grid gap-2 sm:grid-cols-2"
          >
            {AFFILIATIONS.map((a) => (
              <Label
                key={a.value}
                htmlFor={`aff-${a.value}`}
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-md border px-3 py-3 text-sm font-normal leading-snug text-foreground transition-colors hover:border-primary/50",
                  form.affiliation === a.value && "border-primary bg-accent",
                )}
              >
                <RadioGroupItem id={`aff-${a.value}`} value={a.value} />
                {a.label}
              </Label>
            ))}
          </RadioGroup>
          {errors.affiliation && (
            <p className="mt-2 text-xs text-destructive">{errors.affiliation}</p>
          )}
        </fieldset>

        {form.affiliation === "other" && (
          <div className="mt-4 space-y-2">
            <Label htmlFor="gate-other">Please describe</Label>
            <Input
              id="gate-other"
              value={form.otherDetail}
              onChange={(e) => update("otherDetail", e.target.value)}
              placeholder="e.g. Veterinary school, hospital research department"
              autoFocus
            />
            {errors.otherDetail && <p className="text-xs text-destructive">{errors.otherDetail}</p>}
          </div>
        )}

        <div className="mt-4 space-y-2">
          <Label htmlFor="gate-org">Institution / lab / company name</Label>
          <Input
            id="gate-org"
            value={form.organization}
            onChange={(e) => update("organization", e.target.value)}
            placeholder="e.g. Stanford Dept. of Biochemistry"
          />
          {errors.organization && <p className="text-xs text-destructive">{errors.organization}</p>}
        </div>

        <div className="mt-6 space-y-3">
          <label className="flex items-start gap-3 text-sm text-muted-foreground">
            <Checkbox
              checked={form.isAdult}
              onCheckedChange={(v) => update("isAdult", v === true)}
              className="mt-0.5"
              aria-label="I am 21 or older"
            />
            I am 21 years of age or older.
          </label>
          {errors.isAdult && <p className="text-xs text-destructive">{errors.isAdult}</p>}
          <label className="flex items-start gap-3 text-sm text-muted-foreground">
            <Checkbox
              checked={form.researchOnly}
              onCheckedChange={(v) => update("researchOnly", v === true)}
              className="mt-0.5"
              aria-label="I agree to research use only terms"
            />
            I understand all products are for laboratory research use only, not for human or
            veterinary use, and not for consumption.
          </label>
          {errors.researchOnly && <p className="text-xs text-destructive">{errors.researchOnly}</p>}
        </div>

        <div className="mt-6 space-y-2 rounded-md border border-primary/30 p-4">
          <Label htmlFor="gate-promo">Email (optional)</Label>
          <Input
            id="gate-promo"
            type="email"
            value={promoEmail}
            onChange={(e) => {
              setPromoEmail(e.target.value);
              setPromoError("");
            }}
            placeholder="you@lab.com"
          />
          <label className="flex items-start gap-3 text-sm text-muted-foreground">
            <Checkbox
              checked={promoOptIn}
              onCheckedChange={(v) => {
                setPromoOptIn(v === true);
                setPromoError("");
              }}
              className="mt-0.5"
              aria-label="Send me deals and new peptides"
            />
            Send me deals and new peptide announcements. Unsubscribe anytime.
          </label>
          {promoError && <p className="text-xs text-destructive">{promoError}</p>}
        </div>

        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button asChild variant="ghost" className="text-muted-foreground">
            <a href="https://www.google.com" rel="noopener">
              Leave site
            </a>
          </Button>
          <Button type="submit" variant="gold" size="lg">
            Enter site
          </Button>
        </div>
        <p className="mt-5 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
          <Link to="/privacy-policy" className="underline underline-offset-4">
            Privacy Policy
          </Link>
          <Link to="/terms" className="underline underline-offset-4">
            Terms & Conditions
          </Link>
          <Link to="/research-use-only" className="underline underline-offset-4">
            Research Use Only Policy
          </Link>
        </p>
      </form>
    </div>
  );
}

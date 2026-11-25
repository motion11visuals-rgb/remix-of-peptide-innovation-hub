import { ArrowRight } from "lucide-react";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { BRAND } from "@/lib/products";
import { GATE_STORAGE_KEY, isGateValid, readGateRecord, validateGate, type GateErrors, type GateInput } from "@/lib/research-gate";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "@tanstack/react-router";
import { isPolicyPath } from "@/lib/store-policy";

export function ResearchGate() {
  const pathname = useLocation({ select: (location) => location.pathname });
  const policyPage = isPolicyPath(pathname) || pathname === "/auth" || pathname.startsWith("/admin");
  const [show, setShow] = useState(false);
  const [form, setForm] = useState<GateInput>({ isAdult: false, researchOnly: false });
  const [errors, setErrors] = useState<GateErrors>({});

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

  function toggle(key: keyof GateInput, value: boolean) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const errs = validateGate(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    window.localStorage.setItem(GATE_STORAGE_KEY, JSON.stringify({ acceptedAt: Date.now() }));
    setShow(false);
  }

  const box = (key: keyof GateInput, label: string, children: ReactNode) => (
    <div>
      <label
        className={cn(
          "flex cursor-pointer items-start gap-3 rounded-xl border bg-card px-4 py-4 text-sm leading-relaxed text-foreground transition-colors hover:border-primary/50",
          form[key] && "border-primary bg-accent",
        )}
      >
        <Checkbox checked={form[key]} onCheckedChange={(v) => toggle(key, v === true)} className="mt-0.5" aria-label={label} />
        <span>{children}</span>
      </label>
      {errors[key] && <p className="mt-1 text-xs text-destructive">{errors[key]}</p>}
    </div>
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="gate-title"
      className="fixed inset-0 z-[100] grid place-items-center overflow-y-auto bg-background/95 p-4 backdrop-blur-md"
    >
      <form onSubmit={onSubmit} noValidate className="my-8 w-full max-w-xl animate-rise rounded-lg border bg-card-gradient p-6 shadow-card sm:p-8">
        <p className="font-display text-xl font-semibold text-foreground">
          Synthesia <span className="text-gold">Labs</span>
        </p>
        <h2 id="gate-title" className="mt-6 text-4xl font-semibold leading-tight text-foreground">
          Researcher verification<span className="text-primary">.</span>
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          {BRAND.name} supplies research compounds strictly for in-vitro laboratory research use — not for human or
          veterinary consumption. By entering you confirm you are at least 21 and agree to our{" "}
          <Link to="/terms" className="underline underline-offset-4">terms &amp; conditions</Link>.
        </p>

        <div className="mt-6 space-y-3">
          {box("isAdult", "I am at least 21 years of age", <>I am at least <strong>21 years of age</strong>.</>)}
          {box(
            "researchOnly",
            "I confirm I am a qualified researcher",
            <>
              I confirm I am a <strong>qualified researcher</strong> purchasing for{" "}
              <strong>in vitro / laboratory research</strong> only — not for human or veterinary use.
            </>,
          )}
        </div>

        <Button type="submit" variant="gold" size="lg" className="mt-6 rounded-full">
          Enter Synthesia Labs <ArrowRight />
        </Button>

        <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
          By proceeding you affirm the statements above are true. Products are not for human or veterinary use, not for
          use in diagnostic procedures, and have not been evaluated by the U.S. Food and Drug Administration.
        </p>
        <p className="mt-4 text-sm text-muted-foreground">
          Not a researcher? <a href="https://www.google.com" rel="noopener" className="underline underline-offset-4">Exit</a>
        </p>
      </form>
    </div>
  );
}

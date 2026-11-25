import { useEffect, useState } from "react";
import { SALE_ENDS_AT } from "@/lib/store-policy";

function parts(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return [
    { label: "Days", value: Math.floor(s / 86400) },
    { label: "Hrs", value: Math.floor((s % 86400) / 3600) },
    { label: "Min", value: Math.floor((s % 3600) / 60) },
    { label: "Sec", value: s % 60 },
  ];
}

/** Black Friday banner with a live countdown to the sale end. */
export function SaleCountdown({ headline, sub }: { headline: string; sub: string }) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  if (now !== null && now >= SALE_ENDS_AT.getTime()) return null;
  const left = parts(now === null ? 0 : SALE_ENDS_AT.getTime() - now);
  return (
    <section className="border-b border-primary bg-accent">
      <div className="mx-auto max-w-7xl px-6 py-6 text-center">
        <p className="eyebrow">Black Friday · Limited time</p>
        <p className="mt-2 font-classic text-3xl font-semibold text-primary md:text-5xl">{headline}</p>
        <p className="mt-1 text-sm text-muted-foreground">{sub}</p>
        <div className="mt-4 flex justify-center gap-2 md:gap-3" aria-label="Time left in sale">
          {left.map((p) => (
            <div key={p.label} className="min-w-16 rounded-md border border-primary bg-background px-3 py-2">
              <p className="font-classic text-2xl font-semibold tabular-nums text-foreground md:text-3xl">{now === null ? "--" : String(p.value).padStart(2, "0")}</p>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{p.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Served from public/ so it also loads on hosts outside Lovable (e.g. Vercel). */
const KIT_IMAGE = "/images/kit-black.webp";
const KIT_CLEAR_IMAGE = "/images/kit-clear-liquid.webp";
import { cn } from "@/lib/utils";

/** Branded 10-vial kit photo with the peptide name printed on it. */
export function KitPhoto({ name, className, compact = false, loading, clear = false }: { name: string; clear?: boolean | undefined; className?: string; compact?: boolean; loading?: "lazy" | "eager" }) {
  return (
    <div className={cn("relative overflow-hidden bg-foreground", className)}>
      <img src={clear ? KIT_CLEAR_IMAGE : KIT_IMAGE} alt={`${name} 10-vial research kit${clear ? ", clear liquid" : ""}`} className="size-full object-cover" loading={loading} />
      <div className={cn("absolute inset-x-0 bottom-0 bg-gradient-to-t from-foreground via-foreground/80 to-transparent text-center", compact ? "px-0.5 pb-0.5 pt-3" : "px-3 pb-4 pt-10")}>
        <p className={cn("font-classic font-semibold uppercase leading-tight tracking-wider text-primary", compact ? "text-[7px]" : "text-lg md:text-2xl")}>{name}</p>
        {!compact && <p className="mt-1 text-[10px] uppercase tracking-[0.3em] text-background/70">10 Vial Kit</p>}
      </div>
    </div>
  );
}

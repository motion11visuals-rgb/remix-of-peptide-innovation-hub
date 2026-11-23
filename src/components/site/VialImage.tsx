import vial from "@/assets/vial-single.jpg";
import redLiquid from "@/assets/lipo-c-red-liquid.png.asset.json";
import mark from "@/assets/synthesia_mark.png.asset.json";
import { cn } from "@/lib/utils";

/** Vial photo with a branded label (logo, peptide name, research-use-only) overlaid on its blank black band. */
export function VialImage({ name, alt, liquid = false, className, size = "sm" }: { name: string; alt?: string; liquid?: boolean; className?: string; size?: "sm" | "lg" }) {
  const lg = size === "lg";
  return (
    <div className={cn("relative aspect-square @container", className)}>
      <img src={liquid ? redLiquid.url : vial} alt={alt ?? `${name} ${liquid ? "red liquid " : ""}research vial by Synthesia Labs, labeled for research use only`} width={1254} height={1254} loading="lazy" className="h-full w-full object-cover" />
      <div className="absolute left-[37%] top-[43%] flex h-[26%] w-[26%] flex-col items-center justify-center gap-[3%] text-center">
        <img src={mark.url} alt="" className="w-[24%] rounded-sm" />
        <span className="font-classic text-[2.4cqw] leading-none text-primary">SYNTHESIA LABS</span>
        <span className={cn("font-classic font-bold leading-tight text-primary-glow", name.length > 12 ? "text-[3.2cqw]" : lg ? "text-[4.2cqw]" : "text-[4cqw]")}>{name}</span>
        <span className="whitespace-nowrap text-[1.7cqw] font-semibold uppercase leading-none text-primary">Research use only</span>
      </div>
    </div>
  );
}

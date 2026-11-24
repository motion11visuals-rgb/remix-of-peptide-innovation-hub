/** China warehouse: sold only as 10-vial kits. Prices are supplier box prices (1–20 boxes) × 3. */
export const KIT_MARKUP = 3;
export const WAREHOUSE_SHIPPING_LABEL = "7–14 days";

export type Kit = {
  slug: string;
  name: string;
  summary: string;
  liquid?: boolean;
  soldOut?: boolean;
  sizes: { label: string; price: number; soldOut?: boolean }[];
};

type Row = [name: string, summary: string, sizes: [string, number][], liquid?: boolean];

const ROWS: Row[] = [
  ["Eloralintide", "Amylin receptor agonist peptide", [["5 mg", 181], ["10 mg", 300]]],
  ["Retatrutide", "Triple GIP / GLP-1 / glucagon receptor agonist", [["5 mg", 43], ["10 mg", 79], ["15 mg", 99], ["20 mg", 120], ["30 mg", 152], ["40 mg", 174], ["50 mg", 255], ["60 mg", 295]]],
  ["Tirzepatide", "Dual GIP / GLP-1 receptor agonist", [["5 mg", 26], ["10 mg", 41], ["15 mg", 55], ["20 mg", 70], ["30 mg", 100], ["40 mg", 132], ["50 mg", 162], ["60 mg", 193], ["100 mg", 315], ["120 mg", 362]]],
  ["Semaglutide", "GLP-1 receptor agonist peptide", [["2 mg", 24], ["5 mg", 30], ["10 mg", 42], ["15 mg", 52], ["20 mg", 65], ["30 mg", 97], ["40 mg", 121]]],
  ["GHK-Cu", "Copper tripeptide-1", [["50 mg", 28], ["100 mg", 35]]],
  ["NAD+", "Nicotinamide adenine dinucleotide", [["500 mg", 42], ["1000 mg", 65]]],
  ["BPC-157", "Body Protection Compound-157 pentadecapeptide", [["5 mg", 30], ["10 mg", 51]]],
  ["KPV", "Lys-Pro-Val tripeptide", [["5 mg", 35], ["10 mg", 54]]],
  ["Selank", "Tuftsin analogue heptapeptide", [["5 mg", 33], ["10 mg", 56]]],
  ["Semax", "ACTH(4-10) analogue heptapeptide", [["5 mg", 33], ["10 mg", 56]]],
  ["SS-31", "Elamipretide mitochondria-targeted tetrapeptide", [["10 mg", 93], ["50 mg", 302]]],
  ["PT-141", "Bremelanotide melanocortin peptide", [["10 mg", 60]]],
  ["P21 (P021)", "Ciliary neurotrophic factor-derived peptide", [["5 mg", 279]]],
  ["Pinealon", "Glu-Asp-Arg tripeptide", [["10 mg", 62]]],
  ["Ipamorelin", "Selective ghrelin-receptor pentapeptide", [["5 mg", 45], ["10 mg", 62]]],
  ["AOD-9604", "hGH fragment 177-191 analogue", [["5 mg", 84], ["10 mg", 151]]],
  ["5-Amino-1MQ", "NNMT inhibitor small molecule", [["5 mg", 33], ["10 mg", 39], ["50 mg", 68]]],
  ["AHK-Cu", "Copper tripeptide Ala-His-Lys", [["20 mg", 32], ["50 mg", 42]]],
  ["Thymosin Alpha-1", "28-amino-acid thymic peptide", [["5 mg", 97], ["10 mg", 166]]],
  ["Thymalin", "Thymic peptide complex", [["10 mg", 50]]],
  ["Snap-8", "Acetyl octapeptide-3", [["10 mg", 41]]],
  ["Epithalon", "Ala-Glu-Asp-Gly tetrapeptide", [["10 mg", 46], ["50 mg", 158]]],
  ["AICAR", "AMPK activator nucleoside analogue", [["50 mg", 70]]],
  ["Kisspeptin-10", "KISS1-derived decapeptide", [["5 mg", 41], ["10 mg", 66]]],
  ["MOTS-c", "Mitochondria-derived 16-amino-acid peptide", [["10 mg", 67], ["20 mg", 117], ["40 mg", 230]]],
  ["TB-500", "Thymosin β4 acetate", [["5 mg", 79], ["10 mg", 153]]],
  ["Tesamorelin", "GHRH analogue peptide", [["5 mg", 92], ["10 mg", 179], ["20 mg", 318]]],
  ["DSIP", "Delta sleep-inducing peptide", [["5 mg", 46], ["10 mg", 84]]],
  ["Melanotan I", "Afamelanotide α-MSH analogue", [["10 mg", 60]]],
  ["Melanotan II", "Cyclic α-MSH analogue", [["10 mg", 60]]],
  ["BPC-157 + TB-500", "Blend of BPC-157 and TB-500", [["5 mg + 5 mg", 101], ["10 mg + 10 mg", 179]]],
  ["B12", "Cyanocobalamin", [["10 mg", 43]]],
  ["IGF-1 LR3", "Long R3 insulin-like growth factor-1", [["1 mg", 183]]],
  ["Oxytocin Acetate", "Nonapeptide hormone", [["5 mg", 41], ["10 mg", 64]]],
  ["Cagrilintide", "Long-acting amylin analogue", [["5 mg", 100], ["10 mg", 180]]],
  ["Cerebrolysin", "Neuropeptide preparation", [["60 mg", 71]]],
  ["VIP", "Vasoactive intestinal peptide", [["5 mg", 75], ["10 mg", 148]]],
  ["GHRP-2 Acetate", "Growth hormone releasing peptide-2", [["5 mg", 36], ["10 mg", 51]]],
  ["GHRP-6 Acetate", "Growth hormone releasing peptide-6", [["5 mg", 36], ["10 mg", 51]]],
  ["Sermorelin Acetate", "GHRH(1-29) analogue", [["5 mg", 72], ["10 mg", 139]]],
  ["GLOW Blend", "BPC-157 10 mg + GHK-Cu 50 mg + TB-500 10 mg", [["70 mg", 186]]],
  ["KLOW Blend", "BPC-157 10 mg + GHK-Cu 50 mg + TB-500 10 mg + KPV 10 mg", [["80 mg", 214]]],
  ["CJC-1295 (no DAC)", "Mod GRF(1-29) GHRH analogue", [["5 mg", 58], ["10 mg", 105]]],
  ["CJC-1295 with DAC", "Drug affinity complex GHRH analogue", [["5 mg", 163]]],
  ["CJC-1295 + Ipamorelin", "CJC-1295 (no DAC) 5 mg + Ipamorelin 5 mg", [["10 mg", 93]]],
  ["Cartalax", "Ala-Glu-Asp tripeptide", [["20 mg", 118]]],
  ["HGH 191AA", "Somatropin recombinant growth hormone", [["10 IU", 56], ["12 IU", 65], ["24 IU", 123], ["36 IU", 169]]],
  ["HCG", "Human chorionic gonadotropin", [["1000 IU", 38], ["2000 IU", 56], ["5000 IU", 112], ["10000 IU", 204]]],
  ["Hexarelin Acetate", "Growth hormone secretagogue hexapeptide", [["2 mg", 27], ["5 mg", 49]]],
  ["Gonadorelin", "GnRH decapeptide", [["2 mg", 27]]],
  ["HMG", "Human menopausal gonadotropin", [["75 IU", 35]]],
  ["Glutathione", "Tripeptide antioxidant", [["600 mg", 60], ["1500 mg", 80]]],
  ["Adipotide", "Prohibitin-targeting peptide", [["2 mg", 37], ["5 mg", 81]]],
  ["ARA-290", "Cibinetide erythropoietin-derived peptide", [["10 mg", 70]]],
  ["FOXO4-DRI", "Senolytic D-retro-inverso peptide", [["10 mg", 260]]],
  ["Lipo-C", "Lipotropic compound blend", [["10 mL", 52]], true],
  ["Lipo-C with B12", "Lipotropic blend with cyanocobalamin", [["10 mL", 55]], true],
  ["L-Carnitine 600", "L-carnitine solution 600", [["10 mL", 55]], true],
  ["L-Carnitine 1200", "L-carnitine solution 1200", [["10 mL", 55]], true],
  ["Lemon Bottle", "Lipolytic research solution", [["10 mL", 51]], true],
];

function slugify(s: string) {
  return "cw-" + s.toLowerCase().replace(/\+/g, " plus ").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function kitLabel(size: string) {
  return `${size} × 10 vials`;
}

export const KITS: Kit[] = ROWS.map(([name, summary, sizes, liquid]) => ({
  slug: slugify(name),
  name,
  summary,
  ...(liquid ? { liquid } : {}),
  sizes: sizes.map(([mg, base]) => ({ label: kitLabel(mg), price: base * KIT_MARKUP })),
}));

export function getKit(slug: string): Kit | undefined {
  return KITS.find((k) => k.slug === slug);
}

export function isKitSlug(slug: string): boolean {
  return KITS.some((k) => k.slug === slug);
}

/** Free warehouse shipping runs all of November and December (months 10 and 11, 0-based). */
export function warehousePromoActive(now: Date = new Date()): boolean {
  const m = now.getMonth();
  return m === 10 || m === 11;
}

/** Free shipping applies only when every line ships from the China warehouse during the promo. */
export function warehouseFreeShipping(slugs: string[], now: Date = new Date()): boolean {
  return slugs.length > 0 && slugs.every(isKitSlug) && warehousePromoActive(now);
}

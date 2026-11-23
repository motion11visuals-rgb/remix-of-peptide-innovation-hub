export type Category =
  "Metabolic" | "Recovery" | "Growth Hormone" | "Cognitive" | "Longevity" | "Cosmetic";

export type Product = {
  slug: string;
  name: string;
  fullName: string;
  category: Category;
  summary: string;
  description: string;
  sequence: string;
  formula: string;
  molecularWeight: string;
  cas: string;
  purity: string;
  form: string;
  sizes: { label: string; price: number; soldOut?: boolean }[];
  featured?: boolean;
  /** Whole product is out of stock; every size shows as sold out. */
  soldOut?: boolean;
  /** Former price shown struck through. */
  compareAt?: number;
};

export const PRODUCTS: Product[] = [
  {
    slug: "retatrutide",
    name: "GLP-RT",
    fullName: "Retatrutide (LY3437943)",
    category: "Metabolic",
    summary: "Triple GIP / GLP-1 / glucagon receptor agonist peptide.",
    description:
      "A synthetic lipidated peptide investigated as a single-molecule agonist at the GIP, GLP-1 and glucagon receptors in metabolic research models. Supplied as a lyophilized powder.",
    sequence: "39-residue peptide, C20 fatty diacid–modified lysine",
    formula: "C221H342N46O68",
    molecularWeight: "4731.3 g/mol",
    cas: "2381089-83-2",
    purity: "≥ 99%",
    form: "Lyophilized powder",
    sizes: [
      { label: "5 mg", price: 35 },
      { label: "10 mg", price: 50 },
      { label: "20 mg", price: 95 },
    ],
    featured: true,
  },
  {
    slug: "tirzepatide",
    name: "GLP-TIRZ",
    fullName: "Tirzepatide (LY3298176)",
    category: "Metabolic",
    summary: "Dual GIP / GLP-1 receptor agonist peptide.",
    description:
      "A 39-amino-acid synthetic peptide with a C20 fatty diacid moiety, studied as a dual GIP and GLP-1 receptor agonist in metabolic research. Supplied as a lyophilized powder.",
    sequence: "Y-Aib-EGTFTSDYSI-Aib-LDKIAQ-K(C20 diacid)-AFVQWLIAGGPSSGAPPPS-NH2",
    formula: "C225H348N48O68",
    molecularWeight: "4813.5 g/mol",
    cas: "2023788-19-2",
    purity: "≥ 99%",
    form: "Lyophilized powder",
    sizes: [
      { label: "5 mg", price: 29.99 },
      { label: "10 mg", price: 50 },
      { label: "20 mg", price: 85 },
    ],
    featured: true,
  },
  {
    slug: "hgh",
    name: "HGH 191AA",
    fullName: "Somatropin (Recombinant Human Growth Hormone)",
    category: "Growth Hormone",
    summary: "191-amino-acid recombinant growth hormone.",
    description:
      "Recombinant 191-amino-acid human growth hormone, identical in sequence to the native pituitary protein, for endocrine and cell-signaling research. Supplied as a lyophilized powder.",
    sequence: "191 amino acids, two disulfide bridges",
    formula: "C990H1528N262O300S7",
    molecularWeight: "22,124 Da",
    cas: "12629-01-5",
    purity: "≥ 98%",
    form: "Lyophilized powder",
    sizes: [
      { label: "10 IU", price: 40 },
      { label: "100 IU kit", price: 50, soldOut: true },
    ],
  },
  {
    slug: "cjc-1295-ipamorelin",
    name: "CJC-1295 + Ipamorelin",
    fullName: "CJC-1295 (no DAC) / Ipamorelin Blend",
    category: "Growth Hormone",
    summary: "Pre-mixed GHRH analogue and GHRP research blend.",
    description:
      "A combined vial of CJC-1295 without DAC (Mod GRF 1-29) and Ipamorelin, used in research on GHRH and ghrelin-receptor pathways. Supplied as a lyophilized powder in a 1:1 ratio.",
    sequence: "Mod GRF(1-29) + Aib-His-D-2Nal-D-Phe-Lys-NH2",
    formula: "C152H252N44O42 / C38H49N9O5",
    molecularWeight: "3367.9 / 711.9 g/mol",
    cas: "863288-34-0 / 170851-70-4",
    purity: "≥ 98%",
    form: "Lyophilized powder (1:1 blend)",
    sizes: [
      { label: "5 mg / 5 mg", price: 89 },
      { label: "10 mg / 10 mg", price: 158 },
    ],
    soldOut: true,
  },
  {
    slug: "bpc-157",
    name: "BPC-157",
    fullName: "Body Protection Compound-157",
    category: "Recovery",
    summary: "Pentadecapeptide derived from a gastric protein sequence.",
    description:
      "A synthetic 15-amino-acid peptide fragment studied in preclinical models for its role in tissue and gastrointestinal research. Supplied as a lyophilized powder.",
    sequence: "Gly-Glu-Pro-Pro-Pro-Gly-Lys-Pro-Ala-Asp-Asp-Ala-Gly-Leu-Val",
    formula: "C62H98N16O22",
    molecularWeight: "1419.5 g/mol",
    cas: "137525-51-0",
    purity: "≥ 99%",
    form: "Lyophilized powder",
    sizes: [
      { label: "5 mg", price: 48 },
      { label: "10 mg", price: 84 },
    ],
    soldOut: true,
  },
  {
    slug: "tb-500",
    name: "TB-500",
    fullName: "Thymosin β4 Fragment (Ac-LKKTETQ)",
    category: "Recovery",
    summary: "Acetylated active fragment of Thymosin Beta-4.",
    description:
      "A synthetic heptapeptide corresponding to the actin-binding region of Thymosin β4, used in cell migration and wound-model research.",
    sequence: "Ac-Leu-Lys-Lys-Thr-Glu-Thr-Gln",
    formula: "C38H68N10O14",
    molecularWeight: "889.0 g/mol",
    cas: "885340-08-9",
    purity: "≥ 98%",
    form: "Lyophilized powder",
    sizes: [
      { label: "5 mg", price: 56 },
      { label: "10 mg", price: 98 },
    ],
    soldOut: true,
  },
  {
    slug: "ghk-cu",
    name: "GHK-Cu",
    fullName: "Copper Tripeptide-1",
    category: "Cosmetic",
    summary: "Copper-binding tripeptide studied in dermal research.",
    description:
      "A naturally occurring copper complex of the tripeptide glycyl-L-histidyl-L-lysine, widely investigated in collagen and skin-model studies.",
    sequence: "Gly-His-Lys · Cu²⁺",
    formula: "C14H24N6O4Cu",
    molecularWeight: "403.9 g/mol",
    cas: "89030-95-5",
    purity: "≥ 99%",
    form: "Lyophilized powder",
    sizes: [{ label: "50 mg", price: 20 }],
    featured: true,
  },
  {
    slug: "ipamorelin",
    name: "Ipamorelin",
    fullName: "Ipamorelin Acetate",
    category: "Growth Hormone",
    summary: "Selective pentapeptide ghrelin-receptor agonist.",
    description:
      "A synthetic pentapeptide studied as a selective growth hormone secretagogue in endocrine research models.",
    sequence: "Aib-His-D-2Nal-D-Phe-Lys-NH2",
    formula: "C38H49N9O5",
    molecularWeight: "711.9 g/mol",
    cas: "170851-70-4",
    purity: "≥ 99%",
    form: "Lyophilized powder",
    sizes: [
      { label: "5 mg", price: 44 },
      { label: "10 mg", price: 78 },
    ],
    soldOut: true,
  },
  {
    slug: "epitalon",
    name: "Epitalon",
    fullName: "Epithalon Tetrapeptide",
    category: "Longevity",
    summary: "Synthetic tetrapeptide studied in telomere research.",
    description:
      "A short synthetic peptide based on epithalamin, investigated in cellular aging and telomerase activity studies.",
    sequence: "Ala-Glu-Asp-Gly",
    formula: "C14H22N4O9",
    molecularWeight: "390.3 g/mol",
    cas: "307297-39-8",
    purity: "≥ 99%",
    form: "Lyophilized powder",
    sizes: [
      { label: "10 mg", price: 46 },
      { label: "50 mg", price: 168 },
    ],
    soldOut: true,
  },
  {
    slug: "selank",
    name: "Selank",
    fullName: "Selank Acetate",
    category: "Cognitive",
    summary: "Heptapeptide analogue of tuftsin.",
    description:
      "A synthetic analogue of the immunomodulatory peptide tuftsin, studied in neurological and behavioral research models.",
    sequence: "Thr-Lys-Pro-Arg-Pro-Gly-Pro",
    formula: "C33H57N11O9",
    molecularWeight: "751.9 g/mol",
    cas: "129954-34-3",
    purity: "≥ 98%",
    form: "Lyophilized powder",
    sizes: [
      { label: "5 mg", price: 52 },
      { label: "10 mg", price: 92 },
    ],
    soldOut: true,
  },
  {
    slug: "semax",
    name: "Semax",
    fullName: "Semax Acetate",
    category: "Cognitive",
    summary: "ACTH(4-10) analogue heptapeptide.",
    description:
      "A synthetic peptide derived from adrenocorticotropic hormone fragment 4–10, used in neuroprotection research.",
    sequence: "Met-Glu-His-Phe-Pro-Gly-Pro",
    formula: "C37H51N9O10S",
    molecularWeight: "813.9 g/mol",
    cas: "80714-61-0",
    purity: "≥ 98%",
    form: "Lyophilized powder",
    sizes: [
      { label: "5 mg", price: 25 },
      { label: "10 mg", price: 35 },
      { label: "20 mg", price: 45 },
    ],
    featured: true,
  },
  {
    slug: "mots-c",
    name: "MOTS-c",
    fullName: "Mitochondrial ORF of the 12S rRNA-c",
    category: "Longevity",
    summary: "Mitochondria-derived 16-amino-acid peptide.",
    description:
      "A mitochondrial-encoded peptide studied in metabolic regulation and cellular energy research.",
    sequence: "Met-Arg-Trp-Gln-Glu-Met-Gly-Tyr-Ile-Phe-Tyr-Pro-Arg-Lys-Leu-Arg",
    formula: "C101H152N28O22S2",
    molecularWeight: "2174.6 g/mol",
    cas: "1627580-64-6",
    purity: "≥ 98%",
    form: "Lyophilized powder",
    sizes: [
      { label: "5 mg", price: 25, soldOut: true },
      { label: "10 mg", price: 40 },
      { label: "20 mg", price: 89 },
    ],
    featured: true,
  },
  {
    slug: "kpv",
    name: "KPV",
    fullName: "Lys-Pro-Val Tripeptide",
    category: "Recovery",
    summary: "C-terminal tripeptide of α-MSH.",
    description:
      "The C-terminal fragment of alpha-melanocyte-stimulating hormone, studied in inflammation and epithelial research models.",
    sequence: "Lys-Pro-Val",
    formula: "C16H30N4O4",
    molecularWeight: "342.4 g/mol",
    cas: "67727-97-3",
    purity: "≥ 99%",
    form: "Lyophilized powder",
    sizes: [
      { label: "10 mg", price: 46 },
      { label: "30 mg", price: 118 },
    ],
    soldOut: true,
  },
];

PRODUCTS.splice(2, 0, {
  slug: "lipo-c-b12",
  name: "Lipo-C with B12",
  fullName: "Lipo-C (Methionine / Inositol / Choline) with Cyanocobalamin",
  category: "Metabolic",
  summary: "Lipotropic compound blend with vitamin B12.",
  description:
    "A research blend of the lipotropic compounds methionine, inositol and choline combined with cyanocobalamin (vitamin B12), supplied for in-vitro laboratory research.",
  sequence: "Blend (non-peptide)",
  formula: "Blend",
  molecularWeight: "Blend",
  cas: "Blend",
  purity: "≥ 98%",
  form: "Solution, 10 mL vial",
  sizes: [{ label: "10 mL", price: 35 }],
  compareAt: 60,
  featured: true,
});

export const CATEGORIES: Category[] = [
  "Metabolic",
  "Recovery",
  "Growth Hormone",
  "Cognitive",
  "Longevity",
  "Cosmetic",
];

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function isSizeAvailable(p: Product, sizeLabel: string): boolean {
  if (p.soldOut) return false;
  const size = p.sizes.find((s) => s.label === sizeLabel);
  return !!size && !size.soldOut;
}

export function isSoldOut(p: Product): boolean {
  return !p.sizes.some((s) => isSizeAvailable(p, s.label));
}

/** Lowest listed price across all sizes (including sold-out sizes) — used for "from" marketing. */
export function startingPrice(p: Product): number {
  return Math.min(...p.sizes.map((s) => s.price));
}

export function formatPrice(n: number): string {
  return `$${n.toFixed(2)}`;
}

export const BRAND = {
  name: "Synthesia Labs",
  short: "Synthesia",
  email: "synthesialabs1@gmail.com",
  disclaimer:
    "All products are sold strictly for laboratory research use only. Not for human or veterinary use, not for consumption, and not intended to diagnose, treat, cure, or prevent any disease.",
  fdaDisclaimer:
    "The statements made on this website have not been evaluated by the U.S. Food and Drug Administration (FDA). The products offered by Synthesia Labs are not drugs, dietary supplements, or cosmetics, and are not intended to diagnose, treat, cure, or prevent any disease. All products are chemical reagents sold exclusively for in-vitro laboratory research and development purposes. They are not for human or animal consumption, injection, or any form of in-vivo use. By purchasing, you acknowledge that you are a qualified researcher and agree to handle these materials in accordance with all applicable laws and laboratory safety standards.",
};

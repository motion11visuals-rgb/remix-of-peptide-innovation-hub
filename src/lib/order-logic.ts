import { z } from "zod";
import { PRODUCTS, isSizeAvailable } from "./products";
import { orderTotals, POLICY_VERSION } from "./store-policy";
import { KITS, isKitSlug } from "./china-warehouse";

export const MAX_PROOF_BYTES = 10 * 1024 * 1024;
export const PROOF_TYPES = ["image/png", "image/jpeg", "image/webp", "image/heic", "image/heif"];

/** Some phone file pickers omit MIME types; only infer supported image extensions. */
export function normalizeProof(file: File): File {
  if (file.type) return file;
  const types: Record<string, string> = { png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", webp: "image/webp", heic: "image/heic", heif: "image/heif" };
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
  const type = types[extension];
  return type ? new File([file], file.name, { type, lastModified: file.lastModified }) : file;
}

const REF_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function generateOrderRef(random: () => number = Math.random): string {
  let s = "";
  for (let i = 0; i < 6; i++) s += REF_ALPHABET[Math.floor(random() * REF_ALPHABET.length)];
  return `AU-${s}`;
}

export function isValidOrderRef(ref: string): boolean {
  return /^AU-[A-HJ-NP-Z2-9]{6}$/.test(ref);
}

export const orderItemSchema = z.object({
  slug: z.string().min(1).max(80),
  size: z.string().min(1).max(40),
  qty: z.number().int().min(1).max(99),
});

export const orderFieldsSchema = z.object({
  orderRef: z.string().refine(isValidOrderRef, "Invalid order reference"),
  customerName: z.string().trim().min(2, "Enter your full name").max(120),
  email: z.string().trim().email("Enter a valid email").max(200),
  phone: z.string().trim().max(40).optional(),
  organization: z.string().trim().min(2, "Enter your institution or lab").max(200),
  affiliation: z.string().trim().max(120).optional(),
  address: z.string().trim().min(4, "Enter your street address").max(300),
  city: z.string().trim().min(2, "Enter your city").max(120),
  state: z.string().trim().min(2, "Enter your state").max(60),
  zip: z.string().trim().min(3, "Enter your ZIP code").max(20),
  paymentMethod: z.enum(["zelle", "paypal", "cashapp"]),
  paymentName: z.string().trim().max(120).optional(),
  notes: z.string().trim().max(1000).optional(),
  researchOnly: z.literal("true", { errorMap: () => ({ message: "You must accept research-use-only terms" }) }),
  termsAccepted: z.literal("true", { errorMap: () => ({ message: "You must accept the terms and store policies" }) }),
  policyVersion: z.literal(POLICY_VERSION),
});

export type PricedLine = { slug: string; name: string; size: string; qty: number; unitPrice: number; total: number };

/** Prices an order from the catalog; never trusts client-sent prices. Returns null if any item is unknown or sold out. */
export function priceOrder(items: z.infer<typeof orderItemSchema>[], now: Date = new Date()): { lines: PricedLine[]; subtotal: number; shipping: number; processingFee: number; total: number } | null {
  if (items.length === 0) return null;
  const lines: PricedLine[] = [];
  for (const item of items) {
    const product = PRODUCTS.find((p) => p.slug === item.slug) ?? KITS.find((k) => k.slug === item.slug);
    const size = product?.sizes.find((s) => s.label === item.size);
    if (!product || !size || !isSizeAvailable(product, size.label)) return null;
    lines.push({
      slug: product.slug,
      name: product.name,
      size: size.label,
      qty: item.qty,
      unitPrice: size.price,
      total: size.price * item.qty,
    });
  }
  const totals = orderTotals(lines.reduce((s, l) => s + l.total, 0), { warehouseSubtotal: lines.filter((l) => isKitSlug(l.slug)).reduce((s, l) => s + l.total, 0) });
  return { lines, ...totals };
}

export function validateProof(file: { type: string; size: number } | null): string | null {
  if (!file || file.size === 0) return "Upload a screenshot of your completed payment.";
  if (!PROOF_TYPES.includes(file.type)) return "Screenshot must be a PNG, JPG, WEBP or HEIC image.";
  if (file.size > MAX_PROOF_BYTES) return "Screenshot must be 10 MB or smaller.";
  return null;
}

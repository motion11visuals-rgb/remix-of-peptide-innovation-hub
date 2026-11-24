import { PRODUCTS, formatPrice, isSizeAvailable } from "./products";
import { KITS } from "./china-warehouse";

export type CartLine = { slug: string; size: string; qty: number };

export const MAX_QTY = 99;

function clampQty(n: number): number {
  return Math.max(0, Math.min(MAX_QTY, Math.floor(n)));
}

export function addLine(lines: CartLine[], line: CartLine): CartLine[] {
  if (!lineDetails(line)) return lines;
  const existing = lines.find((l) => l.slug === line.slug && l.size === line.size);
  if (existing) {
    return lines.map((l) => (l === existing ? { ...l, qty: clampQty(l.qty + line.qty) } : l));
  }
  const qty = clampQty(line.qty);
  return qty > 0 ? [...lines, { ...line, qty }] : lines;
}

export function setLineQty(lines: CartLine[], slug: string, size: string, qty: number): CartLine[] {
  const q = clampQty(qty);
  if (q === 0) return lines.filter((l) => !(l.slug === slug && l.size === size));
  return lines.map((l) => (l.slug === slug && l.size === size ? { ...l, qty: q } : l));
}

export function lineDetails(line: CartLine) {
  const product = PRODUCTS.find((p) => p.slug === line.slug) ?? KITS.find((k) => k.slug === line.slug);
  const size = product?.sizes.find((s) => s.label === line.size);
  if (!product || !size || !isSizeAvailable(product, size.label)) return undefined;
  const liquid = product.slug === "lipo-c-b12" || ("liquid" in product && product.liquid === true);
  return { product, liquid, unitPrice: size.price, total: size.price * line.qty };
}

export function cartSubtotal(lines: CartLine[]): number {
  return lines.reduce((sum, l) => sum + (lineDetails(l)?.total ?? 0), 0);
}

export function cartCount(lines: CartLine[]): number {
  return lines.reduce((sum, l) => sum + l.qty, 0);
}

export function cartSummary(lines: CartLine[]): string {
  const parts = lines.flatMap((l) => {
    const d = lineDetails(l);
    return d ? [`${d.product.name} ${l.size} × ${l.qty}`] : [];
  });
  return `${parts.join("; ")} — subtotal ${formatPrice(cartSubtotal(lines))}`;
}

export function parseStoredCart(raw: string | null): CartLine[] {
  if (!raw) return [];
  try {
    const data: unknown = JSON.parse(raw);
    if (!Array.isArray(data)) return [];
    return data.filter(
      (l): l is CartLine =>
        typeof l === "object" &&
        l !== null &&
        typeof l.slug === "string" &&
        typeof l.size === "string" &&
        typeof l.qty === "number" &&
        l.qty > 0 &&
        lineDetails(l as CartLine) !== undefined,
    );
  } catch {
    return [];
  }
}

export const BUSINESS_ADDRESS = "12950 NW 17th St, Miami, FL 33182, United States";
export const POLICY_VERSION = "2026-11-23-processing-fee-2";
export const POLICY_DATE = "November 23, 2026";
export const SHIPPING_FLAT_RATE = 9;
export const FREE_SHIPPING_THRESHOLD = 150;
export const QUALITY_REFUND_CREDIT = 20;
export const ORDER_PROCESSING_DAYS = { min: 1, max: 2 } as const;
export const ORDER_PROCESSING_LABEL = `${ORDER_PROCESSING_DAYS.min}–${ORDER_PROCESSING_DAYS.max} days`;
export const PROCESSING_FEE = 2;
/** China warehouse orders: $35 shipping, free when subtotal is over $280. */
export const WAREHOUSE_SHIPPING_RATE = 35;
export const WAREHOUSE_FREE_THRESHOLD = 280;

/** Compare integer cents: exactly $150 still incurs shipping. */
/** Mixed orders ship in two parts: regular items use the regular rule, warehouse kits use the warehouse rule. */
export function orderTotals(subtotal: number, opts: { warehouseSubtotal?: number } = {}) {
  const cents = Math.round(subtotal * 100);
  const whCents = Math.round((opts.warehouseSubtotal ?? 0) * 100);
  const regCents = cents - whCents;
  const regShip = regCents > 0 && regCents <= FREE_SHIPPING_THRESHOLD * 100 ? SHIPPING_FLAT_RATE : 0;
  const whShip = whCents > 0 && whCents <= WAREHOUSE_FREE_THRESHOLD * 100 ? WAREHOUSE_SHIPPING_RATE : 0;
  const shipping = regShip + whShip;
  return { subtotal: cents / 100, shipping, processingFee: PROCESSING_FEE, total: (cents + shipping * 100 + PROCESSING_FEE * 100) / 100 };
}

export const POLICY_LINKS = [
  { to: "/privacy-policy", label: "Privacy Policy" },
  { to: "/terms", label: "Terms & Conditions" },
  { to: "/research-use-only", label: "Research Use Only Policy" },
  { to: "/shipping-policy", label: "Shipping Policy" },
  { to: "/return-policy", label: "Return Policy" },
  { to: "/accessibility", label: "Accessibility" },
] as const;

export function isPolicyPath(path: string) {
  return POLICY_LINKS.some((link) => link.to === path.replace(/\/$/, ""));
}
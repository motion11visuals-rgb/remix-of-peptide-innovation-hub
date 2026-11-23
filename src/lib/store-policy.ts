export const BUSINESS_ADDRESS = "12950 NW 17th St, Miami, FL 33182, United States";
export const POLICY_VERSION = "2026-11-23";
export const POLICY_DATE = "November 23, 2026";
export const SHIPPING_FLAT_RATE = 8;
export const FREE_SHIPPING_THRESHOLD = 150;
export const QUALITY_REFUND_CREDIT = 20;
export const ORDER_PROCESSING_DAYS = { min: 1, max: 2 } as const;
export const ORDER_PROCESSING_LABEL = `${ORDER_PROCESSING_DAYS.min}–${ORDER_PROCESSING_DAYS.max} days`;

/** Compare integer cents: exactly $150 still incurs shipping. */
export function orderTotals(subtotal: number) {
  const cents = Math.round(subtotal * 100);
  const shipping = cents > FREE_SHIPPING_THRESHOLD * 100 ? 0 : SHIPPING_FLAT_RATE;
  return { subtotal: cents / 100, shipping, total: (cents + shipping * 100) / 100 };
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
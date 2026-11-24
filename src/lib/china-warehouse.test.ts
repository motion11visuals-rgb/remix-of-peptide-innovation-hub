import { describe, expect, it } from "vitest";
import { getKit, warehouseFreeShipping } from "./china-warehouse";
import { priceOrder } from "./order-logic";

describe("china warehouse", () => {
  it("prices kits at 3x the supplier box price", () => {
    expect(getKit("cw-retatrutide")?.sizes[0]).toEqual({ label: "5 mg × 10 vials", price: 129 });
  });
  it("free shipping in November for warehouse-only orders", () => {
    const p = priceOrder([{ slug: "cw-retatrutide", size: "5 mg × 10 vials", qty: 1 }], new Date(2026, 10, 24));
    expect(p?.shipping).toBe(0);
  });
  it("normal shipping outside Nov/Dec", () => {
    const p = priceOrder([{ slug: "cw-retatrutide", size: "5 mg × 10 vials", qty: 1 }], new Date(2027, 0, 5));
    expect(p?.shipping).toBe(9);
  });
  it("no free promo shipping when mixed with regular products", () => {
    expect(warehouseFreeShipping(["cw-retatrutide", "semax"], new Date(2026, 11, 1))).toBe(false);
  });
});

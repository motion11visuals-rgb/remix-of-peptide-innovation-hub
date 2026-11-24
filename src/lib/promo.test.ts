import { describe, expect, it } from "vitest";
import { priceOrder } from "./order-logic";
import { promoDiscount } from "./store-policy";

describe("Labs20 Black Friday code", () => {
  it("20% off US warehouse items at $60+", () => expect(promoDiscount(60, 0, "Labs20")).toBe(12));
  it("no US discount under $60", () => expect(promoDiscount(59.99, 0, "LABS20")).toBe(0));
  it("10% off China kits over $300", () => expect(promoDiscount(0, 387, "labs20")).toBe(38.7));
  it("no China discount at exactly $300", () => expect(promoDiscount(0, 300, "LABS20")).toBe(0));
  it("no discount without the code", () => expect(promoDiscount(100, 400, "")).toBe(0));
  it("server total subtracts the discount", () => {
    const p = priceOrder([{ slug: "cw-retatrutide", size: "5 mg × 10 vials", qty: 3 }], new Date(), "Labs20");
    expect(p?.discount).toBe(38.7);
    expect(p?.total).toBe(387 + 2 - 38.7);
  });
});

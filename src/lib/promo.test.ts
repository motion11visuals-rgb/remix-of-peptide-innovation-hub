import { describe, expect, it } from "vitest";
import { orderTotals, saleDiscount, PROCESSING_FEE, salePrice as salePriceFn } from "./store-policy";
import { priceOrder } from "./order-logic";
import { getKit } from "./china-warehouse";
import { getProduct } from "./products";

const during = new Date("2026-11-26T12:00:00Z");
const after = new Date("2026-12-06T00:00:00Z");

describe("Black Friday sale", () => {
  it("takes 50% off US catalog items", () => expect(saleDiscount(100, 0, during)).toBe(50));
  it("takes 35% off China warehouse kits", () => expect(saleDiscount(0, 200, during)).toBe(70));
  it("ends after 10 days", () => expect(saleDiscount(100, 200, after)).toBe(0));
  it("charges $9 US shipping even over $150 during the sale", () => expect(orderTotals(200, { now: during }).shipping).toBe(9));
  it("charges $35 China shipping even over $280 during the sale", () => expect(orderTotals(400, { warehouseSubtotal: 400, now: during }).shipping).toBe(35));
  it("processing fee is $2.99", () => expect(PROCESSING_FEE).toBe(2.99));
  it("prices a sale order: $100 US item → 50 + 9 + 2.99", () => {
    const p = priceOrder([{ slug: "synthesia-h2o", size: "10 mL", qty: 10 }], during);
    expect(p?.total).toBe(Math.round((90 - 45 + 9 + 2.99) * 100) / 100);
  });
});

describe("Synthesia H2O", () => {
  it("3 mL is $3 and 10 mL is $9", () => {
    const p = getProduct("synthesia-h2o");
    expect(p?.sizes.map((s) => s.price)).toEqual([3, 9]);
  });
  it("China kit of 10 mL vials is $35", () => expect(getKit("cw-synthesia-h2o")?.sizes[0]?.price).toBe(35));
});

describe("sale prices on product pages", () => {
  it("US $9 item shows $4.50", () => expect(salePriceFn(9, false, during)).toBe(4.5));
  it("China $35 kit shows $22.75", () => expect(salePriceFn(35, true, during)).toBe(22.75));
});

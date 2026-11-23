import { describe, expect, it } from "vitest";
import { orderTotals, QUALITY_REFUND_CREDIT, ORDER_PROCESSING_DAYS } from "./store-policy";

describe("owner shipping policy", () => {
  it("sets order processing to 1–2 days", () => {
    expect(ORDER_PROCESSING_DAYS).toEqual({ min: 1, max: 2 });
  });
  it("charges a flat $9 below $150", () => {
    expect(orderTotals(35)).toEqual({ subtotal: 35, shipping: 9, total: 44 });
    expect(orderTotals(149.99)).toEqual({ subtotal: 149.99, shipping: 9, total: 158.99 });
  });
  it("still charges $9 on exactly $150 because free shipping is only over $150", () => {
    expect(orderTotals(150)).toEqual({ subtotal: 150, shipping: 9, total: 159 });
  });
  it("waives shipping above $150", () => {
    expect(orderTotals(150.01)).toEqual({ subtotal: 150.01, shipping: 0, total: 150.01 });
    expect(orderTotals(200)).toEqual({ subtotal: 200, shipping: 0, total: 200 });
  });
});

it("provides $20 website credit in addition to a qualifying peptide refund", () => {
  expect(QUALITY_REFUND_CREDIT).toBe(20);
});
import { describe, expect, it } from "vitest";
import { orderTotals, QUALITY_REFUND_CREDIT, ORDER_PROCESSING_DAYS } from "./store-policy";

import { beforeAll as __ba, afterAll as __aa, vi as __vi } from "vitest";
__ba(() => { __vi.useFakeTimers({ toFake: ["Date"], now: new Date("2026-12-10T00:00:00Z") }); });
__aa(() => { __vi.useRealTimers(); });


describe("owner shipping policy", () => {
  it("charges a flat $2.99 processing fee once per order, even with free shipping", () => {
    expect(orderTotals(35).processingFee).toBe(2.99);
    expect(orderTotals(190)).toEqual({ subtotal: 190, shipping: 0, processingFee: 2.99, total: 192.99 });
  });
  it("sets order processing to 1–2 days", () => {
    expect(ORDER_PROCESSING_DAYS).toEqual({ min: 1, max: 2 });
  });
  it("charges a flat $9 below $150", () => {
    expect(orderTotals(35)).toEqual({ subtotal: 35, shipping: 9, processingFee: 2.99, total: 46.99 });
    expect(orderTotals(149.99)).toEqual({ subtotal: 149.99, shipping: 9, processingFee: 2.99, total: 161.98 });
  });
  it("still charges $9 on exactly $150 because free shipping is only over $150", () => {
    expect(orderTotals(150)).toEqual({ subtotal: 150, shipping: 9, processingFee: 2.99, total: 161.99 });
  });
  it("waives shipping above $150", () => {
    expect(orderTotals(150.01)).toEqual({ subtotal: 150.01, shipping: 0, processingFee: 2.99, total: 153 });
    expect(orderTotals(200)).toEqual({ subtotal: 200, shipping: 0, processingFee: 2.99, total: 202.99 });
  });
});

it("provides $20 website credit in addition to a qualifying peptide refund", () => {
  expect(QUALITY_REFUND_CREDIT).toBe(20);
});
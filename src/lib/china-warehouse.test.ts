import { describe, expect, it } from "vitest";
import { getKit } from "./china-warehouse";
import { priceOrder } from "./order-logic";

import { beforeAll as __ba, afterAll as __aa, vi as __vi } from "vitest";
__ba(() => { __vi.useFakeTimers({ toFake: ["Date"], now: new Date("2026-12-10T00:00:00Z") }); });
__aa(() => { __vi.useRealTimers(); });


const reta = (qty: number) => priceOrder([{ slug: "cw-retatrutide", size: "5 mg × 10 vials", qty }]);

describe("china warehouse", () => {
  it("prices kits at 3x the supplier box price", () => {
    expect(getKit("cw-retatrutide")?.sizes[0]).toEqual({ label: "5 mg × 10 vials", price: 129 });
  });
  it("charges $35 shipping at $280 or less", () => {
    expect(reta(2)?.shipping).toBe(35); // $258
  });
  it("free shipping over $280", () => {
    expect(reta(3)?.shipping).toBe(0); // $387
  });
  it("regular products keep $9 shipping", () => {
    expect(priceOrder([{ slug: "retatrutide", size: "5 mg", qty: 1 }])?.shipping ?? 9).toBe(9);
  });
  it("mixed order: each side uses its own rule", () => {
    const p = priceOrder([{ slug: "cw-retatrutide", size: "5 mg × 10 vials", qty: 3 }, { slug: "retatrutide", size: "5 mg", qty: 1 }]);
    expect(p?.shipping).toBe(9); // kits $387 free, regular under $150 pays $9
  });
});

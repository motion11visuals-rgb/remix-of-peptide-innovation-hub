import { describe, expect, it } from "vitest";
import { addLine, cartCount, cartSubtotal, parseStoredCart, setLineQty } from "./cart-logic";

describe("cart", () => {
  it("adding the same peptide and size twice increases quantity instead of duplicating", () => {
    const lines = addLine(addLine([], { slug: "retatrutide", size: "10 mg", qty: 1 }), {
      slug: "retatrutide",
      size: "10 mg",
      qty: 2,
    });
    expect(lines).toEqual([{ slug: "retatrutide", size: "10 mg", qty: 3 }]);
  });

  it("subtotal multiplies each size's price by quantity", () => {
    const lines = [
      { slug: "tirzepatide", size: "10 mg", qty: 2 }, // 50 each
      { slug: "hgh", size: "10 IU", qty: 1 }, // 40
    ];
    expect(cartSubtotal(lines)).toBe(140);
    expect(cartCount(lines)).toBe(3);
  });

  it("setting quantity to zero removes the line", () => {
    const lines = setLineQty([{ slug: "semax", size: "20 mg", qty: 2 }], "semax", "20 mg", 0);
    expect(lines).toEqual([]);
  });

  it("sold-out peptides and sizes cannot be added to the cart", () => {
    expect(addLine([], { slug: "bpc-157", size: "5 mg", qty: 1 })).toEqual([]);
    expect(addLine([], { slug: "hgh", size: "100 IU kit", qty: 1 })).toEqual([]);
  });

  it("sold-out items saved in an old cart are dropped when it is reloaded", () => {
    const raw = JSON.stringify([
      { slug: "tb-500", size: "5 mg", qty: 1 },
      { slug: "ghk-cu", size: "50 mg", qty: 1 },
    ]);
    expect(parseStoredCart(raw)).toEqual([{ slug: "ghk-cu", size: "50 mg", qty: 1 }]);
  });
});

import { describe, expect, it } from "vitest";
import { PRODUCTS, isSizeAvailable, isSoldOut, startingPrice } from "./products";

describe("stock", () => {
  it("only Retatrutide, Tirzepatide, GHK-Cu, HGH and Semax are in stock", () => {
    const inStock = PRODUCTS.filter((p) => !isSoldOut(p))
      .map((p) => p.slug)
      .sort();
    expect(inStock).toEqual([
      "ghk-cu",
      "hgh",
      "lipo-c-b12",
      "mots-c",
      "retatrutide",
      "semax",
      "tirzepatide",
    ]);
  });

  it("in-stock peptides come in 5, 10 and 20 mg", () => {
    for (const slug of ["retatrutide", "tirzepatide", "semax"]) {
      const p = PRODUCTS.find((x) => x.slug === slug);
      expect(p?.sizes.map((s) => s.label)).toEqual(["5 mg", "10 mg", "20 mg"]);
    }
  });
});

describe("confirmed prices", () => {
  const price = (slug: string, size: string) =>
    PRODUCTS.find((p) => p.slug === slug)?.sizes.find((s) => s.label === size)?.price;
  it("Retatrutide is $35/$50/$95", () =>
    expect([
      price("retatrutide", "5 mg"),
      price("retatrutide", "10 mg"),
      price("retatrutide", "20 mg"),
    ]).toEqual([35, 50, 95]));
  it("Tirzepatide 5 mg $29.99, 10 mg $50, 20 mg $85", () =>
    expect([
      price("tirzepatide", "5 mg"),
      price("tirzepatide", "10 mg"),
      price("tirzepatide", "20 mg"),
    ]).toEqual([29.99, 50, 85]));
  it("Semax 5/10/20 mg $25/$35/$45", () =>
    expect([price("semax", "5 mg"), price("semax", "10 mg"), price("semax", "20 mg")]).toEqual([
      25, 35, 45,
    ]));
  it("MOTS-c 10/20 mg $40/$89, 5 mg $25 sold out but shown as from-price", () => {
    const p = PRODUCTS.find((x) => x.slug === "mots-c")!;
    expect([price("mots-c", "10 mg"), price("mots-c", "20 mg")]).toEqual([40, 89]);
    expect(isSizeAvailable(p, "5 mg")).toBe(false);
    expect(startingPrice(p)).toBe(25);
  });
  it("Lipo-C with B12 is $35, was $60, in a 10 mL vial", () => {
    const p = PRODUCTS.find((x) => x.slug === "lipo-c-b12");
    expect([p?.sizes[0]?.label, p?.sizes[0]?.price, p?.compareAt, p?.form]).toEqual([
      "10 mL",
      35,
      60,
      "Solution, 10 mL vial",
    ]);
  });
  it("GHK-Cu only 50 mg at $20", () =>
    expect(PRODUCTS.find((p) => p.slug === "ghk-cu")?.sizes).toEqual([
      { label: "50 mg", price: 20 },
    ]));
  it("Somatropin $40 lowest, $50 highest", () =>
    expect([price("hgh", "10 IU"), price("hgh", "100 IU kit")]).toEqual([40, 50]));
});

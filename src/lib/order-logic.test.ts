import { describe, expect, it } from "vitest";
import {
  generateOrderRef,
  isValidOrderRef,
  priceOrder,
  validateProof,
  MAX_PROOF_BYTES,
  orderFieldsSchema,
} from "./order-logic";
import { POLICY_VERSION } from "./store-policy";

describe("checkout order rules", () => {
  it("charges a flat $2 processing fee with no lab-tools item", () => {
    const items = [{ slug: "retatrutide", size: "5 mg", qty: 1 }];
    const priced = priceOrder(items);
    expect(priced?.subtotal).toBe(35);
    expect(priced?.shipping).toBe(9);
    expect(priced?.processingFee).toBe(2);
    expect(priced?.total).toBe(46);
    expect(priced?.lines.map((line) => line.slug)).toEqual(["retatrutide"]);
  });

  it("does not let the $2 processing fee qualify merchandise for free shipping", () => {
    const priced = priceOrder([{ slug: "retatrutide", size: "10 mg", qty: 3 }]);
    expect(priced?.subtotal).toBe(150);
    expect(priced?.shipping).toBe(9);
    expect(priced?.processingFee).toBe(2);
    expect(priced?.total).toBe(161);
  });

  it("rejects the canceled lab-tools set even when submitted directly", () => {
    expect(priceOrder([{ slug: "research-lab-tools", size: "Set", qty: 1 }])).toBeNull();
    expect(
      priceOrder([
        { slug: "retatrutide", size: "5 mg", qty: 1 },
        { slug: "research-lab-tools", size: "Set", qty: 1 },
      ]),
    ).toBeNull();
  });

  it("prices orders from the catalog, not from the browser", () => {
    const priced = priceOrder([
      { slug: "retatrutide", size: "10 mg", qty: 2 }, // 50 each
      { slug: "hgh", size: "10 IU", qty: 1 }, // 40
    ]);
    expect(priced?.subtotal).toBe(140);
    expect(priced?.shipping).toBe(9);
    expect(priced?.total).toBe(151);
  });

  it("recomputes free shipping from catalog prices on orders over $150", () => {
    const priced = priceOrder([{ slug: "retatrutide", size: "20 mg", qty: 2 }]);
    expect(priced?.subtotal).toBe(190);
    expect(priced?.shipping).toBe(0);
    expect(priced?.processingFee).toBe(2);
    expect(priced?.total).toBe(192);
  });

  it("requires affirmative acceptance of current store policies", () => {
    const fields = {
      orderRef: "AU-ABCDEF",
      customerName: "Test Researcher",
      email: "test@example.com",
      organization: "Test Lab",
      address: "123 Test Street",
      city: "Miami",
      state: "FL",
      zip: "33182",
      paymentMethod: "zelle",
      researchOnly: "true",
      termsAccepted: "true",
      policyVersion: POLICY_VERSION,
    };
    expect(orderFieldsSchema.safeParse(fields).success).toBe(true);
    expect(orderFieldsSchema.safeParse({ ...fields, termsAccepted: "false" }).success).toBe(false);
    expect(orderFieldsSchema.safeParse({ ...fields, policyVersion: "old" }).success).toBe(false);
  });

  it("rejects orders containing a sold-out peptide or size", () => {
    expect(priceOrder([{ slug: "cjc-1295-ipamorelin", size: "5 mg / 5 mg", qty: 1 }])).toBeNull();
    expect(priceOrder([{ slug: "hgh", size: "100 IU kit", qty: 1 }])).toBeNull();
    expect(
      priceOrder([
        { slug: "retatrutide", size: "20 mg", qty: 1 },
        { slug: "kpv", size: "10 mg", qty: 1 },
      ]),
    ).toBeNull();
  });

  it("rejects unknown products, unknown sizes and empty carts", () => {
    expect(priceOrder([{ slug: "not-real", size: "5 mg", qty: 1 }])).toBeNull();
    expect(priceOrder([{ slug: "hgh", size: "999 IU", qty: 1 }])).toBeNull();
    expect(priceOrder([])).toBeNull();
  });

  it("requires a payment screenshot image of 10 MB or less", () => {
    expect(validateProof(null)).not.toBeNull();
    expect(validateProof({ type: "application/pdf", size: 1000 })).not.toBeNull();
    expect(validateProof({ type: "image/png", size: MAX_PROOF_BYTES + 1 })).not.toBeNull();
    expect(validateProof({ type: "image/jpeg", size: 200_000 })).toBeNull();
  });

  it("generates order references customers can put in the payment memo", () => {
    const ref = generateOrderRef();
    expect(isValidOrderRef(ref)).toBe(true);
    expect(isValidOrderRef("AU-12")).toBe(false);
  });
});

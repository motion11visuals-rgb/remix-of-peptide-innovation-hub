import { describe, expect, it } from "vitest";
import { getProduct } from "./products";
import { productHead } from "./product-seo";

function offersFor(slug: string) {
  const product = getProduct(slug);
  if (!product) throw new Error(`Missing catalog product: ${slug}`);
  const script = productHead(product).scripts[0];
  if (!script) throw new Error("Missing product data");
  const data = JSON.parse(script.children) as { "@graph": { offers?: { price: string; availability: string }[] }[] };
  const offers = data["@graph"][0]?.offers;
  if (!offers) throw new Error("Missing product offers");
  return offers;
}

describe("search offers use confirmed catalog values", () => {
  it("Retatrutide advertises $35/$50/$95", () => {
    expect(offersFor("retatrutide").map((offer) => offer.price)).toEqual(["35.00", "50.00", "95.00"]);
  });
  it("GHK-Cu advertises its $20 vial", () => {
    expect(offersFor("ghk-cu").map((offer) => offer.price)).toEqual(["20.00"]);
  });
  it("HGH advertises 10 IU in stock and the 100 IU kit sold out", () => {
    expect(offersFor("hgh").map((offer) => offer.availability)).toEqual(["https://schema.org/InStock", "https://schema.org/OutOfStock"]);
  });
  it("BPC-157 does not advertise sold-out sizes as available", () => {
    expect(offersFor("bpc-157").map((offer) => offer.availability)).toEqual(["https://schema.org/OutOfStock", "https://schema.org/OutOfStock"]);
  });
});
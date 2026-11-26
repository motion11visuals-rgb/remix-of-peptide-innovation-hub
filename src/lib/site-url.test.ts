import { describe, expect, it } from "vitest";
import { siteUrl, SITE_ORIGIN } from "./site-url";
import { sitemapXML } from "./sitemap";

describe("public HTTPS addresses", () => {
  it("uses the live site's final www HTTPS homepage", () => {
    expect(siteUrl("/")).toBe("https://www.synthesialabsofficial.com/");
  });
  it("keeps catalog pages on the same secure host", () => {
    expect(siteUrl("/products/retatrutide")).toBe("https://www.synthesialabsofficial.com/products/retatrutide");
    expect(siteUrl("/china-warehouse")).toBe("https://www.synthesialabsofficial.com/china-warehouse");
  });
  it("rejects another host", () => {
    expect(() => siteUrl("//other.example/")).toThrow();
    expect(() => siteUrl("https://other.example/")).toThrow();
  });
  it("emits sitemap URLs at the same HTTPS destination", () => {
    expect(sitemapXML(SITE_ORIGIN, [{ path: "/" }, { path: "/products" }])).toContain("<loc>https://www.synthesialabsofficial.com/products</loc>");
  });
});
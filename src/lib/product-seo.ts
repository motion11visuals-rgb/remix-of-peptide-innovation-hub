import { BRAND, isSizeAvailable, type Product } from "./products";

/** Browser-safe metadata derived from the same catalog used to price orders. */
export function productHead(product: Product) {
  const compound = product.fullName.split(" (")[0] ?? product.fullName;
  const name = compound.toLowerCase().startsWith(product.name.toLowerCase())
    ? compound
    : `${product.name} (${compound})`;
  const searchName = product.name.startsWith("GLP-") ? compound : product.name;
  const title = `${searchName} | Research Use Only | ${BRAND.name}`;
  const sizes = product.sizes.map((size) => size.label).join(", ");
  const description = `${name}: ${sizes}. ${product.summary} Laboratory research use only; facility COA available on request.`;
  const url = `/products/${product.slug}`;

  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "product" },
      { property: "og:url", content: url },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
    links: [{ rel: "canonical", href: url }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Product",
            "@id": `${url}#product`,
            url,
            name: `${product.name} — ${product.fullName}`,
            alternateName: product.fullName,
            description: `${product.description} ${BRAND.disclaimer}`,
            sku: product.slug,
            category: product.category,
            brand: { "@type": "Brand", name: BRAND.name },
            additionalProperty: [
              { "@type": "PropertyValue", name: "CAS number", value: product.cas },
              { "@type": "PropertyValue", name: "Purity", value: product.purity },
              { "@type": "PropertyValue", name: "Form", value: product.form },
              { "@type": "PropertyValue", name: "Molecular formula", value: product.formula },
              { "@type": "PropertyValue", name: "Molecular weight", value: product.molecularWeight },
            ],
            offers: product.sizes.map((size) => ({
              "@type": "Offer",
              "@id": `${url}#offer-${encodeURIComponent(size.label)}`,
              name: `${product.name} ${size.label}`,
              sku: `${product.slug}-${size.label.replaceAll(" ", "-")}`,
              price: size.price.toFixed(2),
              priceCurrency: "USD",
              url,
              itemCondition: "https://schema.org/NewCondition",
              availability: isSizeAvailable(product, size.label)
                ? "https://schema.org/InStock"
                : "https://schema.org/OutOfStock",
              seller: { "@type": "Organization", name: BRAND.name },
            })),
          },
          {
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: BRAND.name, item: "/" },
              { "@type": "ListItem", position: 2, name: "Research catalog", item: "/products" },
              { "@type": "ListItem", position: 3, name, item: url },
            ],
          },
        ],
      }),
    }],
  };
}
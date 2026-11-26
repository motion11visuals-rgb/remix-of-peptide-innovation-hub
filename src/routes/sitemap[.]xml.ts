import { SITE_ORIGIN } from "@/lib/site-url";
import { createFileRoute } from "@tanstack/react-router";
import { getRouterInstance } from "@tanstack/react-start";
import { isSitemapRouteIncluded, sitemapPathForLocation, sitemapStaticPaths, sitemapXML, type SitemapEntry } from "@/lib/sitemap";
import { PRODUCTS } from "@/lib/products";
import { KITS } from "@/lib/china-warehouse";

const BASE_URL = SITE_ORIGIN;

export const Route = createFileRoute("/sitemap.xml")({
  staticData: { sitemap: false },
  server: {
    handlers: {
      GET: async () => {
        const router = await getRouterInstance();
        const entries: SitemapEntry[] = sitemapStaticPaths(router).map((path) => ({ path }));

        // Product pages come from the same static catalog that prices orders.
        const productRoute = router.routesById["/products/$slug"];
        if (isSitemapRouteIncluded(productRoute)) {
          for (const product of PRODUCTS) {
            const location = router.buildLocation({
              to: "/products/$slug",
              params: { slug: product.slug },
              search: () => ({}),
              hash: "",
            });
            const path = sitemapPathForLocation(router, location, "/products/$slug");
            if (path) entries.push({ path });
          }
        }

        for (const kit of KITS) entries.push({ path: `/china-warehouse/${kit.slug}` });

        if (entries.length === 0) {
          return new Response(
            'No pages are included in this sitemap. Check route decisions and ancestor exclusions. Setting "exclude-subtree" on the root excludes the entire site.',
            { status: 404, headers: { "Cache-Control": "no-store" } },
          );
        }
        return new Response(sitemapXML(BASE_URL, entries), {
          headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});

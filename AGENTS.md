<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

## Project rules
- Product search metadata and per-size structured offers are derived from the catalog in `src/lib/product-seo.ts` so search prices and availability stay aligned with shopping pages; use relative page URLs until a public domain is known.
- Product catalog lives in a single static data module (`src/lib/products.ts`); pages read from it so adding a product needs no route changes.
- Shared header/footer wrap `<Outlet />` in `src/routes/__root.tsx`; pages render only their own content.
- Cart state lives in a browser-local provider (`src/lib/cart.tsx`) with pure math in `src/lib/cart-logic.ts` (tested); checkout hands the cart summary to the contact form because no payment provider is connected.
- Visitor entry gate rules live in `src/lib/research-gate.ts` (tested) and are stored per browser; the gate overlay mounts once in `__root.tsx`.
- Checkout writes orders and payment screenshots only through the `submitOrder` server function (`src/lib/orders.functions.ts`), which re-prices from the catalog; the orders table and payment-proofs bucket have no visitor access.
- Checkout uses a visible native image picker and applies `normalizeProof` in both selection and server submission for missing phone MIME types; shared validation preserves supported image formats and the 10 MB limit.
- Marketing opt-in emails from the entry gate go only to the private `marketing_signups` table via `subscribeMarketing` (src/lib/marketing.functions.ts); promos are sent from an external newsletter service, never the app-email sender.
- Shipping math lives in `src/lib/store-policy.ts` and is reused by checkout and server pricing; persist subtotal, shipping, total, and accepted policy version separately so payment instructions match saved orders.
- Checkout fees derive from `store-policy.ts` and server pricing; persist `processing_fee` separately from merchandise and shipping, and retain deprecated lab-tools data only for historical orders.
- Each legal policy has a distinct route with shared `PolicyPage` presentation; policy pages remain accessible without the research gate so visitors can read terms before agreeing.
- All catalog, product, cart, and checkout vial pictures use `VialImage` with an explicit liquid flag so product appearance stays consistent across shopping views.
- Processing-day bounds and their display label live in `store-policy.ts` so homepage, shipping policy, and checkout share the tested time range.
- Owner order view at /admin/orders (src/routes/_authenticated/admin.orders.tsx) reads orders via admin-checked listOrders in src/lib/admin.functions.ts; roles live in user_roles so order data never reaches visitors.

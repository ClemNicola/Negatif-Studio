# Shopify Hydrogen development

This storefront is scaffolded from Shopify's Hydrogen skeleton template. See the README for framework-specific details.

Use the [Shopify AI Toolkit](https://shopify.dev/docs/apps/build/ai-toolkit) for all Shopify API and platform work. If missing, install it in the agent host per that page (or `npx skills add Shopify/shopify-ai-toolkit --list` for skill-compatible hosts).

## Routing

Routes are declared **explicitly** in `app/routes.ts` — `flatRoutes()` is no longer
used, so files under `app/routes/` are grouped by domain (`account/`, `cart/`,
`collections/`, `seo/`…) instead of by filename.

Consequence: **adding a file under `app/routes/` does nothing on its own.** Register
it in `app/routes.ts` with `route(path, file)`, or it is never served.

- Every storefront route sits under the optional `:locale?` segment, so
  `/collections/all` and `/en-us/collections/all` hit the same file.
- `routes/locale.tsx` has no default export: it validates the locale param and lets
  the matched child render.
- A route's `+types` module is named after its file — `account/profile.tsx` imports
  `./+types/profile`. Rename a file, update that import.
- After touching `app/routes.ts`, run `npm run typecheck` (it runs `react-router typegen` first).

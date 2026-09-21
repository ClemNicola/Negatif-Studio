import {type RouteConfig, index, route} from '@react-router/dev/routes';
import {hydrogenRoutes} from '@shopify/hydrogen';

/**
 * Routes are declared explicitly rather than through `flatRoutes()` so the
 * files can be grouped by domain (`account/`, `cart/`, `collections/`…).
 * The file-based convention only reads flat filenames, so the two are mutually
 * exclusive — the URL a file serves is now defined here, not by its name.
 */
export default hydrogenRoutes([
  // Served at the domain root only, never under a locale prefix.
  route('robots.txt', 'routes/seo/robots.tsx'),

  /**
   * Every storefront route hangs off an optional `:locale` segment, so
   * `/collections/all` and `/en-us/collections/all` resolve to the same file.
   * `locale.tsx` has no default export: it only validates the param and lets
   * the matched child render.
   */
  route(':locale?', 'routes/locale.tsx', [
    index('routes/home.tsx'),

    route('studio', 'routes/studio/index.tsx'),
    route('contact', 'routes/contact/index.tsx'),
    route('search', 'routes/search/index.tsx'),
    route('discount/:code', 'routes/discount/$code.tsx'),

    route('collections', 'routes/collections/index.tsx'),
    route('collections/all', 'routes/collections/all.tsx'),
    route('collections/:handle', 'routes/collections/$handle.tsx'),

    route('products/:handle', 'routes/products/$handle.tsx'),
    route('pages/:handle', 'routes/pages/$handle.tsx'),

    route('policies', 'routes/policies/index.tsx'),
    route('policies/:handle', 'routes/policies/$handle.tsx'),

    route('cart', 'routes/cart/index.tsx'),
    route('cart/:lines', 'routes/cart/$lines.tsx'),

    /**
     * `account/layout.tsx` guards the logged-in area, so login, logout and the
     * OAuth callback have to sit outside of it — flat routes spelled this
     * `account_.login`, the trailing underscore opting out of the parent.
     */
    route('account/login', 'routes/account/login.tsx'),
    route('account/logout', 'routes/account/logout.tsx'),
    route('account/authorize', 'routes/account/authorize.tsx'),
    route('account', 'routes/account/layout.tsx', [
      index('routes/account/index.tsx'),
      route('orders', 'routes/account/orders.tsx'),
      route('orders/:id', 'routes/account/orders.$id.tsx'),
      route('profile', 'routes/account/profile.tsx'),
      route('addresses', 'routes/account/addresses.tsx'),
      route('*', 'routes/account/$.tsx'),
    ]),

    route('sitemap.xml', 'routes/seo/sitemap-index.tsx'),
    route('sitemap/:type/:page.xml', 'routes/seo/sitemap.$type.$page.tsx'),

    route('*', 'routes/not-found.tsx'),
  ]),
]) satisfies RouteConfig;

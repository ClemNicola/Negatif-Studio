import {Suspense} from 'react';
import {Await, NavLink, useAsyncValue} from 'react-router';
import {
  type CartViewPayload,
  useAnalytics,
  useOptimisticCart,
} from '@shopify/hydrogen';
import type {HeaderQuery, CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';

interface HeaderProps {
  header: HeaderQuery;
  cart: Promise<CartApiQueryFragment | null>;
  isLoggedIn: Promise<boolean>;
}

type Viewport = 'desktop' | 'mobile';

const HEADER_NAV = [
  {title: 'Prints', to: '/collections/all'},
  {title: 'Studio', to: '/pages/studio'},
] as const;

export function Header({header, isLoggedIn, cart}: HeaderProps) {
  const {shop} = header;
  return (
    <header className="header">
      <HeaderMenu viewport="desktop" />
      <NavLink
        prefetch="intent"
        to="/"
        className="text-3xl font-extrabold font-clash-display tracking-wider"
        end
      >
        {shop.name}
      </NavLink>
      <HeaderCtas isLoggedIn={isLoggedIn} cart={cart} />
    </header>
  );
}

export function HeaderMenu({viewport}: {viewport: Viewport}) {
  const {close} = useAside();

  return (
    <nav
      className={`header-menu-${viewport} font-clash-grotesk text-xl`}
      role="navigation"
    >
      {HEADER_NAV.map((item) => (
        <NavLink
          className="header-menu-item link-underline"
          end
          key={item.to}
          onClick={close}
          prefetch="intent"
          style={activeLinkStyle}
          to={item.to}
        >
          {item.title}
        </NavLink>
      ))}
    </nav>
  );
}

function HeaderCtas({
  isLoggedIn,
  cart,
}: Pick<HeaderProps, 'isLoggedIn' | 'cart'>) {
  return (
    <nav className="header-ctas font-clash-grotesk text-xl" role="navigation">
      <HeaderMenuMobileToggle />
      <Suspense fallback={null}>
        <Await resolve={isLoggedIn} errorElement={null}>
          {(isLoggedIn) =>
            isLoggedIn ? (
              <NavLink
                prefetch="intent"
                to="/account"
                className="link-underline"
                style={activeLinkStyle}
              >
                Account
              </NavLink>
            ) : null
          }
        </Await>
      </Suspense>
      <SearchToggle />
      <CartToggle cart={cart} />
    </nav>
  );
}

function HeaderMenuMobileToggle() {
  const {open} = useAside();
  return (
    <button
      className="header-menu-mobile-toggle reset"
      onClick={() => open('mobile')}
    >
      <h3>☰</h3>
    </button>
  );
}

function SearchToggle() {
  const {open} = useAside();
  return (
    <button className="reset" onClick={() => open('search')}>
      Search
    </button>
  );
}

function CartBadge({count}: {count: number}) {
  const {open} = useAside();
  const {publish, shop, cart, prevCart} = useAnalytics();

  return (
    <a
      href="/cart"
      onClick={(e) => {
        e.preventDefault();
        open('cart');
        publish('cart_viewed', {
          cart,
          prevCart,
          shop,
          url: window.location.href || '',
        } as CartViewPayload);
      }}
    >
      Cart <span aria-label={`(items: ${count})`}>({count})</span>
    </a>
  );
}

function CartToggle({cart}: Pick<HeaderProps, 'cart'>) {
  return (
    <Suspense fallback={<CartBadge count={0} />}>
      <Await resolve={cart}>
        <CartBanner />
      </Await>
    </Suspense>
  );
}

function CartBanner() {
  const originalCart = useAsyncValue() as CartApiQueryFragment | null;
  const cart = useOptimisticCart(originalCart);
  return <CartBadge count={cart?.totalQuantity ?? 0} />;
}

function activeLinkStyle({isPending}: {isActive: boolean; isPending: boolean}) {
  return {
    color: isPending ? 'grey' : 'var(--color-text)',
  };
}

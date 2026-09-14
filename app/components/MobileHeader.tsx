import {Suspense, useState} from 'react';
import {Await, NavLink, useAsyncValue} from 'react-router';
import {
  type CartViewPayload,
  useAnalytics,
  useOptimisticCart,
} from '@shopify/hydrogen';
import type {
  CartApiQueryFragment,
  HeaderQuery,
  PrintsMenuQuery,
} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';
import {usePageTransition} from './TransitionPage';

interface MobileHeaderProps {
  shop: HeaderQuery['shop'];
  cart: Promise<CartApiQueryFragment | null>;
  printsMenu: Promise<PrintsMenuQuery | null>;
}

const HIDDEN_COLLECTIONS = ['all', 'frontpage'];

export function MobileHeader({shop, cart, printsMenu}: MobileHeaderProps) {
  const {type, open, close} = useAside();
  const isMenuOpen = type === 'mobile';
  const {navigateWithCurtain} = usePageTransition();
  return (
    <>
      <header className="mobile-header">
        <button
          aria-controls="mobile-menu"
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          className="mobile-header-button"
          onClick={() => (isMenuOpen ? close() : open('mobile'))}
        >
          {isMenuOpen ? <CloseIcon /> : <BurgerIcon />}
        </button>

        <NavLink
          className="mobile-header-logo font-clash-display"
          end
          onClick={(event) => {
            if (
              event.button !== 0 ||
              event.metaKey ||
              event.ctrlKey ||
              event.shiftKey
            ) {
              return;
            }
            event.preventDefault();
            navigateWithCurtain('/');
            close();
          }}
          prefetch="intent"
          to="/"
        >
          {shop.name}
        </NavLink>

        <div className="mobile-header-actions">
          <button
            aria-label="Search"
            className="mobile-header-button"
            onClick={() => open('search')}
          >
            <SearchIcon />
          </button>
          <MobileCartToggle cart={cart} />
        </div>
      </header>

      {/* Reserves the fixed bar's space in the flow. */}
      <div aria-hidden className="mobile-header-spacer" />

      <MobileMenu isOpen={isMenuOpen} onClose={close} printsMenu={printsMenu} />
    </>
  );
}

function MobileMenu({
  isOpen,
  onClose,
  printsMenu,
}: {
  isOpen: boolean;
  onClose: () => void;
  printsMenu: Promise<PrintsMenuQuery | null>;
}) {
  const {navigateWithCurtain} = usePageTransition();
  return (
    <div
      className={`mobile-menu${isOpen ? ' expanded' : ''}`}
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
    >
      <nav className="mobile-menu-nav font-clash-grotesk">
        <MobileMenuAccordion title="Prints" onClose={onClose}>
          <Suspense fallback={null}>
            <Await resolve={printsMenu} errorElement={null}>
              {(menu) => (
                <>
                  <NavLink
                    className="mobile-menu-sublink"
                    onClick={(event) => {
                      if (
                        event.button !== 0 ||
                        event.metaKey ||
                        event.ctrlKey ||
                        event.shiftKey
                      ) {
                        onClose();
                        return;
                      }
                      event.preventDefault();
                      navigateWithCurtain('/collections/all');
                      onClose();
                    }}
                    prefetch="intent"
                    to="/collections/all"
                  >
                    All prints
                  </NavLink>
                  {(menu?.collections.nodes ?? [])
                    .filter(
                      (collection) =>
                        !HIDDEN_COLLECTIONS.includes(collection.handle),
                    )
                    .map((collection) => (
                      <NavLink
                        className="mobile-menu-sublink"
                        key={collection.handle}
                        onClick={(event) => {
                          if (
                            event.button !== 0 ||
                            event.metaKey ||
                            event.ctrlKey ||
                            event.shiftKey
                          ) {
                            onClose();
                            return;
                          }
                          event.preventDefault();
                          navigateWithCurtain(
                            `/collections/${collection.handle}`,
                          );
                          onClose();
                        }}
                        prefetch="intent"
                        to={`/collections/${collection.handle}`}
                      >
                        {collection.title}
                      </NavLink>
                    ))}
                </>
              )}
            </Await>
          </Suspense>
        </MobileMenuAccordion>

        <NavLink
          className="mobile-menu-link"
          end
          onClick={(event) => {
            if (
              event.button !== 0 ||
              event.metaKey ||
              event.ctrlKey ||
              event.shiftKey
            ) {
              onClose();
              return;
            }
            event.preventDefault();
            navigateWithCurtain('/studio');
            onClose();
          }}
          prefetch="intent"
          to="/studio"
        >
          Studio
        </NavLink>
      </nav>
    </div>
  );
}

function MobileMenuAccordion({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const panelId = `mobile-menu-${title.toLowerCase()}`;

  return (
    <div className="mobile-menu-group">
      <button
        aria-controls={panelId}
        aria-expanded={isExpanded}
        className="mobile-menu-link mobile-menu-trigger"
        onClick={() => setIsExpanded((expanded) => !expanded)}
      >
        {title}
        <ChevronIcon />
      </button>
      <div
        className={`mobile-menu-panel${isExpanded ? ' expanded' : ''}`}
        id={panelId}
      >
        <div className="mobile-menu-panel-inner">{children}</div>
      </div>
    </div>
  );
}

function MobileCartToggle({cart}: {cart: MobileHeaderProps['cart']}) {
  return (
    <Suspense fallback={<MobileCartBadge count={0} />}>
      <Await resolve={cart}>
        <MobileCartBanner />
      </Await>
    </Suspense>
  );
}

function MobileCartBanner() {
  const originalCart = useAsyncValue() as CartApiQueryFragment | null;
  const cart = useOptimisticCart(originalCart);
  return <MobileCartBadge count={cart?.totalQuantity ?? 0} />;
}

function MobileCartBadge({count}: {count: number}) {
  const {open} = useAside();
  const {publish, shop, cart, prevCart} = useAnalytics();

  return (
    <a
      aria-label={`Cart (items: ${count})`}
      className="mobile-header-button mobile-header-cart"
      href="/cart"
      onClick={(event) => {
        event.preventDefault();
        open('cart');
        publish('cart_viewed', {
          cart,
          prevCart,
          shop,
          url: window.location.href || '',
        } as CartViewPayload);
      }}
    >
      <CartIcon />
      {count > 0 ? (
        <span aria-hidden className="mobile-header-cart-count">
          {count}
        </span>
      ) : null}
    </a>
  );
}

function BurgerIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden focusable="false">
      <path d="M3 8h18M3 16h18" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden focusable="false">
      <path d="M5 5l14 14M19 5L5 19" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden focusable="false">
      <circle cx="11" cy="11" r="7" />
      <path d="M16.5 16.5L21 21" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden focusable="false">
      <path d="M4 7h16l-1.2 13.5H5.2L4 7z" />
      <path d="M8.5 9.5V6a3.5 3.5 0 017 0v3.5" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg
      className="mobile-menu-chevron"
      viewBox="0 0 24 24"
      aria-hidden
      focusable="false"
    >
      <path d="M6 9.5l6 6 6-6" />
    </svg>
  );
}

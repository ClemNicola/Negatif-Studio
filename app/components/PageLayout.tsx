import {Await, Link, useAsyncValue} from 'react-router';
import {useOptimisticCart} from '@shopify/hydrogen';
import {Suspense, useId} from 'react';
import type {
  CartApiQueryFragment,
  HeaderQuery,
  PrintsMenuQuery,
} from 'storefrontapi.generated';
import {Aside} from '~/components/Aside';
import {Footer} from '~/components/Footer';
import {Header} from '~/components/Header';
import {CartMain} from '~/components/CartMain';
import {
  SEARCH_ENDPOINT,
  SearchFormPredictive,
} from '~/components/SearchFormPredictive';
import {SearchResultsPredictive} from '~/components/SearchResultsPredictive';

interface PageLayoutProps {
  cart: Promise<CartApiQueryFragment | null>;
  header: HeaderQuery;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
  printsMenu: Promise<PrintsMenuQuery | null>;
  children?: React.ReactNode;
}

export function PageLayout({
  cart,
  children = null,
  header,
  isLoggedIn,
  printsMenu,
}: PageLayoutProps) {
  return (
    <Aside.Provider>
      <CartAside cart={cart} />
      <SearchAside />
      {header && (
        <Header
          header={header}
          cart={cart}
          isLoggedIn={isLoggedIn}
          printsMenu={printsMenu}
        />
      )}
      <main>{children}</main>
      <Footer />
    </Aside.Provider>
  );
}

function CartAside({cart}: {cart: PageLayoutProps['cart']}) {
  return (
    <Aside
      type="cart"
      heading={
        <Suspense fallback="Cart">
          <Await resolve={cart} errorElement="Cart">
            <CartAsideHeading />
          </Await>
        </Suspense>
      }
    >
      <Suspense fallback={<p>Loading cart ...</p>}>
        <Await resolve={cart}>
          {(cart) => {
            return <CartMain cart={cart} layout="aside" />;
          }}
        </Await>
      </Suspense>
    </Aside>
  );
}

function CartAsideHeading() {
  const originalCart = useAsyncValue() as CartApiQueryFragment | null;
  const cart = useOptimisticCart(originalCart);
  return <>Cart ({cart?.totalQuantity ?? 0})</>;
}

function SearchAside() {
  const queriesDatalistId = useId();
  return (
    <Aside type="search" heading="SEARCH">
      <div className="predictive-search">
        <SearchFormPredictive>
          {({fetchResults, inputRef}) => (
            <div className="search-field">
              <label className="sr-only" htmlFor="predictive-search-input">
                Search
              </label>
              <input
                className="search-input font-clash-grotesk"
                id="predictive-search-input"
                list={queriesDatalistId}
                name="q"
                onChange={fetchResults}
                onFocus={fetchResults}
                placeholder="Search prints"
                ref={inputRef}
                type="search"
              />
              <button
                className="search-submit link-underline font-clash-grotesk"
                type="submit"
              >
                Search
              </button>
            </div>
          )}
        </SearchFormPredictive>

        <SearchResultsPredictive>
          {({items, total, term, state, closeSearch}) => {
            const {articles, collections, pages, products, queries} = items;

            if (state === 'loading' && term.current) {
              return (
                <div className="predictive-search-message">Searching…</div>
              );
            }

            if (!total) {
              return <SearchResultsPredictive.Empty term={term} />;
            }

            return (
              <>
                <SearchResultsPredictive.Queries
                  queries={queries}
                  queriesDatalistId={queriesDatalistId}
                />
                <SearchResultsPredictive.Products
                  products={products}
                  closeSearch={closeSearch}
                  term={term}
                />
                <SearchResultsPredictive.Collections
                  collections={collections}
                  closeSearch={closeSearch}
                  term={term}
                />
                <SearchResultsPredictive.Pages
                  pages={pages}
                  closeSearch={closeSearch}
                  term={term}
                />
                <SearchResultsPredictive.Articles
                  articles={articles}
                  closeSearch={closeSearch}
                  term={term}
                />
                {term.current && total ? (
                  <Link
                    className="predictive-search-message link-underline font-clash-grotesk w-fit uppercase tracking-widest"
                    onClick={closeSearch}
                    to={`${SEARCH_ENDPOINT}?q=${term.current}`}
                  >
                    View all results →
                  </Link>
                ) : null}
              </>
            );
          }}
        </SearchResultsPredictive>
      </div>
    </Aside>
  );
}

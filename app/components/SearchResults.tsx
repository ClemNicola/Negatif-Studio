import {Link} from 'react-router';
import {Image, Money, Pagination} from '@shopify/hydrogen';
import {urlWithTrackingParams, type RegularSearchReturn} from '~/lib/search';

type SearchItems = RegularSearchReturn['result']['items'];
type PartialSearchResult<ItemType extends keyof SearchItems> = Pick<
  SearchItems,
  ItemType
> &
  Pick<RegularSearchReturn, 'term'>;

type SearchResultsProps = RegularSearchReturn & {
  children: (args: SearchItems & {term: string}) => React.ReactNode;
};

export function SearchResults({
  term,
  result,
  children,
}: Omit<SearchResultsProps, 'error' | 'type'>) {
  if (!result?.total) {
    return null;
  }

  return children({...result.items, term});
}

SearchResults.Articles = SearchResultsArticles;
SearchResults.Pages = SearchResultsPages;
SearchResults.Products = SearchResultsProducts;
SearchResults.Empty = SearchResultsEmpty;

function SearchResultsArticles({
  term,
  articles,
}: PartialSearchResult<'articles'>) {
  if (!articles?.nodes.length) {
    return null;
  }

  return (
    <div className="search-result">
      <h2 className="search-page-heading">Articles</h2>
      <div className="search-results-list">
        {articles?.nodes?.map((article) => {
          const articleUrl = urlWithTrackingParams({
            baseUrl: `/blogs/${article.handle}`,
            trackingParams: article.trackingParameters,
            term,
          });

          return (
            <div className="search-results-item" key={article.id}>
              <Link
                className="link-underline w-fit text-sm md:text-base"
                prefetch="intent"
                to={articleUrl}
              >
                {article.title}
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SearchResultsPages({term, pages}: PartialSearchResult<'pages'>) {
  if (!pages?.nodes.length) {
    return null;
  }

  return (
    <div className="search-result">
      <h2 className="search-page-heading">Pages</h2>
      <div className="search-results-list">
        {pages?.nodes?.map((page) => {
          const pageUrl = urlWithTrackingParams({
            baseUrl: `/pages/${page.handle}`,
            trackingParams: page.trackingParameters,
            term,
          });

          return (
            <div className="search-results-item" key={page.id}>
              <Link
                className="link-underline w-fit text-sm md:text-base"
                prefetch="intent"
                to={pageUrl}
              >
                {page.title}
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SearchResultsProducts({
  term,
  products,
}: PartialSearchResult<'products'>) {
  if (!products?.nodes.length) {
    return null;
  }

  return (
    <div className="search-result">
      <h2 className="search-page-heading">Products</h2>
      <Pagination connection={products}>
        {({nodes, isLoading, NextLink, PreviousLink}) => {
          const ItemsMarkup = nodes.map((product) => {
            const productUrl = urlWithTrackingParams({
              baseUrl: `/products/${product.handle}`,
              trackingParams: product.trackingParameters,
              term,
            });

            const price = product?.selectedOrFirstAvailableVariant?.price;
            const image = product?.selectedOrFirstAvailableVariant?.image;

            return (
              <div className="search-results-item" key={product.id}>
                <Link className="group block" prefetch="intent" to={productUrl}>
                  {image && (
                    <div className="relative overflow-hidden">
                      <Image
                        alt={image.altText || product.title}
                        aspectRatio="9/12"
                        className="hover:image-invert transition-all duration-300"
                        data={image}
                        sizes="(min-width: 48em) 500px, 50vw"
                      />
                    </div>
                  )}
                  <div className="flex justify-between">
                    <h4 className="self-start text-sm md:text-base">
                      {product.title}
                    </h4>
                    {price ? (
                      <Money
                        className="text-xs md:text-sm font-clash-grotesk"
                        data={price}
                      />
                    ) : null}
                  </div>
                </Link>
              </div>
            );
          });

          return (
            <div>
              <div className="flex justify-center">
                <PreviousLink className="link-underline text-sm uppercase tracking-widest font-clash-grotesk">
                  {isLoading ? 'Loading…' : <span>↑ Load previous</span>}
                </PreviousLink>
              </div>
              <div className="search-results-grid">{ItemsMarkup}</div>
              <div className="flex justify-center">
                <NextLink className="button-slide px-6 py-3 text-base md:px-8 md:py-4 md:text-xl uppercase font-normal font-clash-grotesk">
                  {isLoading ? 'Loading…' : 'Load more'}
                </NextLink>
              </div>
            </div>
          );
        }}
      </Pagination>
    </div>
  );
}

function SearchResultsEmpty() {
  return (
    <p className="text-sm md:text-base">No results, try a different search.</p>
  );
}

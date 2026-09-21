import {redirect, useLoaderData, Await} from 'react-router';
import type {Route} from './+types/$handle';
import {Suspense} from 'react';
import {
  getSelectedProductOptions,
  Analytics,
  useOptimisticVariant,
  getProductOptions,
  getAdjacentAndFirstAvailableVariants,
  useSelectedOptionInUrlParam,
} from '@shopify/hydrogen';
import {ProductImage} from '~/components/ProductImage';
import {ProductForm} from '~/components/ProductForm';
import {ProductItem} from '~/components/ProductItem';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';

export const meta: Route.MetaFunction = ({data}) => {
  const product = data?.product;
  if (!product) {
    return [{title: 'Negatif Studio'}];
  }

  const title = product.seo?.title || `${product.title} | Negatif Studio`;
  const description = product.seo?.description || product.description;
  const image = product.selectedOrFirstAvailableVariant?.image?.url;
  return [
    {title},
    {name: 'description', content: description},
    {property: 'og:type', content: 'website'},
    {property: 'og:site_name', content: 'Negatif Studio'},
    {property: 'og:title', content: title},
    {property: 'og:description', content: description},
    ...(image ? [{property: 'og:image', content: image}] : []),
  ];
};

export async function loader(args: Route.LoaderArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const criticalData = await loadCriticalData(args);

  const recommendedProducts = args.context.storefront
    .query(PRODUCT_RECOMMENDATIONS_QUERY, {
      variables: {productId: criticalData.product.id},
    })
    .catch((error: Error) => {
      console.error(error);
      return null;
    });

  return {...criticalData, recommendedProducts};
}

async function loadCriticalData({context, params, request}: Route.LoaderArgs) {
  const {handle} = params;
  const {storefront} = context;

  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }

  const [{product}] = await Promise.all([
    storefront.query(PRODUCT_QUERY, {
      variables: {handle, selectedOptions: getSelectedProductOptions(request)},
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);

  if (!product?.id) {
    throw new Response(null, {status: 404});
  }

  redirectIfHandleIsLocalized(request, {handle, data: product});

  return {
    product,
  };
}

export default function Product() {
  const {product, recommendedProducts} = useLoaderData<typeof loader>();

  const selectedVariant = useOptimisticVariant(
    product.selectedOrFirstAvailableVariant,
    getAdjacentAndFirstAvailableVariants(product),
  );

  useSelectedOptionInUrlParam(selectedVariant.selectedOptions);

  const productOptions = getProductOptions({
    ...product,
    selectedOrFirstAvailableVariant: selectedVariant,
  });

  const {title, descriptionHtml} = product;

  return (
    <div className="my-6 md:my-10 md:px-16">
      <div className="product">
        <ProductImage media={product.media.nodes} />
        <div className="product-main">
          <h1 className="text-3xl md:text-4xl font-bold font-clash-display">
            {title}
          </h1>
          <div className="flex gap-2 items-center font-light text-text/60 font-clash-grotesk text-xs md:text-base">
            <p>
              {product.place?.value}, {product.year?.value},{' '}
              {product.film?.value}
            </p>
          </div>
          <div
            className="font-clash-grotesk text-base md:text-lg font-light my-4 max-w-xl"
            dangerouslySetInnerHTML={{__html: descriptionHtml}}
          />
          <ProductForm
            productOptions={productOptions}
            selectedVariant={selectedVariant}
          />
        </div>
        <Analytics.ProductView
          data={{
            products: [
              {
                id: product.id,
                title: product.title,
                price: selectedVariant?.price.amount || '0',
                vendor: product.vendor,
                variantId: selectedVariant?.id || '',
                variantTitle: selectedVariant?.title || '',
                quantity: 1,
              },
            ],
          }}
        />
      </div>

      <Suspense fallback={null}>
        <Await resolve={recommendedProducts}>
          {(response) => {
            const items = (response?.productRecommendations ?? [])
              .filter((item) => item.id !== product.id)
              .slice(0, 3);
            if (!items.length) return null;
            return (
              <section className="mt-16">
                <h2 className="text-lg md:text-4xl font-bold font-clash-display uppercase pb-4 md:pb-8">
                  You may also like
                </h2>
                <div className="products-grid">
                  {items.map((item) => (
                    <ProductItem key={item.id} product={item} />
                  ))}
                </div>
              </section>
            );
          }}
        </Await>
      </Suspense>
    </div>
  );
}

const PRODUCT_RECOMMENDATIONS_QUERY = `#graphql
  query ProductRecommendations(
    $productId: ID!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    productRecommendations(productId: $productId, intent: RELATED) {
      id
      title
      handle
      featuredImage {
        id
        url
        altText
        width
        height
      }
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
    }
  }
` as const;

const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    compareAtPrice {
      amount
      currencyCode
    }
    id
    image {
      __typename
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
    selectedOptions {
      name
      value
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
  }
` as const;

const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id
    title
    vendor
    handle
    descriptionHtml
    description
    encodedVariantExistence
    encodedVariantAvailability
    year: metafield(namespace: "custom", key: "year") {
      value
      type
    }
    film: metafield(namespace: "custom", key: "film") {
      value
      type
    }
    place: metafield(namespace: "custom", key: "place") {
      value
      type
    }
    options {
      name
      optionValues {
        name
        firstSelectableVariant {
          ...ProductVariant
        }
        swatch {
          color
          image {
            previewImage {
              url
            }
          }
        }
      }
    }
    selectedOrFirstAvailableVariant(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
      ...ProductVariant
    }
    adjacentVariants (selectedOptions: $selectedOptions) {
      ...ProductVariant
    }
    seo {
      description
      title
    }
    media (first: 3){
      nodes {
        __typename
        id
        alt
        mediaContentType
        previewImage{
          url
          width
          height
        }
        ... on MediaImage {
          image {
          id
          url
          width
          height
          }
        }
      }
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
` as const;

const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...Product
    }
  }
  ${PRODUCT_FRAGMENT}
` as const;

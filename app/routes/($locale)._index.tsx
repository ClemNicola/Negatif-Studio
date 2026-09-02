import {Await, useLoaderData, Link} from 'react-router';
import type {Route} from './+types/_index';
import {Suspense} from 'react';
import {Image} from '@shopify/hydrogen';
import type {RecommendedProductsQuery} from 'storefrontapi.generated';
import {HomeItem} from '~/components/HomeItem';
import {MockShopNotice} from '~/components/MockShopNotice';
import groceryStore2 from '~/assets/images/grocery-2.webp';
import swimmer from '~/assets/images/swimmer.webp';

export const meta: Route.MetaFunction = () => {
  return [{title: 'Hydrogen | Home'}];
};

export async function loader(args: Route.LoaderArgs) {
  // Nothing above the fold needs the Storefront API, so the page streams
  // immediately and the products below resolve later.
  const deferredData = loadDeferredData(args);

  return {
    ...deferredData,
    isShopLinked: Boolean(args.context.env.PUBLIC_STORE_DOMAIN),
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: Route.LoaderArgs) {
  const recommendedProducts = context.storefront
    .query(RECOMMENDED_PRODUCTS_QUERY)
    .catch((error: Error) => {
      // Log query errors, but don't throw them so the page can still render
      console.error(error);
      return null;
    });

  return {
    recommendedProducts,
  };
}

export default function Homepage() {
  const data = useLoaderData<typeof loader>();
  return (
    <div className="px-16">
      {data.isShopLinked ? null : <MockShopNotice />}
      <HomePageHero />
      <RecommendedProducts products={data.recommendedProducts} />
      <HomePageHero2 />
    </div>
  );
}

function HomePageHero() {
  return (
    <section className="grid grid-cols-2 items-center mt-10">
      <div className="flex flex-col gap-12">
        <h1 className="text-8xl font-bold font-clash-display uppercase max-w-xl">
          Light kept on films.
        </h1>
        <p className="text-2xl font-light font-clash-grotesk max-w-xl text-start">
          Film photography, printed by hand in Paris. Every edition is exposed
          on 35mm and limited to 10 prints.
        </p>
        <Link
          to="/collections/all"
          className="button-slide w-fit px-8 py-4 uppercase text-xl font-normal font-clash-grotesk"
        >
          Shop prints
        </Link>
      </div>
      <Image
        src={groceryStore2}
        alt="Grocery Store 2"
        className="aspect-9/16 object-cover"
        style={{maxHeight: '550px', height: '100%'}}
      />
    </section>
  );
}

function HomePageHero2() {
  return (
    <section className="grid grid-cols-2 gap-16 items-center">
      <Image
        src={swimmer}
        alt="Swimmer"
        className="aspect-9/16 object-cover"
        style={{maxHeight: '550px', height: '100%'}}
      />
      <div className="flex flex-col gap-12">
        <h1 className="text-5xl font-bold font-clash-display uppercase max-w-xl">
          Shot on film, printed wet, never reprinted.
        </h1>
        <p className="text-2xl font-clash-grotesk max-w-xl font-lighttext-start">
          Nothing is retouched. The grain, the dust and the light leaks stay
          where they landed. When an edition closes, the negative is filed for
          good.
        </p>
        <Link
          to="/about"
          className="button-slide w-fit px-8 py-4 uppercase text-xl font-normal font-clash-grotesk"
        >
          Inside the Studio
        </Link>
      </div>
    </section>
  );
}

function RecommendedProducts({
  products,
}: {
  products: Promise<RecommendedProductsQuery | null>;
}) {
  return (
    <section
      className="recommended-products my-10"
      aria-labelledby="recommended-products"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-4xl font-bold font-clash-display uppercase pb-8">
          Our Recommendations
        </h2>
        <Link
          to="/collections/all"
          className="link-underline uppercase text-base font-normal font-clash-grotesk"
        >
          View all
        </Link>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={products}>
          {(response) => (
            <div className="grid grid-cols-3 gap-8">
              {response?.products?.nodes?.map((product) => (
                <HomeItem key={product.id} product={product} />
              ))}
            </div>
          )}
        </Await>
      </Suspense>
      <br />
    </section>
  );
}

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    handle
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    featuredImage {
      id
      url
      altText
      width
      height
    }
  }
  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(
      first: 3
      query: "tag:Home"
      sortKey: UPDATED_AT
      reverse: true
    ) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
` as const;

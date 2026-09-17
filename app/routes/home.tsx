import {Await, useLoaderData, Link} from 'react-router';
import type {Route} from './+types/home';
import {Suspense, useRef} from 'react';
import type {
  RecommendedProductFragment,
  RecommendedProductsQuery,
} from 'storefrontapi.generated';
import {HomeItem} from '~/components/HomeItem';
import {MockShopNotice} from '~/components/MockShopNotice';
import groceryStore2 from '~/assets/images/grocery-2.webp';
import swimmer from '~/assets/images/swimmer.webp';
import gsap from 'gsap';
import {useGSAP, type ReactRef} from '@gsap/react';
import {SplitText} from 'gsap/SplitText';
import {ScrollTrigger} from 'gsap/ScrollTrigger';

export const meta: Route.MetaFunction = () => {
  const title = 'Negatif Studio | 35mm prints, handmade in Paris';
  const description =
    'Film photography printed by hand in Paris. Every edition is shot on 35mm and limited to 10 prints. When a run closes, the negative is filed for good.';
  return [
    {title},
    {name: 'description', content: description},
    {property: 'og:type', content: 'website'},
    {property: 'og:site_name', content: 'Negatif Studio'},
    {property: 'og:title', content: title},
    {property: 'og:description', content: description},
    {property: 'og:image', content: origin + groceryStore2},
  ];
};

export async function loader(args: Route.LoaderArgs) {
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
    <div className="mb-10 md:px-16">
      {data.isShopLinked ? null : <MockShopNotice />}
      <HomePageHero />
      <RecommendedProducts products={data.recommendedProducts} />
      <HomePageHero2 />
    </div>
  );
}

let hasPlayedIntro = false;

function HomePageHero() {
  gsap.registerPlugin(SplitText);
  const title = useRef<HTMLHeadingElement>(null);
  const description = useRef<HTMLParagraphElement>(null);
  const shopButton = useRef<HTMLAnchorElement>(null);
  const heroImage = useRef<HTMLImageElement>(null);

  useGSAP(() => {
    if (hasPlayedIntro) return;
    hasPlayedIntro = true;

    void document.fonts.ready.then(() => {
      const splitTitle = SplitText.create(title.current, {
        type: 'chars lines ',
        mask: 'lines',
      });

      const splitDescription = SplitText.create(description.current, {
        type: 'words lines ',
        mask: 'lines',
      });

      gsap
        .timeline()
        .fromTo(
          heroImage.current,
          {clipPath: 'inset(0 100% 0 0)'},
          {
            clipPath: 'inset(0 0% 0 0)',
            duration: 0.5,
            ease: 'power2.inOut',
            clearProps: 'clipPath',
          },
        )
        .from(splitTitle.chars, {
          yPercent: 100,
          duration: 0.5,
          stagger: 0.05,
          ease: 'power2.out',
        })
        .from(
          splitDescription.words,
          {
            yPercent: 100,
            duration: 0.5,
            stagger: 0.05,
            ease: 'power2.out',
          },
          '-=0.3',
        )
        .fromTo(
          shopButton.current,
          {clipPath: 'inset(0 100% 0 0)'},
          {
            clipPath: 'inset(0 0% 0 0)',
            duration: 0.5,
            ease: 'power2.inOut',
            clearProps: 'clipPath',
          },
          '-=0.2',
        )
        .fromTo(
          '.header',
          {clipPath: 'inset(0 0 100% 0)'},
          {
            clipPath: 'inset(0 0 0% 0)',
            duration: 1,
            ease: 'power2.inOut',
            clearProps: 'clipPath',
          },
        );
    });
  }, []);

  return (
    <section className="mt-6 grid gap-8 md:mt-10 md:grid-cols-2 md:items-center md:gap-0">
      <div className="flex flex-col gap-6 md:gap-12">
        <h1
          ref={title}
          className="text-5xl md:text-8xl font-bold font-clash-display uppercase max-w-xl"
        >
          Light kept on films.
        </h1>
        <p
          ref={description}
          className="text-lg md:text-2xl font-light font-clash-grotesk max-w-xl text-start"
        >
          Film photography, printed by hand in Paris. Every edition is exposed
          on 35mm and limited to 20 prints.
        </p>
        <Link
          ref={shopButton}
          to="/collections/all"
          className="button-slide w-fit px-6 py-3 text-base md:px-8 md:py-4 md:text-xl uppercase font-normal font-clash-grotesk"
        >
          Shop prints
        </Link>
      </div>
      <img
        ref={heroImage}
        src={groceryStore2}
        alt="Customers at a corner grocery store, shot on 35mm film"
        decoding="async"
        className="aspect-4/5 w-full object-cover md:aspect-9/16 md:h-full md:max-h-[550px]"
      />
    </section>
  );
}

function HomePageHero2() {
  const hero2Image = useRef<HTMLImageElement>(null);
  useGSAP(() => {
    gsap.fromTo(
      hero2Image.current,
      {clipPath: 'inset(0 100% 0 0)'},
      {
        clipPath: 'inset(0 0% 0 0)',
        ease: 'power2.inOut',
        scrollTrigger: {
          trigger: hero2Image.current,
          start: 'top 80%',
          end: 'top 20%',
          scrub: true,
        },
      },
    );
  }, []);
  return (
    <section className="grid gap-8 md:grid-cols-2 md:gap-16 md:items-center">
      <img
        ref={hero2Image}
        src={swimmer}
        alt="A lone swimmer in open water"
        loading="lazy"
        decoding="async"
        className="aspect-4/5 w-full object-cover md:aspect-9/16 md:h-full md:max-h-[550px]"
      />
      <div className="flex flex-col gap-6 md:gap-12">
        <h1 className="text-4xl md:text-5xl font-bold font-clash-display uppercase max-w-xl">
          Shot on film, printed wet, never reprinted.
        </h1>
        <p className="text-lg md:text-2xl font-clash-grotesk max-w-xl font-light text-start">
          Nothing is retouched. The grain, the dust and the light leaks stay
          where they landed. When an edition closes, the negative is filed for
          good.
        </p>
        <Link
          to="/studio"
          className="button-slide w-fit px-6 py-3 text-base md:px-8 md:py-4 md:text-xl uppercase font-normal font-clash-grotesk"
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
      <div className="flex items-center justify-between gap-4 pb-4 md:pb-8">
        <h2 className="text-lg md:text-4xl font-bold font-clash-display uppercase">
          Our Recommendations
        </h2>
        <Link
          to="/collections/all"
          className="link-underline shrink-0 whitespace-nowrap uppercase text-sm md:text-base font-normal font-clash-grotesk"
        >
          View all
        </Link>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={products}>
          {(response) => (
            <RecommendedGrid products={response?.products?.nodes ?? []} />
          )}
        </Await>
      </Suspense>
      <br />
    </section>
  );
}

function RecommendedGrid({products}: {products: RecommendedProductFragment[]}) {
  gsap.registerPlugin(ScrollTrigger);
  const imageContainer = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      gsap.fromTo(
        '.recommanded-product-image',
        {clipPath: 'inset(0 100% 0 0)'},
        {
          clipPath: 'inset(0 0% 0 0)',
          ease: 'power2.inOut',
          scrollTrigger: {
            trigger: imageContainer.current,
            start: 'top 80%',
            end: 'top 20%',
            scrub: true,
          },
        },
      );
    },
    {scope: imageContainer},
  );
  return (
    <div
      ref={imageContainer}
      className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-8"
    >
      {products.map((product) => (
        <HomeItem key={product.id} product={product} />
      ))}
    </div>
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

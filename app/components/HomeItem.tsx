import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import type {
  ProductItemFragment,
  CollectionItemFragment,
  RecommendedProductFragment,
} from 'storefrontapi.generated';
import {useVariantUrl} from '~/lib/variants';

export function HomeItem({
  product,
  loading,
}: {
  product:
    CollectionItemFragment | ProductItemFragment | RecommendedProductFragment;
  loading?: 'eager' | 'lazy';
}) {
  const variantUrl = useVariantUrl(product.handle);
  const image = product.featuredImage;
  return (
    <Link
      className="product-item "
      key={product.id}
      prefetch="intent"
      to={variantUrl}
    >
      {image && (
        <Image
          className="hover:image-invert transition-all duration-300"
          alt={image.altText || product.title}
          aspectRatio="9/12"
          data={image}
          loading={loading}
          sizes="(min-width: 45em) 500px, 100vw"
        />
      )}
      <div className="flex justify-between">
        <h4 className="self-start">{product.title}</h4>
        <div className="flex items-center gap-2 text-sm font-clash-grotesk">
          <span>from</span>
          <Money
            data={product.priceRange.minVariantPrice}
            className="text-sm"
          />
        </div>
      </div>
    </Link>
  );
}

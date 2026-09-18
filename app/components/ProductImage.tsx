import type {ProductFragment} from 'storefrontapi.generated';
import {Image} from '@shopify/hydrogen';

const PRODUCT_IMAGE_SIZES = '(min-width: 48em) calc(50vw - 6rem), 100vw';
const PRODUCT_IMAGE_SRCSET = {
  intervals: 8,
  startingWidth: 300,
  incrementSize: 250,
  placeholderWidth: 100,
};

export function ProductImage({
  media,
}: {
  media: ProductFragment['media']['nodes'];
}) {
  if (!media) {
    return <div className="product-image" />;
  }

  return (
    <div className="product-image">
      {media.map((node, index) =>
        node.__typename === 'MediaImage' && node.image ? (
          <Image
            alt={node.alt || 'Product Image'}
            data={node.image}
            key={node.id}
            sizes={PRODUCT_IMAGE_SIZES}
            srcSetOptions={PRODUCT_IMAGE_SRCSET}
            loading={index === 0 ? 'eager' : 'lazy'}
            {...(index === 0 ? {fetchpriority: 'high'} : {})}
          />
        ) : null,
      )}
    </div>
  );
}

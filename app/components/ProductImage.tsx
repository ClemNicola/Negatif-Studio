import type {ProductFragment} from 'storefrontapi.generated';
import {Image} from '@shopify/hydrogen';

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
      {media.map((node) =>
        node.__typename === 'MediaImage' && node.image ? (
          <Image
            alt={node.alt || 'Product Image'}
            data={node.image}
            key={node.id}
            sizes="(min-width: 45em) 50vw, 100vw"
          />
        ) : null,
      )}
    </div>
  );
}

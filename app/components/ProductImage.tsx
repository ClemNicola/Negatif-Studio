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
      {media.map((node, index) =>
        node.__typename === 'MediaImage' && node.image ? (
          <Image
            alt={node.alt || 'Product Image'}
            data={node.image}
            key={node.id}
            sizes="(min-width: 45em) 50vw, 100vw"
            loading={index === 0 ? 'eager' : 'lazy'}
            fetchPriority={index === 0 ? 'high' : undefined}
          />
        ) : null,
      )}
    </div>
  );
}

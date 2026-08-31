import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import type {PrintsMenuQuery} from 'storefrontapi.generated';

const HIDDEN_COLLECTIONS = ['all', 'frontpage'];

export function DropDownMenu({
  menu,
  onClose,
}: {
  menu: PrintsMenuQuery | null;
  onClose: () => void;
}) {
  const collections = (menu?.collections.nodes ?? []).filter(
    (collection) => !HIDDEN_COLLECTIONS.includes(collection.handle),
  );
  const featured = menu?.products.nodes[0];

  return (
    <div className="flex items-start justify-between bg-bg px-12 py-6 font-clash-grotesk text-text">
      <nav className="flex flex-col gap-1.5 text-lg" aria-label="Prints">
        <Link
          to="/collections/all"
          prefetch="intent"
          onClick={onClose}
          className="w-fit link-underline"
        >
          All prints
        </Link>
        {collections.map((collection) => (
          <Link
            key={collection.handle}
            to={`/collections/${collection.handle}`}
            prefetch="intent"
            onClick={onClose}
            className="w-fit link-underline"
          >
            {collection.title}
          </Link>
        ))}
      </nav>

      {featured ? (
        <Link
          to={`/products/${featured.handle}`}
          prefetch="intent"
          onClick={onClose}
          className="flex items-start gap-8"
        >
          <div className="pt-1 text-left">
            <p className="mt-2 text-base ">{featured.title}</p>
            <div className="mt-1 flex justify-center items-baseline gap-1 text-sm text-neutral-400">
              <span>from</span>
              <Money data={featured.priceRange.minVariantPrice} />
            </div>
          </div>
          {featured.featuredImage ? (
            <div className="h-52 w-36 shrink-0 overflow-hidden image-invert">
              <Image
                data={featured.featuredImage}
                alt={featured.featuredImage.altText || featured.title}
                className="h-full w-full object-cover"
              />
            </div>
          ) : null}
        </Link>
      ) : null}
    </div>
  );
}

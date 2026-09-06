import {Link, NavLink, useSearchParams} from 'react-router';
import type {CollectionsNavQuery} from 'storefrontapi.generated';
import {DEFAULT_SORT, SORT_OPTIONS} from '~/lib/sort';

type CollectionsNavProps = {
  collections: CollectionsNavQuery['collections']['nodes'];
};

const linkClassName = ({isActive}: {isActive: boolean}) =>
  `text-base link-underline font-clash-grotesk ${
    isActive
      ? 'text-text'
      : 'text-text/30 hover:text-text/80 duration-300 ease-in-out'
  }`;

export function CollectionsNav({collections}: CollectionsNavProps) {
  const [searchParams] = useSearchParams();
  const activeSort = searchParams.get('sort') ?? DEFAULT_SORT;
  const collectionsWithoutHome = collections.filter(
    (collection) => collection.handle !== 'frontpage',
  );

  const collectionSearch =
    activeSort === DEFAULT_SORT ? '' : `?sort=${activeSort}`;

  return (
    <nav className="border-b border-neutral-300 my-8 flex items-center justify-between">
      <ul className="flex gap-4 pb-3" aria-label="Collections">
        <li>
          <NavLink
            to={`/collections/all${collectionSearch}`}
            prefetch="intent"
            end
            className={linkClassName}
          >
            All
          </NavLink>
        </li>
        {collectionsWithoutHome.map((collection) => (
          <li key={collection.id}>
            <NavLink
              to={`/collections/${collection.handle}${collectionSearch}`}
              prefetch="intent"
              className={linkClassName}
            >
              {collection.title}
            </NavLink>
          </li>
        ))}
      </ul>
      <ul className="flex items-center gap-8 pb-3" aria-label="Sort by">
        {SORT_OPTIONS.map((option) => (
          <li key={option.value}>
            <Link
              to={`?sort=${option.value}`}
              prefetch="intent"
              preventScrollReset
              aria-current={option.value === activeSort ? 'true' : undefined}
              className={linkClassName({isActive: option.value === activeSort})}
            >
              {option.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

import {NavLink} from 'react-router';
import type {CollectionsNavQuery} from 'storefrontapi.generated';

type CollectionsNavProps = {
  collections: CollectionsNavQuery['collections']['nodes'];
};

const linkClassName = ({isActive}: {isActive: boolean}) =>
  isActive
    ? 'text-text text-sm link-underline font-clash-grotesk'
    : 'text-text/30 text-sm link-underline hover:text-text/80 duration-300 ease-in-out';

export function CollectionsNav({collections}: CollectionsNavProps) {
  const collectionsWithoutHome = collections.filter(
    (collection) => collection.handle !== 'frontpage',
  );
  return (
    <nav className="border-b border-neutral-300 my-8">
      <ul className="flex gap-4 pb-3 text-lg">
        <li>
          <NavLink
            to="/collections/all"
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
              to={`/collections/${collection.handle}`}
              prefetch="intent"
              className={linkClassName}
            >
              {collection.title}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

import type {
  ProductCollectionSortKeys,
  ProductSortKeys,
} from '@shopify/hydrogen/storefront-api-types';

export const SORT_OPTIONS = [
  {value: 'newest', label: 'Newest'},
  {value: 'az', label: 'A - Z'},
  {value: 'za', label: 'Z - A'},
] as const;

export type SortValue = (typeof SORT_OPTIONS)[number]['value'];

export const DEFAULT_SORT: SortValue = 'newest';

function isSortValue(value: string | null): value is SortValue {
  return SORT_OPTIONS.some((option) => option.value === value);
}

export function getSortValue(request: Request): SortValue {
  const value = new URL(request.url).searchParams.get('sort');
  return isSortValue(value) ? value : DEFAULT_SORT;
}

export function getCatalogSort(sort: SortValue): {
  sortKey: ProductSortKeys;
  reverse: boolean;
} {
  switch (sort) {
    case 'az':
      return {sortKey: 'TITLE', reverse: false};
    case 'za':
      return {sortKey: 'TITLE', reverse: true};
    default:
      return {sortKey: 'CREATED_AT', reverse: true};
  }
}

export function getCollectionSort(sort: SortValue): {
  sortKey: ProductCollectionSortKeys;
  reverse: boolean;
} {
  switch (sort) {
    case 'az':
      return {sortKey: 'TITLE', reverse: false};
    case 'za':
      return {sortKey: 'TITLE', reverse: true};
    default:
      return {sortKey: 'CREATED', reverse: true};
  }
}

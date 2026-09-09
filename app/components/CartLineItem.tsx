import type {CartLineUpdateInput} from '@shopify/hydrogen/storefront-api-types';
import type {CartLayout, LineItemChildrenMap} from '~/components/CartMain';
import {
  CartForm,
  Image,
  Money,
  type OptimisticCartLine,
} from '@shopify/hydrogen';
import {useVariantUrl} from '~/lib/variants';
import {Link} from 'react-router';
import {useAside} from './Aside';
import type {CartApiQueryFragment} from 'storefrontapi.generated';

export type CartLine = OptimisticCartLine<CartApiQueryFragment>;

const stepperButtonClassName =
  'cursor-pointer px-1 text-lg leading-none text-text/50 transition-colors hover:text-text disabled:cursor-not-allowed disabled:opacity-30';

/**
 * A single line item in the cart. It displays the product image, title, price.
 * It also provides controls to update the quantity or remove the line item.
 * If the line is a parent line that has child components (like warranties or gift wrapping), they are
 * rendered nested below the parent line.
 */
export function CartLineItem({
  layout,
  line,
  childrenMap,
}: {
  layout: CartLayout;
  line: CartLine;
  childrenMap: LineItemChildrenMap;
}) {
  const {id, merchandise} = line;
  const {product, title, image, selectedOptions} = merchandise;
  const lineItemUrl = useVariantUrl(product.handle, selectedOptions);
  const {close} = useAside();
  const lineItemChildren = childrenMap[id];
  const childrenLabelId = `cart-line-children-${id}`;

  // Shopify adds a "Title: Default Title" option to products without variants.
  const optionsLabel = selectedOptions
    .filter((option) => option.value !== 'Default Title')
    .map((option) => option.value)
    .join(' · ');

  const closeAside = () => {
    if (layout === 'aside') close();
  };

  return (
    <li key={id} className="cart-line border-b border-text/15 py-5">
      <div className="flex gap-4">
        {image && (
          <Link prefetch="intent" to={lineItemUrl} onClick={closeAside}>
            <Image
              alt={title}
              className="w-24"
              aspectRatio="9/14"
              data={image}
              loading="lazy"
              sizes="72px"
            />
          </Link>
        )}

        <div className="flex flex-1 flex-col">
          <Link
            className="link-underline w-fit text-base"
            prefetch="intent"
            to={lineItemUrl}
            onClick={closeAside}
          >
            {product.title}
          </Link>
          {optionsLabel ? (
            <p className="mt-1 text-sm text-text/50">{optionsLabel}</p>
          ) : null}

          <div className="mt-auto flex items-center justify-between pt-3">
            <CartLineQuantity line={line} />
            {line?.cost?.totalAmount ? (
              <Money className="text-base" data={line.cost.totalAmount} />
            ) : null}
          </div>
        </div>
      </div>

      {lineItemChildren ? (
        <div>
          <p id={childrenLabelId} className="sr-only">
            Line items with {product.title}
          </p>
          <ul aria-labelledby={childrenLabelId} className="cart-line-children">
            {lineItemChildren.map((childLine) => (
              <CartLineItem
                childrenMap={childrenMap}
                key={childLine.id}
                line={childLine}
                layout={layout}
              />
            ))}
          </ul>
        </div>
      ) : null}
    </li>
  );
}

function CartLineQuantity({line}: {line: CartLine}) {
  if (!line || typeof line?.quantity === 'undefined') return null;
  const {id: lineId, quantity, isOptimistic} = line;
  const prevQuantity = Number(Math.max(0, quantity - 1).toFixed(0));
  const nextQuantity = Number((quantity + 1).toFixed(0));

  return (
    <div className="flex items-center gap-3">
      {quantity <= 1 ? (
        <CartLineRemoveButton lineIds={[lineId]} disabled={!!isOptimistic} />
      ) : (
        <CartLineUpdateButton lines={[{id: lineId, quantity: prevQuantity}]}>
          <button
            aria-label="Decrease quantity"
            className={stepperButtonClassName}
            disabled={!!isOptimistic}
            name="decrease-quantity"
            value={prevQuantity}
          >
            &#8722;
          </button>
        </CartLineUpdateButton>
      )}
      <span className="min-w-4 text-center text-base tabular-nums">
        {quantity}
      </span>
      <CartLineUpdateButton lines={[{id: lineId, quantity: nextQuantity}]}>
        <button
          aria-label="Increase quantity"
          className={stepperButtonClassName}
          disabled={!!isOptimistic}
          name="increase-quantity"
          value={nextQuantity}
        >
          &#43;
        </button>
      </CartLineUpdateButton>
    </div>
  );
}

function CartLineRemoveButton({
  lineIds,
  disabled,
}: {
  lineIds: string[];
  disabled: boolean;
}) {
  return (
    <CartForm
      fetcherKey={getUpdateKey(lineIds)}
      route="/cart"
      action={CartForm.ACTIONS.LinesRemove}
      inputs={{lineIds}}
    >
      <button
        aria-label="Remove from cart"
        className={stepperButtonClassName}
        disabled={disabled}
        type="submit"
      >
        &#8722;
      </button>
    </CartForm>
  );
}

function CartLineUpdateButton({
  children,
  lines,
}: {
  children: React.ReactNode;
  lines: CartLineUpdateInput[];
}) {
  const lineIds = lines.map((line) => line.id);

  return (
    <CartForm
      fetcherKey={getUpdateKey(lineIds)}
      route="/cart"
      action={CartForm.ACTIONS.LinesUpdate}
      inputs={{lines}}
    >
      {children}
    </CartForm>
  );
}

/**
 * Returns a unique key for the update action. This is used to make sure actions modifying the same line
 * items are not run concurrently, but cancel each other. For example, if the user clicks "Increase quantity"
 * and "Decrease quantity" in rapid succession, the actions will cancel each other and only the last one will run.
 * @param lineIds - line ids affected by the update
 * @returns
 */
function getUpdateKey(lineIds: string[]) {
  return [CartForm.ACTIONS.LinesUpdate, ...lineIds].join('-');
}

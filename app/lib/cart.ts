import type {MoneyV2} from '@shopify/hydrogen/storefront-api-types';
import type {OptimisticCart} from '@shopify/hydrogen';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import type {CartLine} from '~/components/CartLineItem';

function toAmount(value: number) {
  return String(Math.round(value * 1000) / 1000);
}

function getLineUnitPrice(line: CartLine): MoneyV2 | undefined {
  return line.cost?.amountPerQuantity ?? line.merchandise?.price;
}

export function getOptimisticLineTotal(line: CartLine): MoneyV2 | undefined {
  const unitPrice = getLineUnitPrice(line);
  if (!unitPrice) return undefined;

  return {
    amount: toAmount(Number(unitPrice.amount) * line.quantity),
    currencyCode: unitPrice.currencyCode,
  };
}

function isChildLine(line: CartLine) {
  return (
    'parentRelationship' in line && Boolean(line.parentRelationship?.parent)
  );
}

export function getOptimisticSubtotal(
  cart: OptimisticCart<CartApiQueryFragment | null>,
): MoneyV2 | undefined {
  const lines = cart?.lines?.nodes ?? [];
  let amount = 0;
  let currencyCode: MoneyV2['currencyCode'] | undefined;

  for (const line of lines) {
    if (isChildLine(line)) continue;
    const lineTotal = getOptimisticLineTotal(line);
    if (!lineTotal) return undefined;
    amount += Number(lineTotal.amount);
    currencyCode ??= lineTotal.currencyCode;
  }

  currencyCode ??= cart?.cost?.subtotalAmount?.currencyCode;
  if (!currencyCode) return undefined;

  return {amount: toAmount(amount), currencyCode};
}

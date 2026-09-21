import type {CartApiQueryFragment} from 'storefrontapi.generated';
import type {CartLayout} from '~/components/CartMain';
import {Money, type OptimisticCart} from '@shopify/hydrogen';
import {getOptimisticSubtotal} from '~/lib/cart';
import {useId} from 'react';

type CartSummaryProps = {
  cart: OptimisticCart<CartApiQueryFragment | null>;
  layout: CartLayout;
};

export function CartSummary({cart, layout}: CartSummaryProps) {
  const summaryId = useId();
  const layoutClassName = layout === 'aside' ? '-mx-4 px-4 pb-4' : 'mt-10';
  const subtotal =
    (cart?.isOptimistic ? getOptimisticSubtotal(cart) : undefined) ??
    cart?.cost?.subtotalAmount;

  return (
    <div
      aria-labelledby={summaryId}
      className={`shrink-0 border-t border-text/15 pt-6 ${layoutClassName}`}
    >
      <dl className="flex items-baseline justify-between">
        <dt className="text-base text-text/50">Total</dt>
        <dd className="font-clash-display text-3xl font-bold">
          {subtotal?.amount ? <Money data={subtotal} /> : '—'}
        </dd>
      </dl>

      <CartCheckoutActions />
    </div>
  );
}

function CartCheckoutActions() {
  return (
    <>
      <button
        className="mt-5 block w-full cursor-not-allowed border border-text/20 py-4 text-center text-base md:text-lg font-normal uppercase tracking-widest font-clash-grotesk text-text/40"
        type="button"
        disabled
      >
        Still looking for the negative
      </button>
      <p className="pt-4 text-center text-sm text-text/50">
        Checkout is off — this storefront is a portfolio build. Nothing ships,
        nothing is charged.
      </p>
    </>
  );
}

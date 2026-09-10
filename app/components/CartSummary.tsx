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

      <CartCheckoutActions checkoutUrl={cart?.checkoutUrl} />
    </div>
  );
}

function CartCheckoutActions({checkoutUrl}: {checkoutUrl?: string}) {
  if (!checkoutUrl) return null;

  return (
    <>
      <a
        className="button-slide mt-5 block w-full py-4 text-center text-lg font-normal uppercase tracking-widest font-clash-grotesk"
        href={checkoutUrl}
        target="_self"
      >
        Checkout
      </a>
      <p className="pt-4 text-center text-sm text-text/50">
        Taxes included · shipping at checkout
      </p>
    </>
  );
}

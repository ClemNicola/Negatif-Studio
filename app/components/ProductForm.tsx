import {Link, useNavigate} from 'react-router';
import {Money, type MappedProductOptions} from '@shopify/hydrogen';
import type {
  Maybe,
  ProductOptionValueSwatch,
} from '@shopify/hydrogen/storefront-api-types';
import {AddToCartButton} from './AddToCartButton';
import {useAside} from './Aside';
import type {ProductFragment} from 'storefrontapi.generated';

// The selected state is driven by data-selected so it can transition both ways.
const optionItemClassName = ({exists}: {exists: boolean}) =>
  `button-slide-invert bg-text/5 flex w-full cursor-pointer items-center justify-between gap-4 px-6 py-5 text-left text-lg${
    exists ? '' : ' opacity-30 cursor-not-allowed line-through'
  }`;

export function ProductForm({
  productOptions,
  selectedVariant,
}: {
  productOptions: MappedProductOptions[];
  selectedVariant: ProductFragment['selectedOrFirstAvailableVariant'];
}) {
  const navigate = useNavigate();
  const {open} = useAside();

  return (
    <div className="flex flex-col gap-8 font-clash-grotesk">
      {productOptions.map((option) => {
        if (option.optionValues.length === 1) return null;

        return (
          <fieldset key={option.name} className="m-0 border-0 p-0">
            <legend className="mb-3 font-clash-grotesk text-sm uppercase tracking-widest text-text/50">
              {option.name}
            </legend>
            <div
              className={`grid gap-3 ${
                option.optionValues.length === 2 ? 'sm:grid-cols-2' : ''
              }`}
            >
              {option.optionValues.map((value) => {
                const {
                  name,
                  handle,
                  variant,
                  variantUriQuery,
                  selected,
                  available,
                  exists,
                  isDifferentProduct,
                  swatch,
                } = value;

                const hidePrice =
                  option.name &&
                  option.name.trim().toLowerCase() === 'finition' &&
                  name.trim().toLowerCase() === 'non encadré';

                const content = (
                  <>
                    <span className="flex items-center gap-3">
                      <ProductOptionSwatch swatch={swatch} name={name} />
                      {name}
                    </span>
                    {variant?.price && !hidePrice ? (
                      <Money
                        className="text-base tex-text/75"
                        data={variant.price}
                      />
                    ) : null}
                  </>
                );

                if (isDifferentProduct) {
                  return (
                    <Link
                      className={optionItemClassName({exists})}
                      data-selected={selected}
                      key={option.name + name}
                      prefetch="intent"
                      preventScrollReset
                      replace
                      to={`/products/${handle}?${variantUriQuery}`}
                      style={{opacity: available ? undefined : 0.3}}
                    >
                      {content}
                    </Link>
                  );
                }

                return (
                  <button
                    type="button"
                    className={optionItemClassName({exists})}
                    data-selected={selected}
                    key={option.name + name}
                    style={{opacity: available ? undefined : 0.3}}
                    disabled={!exists}
                    onClick={() => {
                      if (!selected) {
                        void navigate(`?${variantUriQuery}`, {
                          replace: true,
                          preventScrollReset: true,
                        });
                      }
                    }}
                  >
                    {content}
                  </button>
                );
              })}
            </div>
          </fieldset>
        );
      })}

      <div className="flex items-baseline justify-between border-t border-text/20 pt-6">
        <span className="text-lg uppercase tracking-widest text-text/50">
          Total
        </span>
        {selectedVariant?.price ? (
          <Money
            className="font-clash-display text-3xl font-bold"
            data={selectedVariant.price}
          />
        ) : null}
      </div>

      <AddToCartButton
        className="cursor-pointer button-slide px-8 py-5 w-full text-lg uppercase tracking-widest disabled:cursor-not-allowed disabled:opacity-40"
        disabled={!selectedVariant || !selectedVariant.availableForSale}
        onClick={() => {
          open('cart');
        }}
        lines={
          selectedVariant
            ? [
                {
                  merchandiseId: selectedVariant.id,
                  quantity: 1,
                  selectedVariant,
                },
              ]
            : []
        }
      >
        {selectedVariant?.availableForSale ? 'Add to cart' : 'Sold out'}
      </AddToCartButton>
    </div>
  );
}

function ProductOptionSwatch({
  swatch,
  name,
}: {
  swatch?: Maybe<ProductOptionValueSwatch> | undefined;
  name: string;
}) {
  const image = swatch?.image?.previewImage?.url;
  const color = swatch?.color;

  if (!image && !color) return null;

  return (
    <span
      aria-hidden="true"
      className="product-option-label-swatch"
      style={{backgroundColor: color || 'transparent'}}
    >
      {!!image && <img src={image} alt={name} />}
    </span>
  );
}

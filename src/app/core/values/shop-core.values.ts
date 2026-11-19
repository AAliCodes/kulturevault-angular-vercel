import { CurrencyCode, ShopId } from '../enums/shop.enums';

export const SHOP_CORE_VALUES = {
  HOLDING_NAME: 'KULTUREVAULT Exchange Holdings',
  DEFAULT_SHOP: ShopId.SNEAKERS,
  CURRENCY_CODE: CurrencyCode.ZAR,
  CURRENCY_SYMBOL: 'R',
  SHOPIFY_CATALOG_ENDPOINT: '/api/shopify/catalog',
  SHOPIFY_CHECKOUT_ENDPOINT: '/api/shopify/checkout',
  PROPERTIES_ASSET_BASE_PATH: '/assets/properties',
  TOAST_AUTO_DISMISS_MS: 3800
} as const;

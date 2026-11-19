/**
 * Enterprise Multi-Shop Core Enumerations
 * Red Hat / Java-style strongly-typed domain enumerations for the KULTUREVAULT Exchange Holding.
 */

export enum ShopId {
  SNEAKERS = 'sneakers',
  STREETWEAR = 'streetwear',
  COLLECTIBLES = 'collectibles'
}

export type StoreDepartment = `${ShopId}`;

export enum ShopRouteAlias {
  SNEAKERS_PRIMARY = 'sneakers',
  SNEAKERS_ALIAS = 'footwear',
  STREETWEAR_PRIMARY = 'streetwear',
  STREETWEAR_ALIAS = 'apparel',
  COLLECTIBLES_PRIMARY = 'collectibles',
  COLLECTIBLES_ALIAS = 'vault'
}

export enum ProductTier {
  ALL = 'All',
  B2B = 'B2B',
  RETAIL = 'Retail'
}

export enum CatalogSyncSource {
  SHOPIFY_LIVE = 'shopify-live',
  SEED_FALLBACK = 'seed-fallback'
}

export type CatalogSyncSourceType = `${CatalogSyncSource}`;

export enum CheckoutGateway {
  PAYGATE = 'paygate',
  OZOW = 'ozow',
  SHOPIFY = 'shopify'
}

export type CheckoutGatewayType = `${CheckoutGateway}`;

export enum CurrencyCode {
  ZAR = 'ZAR'
}

export enum PropertiesNamespace {
  SHELL = 'shell',
  SNEAKERS = 'sneakers',
  STREETWEAR = 'streetwear',
  COLLECTIBLES = 'collectibles'
}

export enum MarketOrderTypeEnum {
  BUY_NOW = 'buy_now',
  PLACE_BID = 'place_bid'
}

export type MarketOrderType = `${MarketOrderTypeEnum}`;

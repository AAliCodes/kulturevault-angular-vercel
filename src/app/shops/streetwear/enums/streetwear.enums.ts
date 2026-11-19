import { ProductTier } from '../../../core/enums/shop.enums';

export enum StreetwearCategoryFilterEnum {
  ALL = 'All',
  BOX_LOGO_HOODIES = 'Box Logo & Hoodies',
  OUTERWEAR_JACKETS = 'Outerwear & Jackets',
  GRAPHIC_TEES_KNITS = 'Graphic Tees & Knits',
  INDUSTRIAL_DENIM = 'Industrial & Denim'
}

export type StreetwearCategoryFilter = `${StreetwearCategoryFilterEnum}`;

export enum StreetwearBrandFilterEnum {
  ALL = 'All',
  SUPREME = 'Supreme',
  OFF_WHITE = 'Off-White',
  STUSSY = 'Stüssy'
}

export type StreetwearBrandFilter = `${StreetwearBrandFilterEnum}`;

export enum StreetwearTierFilterEnum {
  ALL = ProductTier.ALL,
  RETAIL = ProductTier.RETAIL,
  B2B = ProductTier.B2B
}

export type StreetwearTierFilter = `${StreetwearTierFilterEnum}`;

export enum ApparelSizeOptionEnum {
  S = 'S',
  M = 'M',
  L = 'L',
  XL = 'XL'
}

export type ApparelSizeOption = `${ApparelSizeOptionEnum}`;

export enum StreetwearPurchaseModeEnum {
  BUY_NOW = 'buy_now',
  COLLECTOR_BID = 'collector_bid'
}

export type StreetwearPurchaseMode = `${StreetwearPurchaseModeEnum}`;

import { ProductTier } from '../../../core/enums/shop.enums';

export enum SneakerCategoryFilterEnum {
  ALL = 'All',
  JORDAN_RETRO = 'Jordan Retro',
  OFF_WHITE_NIKE = 'Off-White x Nike',
  DUNK_SB_GRAIL = 'Dunk & SB Grail',
  ARCHIVE_RUNNERS = 'Archive Runners & Collabs'
}

export type SneakerCategoryFilter = `${SneakerCategoryFilterEnum}`;

export enum SneakerBrandFilterEnum {
  ALL = 'All',
  JORDAN = 'Jordan',
  OFF_WHITE = 'Off-White',
  NIKE = 'Nike',
  SUPREME = 'Supreme',
  STUSSY = 'Stüssy',
  NEW_BALANCE = 'New Balance',
  ADIDAS = 'Adidas'
}

export type SneakerBrandFilter = `${SneakerBrandFilterEnum}`;

export enum SneakerTierFilterEnum {
  ALL = ProductTier.ALL,
  RETAIL = ProductTier.RETAIL,
  B2B = ProductTier.B2B
}

export type SneakerTierFilter = `${SneakerTierFilterEnum}`;

export enum SneakerSizeOptionEnum {
  US_8 = 'US 8',
  US_9 = 'US 9',
  US_10 = 'US 10',
  US_11 = 'US 11',
  US_12 = 'US 12'
}

export type SneakerSizeOption = `${SneakerSizeOptionEnum}`;

export enum SneakerTradeModeEnum {
  BUY_NOW = 'buy_now',
  PLACE_BID = 'place_bid'
}

export type SneakerTradeMode = `${SneakerTradeModeEnum}`;

export enum SneakerCatalogViewModeEnum {
  GRID = 'grid',
  TABLE = 'table'
}

export type SneakerCatalogViewMode = `${SneakerCatalogViewModeEnum}`;

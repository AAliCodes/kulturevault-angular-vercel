import { ProductTier } from '../../../core/enums/shop.enums';

export enum CollectibleCategoryFilterEnum {
  ALL = 'All',
  ART_VINYL_BEARBRICK = 'Art Vinyl & BE@RBRICK',
  SUPREME_ARCHIVE_OBJECTS = 'Supreme Archive Objects',
  LUXURY_BAGS_LEATHER = 'Luxury Bags & Leather',
  VAULT_CARE_DISPLAY = 'Vault Care & Display'
}

export type CollectibleCategoryFilter = `${CollectibleCategoryFilterEnum}`;

export enum CollectibleCreatorFilterEnum {
  ALL = 'All',
  MEDICOM_TOY = 'Medicom Toy',
  KAWS = 'KAWS',
  SUPREME = 'Supreme',
  OFF_WHITE = 'Off-White',
  STUSSY = 'Stüssy',
  VAULT_LAB = 'Vault Lab'
}

export type CollectibleCreatorFilter = `${CollectibleCreatorFilterEnum}`;

export enum CollectibleTierFilterEnum {
  ALL = ProductTier.ALL,
  RETAIL = ProductTier.RETAIL,
  B2B = ProductTier.B2B
}

export type CollectibleTierFilter = `${CollectibleTierFilterEnum}`;

export enum CollectibleOrderModeEnum {
  BUY_NOW = 'buy_now',
  VAULT_BID = 'vault_bid'
}

export type CollectibleOrderMode = `${CollectibleOrderModeEnum}`;

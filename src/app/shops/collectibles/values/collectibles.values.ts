import {
  CollectibleCategoryFilter,
  CollectibleCategoryFilterEnum,
  CollectibleCreatorFilter,
  CollectibleOrderModeEnum,
  CollectibleTierFilterEnum
} from '../enums/collectibles.enums';
import {
  CollectibleFooterColumn,
  CollectibleHeaderStat,
  CollectibleTierOption
} from '../models/collectibles.model';

export const COLLECTIBLES_SHOP_VALUES = {
  DEFAULT_CATEGORY: CollectibleCategoryFilterEnum.ALL,
  DEFAULT_TIER: CollectibleTierFilterEnum.ALL,
  DEFAULT_MODE: CollectibleOrderModeEnum.BUY_NOW,
  VAULT_BID_MULTIPLIER: 0.90,
  FREE_DELIVERY_THRESHOLD_ZAR: 12000,
  STANDARD_CRATE_FREIGHT_ZAR: 450,
  EXPRESS_CRATE_FREIGHT_ZAR: 650
} as const;

export const COLLECTIBLES_CATEGORIES: readonly CollectibleCategoryFilter[] = [
  CollectibleCategoryFilterEnum.ALL,
  CollectibleCategoryFilterEnum.ART_VINYL_BEARBRICK,
  CollectibleCategoryFilterEnum.SUPREME_ARCHIVE_OBJECTS,
  CollectibleCategoryFilterEnum.LUXURY_BAGS_LEATHER,
  CollectibleCategoryFilterEnum.VAULT_CARE_DISPLAY
];

export const COLLECTIBLES_ALLOWED_CREATORS: readonly Exclude<CollectibleCreatorFilter, 'All'>[] = [
  'Medicom Toy',
  'KAWS',
  'Supreme',
  'Off-White',
  'Stüssy',
  'Vault Lab'
];

export const COLLECTIBLES_TIER_OPTIONS: readonly CollectibleTierOption[] = [
  { tier: 'All', labelPropertyKey: 'collectibles.toolbar.tier.all' },
  { tier: 'Retail', labelPropertyKey: 'collectibles.toolbar.tier.retail' },
  { tier: 'B2B', labelPropertyKey: 'collectibles.toolbar.tier.b2b' }
];

export const COLLECTIBLES_HEADER_STATS: readonly CollectibleHeaderStat[] = [
  {
    valuePropertyKey: 'collectibles.stats.editions.value',
    labelPropertyKey: 'collectibles.stats.editions.label',
    accentClass: 'text-amber'
  },
  {
    valuePropertyKey: 'collectibles.stats.grade.value',
    labelPropertyKey: 'collectibles.stats.grade.label',
    accentClass: 'text-mint'
  },
  {
    valuePropertyKey: 'collectibles.stats.auth.value',
    labelPropertyKey: 'collectibles.stats.auth.label',
    accentClass: 'text-amber'
  },
  {
    valuePropertyKey: 'collectibles.stats.crating.value',
    labelPropertyKey: 'collectibles.stats.crating.label',
    accentClass: 'text-mint'
  }
];

export const COLLECTIBLES_FOOTER_COLUMNS: readonly CollectibleFooterColumn[] = [
  {
    titlePropertyKey: 'collectibles.footer.col1.title',
    bodyPropertyKey: 'collectibles.footer.col1.body'
  },
  {
    titlePropertyKey: 'collectibles.footer.col2.title',
    bodyPropertyKey: 'collectibles.footer.col2.body'
  },
  {
    titlePropertyKey: 'collectibles.footer.col3.title',
    bodyPropertyKey: 'collectibles.footer.col3.body',
    emailPropertyKey: 'collectibles.footer.col3.email'
  }
];

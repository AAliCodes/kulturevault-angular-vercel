import {
  SneakerBrandFilter,
  SneakerCategoryFilter,
  SneakerCategoryFilterEnum,
  SneakerSizeOption,
  SneakerSizeOptionEnum,
  SneakerTierFilterEnum,
  SneakerTradeModeEnum
} from '../enums/sneakers.enums';
import {
  SneakerFooterColumn,
  SneakerHeaderStat,
  SneakerTierOption
} from '../models/sneakers.model';

export const SNEAKERS_SHOP_VALUES = {
  DEFAULT_CATEGORY: SneakerCategoryFilterEnum.ALL,
  DEFAULT_TIER: SneakerTierFilterEnum.ALL,
  DEFAULT_SIZE: SneakerSizeOptionEnum.US_9,
  DEFAULT_TRADE_MODE: SneakerTradeModeEnum.BUY_NOW,
  BID_DISCOUNT_MULTIPLIER: 0.92,
  FREE_DELIVERY_THRESHOLD_ZAR: 5000,
  STANDARD_ARMORED_COURIER_ZAR: 250,
  EXPRESS_ARMORED_COURIER_ZAR: 350
} as const;

export const SNEAKERS_CATEGORIES: readonly SneakerCategoryFilter[] = [
  SneakerCategoryFilterEnum.ALL,
  SneakerCategoryFilterEnum.JORDAN_RETRO,
  SneakerCategoryFilterEnum.OFF_WHITE_NIKE,
  SneakerCategoryFilterEnum.DUNK_SB_GRAIL,
  SneakerCategoryFilterEnum.ARCHIVE_RUNNERS
];

export const SNEAKERS_ALLOWED_BRANDS: readonly Exclude<SneakerBrandFilter, 'All'>[] = [
  'Jordan',
  'Off-White',
  'Nike',
  'Supreme',
  'Stüssy',
  'New Balance',
  'Adidas'
];

export const SNEAKERS_SIZES: readonly SneakerSizeOption[] = [
  SneakerSizeOptionEnum.US_8,
  SneakerSizeOptionEnum.US_9,
  SneakerSizeOptionEnum.US_10,
  SneakerSizeOptionEnum.US_11,
  SneakerSizeOptionEnum.US_12
];

export const SNEAKERS_TIER_OPTIONS: readonly SneakerTierOption[] = [
  { tier: 'All', labelPropertyKey: 'sneakers.toolbar.tier.all' },
  { tier: 'Retail', labelPropertyKey: 'sneakers.toolbar.tier.retail' },
  { tier: 'B2B', labelPropertyKey: 'sneakers.toolbar.tier.b2b' }
];

export const SNEAKERS_HEADER_STATS: readonly SneakerHeaderStat[] = [
  {
    valuePropertyKey: 'sneakers.stats.skus.value',
    labelPropertyKey: 'sneakers.stats.skus.label',
    accentClass: 'text-emerald'
  },
  {
    valuePropertyKey: 'sneakers.stats.auth.value',
    labelPropertyKey: 'sneakers.stats.auth.label',
    accentClass: 'text-gold'
  },
  {
    valuePropertyKey: 'sneakers.stats.spread.value',
    labelPropertyKey: 'sneakers.stats.spread.label',
    accentClass: 'text-emerald'
  },
  {
    valuePropertyKey: 'sneakers.stats.dispatch.value',
    labelPropertyKey: 'sneakers.stats.dispatch.label',
    accentClass: 'text-coral'
  }
];

export const SNEAKERS_FOOTER_COLUMNS: readonly SneakerFooterColumn[] = [
  {
    titlePropertyKey: 'sneakers.footer.col1.title',
    bodyPropertyKey: 'sneakers.footer.col1.body'
  },
  {
    titlePropertyKey: 'sneakers.footer.col2.title',
    bodyPropertyKey: 'sneakers.footer.col2.body'
  },
  {
    titlePropertyKey: 'sneakers.footer.col3.title',
    bodyPropertyKey: 'sneakers.footer.col3.body',
    emailPropertyKey: 'sneakers.footer.col3.email'
  }
];

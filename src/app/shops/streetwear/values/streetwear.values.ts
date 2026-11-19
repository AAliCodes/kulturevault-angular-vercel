import {
  ApparelSizeOption,
  ApparelSizeOptionEnum,
  StreetwearBrandFilter,
  StreetwearCategoryFilter,
  StreetwearCategoryFilterEnum,
  StreetwearPurchaseModeEnum,
  StreetwearTierFilterEnum
} from '../enums/streetwear.enums';
import {
  StreetwearFooterColumn,
  StreetwearHeaderStat,
  StreetwearTierOption
} from '../models/streetwear.model';

export const STREETWEAR_SHOP_VALUES = {
  DEFAULT_CATEGORY: StreetwearCategoryFilterEnum.ALL,
  DEFAULT_TIER: StreetwearTierFilterEnum.ALL,
  DEFAULT_SIZE: ApparelSizeOptionEnum.L,
  DEFAULT_MODE: StreetwearPurchaseModeEnum.BUY_NOW,
  COLLECTOR_BID_MULTIPLIER: 0.91,
  FREE_DELIVERY_THRESHOLD_ZAR: 5000,
  STANDARD_DELIVERY_FEE_ZAR: 250,
  EXPRESS_DELIVERY_FEE_ZAR: 350
} as const;

export const STREETWEAR_CATEGORIES: readonly StreetwearCategoryFilter[] = [
  StreetwearCategoryFilterEnum.ALL,
  StreetwearCategoryFilterEnum.BOX_LOGO_HOODIES,
  StreetwearCategoryFilterEnum.OUTERWEAR_JACKETS,
  StreetwearCategoryFilterEnum.GRAPHIC_TEES_KNITS,
  StreetwearCategoryFilterEnum.INDUSTRIAL_DENIM
];

export const STREETWEAR_ALLOWED_BRANDS: readonly Exclude<StreetwearBrandFilter, 'All'>[] = [
  'Supreme',
  'Off-White',
  'Stüssy'
];

export const STREETWEAR_SIZES: readonly ApparelSizeOption[] = [
  ApparelSizeOptionEnum.S,
  ApparelSizeOptionEnum.M,
  ApparelSizeOptionEnum.L,
  ApparelSizeOptionEnum.XL
];

export const STREETWEAR_TIER_OPTIONS: readonly StreetwearTierOption[] = [
  { tier: 'All', labelPropertyKey: 'streetwear.toolbar.tier.all' },
  { tier: 'Retail', labelPropertyKey: 'streetwear.toolbar.tier.retail' },
  { tier: 'B2B', labelPropertyKey: 'streetwear.toolbar.tier.b2b' }
];

export const STREETWEAR_HEADER_STATS: readonly StreetwearHeaderStat[] = [
  {
    valuePropertyKey: 'streetwear.stats.capsules.value',
    labelPropertyKey: 'streetwear.stats.capsules.label',
    accentClass: 'text-crimson'
  },
  {
    valuePropertyKey: 'streetwear.stats.weight.value',
    labelPropertyKey: 'streetwear.stats.weight.label',
    accentClass: 'text-ink'
  },
  {
    valuePropertyKey: 'streetwear.stats.clg.value',
    labelPropertyKey: 'streetwear.stats.clg.label',
    accentClass: 'text-crimson'
  },
  {
    valuePropertyKey: 'streetwear.stats.margin.value',
    labelPropertyKey: 'streetwear.stats.margin.label',
    accentClass: 'text-amber'
  }
];

export const STREETWEAR_FOOTER_COLUMNS: readonly StreetwearFooterColumn[] = [
  {
    titlePropertyKey: 'streetwear.footer.col1.title',
    bodyPropertyKey: 'streetwear.footer.col1.body'
  },
  {
    titlePropertyKey: 'streetwear.footer.col2.title',
    bodyPropertyKey: 'streetwear.footer.col2.body'
  },
  {
    titlePropertyKey: 'streetwear.footer.col3.title',
    bodyPropertyKey: 'streetwear.footer.col3.body',
    emailPropertyKey: 'streetwear.footer.col3.email'
  }
];

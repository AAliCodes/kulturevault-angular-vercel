import { BaseCatalogProduct } from '../../../core/models/base-catalog.model';

export interface SneakerSizeQuote {
  readonly sizeUs: string;
  readonly sizeUk: string;
  readonly lowestAskZar: number;
  readonly highestBidZar: number;
  readonly lastSaleZar: number;
  readonly stockQty: number;
  readonly sku: string;
}

/**
 * Pure Domain Model for Deadstock Sneakers Exchange (SneakerProduct)
 * Zero cross-contamination: no food attributes (no halal_status, no cold_chain_packaging)
 * and no industrial hardware attributes.
 */
export interface SneakerProduct extends BaseCatalogProduct {
  readonly style_code: string;
  readonly colorway: string;
  readonly release_year: number;
  readonly authentication_badge: string;
  readonly box_condition: string;
  readonly size_matrix: readonly SneakerSizeQuote[];
}

export interface SneakerHeaderStat {
  readonly valuePropertyKey: string;
  readonly labelPropertyKey: string;
  readonly accentClass: string;
}

export interface SneakerTierOption {
  readonly tier: 'All' | 'Retail' | 'B2B';
  readonly labelPropertyKey: string;
}

export interface SneakerFooterColumn {
  readonly titlePropertyKey: string;
  readonly bodyPropertyKey: string;
  readonly emailPropertyKey?: string;
}

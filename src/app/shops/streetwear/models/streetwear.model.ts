import { BaseCatalogProduct } from '../../../core/models/base-catalog.model';

/**
 * Pure Domain Model for Streetwear & Apparel Archive (StreetwearProduct)
 * Zero cross-contamination: no food attributes (no halal_status, no cold_chain_packaging)
 * and no industrial hardware attributes.
 */
export interface StreetwearProduct extends BaseCatalogProduct {
  readonly season_code: string;
  readonly garment_fit: string;
  readonly fabric_composition: string;
  readonly authenticity_verification: string;
  readonly available_sizes: readonly string[];
}

export interface StreetwearHeaderStat {
  readonly valuePropertyKey: string;
  readonly labelPropertyKey: string;
  readonly accentClass: string;
}

export interface StreetwearTierOption {
  readonly tier: 'All' | 'Retail' | 'B2B';
  readonly labelPropertyKey: string;
}

export interface StreetwearFooterColumn {
  readonly titlePropertyKey: string;
  readonly bodyPropertyKey: string;
  readonly emailPropertyKey?: string;
}

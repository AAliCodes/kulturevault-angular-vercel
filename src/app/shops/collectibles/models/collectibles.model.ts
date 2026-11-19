import { BaseCatalogProduct } from '../../../core/models/base-catalog.model';

/**
 * Pure Domain Model for Collectibles & Art Vault (CollectibleProduct)
 * Zero cross-contamination: no food attributes (no halal_status, no cold_chain_packaging)
 * and no industrial hardware attributes.
 */
export interface CollectibleProduct extends BaseCatalogProduct {
  readonly edition_type: string;
  readonly dimensions_spec: string;
  readonly hologram_seal: string;
  readonly release_season: string;
}

export interface CollectibleHeaderStat {
  readonly valuePropertyKey: string;
  readonly labelPropertyKey: string;
  readonly accentClass: string;
}

export interface CollectibleTierOption {
  readonly tier: 'All' | 'Retail' | 'B2B';
  readonly labelPropertyKey: string;
}

export interface CollectibleFooterColumn {
  readonly titlePropertyKey: string;
  readonly bodyPropertyKey: string;
  readonly emailPropertyKey?: string;
}

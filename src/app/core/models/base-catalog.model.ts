import {
  CatalogSyncSourceType,
  CheckoutGatewayType,
  ProductTier,
  StoreDepartment
} from '../enums/shop.enums';

export interface ProductVariant {
  readonly optionValue: string;
  readonly sku: string;
  readonly price: number;
  readonly stockQty: number;
}

/**
 * Pure Base Catalog Product Contract
 * Contains only universal commercial, exchange, and inventory attributes shared across all KULTUREVAULT shops.
 * Zero food-specific (no halal_status, no cold_chain_packaging) or industrial hardware cross-contamination.
 */
export interface BaseCatalogProduct {
  readonly id: string;
  readonly code: string;
  readonly title: string;
  readonly brand: string;
  readonly category: string;
  readonly subcategory: string;
  readonly description: string;
  readonly unit: string;
  readonly tier: `${ProductTier.B2B}` | `${ProductTier.RETAIL}`;
  readonly wholesale_cost: number;
  readonly benchmark_retail_price: number;
  readonly target_margin_pct: number;
  readonly packaging: string;
  readonly shelf_life: string;
  readonly stock_qty: number;
  readonly is_active: boolean;
  readonly image_url: string;
  readonly lowest_ask_zar: number;
  readonly highest_bid_zar: number;
  readonly last_sale_zar: number;
  readonly market_change_pct: number;
  readonly variants?: ProductVariant[];
}

export interface ShopifyCatalogApiResponse<TProduct = unknown> {
  readonly source: CatalogSyncSourceType;
  readonly configured: boolean;
  readonly lob?: StoreDepartment;
  readonly storeDomain?: string;
  readonly count: number;
  readonly products: TProduct[];
}

export interface CheckoutLineItemPayload {
  readonly sku: string;
  readonly variantId?: string;
  readonly title: string;
  readonly optionSelection: string;
  readonly orderType: string;
  readonly quantity: number;
  readonly unitPriceZar: string;
  readonly lineTotalZar: string;
}

export interface CheckoutSessionPayload {
  readonly mode: CatalogSyncSourceType;
  readonly gateway: CheckoutGatewayType;
  readonly reference: string;
  readonly subtotalZar: string;
  readonly deliveryFeeZar: string;
  readonly totalZar: string;
  readonly itemCount: number;
  readonly cutoffNotice: string;
  readonly graphqlMutation: string;
  readonly checkoutUrl?: string;
  readonly invoiceUrl?: string;
  readonly draftOrderId?: string;
  readonly cartId?: string;
  readonly lineItems: CheckoutLineItemPayload[];
}

export interface ShopifyCheckoutApiResponse {
  readonly mode: CatalogSyncSourceType;
  readonly gateway: CheckoutGatewayType;
  readonly reference: string;
  readonly cartId?: string;
  readonly draftOrderId?: string;
  readonly checkoutUrl?: string;
  readonly invoiceUrl?: string;
}

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  CheckoutGatewayType,
  MarketOrderType,
  StoreDepartment
} from '../enums/shop.enums';
import {
  ShopifyCatalogApiResponse,
  ShopifyCheckoutApiResponse
} from '../models/base-catalog.model';
import { SHOP_CORE_VALUES } from '../values/shop-core.values';

export interface ShopifyCheckoutRequestItem {
  readonly sku: string;
  readonly variantId?: string;
  readonly title: string;
  readonly optionSelection: string;
  readonly quantity: number;
  readonly unitPrice: number;
  readonly orderType: MarketOrderType;
  readonly discountPct?: number;
}

export interface ShopifyCheckoutRequestBody {
  readonly gateway: CheckoutGatewayType;
  readonly reference: string;
  readonly lob: StoreDepartment;
  readonly hasMarketBid: boolean;
  readonly subtotalPrice: number;
  readonly deliveryFee: number;
  readonly items: readonly ShopifyCheckoutRequestItem[];
}

@Injectable({ providedIn: 'root' })
export class ShopifyApiService {
  private readonly http = inject(HttpClient);

  fetchCatalog<TProduct>(lob?: StoreDepartment): Observable<ShopifyCatalogApiResponse<TProduct>> {
    const endpoint = lob
      ? `${SHOP_CORE_VALUES.SHOPIFY_CATALOG_ENDPOINT}?lob=${encodeURIComponent(lob)}`
      : SHOP_CORE_VALUES.SHOPIFY_CATALOG_ENDPOINT;
    return this.http.get<ShopifyCatalogApiResponse<TProduct>>(endpoint);
  }

  createCheckoutSession(payload: ShopifyCheckoutRequestBody): Observable<ShopifyCheckoutApiResponse> {
    return this.http.post<ShopifyCheckoutApiResponse>(
      SHOP_CORE_VALUES.SHOPIFY_CHECKOUT_ENDPOINT,
      payload
    );
  }
}

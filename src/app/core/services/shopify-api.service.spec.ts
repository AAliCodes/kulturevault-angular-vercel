import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import {
  assertEqual,
  assertTrue,
  describeShopSuite,
  instantiateWithAngularDI,
  itShould
} from '../testing/shop-test-harness';
import { ShopifyApiService, ShopifyCheckoutRequestBody } from './shopify-api.service';
import {
  CatalogSyncSource,
  CheckoutGateway,
  MarketOrderTypeEnum,
  ShopId
} from '../enums/shop.enums';

describeShopSuite('ShopifyApiService (src/app/core/services/shopify-api.service.spec.ts)', () => {
  itShould('fetches LOB-scoped catalog from /api/shopify/catalog?lob=<shop>', () => {
    let capturedUrl = '';
    const mockHttp = {
      get: (url: string) => {
        capturedUrl = url;
        return of({
          source: CatalogSyncSource.SEED_FALLBACK,
          configured: false,
          lob: ShopId.SNEAKERS,
          count: 20,
          products: []
        });
      }
    };

    const { instance: api } = instantiateWithAngularDI(
      () => new ShopifyApiService(),
      [{ provide: HttpClient, useValue: mockHttp }]
    );

    api.fetchCatalog(ShopId.SNEAKERS).subscribe(res => {
      assertEqual(res.count, 20);
    });
    assertEqual(capturedUrl, '/api/shopify/catalog?lob=sneakers');
  });

  itShould('dispatches POST checkout payload to /api/shopify/checkout', () => {
    let capturedEndpoint = '';
    let capturedBody: ShopifyCheckoutRequestBody | null = null;

    const mockHttp = {
      post: (url: string, body: ShopifyCheckoutRequestBody) => {
        capturedEndpoint = url;
        capturedBody = body;
        return of({
          mode: CatalogSyncSource.SEED_FALLBACK,
          gateway: CheckoutGateway.PAYGATE,
          reference: body.reference
        });
      }
    };

    const { instance: api } = instantiateWithAngularDI(
      () => new ShopifyApiService(),
      [{ provide: HttpClient, useValue: mockHttp }]
    );

    const payload: ShopifyCheckoutRequestBody = {
      gateway: CheckoutGateway.PAYGATE,
      reference: 'KLT-SNK-123456',
      lob: ShopId.SNEAKERS,
      hasMarketBid: false,
      subtotalPrice: 8900,
      deliveryFee: 0,
      items: [
        {
          sku: 'DZ5485-612',
          title: 'Air Jordan 1 Chicago Lost & Found',
          optionSelection: 'US 9 / UK 8',
          quantity: 1,
          unitPrice: 8900,
          orderType: MarketOrderTypeEnum.BUY_NOW
        }
      ]
    };

    api.createCheckoutSession(payload).subscribe(res => {
      assertEqual(res.reference, 'KLT-SNK-123456');
    });

    assertEqual(capturedEndpoint, '/api/shopify/checkout');
    assertTrue(capturedBody !== null);
  });
});

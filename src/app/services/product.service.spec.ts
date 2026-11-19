import { of } from 'rxjs';
import {
  assertEqual,
  describeShopSuite,
  instantiateWithAngularDI,
  itShould
} from '../core/testing/shop-test-harness';
import { ProductService } from './product.service';
import { SneakersShopService } from '../shops/sneakers/services/sneakers-shop.service';
import { ShopifyApiService } from '../core/services/shopify-api.service';
import { CartService } from './cart.service';
import { PropertiesService } from '../core/services/properties.service';
import { CatalogSyncSource, CheckoutGateway } from '../models/product.model';

describeShopSuite('ProductService Facade (src/app/services/product.service.spec.ts)', () => {
  itShould('delegates catalog and brand filtering to SneakersShopService', () => {
    const mockShopifyApi = {
      fetchCatalog: () => of({ source: CatalogSyncSource.SEED_FALLBACK, configured: false, count: 0, products: [] }),
      createCheckoutSession: () =>
        of({
          mode: CatalogSyncSource.SEED_FALLBACK,
          gateway: CheckoutGateway.PAYGATE,
          reference: 'KLT-SNK-100'
        })
    };

    const { instance: cart } = instantiateWithAngularDI(
      () => new CartService(),
      [PropertiesService, { provide: ShopifyApiService, useValue: mockShopifyApi }]
    );

    const { instance: sneakersSvc } = instantiateWithAngularDI(
      () => new SneakersShopService(),
      [
        { provide: ShopifyApiService, useValue: mockShopifyApi },
        { provide: CartService, useValue: cart }
      ]
    );

    const { instance: facade } = instantiateWithAngularDI(
      () => new ProductService(),
      [{ provide: SneakersShopService, useValue: sneakersSvc }]
    );

    assertEqual(facade.products().length, 20);
    facade.setBrand('Jordan');
    assertEqual(facade.selectedBrand(), 'Jordan');
  });
});

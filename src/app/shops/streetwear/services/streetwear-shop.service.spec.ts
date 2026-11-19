import { of } from 'rxjs';
import {
  assertEqual,
  assertTrue,
  describeShopSuite,
  instantiateWithAngularDI,
  itShould
} from '../../../core/testing/shop-test-harness';
import { StreetwearShopService } from './streetwear-shop.service';
import { ShopifyApiService } from '../../../core/services/shopify-api.service';
import { CartService } from '../../../services/cart.service';
import { PropertiesService } from '../../../core/services/properties.service';
import {
  ApparelSizeOptionEnum,
  CatalogSyncSource,
  CheckoutGateway,
  StreetwearCategoryFilterEnum,
  StreetwearPurchaseModeEnum
} from '../../../models/product.model';

describeShopSuite('StreetwearShopService (src/app/shops/streetwear/services/streetwear-shop.service.spec.ts)', () => {
  function createService() {
    const mockShopifyApi = {
      fetchCatalog: () =>
        of({
          source: CatalogSyncSource.SEED_FALLBACK,
          configured: false,
          count: 0,
          products: []
        }),
      createCheckoutSession: () =>
        of({
          mode: CatalogSyncSource.SEED_FALLBACK,
          gateway: CheckoutGateway.PAYGATE,
          reference: 'KLT-STR-0001'
        })
    };

    const { instance: cartService } = instantiateWithAngularDI(
      () => new CartService(),
      [PropertiesService, { provide: ShopifyApiService, useValue: mockShopifyApi }]
    );

    const { instance: service } = instantiateWithAngularDI(
      () => new StreetwearShopService(),
      [
        { provide: ShopifyApiService, useValue: mockShopifyApi },
        { provide: CartService, useValue: cartService }
      ]
    );

    return { service, cartService };
  }

  itShould('loads all 16 Supreme, Off-White, and Stüssy streetwear SKUs', () => {
    const { service } = createService();
    assertEqual(service.products().length, 16);
  });

  itShould('filters streetwear by house (Supreme, Off-White, Stüssy) and category', () => {
    const { service } = createService();

    service.setBrand('Supreme');
    assertEqual(service.filteredProducts().length, 5);

    service.setBrand('Off-White');
    assertEqual(service.filteredProducts().length, 5);

    service.setBrand('Stüssy');
    assertEqual(service.filteredProducts().length, 6);

    service.setBrand('All');
    service.setCategory(StreetwearCategoryFilterEnum.BOX_LOGO_HOODIES);
    assertTrue(service.filteredProducts().length >= 4);
  });

  itShould('calculates collector bid ZAR savings and adds sized apparel to Vault Bag', () => {
    const { service, cartService } = createService();
    const bogo = service.products()[0];

    assertTrue(service.getBidSavingsAmount(bogo) > 0, 'Collector bid savings must be > 0');

    service.setSelectedSize(bogo.id, ApparelSizeOptionEnum.XL);
    service.setPurchaseMode(bogo.id, StreetwearPurchaseModeEnum.COLLECTOR_BID);
    assertEqual(service.getDisplayPrice(bogo), bogo.highest_bid_zar);

    service.setCardQuantity(bogo.id, 2);
    service.addProductToCart(bogo);
    assertEqual(cartService.totalItems(), 2);
  });
});

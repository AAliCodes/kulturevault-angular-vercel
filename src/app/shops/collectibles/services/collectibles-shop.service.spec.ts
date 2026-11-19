import { of } from 'rxjs';
import {
  assertEqual,
  assertTrue,
  describeShopSuite,
  instantiateWithAngularDI,
  itShould
} from '../../../core/testing/shop-test-harness';
import { CollectiblesShopService } from './collectibles-shop.service';
import { ShopifyApiService } from '../../../core/services/shopify-api.service';
import { CartService } from '../../../services/cart.service';
import { PropertiesService } from '../../../core/services/properties.service';
import {
  CatalogSyncSource,
  CheckoutGateway,
  CollectibleCategoryFilterEnum,
  CollectibleOrderModeEnum
} from '../../../models/product.model';

describeShopSuite('CollectiblesShopService (src/app/shops/collectibles/services/collectibles-shop.service.spec.ts)', () => {
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
          reference: 'KLT-COL-0001'
        })
    };

    const { instance: cartService } = instantiateWithAngularDI(
      () => new CartService(),
      [PropertiesService, { provide: ShopifyApiService, useValue: mockShopifyApi }]
    );

    const { instance: service } = instantiateWithAngularDI(
      () => new CollectiblesShopService(),
      [
        { provide: ShopifyApiService, useValue: mockShopifyApi },
        { provide: CartService, useValue: cartService }
      ]
    );

    return { service, cartService };
  }

  itShould('loads all 14 collectibles and art vault items', () => {
    const { service } = createService();
    assertEqual(service.products().length, 14);
  });

  itShould('filters collectibles by creator (Medicom Toy, KAWS, Supreme, Off-White, Stüssy, Vault Lab)', () => {
    const { service } = createService();

    service.setCreator('Medicom Toy');
    assertEqual(service.filteredProducts().length, 2);

    service.setCreator('KAWS');
    assertEqual(service.filteredProducts().length, 2);

    service.setCreator('All');
    service.setCategory(CollectibleCategoryFilterEnum.VAULT_CARE_DISPLAY);
    assertEqual(service.filteredProducts().length, 4);
  });

  itShould('toggles between Acquire Now and Collector Bid and opens drawer on add', () => {
    const { service, cartService } = createService();
    const bearbrick = service.products()[0];

    service.setOrderMode(bearbrick.id, CollectibleOrderModeEnum.VAULT_BID);
    assertEqual(service.getDisplayPrice(bearbrick), bearbrick.highest_bid_zar);

    service.addProductToCart(bearbrick);
    assertEqual(cartService.totalItems(), 1);
    assertTrue(cartService.isDrawerOpen(), 'Drawer should open upon adding collectible');
  });
});

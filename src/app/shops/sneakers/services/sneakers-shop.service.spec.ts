import { of } from 'rxjs';
import {
  assertEqual,
  assertTrue,
  describeShopSuite,
  instantiateWithAngularDI,
  itShould
} from '../../../core/testing/shop-test-harness';
import { SneakersShopService } from './sneakers-shop.service';
import { ShopifyApiService } from '../../../core/services/shopify-api.service';
import { CartService } from '../../../services/cart.service';
import { PropertiesService } from '../../../core/services/properties.service';
import {
  CatalogSyncSource,
  CheckoutGateway,
  SneakerCatalogViewModeEnum,
  SneakerCategoryFilterEnum,
  SneakerSizeOptionEnum,
  SneakerTradeModeEnum
} from '../../../models/product.model';

describeShopSuite('SneakersShopService (src/app/shops/sneakers/services/sneakers-shop.service.spec.ts)', () => {
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
          reference: 'KLT-SNK-0001'
        })
    };

    const { instance: cartService } = instantiateWithAngularDI(
      () => new CartService(),
      [PropertiesService, { provide: ShopifyApiService, useValue: mockShopifyApi }]
    );

    const { instance: service } = instantiateWithAngularDI(
      () => new SneakersShopService(),
      [
        { provide: ShopifyApiService, useValue: mockShopifyApi },
        { provide: CartService, useValue: cartService }
      ]
    );

    return { service, cartService };
  }

  itShould('loads all 20 deadstock sneaker grails from seed catalog', () => {
    const { service } = createService();
    assertEqual(service.products().length, 20);
    assertEqual(service.filteredProducts().length, 20);
  });

  itShould('filters deadstock sneakers by brand (Jordan, Off-White, Stüssy, Supreme) and category', () => {
    const { service } = createService();

    service.setBrand('Jordan');
    assertTrue(service.filteredProducts().length >= 6, 'Should have at least 6 Jordan grails');
    assertTrue(service.filteredProducts().every(p => p.brand === 'Jordan'));

    service.setBrand('Off-White');
    assertTrue(service.filteredProducts().length >= 4, 'Should have at least 4 Off-White grails');

    service.setBrand('All');
    service.setCategory(SneakerCategoryFilterEnum.DUNK_SB_GRAIL);
    assertTrue(service.filteredProducts().length >= 3);
  });

  itShould('updates Lowest Ask and Highest Bid dynamically when switching US/UK sneaker sizes', () => {
    const { service } = createService();
    const first = service.products()[0];

    service.setSelectedSize(first.id, SneakerSizeOptionEnum.US_8);
    const askUs8 = service.getActiveAskPrice(first);

    service.setSelectedSize(first.id, SneakerSizeOptionEnum.US_11);
    const askUs11 = service.getActiveAskPrice(first);

    assertTrue(askUs11 > askUs8, 'US 11 deadstock ask quote should exceed US 8 quote');
  });

  itShould('switches between Buy Now (Lowest Ask) and Lock Market Bid (Highest Bid) and adds to Vault Bag', () => {
    const { service, cartService } = createService();
    const first = service.products()[0];

    service.setTradeMode(first.id, SneakerTradeModeEnum.BUY_NOW);
    const askPrice = service.getDisplayPrice(first);

    service.setTradeMode(first.id, SneakerTradeModeEnum.PLACE_BID);
    const bidPrice = service.getDisplayPrice(first);

    assertTrue(bidPrice < askPrice, 'Market bid price must be lower than lowest ask');

    service.setCardQuantity(first.id, 2);
    service.addProductToCart(first);
    assertEqual(cartService.totalItems(), 2);
    assertEqual(service.getCardQuantity(first.id), 1, 'Card quantity resets to 1 after adding');

    service.setViewMode(SneakerCatalogViewModeEnum.TABLE);
    assertEqual(service.viewMode(), SneakerCatalogViewModeEnum.TABLE);
  });
});

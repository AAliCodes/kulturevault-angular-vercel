import { of } from 'rxjs';
import {
  assertEqual,
  assertMatch,
  assertTrue,
  describeShopSuite,
  instantiateWithAngularDI,
  itShould
} from '../core/testing/shop-test-harness';
import { CartService } from './cart.service';
import { PropertiesService } from '../core/services/properties.service';
import { ShopifyApiService } from '../core/services/shopify-api.service';
import {
  CatalogSyncSource,
  CheckoutGateway,
  CollectibleProduct,
  MarketOrderTypeEnum,
  SneakerProduct
} from '../models/product.model';
import sneakersSeed from '../../assets/kulturevault-sneakers-seed.json';
import collectiblesSeed from '../../assets/kulturevault-collectibles-seed.json';

describeShopSuite('CartService (src/app/services/cart.service.spec.ts)', () => {
  function createCart() {
    const mockShopifyApi = {
      fetchCatalog: () => of({ source: CatalogSyncSource.SEED_FALLBACK, configured: false, count: 0, products: [] }),
      createCheckoutSession: (body: { reference: string }) =>
        of({
          mode: CatalogSyncSource.SEED_FALLBACK,
          gateway: CheckoutGateway.PAYGATE,
          reference: body.reference
        })
    };

    const { instance } = instantiateWithAngularDI(
      () => new CartService(),
      [PropertiesService, { provide: ShopifyApiService, useValue: mockShopifyApi }]
    );
    return instance;
  }

  itShould('enforces R 250 armored courier fee under R 5,000 and free over R 5,000 for sneakers/streetwear', () => {
    const cart = createCart();
    const sneaker = (sneakersSeed as SneakerProduct[])[0];

    cart.addSneakerToCart(sneaker, 'US 9 / UK 8', 3200, MarketOrderTypeEnum.BUY_NOW, 1);
    assertEqual(cart.subtotalPrice(), 3200);
    assertEqual(cart.deliveryFee(), 250);
    assertEqual(cart.grandTotal(), 3450);

    cart.updateQuantity(cart.cartItems()[0].cartItemId, 1);
    assertEqual(cart.subtotalPrice(), 6400);
    assertEqual(cart.deliveryFee(), 0);
  });

  itShould('enforces R 450 art crate freight under R 12,000 and free over R 12,000 for collectibles', () => {
    const cart = createCart();
    const item = (collectiblesSeed as CollectibleProduct[])[5]; // R 2,900

    cart.addCollectibleToCart(item, 2900, MarketOrderTypeEnum.BUY_NOW, 1);
    assertEqual(cart.deliveryFee(), 450);

    cart.updateQuantity(cart.cartItems()[0].cartItemId, 4); // 5 * 2900 = 14500
    assertEqual(cart.deliveryFee(), 0);
  });

  itShould('creates LOB-scoped checkout session with PayGate, Ozow, or Shopify gateway', () => {
    const cart = createCart();
    const sneaker = (sneakersSeed as SneakerProduct[])[0];

    cart.addSneakerToCart(sneaker, 'US 10 / UK 9', 8900, MarketOrderTypeEnum.BUY_NOW, 1);
    cart.initiateCheckout(CheckoutGateway.OZOW);

    const session = cart.activeCheckoutSession();
    assertTrue(session !== null);
    assertMatch(session?.reference ?? '', /^KLT-SNK-/);
    assertEqual(session?.gateway, CheckoutGateway.OZOW);
  });
});

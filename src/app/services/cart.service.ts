import { Injectable, inject, signal, computed } from '@angular/core';
import {
  BaseCatalogProduct,
  CartItem,
  CatalogSyncSource,
  CheckoutGatewayType,
  CheckoutLineItemPayload,
  CheckoutSessionPayload,
  CollectibleProduct,
  MarketOrderType,
  MarketOrderTypeEnum,
  PropertiesNamespace,
  ShopId,
  SneakerProduct,
  StoreDepartment,
  StreetwearProduct
} from '../models/product.model';
import {
  ShopifyApiService,
  ShopifyCheckoutRequestBody
} from '../core/services/shopify-api.service';
import { PropertiesService } from '../core/services/properties.service';
import { SHOP_THEME_REGISTRY } from '../core/config/shop-registry.config';
import { SNEAKERS_SHOP_VALUES } from '../shops/sneakers/values/sneakers.values';
import { STREETWEAR_SHOP_VALUES } from '../shops/streetwear/values/streetwear.values';
import { COLLECTIBLES_SHOP_VALUES } from '../shops/collectibles/values/collectibles.values';

export { CheckoutSessionPayload } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly shopifyApi = inject(ShopifyApiService);
  private readonly propertiesService = inject(PropertiesService);

  readonly cartItems = signal<CartItem[]>([]);
  readonly isDrawerOpen = signal<boolean>(false);
  readonly isSubmittingCheckout = signal<boolean>(false);
  readonly activeCheckoutSession = signal<CheckoutSessionPayload | null>(null);
  readonly toastMessage = signal<string | null>(null);

  readonly totalItems = computed<number>(() =>
    this.cartItems().reduce((sum, item) => sum + item.quantity, 0)
  );

  readonly subtotalPrice = computed<number>(() =>
    Number(
      this.cartItems()
        .reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
        .toFixed(2)
    )
  );

  readonly hasCollectibleItem = computed<boolean>(() =>
    this.cartItems().some(
      item =>
        item.lob === ShopId.COLLECTIBLES ||
        item.product.id.startsWith('SKU-COL-')
    )
  );

  readonly hasStreetwearItem = computed<boolean>(() =>
    this.cartItems().some(
      item =>
        item.lob === ShopId.STREETWEAR ||
        item.product.id.startsWith('SKU-STR-')
    )
  );

  readonly hasMarketBidItem = computed<boolean>(() =>
    this.cartItems().some(item => item.orderType === MarketOrderTypeEnum.PLACE_BID)
  );

  readonly dominantLob = computed<StoreDepartment>(() => {
    if (this.hasCollectibleItem()) {
      return ShopId.COLLECTIBLES;
    }
    if (this.hasStreetwearItem()) {
      return ShopId.STREETWEAR;
    }
    return ShopId.SNEAKERS;
  });

  readonly freeDeliveryThreshold = computed<number>(() =>
    this.hasCollectibleItem()
      ? COLLECTIBLES_SHOP_VALUES.FREE_DELIVERY_THRESHOLD_ZAR
      : SNEAKERS_SHOP_VALUES.FREE_DELIVERY_THRESHOLD_ZAR
  );

  readonly deliveryFee = computed<number>(() => {
    const items = this.cartItems();
    if (items.length === 0) {
      return 0;
    }
    const sub = this.subtotalPrice();
    if (this.hasCollectibleItem()) {
      return sub >= COLLECTIBLES_SHOP_VALUES.FREE_DELIVERY_THRESHOLD_ZAR
        ? 0
        : COLLECTIBLES_SHOP_VALUES.STANDARD_CRATE_FREIGHT_ZAR;
    }
    return sub >= SNEAKERS_SHOP_VALUES.FREE_DELIVERY_THRESHOLD_ZAR
      ? 0
      : SNEAKERS_SHOP_VALUES.STANDARD_ARMORED_COURIER_ZAR;
  });

  readonly grandTotal = computed<number>(() =>
    Number((this.subtotalPrice() + this.deliveryFee()).toFixed(2))
  );

  readonly amountToFreeDelivery = computed<number>(() => {
    const threshold = this.freeDeliveryThreshold();
    const sub = this.subtotalPrice();
    return sub >= threshold ? 0 : Number((threshold - sub).toFixed(2));
  });

  readonly freeDeliveryProgressPct = computed<number>(() => {
    const threshold = this.freeDeliveryThreshold();
    if (threshold <= 0) return 100;
    return Math.min(100, Math.round((this.subtotalPrice() / threshold) * 100));
  });

  readonly drawerTitle = computed<string>(() => {
    const lob = this.dominantLob();
    return this.propertiesService.get(
      PropertiesNamespace.SHELL,
      `shell.drawer.title.${lob}`
    );
  });

  readonly drawerCountLabel = computed<string>(() => {
    const lob = this.dominantLob();
    return this.propertiesService.get(
      PropertiesNamespace.SHELL,
      `shell.drawer.count.${lob}`,
      [this.totalItems()]
    );
  });

  readonly cartSubtotalLabel = computed<string>(() => {
    const lob = this.dominantLob();
    return this.propertiesService.get(
      PropertiesNamespace.SHELL,
      `shell.summary.subtotal.${lob}`
    );
  });

  openDrawer(): void {
    this.isDrawerOpen.set(true);
  }

  closeDrawer(): void {
    this.isDrawerOpen.set(false);
  }

  toggleDrawer(): void {
    this.isDrawerOpen.update(v => !v);
  }

  addSneakerToCart(
    product: SneakerProduct,
    sizeLabel: string,
    unitPrice: number,
    orderType: MarketOrderType = MarketOrderTypeEnum.BUY_NOW,
    quantity = 1
  ): void {
    const cartItemId = `${product.id}-${sizeLabel.replace(/\s+/g, '')}-${orderType}`;
    const discountPct = orderType === MarketOrderTypeEnum.PLACE_BID ? 8 : 0;

    this.upsertCartItem({
      cartItemId,
      product,
      optionSelection: sizeLabel,
      unitPrice: Number(unitPrice.toFixed(2)),
      quantity,
      orderType,
      discountPct,
      lob: ShopId.SNEAKERS
    });

    const prefix = this.propertiesService.get(
      PropertiesNamespace.SNEAKERS,
      'sneakers.toast.addedPrefix'
    );
    this.triggerToast(`${prefix} ${product.title} (${sizeLabel})`);
  }

  addStreetwearToCart(
    product: StreetwearProduct,
    sizeLabel: string,
    unitPrice: number,
    orderType: MarketOrderType = MarketOrderTypeEnum.BUY_NOW,
    quantity = 1
  ): void {
    const cartItemId = `${product.id}-${sizeLabel}-${orderType}`;
    const discountPct = orderType === MarketOrderTypeEnum.PLACE_BID ? 9 : 0;

    this.upsertCartItem({
      cartItemId,
      product,
      optionSelection: `Size ${sizeLabel} (${product.season_code})`,
      unitPrice: Number(unitPrice.toFixed(2)),
      quantity,
      orderType,
      discountPct,
      lob: ShopId.STREETWEAR
    });

    this.triggerToast(`Added to Vault Bag: ${product.title} (Size ${sizeLabel})`);
  }

  addCollectibleToCart(
    product: CollectibleProduct,
    unitPrice: number,
    orderType: MarketOrderType = MarketOrderTypeEnum.BUY_NOW,
    quantity = 1
  ): void {
    const cartItemId = `${product.id}-${orderType}`;
    const discountPct = orderType === MarketOrderTypeEnum.PLACE_BID ? 10 : 0;

    this.upsertCartItem({
      cartItemId,
      product,
      optionSelection: product.edition_type,
      unitPrice: Number(unitPrice.toFixed(2)),
      quantity,
      orderType,
      discountPct,
      lob: ShopId.COLLECTIBLES
    });

    this.triggerToast(`Added to Vault Crate: ${product.title}`);
  }

  updateQuantity(cartItemId: string, delta: number): void {
    this.cartItems.update(items =>
      items
        .map(item =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter(item => item.quantity > 0)
    );
  }

  removeFromCart(cartItemId: string): void {
    this.cartItems.update(items =>
      items.filter(item => item.cartItemId !== cartItemId)
    );
  }

  clearCart(): void {
    this.cartItems.set([]);
    this.activeCheckoutSession.set(null);
  }

  formatZar(amount: number): string {
    return `R ${amount.toLocaleString('en-ZA', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  }

  initiateCheckout(gateway: CheckoutGatewayType): void {
    const items = this.cartItems();
    if (items.length === 0) {
      return;
    }

    const lob = this.dominantLob();
    const theme = SHOP_THEME_REGISTRY[lob];
    const ref = `${theme.branding.orderReferencePrefix}-${Date.now().toString().slice(-6)}`;
    const subtotal = this.subtotalPrice();
    const shipping = this.deliveryFee();
    const total = this.grandTotal();

    const lineItems: CheckoutLineItemPayload[] = items.map(i => ({
      sku: i.product.code,
      variantId: i.variantId,
      title: i.product.title,
      optionSelection: i.optionSelection,
      orderType:
        i.orderType === MarketOrderTypeEnum.PLACE_BID
          ? 'Live Market Bid Locked'
          : 'Instant Buy Now (Lowest Ask)',
      quantity: i.quantity,
      unitPriceZar: this.formatZar(i.unitPrice),
      lineTotalZar: this.formatZar(i.unitPrice * i.quantity)
    }));

    const cutoffNotice =
      lob === ShopId.COLLECTIBLES
        ? 'Double-Boxed Foam Art Crate • Hologram Serial Logged • Immediate Gateway Settlement'
        : lob === ShopId.STREETWEAR
        ? 'Certilogo CLG & Woven RN Verified • Armored Courier Dispatch • Enforced Settlement'
        : '12-Point Lab UV & Stitch Inspection • RFID Tamper Tag • Armored Courier Dispatch';

    const localSession: CheckoutSessionPayload = {
      mode: CatalogSyncSource.SEED_FALLBACK,
      gateway,
      reference: ref,
      subtotalZar: this.formatZar(subtotal),
      deliveryFeeZar:
        shipping === 0
          ? this.propertiesService.get(
              PropertiesNamespace.SHELL,
              'shell.summary.shipping.free'
            )
          : this.formatZar(shipping),
      totalZar: this.formatZar(total),
      itemCount: this.totalItems(),
      cutoffNotice,
      graphqlMutation: 'mutation CreateKultureVaultDraftOrder($input: DraftOrderInput!)',
      lineItems
    };

    this.activeCheckoutSession.set(localSession);
    this.isSubmittingCheckout.set(true);

    const requestBody: ShopifyCheckoutRequestBody = {
      gateway,
      reference: ref,
      lob,
      hasMarketBid: this.hasMarketBidItem(),
      subtotalPrice: subtotal,
      deliveryFee: shipping,
      items: items.map(i => ({
        sku: i.product.code,
        variantId: i.variantId,
        title: i.product.title,
        optionSelection: i.optionSelection,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
        orderType: i.orderType,
        discountPct: i.discountPct
      }))
    };

    this.shopifyApi.createCheckoutSession(requestBody).subscribe({
      next: apiRes => {
        this.activeCheckoutSession.update(current =>
          current
            ? {
                ...current,
                mode: apiRes.mode || current.mode,
                reference: apiRes.reference || current.reference,
                checkoutUrl: apiRes.checkoutUrl,
                invoiceUrl: apiRes.invoiceUrl,
                draftOrderId: apiRes.draftOrderId,
                cartId: apiRes.cartId
              }
            : null
        );
        this.isSubmittingCheckout.set(false);
      },
      error: () => {
        this.isSubmittingCheckout.set(false);
      }
    });
  }

  private upsertCartItem(incoming: CartItem): void {
    this.cartItems.update(current => {
      const idx = current.findIndex(item => item.cartItemId === incoming.cartItemId);
      if (idx > -1) {
        const updated = [...current];
        updated[idx] = {
          ...updated[idx],
          quantity: updated[idx].quantity + incoming.quantity
        };
        return updated;
      }
      return [...current, incoming];
    });
  }

  private triggerToast(msg: string): void {
    this.toastMessage.set(msg);
    setTimeout(() => {
      if (this.toastMessage() === msg) {
        this.toastMessage.set(null);
      }
    }, 3600);
  }
}

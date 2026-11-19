import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CartService, CheckoutSessionPayload } from './services/cart.service';
import { ProductService } from './services/product.service';
import { ShopContextService } from './core/services/shop-context.service';
import {
  PropertiesService,
  PropertyInterpolationParams
} from './core/services/properties.service';
import {
  CheckoutGateway,
  MarketOrderTypeEnum,
  PropertiesNamespace,
  StoreDepartment
} from './models/product.model';

export { StoreDepartment } from './models/product.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  styleUrl: './app.component.scss',
  template: `
    <!-- Material 3 Surface Navigation Shell -->
    <header class="navbar mat-elevation-1">
      <div class="container nav-wrapper">
        <a [routerLink]="activeTheme().branding.primaryRoute" class="brand">
          <span class="brand-crest">
            {{ activeTheme().branding.crestIcon }}
          </span>
          <div class="brand-text">
            <span class="brand-main">
              {{ t('shell.brand.prefix') }}
              <span class="logo-accent">
                {{ t(activeTheme().branding.logoAccentKey) }}
              </span>
            </span>
            <span class="brand-sub">
              {{ t(activeTheme().branding.brandSubKey) }}
            </span>
          </div>
        </a>

        <!-- Material 3 Exchange Vertical Switcher -->
        <nav class="department-tabs" [attr.aria-label]="t('shell.nav.ariaLabel')">
          @for (shop of shopContext.shops; track shop.shopId) {
            <a
              [routerLink]="shop.branding.primaryRoute"
              class="dept-tab"
              [class.active]="currentDepartment() === shop.departmentKey"
              [title]="t(shop.branding.tabTitleKey)"
            >
              <span class="dept-tab-icon">{{ shop.branding.crestIcon }}</span>
              <span class="dept-tab-label">{{ t(shop.branding.tabLabelKey) }}</span>
            </a>
          }
        </nav>

        <!-- Right Action: Material Badged Vault Bag Button -->
        <div class="nav-actions">
          <button
            type="button"
            class="cart-trigger-btn"
            (click)="cartService.toggleDrawer()"
            [attr.aria-label]="t('shell.cart.openAriaLabel', [cartService.totalItems()])"
          >
            <div class="cart-icon-wrap">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
              @if (cartService.totalItems() > 0) {
                <span class="cart-count-bubble">{{ cartService.totalItems() }}</span>
              }
            </div>
            <div class="cart-btn-text">
              <span class="cart-label">{{ t('shell.cart.buttonLabel') }}</span>
              <span class="cart-amount mono">{{
                cartService.formatZar(cartService.subtotalPrice())
              }}</span>
            </div>
          </button>
        </div>
      </div>

      <!-- Contextual Exchange Verification Bar Driven by Active Shop Theme Config -->
      <div class="dept-context-bar">
        <div class="container context-inner">
          @for (chip of activeTheme().contextChips; track chip.id) {
            <span [class]="chip.cssClass">
              @if (chip.hasStarIcon) {
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                  <path
                    d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                  />
                </svg>
              }
              {{ t(chip.propertyKey) }}
            </span>
          }
        </div>
      </div>
    </header>

    <main class="content-area">
      <router-outlet></router-outlet>
    </main>

    <!-- Slide-Out Material Vault Bag Drawer Overlay -->
    @if (cartService.isDrawerOpen()) {
      <div class="drawer-backdrop" (click)="cartService.closeDrawer()"></div>
    }

    <aside class="cart-drawer" [class.open]="cartService.isDrawerOpen()">
      <div class="drawer-header">
        <div class="drawer-title-group">
          <h3>{{ drawerTitle() }}</h3>
          <span class="drawer-item-count">{{ drawerCountLabel() }}</span>
        </div>
        <button
          type="button"
          class="close-drawer-btn drawer-close-btn"
          (click)="cartService.closeDrawer()"
          [attr.aria-label]="t('shell.drawer.closeAriaLabel')"
        >
          &times;
        </button>
      </div>

      <!-- Insured Armored Courier Progress Tracker -->
      <div class="drawer-shipping-tracker">
        <div class="tracker-labels">
          <span class="tracker-title">
            {{
              cartService.hasCollectibleItem()
                ? t('shell.tracker.title.collectibles')
                : t('shell.tracker.title.standard')
            }}
          </span>
          <span class="tracker-status mono">
            @if (cartService.amountToFreeDelivery() === 0 && cartService.totalItems() > 0) {
              <strong class="text-green">{{ t('shell.tracker.freeUnlocked') }}</strong>
            } @else {
              {{ cartService.formatZar(cartService.subtotalPrice()) }} /
              {{
                cartService.hasCollectibleItem()
                  ? t('shell.tracker.threshold.collectibles')
                  : t('shell.tracker.threshold.standard')
              }}
            }
          </span>
        </div>
        <div class="tracker-bar">
          <div class="tracker-fill" [style.width.%]="cartService.freeDeliveryProgressPct()"></div>
        </div>
        @if (cartService.amountToFreeDelivery() > 0) {
          <p class="tracker-note">
            {{ t('shell.tracker.addMorePrefix') }}
            <strong>{{ cartService.formatZar(cartService.amountToFreeDelivery()) }}</strong>
            {{ t('shell.tracker.addMoreSuffix') }}
          </p>
        }
      </div>

      <!-- Cart Items List -->
      <div class="drawer-body">
        @if (cartService.cartItems().length === 0) {
          <div class="empty-cart-state">
            <div class="empty-cart-icon">
              {{ activeTheme().branding.emptyCartIcon }}
            </div>
            <h4>{{ t(activeTheme().branding.emptyCartTitleKey) }}</h4>
            <p>{{ t(activeTheme().branding.emptyCartDescKey) }}</p>
            <button
              type="button"
              class="btn-outline"
              [routerLink]="activeTheme().branding.primaryRoute"
              (click)="cartService.closeDrawer()"
            >
              {{ t(activeTheme().branding.emptyCartCtaKey) }}
            </button>
          </div>
        } @else {
          <div class="drawer-items-list">
            @for (item of cartService.cartItems(); track item.cartItemId) {
              <div class="cart-row">
                <div class="cart-row-main">
                  <div class="cart-row-title">
                    <h4>{{ item.product.title }}</h4>
                    <span class="badge-portion">
                      {{ item.optionSelection }} &bull;
                      {{
                        item.orderType === OrderTypeEnum.PLACE_BID
                          ? t('shell.item.bidBadge')
                          : t('shell.item.buyNowBadge')
                      }}
                    </span>
                  </div>
                  <div class="cart-row-meta mono">
                    <span>{{ cartService.formatZar(item.unitPrice) }} / {{ item.optionSelection }}</span>
                  </div>
                </div>

                <div class="cart-row-actions">
                  <div class="stepper">
                    <button
                      type="button"
                      class="step-btn"
                      (click)="cartService.updateQuantity(item.cartItemId, -1)"
                      [attr.aria-label]="t('shell.item.decreaseAriaLabel')"
                    >
                      &minus;
                    </button>
                    <span class="step-qty mono">{{ item.quantity }}</span>
                    <button
                      type="button"
                      class="step-btn"
                      (click)="cartService.updateQuantity(item.cartItemId, 1)"
                      [attr.aria-label]="t('shell.item.increaseAriaLabel')"
                    >
                      &#43;
                    </button>
                  </div>

                  <div class="cart-row-total mono">
                    {{ cartService.formatZar(item.unitPrice * item.quantity) }}
                  </div>

                  <button
                    type="button"
                    class="remove-row-btn"
                    (click)="cartService.removeFromCart(item.cartItemId)"
                    [title]="t('shell.item.removeTitle')"
                    [attr.aria-label]="t('shell.item.removeTitle')"
                  >
                    &times;
                  </button>
                </div>
              </div>
            }
          </div>
        }

        <!-- Active Checkout Session Confirmation Overlay -->
        @if (cartService.activeCheckoutSession(); as session) {
          <div class="checkout-session-overlay">
            <div class="checkout-session-card">
              <div class="session-head">
                <span class="badge">
                  {{
                    session.gateway === GatewayEnum.OZOW
                      ? t('shell.checkout.gateway.ozow')
                      : session.gateway === GatewayEnum.PAYGATE
                      ? t('shell.checkout.gateway.paygate')
                      : t('shell.checkout.gateway.shopify')
                  }}
                </span>
                <button
                  type="button"
                  class="close-session-btn"
                  (click)="cartService.activeCheckoutSession.set(null)"
                >
                  &times;
                </button>
              </div>
              <h4>
                {{ t('shell.checkout.referencePrefix') }}
                <span class="mono text-crimson">{{ session.reference }}</span>
              </h4>
              <p class="session-cutoff">{{ session.cutoffNotice }}</p>

              <div class="session-summary-box">
                <div class="session-row">
                  <span>{{ t('shell.checkout.subtotalLabel', [session.itemCount]) }}</span>
                  <span class="mono">{{ session.subtotalZar }}</span>
                </div>
                <div class="session-row">
                  <span>{{ t('shell.checkout.shippingLabel') }}</span>
                  <span
                    class="mono"
                    [class.text-green]="
                      session.deliveryFeeZar === t('shell.summary.shipping.free')
                    "
                  >
                    {{ session.deliveryFeeZar }}
                  </span>
                </div>
                <div class="session-row session-total">
                  <span>{{ t('shell.checkout.totalPayableLabel') }}</span>
                  <span class="mono text-crimson">{{ session.totalZar }}</span>
                </div>
              </div>

              <button
                type="button"
                class="btn-primary full-width"
                [disabled]="cartService.isSubmittingCheckout()"
                (click)="confirmSimulatedPayment(session)"
              >
                @if (cartService.isSubmittingCheckout()) {
                  <span>{{ t('shell.checkout.syncingBtn') }}</span>
                } @else if (session.checkoutUrl) {
                  <span>{{ t('shell.checkout.liveShopifyBtn') }}</span>
                } @else {
                  <span>{{ t(activeTheme().branding.checkoutConfirmBtnKey) }}</span>
                }
              </button>
            </div>
          </div>
        }
      </div>

      <!-- Drawer Footer Summary & Multi-Gateway Settlement Actions -->
      @if (cartService.cartItems().length > 0) {
        <div class="drawer-footer">
          <div class="summary-lines">
            <div class="sum-row">
              <span class="sum-label">{{ cartSubtotalLabel() }}</span>
              <span class="sum-val mono">{{
                cartService.formatZar(cartService.subtotalPrice())
              }}</span>
            </div>
            <div class="sum-row">
              <span class="sum-label">
                {{
                  cartService.hasCollectibleItem()
                    ? t('shell.summary.shipping.collectibles')
                    : t('shell.summary.shipping.standard')
                }}
              </span>
              <span class="sum-val mono" [class.text-green]="cartService.deliveryFee() === 0">
                {{
                  cartService.deliveryFee() === 0
                    ? t('shell.summary.shipping.free')
                    : cartService.formatZar(cartService.deliveryFee())
                }}
              </span>
            </div>
            <div class="sum-row grand-total-row">
              <span class="sum-label">{{ t('shell.summary.totalLabel') }}</span>
              <span class="sum-val sum-total mono">
                {{ cartService.formatZar(cartService.grandTotal()) }}
              </span>
            </div>
          </div>

          <div class="checkout-actions">
            <button
              type="button"
              class="btn-primary checkout-btn full-width"
              (click)="cartService.initiateCheckout(GatewayEnum.PAYGATE)"
            >
              <span>{{ t('shell.checkout.paygateBtn') }}</span>
            </button>

            <button
              type="button"
              class="btn-secondary full-width"
              (click)="cartService.initiateCheckout(GatewayEnum.OZOW)"
            >
              <span>{{ t('shell.checkout.ozowBtn') }}</span>
            </button>

            <button
              type="button"
              class="btn-outline full-width"
              (click)="cartService.initiateCheckout(GatewayEnum.SHOPIFY)"
            >
              <span>{{ t('shell.checkout.shopifyBtn') }}</span>
            </button>
          </div>
        </div>
      }
    </aside>

    <!-- KULTUREVAULT Exchange Holdings Multi-Vertical Footer -->
    <footer class="footer">
      <div class="container footer-content">
        <div class="footer-top">
          <div class="footer-brand">
            <span class="brand-title">
              {{ t('shell.brand.prefix') }}
              <span class="logo-accent">{{ t('shell.footer.brandAccent') }}</span>
            </span>
            <p>{{ t('shell.footer.brandDescription') }}</p>
          </div>
          <div class="footer-pillars">
            @for (shop of shopContext.shops; track shop.shopId) {
              <a [routerLink]="shop.branding.primaryRoute" class="pillar-card">
                <div class="pillar-head">
                  <span class="pillar-icon">{{ shop.branding.crestIcon }}</span>
                  <strong>{{ t(shop.branding.pillarTitleKey) }}</strong>
                </div>
                <p>{{ t(shop.branding.pillarDescKey) }}</p>
              </a>
            }
          </div>
        </div>

        <div class="footer-bottom">
          <p>{{ t('shell.footer.copyright') }}</p>
          <div class="department-badges">
            @for (shop of shopContext.shops; track shop.shopId) {
              <span
                class="dept-indicator"
                [class.active]="currentDepartment() === shop.departmentKey"
              >
                {{ t(shop.branding.footerBadgeKey) }}
              </span>
            }
          </div>
        </div>
      </div>
    </footer>
  `
})
export class AppComponent {
  readonly shopContext = inject(ShopContextService);
  readonly cartService = inject(CartService);
  readonly productService = inject(ProductService);
  private readonly propertiesService = inject(PropertiesService);

  readonly OrderTypeEnum = MarketOrderTypeEnum;
  readonly GatewayEnum = CheckoutGateway;

  readonly currentDepartment = this.shopContext.currentDepartment;
  readonly activeTheme = this.shopContext.activeShopTheme;
  readonly drawerTitle = this.cartService.drawerTitle;
  readonly drawerCountLabel = this.cartService.drawerCountLabel;
  readonly cartSubtotalLabel = this.cartService.cartSubtotalLabel;

  t(key: string, params?: PropertyInterpolationParams): string {
    return this.propertiesService.get(PropertiesNamespace.SHELL, key, params);
  }

  confirmSimulatedPayment(session: CheckoutSessionPayload): void {
    if (session.checkoutUrl) {
      window.location.href = session.checkoutUrl;
      return;
    }

    const notice = this.shopContext.buildOrderConfirmationAlert(
      this.currentDepartment(),
      session.reference,
      session.totalZar
    );

    alert(notice);
    this.cartService.clearCart();
    this.cartService.closeDrawer();
  }
}

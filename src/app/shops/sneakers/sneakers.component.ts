import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import {
  PropertiesService,
  PropertyInterpolationParams
} from '../../core/services/properties.service';
import { PropertiesNamespace } from '../../core/enums/shop.enums';
import {
  SneakerCatalogViewModeEnum,
  SneakerSizeOption,
  SneakerTierFilterEnum,
  SneakerTradeModeEnum
} from './enums/sneakers.enums';
import { SneakerProduct } from './models/sneakers.model';
import { SneakersShopService } from './services/sneakers-shop.service';

@Component({
  selector: 'app-sneakers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrl: './sneakers.component.scss',
  template: `
    <div class="sneakers-page">
      <!-- StockX-Style Live Exchange Ticker Ribbon -->
      <section class="exchange-ribbon">
        <div class="container ribbon-inner">
          <div class="ribbon-item">
            <span class="pulse-emerald"></span>
            <strong>{{ t('sneakers.ribbon.liveStatus') }}</strong>
            <span class="mono">{{ t('sneakers.ribbon.brands') }}</span>
          </div>
          <div class="ribbon-item hide-mobile">
            <span>{{ t('sneakers.ribbon.authPolicy') }}</span>
          </div>
          <div class="ribbon-item">
            <span class="highlight-emerald">{{ t('sneakers.ribbon.freeCourier') }}</span>
          </div>
        </div>
      </section>

      <!-- Deadstock Sneakers Exchange Hero -->
      <header class="sneakers-header">
        <div class="container header-inner">
          <div class="header-content">
            <div class="brand-badge-group">
              <span class="exchange-pill">{{ t('sneakers.header.exchangePill') }}</span>
              <span class="verified-pill">{{ t('sneakers.header.verifiedPill') }}</span>
            </div>
            <h1 class="hero-title">{{ t('sneakers.header.title') }}</h1>
            <p class="hero-tagline">
              {{ t('sneakers.header.tagline') }}
            </p>
          </div>

          <div class="header-stats">
            @for (stat of shopService.headerStats; track stat.valuePropertyKey) {
              <div class="stat-card">
                <span class="stat-value mono" [ngClass]="stat.accentClass">{{
                  t(stat.valuePropertyKey)
                }}</span>
                <span class="stat-label">{{ t(stat.labelPropertyKey) }}</span>
              </div>
            }
          </div>
        </div>
      </header>

      <!-- Category Tabs, Grail House Filter Chips & Exchange View Mode Toolbar -->
      <section class="toolbar-section">
        <div class="container toolbar-inner">
          <div class="category-filters">
            @for (cat of shopService.categories; track cat) {
              <button
                type="button"
                class="cat-tab-btn filter-btn"
                [class.active]="shopService.selectedCategory() === cat"
                (click)="shopService.setCategory(cat)"
              >
                {{ cat }}
              </button>
            }
          </div>

          <!-- Grail House Brand Filter Bar (Jordan, Off-White, Nike, Supreme, Stüssy, New Balance, Adidas) -->
          <div class="vendor-filter-bar">
            <span class="vendor-filter-label">{{ t('sneakers.toolbar.brandFilterLabel') }}</span>
            @for (brand of shopService.brands; track brand) {
              <button
                type="button"
                class="vendor-chip"
                [class.active]="shopService.selectedBrand() === brand"
                [class.featured-vendor]="brand === 'Jordan' || brand === 'Off-White'"
                (click)="shopService.setBrand(brand)"
              >
                {{ brand === 'All' ? t('sneakers.toolbar.allBrands') : brand }}
              </button>
            }
          </div>

          <div class="tier-and-search">
            <div class="left-trade-controls">
              <div class="tier-toggle">
                @for (tierOpt of shopService.tierOptions; track tierOpt.tier) {
                  <button
                    type="button"
                    class="tier-btn"
                    [class.active]="shopService.selectedTier() === tierOpt.tier"
                    (click)="shopService.setTier(tierOpt.tier)"
                  >
                    {{ t(tierOpt.labelPropertyKey) }}
                  </button>
                }
              </div>

              <!-- Exchange View Mode Switcher (Cards vs Live Order Book Table) -->
              <div class="view-mode-toggle">
                <button
                  type="button"
                  class="view-btn"
                  [class.active]="shopService.viewMode() === ViewModeEnum.GRID"
                  (click)="shopService.setViewMode(ViewModeEnum.GRID)"
                >
                  {{ t('sneakers.toolbar.view.grid') }}
                </button>
                <button
                  type="button"
                  class="view-btn"
                  [class.active]="shopService.viewMode() === ViewModeEnum.TABLE"
                  (click)="shopService.setViewMode(ViewModeEnum.TABLE)"
                >
                  {{ t('sneakers.toolbar.view.table') }}
                </button>
              </div>
            </div>

            <div class="search-box">
              <input
                type="text"
                [placeholder]="t('sneakers.search.placeholder')"
                [ngModel]="shopService.searchQuery()"
                (ngModelChange)="shopService.setSearchQuery($event)"
              />
            </div>
          </div>
        </div>
      </section>

      <!-- Main Exchange Catalog Grid or Live Order Book Table -->
      <main class="container catalog-section">
        <div class="catalog-summary">
          <span>
            {{ t('sneakers.catalog.showingPrefix') }}
            <strong>{{ shopService.filteredProducts().length }}</strong>
            {{ t('sneakers.catalog.showingSuffix') }}
          </span>
          <span class="dispatch-notice">
            <strong>{{ t('sneakers.catalog.settlementLabel') }}</strong> &bull;
            {{ t('sneakers.catalog.courierLabel') }}
          </span>
        </div>

        @if (shopService.viewMode() === ViewModeEnum.GRID) {
          <div class="products-grid">
            @for (product of shopService.filteredProducts(); track product.id) {
              <article
                class="product-card sneaker-card"
                [class.grail-highlight]="product.tier === TierEnum.B2B"
              >
                <div class="card-header">
                  <div class="brand-category-group">
                    <span class="vendor-pill">{{ product.brand }}</span>
                    <span class="category-badge">{{ product.subcategory }}</span>
                  </div>
                  <div class="right-badges">
                    <span class="volatility-pill mono">+{{ product.market_change_pct }}%</span>
                    <span class="tier-pill" [class.b2b]="product.tier === TierEnum.B2B">
                      {{
                        product.tier === TierEnum.B2B
                          ? t('sneakers.card.tier.b2b')
                          : t('sneakers.card.tier.retail')
                      }}
                    </span>
                  </div>
                </div>

                <div class="card-body">
                  <div class="style-year-row">
                    <span class="sku-code mono">{{ product.style_code }}</span>
                    <span class="release-year mono">DROP {{ product.release_year }}</span>
                  </div>
                  <h2 class="product-title">{{ product.title }}</h2>
                  <p class="product-desc">{{ product.description }}</p>

                  <div class="auth-badges">
                    <span class="auth-tag">{{ product.authentication_badge }}</span>
                  </div>

                  <!-- StockX Live Ask / Bid / Last Sale Ticker Strip -->
                  <div class="market-ticker-strip">
                    <div class="ticker-cell ask-cell">
                      <span class="ticker-label">{{ t('sneakers.card.ticker.lowestAsk') }}</span>
                      <span class="ticker-val mono text-emerald">
                        {{ t('sneakers.card.currency') }}
                        {{ shopService.getActiveAskPrice(product).toLocaleString('en-ZA') }}
                      </span>
                    </div>
                    <div class="ticker-cell bid-cell">
                      <span class="ticker-label">{{ t('sneakers.card.ticker.highestBid') }}</span>
                      <span class="ticker-val mono text-gold">
                        {{ t('sneakers.card.currency') }}
                        {{ shopService.getActiveBidPrice(product).toLocaleString('en-ZA') }}
                      </span>
                    </div>
                    <div class="ticker-cell sale-cell">
                      <span class="ticker-label">{{ t('sneakers.card.ticker.lastSale') }}</span>
                      <span class="ticker-val mono">
                        {{ t('sneakers.card.currency') }}
                        {{ shopService.getActiveLastSalePrice(product).toLocaleString('en-ZA') }}
                      </span>
                    </div>
                  </div>

                  <!-- Interactive US / UK Size Matrix Selector -->
                  <div class="size-matrix-block">
                    <span class="size-matrix-label">{{ t('sneakers.card.sizeLabel') }}</span>
                    <div class="size-matrix-grid">
                      @for (quote of product.size_matrix; track quote.sizeUs) {
                        <button
                          type="button"
                          class="size-pill-btn portion-btn"
                          [class.active]="shopService.getSelectedSize(product.id) === quote.sizeUs"
                          (click)="selectSize(product.id, quote.sizeUs)"
                        >
                          <span class="size-us mono">{{ quote.sizeUs }}</span>
                          <span class="size-ask mono"
                            >R {{ (quote.lowestAskZar / 1000).toFixed(1) }}k</span
                          >
                        </button>
                      }
                    </div>
                  </div>

                  <div class="specs-grid">
                    <div class="spec-item">
                      <span class="spec-label">{{ t('sneakers.card.spec.colorway') }}</span>
                      <span class="spec-val">{{ product.colorway }}</span>
                    </div>
                    <div class="spec-item">
                      <span class="spec-label">{{ t('sneakers.card.spec.boxCondition') }}</span>
                      <span class="spec-val">{{ product.box_condition }}</span>
                    </div>
                  </div>

                  <!-- Buy Now vs Place Market Bid Selector -->
                  <div class="trade-mode-selector">
                    <label
                      class="mode-option"
                      [class.selected]="shopService.getTradeMode(product.id) === TradeModeEnum.BUY_NOW"
                    >
                      <input
                        type="radio"
                        [name]="'mode-' + product.id"
                        [checked]="shopService.getTradeMode(product.id) === TradeModeEnum.BUY_NOW"
                        (change)="shopService.setTradeMode(product.id, TradeModeEnum.BUY_NOW)"
                      />
                      <div class="mode-info">
                        <span class="mode-title">{{ t('sneakers.card.mode.buyNow.label') }}</span>
                        <span class="mode-sub">{{ t('sneakers.card.mode.buyNow.sub') }}</span>
                      </div>
                      <span class="mode-price mono text-emerald">
                        {{ t('sneakers.card.currency') }}
                        {{ shopService.getActiveAskPrice(product).toFixed(2) }}
                      </span>
                    </label>

                    <label
                      class="mode-option bid-option"
                      [class.selected]="
                        shopService.getTradeMode(product.id) === TradeModeEnum.PLACE_BID
                      "
                    >
                      <input
                        type="radio"
                        [name]="'mode-' + product.id"
                        [checked]="shopService.getTradeMode(product.id) === TradeModeEnum.PLACE_BID"
                        (change)="shopService.setTradeMode(product.id, TradeModeEnum.PLACE_BID)"
                      />
                      <div class="mode-info">
                        <span class="mode-title">{{ t('sneakers.card.mode.placeBid.label') }}</span>
                        <span class="mode-sub">{{ t('sneakers.card.mode.placeBid.sub') }}</span>
                      </div>
                      <span class="mode-price mono text-gold">
                        {{ t('sneakers.card.currency') }}
                        {{ shopService.getActiveBidPrice(product).toFixed(2) }}
                      </span>
                    </label>
                  </div>
                </div>

                <div class="card-footer">
                  <div class="pricing-block">
                    <div class="price-row current-price">
                      <span class="currency">{{ t('sneakers.card.currency') }}</span>
                      <span class="amount mono">{{
                        shopService.getDisplayPrice(product).toFixed(2)
                      }}</span>
                    </div>
                    <span class="stock-status">
                      {{
                        t('sneakers.card.stockPairs', [shopService.getActiveStockForSize(product)])
                      }}
                      ({{ shopService.getSelectedSize(product.id) }})
                    </span>
                  </div>

                  <div class="order-controls">
                    <div class="card-qty-stepper">
                      <button
                        type="button"
                        class="qty-btn"
                        [disabled]="shopService.getCardQuantity(product.id) <= 1"
                        (click)="shopService.adjustCardQuantity(product.id, -1)"
                        [attr.aria-label]="t('sneakers.card.qty.decreaseAriaLabel')"
                      >
                        &minus;
                      </button>
                      <span class="qty-value">{{ shopService.getCardQuantity(product.id) }}</span>
                      <button
                        type="button"
                        class="qty-btn"
                        (click)="shopService.adjustCardQuantity(product.id, 1)"
                        [attr.aria-label]="t('sneakers.card.qty.increaseAriaLabel')"
                      >
                        &#43;
                      </button>
                    </div>

                    <button
                      type="button"
                      class="btn-primary add-btn"
                      (click)="addToCart(product)"
                    >
                      {{
                        shopService.getTradeMode(product.id) === TradeModeEnum.PLACE_BID
                          ? t('sneakers.card.bidBtn')
                          : t('sneakers.card.buyBtn')
                      }}
                    </button>
                  </div>
                </div>
              </article>
            }
          </div>
        } @else {
          <!-- Live Exchange Order Book Specification Table -->
          <div class="spec-table-container">
            <table class="b2b-spec-table">
              <thead>
                <tr>
                  <th>{{ t('sneakers.table.col.styleCode') }}</th>
                  <th>{{ t('sneakers.table.col.house') }}</th>
                  <th>{{ t('sneakers.table.col.sneaker') }}</th>
                  <th>{{ t('sneakers.table.col.size') }}</th>
                  <th>{{ t('sneakers.table.col.lowestAsk') }}</th>
                  <th>{{ t('sneakers.table.col.highestBid') }}</th>
                  <th>{{ t('sneakers.table.col.lastSale') }}</th>
                  <th>{{ t('sneakers.table.col.action') }}</th>
                </tr>
              </thead>
              <tbody>
                @for (product of shopService.filteredProducts(); track product.id) {
                  <tr>
                    <td class="mono sku-code">{{ product.style_code }}</td>
                    <td><span class="vendor-pill">{{ product.brand }}</span></td>
                    <td>
                      <span class="table-item-title">{{ product.title }}</span>
                      <span class="table-item-sub"
                        >{{ product.colorway }} &bull; {{ product.authentication_badge }}</span
                      >
                    </td>
                    <td class="mono">{{ shopService.getSelectedSize(product.id) }}</td>
                    <td class="mono text-emerald">
                      <strong
                        >{{ t('sneakers.card.currency') }}
                        {{ shopService.getActiveAskPrice(product).toFixed(2) }}</strong
                      >
                    </td>
                    <td class="mono text-gold">
                      {{ t('sneakers.card.currency') }}
                      {{ shopService.getActiveBidPrice(product).toFixed(2) }}
                    </td>
                    <td class="mono">
                      {{ t('sneakers.card.currency') }}
                      {{ shopService.getActiveLastSalePrice(product).toFixed(2) }}
                    </td>
                    <td>
                      <div class="table-action-cell">
                        <button
                          type="button"
                          class="btn-primary add-btn"
                          (click)="addToCart(product)"
                        >
                          {{ t('sneakers.card.buyBtn') }}
                        </button>
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </main>

      <!-- Material Toast Notification -->
      @if (cartService.toastMessage(); as toast) {
        <div class="mat-snackbar" role="status">
          <span class="pulse-emerald"></span>
          <span>{{ toast }}</span>
        </div>
      }

      <!-- Sneakers Authentication & Exchange Footer -->
      <footer class="sneakers-footer">
        <div class="container footer-inner">
          @for (col of shopService.footerColumns; track col.titlePropertyKey) {
            <div class="footer-col">
              <h3>{{ t(col.titlePropertyKey) }}</h3>
              <p>
                {{ t(col.bodyPropertyKey) }}
                @if (col.emailPropertyKey) {
                  <strong class="text-emerald">{{ t(col.emailPropertyKey) }}</strong>
                }
              </p>
            </div>
          }
        </div>
      </footer>
    </div>
  `
})
export class SneakersComponent {
  readonly shopService = inject(SneakersShopService);
  readonly cartService = inject(CartService);
  private readonly propertiesService = inject(PropertiesService);

  readonly TierEnum = SneakerTierFilterEnum;
  readonly TradeModeEnum = SneakerTradeModeEnum;
  readonly ViewModeEnum = SneakerCatalogViewModeEnum;

  t(key: string, params?: PropertyInterpolationParams): string {
    return this.propertiesService.get(PropertiesNamespace.SNEAKERS, key, params);
  }

  selectSize(productId: string, sizeUs: string): void {
    this.shopService.setSelectedSize(productId, sizeUs as SneakerSizeOption);
  }

  addToCart(product: SneakerProduct): void {
    this.shopService.addProductToCart(product);
  }
}

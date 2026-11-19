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
  CollectibleOrderModeEnum,
  CollectibleTierFilterEnum
} from './enums/collectibles.enums';
import { CollectibleProduct } from './models/collectibles.model';
import { CollectiblesShopService } from './services/collectibles-shop.service';

@Component({
  selector: 'app-collectibles',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrl: './collectibles.component.scss',
  template: `
    <div class="collectibles-page">
      <!-- Collectibles & Art Vault Ribbon -->
      <section class="collectibles-ribbon">
        <div class="container ribbon-inner">
          <div class="ribbon-item">
            <span class="pulse-amber"></span>
            <strong>{{ t('collectibles.ribbon.lead') }}</strong>
            <span class="mono">{{ t('collectibles.ribbon.brands') }}</span>
          </div>
          <div class="ribbon-item hide-mobile">
            <span>{{ t('collectibles.ribbon.hologram') }}</span>
          </div>
          <div class="ribbon-item">
            <span class="highlight-amber">{{ t('collectibles.ribbon.freight') }}</span>
          </div>
        </div>
      </section>

      <!-- Collectibles Gallery Hero Header -->
      <header class="collectibles-header">
        <div class="container header-inner">
          <div class="header-content">
            <div class="brand-badge-group">
              <span class="division-pill">{{ t('collectibles.header.divisionPill') }}</span>
              <span class="hologram-pill">{{ t('collectibles.header.hologramPill') }}</span>
            </div>
            <h1 class="hero-title">{{ t('collectibles.header.title') }}</h1>
            <p class="hero-tagline">
              {{ t('collectibles.header.tagline') }}
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

      <!-- Category & Creator Filter Toolbar -->
      <section class="toolbar-section">
        <div class="container toolbar-inner">
          <div class="category-filters">
            @for (cat of shopService.categories; track cat) {
              <button
                type="button"
                class="filter-btn"
                [class.active]="shopService.selectedCategory() === cat"
                (click)="shopService.setCategory(cat)"
              >
                {{ cat }}
              </button>
            }
          </div>

          <!-- Creator / Studio Quick-Filter Chips (Medicom Toy, KAWS, Supreme, Off-White, Stüssy, Vault Lab) -->
          <div class="vendor-filter-bar">
            <span class="vendor-filter-label">{{ t('collectibles.toolbar.brandFilterLabel') }}</span>
            @for (creator of shopService.creators; track creator) {
              <button
                type="button"
                class="vendor-chip"
                [class.active]="shopService.selectedCreator() === creator"
                [class.featured-vendor]="creator === 'Medicom Toy' || creator === 'KAWS'"
                (click)="shopService.setCreator(creator)"
              >
                {{ creator === 'All' ? t('collectibles.toolbar.allCreators') : creator }}
              </button>
            }
          </div>

          <div class="tier-and-search">
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

            <div class="search-box">
              <input
                type="text"
                [placeholder]="t('collectibles.search.placeholder')"
                [ngModel]="shopService.searchQuery()"
                (ngModelChange)="shopService.setSearchQuery($event)"
              />
            </div>
          </div>
        </div>
      </section>

      <!-- Collectibles Vault Catalog Grid -->
      <main class="container catalog-section">
        <div class="catalog-summary">
          <span>
            {{ t('collectibles.catalog.showingPrefix') }}
            <strong>{{ shopService.filteredProducts().length }}</strong>
            {{ t('collectibles.catalog.showingSuffix') }}
          </span>
          <span class="crating-notice">
            {{ t('collectibles.catalog.cratingNotice') }}
          </span>
        </div>

        <div class="products-grid">
          @for (product of shopService.filteredProducts(); track product.id) {
            <article
              class="collectible-card"
              [class.gallery-highlight]="product.tier === TierEnum.B2B"
            >
              <div class="card-header">
                <div class="creator-group">
                  <span class="creator-pill">{{ product.brand }}</span>
                  <span class="season-pill mono">{{ product.release_season }}</span>
                </div>
                <span class="volatility-pill mono">+{{ product.market_change_pct }}%</span>
              </div>

              <!-- Studio Collectible Photo Stage -->
              <div class="product-media-stage">
                <img
                  class="product-photo"
                  [src]="product.image_url"
                  [alt]="product.title"
                />
                <span class="verified-chip-overlay">✓ Hologram / Serial Verified</span>
              </div>

              <div class="card-body">
                <span class="sku-code mono">{{ product.code }}</span>
                <h2 class="product-title">{{ product.title }}</h2>
                <p class="product-desc">{{ product.description }}</p>

                <div class="hologram-banner">
                  <span>{{ product.hologram_seal }}</span>
                </div>

                <!-- Live Market Ticker Row -->
                <div class="market-ticker-strip">
                  <div class="ticker-cell">
                    <span class="ticker-label">{{ t('collectibles.card.lowestAskLabel') }}</span>
                    <span class="ticker-val mono text-amber">
                      R {{ product.lowest_ask_zar.toLocaleString('en-ZA') }}
                    </span>
                  </div>
                  <div class="ticker-cell">
                    <span class="ticker-label">{{ t('collectibles.card.highestBidLabel') }}</span>
                    <span class="ticker-val mono text-mint">
                      R {{ product.highest_bid_zar.toLocaleString('en-ZA') }}
                    </span>
                  </div>
                  <div class="ticker-cell">
                    <span class="ticker-label">{{ t('collectibles.card.lastSaleLabel') }}</span>
                    <span class="ticker-val mono">
                      R {{ product.last_sale_zar.toLocaleString('en-ZA') }}
                    </span>
                  </div>
                </div>

                <div class="specs-grid">
                  <div class="spec-item">
                    <span class="spec-label">{{ t('collectibles.card.spec.edition') }}</span>
                    <span class="spec-val">{{ product.edition_type }}</span>
                  </div>
                  <div class="spec-item">
                    <span class="spec-label">{{ t('collectibles.card.spec.dimensions') }}</span>
                    <span class="spec-val">{{ product.dimensions_spec }}</span>
                  </div>
                </div>

                <!-- Acquire Now vs Collector Bid Selector -->
                <div class="order-mode-group">
                  <button
                    type="button"
                    class="mode-btn"
                    [class.active]="shopService.getOrderMode(product.id) === ModeEnum.BUY_NOW"
                    (click)="shopService.setOrderMode(product.id, ModeEnum.BUY_NOW)"
                  >
                    {{ t('collectibles.card.mode.buyNow') }}
                  </button>
                  <button
                    type="button"
                    class="mode-btn"
                    [class.active]="shopService.getOrderMode(product.id) === ModeEnum.VAULT_BID"
                    (click)="shopService.setOrderMode(product.id, ModeEnum.VAULT_BID)"
                  >
                    {{ t('collectibles.card.mode.vaultBid') }}
                  </button>
                </div>
              </div>

              <div class="card-footer">
                <div class="pricing-block">
                  <div class="price-row">
                    <span class="currency">{{ t('collectibles.card.currency') }}</span>
                    <span class="amount mono">{{
                      shopService.getDisplayPrice(product).toFixed(2)
                    }}</span>
                  </div>
                  <span class="stock-count">
                    {{ t('collectibles.card.stockCount', [product.stock_qty]) }}
                  </span>
                </div>

                <div class="order-controls">
                  <div class="card-qty-stepper">
                    <button
                      type="button"
                      class="qty-btn"
                      [disabled]="shopService.getCardQuantity(product.id) <= 1"
                      (click)="shopService.adjustCardQuantity(product.id, -1)"
                      [attr.aria-label]="t('collectibles.card.qty.decreaseAriaLabel')"
                    >
                      &minus;
                    </button>
                    <span class="qty-value">{{ shopService.getCardQuantity(product.id) }}</span>
                    <button
                      type="button"
                      class="qty-btn"
                      (click)="shopService.adjustCardQuantity(product.id, 1)"
                      [attr.aria-label]="t('collectibles.card.qty.increaseAriaLabel')"
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
                      shopService.getOrderMode(product.id) === ModeEnum.VAULT_BID
                        ? t('collectibles.card.bidBtn')
                        : t('collectibles.card.addBtn')
                    }}
                  </button>
                </div>
              </div>
            </article>
          }
        </div>
      </main>

      <!-- Collectibles Gallery Assurance Footer -->
      <footer class="collectibles-footer">
        <div class="container footer-inner">
          @for (col of shopService.footerColumns; track col.titlePropertyKey) {
            <div class="footer-col">
              <h3>{{ t(col.titlePropertyKey) }}</h3>
              <p>
                {{ t(col.bodyPropertyKey) }}
                @if (col.emailPropertyKey) {
                  <strong class="text-amber">{{ t(col.emailPropertyKey) }}</strong>
                }
              </p>
            </div>
          }
        </div>
      </footer>
    </div>
  `
})
export class CollectiblesComponent {
  readonly shopService = inject(CollectiblesShopService);
  readonly cartService = inject(CartService);
  private readonly propertiesService = inject(PropertiesService);

  readonly TierEnum = CollectibleTierFilterEnum;
  readonly ModeEnum = CollectibleOrderModeEnum;

  t(key: string, params?: PropertyInterpolationParams): string {
    return this.propertiesService.get(PropertiesNamespace.COLLECTIBLES, key, params);
  }

  addToCart(product: CollectibleProduct): void {
    this.shopService.addProductToCart(product);
  }
}

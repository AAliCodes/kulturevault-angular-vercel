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
  ApparelSizeOption,
  StreetwearPurchaseModeEnum,
  StreetwearTierFilterEnum
} from './enums/streetwear.enums';
import { StreetwearProduct } from './models/streetwear.model';
import { StreetwearShopService } from './services/streetwear-shop.service';

@Component({
  selector: 'app-streetwear',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrl: './streetwear.component.scss',
  template: `
    <div class="streetwear-page">
      <!-- Editorial Runway & Streetwear Announcement Ribbon -->
      <section class="streetwear-ribbon">
        <div class="container ribbon-inner">
          <div class="ribbon-item">
            <span class="pulse-crimson"></span>
            <strong>{{ t('streetwear.ribbon.lead') }}</strong>
            <span class="mono">{{ t('streetwear.ribbon.houses') }}</span>
          </div>
          <div class="ribbon-item hide-mobile">
            <span>{{ t('streetwear.ribbon.verification') }}</span>
          </div>
          <div class="ribbon-item">
            <span class="highlight-crimson">{{ t('streetwear.ribbon.shipping') }}</span>
          </div>
        </div>
      </section>

      <!-- Editorial Hero Header -->
      <header class="streetwear-header">
        <div class="container header-inner">
          <div class="header-content">
            <div class="brand-badge-group">
              <span class="division-pill">{{ t('streetwear.header.divisionPill') }}</span>
              <span class="cert-pill">{{ t('streetwear.header.certPill') }}</span>
            </div>
            <h1 class="hero-title">{{ t('streetwear.header.title') }}</h1>
            <p class="hero-tagline">
              {{ t('streetwear.header.tagline') }}
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

      <!-- Category & Streetwear House Filter Toolbar -->
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

          <!-- Streetwear House Chips (Supreme, Off-White, Stüssy) -->
          <div class="vendor-filter-bar">
            <span class="vendor-filter-label">{{ t('streetwear.toolbar.houseFilterLabel') }}</span>
            @for (house of shopService.brands; track house) {
              <button
                type="button"
                class="vendor-chip"
                [class.active]="shopService.selectedBrand() === house"
                [class.featured-vendor]="house === 'Supreme' || house === 'Off-White'"
                (click)="shopService.setBrand(house)"
              >
                {{ house === 'All' ? t('streetwear.toolbar.allHouses') : house }}
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
                [placeholder]="t('streetwear.search.placeholder')"
                [ngModel]="shopService.searchQuery()"
                (ngModelChange)="shopService.setSearchQuery($event)"
              />
            </div>
          </div>
        </div>
      </section>

      <!-- Streetwear Archive Grid -->
      <main class="container catalog-section">
        <div class="catalog-summary">
          <span>
            {{ t('streetwear.catalog.showingPrefix') }}
            <strong>{{ shopService.filteredProducts().length }}</strong>
            {{ t('streetwear.catalog.showingSuffix') }}
          </span>
          <span class="policy-notice">
            {{ t('streetwear.catalog.policyNotice') }}
          </span>
        </div>

        <div class="products-grid">
          @for (product of shopService.filteredProducts(); track product.id) {
            <article
              class="streetwear-card"
              [class.runway-highlight]="product.tier === TierEnum.B2B"
            >
              <div class="card-header">
                <div class="brand-season-group">
                  <span class="house-pill">{{ product.brand }}</span>
                  <span class="season-badge mono">{{ product.season_code }}</span>
                </div>
                <span class="savings-amount-pill mono">
                  Save R {{ shopService.getBidSavingsAmount(product).toFixed(2) }} / unit
                </span>
              </div>

              <div class="card-body">
                <span class="sku-code mono">{{ product.code }}</span>
                <h2 class="product-title">{{ product.title }}</h2>
                <p class="product-desc">{{ product.description }}</p>

                <div class="verification-banner">
                  <span>{{ product.authenticity_verification }}</span>
                </div>

                <!-- Market Ask / Bid / Last Sale Row -->
                <div class="market-ticker-strip">
                  <div class="ticker-cell">
                    <span class="ticker-label">{{ t('streetwear.card.lowestAskLabel') }}</span>
                    <span class="ticker-val mono text-crimson">
                      R {{ product.lowest_ask_zar.toLocaleString('en-ZA') }}
                    </span>
                  </div>
                  <div class="ticker-cell">
                    <span class="ticker-label">{{ t('streetwear.card.highestBidLabel') }}</span>
                    <span class="ticker-val mono">
                      R {{ product.highest_bid_zar.toLocaleString('en-ZA') }}
                    </span>
                  </div>
                  <div class="ticker-cell">
                    <span class="ticker-label">{{ t('streetwear.card.lastSaleLabel') }}</span>
                    <span class="ticker-val mono">
                      R {{ product.last_sale_zar.toLocaleString('en-ZA') }}
                    </span>
                  </div>
                </div>

                <!-- Apparel Size Selector -->
                <div class="size-selector-block">
                  <span class="size-label">{{ t('streetwear.card.sizeSelectLabel') }}</span>
                  <div class="size-pills-row">
                    @for (sz of shopService.sizes; track sz) {
                      <button
                        type="button"
                        class="size-chip-btn"
                        [class.active]="shopService.getSelectedSize(product.id) === sz"
                        (click)="selectSize(product.id, sz)"
                      >
                        {{ sz }}
                      </button>
                    }
                  </div>
                </div>

                <div class="specs-grid">
                  <div class="spec-item">
                    <span class="spec-label">{{ t('streetwear.card.spec.fit') }}</span>
                    <span class="spec-val">{{ product.garment_fit }}</span>
                  </div>
                  <div class="spec-item">
                    <span class="spec-label">{{ t('streetwear.card.spec.fabric') }}</span>
                    <span class="spec-val">{{ product.fabric_composition }}</span>
                  </div>
                </div>

                <!-- Purchase Mode Toggle -->
                <div class="purchase-mode-group">
                  <button
                    type="button"
                    class="mode-btn"
                    [class.active]="shopService.getPurchaseMode(product.id) === ModeEnum.BUY_NOW"
                    (click)="shopService.setPurchaseMode(product.id, ModeEnum.BUY_NOW)"
                  >
                    {{ t('streetwear.card.mode.buyNow') }}
                  </button>
                  <button
                    type="button"
                    class="mode-btn"
                    [class.active]="
                      shopService.getPurchaseMode(product.id) === ModeEnum.COLLECTOR_BID
                    "
                    (click)="shopService.setPurchaseMode(product.id, ModeEnum.COLLECTOR_BID)"
                  >
                    {{ t('streetwear.card.mode.collectorBid') }}
                  </button>
                </div>
              </div>

              <div class="card-footer">
                <div class="pricing-block">
                  <div class="price-row">
                    <span class="currency">{{ t('streetwear.card.currency') }}</span>
                    <span class="amount mono">{{
                      shopService.getDisplayPrice(product).toFixed(2)
                    }}</span>
                  </div>
                  <span class="vault-count">
                    {{ t('streetwear.card.inVaultCount', [product.stock_qty]) }} &bull; Size
                    {{ shopService.getSelectedSize(product.id) }}
                  </span>
                </div>

                <div class="order-controls">
                  <div class="card-qty-stepper">
                    <button
                      type="button"
                      class="qty-btn"
                      [disabled]="shopService.getCardQuantity(product.id) <= 1"
                      (click)="shopService.adjustCardQuantity(product.id, -1)"
                      [attr.aria-label]="t('streetwear.card.qty.decreaseAriaLabel')"
                    >
                      &minus;
                    </button>
                    <span class="qty-value">{{ shopService.getCardQuantity(product.id) }}</span>
                    <button
                      type="button"
                      class="qty-btn"
                      (click)="shopService.adjustCardQuantity(product.id, 1)"
                      [attr.aria-label]="t('streetwear.card.qty.increaseAriaLabel')"
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
                      shopService.getPurchaseMode(product.id) === ModeEnum.COLLECTOR_BID
                        ? t('streetwear.card.bidBtn')
                        : t('streetwear.card.addBtn')
                    }}
                  </button>
                </div>
              </div>
            </article>
          }
        </div>
      </main>

      <!-- Editorial Assurance Footer -->
      <footer class="streetwear-footer">
        <div class="container footer-inner">
          @for (col of shopService.footerColumns; track col.titlePropertyKey) {
            <div class="footer-col">
              <h3>{{ t(col.titlePropertyKey) }}</h3>
              <p>
                {{ t(col.bodyPropertyKey) }}
                @if (col.emailPropertyKey) {
                  <strong class="text-crimson">{{ t(col.emailPropertyKey) }}</strong>
                }
              </p>
            </div>
          }
        </div>
      </footer>
    </div>
  `
})
export class StreetwearComponent {
  readonly shopService = inject(StreetwearShopService);
  readonly cartService = inject(CartService);
  private readonly propertiesService = inject(PropertiesService);

  readonly TierEnum = StreetwearTierFilterEnum;
  readonly ModeEnum = StreetwearPurchaseModeEnum;

  t(key: string, params?: PropertyInterpolationParams): string {
    return this.propertiesService.get(PropertiesNamespace.STREETWEAR, key, params);
  }

  selectSize(productId: string, size: ApparelSizeOption): void {
    this.shopService.setSelectedSize(productId, size);
  }

  addToCart(product: StreetwearProduct): void {
    this.shopService.addProductToCart(product);
  }
}

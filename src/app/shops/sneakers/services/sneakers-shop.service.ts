import { Injectable, inject, signal, computed } from '@angular/core';
import {
  CatalogSyncSource,
  CatalogSyncSourceType,
  MarketOrderTypeEnum,
  ShopId,
  SneakerBrandFilter,
  SneakerCatalogViewMode,
  SneakerCatalogViewModeEnum,
  SneakerCategoryFilter,
  SneakerCategoryFilterEnum,
  SneakerProduct,
  SneakerSizeOption,
  SneakerSizeQuote,
  SneakerTierFilter,
  SneakerTierFilterEnum,
  SneakerTradeMode,
  SneakerTradeModeEnum
} from '../../../models/product.model';
import {
  SNEAKERS_ALLOWED_BRANDS,
  SNEAKERS_CATEGORIES,
  SNEAKERS_FOOTER_COLUMNS,
  SNEAKERS_HEADER_STATS,
  SNEAKERS_SHOP_VALUES,
  SNEAKERS_SIZES,
  SNEAKERS_TIER_OPTIONS
} from '../values/sneakers.values';
import { SNEAKERS_THEME_CONFIG } from '../config/sneakers-theme.config';
import { ShopifyApiService } from '../../../core/services/shopify-api.service';
import { CartService } from '../../../services/cart.service';
import sneakersSeedData from '../../../../assets/kulturevault-sneakers-seed.json';

@Injectable({ providedIn: 'root' })
export class SneakersShopService {
  private readonly shopifyApi = inject(ShopifyApiService);
  private readonly cartService = inject(CartService);

  readonly theme = SNEAKERS_THEME_CONFIG;
  readonly values = SNEAKERS_SHOP_VALUES;
  readonly categories = SNEAKERS_CATEGORIES;
  readonly brands: readonly SneakerBrandFilter[] = ['All', ...SNEAKERS_ALLOWED_BRANDS];
  readonly sizes = SNEAKERS_SIZES;
  readonly tierOptions = SNEAKERS_TIER_OPTIONS;
  readonly headerStats = SNEAKERS_HEADER_STATS;
  readonly footerColumns = SNEAKERS_FOOTER_COLUMNS;

  readonly products = signal<SneakerProduct[]>(
    (sneakersSeedData as SneakerProduct[]).filter(p => p.is_active)
  );
  readonly catalogSource = signal<CatalogSyncSourceType>(CatalogSyncSource.SEED_FALLBACK);
  readonly isSyncingCatalog = signal<boolean>(false);

  readonly selectedCategory = signal<SneakerCategoryFilter>(SNEAKERS_SHOP_VALUES.DEFAULT_CATEGORY);
  readonly selectedBrand = signal<SneakerBrandFilter>('All');
  readonly selectedTier = signal<SneakerTierFilter>(SNEAKERS_SHOP_VALUES.DEFAULT_TIER);
  readonly viewMode = signal<SneakerCatalogViewMode>(SneakerCatalogViewModeEnum.GRID);
  readonly searchQuery = signal<string>('');

  readonly selectedSizes = signal<Readonly<Record<string, SneakerSizeOption>>>({});
  readonly selectedTradeModes = signal<Readonly<Record<string, SneakerTradeMode>>>({});
  private readonly cardQuantities = signal<Readonly<Record<string, number>>>({});

  readonly filteredProducts = computed<SneakerProduct[]>(() => {
    const cat = this.selectedCategory();
    const brand = this.selectedBrand();
    const tier = this.selectedTier();
    const q = this.searchQuery().trim().toLowerCase();

    return this.products().filter(p => {
      const matchCat = cat === SneakerCategoryFilterEnum.ALL || p.category === cat;
      const matchBrand = brand === 'All' || p.brand === brand;
      const matchTier = tier === SneakerTierFilterEnum.ALL || p.tier === tier;
      const matchQ =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.code.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.colorway.toLowerCase().includes(q);
      return matchCat && matchBrand && matchTier && matchQ;
    });
  });

  constructor() {
    this.refreshFromShopify();
  }

  refreshFromShopify(): void {
    this.isSyncingCatalog.set(true);
    this.shopifyApi.fetchCatalog<SneakerProduct>(ShopId.SNEAKERS).subscribe({
      next: response => {
        if (response && Array.isArray(response.products) && response.products.length > 0) {
          this.products.set(response.products.filter(item => item.is_active));
          this.catalogSource.set(response.source || CatalogSyncSource.SEED_FALLBACK);
        }
        this.isSyncingCatalog.set(false);
      },
      error: () => {
        this.catalogSource.set(CatalogSyncSource.SEED_FALLBACK);
        this.isSyncingCatalog.set(false);
      }
    });
  }

  setCategory(category: SneakerCategoryFilter): void {
    this.selectedCategory.set(category);
  }

  setBrand(brand: SneakerBrandFilter): void {
    this.selectedBrand.set(brand);
  }

  setTier(tier: SneakerTierFilter): void {
    this.selectedTier.set(tier);
  }

  setViewMode(mode: SneakerCatalogViewMode): void {
    this.viewMode.set(mode);
  }

  setSearchQuery(query: string): void {
    this.searchQuery.set(query);
  }

  getSelectedSize(productId: string): SneakerSizeOption {
    return this.selectedSizes()[productId] || SNEAKERS_SHOP_VALUES.DEFAULT_SIZE;
  }

  setSelectedSize(productId: string, size: SneakerSizeOption): void {
    this.selectedSizes.update(map => ({
      ...map,
      [productId]: size
    }));
  }

  getSizeQuote(product: SneakerProduct): SneakerSizeQuote {
    const size = this.getSelectedSize(product.id);
    const matched = product.size_matrix?.find(q => q.sizeUs === size);
    if (matched) {
      return matched;
    }
    return (
      product.size_matrix?.[0] ?? {
        sizeUs: 'US 9',
        sizeUk: 'UK 8',
        lowestAskZar: product.lowest_ask_zar,
        highestBidZar: product.highest_bid_zar,
        lastSaleZar: product.last_sale_zar,
        stockQty: product.stock_qty,
        sku: `${product.code}-US9`
      }
    );
  }

  getTradeMode(productId: string): SneakerTradeMode {
    return this.selectedTradeModes()[productId] || SNEAKERS_SHOP_VALUES.DEFAULT_TRADE_MODE;
  }

  setTradeMode(productId: string, mode: SneakerTradeMode): void {
    this.selectedTradeModes.update(map => ({
      ...map,
      [productId]: mode
    }));
  }

  getActiveAskPrice(product: SneakerProduct): number {
    return this.getSizeQuote(product).lowestAskZar;
  }

  getActiveBidPrice(product: SneakerProduct): number {
    return this.getSizeQuote(product).highestBidZar;
  }

  getActiveLastSalePrice(product: SneakerProduct): number {
    return this.getSizeQuote(product).lastSaleZar;
  }

  getActiveStockForSize(product: SneakerProduct): number {
    return this.getSizeQuote(product).stockQty;
  }

  getDisplayPrice(product: SneakerProduct): number {
    const mode = this.getTradeMode(product.id);
    return mode === SneakerTradeModeEnum.PLACE_BID
      ? this.getActiveBidPrice(product)
      : this.getActiveAskPrice(product);
  }

  getCardQuantity(productId: string): number {
    return this.cardQuantities()[productId] || 1;
  }

  setCardQuantity(productId: string, quantity: number): void {
    const clamped = Math.max(1, Math.min(10, Math.floor(quantity)));
    this.cardQuantities.update(current => ({
      ...current,
      [productId]: clamped
    }));
  }

  adjustCardQuantity(productId: string, delta: number): void {
    this.setCardQuantity(productId, this.getCardQuantity(productId) + delta);
  }

  addProductToCart(product: SneakerProduct): void {
    const quote = this.getSizeQuote(product);
    const mode = this.getTradeMode(product.id);
    const orderType =
      mode === SneakerTradeModeEnum.PLACE_BID
        ? MarketOrderTypeEnum.PLACE_BID
        : MarketOrderTypeEnum.BUY_NOW;
    const price = this.getDisplayPrice(product);
    const qty = this.getCardQuantity(product.id);
    const sizeLabel = `${quote.sizeUs} / ${quote.sizeUk}`;

    this.cartService.addSneakerToCart(product, sizeLabel, price, orderType, qty);
    this.setCardQuantity(product.id, 1);
  }
}

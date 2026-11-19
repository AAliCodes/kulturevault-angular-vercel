import { Injectable, inject, signal, computed } from '@angular/core';
import {
  ApparelSizeOption,
  CatalogSyncSource,
  CatalogSyncSourceType,
  MarketOrderTypeEnum,
  ShopId,
  StreetwearBrandFilter,
  StreetwearCategoryFilter,
  StreetwearCategoryFilterEnum,
  StreetwearProduct,
  StreetwearPurchaseMode,
  StreetwearPurchaseModeEnum,
  StreetwearTierFilter,
  StreetwearTierFilterEnum
} from '../../../models/product.model';
import {
  STREETWEAR_ALLOWED_BRANDS,
  STREETWEAR_CATEGORIES,
  STREETWEAR_FOOTER_COLUMNS,
  STREETWEAR_HEADER_STATS,
  STREETWEAR_SHOP_VALUES,
  STREETWEAR_SIZES,
  STREETWEAR_TIER_OPTIONS
} from '../values/streetwear.values';
import { STREETWEAR_THEME_CONFIG } from '../config/streetwear-theme.config';
import { ShopifyApiService } from '../../../core/services/shopify-api.service';
import { CartService } from '../../../services/cart.service';
import streetwearSeedData from '../../../../assets/kulturevault-streetwear-seed.json';

@Injectable({ providedIn: 'root' })
export class StreetwearShopService {
  private readonly shopifyApi = inject(ShopifyApiService);
  private readonly cartService = inject(CartService);

  readonly theme = STREETWEAR_THEME_CONFIG;
  readonly values = STREETWEAR_SHOP_VALUES;
  readonly categories = STREETWEAR_CATEGORIES;
  readonly brands: readonly StreetwearBrandFilter[] = ['All', ...STREETWEAR_ALLOWED_BRANDS];
  readonly sizes = STREETWEAR_SIZES;
  readonly tierOptions = STREETWEAR_TIER_OPTIONS;
  readonly headerStats = STREETWEAR_HEADER_STATS;
  readonly footerColumns = STREETWEAR_FOOTER_COLUMNS;

  readonly products = signal<StreetwearProduct[]>(
    (streetwearSeedData as StreetwearProduct[]).filter(p => p.is_active)
  );
  readonly catalogSource = signal<CatalogSyncSourceType>(CatalogSyncSource.SEED_FALLBACK);
  readonly isSyncingCatalog = signal<boolean>(false);

  readonly selectedCategory = signal<StreetwearCategoryFilter>(
    STREETWEAR_SHOP_VALUES.DEFAULT_CATEGORY
  );
  readonly selectedBrand = signal<StreetwearBrandFilter>('All');
  readonly selectedTier = signal<StreetwearTierFilter>(STREETWEAR_SHOP_VALUES.DEFAULT_TIER);
  readonly searchQuery = signal<string>('');

  readonly selectedSizes = signal<Readonly<Record<string, ApparelSizeOption>>>({});
  readonly selectedModes = signal<Readonly<Record<string, StreetwearPurchaseMode>>>({});
  private readonly cardQuantities = signal<Readonly<Record<string, number>>>({});

  readonly filteredProducts = computed<StreetwearProduct[]>(() => {
    const cat = this.selectedCategory();
    const brand = this.selectedBrand();
    const tier = this.selectedTier();
    const q = this.searchQuery().trim().toLowerCase();

    return this.products().filter(p => {
      const matchCat = cat === StreetwearCategoryFilterEnum.ALL || p.category === cat;
      const matchBrand = brand === 'All' || p.brand === brand;
      const matchTier = tier === StreetwearTierFilterEnum.ALL || p.tier === tier;
      const matchQ =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.code.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.season_code.toLowerCase().includes(q);
      return matchCat && matchBrand && matchTier && matchQ;
    });
  });

  constructor() {
    this.refreshFromShopify();
  }

  refreshFromShopify(): void {
    this.isSyncingCatalog.set(true);
    this.shopifyApi.fetchCatalog<StreetwearProduct>(ShopId.STREETWEAR).subscribe({
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

  setCategory(category: StreetwearCategoryFilter): void {
    this.selectedCategory.set(category);
  }

  setBrand(brand: StreetwearBrandFilter): void {
    this.selectedBrand.set(brand);
  }

  setTier(tier: StreetwearTierFilter): void {
    this.selectedTier.set(tier);
  }

  setSearchQuery(query: string): void {
    this.searchQuery.set(query);
  }

  getSelectedSize(productId: string): ApparelSizeOption {
    return this.selectedSizes()[productId] || STREETWEAR_SHOP_VALUES.DEFAULT_SIZE;
  }

  setSelectedSize(productId: string, size: ApparelSizeOption): void {
    this.selectedSizes.update(map => ({
      ...map,
      [productId]: size
    }));
  }

  getPurchaseMode(productId: string): StreetwearPurchaseMode {
    return this.selectedModes()[productId] || STREETWEAR_SHOP_VALUES.DEFAULT_MODE;
  }

  setPurchaseMode(productId: string, mode: StreetwearPurchaseMode): void {
    this.selectedModes.update(map => ({
      ...map,
      [productId]: mode
    }));
  }

  getDisplayPrice(product: StreetwearProduct): number {
    const mode = this.getPurchaseMode(product.id);
    if (mode === StreetwearPurchaseModeEnum.COLLECTOR_BID) {
      return product.highest_bid_zar;
    }
    return product.lowest_ask_zar;
  }

  getBidSavingsAmount(product: StreetwearProduct): number {
    return Number((product.lowest_ask_zar - product.highest_bid_zar).toFixed(2));
  }

  getCardQuantity(productId: string): number {
    return this.cardQuantities()[productId] || 1;
  }

  setCardQuantity(productId: string, quantity: number): void {
    const clamped = Math.max(1, Math.min(15, Math.floor(quantity)));
    this.cardQuantities.update(current => ({
      ...current,
      [productId]: clamped
    }));
  }

  adjustCardQuantity(productId: string, delta: number): void {
    this.setCardQuantity(productId, this.getCardQuantity(productId) + delta);
  }

  addProductToCart(product: StreetwearProduct): void {
    const size = this.getSelectedSize(product.id);
    const mode = this.getPurchaseMode(product.id);
    const orderType =
      mode === StreetwearPurchaseModeEnum.COLLECTOR_BID
        ? MarketOrderTypeEnum.PLACE_BID
        : MarketOrderTypeEnum.BUY_NOW;
    const price = this.getDisplayPrice(product);
    const qty = this.getCardQuantity(product.id);

    this.cartService.addStreetwearToCart(product, size, price, orderType, qty);
    this.setCardQuantity(product.id, 1);
  }
}

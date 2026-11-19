import { Injectable, inject, signal, computed } from '@angular/core';
import {
  CatalogSyncSource,
  CatalogSyncSourceType,
  CollectibleCategoryFilter,
  CollectibleCategoryFilterEnum,
  CollectibleCreatorFilter,
  CollectibleOrderMode,
  CollectibleOrderModeEnum,
  CollectibleProduct,
  CollectibleTierFilter,
  CollectibleTierFilterEnum,
  MarketOrderTypeEnum,
  ShopId
} from '../../../models/product.model';
import {
  COLLECTIBLES_ALLOWED_CREATORS,
  COLLECTIBLES_CATEGORIES,
  COLLECTIBLES_FOOTER_COLUMNS,
  COLLECTIBLES_HEADER_STATS,
  COLLECTIBLES_SHOP_VALUES,
  COLLECTIBLES_TIER_OPTIONS
} from '../values/collectibles.values';
import { COLLECTIBLES_THEME_CONFIG } from '../config/collectibles-theme.config';
import { ShopifyApiService } from '../../../core/services/shopify-api.service';
import { CartService } from '../../../services/cart.service';
import collectiblesSeedData from '../../../../assets/kulturevault-collectibles-seed.json';

@Injectable({ providedIn: 'root' })
export class CollectiblesShopService {
  private readonly shopifyApi = inject(ShopifyApiService);
  private readonly cartService = inject(CartService);

  readonly theme = COLLECTIBLES_THEME_CONFIG;
  readonly values = COLLECTIBLES_SHOP_VALUES;
  readonly categories = COLLECTIBLES_CATEGORIES;
  readonly creators: readonly CollectibleCreatorFilter[] = [
    'All',
    ...COLLECTIBLES_ALLOWED_CREATORS
  ];
  readonly tierOptions = COLLECTIBLES_TIER_OPTIONS;
  readonly headerStats = COLLECTIBLES_HEADER_STATS;
  readonly footerColumns = COLLECTIBLES_FOOTER_COLUMNS;

  readonly products = signal<CollectibleProduct[]>(
    (collectiblesSeedData as CollectibleProduct[]).filter(p => p.is_active)
  );
  readonly catalogSource = signal<CatalogSyncSourceType>(CatalogSyncSource.SEED_FALLBACK);
  readonly isSyncingCatalog = signal<boolean>(false);

  readonly selectedCategory = signal<CollectibleCategoryFilter>(
    COLLECTIBLES_SHOP_VALUES.DEFAULT_CATEGORY
  );
  readonly selectedCreator = signal<CollectibleCreatorFilter>('All');
  readonly selectedTier = signal<CollectibleTierFilter>(COLLECTIBLES_SHOP_VALUES.DEFAULT_TIER);
  readonly searchQuery = signal<string>('');

  readonly selectedModes = signal<Readonly<Record<string, CollectibleOrderMode>>>({});
  private readonly cardQuantities = signal<Readonly<Record<string, number>>>({});

  readonly filteredProducts = computed<CollectibleProduct[]>(() => {
    const cat = this.selectedCategory();
    const creator = this.selectedCreator();
    const tier = this.selectedTier();
    const q = this.searchQuery().trim().toLowerCase();

    return this.products().filter(p => {
      const matchCat = cat === CollectibleCategoryFilterEnum.ALL || p.category === cat;
      const matchCreator = creator === 'All' || p.brand === creator;
      const matchTier = tier === CollectibleTierFilterEnum.ALL || p.tier === tier;
      const matchQ =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.code.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.edition_type.toLowerCase().includes(q);
      return matchCat && matchCreator && matchTier && matchQ;
    });
  });

  constructor() {
    this.refreshFromShopify();
  }

  refreshFromShopify(): void {
    this.isSyncingCatalog.set(true);
    this.shopifyApi.fetchCatalog<CollectibleProduct>(ShopId.COLLECTIBLES).subscribe({
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

  setCategory(category: CollectibleCategoryFilter): void {
    this.selectedCategory.set(category);
  }

  setCreator(creator: CollectibleCreatorFilter): void {
    this.selectedCreator.set(creator);
  }

  setTier(tier: CollectibleTierFilter): void {
    this.selectedTier.set(tier);
  }

  setSearchQuery(query: string): void {
    this.searchQuery.set(query);
  }

  getOrderMode(productId: string): CollectibleOrderMode {
    return this.selectedModes()[productId] || COLLECTIBLES_SHOP_VALUES.DEFAULT_MODE;
  }

  setOrderMode(productId: string, mode: CollectibleOrderMode): void {
    this.selectedModes.update(map => ({
      ...map,
      [productId]: mode
    }));
  }

  getDisplayPrice(product: CollectibleProduct): number {
    const mode = this.getOrderMode(product.id);
    return mode === CollectibleOrderModeEnum.VAULT_BID
      ? product.highest_bid_zar
      : product.lowest_ask_zar;
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

  addProductToCart(product: CollectibleProduct): void {
    const mode = this.getOrderMode(product.id);
    const orderType =
      mode === CollectibleOrderModeEnum.VAULT_BID
        ? MarketOrderTypeEnum.PLACE_BID
        : MarketOrderTypeEnum.BUY_NOW;
    const price = this.getDisplayPrice(product);
    const qty = this.getCardQuantity(product.id);

    this.cartService.addCollectibleToCart(product, price, orderType, qty);
    this.setCardQuantity(product.id, 1);
    this.cartService.openDrawer();
  }
}

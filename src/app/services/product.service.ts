import { Injectable, inject } from '@angular/core';
import { SneakersShopService } from '../shops/sneakers/services/sneakers-shop.service';
import {
  SneakerBrandFilter,
  SneakerCategoryFilter,
  SneakerProduct,
  SneakerSizeOption
} from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly sneakersShopService = inject(SneakersShopService);

  readonly products = this.sneakersShopService.products;
  readonly filteredProducts = this.sneakersShopService.filteredProducts;
  readonly selectedCategory = this.sneakersShopService.selectedCategory;
  readonly selectedBrand = this.sneakersShopService.selectedBrand;
  readonly catalogSource = this.sneakersShopService.catalogSource;

  setCategory(category: SneakerCategoryFilter): void {
    this.sneakersShopService.setCategory(category);
  }

  setBrand(brand: SneakerBrandFilter): void {
    this.sneakersShopService.setBrand(brand);
  }

  setSelectedSize(productId: string, size: SneakerSizeOption): void {
    this.sneakersShopService.setSelectedSize(productId, size);
  }

  getDisplayPrice(product: SneakerProduct): number {
    return this.sneakersShopService.getDisplayPrice(product);
  }
}

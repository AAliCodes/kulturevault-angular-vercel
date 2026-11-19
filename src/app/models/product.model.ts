export * from '../core/enums/shop.enums';
export * from '../core/models/base-catalog.model';
export * from '../core/config/shop-theme.model';

export * from '../shops/sneakers/enums/sneakers.enums';
export * from '../shops/sneakers/models/sneakers.model';

export * from '../shops/streetwear/enums/streetwear.enums';
export * from '../shops/streetwear/models/streetwear.model';

export * from '../shops/collectibles/enums/collectibles.enums';
export * from '../shops/collectibles/models/collectibles.model';

import { BaseCatalogProduct } from '../core/models/base-catalog.model';
import {
  MarketOrderType as CoreMarketOrderType,
  StoreDepartment as CoreStoreDepartment
} from '../core/enums/shop.enums';

export interface CartItem {
  readonly cartItemId: string;
  readonly product: BaseCatalogProduct;
  readonly optionSelection: string;
  readonly unitPrice: number;
  readonly quantity: number;
  readonly orderType: CoreMarketOrderType;
  readonly discountPct: number;
  readonly lob: CoreStoreDepartment;
  readonly variantId?: string;
}

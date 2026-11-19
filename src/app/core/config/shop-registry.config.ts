import { ShopThemeConfig } from './shop-theme.model';
import { ShopId, StoreDepartment } from '../enums/shop.enums';
import { SNEAKERS_THEME_CONFIG } from '../../shops/sneakers/config/sneakers-theme.config';
import { STREETWEAR_THEME_CONFIG } from '../../shops/streetwear/config/streetwear-theme.config';
import { COLLECTIBLES_THEME_CONFIG } from '../../shops/collectibles/config/collectibles-theme.config';

export const SHOP_THEME_REGISTRY: Readonly<Record<StoreDepartment, ShopThemeConfig>> = {
  [ShopId.SNEAKERS]: SNEAKERS_THEME_CONFIG,
  [ShopId.STREETWEAR]: STREETWEAR_THEME_CONFIG,
  [ShopId.COLLECTIBLES]: COLLECTIBLES_THEME_CONFIG
} as const;

export const SHOP_CONFIG_LIST: readonly ShopThemeConfig[] = [
  SNEAKERS_THEME_CONFIG,
  STREETWEAR_THEME_CONFIG,
  COLLECTIBLES_THEME_CONFIG
] as const;

export function resolveShopDepartmentFromUrl(url: string): StoreDepartment {
  const normalized = (url || '').toLowerCase();
  if (normalized.includes('/streetwear') || normalized.includes('/apparel')) {
    return ShopId.STREETWEAR;
  }
  if (normalized.includes('/collectibles') || normalized.includes('/vault')) {
    return ShopId.COLLECTIBLES;
  }
  return ShopId.SNEAKERS;
}

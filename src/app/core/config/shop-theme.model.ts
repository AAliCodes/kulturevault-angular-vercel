import { ShopId, StoreDepartment } from '../enums/shop.enums';

export interface ShopColorPalette {
  readonly primary: string;
  readonly primaryHover: string;
  readonly onPrimary: string;
  readonly primaryContainer: string;
  readonly onPrimaryContainer: string;
  readonly secondary: string;
  readonly onSecondary: string;
  readonly secondaryContainer: string;
  readonly onSecondaryContainer: string;
  readonly accent: string;
  readonly tertiaryContainer: string;
  readonly onTertiaryContainer: string;
  readonly background: string;
  readonly surface: string;
  readonly surfaceElevated: string;
  readonly surfaceContainerLowest: string;
  readonly surfaceContainerLow: string;
  readonly surfaceContainer: string;
  readonly surfaceContainerHigh: string;
  readonly surfaceContainerHighest: string;
  readonly border: string;
  readonly outline: string;
  readonly outlineVariant: string;
  readonly textPrimary: string;
  readonly textSecondary: string;
  readonly textMuted: string;
  readonly ribbonBg: string;
  readonly ribbonText: string;
  readonly contextBarBg: string;
  readonly contextBarBorder: string;
  readonly badgeBg: string;
  readonly badgeText: string;
  readonly footerBg: string;
  readonly footerBorder: string;
}

export interface ShopTypographyConfig {
  readonly headingFontFamily: string;
  readonly bodyFontFamily: string;
  readonly monoFontFamily: string;
}

export interface ShopContextChipConfig {
  readonly id: string;
  readonly propertyKey: string;
  readonly cssClass: string;
  readonly hideOnMobile?: boolean;
  readonly hasStarIcon?: boolean;
}

export interface ShopBrandingConfig {
  readonly crestIcon: string;
  readonly emptyCartIcon: string;
  readonly primaryRoute: string;
  readonly aliasRoutes: readonly string[];
  readonly orderReferencePrefix: string;
  readonly tabLabelKey: string;
  readonly tabTitleKey: string;
  readonly logoAccentKey: string;
  readonly brandSubKey: string;
  readonly footerBadgeKey: string;
  readonly pillarTitleKey: string;
  readonly pillarDescKey: string;
  readonly emptyCartTitleKey: string;
  readonly emptyCartDescKey: string;
  readonly emptyCartCtaKey: string;
  readonly checkoutConfirmBtnKey: string;
  readonly checkoutAlertKey: string;
}

export interface ShopLogisticsPolicyConfig {
  readonly freeDeliveryThresholdZar: number;
  readonly standardDeliveryFeeZar: number;
  readonly expressOrMaxDeliveryFeeZar: number;
  readonly discountRatePct: number;
}

export interface ShopThemeConfig {
  readonly shopId: ShopId;
  readonly departmentKey: StoreDepartment;
  readonly displayName: string;
  readonly themeMode: 'light' | 'dark';
  readonly palette: ShopColorPalette;
  readonly typography: ShopTypographyConfig;
  readonly branding: ShopBrandingConfig;
  readonly contextChips: readonly ShopContextChipConfig[];
  readonly logistics: ShopLogisticsPolicyConfig;
  readonly cssVariables: Readonly<Record<string, string>>;
}

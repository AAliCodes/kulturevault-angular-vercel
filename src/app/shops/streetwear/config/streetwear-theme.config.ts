import { ShopThemeConfig } from '../../../core/config/shop-theme.model';
import { ShopId, ShopRouteAlias } from '../../../core/enums/shop.enums';
import { STREETWEAR_SHOP_VALUES } from '../values/streetwear.values';

export const STREETWEAR_THEME_CONFIG: ShopThemeConfig = {
  shopId: ShopId.STREETWEAR,
  departmentKey: 'streetwear',
  displayName: 'KULTUREVAULT // Streetwear & Apparel Archive',
  themeMode: 'light',
  palette: {
    primary: '#D90429',
    primaryHover: '#B00220',
    onPrimary: '#FFFFFF',
    primaryContainer: '#FFDAD6',
    onPrimaryContainer: '#410002',
    secondary: '#111111',
    onSecondary: '#FFFFFF',
    secondaryContainer: '#E8E4DC',
    onSecondaryContainer: '#18181B',
    accent: '#D97706',
    tertiaryContainer: '#FEF3C7',
    onTertiaryContainer: '#451A03',
    background: '#F4F1EA',
    surface: '#FAF8F5',
    surfaceElevated: '#FFFFFF',
    surfaceContainerLowest: '#FFFFFF',
    surfaceContainerLow: '#FAF8F5',
    surfaceContainer: '#F4F1EA',
    surfaceContainerHigh: '#EAE5DB',
    surfaceContainerHighest: '#DFD9CC',
    border: '#D6D0C4',
    outline: '#78716C',
    outlineVariant: '#D6D0C4',
    textPrimary: '#111111',
    textSecondary: '#44403C',
    textMuted: '#78716C',
    ribbonBg: '#111111',
    ribbonText: '#FAF8F5',
    contextBarBg: '#FAF8F5',
    contextBarBorder: '#D6D0C4',
    badgeBg: '#FFDAD6',
    badgeText: '#93000A',
    footerBg: '#111111',
    footerBorder: '#292524'
  },
  typography: {
    headingFontFamily: "'Space Grotesk', 'Helvetica Neue', Arial, sans-serif",
    bodyFontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    monoFontFamily: "'JetBrains Mono', 'Fira Code', monospace"
  },
  branding: {
    crestIcon: '🧥',
    emptyCartIcon: '🧥',
    primaryRoute: `/${ShopRouteAlias.STREETWEAR_PRIMARY}`,
    aliasRoutes: [ShopRouteAlias.STREETWEAR_PRIMARY, ShopRouteAlias.STREETWEAR_ALIAS],
    orderReferencePrefix: 'KLT-STR',
    tabLabelKey: 'shell.nav.tab.streetwear.label',
    tabTitleKey: 'shell.nav.tab.streetwear.title',
    logoAccentKey: 'shell.brand.accent.streetwear',
    brandSubKey: 'shell.brand.sub.streetwear',
    footerBadgeKey: 'shell.footer.badge.streetwear',
    pillarTitleKey: 'shell.footer.pillar.streetwear.title',
    pillarDescKey: 'shell.footer.pillar.streetwear.desc',
    emptyCartTitleKey: 'shell.empty.streetwear.title',
    emptyCartDescKey: 'shell.empty.streetwear.desc',
    emptyCartCtaKey: 'shell.empty.streetwear.cta',
    checkoutConfirmBtnKey: 'shell.checkout.confirm.streetwear',
    checkoutAlertKey: 'shell.checkout.alert.streetwear'
  },
  contextChips: [
    {
      id: 'streetwear-clg',
      propertyKey: 'shell.context.streetwear.chip1',
      cssClass: 'context-chip crimson',
      hasStarIcon: true
    },
    {
      id: 'streetwear-houses',
      propertyKey: 'shell.context.streetwear.chip2',
      cssClass: 'context-chip'
    },
    {
      id: 'streetwear-gsm',
      propertyKey: 'shell.context.streetwear.chip3',
      cssClass: 'context-chip hide-mobile',
      hideOnMobile: true
    }
  ],
  logistics: {
    freeDeliveryThresholdZar: STREETWEAR_SHOP_VALUES.FREE_DELIVERY_THRESHOLD_ZAR,
    standardDeliveryFeeZar: STREETWEAR_SHOP_VALUES.STANDARD_DELIVERY_FEE_ZAR,
    expressOrMaxDeliveryFeeZar: STREETWEAR_SHOP_VALUES.EXPRESS_DELIVERY_FEE_ZAR,
    discountRatePct: 9
  },
  cssVariables: {
    '--md-sys-color-primary': '#D90429',
    '--md-sys-color-on-primary': '#FFFFFF',
    '--md-sys-color-primary-container': '#FFDAD6',
    '--md-sys-color-on-primary-container': '#410002',
    '--md-sys-color-primary-fixed-dim': '#B00220',
    '--md-sys-color-secondary': '#111111',
    '--md-sys-color-on-secondary': '#FFFFFF',
    '--md-sys-color-secondary-container': '#E8E4DC',
    '--md-sys-color-on-secondary-container': '#18181B',
    '--md-sys-color-tertiary': '#D97706',
    '--md-sys-color-tertiary-container': '#FEF3C7',
    '--md-sys-color-on-tertiary-container': '#451A03',
    '--md-sys-color-background': '#F4F1EA',
    '--md-sys-color-on-background': '#111111',
    '--md-sys-color-surface': '#FAF8F5',
    '--md-sys-color-on-surface': '#111111',
    '--md-sys-color-on-surface-variant': '#44403C',
    '--md-sys-color-surface-container-lowest': '#FFFFFF',
    '--md-sys-color-surface-container-low': '#FAF8F5',
    '--md-sys-color-surface-container': '#F4F1EA',
    '--md-sys-color-surface-container-high': '#EAE5DB',
    '--md-sys-color-surface-container-highest': '#DFD9CC',
    '--md-sys-color-outline': '#78716C',
    '--md-sys-color-outline-variant': '#D6D0C4',
    '--md-sys-typescale-heading-font': "'Space Grotesk', 'Helvetica Neue', Arial, sans-serif",
    '--md-sys-typescale-body-font': "'Inter', system-ui, -apple-system, sans-serif",
    '--md-sys-typescale-mono-font': "'JetBrains Mono', 'Fira Code', monospace"
  }
};

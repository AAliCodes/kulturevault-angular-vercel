import { ShopThemeConfig } from '../../../core/config/shop-theme.model';
import { ShopId, ShopRouteAlias } from '../../../core/enums/shop.enums';
import { COLLECTIBLES_SHOP_VALUES } from '../values/collectibles.values';

export const COLLECTIBLES_THEME_CONFIG: ShopThemeConfig = {
  shopId: ShopId.COLLECTIBLES,
  departmentKey: 'collectibles',
  displayName: 'KULTUREVAULT // Collectibles & Art Vault',
  themeMode: 'dark',
  palette: {
    primary: '#F4A261',
    primaryHover: '#E76F51',
    onPrimary: '#241002',
    primaryContainer: '#3B2313',
    onPrimaryContainer: '#FFDCC2',
    secondary: '#2EC4B6',
    onSecondary: '#00201D',
    secondaryContainer: '#0F3834',
    onSecondaryContainer: '#A7F3EC',
    accent: '#C084FC',
    tertiaryContainer: '#2E1A47',
    onTertiaryContainer: '#F3E8FF',
    background: '#13111C',
    surface: '#0C0B12',
    surfaceElevated: '#1C1929',
    surfaceContainerLowest: '#0C0B12',
    surfaceContainerLow: '#13111C',
    surfaceContainer: '#1C1929',
    surfaceContainerHigh: '#262338',
    surfaceContainerHighest: '#322E4A',
    border: '#322E4A',
    outline: '#56507A',
    outlineVariant: '#262338',
    textPrimary: '#F5F3FF',
    textSecondary: '#A5A1C2',
    textMuted: '#7C779E',
    ribbonBg: '#1C1326',
    ribbonText: '#FFDCC2',
    contextBarBg: '#13111C',
    contextBarBorder: '#262338',
    badgeBg: '#3B2313',
    badgeText: '#F4A261',
    footerBg: '#09080E',
    footerBorder: '#262338'
  },
  typography: {
    headingFontFamily: "'Space Grotesk', 'Inter', system-ui, sans-serif",
    bodyFontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    monoFontFamily: "'JetBrains Mono', 'Fira Code', monospace"
  },
  branding: {
    crestIcon: '🧸',
    emptyCartIcon: '🧸',
    primaryRoute: `/${ShopRouteAlias.COLLECTIBLES_PRIMARY}`,
    aliasRoutes: [ShopRouteAlias.COLLECTIBLES_PRIMARY, ShopRouteAlias.COLLECTIBLES_ALIAS],
    orderReferencePrefix: 'KLT-COL',
    tabLabelKey: 'shell.nav.tab.collectibles.label',
    tabTitleKey: 'shell.nav.tab.collectibles.title',
    logoAccentKey: 'shell.brand.accent.collectibles',
    brandSubKey: 'shell.brand.sub.collectibles',
    footerBadgeKey: 'shell.footer.badge.collectibles',
    pillarTitleKey: 'shell.footer.pillar.collectibles.title',
    pillarDescKey: 'shell.footer.pillar.collectibles.desc',
    emptyCartTitleKey: 'shell.empty.collectibles.title',
    emptyCartDescKey: 'shell.empty.collectibles.desc',
    emptyCartCtaKey: 'shell.empty.collectibles.cta',
    checkoutConfirmBtnKey: 'shell.checkout.confirm.collectibles',
    checkoutAlertKey: 'shell.checkout.alert.collectibles'
  },
  contextChips: [
    {
      id: 'collectibles-hologram',
      propertyKey: 'shell.context.collectibles.chip1',
      cssClass: 'context-chip amber',
      hasStarIcon: true
    },
    {
      id: 'collectibles-editions',
      propertyKey: 'shell.context.collectibles.chip2',
      cssClass: 'context-chip'
    },
    {
      id: 'collectibles-crating',
      propertyKey: 'shell.context.collectibles.chip3',
      cssClass: 'context-chip hide-mobile',
      hideOnMobile: true
    }
  ],
  logistics: {
    freeDeliveryThresholdZar: COLLECTIBLES_SHOP_VALUES.FREE_DELIVERY_THRESHOLD_ZAR,
    standardDeliveryFeeZar: COLLECTIBLES_SHOP_VALUES.STANDARD_CRATE_FREIGHT_ZAR,
    expressOrMaxDeliveryFeeZar: COLLECTIBLES_SHOP_VALUES.EXPRESS_CRATE_FREIGHT_ZAR,
    discountRatePct: 10
  },
  cssVariables: {
    '--md-sys-color-primary': '#F4A261',
    '--md-sys-color-on-primary': '#241002',
    '--md-sys-color-primary-container': '#3B2313',
    '--md-sys-color-on-primary-container': '#FFDCC2',
    '--md-sys-color-primary-fixed-dim': '#E76F51',
    '--md-sys-color-secondary': '#2EC4B6',
    '--md-sys-color-on-secondary': '#00201D',
    '--md-sys-color-secondary-container': '#0F3834',
    '--md-sys-color-on-secondary-container': '#A7F3EC',
    '--md-sys-color-tertiary': '#C084FC',
    '--md-sys-color-tertiary-container': '#2E1A47',
    '--md-sys-color-on-tertiary-container': '#F3E8FF',
    '--md-sys-color-background': '#13111C',
    '--md-sys-color-on-background': '#F5F3FF',
    '--md-sys-color-surface': '#0C0B12',
    '--md-sys-color-on-surface': '#F5F3FF',
    '--md-sys-color-on-surface-variant': '#A5A1C2',
    '--md-sys-color-surface-container-lowest': '#0C0B12',
    '--md-sys-color-surface-container-low': '#13111C',
    '--md-sys-color-surface-container': '#1C1929',
    '--md-sys-color-surface-container-high': '#262338',
    '--md-sys-color-surface-container-highest': '#322E4A',
    '--md-sys-color-outline': '#56507A',
    '--md-sys-color-outline-variant': '#262338',
    '--md-sys-typescale-heading-font': "'Space Grotesk', 'Inter', system-ui, sans-serif",
    '--md-sys-typescale-body-font': "'Inter', system-ui, -apple-system, sans-serif",
    '--md-sys-typescale-mono-font': "'JetBrains Mono', 'Fira Code', monospace"
  }
};

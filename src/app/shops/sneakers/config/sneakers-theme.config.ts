import { ShopThemeConfig } from '../../../core/config/shop-theme.model';
import { ShopId, ShopRouteAlias } from '../../../core/enums/shop.enums';
import { SNEAKERS_SHOP_VALUES } from '../values/sneakers.values';

export const SNEAKERS_THEME_CONFIG: ShopThemeConfig = {
  shopId: ShopId.SNEAKERS,
  departmentKey: 'sneakers',
  displayName: 'KULTUREVAULT // Deadstock Sneakers Exchange',
  themeMode: 'dark',
  palette: {
    primary: '#00E676',
    primaryHover: '#00C853',
    onPrimary: '#051F11',
    primaryContainer: '#093820',
    onPrimaryContainer: '#76FFAC',
    secondary: '#F59E0B',
    onSecondary: '#221500',
    secondaryContainer: '#362405',
    onSecondaryContainer: '#FDE68A',
    accent: '#FF6B6B',
    tertiaryContainer: '#3B1619',
    onTertiaryContainer: '#FECDD3',
    background: '#0D1117',
    surface: '#090C10',
    surfaceElevated: '#161B22',
    surfaceContainerLowest: '#090C10',
    surfaceContainerLow: '#0D1117',
    surfaceContainer: '#161B22',
    surfaceContainerHigh: '#21262D',
    surfaceContainerHighest: '#30363D',
    border: '#30363D',
    outline: '#484F58',
    outlineVariant: '#21262D',
    textPrimary: '#F0F6FC',
    textSecondary: '#8B949E',
    textMuted: '#6E7681',
    ribbonBg: '#051F11',
    ribbonText: '#76FFAC',
    contextBarBg: '#0D1117',
    contextBarBorder: '#21262D',
    badgeBg: '#093820',
    badgeText: '#00E676',
    footerBg: '#06090C',
    footerBorder: '#21262D'
  },
  typography: {
    headingFontFamily: "'Space Grotesk', 'Inter', system-ui, sans-serif",
    bodyFontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    monoFontFamily: "'JetBrains Mono', 'Fira Code', monospace"
  },
  branding: {
    crestIcon: '👟',
    emptyCartIcon: '👟',
    primaryRoute: `/${ShopRouteAlias.SNEAKERS_PRIMARY}`,
    aliasRoutes: [ShopRouteAlias.SNEAKERS_PRIMARY, ShopRouteAlias.SNEAKERS_ALIAS],
    orderReferencePrefix: 'KLT-SNK',
    tabLabelKey: 'shell.nav.tab.sneakers.label',
    tabTitleKey: 'shell.nav.tab.sneakers.title',
    logoAccentKey: 'shell.brand.accent.sneakers',
    brandSubKey: 'shell.brand.sub.sneakers',
    footerBadgeKey: 'shell.footer.badge.sneakers',
    pillarTitleKey: 'shell.footer.pillar.sneakers.title',
    pillarDescKey: 'shell.footer.pillar.sneakers.desc',
    emptyCartTitleKey: 'shell.empty.sneakers.title',
    emptyCartDescKey: 'shell.empty.sneakers.desc',
    emptyCartCtaKey: 'shell.empty.sneakers.cta',
    checkoutConfirmBtnKey: 'shell.checkout.confirm.sneakers',
    checkoutAlertKey: 'shell.checkout.alert.sneakers'
  },
  contextChips: [
    {
      id: 'sneakers-auth',
      propertyKey: 'shell.context.sneakers.chip1',
      cssClass: 'context-chip emerald',
      hasStarIcon: true
    },
    {
      id: 'sneakers-og',
      propertyKey: 'shell.context.sneakers.chip2',
      cssClass: 'context-chip'
    },
    {
      id: 'sneakers-spread',
      propertyKey: 'shell.context.sneakers.chip3',
      cssClass: 'context-chip hide-mobile',
      hideOnMobile: true
    }
  ],
  logistics: {
    freeDeliveryThresholdZar: SNEAKERS_SHOP_VALUES.FREE_DELIVERY_THRESHOLD_ZAR,
    standardDeliveryFeeZar: SNEAKERS_SHOP_VALUES.STANDARD_ARMORED_COURIER_ZAR,
    expressOrMaxDeliveryFeeZar: SNEAKERS_SHOP_VALUES.EXPRESS_ARMORED_COURIER_ZAR,
    discountRatePct: 8
  },
  cssVariables: {
    '--md-sys-color-primary': '#00E676',
    '--md-sys-color-on-primary': '#051F11',
    '--md-sys-color-primary-container': '#093820',
    '--md-sys-color-on-primary-container': '#76FFAC',
    '--md-sys-color-primary-fixed-dim': '#00C853',
    '--md-sys-color-secondary': '#F59E0B',
    '--md-sys-color-on-secondary': '#221500',
    '--md-sys-color-secondary-container': '#362405',
    '--md-sys-color-on-secondary-container': '#FDE68A',
    '--md-sys-color-tertiary': '#FF6B6B',
    '--md-sys-color-tertiary-container': '#3B1619',
    '--md-sys-color-on-tertiary-container': '#FECDD3',
    '--md-sys-color-background': '#0D1117',
    '--md-sys-color-on-background': '#F0F6FC',
    '--md-sys-color-surface': '#090C10',
    '--md-sys-color-on-surface': '#F0F6FC',
    '--md-sys-color-on-surface-variant': '#8B949E',
    '--md-sys-color-surface-container-lowest': '#090C10',
    '--md-sys-color-surface-container-low': '#0D1117',
    '--md-sys-color-surface-container': '#161B22',
    '--md-sys-color-surface-container-high': '#21262D',
    '--md-sys-color-surface-container-highest': '#30363D',
    '--md-sys-color-outline': '#484F58',
    '--md-sys-color-outline-variant': '#21262D',
    '--md-sys-typescale-heading-font': "'Space Grotesk', 'Inter', system-ui, sans-serif",
    '--md-sys-typescale-body-font': "'Inter', system-ui, -apple-system, sans-serif",
    '--md-sys-typescale-mono-font': "'JetBrains Mono', 'Fira Code', monospace"
  }
};

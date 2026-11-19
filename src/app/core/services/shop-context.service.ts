import { Injectable, inject, signal, computed, effect } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ShopThemeConfig } from '../config/shop-theme.model';
import {
  SHOP_CONFIG_LIST,
  SHOP_THEME_REGISTRY,
  resolveShopDepartmentFromUrl
} from '../config/shop-registry.config';
import { PropertiesNamespace, ShopId, StoreDepartment } from '../enums/shop.enums';
import { PropertiesService } from './properties.service';

@Injectable({ providedIn: 'root' })
export class ShopContextService {
  private readonly router = inject(Router);
  private readonly document = inject(DOCUMENT, { optional: true });
  private readonly propertiesService = inject(PropertiesService);

  readonly shops: readonly ShopThemeConfig[] = SHOP_CONFIG_LIST;
  readonly currentUrl = signal<string>(this.router.url || `/${ShopId.SNEAKERS}`);

  readonly currentDepartment = computed<StoreDepartment>(() =>
    resolveShopDepartmentFromUrl(this.currentUrl())
  );

  readonly activeShopTheme = computed<ShopThemeConfig>(
    () => SHOP_THEME_REGISTRY[this.currentDepartment()]
  );

  constructor() {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentUrl.set(event.urlAfterRedirects || event.url);
        this.applyThemeVariablesToDom(this.activeShopTheme());
      });

    this.applyThemeVariablesToDom(this.activeShopTheme());
    try {
      effect(() => {
        const theme = this.activeShopTheme();
        this.applyThemeVariablesToDom(theme);
      });
    } catch {
      // Standalone injector context without EffectScheduler uses direct subscription sync
    }
  }

  getShopTheme(department: StoreDepartment): ShopThemeConfig {
    return SHOP_THEME_REGISTRY[department];
  }

  buildOrderConfirmationAlert(
    department: StoreDepartment,
    reference: string,
    totalZar: string
  ): string {
    const theme = this.getShopTheme(department);
    return this.propertiesService.get(PropertiesNamespace.SHELL, theme.branding.checkoutAlertKey, [
      reference,
      totalZar
    ]);
  }

  private applyThemeVariablesToDom(theme: ShopThemeConfig): void {
    const rootEl = this.document?.documentElement;
    if (!rootEl) {
      return;
    }
    for (const [cssVarName, cssVarValue] of Object.entries(theme.cssVariables)) {
      rootEl.style.setProperty(cssVarName, cssVarValue);
    }
    rootEl.setAttribute('data-active-shop', theme.departmentKey);
    rootEl.setAttribute('data-shop-theme', theme.departmentKey);
  }
}

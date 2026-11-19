import { Routes } from '@angular/router';
import { ShopRouteAlias } from './core/enums/shop.enums';

export const routes: Routes = [
  { path: '', redirectTo: ShopRouteAlias.SNEAKERS_PRIMARY, pathMatch: 'full' },
  {
    path: ShopRouteAlias.SNEAKERS_ALIAS,
    redirectTo: ShopRouteAlias.SNEAKERS_PRIMARY,
    pathMatch: 'full'
  },
  {
    path: ShopRouteAlias.SNEAKERS_PRIMARY,
    loadComponent: () =>
      import('./shops/sneakers/sneakers.component').then(m => m.SneakersComponent)
  },
  {
    path: ShopRouteAlias.STREETWEAR_PRIMARY,
    loadComponent: () =>
      import('./shops/streetwear/streetwear.component').then(m => m.StreetwearComponent)
  },
  {
    path: ShopRouteAlias.STREETWEAR_ALIAS,
    redirectTo: ShopRouteAlias.STREETWEAR_PRIMARY,
    pathMatch: 'full'
  },
  {
    path: ShopRouteAlias.COLLECTIBLES_PRIMARY,
    loadComponent: () =>
      import('./shops/collectibles/collectibles.component').then(m => m.CollectiblesComponent)
  },
  {
    path: ShopRouteAlias.COLLECTIBLES_ALIAS,
    redirectTo: ShopRouteAlias.COLLECTIBLES_PRIMARY,
    pathMatch: 'full'
  },
  { path: '**', redirectTo: ShopRouteAlias.SNEAKERS_PRIMARY }
];

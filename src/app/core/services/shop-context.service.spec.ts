import { DOCUMENT } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { Subject } from 'rxjs';
import {
  assertEqual,
  assertMatch,
  describeShopSuite,
  instantiateWithAngularDI,
  itShould
} from '../testing/shop-test-harness';
import { ShopContextService } from './shop-context.service';
import { PropertiesService } from './properties.service';
import { ShopId } from '../enums/shop.enums';

describeShopSuite('ShopContextService (src/app/core/services/shop-context.service.spec.ts)', () => {
  function createMockEnv(initialUrl = '/sneakers') {
    const events$ = new Subject<NavigationEnd>();
    const attrs: Record<string, string> = {};
    const cssVars: Record<string, string> = {};

    const mockRouter = {
      url: initialUrl,
      events: events$.asObservable()
    };

    const mockDoc = {
      documentElement: {
        style: {
          setProperty: (k: string, v: string) => {
            cssVars[k] = v;
          }
        },
        setAttribute: (k: string, v: string) => {
          attrs[k] = v;
        }
      }
    };

    const { instance } = instantiateWithAngularDI(
      () => new ShopContextService(),
      [
        PropertiesService,
        { provide: Router, useValue: mockRouter },
        { provide: DOCUMENT, useValue: mockDoc }
      ]
    );

    return { instance, events$, attrs, cssVars };
  }

  itShould('defaults to sneakers exchange and applies M3 dark emerald CSS tokens', () => {
    const { instance, attrs, cssVars } = createMockEnv('/sneakers');
    assertEqual(instance.currentDepartment(), ShopId.SNEAKERS);
    assertEqual(attrs['data-shop-theme'], 'sneakers');
    assertEqual(cssVars['--md-sys-color-primary'], '#00E676');
  });

  itShould('switches active shop theme dynamically across /streetwear and /collectibles', () => {
    const { instance, events$, attrs, cssVars } = createMockEnv('/sneakers');

    events$.next(new NavigationEnd(1, '/streetwear', '/streetwear'));
    assertEqual(instance.currentDepartment(), ShopId.STREETWEAR);
    assertEqual(attrs['data-shop-theme'], 'streetwear');
    assertEqual(cssVars['--md-sys-color-primary'], '#D90429');

    events$.next(new NavigationEnd(2, '/collectibles', '/collectibles'));
    assertEqual(instance.currentDepartment(), ShopId.COLLECTIBLES);
    assertEqual(attrs['data-shop-theme'], 'collectibles');
    assertEqual(cssVars['--md-sys-color-primary'], '#F4A261');
  });

  itShould('builds localized order confirmation alert message per vertical', () => {
    const { instance } = createMockEnv('/sneakers');
    const msg = instance.buildOrderConfirmationAlert(
      ShopId.SNEAKERS,
      'KLT-SNK-991021',
      'R 8,900.00'
    );
    assertMatch(msg, /KLT-SNK-991021/);
    assertMatch(msg, /R 8,900\.00/);
  });
});

import {
  assertEqual,
  assertMatch,
  assertTrue,
  describeShopSuite,
  instantiateWithAngularDI,
  itShould
} from '../testing/shop-test-harness';
import {
  PropertiesService,
  formatPropertyTemplate,
  parsePropertiesContent
} from './properties.service';
import { PropertiesNamespace } from '../enums/shop.enums';

describeShopSuite('PropertiesService (src/app/core/services/properties.service.spec.ts)', () => {
  itShould('parses Java .properties key=value and key:value lines while ignoring comments', () => {
    const raw = `
      # Comment header
      ! Exclamation comment
      sneakers.header.title = Verified Deadstock Sneakers
      streetwear.season : FW23
    `;
    const parsed = parsePropertiesContent(raw);
    assertEqual(parsed['sneakers.header.title'], 'Verified Deadstock Sneakers');
    assertEqual(parsed['streetwear.season'], 'FW23');
  });

  itShould('interpolates positional {0} and named {key} placeholders accurately', () => {
    const pos = formatPropertyTemplate('{0} deadstock pairs in vault', [5]);
    assertEqual(pos, '5 deadstock pairs in vault');

    const named = formatPropertyTemplate('Ref {ref} settled for {amount}', {
      ref: 'KLT-SNK-101',
      amount: 'R 8,900.00'
    });
    assertEqual(named, 'Ref KLT-SNK-101 settled for R 8,900.00');
  });

  itShould('resolves shell, sneakers, streetwear, and collectibles property bundles via Angular DI', () => {
    const { instance: service } = instantiateWithAngularDI(() => new PropertiesService());

    assertEqual(service.get(PropertiesNamespace.SHELL, 'shell.brand.prefix'), 'KULTURE');
    assertMatch(
      service.get(PropertiesNamespace.SNEAKERS, 'sneakers.header.title'),
      /Verified Deadstock Sneakers/
    );
    assertMatch(
      service.get(PropertiesNamespace.STREETWEAR, 'streetwear.header.title'),
      /Heavyweight Box Logos/
    );
    assertMatch(
      service.get(PropertiesNamespace.COLLECTIBLES, 'collectibles.header.title'),
      /Gallery Vinyl/
    );

    const shellBundle = service.getBundle(PropertiesNamespace.SHELL);
    assertTrue(Object.keys(shellBundle).length >= 45, 'Shell bundle should contain >= 45 keys');
  });
});

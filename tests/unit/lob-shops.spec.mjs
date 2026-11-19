import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const ROOT_DIR = process.cwd();

function parseJavaProperties(rawContent) {
  const result = {};
  for (const rawLine of rawContent.split(/\r?\n/)) {
    const trimmed = rawLine.trim();
    if (!trimmed || trimmed.startsWith('#') || trimmed.startsWith('!')) continue;
    const eqIdx = trimmed.indexOf('=');
    const colonIdx = trimmed.indexOf(':');
    const splitIdx =
      eqIdx !== -1 && colonIdx !== -1
        ? Math.min(eqIdx, colonIdx)
        : eqIdx !== -1
        ? eqIdx
        : colonIdx;
    if (splitIdx === -1) continue;
    const key = trimmed.slice(0, splitIdx).trim();
    const val = trimmed.slice(splitIdx + 1).trim();
    if (key) result[key] = val;
  }
  return result;
}

function collectTsFiles(dirPath) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectTsFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.ts')) {
      files.push(fullPath);
    }
  }
  return files;
}

describe('Multi-Shop Modular Architecture, M3 SCSS Theming, Services & Properties Integrity', () => {
  const shops = ['sneakers', 'streetwear', 'collectibles'];

  it('enforces modular per-shop directory structure (config, enums, models, properties, services, styles, values)', () => {
    for (const shop of shops) {
      const shopBase = path.join(ROOT_DIR, 'src/app/shops', shop);
      assert.ok(fs.existsSync(shopBase), `Shop directory must exist: ${shopBase}`);

      const expectedFiles = [
        `config/${shop}-theme.config.ts`,
        `enums/${shop}.enums.ts`,
        `models/${shop}.model.ts`,
        `properties/${shop}.properties.ts`,
        `services/${shop}-shop.service.ts`,
        `services/${shop}-shop.service.spec.ts`,
        `styles/_${shop}-theme.scss`,
        `values/${shop}.values.ts`,
        `${shop}.component.ts`,
        `${shop}.component.scss`
      ];

      for (const relFile of expectedFiles) {
        const fullFile = path.join(shopBase, relFile);
        assert.ok(fs.existsSync(fullFile), `Shop "${shop}" must define modular file: ${relFile}`);
      }
    }
  });

  it('enforces Material You (--md-sys-color-*) SCSS theming with zero inline styles arrays or DOM style hacks', () => {
    const componentPaths = [
      'src/app/app.component.ts',
      'src/app/shops/sneakers/sneakers.component.ts',
      'src/app/shops/streetwear/streetwear.component.ts',
      'src/app/shops/collectibles/collectibles.component.ts'
    ];

    for (const relPath of componentPaths) {
      const src = fs.readFileSync(path.join(ROOT_DIR, relPath), 'utf8');
      assert.match(src, /styleUrl:\s*'\.\//, `${relPath} must use dedicated SCSS via styleUrl`);
      assert.equal(/\bstyles\s*:\s*\[/.test(src), false, `${relPath} must NOT contain inline styles`);
      assert.equal(/\[style\.--shop-/.test(src), false, `${relPath} must NOT use inline DOM style hacks`);
    }

    for (const shop of shops) {
      const scssSrc = fs.readFileSync(
        path.join(ROOT_DIR, `src/app/shops/${shop}/styles/_${shop}-theme.scss`),
        'utf8'
      );
      assert.match(scssSrc, /--md-sys-color-primary:/);
      assert.match(scssSrc, /--md-sys-color-surface-container-highest:/);
    }
  });

  it('validates Java-style .properties files and synchronization with TypeScript bundles', () => {
    const namespaces = [
      {
        name: 'shell',
        assetPath: 'src/assets/properties/shell.properties',
        tsPath: 'src/app/core/properties/shell.properties.ts',
        minKeys: 45
      },
      {
        name: 'sneakers',
        assetPath: 'src/assets/properties/sneakers.properties',
        tsPath: 'src/app/shops/sneakers/properties/sneakers.properties.ts',
        minKeys: 45
      },
      {
        name: 'streetwear',
        assetPath: 'src/assets/properties/streetwear.properties',
        tsPath: 'src/app/shops/streetwear/properties/streetwear.properties.ts',
        minKeys: 30
      },
      {
        name: 'collectibles',
        assetPath: 'src/assets/properties/collectibles.properties',
        tsPath: 'src/app/shops/collectibles/properties/collectibles.properties.ts',
        minKeys: 30
      }
    ];

    for (const ns of namespaces) {
      const assetRaw = fs.readFileSync(path.join(ROOT_DIR, ns.assetPath), 'utf8');
      const tsRaw = fs.readFileSync(path.join(ROOT_DIR, ns.tsPath), 'utf8');
      const assetMap = parseJavaProperties(assetRaw);
      const keys = Object.keys(assetMap);

      assert.ok(keys.length >= ns.minKeys, `${ns.name} must define >= ${ns.minKeys} keys`);
      for (const key of keys) {
        assert.ok(key.startsWith(`${ns.name}.`));
        assert.ok(tsRaw.includes(`${key}=`));
      }
    }
  });

  it('enforces Red Hat DDD strict static typing with zero loose "any" casts across src/app', () => {
    const tsFiles = collectTsFiles(path.join(ROOT_DIR, 'src/app'));
    assert.ok(tsFiles.length >= 25);

    for (const filePath of tsFiles) {
      const content = fs.readFileSync(filePath, 'utf8');
      const rel = path.relative(ROOT_DIR, filePath);
      assert.equal(/\bas\s+any\b/.test(content), false, `Forbidden "as any" in ${rel}`);
      assert.equal(/:\s*any\b/.test(content), false, `Forbidden ": any" in ${rel}`);
    }
  });
});

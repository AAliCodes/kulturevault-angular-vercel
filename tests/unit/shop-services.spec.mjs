import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { buildSync } from 'esbuild';

const ROOT_DIR = process.cwd();
const ENTRY_POINT = path.join(ROOT_DIR, 'src/app/core/testing/all-service-specs.ts');

test('Angular Shop & Core Services Unit Test Suites (*.service.spec.ts)', async (t) => {
  const buildResult = buildSync({
    entryPoints: [ENTRY_POINT],
    bundle: true,
    write: false,
    format: 'esm',
    platform: 'node',
    target: 'es2022',
    loader: { '.json': 'json' }
  });

  assert.equal(buildResult.errors.length, 0, 'Service spec bundle must compile with zero errors');
  const bundledCode = buildResult.outputFiles[0].text;
  const dataUrl = `data:text/javascript;base64,${Buffer.from(bundledCode, 'utf8').toString('base64')}`;

  const specModule = await import(dataUrl);
  const registeredTests = specModule.getRegisteredShopTests();

  assert.ok(
    registeredTests.length >= 18,
    `Expected at least 18 registered service unit tests across 8 *.service.spec.ts files, found ${registeredTests.length}`
  );

  for (const testCase of registeredTests) {
    await t.test(`${testCase.suiteName} -> ${testCase.testName}`, async () => {
      await testCase.fn();
    });
  }
});

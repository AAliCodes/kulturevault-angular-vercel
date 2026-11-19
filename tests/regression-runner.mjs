#!/usr/bin/env node
/**
 * KULTUREVAULT Exchange — Automated Regression Test Runner
 */

import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const SUITES = [
  {
    name: 'Unit Tests: Catalog Schema & 30% Commercial Unit Economics',
    cmd: 'node',
    args: ['--test', 'tests/unit/catalog.spec.mjs']
  },
  {
    name: 'Unit Tests: Multi-LOB Domain Purity (Sneakers, Streetwear, Collectibles)',
    cmd: 'node',
    args: ['--test', 'tests/unit/lob-architecture.spec.mjs']
  },
  {
    name: 'Unit Tests: Multi-Shop Modular Architecture, M3 SCSS & Properties',
    cmd: 'node',
    args: ['--test', 'tests/unit/lob-shops.spec.mjs']
  },
  {
    name: 'Unit Tests: Co-located Angular Shop & Core Services (*.service.spec.ts)',
    cmd: 'node',
    args: ['--test', 'tests/unit/shop-services.spec.mjs']
  },
  {
    name: 'Unit Tests: Serverless API Contracts (Checkout, Inventory, Webhooks)',
    cmd: 'node',
    args: [
      '--test',
      'tests/unit/checkout-api.spec.mjs',
      'tests/unit/inventory-api.spec.mjs',
      'tests/unit/webhooks-api.spec.mjs'
    ]
  },
  {
    name: 'Advertising & Catalog Feeds: Google Merchant Center & Meta Commerce',
    cmd: 'node',
    args: ['--test', 'tests/unit/ad-feeds.spec.mjs']
  },
  {
    name: 'UI Automation: Headless Chromium Storefront, Size Matrix & Cart Flows',
    cmd: 'node',
    args: ['--test', 'tests/e2e/storefront-flows.spec.mjs']
  }
];

async function runCommand(suite) {
  const start = Date.now();
  return new Promise((resolve) => {
    const proc = spawn(suite.cmd, suite.args, {
      cwd: ROOT_DIR,
      stdio: ['ignore', 'pipe', 'pipe'],
      env: process.env
    });

    let stdout = '';
    let stderr = '';

    proc.stdout.on('data', (d) => {
      stdout += d.toString();
    });
    proc.stderr.on('data', (d) => {
      stderr += d.toString();
    });

    proc.on('close', (code) => {
      resolve({
        name: suite.name,
        code,
        passed: code === 0,
        durationMs: Date.now() - start,
        stdout,
        stderr
      });
    });
  });
}

async function main() {
  console.log('===================================================================');
  console.log(' KULTUREVAULT Exchange — Automated Regression Suite');
  console.log(` Timestamp: ${new Date().toISOString()}`);
  console.log('===================================================================\n');

  const results = [];
  let allPassed = true;

  for (const suite of SUITES) {
    process.stdout.write(`• Running: ${suite.name} ... `);
    const result = await runCommand(suite);
    results.push(result);

    if (result.passed) {
      console.log(`\x1b[32mPASSED\x1b[0m (${result.durationMs}ms)`);
    } else {
      console.log(`\x1b[31mFAILED\x1b[0m (${result.durationMs}ms)`);
      allPassed = false;
      if (result.stderr) console.error(result.stderr);
      if (result.stdout) console.log(result.stdout);
    }
  }

  console.log('\n===================================================================');
  console.log(' Regression Summary Report');
  console.log('===================================================================');
  let totalTime = 0;
  for (const r of results) {
    totalTime += r.durationMs;
    const badge = r.passed ? '\x1b[32m[PASS]\x1b[0m' : '\x1b[31m[FAIL]\x1b[0m';
    console.log(`${badge} ${r.name.padEnd(65)} (${r.durationMs}ms)`);
  }
  console.log('-------------------------------------------------------------------');
  console.log(`Total Execution Time : ${(totalTime / 1000).toFixed(2)}s`);
  console.log(`Total Test Suites    : ${results.length}`);
  console.log(`Passed Suites        : ${results.filter((r) => r.passed).length}`);
  console.log(`Failed Suites        : ${results.filter((r) => !r.passed).length}`);
  console.log('===================================================================');

  if (!allPassed) {
    process.exit(1);
  }
  console.log('\x1b[32mAll regression tests passed successfully with zero failures.\x1b[0m\n');
  process.exit(0);
}

main().catch((err) => {
  console.error('Fatal regression runner error:', err);
  process.exit(1);
});

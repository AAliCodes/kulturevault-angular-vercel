import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer-core';
import { createStoreServer } from '../../server.mjs';

const TEST_PORT = 4220;
const BASE_URL = `http://127.0.0.1:${TEST_PORT}`;
const CHROMIUM_PATH = process.env.CHROMIUM_PATH || '/usr/bin/chromium';
const ARTIFACT_DIR =
  '/home/eem/.gemini/antigravity-cli/brain/d121f8fe-1862-46e6-bcfd-6f930a8d30cb';

function saveScreenshotIfDirExists(page, filename) {
  if (fs.existsSync(ARTIFACT_DIR)) {
    return page.screenshot({ path: path.join(ARTIFACT_DIR, filename), fullPage: false });
  }
  return Promise.resolve();
}

test('KULTUREVAULT Exchange E2E Headless Chromium Storefront & Cart Flows', async (t) => {
  let server;
  let browser;
  let page;

  await t.test('pre-flight: start application server and launch headless Chromium', async () => {
    server = createStoreServer();
    await new Promise((resolve) => server.listen(TEST_PORT, '127.0.0.1', resolve));

    browser = await puppeteer.launch({
      executablePath: CHROMIUM_PATH,
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--disable-dev-shm-usage']
    });

    page = await browser.newPage();
    await page.setViewport({ width: 1400, height: 920 });
  });

  await t.test('Flow 1: Sneakers Exchange (/sneakers) M3 Emerald dark theme & 20 deadstock grails', async () => {
    const response = await page.goto(BASE_URL, { waitUntil: 'networkidle0', timeout: 15000 });
    assert.strictEqual(response.status(), 200, 'Storefront should load with 200 OK');

    const shopThemeAttr = await page.$eval('html', (el) => el.getAttribute('data-shop-theme'));
    assert.strictEqual(shopThemeAttr, 'sneakers', 'Document root must activate data-shop-theme="sneakers"');

    const heroTitle = await page.$eval('.hero-title', (el) => el.textContent.trim());
    assert.ok(
      heroTitle.includes('Verified Deadstock Sneakers'),
      `Expected sneakers exchange hero headline, got: "${heroTitle}"`
    );

    const productCards = await page.$$('.sneaker-card');
    assert.strictEqual(productCards.length, 20, `Expected 20 deadstock sneaker cards, found ${productCards.length}`);

    await saveScreenshotIfDirExists(page, 'kulturevault_sneakers_m3.png');
  });

  await t.test('Flow 2: Grail House filtering (Jordan & Off-White) and Live Order Book Table view', async () => {
    // Filter by Off-White chip
    await page.evaluate(() => {
      const chips = Array.from(document.querySelectorAll('.vendor-chip'));
      const owChip = chips.find((c) => c.textContent.trim() === 'Off-White');
      if (owChip) owChip.click();
    });
    await new Promise((r) => setTimeout(r, 250));

    const owCount = await page.$$eval('.sneaker-card', (cards) => cards.length);
    assert.strictEqual(owCount, 5, `Expected 5 Off-White sneaker grails, found ${owCount}`);

    // Reset to All Houses and switch to Live Order Book Table view
    await page.evaluate(() => {
      const chips = Array.from(document.querySelectorAll('.vendor-chip'));
      if (chips[0]) chips[0].click();
      const viewBtns = Array.from(document.querySelectorAll('.view-btn'));
      if (viewBtns[1]) viewBtns[1].click();
    });
    await new Promise((r) => setTimeout(r, 250));

    const orderBookRows = await page.$$eval('.b2b-spec-table tbody tr', (rows) => rows.length);
    assert.strictEqual(orderBookRows, 20, `Expected 20 rows in Live Order Book Table, found ${orderBookRows}`);

    await saveScreenshotIfDirExists(page, 'kulturevault_orderbook_table.png');

    // Switch back to Exchange Cards view
    await page.evaluate(() => {
      const viewBtns = Array.from(document.querySelectorAll('.view-btn'));
      if (viewBtns[0]) viewBtns[0].click();
    });
    await new Promise((r) => setTimeout(r, 250));
  });

  await t.test('Flow 3: US/UK Size Matrix price reactivity, Add to Vault Bag, Drawer & Checkout Session', async () => {
    // Click US 8 size pill (1st button) vs US 12 size pill (5th button) on first sneaker card
    await page.evaluate(() => {
      const sizeBtn1 = document.querySelector('.sneaker-card .size-pill-btn:nth-child(1)');
      if (sizeBtn1) sizeBtn1.click();
    });
    await new Promise((r) => setTimeout(r, 200));
    const priceUs8 = await page.$eval('.sneaker-card .current-price', (el) => el.textContent.trim());

    await page.evaluate(() => {
      const sizeBtn5 = document.querySelector('.sneaker-card .size-pill-btn:nth-child(5)');
      if (sizeBtn5) sizeBtn5.click();
    });
    await new Promise((r) => setTimeout(r, 200));
    const priceUs12 = await page.$eval('.sneaker-card .current-price', (el) => el.textContent.trim());

    assert.notStrictEqual(priceUs8, priceUs12, 'US 8 deadstock price must differ from US 12 price');

    // Click "Buy Deadstock Now" on first product
    await page.evaluate(() => {
      const addBtn = document.querySelector('.sneaker-card .btn-primary.add-btn');
      if (addBtn) addBtn.click();
    });
    await new Promise((r) => setTimeout(r, 300));

    const toast = await page.$('.mat-snackbar');
    assert.ok(toast, 'Material snackbar notification should appear upon adding sneaker');

    // Open Vault Bag Drawer
    await page.evaluate(() => {
      const trigger = document.querySelector('.cart-trigger-btn');
      if (trigger) trigger.click();
    });
    await new Promise((r) => setTimeout(r, 350));

    const isDrawerOpen = await page.$eval('.cart-drawer', (el) => el.classList.contains('open'));
    assert.strictEqual(isDrawerOpen, true, 'Vault bag drawer must open');

    // Initiate PayGate checkout session to verify live session summary card
    await page.evaluate(() => {
      const checkoutBtn = document.querySelector('.checkout-btn');
      if (checkoutBtn) checkoutBtn.click();
    });
    await new Promise((r) => setTimeout(r, 350));

    const sessionOverlay = await page.$('.checkout-session-card');
    assert.ok(sessionOverlay, 'Checkout session confirmation card should render');

    await saveScreenshotIfDirExists(page, 'kulturevault_cart_checkout.png');

    // Close session overlay and drawer
    await page.evaluate(() => {
      const closeSession = document.querySelector('.close-session-btn');
      if (closeSession) closeSession.click();
      const closeDrawer = document.querySelector('.drawer-close-btn');
      if (closeDrawer) closeDrawer.click();
    });
    await new Promise((r) => setTimeout(r, 250));
  });

  await t.test('Flow 4: Streetwear Archive (/streetwear) Supreme Crimson & Off-White Chalk M3 light theme', async () => {
    await page.goto(`${BASE_URL}/streetwear`, { waitUntil: 'networkidle0', timeout: 15000 });

    const shopThemeAttr = await page.$eval('html', (el) => el.getAttribute('data-shop-theme'));
    assert.strictEqual(shopThemeAttr, 'streetwear', 'Document root must activate data-shop-theme="streetwear"');

    const cardsCount = await page.$$eval('.streetwear-card', (cards) => cards.length);
    assert.strictEqual(cardsCount, 16, `Expected 16 streetwear cards, found ${cardsCount}`);

    const savingsBadge = await page.$eval('.savings-amount-pill', (el) => el.textContent.trim());
    assert.ok(
      savingsBadge.includes('Save R') && savingsBadge.includes('/ unit'),
      `Expected collector bid ZAR savings pill, got: "${savingsBadge}"`
    );

    await saveScreenshotIfDirExists(page, 'kulturevault_streetwear_m3.png');
  });

  await t.test('Flow 5: Collectibles & Art Vault (/collectibles) Tokyo Gallery Amber M3 dark theme', async () => {
    await page.goto(`${BASE_URL}/collectibles`, { waitUntil: 'networkidle0', timeout: 15000 });

    const shopThemeAttr = await page.$eval('html', (el) => el.getAttribute('data-shop-theme'));
    assert.strictEqual(shopThemeAttr, 'collectibles', 'Document root must activate data-shop-theme="collectibles"');

    const collectiblesCount = await page.$$eval('.collectible-card', (cards) => cards.length);
    assert.strictEqual(collectiblesCount, 14, `Expected 14 collectible cards, found ${collectiblesCount}`);

    await saveScreenshotIfDirExists(page, 'kulturevault_collectibles_m3.png');
  });

  await t.test('teardown: close browser and shutdown server', async () => {
    if (browser) await browser.close();
    if (server) await new Promise((resolve) => server.close(resolve));
  });
});

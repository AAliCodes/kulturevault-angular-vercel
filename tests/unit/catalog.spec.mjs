import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { loadCatalogSeed } from '../../api/shopify/_client.mjs';

describe('KULTUREVAULT Exchange — Catalog Schema & Commercial Unit Economics (30% Margin Invariant)', () => {
  const sneakers = loadCatalogSeed('sneakers');
  const streetwear = loadCatalogSeed('streetwear');
  const collectibles = loadCatalogSeed('collectibles');
  const allProducts = loadCatalogSeed('all');

  it('loads exact SKU counts across all three exchange verticals (20 Sneakers, 16 Streetwear, 14 Collectibles = 50 Total)', () => {
    assert.equal(sneakers.length, 20, 'Sneakers catalog must contain 20 deadstock SKUs');
    assert.equal(streetwear.length, 16, 'Streetwear catalog must contain 16 archival SKUs');
    assert.equal(collectibles.length, 14, 'Collectibles catalog must contain 14 vault SKUs');
    assert.equal(allProducts.length, 50, 'Total combined catalog must equal 50 SKUs');
  });

  it('enforces zero SKU ID or style code collisions across the entire holding', () => {
    const ids = new Set();
    const codes = new Set();
    for (const item of allProducts) {
      assert.equal(ids.has(item.id), false, `Duplicate SKU ID detected: ${item.id}`);
      assert.equal(codes.has(item.code), false, `Duplicate style code detected: ${item.code}`);
      ids.add(item.id);
      codes.add(item.code);
    }
  });

  it('enforces gross profit margin strictly between 25.00% and 35.00% (30.00% target) on every SKU', () => {
    for (const item of allProducts) {
      const retail = Number(item.benchmark_retail_price);
      const wholesale = Number(item.wholesale_cost);
      assert.ok(retail > 0, `${item.id} retail price must be > 0`);
      assert.ok(wholesale > 0 && wholesale < retail, `${item.id} wholesale cost must be < retail`);

      const grossMarginPct = Number((((retail - wholesale) / retail) * 100).toFixed(2));
      assert.ok(
        grossMarginPct >= 25.0 && grossMarginPct <= 35.0,
        `${item.id} margin ${grossMarginPct}% violates [25.00%, 35.00%] commercial bounds`
      );
      assert.ok(
        item.lowest_ask_zar >= item.highest_bid_zar,
        `${item.id} lowest_ask_zar must be >= highest_bid_zar`
      );
    }
  });

  it('validates multi-size US/UK deadstock quotes on all 20 sneaker SKUs', () => {
    for (const snk of sneakers) {
      assert.ok(Array.isArray(snk.size_matrix), `${snk.id} must define size_matrix array`);
      assert.equal(snk.size_matrix.length, 5, `${snk.id} must provide 5 US/UK size quotes`);
      for (const quote of snk.size_matrix) {
        assert.ok(quote.sizeUs.startsWith('US '), `${snk.id} sizeUs must be US size`);
        assert.ok(quote.sizeUk.startsWith('UK '), `${snk.id} sizeUk must be UK size`);
        assert.ok(quote.lowestAskZar > quote.highestBidZar, `${snk.id} ask must exceed bid`);
      }
    }
  });
});

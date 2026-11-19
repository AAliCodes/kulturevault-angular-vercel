import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import inventoryHandler from '../../api/shopify/inventory.mjs';

function createMockRes() {
  return {
    statusCode: 200,
    payload: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      this.payload = data;
      return this;
    }
  };
}

describe('Serverless Inventory API Contracts (/api/shopify/inventory)', () => {
  it('returns LOB-scoped deadstock inventory with lowestAskZar and highestBidZar quotes', async () => {
    const res = createMockRes();
    await inventoryHandler({ method: 'GET', query: { lob: 'sneakers' } }, res);
    assert.equal(res.statusCode, 200);
    assert.equal(res.payload.items.length, 20);
    assert.ok(res.payload.items[0].lowestAskZar > 0);
  });
});

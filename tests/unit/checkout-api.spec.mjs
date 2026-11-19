import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import checkoutHandler from '../../api/shopify/checkout.mjs';

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

describe('Serverless Checkout API Contracts (/api/shopify/checkout)', () => {
  it('rejects non-POST requests and empty cart payloads', async () => {
    const res405 = createMockRes();
    await checkoutHandler({ method: 'GET' }, res405);
    assert.equal(res405.statusCode, 405);

    const res400 = createMockRes();
    await checkoutHandler({ method: 'POST', body: { items: [] } }, res400);
    assert.equal(res400.statusCode, 400);
  });

  it('auto-detects sneakers, streetwear, and collectibles LOBs and prefixes order references', async () => {
    const resSnk = createMockRes();
    await checkoutHandler(
      {
        method: 'POST',
        body: {
          gateway: 'paygate',
          subtotalPrice: 8900,
          deliveryFee: 0,
          items: [
            {
              sku: 'DZ5485-612',
              title: 'Air Jordan 1 Retro High OG Chicago Lost & Found',
              optionSelection: 'US 9 / UK 8',
              quantity: 1,
              unitPrice: 8900
            }
          ]
        }
      },
      resSnk
    );
    assert.equal(resSnk.statusCode, 200);
    assert.equal(resSnk.payload.lob, 'sneakers');
    assert.match(resSnk.payload.reference, /^KLT-SNK-/);

    const resStr = createMockRes();
    await checkoutHandler(
      {
        method: 'POST',
        body: {
          gateway: 'ozow',
          subtotalPrice: 9200,
          deliveryFee: 0,
          items: [
            {
              sku: 'SUP-FW23-BOGO-GRY',
              title: 'Supreme Box Logo Hooded Sweatshirt',
              optionSelection: 'Size L',
              quantity: 1,
              unitPrice: 9200
            }
          ]
        }
      },
      resStr
    );
    assert.equal(resStr.statusCode, 200);
    assert.equal(resStr.payload.lob, 'streetwear');
    assert.match(resStr.payload.reference, /^KLT-STR-/);

    const resCol = createMockRes();
    await checkoutHandler(
      {
        method: 'POST',
        body: {
          gateway: 'paygate',
          subtotalPrice: 16500,
          deliveryFee: 0,
          items: [
            {
              sku: 'MED-BRK-BASQ-1000',
              title: 'Medicom Toy BE@RBRICK Basquiat 1000%',
              quantity: 1,
              unitPrice: 16500
            }
          ]
        }
      },
      resCol
    );
    assert.equal(resCol.statusCode, 200);
    assert.equal(resCol.payload.lob, 'collectibles');
    assert.match(resCol.payload.reference, /^KLT-COL-/);
  });
});

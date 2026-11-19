import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import webhooksHandler from '../../api/shopify/webhooks.mjs';
import { verifyShopifyWebhookHmac } from '../../api/shopify/_client.mjs';

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

describe('Shopify Webhook HMAC Security & Handler (/api/shopify/webhooks)', () => {
  it('verifies timing-safe SHA256 HMAC signatures accurately', () => {
    process.env.SHOPIFY_WEBHOOK_SECRET = 'kulturevault-test-whsec';
    const body = JSON.stringify({ id: 99182, status: 'paid' });
    const validHmac = crypto
      .createHmac('sha256', 'kulturevault-test-whsec')
      .update(body, 'utf8')
      .digest('base64');

    assert.equal(verifyShopifyWebhookHmac(body, validHmac), true);
    assert.equal(verifyShopifyWebhookHmac(body, 'invalid-hmac'), false);
  });

  it('rejects forged webhook requests with 401 Unauthorized', async () => {
    process.env.SHOPIFY_WEBHOOK_SECRET = 'kulturevault-test-whsec';
    const res = createMockRes();
    await webhooksHandler(
      {
        method: 'POST',
        headers: {
          'x-shopify-topic': 'orders/paid',
          'x-shopify-hmac-sha256': 'forged-signature'
        },
        body: { id: 1001 }
      },
      res
    );
    assert.equal(res.statusCode, 401);
  });
});

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import googleFeedHandler from '../../api/feeds/google.mjs';
import metaFeedHandler from '../../api/feeds/meta.mjs';

function createMockFeedRes() {
  return {
    statusCode: 200,
    headers: {},
    body: '',
    status(code) {
      this.statusCode = code;
      return this;
    },
    setHeader(k, v) {
      this.headers[k] = v;
      return this;
    },
    send(content) {
      this.body = content;
      return this;
    },
    json(data) {
      this.body = JSON.stringify(data);
      return this;
    }
  };
}

describe('Google Merchant Center & Meta Commerce Advertising Feeds (/api/feeds/*)', () => {
  it('generates valid Google Merchant RSS 2.0 XML for all 50 KULTUREVAULT SKUs', async () => {
    const res = createMockFeedRes();
    await googleFeedHandler({ method: 'GET', query: { lob: 'all' } }, res);
    assert.equal(res.statusCode, 200);
    assert.match(res.headers['Content-Type'], /application\/xml/);
    assert.match(res.body, /<g:id>SKU-SNK-001<\/g:id>/);
    assert.match(res.body, /<g:id>SKU-STR-001<\/g:id>/);
    assert.match(res.body, /<g:id>SKU-COL-001<\/g:id>/);
  });

  it('generates valid Meta Commerce CSV catalog partitioned by LOB', async () => {
    const res = createMockFeedRes();
    await metaFeedHandler({ method: 'GET', query: { lob: 'sneakers', format: 'csv' } }, res);
    assert.equal(res.statusCode, 200);
    assert.match(res.headers['Content-Type'], /text\/csv/);
    const lines = res.body.trim().split('\n');
    assert.equal(lines.length, 21, '1 header row + 20 sneaker rows');
  });
});

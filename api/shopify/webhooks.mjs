import { getShopifyConfig, verifyShopifyWebhookHmac } from './_client.mjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const topic = req.headers['x-shopify-topic'] || 'unknown';
  const shopDomain = req.headers['x-shopify-shop-domain'] || 'unknown';
  const hmacHeader = req.headers['x-shopify-hmac-sha256'] || '';

  const rawBody =
    typeof req.body === 'string' ? req.body : JSON.stringify(req.body || {});

  const config = getShopifyConfig();
  if (config.webhookSecret && hmacHeader) {
    const valid = verifyShopifyWebhookHmac(rawBody, hmacHeader);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid Shopify webhook HMAC signature' });
    }
  }

  return res.status(200).json({
    received: true,
    topic,
    shopDomain,
    timestamp: new Date().toISOString()
  });
}

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

export function loadLocalEnv() {
  try {
    const envPath = path.resolve(process.cwd(), '.env');
    if (!fs.existsSync(envPath)) return;
    const raw = fs.readFileSync(envPath, 'utf8');
    for (const line of raw.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx === -1) continue;
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim().replace(/^['"]|['"]$/g, '');
      if (!process.env[key]) {
        process.env[key] = val;
      }
    }
  } catch {
    // Ignore fs errors in serverless runtime
  }
}

export function getShopifyConfig() {
  loadLocalEnv();
  const rawDomain = (process.env.SHOPIFY_STORE_DOMAIN || '').trim();
  const domain = rawDomain.replace(/^https?:\/\//, '').replace(/\/+$/, '');
  const adminToken = (process.env.SHOPIFY_ADMIN_ACCESS_TOKEN || '').trim();
  const storefrontToken = (process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN || '').trim();
  const apiVersion = (process.env.SHOPIFY_API_VERSION || '2024-10').trim();
  const webhookSecret = (process.env.SHOPIFY_WEBHOOK_SECRET || '').trim();
  const adminSyncKey = (process.env.ADMIN_SYNC_API_KEY || '').trim();

  const isPlaceholder = (val) =>
    !val ||
    val.includes('xxxxxxxx') ||
    val === 'kulturevault-exchange-dev.myshopify.com';

  return {
    domain,
    adminToken,
    storefrontToken,
    apiVersion,
    webhookSecret,
    adminSyncKey,
    hasAdminConfig: Boolean(domain && adminToken && !isPlaceholder(adminToken)),
    hasStorefrontConfig: Boolean(domain && storefrontToken && !isPlaceholder(storefrontToken))
  };
}

export async function shopifyAdminGraphQL(query, variables = {}) {
  const { domain, adminToken, apiVersion, hasAdminConfig } = getShopifyConfig();
  if (!hasAdminConfig) {
    throw new Error(
      'Shopify Admin API is not configured. Set SHOPIFY_STORE_DOMAIN and SHOPIFY_ADMIN_ACCESS_TOKEN in .env'
    );
  }

  const endpoint = `https://${domain}/admin/api/${apiVersion}/graphql.json`;
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': adminToken
    },
    body: JSON.stringify({ query, variables })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Shopify Admin API HTTP ${response.status}: ${text}`);
  }

  const payload = await response.json();
  if (payload.errors && payload.errors.length > 0) {
    throw new Error(`Shopify Admin GraphQL Error: ${JSON.stringify(payload.errors)}`);
  }

  return payload.data;
}

export async function shopifyStorefrontGraphQL(query, variables = {}) {
  const { domain, storefrontToken, apiVersion, hasStorefrontConfig } = getShopifyConfig();
  if (!hasStorefrontConfig) {
    throw new Error(
      'Shopify Storefront API is not configured. Set SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_ACCESS_TOKEN in .env'
    );
  }

  const endpoint = `https://${domain}/api/${apiVersion}/graphql.json`;
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': storefrontToken
    },
    body: JSON.stringify({ query, variables })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Shopify Storefront API HTTP ${response.status}: ${text}`);
  }

  const payload = await response.json();
  if (payload.errors && payload.errors.length > 0) {
    throw new Error(`Shopify Storefront GraphQL Error: ${JSON.stringify(payload.errors)}`);
  }

  return payload.data;
}

export function verifyShopifyWebhookHmac(rawBody, hmacHeader) {
  const { webhookSecret } = getShopifyConfig();
  if (!webhookSecret || !hmacHeader) return false;

  const digest = crypto
    .createHmac('sha256', webhookSecret)
    .update(rawBody, 'utf8')
    .digest('base64');

  try {
    return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(hmacHeader));
  } catch {
    return false;
  }
}

export function loadCatalogSeed(lob = 'sneakers') {
  const normalizedLob = (lob || 'sneakers').toLowerCase();

  const getSeedFiles = (targetLob) => {
    if (targetLob === 'streetwear' || targetLob === 'apparel') {
      return [
        'src/assets/kulturevault-streetwear-seed.json',
        'kulturevault-streetwear-seed.json'
      ];
    }
    if (targetLob === 'collectibles' || targetLob === 'vault') {
      return [
        'src/assets/kulturevault-collectibles-seed.json',
        'kulturevault-collectibles-seed.json'
      ];
    }
    return [
      'src/assets/kulturevault-sneakers-seed.json',
      'kulturevault-sneakers-seed.json'
    ];
  };

  const loadFromFiles = (files) => {
    for (const file of files) {
      const fullPath = path.resolve(process.cwd(), file);
      if (fs.existsSync(fullPath)) {
        return JSON.parse(fs.readFileSync(fullPath, 'utf8'));
      }
    }
    return [];
  };

  if (normalizedLob === 'all') {
    const sneakers = loadFromFiles(getSeedFiles('sneakers'));
    const streetwear = loadFromFiles(getSeedFiles('streetwear'));
    const collectibles = loadFromFiles(getSeedFiles('collectibles'));
    return [...sneakers, ...streetwear, ...collectibles];
  }

  return loadFromFiles(getSeedFiles(normalizedLob));
}

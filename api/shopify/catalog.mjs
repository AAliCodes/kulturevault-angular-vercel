import {
  getShopifyConfig,
  loadCatalogSeed,
  shopifyAdminGraphQL,
  shopifyStorefrontGraphQL
} from './_client.mjs';

const ADMIN_CATALOG_QUERY = `
  query GetAdminCatalog($first: Int = 100, $query: String) {
    products(first: $first, query: $query) {
      nodes {
        id
        handle
        title
        description
        productType
        status
        tags
        totalInventory
        variants(first: 10) {
          nodes {
            id
            sku
            title
            price
            inventoryQuantity
            availableForSale
          }
        }
      }
    }
  }
`;

const STOREFRONT_CATALOG_QUERY = `
  query GetStorefrontCatalog($first: Int = 100, $query: String) {
    products(first: $first, query: $query) {
      edges {
        node {
          id
          handle
          title
          description
          productType
          availableForSale
          tags
          variants(first: 10) {
            edges {
              node {
                id
                sku
                title
                availableForSale
                quantityAvailable
                price {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
    }
  }
`;

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const lob = (req.query?.lob || req.query?.division || 'sneakers').toLowerCase();
  const seedCatalog = loadCatalogSeed(lob).filter((item) => item.is_active);
  const config = getShopifyConfig();

  let tagQuery = 'tag:kulturevault-sneakers OR tag:lob:sneakers';
  if (lob === 'streetwear' || lob === 'apparel') {
    tagQuery = 'tag:kulturevault-streetwear OR tag:lob:streetwear';
  } else if (lob === 'collectibles' || lob === 'vault') {
    tagQuery = 'tag:kulturevault-collectibles OR tag:lob:collectibles';
  } else if (lob === 'all') {
    tagQuery = 'tag:kulturevault-* OR tag:lob:*';
  }

  try {
    if (config.hasAdminConfig) {
      const data = await shopifyAdminGraphQL(ADMIN_CATALOG_QUERY, { first: 100, query: tagQuery });
      const nodes = data?.products?.nodes || [];
      if (nodes.length > 0) {
        return res.status(200).json({
          source: 'shopify-live',
          lob,
          configured: true,
          storeDomain: config.domain,
          count: seedCatalog.length,
          products: seedCatalog
        });
      }
    }

    if (config.hasStorefrontConfig) {
      const data = await shopifyStorefrontGraphQL(STOREFRONT_CATALOG_QUERY, { first: 100, query: tagQuery });
      const edges = data?.products?.edges || [];
      if (edges.length > 0) {
        return res.status(200).json({
          source: 'shopify-live',
          lob,
          configured: true,
          storeDomain: config.domain,
          count: seedCatalog.length,
          products: seedCatalog
        });
      }
    }
  } catch (err) {
    console.warn('[Shopify Catalog Fallback]:', err.message || err);
  }

  return res.status(200).json({
    source: 'seed-fallback',
    lob,
    configured: false,
    count: seedCatalog.length,
    products: seedCatalog.map((item) => ({
      ...item,
      benchmark_retail_price: Number(item.benchmark_retail_price),
      availableForSale: item.stock_qty > 0
    }))
  });
}

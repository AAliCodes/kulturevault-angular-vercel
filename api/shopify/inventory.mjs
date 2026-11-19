import {
  getShopifyConfig,
  loadCatalogSeed,
  shopifyAdminGraphQL
} from './_client.mjs';

const SET_INVENTORY_MUTATION = `
  mutation UpdateInventoryOnHand($input: InventorySetQuantitiesInput!) {
    inventorySetQuantities(input: $input) {
      inventoryAdjustmentGroup {
        reason
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export default async function handler(req, res) {
  const config = getShopifyConfig();
  const lob = (req.query?.lob || req.query?.division || 'sneakers').toLowerCase();

  if (req.method === 'GET') {
    const seed = loadCatalogSeed(lob).filter((i) => i.is_active);
    return res.status(200).json({
      source: config.hasAdminConfig ? 'shopify-live' : 'seed-fallback',
      lob,
      configured: config.hasAdminConfig,
      items: seed.map((i) => ({
        id: i.id,
        code: i.code,
        title: i.title,
        lowestAskZar: i.lowest_ask_zar,
        highestBidZar: i.highest_bid_zar,
        stockQty: i.stock_qty
      }))
    });
  }

  if (req.method === 'POST') {
    const providedKey = req.headers['x-admin-api-key'];
    if (config.adminSyncKey && providedKey !== config.adminSyncKey) {
      return res.status(401).json({ error: 'Unauthorized: invalid x-admin-api-key' });
    }

    if (!config.hasAdminConfig) {
      return res.status(400).json({
        error: 'Shopify Admin API credentials not configured in .env'
      });
    }

    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
    const { inventoryItemId, locationId, quantity } = body;

    if (!inventoryItemId || !locationId || typeof quantity !== 'number') {
      return res.status(400).json({
        error: 'Required fields: inventoryItemId, locationId, quantity (number)'
      });
    }

    try {
      const result = await shopifyAdminGraphQL(SET_INVENTORY_MUTATION, {
        input: {
          name: 'available',
          reason: 'correction',
          ignoreCompareQuantity: true,
          quantities: [
            {
              inventoryItemId,
              locationId,
              quantity: Math.max(0, Math.floor(quantity))
            }
          ]
        }
      });

      const userErrors = result?.inventorySetQuantities?.userErrors || [];
      if (userErrors.length > 0) {
        return res.status(400).json({ error: userErrors });
      }

      return res.status(200).json({
        updated: true,
        inventoryItemId,
        locationId,
        quantity
      });
    } catch (err) {
      return res.status(500).json({ error: err.message || 'Inventory update failed' });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}

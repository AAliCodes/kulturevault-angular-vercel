import {
  getShopifyConfig,
  shopifyAdminGraphQL,
  shopifyStorefrontGraphQL
} from './_client.mjs';

const STOREFRONT_CART_CREATE_MUTATION = `
  mutation CreateKultureVaultCart($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
        totalQuantity
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const ADMIN_DRAFT_ORDER_CREATE_MUTATION = `
  mutation CreateKultureVaultDraftOrder($input: DraftOrderInput!) {
    draftOrderCreate(input: $input) {
      draftOrder {
        id
        name
        invoiceUrl
        status
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
  const { gateway = 'paygate', reference, items = [], subtotalPrice = 0, deliveryFee = 0 } = body;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Cart items array is required' });
  }

  const detectedLob =
    body.lob ||
    (items.some((i) => i.product?.id?.startsWith('SKU-STR-') || i.sku?.startsWith('SUP-') || i.sku?.startsWith('OFF-') || i.sku?.startsWith('STU-'))
      ? 'streetwear'
      : items.some((i) => i.product?.id?.startsWith('SKU-COL-') || i.sku?.startsWith('MED-') || i.sku?.startsWith('KAWS-') || i.sku?.startsWith('VLT-'))
      ? 'collectibles'
      : 'sneakers');

  const isStreetwear = detectedLob === 'streetwear';
  const isCollectibles = detectedLob === 'collectibles';
  const hasMarketBid = Boolean(
    body.hasMarketBid || items.some((i) => i.orderType === 'place_bid')
  );
  const prefix = isCollectibles ? 'KLT-COL' : isStreetwear ? 'KLT-STR' : 'KLT-SNK';
  const orderRef = reference || `${prefix}-${Date.now().toString().slice(-6)}`;
  const config = getShopifyConfig();

  const shippingTitle =
    Number(deliveryFee) === 0
      ? isCollectibles
        ? 'Complimentary Double-Boxed Art Crate Courier (Orders over R 12,000)'
        : 'Complimentary Armored Deadstock Courier (Orders over R 5,000)'
      : isCollectibles
      ? 'Double-Boxed Foam Art & Vault Crate Freight'
      : 'Armored Deadstock & Lab Authentication Courier';

  try {
    const allHaveVariantGid = items.every(
      (i) => typeof i.variantId === 'string' && i.variantId.startsWith('gid://shopify/ProductVariant/')
    );

    if (gateway === 'shopify' && config.hasStorefrontConfig && allHaveVariantGid) {
      const cartInput = {
        lines: items.map((item) => ({
          merchandiseId: item.variantId,
          quantity: Number(item.quantity)
        })),
        attributes: [
          { key: 'Order_Reference', value: orderRef },
          { key: 'Line_Of_Business', value: `KULTUREVAULT // ${detectedLob.toUpperCase()}` },
          { key: 'Payment_Policy', value: 'Enforced Immediate Settlement' }
        ],
        note: `KULTUREVAULT Exchange Order ${orderRef} (${detectedLob.toUpperCase()})`
      };

      const data = await shopifyStorefrontGraphQL(STOREFRONT_CART_CREATE_MUTATION, {
        input: cartInput
      });
      const cart = data?.cartCreate?.cart;
      if (cart) {
        return res.status(200).json({
          mode: 'shopify-live',
          gateway: 'shopify',
          lob: detectedLob,
          hasMarketBid,
          reference: orderRef,
          cartId: cart.id,
          checkoutUrl: cart.checkoutUrl
        });
      }
    }

    if (config.hasAdminConfig) {
      const draftOrderInput = {
        note: `KULTUREVAULT Exchange Order (${orderRef}) — LOB: ${detectedLob.toUpperCase()} | Gateway: ${gateway.toUpperCase()}`,
        tags: [
          `kulturevault-${detectedLob}`,
          `lob:${detectedLob}`,
          `gateway:${gateway}`,
          'payment:enforced-immediate',
          hasMarketBid ? 'trade_type:market-bid' : 'trade_type:buy-now-ask'
        ],
        shippingLine: {
          title: shippingTitle,
          priceWithCurrency: {
            amount: Number(deliveryFee).toFixed(2),
            currencyCode: 'ZAR'
          }
        },
        lineItems: items.map((item) => ({
          title: `${item.title} (${item.optionSelection || 'Deadstock'})`,
          quantity: Number(item.quantity),
          originalUnitPriceWithCurrency: {
            amount: Number(item.unitPrice).toFixed(2),
            currencyCode: 'ZAR'
          }
        }))
      };

      const data = await shopifyAdminGraphQL(ADMIN_DRAFT_ORDER_CREATE_MUTATION, {
        input: draftOrderInput
      });
      const draftOrder = data?.draftOrderCreate?.draftOrder;
      if (draftOrder) {
        return res.status(200).json({
          mode: 'shopify-live',
          gateway,
          lob: detectedLob,
          hasMarketBid,
          reference: orderRef,
          draftOrderId: draftOrder.id,
          draftOrderName: draftOrder.name,
          invoiceUrl: draftOrder.invoiceUrl,
          checkoutUrl: draftOrder.invoiceUrl
        });
      }
    }
  } catch (err) {
    console.warn('[Shopify Checkout Fallback]:', err.message || err);
  }

  return res.status(200).json({
    mode: 'seed-fallback',
    gateway,
    lob: detectedLob,
    hasMarketBid,
    reference: orderRef,
    shippingTitle,
    subtotalZar: Number(subtotalPrice).toFixed(2),
    deliveryFeeZar: Number(deliveryFee).toFixed(2),
    totalZar: (Number(subtotalPrice) + Number(deliveryFee)).toFixed(2),
    itemCount: items.reduce((s, i) => s + Number(i.quantity || 1), 0)
  });
}

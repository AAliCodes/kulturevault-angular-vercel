import { loadCatalogSeed } from '../shopify/_client.mjs';

export const DEFAULT_BASE_URL = process.env.APP_BASE_URL || 'https://kulturevault.co.za';

const FALLBACK_SNEAKER_IMG = 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1200&q=80';
const FALLBACK_STREETWEAR_IMG = 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1200&q=80';
const FALLBACK_COLLECTIBLE_IMG = 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=1200&q=80';

export function getGoogleProductCategory(item, lob) {
  if (lob === 'sneakers') {
    return 'Apparel & Accessories > Shoes';
  }
  if (lob === 'streetwear') {
    return 'Apparel & Accessories > Clothing';
  }
  return 'Arts & Entertainment > Hobbies & Creative Arts > Collectibles';
}

export function getFbProductCategory(item, lob) {
  if (lob === 'sneakers') {
    return 'clothing_accessories > shoes';
  }
  if (lob === 'streetwear') {
    return 'clothing_accessories > clothing';
  }
  return 'collectibles';
}

export function getProductUrl(item, lob, baseUrl = DEFAULT_BASE_URL) {
  const cleanBase = baseUrl.replace(/\/+$/, '');
  const lobPath = lob === 'streetwear' ? 'streetwear' : lob === 'collectibles' ? 'collectibles' : 'sneakers';
  return `${cleanBase}/${lobPath}#${item.id}`;
}

export function getProductImageUrl(item, lob) {
  if (lob === 'streetwear') return FALLBACK_STREETWEAR_IMG;
  if (lob === 'collectibles') return FALLBACK_COLLECTIBLE_IMG;
  return FALLBACK_SNEAKER_IMG;
}

export function expandFeedItems(rawItems, lob, baseUrl = DEFAULT_BASE_URL) {
  const feedItems = [];

  for (const item of rawItems) {
    if (!item.is_active) continue;

    const brand = item.brand || 'KULTUREVAULT';
    const googleCategory = getGoogleProductCategory(item, lob);
    const fbCategory = getFbProductCategory(item, lob);
    const productUrl = getProductUrl(item, lob, baseUrl);
    const imageUrl = getProductImageUrl(item, lob);
    const price = Number(item.benchmark_retail_price || item.lowest_ask_zar || 0);

    feedItems.push({
      id: item.id,
      itemGroupId: item.id,
      title: item.title,
      description: `${item.description} Packaging: ${item.packaging}. Condition: ${item.shelf_life}.`,
      link: productUrl,
      imageLink: imageUrl,
      availability: item.stock_qty > 0 ? 'in_stock' : 'out_of_stock',
      price: `${price.toFixed(2)} ZAR`,
      brand,
      googleProductCategory: googleCategory,
      fbProductCategory: fbCategory,
      condition: 'new',
      lob,
      customLabel0: lob,
      customLabel1: item.tier ? `tier:${item.tier.toLowerCase()}` : 'retail',
      customLabel2:
        item.authentication_badge ||
        item.authenticity_verification ||
        item.hologram_seal ||
        'KULTUREVAULT Verified Deadstock',
      customLabel3: `Code: ${item.code}`,
      customLabel4: item.stock_qty > 5 ? 'in_stock_ready' : 'limited_vault_stock',
      shippingCountry: 'ZA',
      shippingService:
        lob === 'collectibles'
          ? 'Double-Boxed Art Crate Freight'
          : 'Armored Deadstock Courier',
      shippingPrice: lob === 'collectibles' ? '450.00 ZAR' : '250.00 ZAR'
    });
  }

  return feedItems;
}

function escapeXml(unsafe = '') {
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function buildGoogleMerchantXml(
  feedItems,
  title = 'KULTUREVAULT Master Deadstock Feed',
  baseUrl = DEFAULT_BASE_URL
) {
  const itemsXml = feedItems
    .map(
      (item) => `    <item>
      <g:id>${escapeXml(item.id)}</g:id>
      <g:item_group_id>${escapeXml(item.itemGroupId)}</g:item_group_id>
      <g:title>${escapeXml(item.title)}</g:title>
      <g:description>${escapeXml(item.description)}</g:description>
      <g:link>${escapeXml(item.link)}</g:link>
      <g:image_link>${escapeXml(item.imageLink)}</g:image_link>
      <g:brand>${escapeXml(item.brand)}</g:brand>
      <g:condition>${escapeXml(item.condition)}</g:condition>
      <g:availability>${escapeXml(item.availability)}</g:availability>
      <g:price>${escapeXml(item.price)}</g:price>
      <g:google_product_category>${escapeXml(item.googleProductCategory)}</g:google_product_category>
      <g:custom_label_0>${escapeXml(item.customLabel0)}</g:custom_label_0>
      <g:custom_label_1>${escapeXml(item.customLabel1)}</g:custom_label_1>
      <g:custom_label_2>${escapeXml(item.customLabel2)}</g:custom_label_2>
      <g:custom_label_3>${escapeXml(item.customLabel3)}</g:custom_label_3>
      <g:custom_label_4>${escapeXml(item.customLabel4)}</g:custom_label_4>
      <g:shipping>
        <g:country>${escapeXml(item.shippingCountry)}</g:country>
        <g:service>${escapeXml(item.shippingService)}</g:service>
        <g:price>${escapeXml(item.shippingPrice)}</g:price>
      </g:shipping>
      <g:identifier_exists>no</g:identifier_exists>
    </item>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>${escapeXml(title)}</title>
    <link>${escapeXml(baseUrl)}</link>
    <description>KULTUREVAULT Exchange official deadstock sneaker, streetwear and collectibles feed</description>
${itemsXml}
  </channel>
</rss>`;
}

export function buildMetaCommerceCsv(feedItems) {
  const headers = [
    'id',
    'title',
    'description',
    'availability',
    'condition',
    'price',
    'link',
    'image_link',
    'brand',
    'google_product_category',
    'fb_product_category',
    'custom_label_0',
    'custom_label_1',
    'custom_label_2',
    'custom_label_3',
    'custom_label_4'
  ];

  const escapeCsv = (val = '') => `"${String(val).replace(/"/g, '""')}"`;

  const rows = feedItems.map((item) =>
    [
      escapeCsv(item.id),
      escapeCsv(item.title),
      escapeCsv(item.description),
      escapeCsv(item.availability),
      escapeCsv(item.condition),
      escapeCsv(item.price),
      escapeCsv(item.link),
      escapeCsv(item.imageLink),
      escapeCsv(item.brand),
      escapeCsv(item.googleProductCategory),
      escapeCsv(item.fbProductCategory),
      escapeCsv(item.customLabel0),
      escapeCsv(item.customLabel1),
      escapeCsv(item.customLabel2),
      escapeCsv(item.customLabel3),
      escapeCsv(item.customLabel4)
    ].join(',')
  );

  return [headers.join(','), ...rows].join('\n');
}

export function getFeedData(lob = 'all', baseUrl = DEFAULT_BASE_URL) {
  const normalizedLob = (lob || 'all').toLowerCase();
  if (normalizedLob === 'all') {
    return [
      ...expandFeedItems(loadCatalogSeed('sneakers'), 'sneakers', baseUrl),
      ...expandFeedItems(loadCatalogSeed('streetwear'), 'streetwear', baseUrl),
      ...expandFeedItems(loadCatalogSeed('collectibles'), 'collectibles', baseUrl)
    ];
  }
  return expandFeedItems(loadCatalogSeed(normalizedLob), normalizedLob, baseUrl);
}

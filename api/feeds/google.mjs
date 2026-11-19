import {
  DEFAULT_BASE_URL,
  buildGoogleMerchantXml,
  getFeedData
} from './_builder.mjs';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const lob = (req.query?.lob || 'all').toLowerCase();
  const host = req.headers?.host ? `https://${req.headers.host}` : DEFAULT_BASE_URL;

  try {
    const feedItems = getFeedData(lob, host);
    const channelTitle = `KULTUREVAULT (${lob.toUpperCase()}) — Google Merchant Feed`;
    const xml = buildGoogleMerchantXml(feedItems, channelTitle, host);

    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    return res.status(200).send(xml);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to generate Google Merchant feed', message: err.message });
  }
}

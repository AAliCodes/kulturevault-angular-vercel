import {
  DEFAULT_BASE_URL,
  buildGoogleMerchantXml,
  buildMetaCommerceCsv,
  getFeedData
} from './_builder.mjs';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const lob = (req.query?.lob || 'all').toLowerCase();
  const format = (req.query?.format || 'csv').toLowerCase();
  const host = req.headers?.host ? `https://${req.headers.host}` : DEFAULT_BASE_URL;

  try {
    const feedItems = getFeedData(lob, host);

    if (format === 'xml') {
      const xml = buildGoogleMerchantXml(
        feedItems,
        `KULTUREVAULT (${lob.toUpperCase()}) — Meta Commerce Feed`,
        host
      );
      res.setHeader('Content-Type', 'application/xml; charset=utf-8');
      return res.status(200).send(xml);
    }

    const csv = buildMetaCommerceCsv(feedItems);
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `inline; filename="kulturevault-${lob}-catalog.csv"`);
    return res.status(200).send(csv);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to generate Meta Commerce feed', message: err.message });
  }
}

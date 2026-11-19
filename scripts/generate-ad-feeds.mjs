import fs from 'node:fs';
import path from 'node:path';
import {
  buildGoogleMerchantXml,
  buildMetaCommerceCsv,
  getFeedData
} from '../api/feeds/_builder.mjs';

const FEEDS_DIR = path.resolve(process.cwd(), 'src/assets/feeds');
fs.mkdirSync(FEEDS_DIR, { recursive: true });

for (const lob of ['all', 'sneakers', 'streetwear', 'collectibles']) {
  const items = getFeedData(lob);
  const xml = buildGoogleMerchantXml(items, `KULTUREVAULT (${lob.toUpperCase()}) Feed`);
  const csv = buildMetaCommerceCsv(items);

  fs.writeFileSync(path.join(FEEDS_DIR, `google-merchant-${lob}.xml`), xml, 'utf8');
  fs.writeFileSync(path.join(FEEDS_DIR, `meta-catalog-${lob}.csv`), csv, 'utf8');
}

console.log('[KULTUREVAULT Feeds] Generated static Google XML & Meta CSV feeds in src/assets/feeds/');

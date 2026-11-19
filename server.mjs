import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import catalogHandler from './api/shopify/catalog.mjs';
import checkoutHandler from './api/shopify/checkout.mjs';
import inventoryHandler from './api/shopify/inventory.mjs';
import webhooksHandler from './api/shopify/webhooks.mjs';
import googleFeedHandler from './api/feeds/google.mjs';
import metaFeedHandler from './api/feeds/meta.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 4200;
const DIST_DIR = path.resolve(__dirname, 'dist/kulturevault-exchange/browser');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.properties': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.csv': 'text/csv; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf'
};

async function parseJsonBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
      if (body.length > 10 * 1024 * 1024) {
        req.destroy();
        resolve(null);
      }
    });
    req.on('end', () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch {
        resolve(body);
      }
    });
  });
}

function adaptServerlessResponse(res) {
  let statusCode = 200;
  return {
    statusCode,
    status(code) {
      statusCode = code;
      res.statusCode = code;
      return this;
    },
    setHeader(name, value) {
      res.setHeader(name, value);
      return this;
    },
    json(data) {
      res.writeHead(statusCode, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(data));
      return this;
    },
    send(content) {
      if (!res.getHeader('Content-Type')) {
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      }
      res.writeHead(statusCode);
      res.end(content);
      return this;
    }
  };
}

export function createStoreServer() {
  return http.createServer(async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const pathname = url.pathname;

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization, X-Admin-Api-Key, X-Shopify-Hmac-Sha256'
    );

    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      return res.end();
    }

    if (pathname === '/healthz' || pathname === '/api/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(
        JSON.stringify({
          status: 'ok',
          service: 'kulturevault-exchange',
          uptime: process.uptime(),
          timestamp: new Date().toISOString()
        })
      );
    }

    if (pathname.startsWith('/api/feeds/')) {
      const serverlessRes = adaptServerlessResponse(res);
      req.query = Object.fromEntries(url.searchParams.entries());
      try {
        if (pathname === '/api/feeds/google' || pathname === '/api/feeds/google.xml') {
          return await googleFeedHandler(req, serverlessRes);
        }
        if (
          pathname === '/api/feeds/meta' ||
          pathname === '/api/feeds/meta.csv' ||
          pathname === '/api/feeds/meta.xml'
        ) {
          if (pathname.endsWith('.xml')) req.query.format = 'xml';
          return await metaFeedHandler(req, serverlessRes);
        }
      } catch (err) {
        return serverlessRes.status(500).json({ error: err.message || 'Internal Server Error' });
      }
      return serverlessRes.status(404).json({ error: 'Feed not found' });
    }

    if (pathname.startsWith('/api/shopify/')) {
      const serverlessRes = adaptServerlessResponse(res);
      req.query = Object.fromEntries(url.searchParams.entries());
      req.body = await parseJsonBody(req);

      try {
        if (pathname === '/api/shopify/catalog') {
          return await catalogHandler(req, serverlessRes);
        }
        if (pathname === '/api/shopify/checkout') {
          return await checkoutHandler(req, serverlessRes);
        }
        if (pathname === '/api/shopify/inventory') {
          return await inventoryHandler(req, serverlessRes);
        }
        if (pathname === '/api/shopify/webhooks') {
          return await webhooksHandler(req, serverlessRes);
        }
      } catch (err) {
        return serverlessRes.status(500).json({ error: err.message || 'Internal Server Error' });
      }

      return serverlessRes.status(404).json({ error: 'Endpoint not found' });
    }

    let filePath = path.join(DIST_DIR, pathname);
    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      filePath = path.join(DIST_DIR, 'index.html');
    }

    try {
      if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        const ext = path.extname(filePath);
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';
        res.writeHead(200, {
          'Content-Type': contentType,
          'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=31536000, immutable'
        });
        return fs.createReadStream(filePath).pipe(res);
      }
    } catch {
      // Fallback
    }

    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const server = createStoreServer();
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`[KULTUREVAULT Exchange Node] Serving at http://0.0.0.0:${PORT}`);
  });
}

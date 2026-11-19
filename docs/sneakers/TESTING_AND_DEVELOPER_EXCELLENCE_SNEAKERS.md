# KULTUREVAULT // Sneakers Exchange — Testing & Developer Excellence

## 1. Automated Verification Matrix

| Test Layer | Suite File | Key Invariants Verified |
| :--- | :--- | :--- |
| **Catalog & Unit Economics** | `tests/unit/catalog.spec.mjs` | 20 active sneaker SKUs, 30.00% gross margin (`[25%, 35%]`), 5-size US/UK matrix per SKU, Ask > Bid invariant |
| **Domain Purity & API** | `tests/unit/lob-architecture.spec.mjs` | Zero `halal_status`/`cold_chain` contamination, `GET /api/shopify/catalog?lob=sneakers` returns 20 items |
| **Angular Service DI Spec** | `src/app/shops/sneakers/services/sneakers-shop.service.spec.ts` | Brand filtering (`Jordan`, `Off-White`), dynamic size quote switching (`US 8` vs `US 11`), Buy Now vs Lock Market Bid, Order Book Table toggle |
| **Headless Chromium E2E** | `tests/e2e/storefront-flows.spec.mjs` | M3 dark emerald theme (`data-shop-theme="sneakers"`), Off-White chip filtering, Live Order Book Table rendering, size matrix click reactivity |

## 2. Execution Runbook

```bash
npx tsc --noEmit
npm run test:regression
```

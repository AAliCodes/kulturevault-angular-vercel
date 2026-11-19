# KULTUREVAULT // Streetwear & Apparel Archive — Testing & Developer Excellence

## 1. Test Coverage Summary

- **Unit Test Suite (`src/app/shops/streetwear/services/streetwear-shop.service.spec.ts`)**: Verifies all 16 apparel SKUs, house filtering (`Supreme` = 5, `Off-White` = 5, `Stüssy` = 6), Collector Bid ZAR savings calculation (`getBidSavingsAmount`), and size-scoped (`S`–`XL`) cart insertion.
- **Headless Chromium E2E (`tests/e2e/storefront-flows.spec.mjs`)**: Verifies `data-shop-theme="streetwear"`, 16 rendered garment cards, and `.savings-amount-pill` ZAR savings badge.

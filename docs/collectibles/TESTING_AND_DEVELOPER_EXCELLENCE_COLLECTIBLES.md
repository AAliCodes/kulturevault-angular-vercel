# KULTUREVAULT // Collectibles & Art Vault — Testing & Developer Excellence

## 1. Automated Test Coverage

- **Service Unit Spec (`src/app/shops/collectibles/services/collectibles-shop.service.spec.ts`)**: Verifies all 14 collectibles, studio filtering (`Medicom Toy`, `KAWS`, `Supreme`, `Off-White`, `Stüssy`, `Vault Lab`), and Acquire Now vs Collector Bid (-10% quote) cart integration.
- **Cart Freight Spec (`src/app/services/cart.service.spec.ts`)**: Verifies `R 450` art crate freight below `R 12,000` and `R 0` free freight above `R 12,000`.

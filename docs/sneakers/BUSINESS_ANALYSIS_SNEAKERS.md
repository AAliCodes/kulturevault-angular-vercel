# KULTUREVAULT // Sneakers Exchange — Business Analysis & Unit Economics Specification

## 1. Executive Summary & Market Positioning

**KULTUREVAULT // Sneakers (`/sneakers`, `/footwear`)** operates as a StockX-grade live deadstock footwear exchange in South Africa, eliminating grey-market counterfeit risk and import customs friction by providing local 12-point laboratory authentication (UV blacklight glue inspection, stitch density telemetry, olfactory adhesive profiling, and NFC/RFID tamper tagging) with real-time ZAR Bid/Ask liquidity.

### Target Addressable Market (South Africa & SADC)
- **TAM (Total Addressable Footwear & Sneaker Market)**: R 18.4 Billion annually across South Africa.
- **SAM (Secondary Deadstock & Limited-Edition Collector Segment)**: R 2.1 Billion across Johannesburg, Cape Town, Durban, and Pretoria.
- **SOM (Year 1–2 KULTUREVAULT Target)**: R 84 Million GMV across 20 flagship high-velocity silhouettes (`Air Jordan 1/3/4`, `Travis Scott x Jordan`, `Off-White™ x Nike The Ten`, `Supreme x Nike SB`, `Stüssy x Nike`, `New Balance Made in USA`, `Adidas Yeezy`).

---

## 2. Customer Segmentation & Value Proposition

| Segment | Share of GMV | Primary Silhouettes | Purchase Mechanism | Logistics Tier |
| :--- | :---: | :--- | :--- | :--- |
| **Grail Collectors & Hype Enthusiasts** | 55% | Air Jordan 1 Lost & Found, Jordan 4 SB Pine Green, Kobe 6 Reverse Grinch | Instant Buy Now (Lowest Ask) | Armored Deadstock Courier (R 250 / Free > R 5,000) |
| **High-Net-Worth Vault Investors (`B2B`)** | 30% | Off-White™ MCA AF1, Off-White™ Presto The Ten, Travis Scott Reverse Mocha | Live Market Bid (-8% Maker Quote) & Vault Lots | Priority Insured Armored Transit |
| **Daily Rotation & Lifestyle Buyers** | 15% | New Balance 990v6 USA, Stüssy AF1 Mid, Jordan 4 Bred Reimagined | Instant Buy Now | Standard Armored Courier |

---

## 3. Unit Economics & 30.00% Gross Margin Verification Matrix

Every SKU in `kulturevault-sneakers-seed.json` strictly enforces a **30.00% Gross Profit Margin** (`[25.00%, 35.00%]` invariant bounds) with upfront gateway settlement:

| SKU ID | Style Code | Title | Brand | Tier | Wholesale Cost (ZAR) | Benchmark Lowest Ask (ZAR) | Gross Margin (%) | Vault Stock |
| :--- | :--- | :--- | :--- | :---: | :---: | :---: | :---: | :---: |
| `SKU-SNK-001` | `DZ5485-612` | Air Jordan 1 Retro High OG "Chicago Lost & Found" | Jordan | Retail | R 6,230.00 | R 8,900.00 | **30.00%** | 20 |
| `SKU-SNK-002` | `DM7866-162` | Travis Scott x Air Jordan 1 Low OG SP "Reverse Mocha" | Jordan | B2B | R 17,150.00 | R 24,500.00 | **30.00%** | 20 |
| `SKU-SNK-003` | `DR5415-103` | Nike SB x Air Jordan 4 Retro "Pine Green" | Jordan | Retail | R 7,840.00 | R 11,200.00 | **30.00%** | 20 |
| `SKU-SNK-006` | `CV9388-100` | Off-White x Air Jordan 4 Retro SP "Sail" | Off-White | B2B | R 18,550.00 | R 26,500.00 | **30.00%** | 20 |
| `SKU-SNK-007` | `CI1173-400` | Off-White x Nike Air Force 1 Low "MCA University Blue" | Off-White | B2B | R 23,800.00 | R 34,000.00 | **30.00%** | 20 |
| `SKU-SNK-008` | `DM1602-127` | Off-White x Nike Dunk Low "Lot 01 of 50" | Off-White | B2B | R 12,950.00 | R 18,500.00 | **30.00%** | 20 |
| `SKU-SNK-011` | `FD8778-001` | Supreme x Nike SB Dunk Low "Rammellzee" | Supreme | Retail | R 7,350.00 | R 10,500.00 | **30.00%** | 20 |
| `SKU-SNK-013` | `CQ5486-200` | Stüssy x Nike Air Zoom Spiridon Cage 2 "Fossil" | Stüssy | Retail | R 6,580.00 | R 9,400.00 | **30.00%** | 20 |
| `SKU-SNK-015` | `FV4921-600` | Nike Kobe 6 Protro "Reverse Grinch" | Nike | Retail | R 6,860.00 | R 9,800.00 | **30.00%** | 20 |
| `SKU-SNK-018` | `BV1300-106` | Union LA x Air Jordan 1 Retro High NRG "Black Toe" | Jordan | B2B | R 21,700.00 | R 31,000.00 | **30.00%** | 20 |

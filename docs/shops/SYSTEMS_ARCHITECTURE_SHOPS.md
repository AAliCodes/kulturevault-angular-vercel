# KULTUREVAULT Exchange Holdings — Multi-Shop Systems Architecture Specification

## 1. Architectural Overview (Red Hat Java-Style Domain-Driven Design)

The KULTUREVAULT Exchange frontend application is architected into three isolated **Bounded Shop Contexts** under `src/app/shops/{sneakers,streetwear,collectibles}` supported by a shared enterprise core (`src/app/core/`) and a **Material Design 3 (Material You) HCT SCSS Token & Mixin Architecture** (`src/styles/`).

```mermaid
flowchart TB
    subgraph Core["Enterprise Core Layer (src/app/core)"]
        ContextSvc["ShopContextService\n(Route & M3 Theme Orchestrator)"]
        PropsSvc["PropertiesService\n(Java .properties Parser & Signal Store)"]
        ShopifySvc["ShopifyApiService\n(Catalog & Checkout HTTP Client)"]
        Registry["SHOP_THEME_REGISTRY\n(Sneakers, Streetwear, Collectibles)"]
    end

    subgraph Shared["Shared Commerce Services (src/app/services)"]
        CartSvc["CartService\n(Multi-Shop Vault Bag, Armored Courier & Settlement)"]
        ProdFacade["ProductService\n(Facade -> SneakersShopService)"]
    end

    subgraph SneakersShop["Sneakers Exchange (src/app/shops/sneakers)"]
        SnkComp["SneakersComponent"]
        SnkSvc["SneakersShopService"]
        SnkTheme["_sneakers-theme.scss (StockX Emerald Dark)"]
    end

    subgraph StreetwearShop["Streetwear Archive (src/app/shops/streetwear)"]
        StrComp["StreetwearComponent"]
        StrSvc["StreetwearShopService"]
        StrTheme["_streetwear-theme.scss (Supreme Crimson & Chalk Light)"]
    end

    subgraph CollectiblesShop["Collectibles & Vault (src/app/shops/collectibles)"]
        ColComp["CollectiblesComponent"]
        ColSvc["CollectiblesShopService"]
        ColTheme["_collectibles-theme.scss (Tokyo Gallery Amber Dark)"]
    end

    SnkComp --> SnkSvc
    StrComp --> StrSvc
    ColComp --> ColSvc
    SnkSvc --> CartSvc
    StrSvc --> CartSvc
    ColSvc --> CartSvc
    ContextSvc --> Registry
```

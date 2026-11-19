# KULTUREVAULT // Streetwear & Apparel Archive — Systems Architecture

## 1. Bounded Context & Material You Light Editorial Theme

The `streetwear` bounded context (`src/app/shops/streetwear/`) pairs its pure domain model (`StreetwearProduct`) with an editorial light Material Design 3 palette (`_streetwear-theme.scss`):
- **Primary**: Supreme Signal Crimson (`#D90429`)
- **Surface Hierarchy**: Off-White Gallery Chalk (`#FFFFFF` lowest through `#DFD9CC` highest)
- **Domain Attributes**: `season_code`, `garment_fit`, `fabric_composition`, `authenticity_verification` (Certilogo 12-digit CLG & Woven RN verification), and `available_sizes` (`S`, `M`, `L`, `XL`).

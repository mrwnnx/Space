# Comparaison Design Systems — Sublima vs Silk
#design-system #figma #comparaison

**Date :** 2026-04-07

---

## Vue d'ensemble

| Critère | Sublima UI v3.0 | Silk (Netguru) |
|---|---|---|
| Collections | 3 | 7 |
| Variables totales | 607 | 636 |
| Architecture couleur | **2 couches** | **3 couches** |
| Dark mode | ✅ Complet | ⚠️ Partiel (ombres seulement) |
| Palettes primitives | 14 × 12 steps | 18 chrom. × 12 + 5 neutres × 36 steps |
| Typographie responsive | ❌ | ✅ 3 modes (desktop/tablet/mobile) |
| États UI dans tokens | ❌ | ✅ hover / active / disabled |
| Focus tokens | ❌ | ✅ ring + offset |
| Shadows variables | ❌ | ✅ 4 niveaux Light/Dark |
| Grilles | 3 breakpoints | 4 breakpoints (min/max précis) |
| Espacement | T-shirt sizes (3xs → 29xl) | Tailwind multiplier (×4px) |
| Accent swappable | ❌ hardcodé brand/bleu | ✅ via `core/accent` → blueberry |
| Neutral swappable | ❌ | ✅ via `core/neutral` → night |

---

## Quand utiliser lequel ?

**Sublima** → meilleur pour des projets nécessitant un **dark mode clé en main** avec beaucoup de couleurs thématiques disponibles.

**Silk** → meilleur pour des projets avec des **standards d'accessibilité élevés** (focus tokens, états complets), une **typographie responsive** et une librairie **facilement re-brandable**.

---

## Liens
- [[Sublima UI - Analyse des variables]]
- [[Silk Design System - Analyse des variables]]

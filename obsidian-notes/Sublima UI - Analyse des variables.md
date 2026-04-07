# Sublima UI — Analyse des variables
#design-system #figma #variables

**Fichier Figma :** [Sublima UI - PRO v3.0](https://www.figma.com/design/dtbwl6R2HkFVe4K6M4es3q/Sublima-UI---PRO--v3.0---Copy---Copy-?node-id=719-2072)
**Date d'analyse :** 2026-04-07

---

## Résumé
- **3 collections**, 607 variables au total
- Architecture **2 couches** : Global colors (primitifs) → Color modes (sémantique)
- Dark mode **complet** sur tous les tokens couleur

---

## Collection 1 — Global colors
> 256 variables · 1 mode (`Value`) · TYPE: COLOR uniquement

Couche **primitive** : valeurs brutes, jamais utilisées directement dans les composants.

### Palettes disponibles
| Palette | Steps | Couleur pivot (500) |
|---|---|---|
| `base` | white, black, transparent | — |
| `neutral` | 50 → 950 (12 steps) | `#6b7280` |
| `brand` | 50 → 950 | `#0072DE` (bleu) |
| `success` | 50 → 950 | vert |
| `warning` | 50 → 950 | orange |
| `error` | 50 → 950 | rouge (R=G symétrique) |
| `slate` | 50 → 950 | — |
| Étendues | lime, teal, cyan, sky, indigo, violet, purple, fuchsia, pink | — |

**Total : ~14 palettes × ~12 steps** — architecture style Tailwind.

---

## Collection 2 — Color modes
> 296 variables · 2 modes : `Light mode` / `Dark mode` · TYPE: COLOR

Couche **sémantique** : aliases vers Global colors. Le dark mode **inverse les échelons** (ex : 50 → 900).

### Catégories de tokens
| Groupe | Nb de tokens |
|---|---|
| `semantic/neutral` | 11 |
| `semantic/brand` | 10 |
| Couleurs étendues (lime, teal, cyan…) | 10 chacune |
| `text/*` | ~8 |
| `background/*` | ~30+ |
| `border/*` | ~5 |

### Logique d'inversion dark mode
```
semantic/neutral/50
  Light mode → neutral/50   (#f9fafb)
  Dark mode  → neutral/800  (#1f2937)
```

### Tokens UI sémantiques (exemples)
| Token | Light | Dark |
|---|---|---|
| `text/heading-primary` | neutral/900 | neutral/50 |
| `text/heading-secondary` | neutral/700 | neutral/200 |
| `text/placeholder` | neutral/500 | neutral/400 |
| `background/bg-primary` | base/white | neutral/900 |
| `background/bg-primary-cards` | base/white | neutral/800 |
| `background/bg-secondary` | neutral/50 | neutral/800 |
| `background/bg-solid-primary` | neutral/900 | neutral/50 |
| `border/border-primary` | neutral/300 | neutral/600 |

---

## Collection 3 — Number variables
> 55 variables · 1 mode (`Mode 1`) · TYPE: FLOAT

### Spacing (29 steps)
Scope : `ALL_SCOPES`

| Token | Valeur |
|---|---|
| None | 0px |
| 3xs | 1px |
| 2xs | 2px |
| xs | 3px |
| sm | 4px |
| md | 6px |
| lg | 8px |
| xl | 10px |
| 2xl | 12px |
| 3xl | 14px |
| 4xl | 16px |
| 5xl | 20px |
| 6xl | 24px |
| 7xl | 32px |
| 8xl | 36px |
| 9xl | 40px |
| … | … |
| 29xl | 384px |

### Radius (9 steps)
Scope : `CORNER_RADIUS`

| Token | Valeur |
|---|---|
| None | 0 |
| 2xs | 2px |
| xs | 4px |
| sm | 6px |
| md | 8px |
| lg | 16px |
| xl | 20px |
| 2xl | 24px |
| Full | 99999px |

### Border width (6 steps)
`1 / 2 / 3 / 4 / 6 / 8 / 10 px`

### Breakpoints
| Token | Valeur |
|---|---|
| Desktop | 1440px |
| Tablet | 768px |
| Mobile | 390px |

---

## Points notables
- ✅ Architecture propre 2 couches (primitifs → sémantique)
- ✅ Dark mode complet et systématique
- ✅ 14 couleurs thématiques disponibles (utile pour badges, tags, états)
- ✅ Spacing non-linéaire : granulaire sur les petites valeurs, élargi sur les grandes
- ⚠️ Noms incohérents dans `background/` : `bg-senary` vs `bg-success-senery` (faute de frappe)
- ⚠️ Pas de tokens pour les états interactifs (hover, active, disabled) — gérés dans les composants

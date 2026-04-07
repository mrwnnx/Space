# Silk Design System (Netguru) — Analyse des variables
#design-system #figma #variables

**Fichier Figma :** [Silk Design System by Netguru](https://www.figma.com/design/0A7HN32yO7UivoqmT7IJLI/Silk-Design-System-by-Netguru--Community-?node-id=4396-68962)
**Date d'analyse :** 2026-04-07

---

## Résumé
- **7 collections**, 636 variables au total
- Architecture **3 couches** : primitives → colors → utilities
- Dark mode **partiel** (ombres uniquement)
- Typographie **responsive** (3 modes : desktop / tablet / mobile)

---

## Collection 1 — Primitives
> 386 variables · 1 mode · TYPE: COLOR

Couche la plus basse. Jamais utilisée directement dans les composants.

### Palettes chromatiques (18 × 12 steps : 100→1200)
| Groupe | Palettes |
|---|---|
| Chauds | fuchsia, rose, red, orange, amber, gold |
| Froids/verts | lime, green, aquamarine, teal, cyan |
| Bleus/violets | sky, blue, blueberry, violet, purple, magenta |

### Palettes neutres (5 × 36 steps — très granulaires)
`sand` · `gray` · `smoke` · `slate` · `night`

> `night` possède des variantes `darken/*` (ex: `night/darken/100`) utilisées pour les ombres et overlays.

---

## Collection 2 — Colors
> 127 variables · 1 mode · TYPE: COLOR

Couche **sémantique** — aliases vers primitives.

### core (alias swappables)
| Token | Pointe vers |
|---|---|
| `core/accent` (12 steps) | → `blueberry/*` *(remplaçable)* |
| `core/neutral` (12 steps) | → `night/*` *(remplaçable)* |

### text/*
| Token | Valeur |
|---|---|
| `text/title` | → neutral-1200 |
| `text/primary` | → neutral-1100 |
| `text/secondary` | → neutral-900 |
| `text/tertiary` | → neutral-700 |
| `text/placeholder` | → neutral-600 |
| `text/interactive` | → accent-700 |
| `text/inverted` | → white |
| `text/disabled/*` | neutral-300 à 600 selon niveau |
| `text/hover/interactive` | → accent-800 |
| `text/active/interactive` | → accent-900 |

### surface/*
`base · inverted · neutral-soft/medium/strong/stronger`
`interactive-soft/medium/strong`
`overlay-soft/strong`
`hover/* · active/* · disabled/*`

### border/*
`neutral-softer/soft/medium/strong`
`interactive-medium/strong`
`hover/* · active/* · disabled/*`

### semantic/*
| Groupe | Source | Niveaux |
|---|---|---|
| `semantic/success` | → teal | strong / medium / soft + hover + active |
| `semantic/error` | → red | idem |
| `semantic/warning` | → amber | idem |

### focus/*
| Token | Valeur |
|---|---|
| `focus/ring` | → black |
| `focus/offset` | → white |

---

## Collection 3 — Utilities
> 31 variables · 1 mode · 28 COLOR + 3 FLOAT

Couche **composant** — tokens très spécifiques.

- `utilities-negative` → red/600
- `utilities-positive` → teal/600
- `text/utilities-title-default` → blueberry/600
- `text/utilities-paragraph-soft` → gray/600
- `text/utilities-paragraph-default` → gray/1000
- `text/utilities-paragraph-strong` → gray/1200

---

## Collection 4 — Type
> 28 variables · 3 modes : `desktop` / `tablet` / `mobile`
> TYPE: STRING (familles, weights) + FLOAT (tailles, letter-spacing)

### Familles & weights
| Token | Valeur |
|---|---|
| `typography/family/heading` | Inter |
| `typography/family/text` | Inter |
| `typography/family/button` | Inter |
| `typography/weight/strong` | Semi Bold |
| `typography/weight/medium` | Medium |
| `typography/weight/soft` | Regular |

### Icônes
| Token | Valeur |
|---|---|
| `iconography/pictograms` | Fill |
| `iconography/primary` | Bold |
| `iconography/secondary` | Regular |
| `iconography/XS` | Bold |

### Échelle typographique (desktop → mobile)
| Token | Desktop | Mobile |
|---|---|---|
| display | 72px | 48px |
| h1 | 48px | 40px |
| h2 | 32px | 28px |
| h3 | 24px | 24px |
| h4 | 20px | 20px |
| h5 | 16px | 16px |
| h6 | 14px | 14px |
| t1 | 20px | 20px |
| t2 | 16px | 16px |
| t3 | 14px | 14px |
| t4 | 12px | 12px |
| t5 | 10px | **12px** ← seul step responsive |
| button-L | 16px | 16px |
| button-M | 16px | 16px |
| button-S | 14px | 14px |

### Letter-spacing
| Token | Valeur |
|---|---|
| L | 0.25 |
| M | 0.15 |
| S | 0 |

---

## Collection 5 — Shapes
> 28 variables · 1 mode · TYPE: FLOAT

### Radius (7 steps, scope: CORNER_RADIUS)
| Token | Valeur |
|---|---|
| none | 0 |
| xs | 2px |
| s | 4px |
| m | 8px |
| l | 12px |
| xl | 16px |
| rounded | 999px |

### Spacing — naming Tailwind (1 unité = 4px)
`none(0) · 0.5(2) · 1(4) · 1.5(6) · 2(8) · 2.5(10) · 3(12) · 4(16)…`

---

## Collection 6 — Grids
> 14 variables · 4 modes : `XS` / `S` / `M` / `L`

### Breakpoints
| Mode | Min | Max |
|---|---|---|
| XS | 320px | 375px |
| S | 376px | 768px |
| M | 769px | 1024px |
| L | 1025px | 1440px |

- 12 colonnes sur tous les breakpoints
- Marges et gutters adaptés par mode

---

## Collection 7 — Shadows
> 21 variables · 2 modes : `Light` / `Dark`

- 4 niveaux (l0 → l3) avec blur, x, y variables
- `shadow-soft` → `night/darken/100`
- `shadow-medium` → `night/darken/200`
- **Dark mode** : toutes les ombres = transparent

---

## Collection 8 — Lock
> 1 variable BOOLEAN : `🔒 LOCK = true`

Variable de protection de librairie — empêche les modifications accidentelles.

---

## Points notables
- ✅ Architecture 3 couches (primitives → colors → utilities) — la plus complète
- ✅ États interactifs (hover, active, disabled) **dans les tokens** eux-mêmes
- ✅ Focus ring tokenisé (accessibilité)
- ✅ Typographie responsive avec 3 modes
- ✅ Grilles avec 4 breakpoints précis (min/max)
- ✅ Accent et neutral **swappables** via `core/accent` et `core/neutral`
- ⚠️ Pas de dark mode complet sur les couleurs (seulement ombres)
- ⚠️ Faute de frappe : `iconograpny` au lieu de `iconography` dans les noms de tokens
- ⚠️ T5 est le seul step typographique responsive (10px desktop → 12px mobile)

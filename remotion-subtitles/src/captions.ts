import type { Caption } from "@remotion/captions";

/**
 * Sous-titres en DERJA TUNISIEN écrit en LETTRES LATINES (arabizi).
 *
 * Chaque élément est un MOT avec son timing en millisecondes.
 * Format = celui de @remotion/captions :
 *   { text, startMs, endMs, timestampMs, confidence }
 *
 * ⚠️  Ce fichier est un EXEMPLE de démonstration.
 *     Pour vos vraies paroles :
 *       1. Déposez votre vidéo dans public/  (voir README)
 *       2. Lancez  `npm run transcribe`  → génère les timings automatiquement
 *       3. Corrigez le texte en derja tunisien (lettres latines) en gardant les timings
 *          (ou lancez `npm run latinize` pour une translittération automatique).
 */
export const captions: Caption[] = [
  { text: "Ahla", startMs: 200, endMs: 700, timestampMs: 450, confidence: 1 },
  { text: "w", startMs: 700, endMs: 850, timestampMs: 775, confidence: 1 },
  { text: "sahla", startMs: 850, endMs: 1400, timestampMs: 1120, confidence: 1 },
  { text: "bikom", startMs: 1400, endMs: 2000, timestampMs: 1700, confidence: 1 },
  { text: "!", startMs: 2000, endMs: 2200, timestampMs: 2100, confidence: 1 },
  { text: "Aujourd'hui", startMs: 2400, endMs: 3100, timestampMs: 2750, confidence: 1 },
  { text: "bech", startMs: 3100, endMs: 3450, timestampMs: 3275, confidence: 1 },
  { text: "narikom", startMs: 3450, endMs: 4100, timestampMs: 3775, confidence: 1 },
  { text: "haja", startMs: 4100, endMs: 4600, timestampMs: 4350, confidence: 1 },
  { text: "behya", startMs: 4600, endMs: 5300, timestampMs: 4950, confidence: 1 },
  { text: "barcha", startMs: 5300, endMs: 5900, timestampMs: 5600, confidence: 1 },
  { text: "!", startMs: 5900, endMs: 6100, timestampMs: 6000, confidence: 1 },
];

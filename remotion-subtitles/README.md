# Sous-titres derja tunisien (Remotion)

Ajoute des sous-titres en **derja tunisien écrit en lettres latines** (arabizi),
police **Pangolin**, sur une vidéo — avec [Remotion](https://www.remotion.dev/).

Style : sous-titres animés façon TikTok/Reels, mot actif surligné en jaune,
contour noir pour rester lisibles sur n'importe quel fond.

> ℹ️ Le fichier vidéo de départ (`IMG_2435.MOV`) est sur **votre Mac**.
> Cet environnement cloud n'y a pas accès : suivez les étapes ci-dessous
> **en local** pour l'ajouter et générer la vidéo finale.

---

## Prérequis

- [Node.js](https://nodejs.org) 18+
- [ffmpeg](https://ffmpeg.org) — sur macOS : `brew install ffmpeg`

## Installation

```bash
cd remotion-subtitles
npm install
```

## Étape 1 — Déposer la vidéo

L'iPhone filme souvent en **HEVC** (`.MOV`), pas toujours bien décodé.
Le plus sûr est de convertir en MP4 H.264 et de le placer dans `public/` :

```bash
ffmpeg -i /Users/macbook/Downloads/IMG_2435.MOV \
  -c:v libx264 -pix_fmt yuv420p -c:a aac \
  remotion-subtitles/public/IMG_2435.mp4
```

> Le dossier `public/` est ignoré par git (vidéos trop lourdes) : normal.

## Étape 2 — Couper les silences (jump-cut propre)

```bash
npm run cut-silence
# -> public/IMG_2435.cut.mp4
```

Détecte les silences, garde les passages parlés (avec une petite marge pour ne
pas hacher les mots) et applique un léger fondu audio à chaque coupe pour que ça
reste fluide. On coupe **avant** de transcrire, comme ça les sous-titres
s'alignent sur la vidéo déjà montée.

Réglages (variables d'environnement) :

| Variable      | Défaut  | Rôle                                              |
| ------------- | ------- | ------------------------------------------------- |
| `SILENCE_DB`  | `-30dB` | Seuil au-dessous duquel c'est « du silence »      |
| `MIN_SILENCE` | `0.5`   | Durée mini (s) pour couper un silence             |
| `PADDING`     | `0.1`   | Marge (s) gardée autour de la parole              |

```bash
# Ex : coupes plus serrées
SILENCE_DB=-32 MIN_SILENCE=0.35 PADDING=0.08 npm run cut-silence
```

C'est la version `.cut.mp4` qu'on utilise pour la suite.

## Étape 3 — Générer les sous-titres (timings automatiques)

```bash
node scripts/transcribe.mjs public/IMG_2435.cut.mp4
```

- Extrait l'audio, télécharge whisper.cpp **en local** (aucune clé API),
  transcrit et écrit les timings mot-à-mot dans `src/captions.ts`.
- Le texte sort en **écriture arabe**. Deux options pour passer en lettres latines :
  - **À la main** (recommandé, le plus fidèle au derja) : ouvrez `src/captions.ts`
    et réécrivez chaque `text` en arabizi, sans toucher aux timings.
  - **Automatique** : `export OPENAI_API_KEY=sk-...` puis `npm run latinize`.

> Modèle whisper plus précis (plus lent) : `WHISPER_MODEL=large-v3-turbo node scripts/transcribe.mjs public/IMG_2435.cut.mp4`

Pas envie d'auto-transcrire ? Éditez directement `src/captions.ts` à la main :
chaque mot est `{ text, startMs, endMs, timestampMs, confidence }`.

## Étape 4 — Prévisualiser

Dites à Remotion d'utiliser la version montée :

```bash
npm run studio -- --props='{"videoFileName":"IMG_2435.cut.mp4"}'
```

Ouvre le Remotion Studio : la taille, la durée et le fps s'adaptent
automatiquement à votre vidéo. Ajustez le texte, ça se met à jour en direct.

## Étape 5 — Rendre la vidéo finale

```bash
npm run render -- --props='{"videoFileName":"IMG_2435.cut.mp4"}'
# -> out/video.mp4
```

> Vous n'avez pas coupé les silences ? Utilisez simplement `IMG_2435.mp4`
> (ou lancez `npm run render` tout court, c'est le fichier par défaut).

---

## Personnaliser le style

Tout est dans `src/Subtitle.tsx` (`DEFAULT_SUBTITLE_STYLE`) :

| Réglage           | Effet                                    |
| ----------------- | ---------------------------------------- |
| `fontSizePx`      | Taille du texte                          |
| `textColor`       | Couleur des mots                         |
| `highlightColor`  | Couleur du mot en cours (karaoké)        |
| `strokeColor`     | Couleur du contour                       |
| `strokeWidthPx`   | Épaisseur du contour                     |
| `bottomOffsetPx`  | Distance depuis le bas de l'écran        |

La police Pangolin est chargée dans `src/load-font.ts`.

## Structure

```
remotion-subtitles/
├── public/                     # votre vidéo (local)
├── src/
│   ├── Root.tsx                # composition + détection auto taille/durée
│   ├── VideoWithSubtitles.tsx  # vidéo + pages de sous-titres
│   ├── Subtitle.tsx            # rendu + style d'une ligne (Pangolin)
│   ├── captions.ts             # les sous-titres (mots + timings)
│   └── load-font.ts            # police Pangolin
└── scripts/
    ├── cut-silence.mjs         # coupe les silences (jump-cut propre)
    ├── transcribe.mjs          # whisper.cpp -> captions.ts
    └── translate-to-latin.mjs  # translittération arabe -> latin (optionnel)
```

## Récap du flux

```
IMG_2435.MOV
  └─(ffmpeg)→ public/IMG_2435.mp4
       └─(npm run cut-silence)→ public/IMG_2435.cut.mp4   ✂️ silences coupés
            └─(transcribe)→ src/captions.ts               📝 timings
                 └─(à la main / latinize)→ derja latin     🔤 Pangolin
                      └─(npm run render)→ out/video.mp4     ✅
```

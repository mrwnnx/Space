// Transcription automatique -> génère src/captions.ts avec les timings.
//
// Utilise whisper.cpp EN LOCAL (aucune clé API, tout reste sur votre machine).
// Whisper transcrit le derja en écriture ARABE. Ensuite :
//   - soit vous corrigez le texte à la main en lettres latines,
//   - soit vous lancez `npm run latinize` (translittération automatique, clé OpenAI).
//
// Prérequis : ffmpeg installé (brew install ffmpeg).
//
// Usage :
//   npm run transcribe                      (cible public/IMG_2435.mp4)
//   node scripts/transcribe.mjs public/ma-video.mov
//   WHISPER_MODEL=large-v3-turbo npm run transcribe

import path from "node:path";
import fs from "node:fs";
import { spawnSync } from "node:child_process";
import {
  installWhisperCpp,
  downloadWhisperModel,
  transcribe,
  toCaptions,
} from "@remotion/install-whisper-cpp";

const WHISPER_VERSION = "1.5.5";
const MODEL = process.env.WHISPER_MODEL ?? "medium"; // medium = bon compromis pour l'arabe
const LANGUAGE = process.env.WHISPER_LANG ?? "ar"; // derja -> famille arabe

const inputArg = process.argv[2] ?? "public/IMG_2435.mp4";
const inputPath = path.resolve(process.cwd(), inputArg);

if (!fs.existsSync(inputPath)) {
  console.error(`\n❌ Vidéo introuvable : ${inputPath}`);
  console.error("   Déposez votre fichier dans le dossier public/ d'abord.\n");
  process.exit(1);
}

const whisperPath = path.join(process.cwd(), "whisper.cpp");
const wavPath = path.join(process.cwd(), ".tmp-audio-16k.wav");

// 1) Extraire l'audio en WAV 16 kHz mono (format requis par whisper.cpp)
console.log("🎧 Extraction de l'audio (ffmpeg)...");
const ff = spawnSync(
  "ffmpeg",
  ["-y", "-i", inputPath, "-ar", "16000", "-ac", "1", "-c:a", "pcm_s16le", wavPath],
  { stdio: "inherit" },
);
if (ff.status !== 0) {
  console.error(
    "\n❌ ffmpeg a échoué. Installez-le : brew install ffmpeg (macOS)\n",
  );
  process.exit(1);
}

// 2) Installer whisper.cpp + le modèle si besoin
console.log("⬇️  Installation de whisper.cpp / du modèle si nécessaire...");
await installWhisperCpp({ to: whisperPath, version: WHISPER_VERSION });
await downloadWhisperModel({ model: MODEL, folder: whisperPath });

// 3) Transcrire avec timings au niveau du mot
console.log(`📝 Transcription (modèle=${MODEL}, langue=${LANGUAGE})...`);
const { transcription } = await transcribe({
  model: MODEL,
  whisperPath,
  whisperCppVersion: WHISPER_VERSION,
  inputPath: wavPath,
  tokenLevelTimestamps: true,
  language: LANGUAGE,
});

const { captions } = toCaptions({ whisperCppOutput: transcription });

// 4) Écrire src/captions.ts
const header = `import type { Caption } from "@remotion/captions";

/**
 * Généré automatiquement par scripts/transcribe.mjs (whisper.cpp).
 * ⚠️  Texte en écriture ARABE : corrigez-le en derja tunisien LETTRES LATINES
 *     en gardant les timings — ou lancez \`npm run latinize\`.
 */
export const captions: Caption[] = `;

const body = JSON.stringify(captions, null, 2);
const outPath = path.join(process.cwd(), "src", "captions.ts");
fs.writeFileSync(outPath, header + body + ";\n", "utf8");

// Nettoyage
fs.rmSync(wavPath, { force: true });

console.log(`\n✅ ${captions.length} mots écrits dans src/captions.ts`);
console.log("   Ouvrez ce fichier et passez le texte en lettres latines,");
console.log("   puis lancez `npm run studio` pour prévisualiser.\n");

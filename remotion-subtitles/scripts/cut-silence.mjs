// Coupe les silences d'une vidéo, en douceur (jump-cut propre).
//
// Détecte les silences avec ffmpeg (silencedetect), garde les segments parlés
// avec un petit "padding" pour ne pas hacher les mots, applique un léger fondu
// audio (~30 ms) à chaque coupe pour éviter les "clics", puis reconcatène.
//
// À lancer AVANT la transcription : les sous-titres s'alignent ainsi sur la
// vidéo déjà montée.
//
// Prérequis : ffmpeg + ffprobe.
//
// Usage :
//   npm run cut-silence                         (public/IMG_2435.mp4 -> public/IMG_2435.cut.mp4)
//   node scripts/cut-silence.mjs public/ma-video.mp4
//   SILENCE_DB=-32 MIN_SILENCE=0.4 PADDING=0.12 npm run cut-silence

import path from "node:path";
import fs from "node:fs";
import os from "node:os";
import { spawnSync } from "node:child_process";

const NOISE_DB = process.env.SILENCE_DB ?? "-30dB"; // seuil "c'est du silence"
const MIN_SILENCE = Number(process.env.MIN_SILENCE ?? "0.5"); // durée mini d'un silence (s)
const PADDING = Number(process.env.PADDING ?? "0.1"); // marge gardée autour de la parole (s)
const FADE = 0.03; // fondu audio à chaque coupe (s)

const inputArg = process.argv[2] ?? "public/IMG_2435.mp4";
const inputPath = path.resolve(process.cwd(), inputArg);
if (!fs.existsSync(inputPath)) {
  console.error(`\n❌ Vidéo introuvable : ${inputPath}\n`);
  process.exit(1);
}
const ext = path.extname(inputPath);
const outputPath = inputPath.slice(0, -ext.length) + ".cut.mp4";

// --- Durée totale (ffprobe) ---
const probe = spawnSync("ffprobe", [
  "-v", "error",
  "-show_entries", "format=duration",
  "-of", "default=noprint_wrappers=1:nokey=1",
  inputPath,
]);
if (probe.status !== 0) {
  console.error("❌ ffprobe a échoué (ffmpeg est-il installé ?)");
  process.exit(1);
}
const total = parseFloat(String(probe.stdout).trim());

// --- Détection des silences ---
console.log(`🔎 Détection des silences (seuil=${NOISE_DB}, min=${MIN_SILENCE}s)...`);
const det = spawnSync("ffmpeg", [
  "-i", inputPath,
  "-af", `silencedetect=noise=${NOISE_DB}:d=${MIN_SILENCE}`,
  "-f", "null", "-",
]);
const log = String(det.stderr);
const silences = [];
let pendingStart = null;
for (const line of log.split("\n")) {
  const s = line.match(/silence_start:\s*(-?[\d.]+)/);
  const e = line.match(/silence_end:\s*(-?[\d.]+)/);
  if (s) pendingStart = Math.max(0, parseFloat(s[1]));
  if (e && pendingStart !== null) {
    silences.push([pendingStart, parseFloat(e[1])]);
    pendingStart = null;
  }
}
if (pendingStart !== null) silences.push([pendingStart, total]);

// --- Segments à GARDER = complément des silences, avec padding puis fusion ---
let keep = [];
let cursor = 0;
for (const [ss, se] of silences) {
  if (ss > cursor) keep.push([cursor, ss]);
  cursor = se;
}
if (cursor < total) keep.push([cursor, total]);

keep = keep
  .map(([a, b]) => [Math.max(0, a - PADDING), Math.min(total, b + PADDING)])
  .filter(([a, b]) => b - a > 0.05);

// Fusion des segments qui se chevauchent après padding
const merged = [];
for (const seg of keep.sort((x, y) => x[0] - y[0])) {
  const last = merged[merged.length - 1];
  if (last && seg[0] <= last[1]) last[1] = Math.max(last[1], seg[1]);
  else merged.push([...seg]);
}

if (merged.length === 0) {
  console.error("❌ Aucun passage parlé détecté. Ajustez SILENCE_DB / MIN_SILENCE.");
  process.exit(1);
}

const keptDur = merged.reduce((s, [a, b]) => s + (b - a), 0);
console.log(
  `✂️  ${silences.length} silences retirés — ${total.toFixed(1)}s -> ${keptDur.toFixed(1)}s ` +
    `(${merged.length} segments gardés)`,
);

// --- Construction du filtergraph trim + fondus + concat ---
const parts = [];
const concatInputs = [];
merged.forEach(([a, b], i) => {
  const d = b - a;
  const fade = Math.min(FADE, d / 2);
  parts.push(`[0:v]trim=${a}:${b},setpts=PTS-STARTPTS[v${i}]`);
  parts.push(
    `[0:a]atrim=${a}:${b},asetpts=PTS-STARTPTS,` +
      `afade=t=in:st=0:d=${fade.toFixed(3)},` +
      `afade=t=out:st=${(d - fade).toFixed(3)}:d=${fade.toFixed(3)}[a${i}]`,
  );
  concatInputs.push(`[v${i}][a${i}]`);
});
parts.push(`${concatInputs.join("")}concat=n=${merged.length}:v=1:a=1[v][a]`);

const scriptFile = path.join(os.tmpdir(), `cutsilence-${process.pid}.txt`);
fs.writeFileSync(scriptFile, parts.join(";\n"), "utf8");

console.log("🎬 Encodage de la version montée...");
const enc = spawnSync(
  "ffmpeg",
  [
    "-y", "-i", inputPath,
    "-filter_complex_script", scriptFile,
    "-map", "[v]", "-map", "[a]",
    "-c:v", "libx264", "-pix_fmt", "yuv420p", "-preset", "medium",
    "-c:a", "aac", "-b:a", "192k",
    outputPath,
  ],
  { stdio: "inherit" },
);
fs.rmSync(scriptFile, { force: true });

if (enc.status !== 0) {
  console.error("\n❌ L'encodage ffmpeg a échoué.");
  process.exit(1);
}

console.log(`\n✅ Vidéo montée : ${outputPath}`);
console.log("   Transcrivez maintenant CETTE version :");
console.log(`   node scripts/transcribe.mjs ${path.relative(process.cwd(), outputPath)}`);
console.log("   puis rendez avec --props='{\"videoFileName\":\"" +
  path.basename(outputPath) + "\"}'\n");

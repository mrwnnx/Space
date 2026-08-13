// Translittération automatique : derja en écriture arabe -> lettres latines (arabizi).
// Optionnel. Nécessite une clé OpenAI :  export OPENAI_API_KEY=sk-...
//
// Lit src/captions.ts, convertit CHAQUE mot en gardant les timings,
// puis réécrit src/captions.ts. Vérifiez toujours le résultat à la main.
//
// Usage :  npm run latinize

import path from "node:path";
import fs from "node:fs";

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  console.error("\n❌ OPENAI_API_KEY manquante.  export OPENAI_API_KEY=sk-...\n");
  process.exit(1);
}

const MODEL = process.env.OPENAI_MODEL ?? "gpt-4o-mini";
const capPath = path.join(process.cwd(), "src", "captions.ts");
const raw = fs.readFileSync(capPath, "utf8");

// Extrait le tableau JSON entre le premier '[' et le dernier ']'
const start = raw.indexOf("[");
const end = raw.lastIndexOf("]");
if (start === -1 || end === -1) {
  console.error("❌ Impossible de lire le tableau dans src/captions.ts");
  process.exit(1);
}
const captions = JSON.parse(raw.slice(start, end + 1));
const words = captions.map((c) => c.text);

const chunk = (arr, size) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size),
  );

async function latinizeBatch(batch) {
  const prompt =
    "Translittère chaque élément du tableau JSON suivant du derja tunisien " +
    "(écriture arabe) vers l'arabizi (lettres latines tunisiennes, chiffres 3/7/9 autorisés). " +
    "Garde EXACTEMENT le même nombre d'éléments et le même ordre. " +
    "Laisse la ponctuation et les mots déjà latins inchangés. " +
    "Réponds UNIQUEMENT avec le tableau JSON de chaînes, rien d'autre.\n\n" +
    JSON.stringify(batch);

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      temperature: 0,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  if (!res.ok) {
    throw new Error(`OpenAI ${res.status}: ${await res.text()}`);
  }
  const data = await res.json();
  let content = data.choices[0].message.content.trim();
  content = content.replace(/^```(?:json)?/, "").replace(/```$/, "").trim();
  const out = JSON.parse(content);
  if (!Array.isArray(out) || out.length !== batch.length) {
    throw new Error("Réponse mal alignée, batch ignoré.");
  }
  return out;
}

console.log(`🔤 Translittération de ${words.length} mots (${MODEL})...`);
const result = [];
for (const batch of chunk(words, 40)) {
  try {
    result.push(...(await latinizeBatch(batch)));
  } catch (e) {
    console.warn("⚠️ ", e.message, "-> on garde le texte original.");
    result.push(...batch);
  }
}

captions.forEach((c, i) => {
  c.text = result[i] ?? c.text;
});

const header = `import type { Caption } from "@remotion/captions";

/**
 * Translittéré en lettres latines par scripts/translate-to-latin.mjs.
 * Relisez et corrigez le derja au besoin, les timings sont conservés.
 */
export const captions: Caption[] = `;

fs.writeFileSync(
  capPath,
  header + JSON.stringify(captions, null, 2) + ";\n",
  "utf8",
);
console.log("\n✅ src/captions.ts mis à jour en lettres latines.\n");

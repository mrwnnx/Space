// Police Pangolin (Google Fonts) — écriture manuscrite, lettres latines.
// Chargée via @remotion/google-fonts pour être disponible aussi bien
// dans le Studio que pendant le rendu (server-side).
import { loadFont } from "@remotion/google-fonts/Pangolin";

const { fontFamily } = loadFont();

export const PANGOLIN_FONT_FAMILY = fontFamily;

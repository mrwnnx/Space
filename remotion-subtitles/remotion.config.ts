import { Config } from "@remotion/cli/config";

// Qualité de rendu
Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
// H.264 est le codec le plus compatible (QuickTime, réseaux sociaux, etc.)
Config.setCodec("h264");

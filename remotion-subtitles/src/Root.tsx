import React from "react";
import { Composition, staticFile } from "remotion";
import { parseMedia } from "@remotion/media-parser";
import {
  VideoWithSubtitles,
  defaultVideoWithSubtitlesProps,
  type VideoWithSubtitlesProps,
} from "./VideoWithSubtitles";

// Valeurs de repli si la vidéo n'est pas encore déposée / illisible.
const FALLBACK_WIDTH = 1080;
const FALLBACK_HEIGHT = 1920;
const FALLBACK_FPS = 30;

const lastCaptionEndMs = (props: VideoWithSubtitlesProps) =>
  props.captions.reduce((max, c) => Math.max(max, c.endMs), 0);

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="Subtitled"
      component={VideoWithSubtitles}
      defaultProps={defaultVideoWithSubtitlesProps}
      // Ces valeurs sont recalculées automatiquement d'après la vraie vidéo :
      durationInFrames={300}
      fps={FALLBACK_FPS}
      width={FALLBACK_WIDTH}
      height={FALLBACK_HEIGHT}
      calculateMetadata={async ({ props }) => {
        try {
          const { dimensions, slowDurationInSeconds, fps } = await parseMedia({
            src: staticFile(props.videoFileName),
            fields: {
              dimensions: true,
              slowDurationInSeconds: true,
              fps: true,
            },
            acknowledgeRemotionLicense: true,
          });

          const usableFps = fps ?? FALLBACK_FPS;
          const durationSec =
            slowDurationInSeconds ??
            lastCaptionEndMs(props) / 1000 + 0.5;

          return {
            durationInFrames: Math.max(1, Math.round(durationSec * usableFps)),
            fps: usableFps,
            width: dimensions?.width ?? FALLBACK_WIDTH,
            height: dimensions?.height ?? FALLBACK_HEIGHT,
          };
        } catch (err) {
          // La vidéo n'est pas encore dans public/ : on garde un repli
          // basé sur la durée des sous-titres pour que le Studio s'ouvre.
          const durationSec = lastCaptionEndMs(props) / 1000 + 0.5;
          return {
            durationInFrames: Math.max(
              1,
              Math.round(durationSec * FALLBACK_FPS),
            ),
            fps: FALLBACK_FPS,
            width: FALLBACK_WIDTH,
            height: FALLBACK_HEIGHT,
          };
        }
      }}
    />
  );
};

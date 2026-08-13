import React, { useMemo } from "react";
import {
  AbsoluteFill,
  OffthreadVideo,
  Sequence,
  staticFile,
  useVideoConfig,
} from "remotion";
import {
  createTikTokStyleCaptions,
  type Caption,
} from "@remotion/captions";
import { captions as defaultCaptions } from "./captions";
import {
  Subtitle,
  DEFAULT_SUBTITLE_STYLE,
  type SubtitleStyle,
} from "./Subtitle";

export type VideoWithSubtitlesProps = {
  /** Nom du fichier vidéo placé dans public/ (ex: "IMG_2435.mp4") */
  videoFileName: string;
  /** Sous-titres (mots + timings). Par défaut ceux de src/captions.ts */
  captions: Caption[];
  /** Regroupe les mots proches dans une même "page" de sous-titre (ms) */
  combineTokensWithinMs: number;
  /** Style visuel des sous-titres */
  subtitleStyle: SubtitleStyle;
};

export const defaultVideoWithSubtitlesProps: VideoWithSubtitlesProps = {
  videoFileName: "IMG_2435.mp4",
  captions: defaultCaptions,
  combineTokensWithinMs: 1200,
  subtitleStyle: DEFAULT_SUBTITLE_STYLE,
};

export const VideoWithSubtitles: React.FC<VideoWithSubtitlesProps> = ({
  videoFileName,
  captions,
  combineTokensWithinMs,
  subtitleStyle,
}) => {
  const { fps } = useVideoConfig();

  const { pages } = useMemo(
    () =>
      createTikTokStyleCaptions({
        captions,
        combineTokensWithinMilliseconds: combineTokensWithinMs,
      }),
    [captions, combineTokensWithinMs],
  );

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <OffthreadVideo src={staticFile(videoFileName)} />

      {pages.map((page, index) => {
        const from = Math.round((page.startMs / 1000) * fps);
        const durationInFrames = Math.max(
          1,
          Math.round((page.durationMs / 1000) * fps),
        );
        return (
          <Sequence
            key={index}
            from={from}
            durationInFrames={durationInFrames}
            name={`Caption ${index + 1}`}
          >
            <Subtitle page={page} style={subtitleStyle} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

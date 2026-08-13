import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { TikTokPage } from "@remotion/captions";
import { PANGOLIN_FONT_FAMILY } from "./load-font";

export type SubtitleStyle = {
  fontSizePx: number;
  textColor: string;
  highlightColor: string;
  strokeColor: string;
  strokeWidthPx: number;
  bottomOffsetPx: number;
};

export const DEFAULT_SUBTITLE_STYLE: SubtitleStyle = {
  fontSizePx: 92,
  textColor: "#ffffff",
  highlightColor: "#ffd93b",
  strokeColor: "#000000",
  strokeWidthPx: 12,
  bottomOffsetPx: 320,
};

export const Subtitle: React.FC<{
  page: TikTokPage;
  style: SubtitleStyle;
}> = ({ page, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const timeMs = (frame / fps) * 1000;

  // Petite animation d'apparition de la ligne
  const enter = spring({
    frame,
    fps,
    config: { damping: 200 },
    durationInFrames: 8,
  });
  const scale = interpolate(enter, [0, 1], [0.85, 1]);

  const textShadow = `${style.strokeColor} 0px 0px ${style.strokeWidthPx}px`;
  const stroke = `${style.strokeWidthPx / 6}px ${style.strokeColor}`;

  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: style.bottomOffsetPx,
        paddingLeft: 80,
        paddingRight: 80,
      }}
    >
      <div
        style={{
          transform: `scale(${scale})`,
          fontFamily: PANGOLIN_FONT_FAMILY,
          fontSize: style.fontSizePx,
          lineHeight: 1.15,
          textAlign: "center",
          textShadow: `${textShadow}, ${textShadow}, ${textShadow}`,
          WebkitTextStroke: stroke,
          paintOrder: "stroke fill",
        }}
      >
        {page.tokens.map((token, i) => {
          const active =
            timeMs >= token.fromMs && timeMs < token.toMs;
          return (
            <span
              key={`${token.fromMs}-${i}`}
              style={{
                color: active ? style.highlightColor : style.textColor,
                display: "inline-block",
                marginRight: "0.28em",
                transform: active ? "translateY(-6px)" : "none",
                transition: "none",
              }}
            >
              {token.text}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

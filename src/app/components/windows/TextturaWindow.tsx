import React from "react";
import { useTheme } from "../../hooks/useTheme";
import { AutoPlayVideo } from "../AutoPlayVideo";

export function TextturaWindow() {
  const { theme } = useTheme();

  return (
    <div className="p-5" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
      <p
        className="mb-4"
        style={{ fontSize: "13px", lineHeight: "1.7", color: theme.textPrimary }}
      >
        Fill any shape with repeating text. Typographic masking made visual.
      </p>

      <div
        className="relative aspect-video overflow-hidden rounded-sm mb-3"
      >
        <AutoPlayVideo
          src="https://i.imgur.com/lZPECQ1.mp4"
          className="w-full h-full object-cover"
        />
      </div>

      <a
        href="https://rdpilot.github.io/Svgtexthighlighttool/"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block underline transition-all"
        style={{ fontSize: "13px", color: theme.linkColor }}
      >
        Try it live &rarr;
      </a>
    </div>
  );
}
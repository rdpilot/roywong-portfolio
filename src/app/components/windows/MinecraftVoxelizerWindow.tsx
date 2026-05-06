import React from "react";
import { useTheme } from "../../hooks/useTheme";
import { AutoPlayVideo } from "../AutoPlayVideo";

export function MinecraftVoxelizerWindow() {
  const { theme } = useTheme();

  return (
    <div className="p-5" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
      <p
        className="mb-4"
        style={{ fontSize: "13px", lineHeight: "1.7", color: theme.textPrimary }}
      >
        A converter that turn .svg into Minecraft blocks.
      </p>

      <div
        className="relative aspect-video overflow-hidden rounded-sm mb-3"
      >
        <AutoPlayVideo
          src="https://i.imgur.com/iB2qa5r.mp4"
          className="w-full h-full object-cover"
        />
      </div>

      <a
        href="https://gemini.google.com/share/cce332638722"
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
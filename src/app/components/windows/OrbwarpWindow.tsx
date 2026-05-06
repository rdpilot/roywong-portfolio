import React from "react";
import { useTheme } from "../../hooks/useTheme";
import { AutoPlayVideo } from "../AutoPlayVideo";

export function OrbwarpWindow() {
  const { theme } = useTheme();

  return (
    <div className="p-5" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
      <p
        className="mb-4"
        style={{ fontSize: "13px", lineHeight: "1.7", color: theme.textPrimary }}
      >
        Upload or drop an SVG to project it onto a 3D wireframe sphere. Drag to rotate, scroll to zoom, tweak scale and lighting, then export the warped result as PNG or SVG.
      </p>

      <div
        className="relative aspect-video overflow-hidden rounded-sm mb-3"
      >
        <AutoPlayVideo
          src="https://i.imgur.com/91JekBM.mp4"
          className="w-full h-full object-cover"
        />
      </div>

      <a
        href="https://snow-recap-51101332.figma.site/"
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
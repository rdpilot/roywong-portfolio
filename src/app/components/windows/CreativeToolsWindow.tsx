import React from "react";
import { useIsMobile } from "../../hooks/useIsMobile";
import { useTheme } from "../../hooks/useTheme";
import { useQuickLook } from "../QuickLookOverlay";
import { AutoPlayVideo } from "../AutoPlayVideo";
import { ProjectHeader } from "./ProjectLayout";

const tools = [
  {
    name: "ASCII effect 3D tool",
    description: "An interactive 3D ASCII tool transforming .glb models, video, text or emoji in real-time.",
    video: "https://i.imgur.com/XbukEEh.mp4",
    href: "https://rdpilot.github.io/niu-ascii/",
  },
  {
    name: "Texttura",
    description: "Fill any shape with repeating text. Typographic masking made visual.",
    video: "https://i.imgur.com/lZPECQ1.mp4",
    href: "https://rdpilot.github.io/Svgtexthighlighttool/",
  },
  {
    name: "Orbwarp",
    description: "Upload or drop an SVG to project it onto a 3D wireframe sphere. Drag to rotate, scroll to zoom, tweak scale and lighting, then export the warped result as PNG or SVG.",
    video: "https://i.imgur.com/91JekBM.mp4",
    href: "https://snow-recap-51101332.figma.site/",
  },
  {
    name: "Wavetype",
    description: "A kinetic typography texture tool with 10 pattern modes, a skeuomorphic hardware UI, stencil masking, and multi-format export including ready-to-use HTML and embeddable code snippets.",
    video: "https://i.imgur.com/WxwoKfM.mp4",
    href: "https://rdpilot.github.io/Wavetype/",
  },
];

export function CreativeToolsWindow() {
  const isMobile = useIsMobile();
  const { theme } = useTheme();
  const { openQuickLook } = useQuickLook();

  return (
    <div style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
      <ProjectHeader
        title="Creative tools"
        company="Side projects"
        description="Small tools I built to play with type, 3D and motion. Each one runs in the browser."
        tags={["Interactive", "Browser-based"]}
        theme={theme}
      />

      <div
        style={{
          display: isMobile ? "flex" : "grid",
          gridTemplateColumns: "1fr 1fr",
          flexDirection: "column",
          gap: "40px",
          padding: "32px 0 0",
          alignItems: "stretch",
        }}
      >
        {tools.map((tool) => (
          <div key={tool.name} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div
              onClick={() => openQuickLook({ src: tool.video, alt: tool.name, type: "video" })}
              style={{ cursor: "pointer", borderRadius: "12px", overflow: "hidden", aspectRatio: "16 / 10", background: "#1a1a1a" }}
            >
              <AutoPlayVideo src={tool.video} className="gallery-thumb" />
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ margin: "0 0 6px", fontSize: "15px", fontWeight: 600, color: theme.textStrong }}>{tool.name}</h3>
              <p style={{ margin: 0, fontSize: "14px", lineHeight: 1.6, color: theme.textSecondary }}>{tool.description}</p>
            </div>
            <a
              href={tool.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                alignSelf: "flex-start",
                padding: "8px 14px",
                borderRadius: "8px",
                border: `1px solid ${theme.windowBorder}`,
                fontSize: "13px",
                fontWeight: 500,
                color: theme.textStrong,
                textDecoration: "none",
              }}
            >
              Try it live &#8599;
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

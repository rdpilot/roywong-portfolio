import React from "react";
import { useIsMobile } from "../../hooks/useIsMobile";
import { useTheme } from "../../hooks/useTheme";

export function AboutWindow() {
  const isMobile = useIsMobile();
  const { theme } = useTheme();

  return (
    <div className="p-5" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
      <p className="mb-3" style={{ fontSize: "13px", lineHeight: "1.7", color: theme.textPrimary }}>
        Nine years designing products people use to learn and to trade. Three in edtech, six in crypto. Wallet onboarding, trading interfaces, gamified finance. Work where a confusing screen costs users real money.
      </p>
      <p className="mb-3" style={{ fontSize: "13px", lineHeight: "1.7", color: theme.textPrimary }}>
        I build tools to work more efficiently. The experiments in this portfolio started as things I needed: a 3D renderer to test a motion idea, a voxelizer to explore a concept fast. AI is in my workflow at every layer too. Research, writing, prototyping, scaffolding. Between the two, the gap between idea and something testable stays small.
      </p>
      <p className="mb-3" style={{ fontSize: "13px", lineHeight: "1.7", color: theme.textPrimary }}>
        {isMobile
          ? "Tap the windows below to explore."
          : "Poke around. The windows are draggable."}
      </p>
      <p className="mb-0" style={{ fontSize: "13px", lineHeight: "1.7", color: theme.textPrimary }}>
        Based in Hong Kong. Open to senior product design roles, on-site or remote. Find me on{" "}
        <a href="https://www.linkedin.com/in/roy-wong-05345311b/" target="_blank" rel="noopener noreferrer" className="underline transition-colors" style={{ color: theme.linkColor }}>
          LinkedIn
        </a>
        , or{" "}
        <a href="mailto:whyroy@gmail.com" className="underline transition-colors" style={{ color: theme.linkColor }}>
          email me
        </a>
        .
      </p>
    </div>
  );
}

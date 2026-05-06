import React from "react";
import { useIsMobile } from "../../hooks/useIsMobile";
import { useTheme } from "../../hooks/useTheme";

export function AboutWindow() {
  const isMobile = useIsMobile();
  const { theme } = useTheme();

  return (
    <div className="p-5" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
      <p className="mb-3" style={{ fontSize: "13px", lineHeight: "1.7", color: theme.textPrimary }}>
        I'm Roy — a senior product designer with 9 years shipping end-to-end digital products in fintech and Web3. Trading platforms, crypto wallets, onboarding flows — I've led design across the full stack at Crypto.com and Animoca Brands, working directly with engineering to get things built right.
      </p>
      <p className="mb-3" style={{ fontSize: "13px", lineHeight: "1.7", color: theme.textPrimary }}>
        I also build. The interactive experiments in this portfolio — type renderers, 3D voxelizers, shader tools — aren't side projects. They're how I think. Writing code makes me a faster prototyper, a better collaborator with engineers, and someone who cares about what actually ships.
      </p>
      <p className="mb-3" style={{ fontSize: "13px", lineHeight: "1.7", color: theme.textPrimary }}>
        {isMobile
          ? "Tap the windows below to explore."
          : "Poke around — the windows are draggable."}
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

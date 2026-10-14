import React from "react";
import { useTheme } from "../../hooks/useTheme";

export function AboutWindow() {
  const { theme } = useTheme();

  return (
    <div style={{ maxWidth: "620px", fontFamily: "'IBM Plex Sans', sans-serif" }}>
      <p className="mb-5" style={{ fontSize: "16px", lineHeight: "1.7", color: theme.textPrimary }}>
        Nine years designing products people use to learn and to trade. Three in edtech, six in crypto. Wallet onboarding, trading interfaces, gamified finance. Work where a confusing screen costs users real money.
      </p>
      <p className="mb-5" style={{ fontSize: "16px", lineHeight: "1.7", color: theme.textPrimary }}>
        I build tools to work more efficiently. AI is in my workflow at every layer too. Research, writing, prototyping, scaffolding. Between the two, the gap between idea and something testable stays small.
      </p>
      <p className="mb-5" style={{ fontSize: "16px", lineHeight: "1.7", color: theme.textPrimary }}>
        I also ship my own products.{" "}
        <a
          href="/projects/1-good-thing"
          onClick={(e) => {
            e.preventDefault();
            window.dispatchEvent(new CustomEvent("portfolio:navigate", { detail: { id: "oneGoodThing" } }));
          }}
          className="underline transition-colors"
          style={{ color: theme.linkColor }}
        >
          1 Good Thing
        </a>{" "}
        is an iOS app where you draw one good thing a day instead of writing it down. I designed, built, and marketed it solo, and it passed 10k downloads in its first three months.
      </p>
      <p className="mb-0" style={{ fontSize: "16px", lineHeight: "1.7", color: theme.textPrimary }}>
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

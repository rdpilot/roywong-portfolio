import React from "react";
import { useIsMobile } from "../../hooks/useIsMobile";
import { useTheme } from "../../hooks/useTheme";
import { useQuickLook } from "../QuickLookOverlay";
import { AutoPlayVideo } from "../AutoPlayVideo";
import {
  ProjectHeader,
  ImageWell,
  SectionRule,
  InfoPanel,
  PropRow,
} from "./ProjectLayout";

import imgLeaderboard from "figma:asset/f88735de614a52d65a6ee1166a70a9fa08e21e98.png";
import imgTournamentStats from "figma:asset/2fc0e2329cc3e93865d616351ac5a155de21d0d9.png";
import imgTournament from "figma:asset/77158358b20c4eac75ecaad21fccdbdd3f174f73.png";

export function SprayAndPrayWindow() {
  const isMobile = useIsMobile();
  const { theme } = useTheme();
  const { openQuickLook } = useQuickLook();

  const ql = (src: string, alt: string, type: "image" | "video" = "image") =>
    () => openQuickLook({ src, alt, type });

  return (
    <div
      className="overflow-auto"
      style={{
        background: theme.windowContentBg,
        height: "100%",
        fontFamily: "'IBM Plex Sans', sans-serif",
      }}
    >
      <ProjectHeader
        title="Spray & Pray"
        company="Animoca"
        description="An innovative no-loss social trading crypto platform, allowing you to trade big and dream even bigger. All of the fun, none of the risk, real prizes to win."
        tags={["Mobile & Desktop App", "Web3", "Design System", "UI Motion"]}
        theme={theme}
      />

      <div className="flex flex-col gap-4" style={{ padding: "16px 16px 24px" }}>
        <ImageWell theme={theme} aspectRatio="16/10" onClick={ql("https://i.imgur.com/rO78uX9.mp4", "Spray & Pray — Hero", "video")}>
          <AutoPlayVideo
            src="https://i.imgur.com/rO78uX9.mp4"
            style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
          />
        </ImageWell>

        <SectionRule label="Design Strategy" theme={theme} />

        <div style={{ display: isMobile ? "flex" : "grid", gridTemplateColumns: "1fr 1fr", flexDirection: "column", gap: "8px" }}>
          <ImageWell theme={theme} onClick={ql("https://i.imgur.com/NjmcraP.mp4", "Design Strategy", "video")}>
            <AutoPlayVideo
              src="https://i.imgur.com/NjmcraP.mp4"
              style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
            />
          </ImageWell>
          <div className="flex flex-col gap-2">
            <PropRow label="Mission" value="To demystify crypto trading for beginners by removing the primary barrier to entry: financial risk." theme={theme} />
            <PropRow label="Solution" value='A "Free-to-Play" ecosystem where users collect 5 chips every 12 hours to participate in market movements.' theme={theme} />
            <PropRow label="Outcome" value="560 participants in the first tournament. The no-loss model worked: users traded aggressively knowing they couldn't lose real money." theme={theme} />
          </div>
        </div>

        <SectionRule label="Mobile Experience" theme={theme} />

        <div style={{ display: isMobile ? "flex" : "grid", gridTemplateColumns: "1fr 1fr", flexDirection: "column", height: isMobile ? undefined : "280px", gap: "8px" }}>
          <ImageWell theme={theme} style={isMobile ? { minHeight: "280px" } : undefined} onClick={ql("https://i.imgur.com/uf9h04I.mp4", "Mobile Experience — Video", "video")}>
            <AutoPlayVideo
              className="rounded-[16px]"
              src="https://i.imgur.com/uf9h04I.mp4"
              style={{ maxWidth: "100%", maxHeight: "100%", width: "auto", height: "auto", objectFit: "contain", display: "block", margin: "0 auto" }}
            />
          </ImageWell>
          <ImageWell theme={theme} style={isMobile ? { minHeight: "280px" } : undefined} onClick={ql("https://i.imgur.com/O74Q0Ds.png", "Mobile Experience — Screenshot")}>
            <img src="https://i.imgur.com/O74Q0Ds.png" alt="Spray & Pray mobile trading interface showing live chart and chip balance" loading="lazy" style={{ height: isMobile ? "auto" : "100%", maxHeight: isMobile ? "260px" : undefined, width: "auto", objectFit: "contain", margin: "0 auto", display: "block" }} />
          </ImageWell>
        </div>

        <InfoPanel title="The Loop" theme={theme}>
          Trade &rarr; Win/Lose &rarr; Return in 12h for more chips / Buy chips from us &rarr; Repeat.
        </InfoPanel>

        <SectionRule label="Trading Interface" theme={theme} />

        <div style={{ display: isMobile ? "flex" : "grid", gridTemplateColumns: "1fr 1fr", flexDirection: "column", gap: "8px" }}>
          <ImageWell theme={theme} style={{ flex: 1, minWidth: 0 }} onClick={ql("https://i.imgur.com/RNWSddS.mp4", "Trading Interface", "video")}>
            <AutoPlayVideo className="rounded-[24px] rounded-[32px]"
              src="https://i.imgur.com/RNWSddS.mp4"
              style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
            />
          </ImageWell>
          <div className="flex flex-col gap-2 flex-1" style={{ minWidth: 0 }}>
            <InfoPanel title="Sentiment-Driven UI" theme={theme}>
              Large, unmistakable "Long" (Green) and "Short" (Red) UI to help beginners quickly associate market direction with action.
            </InfoPanel>
            <div className="flex gap-2 flex-1">
              <ImageWell theme={theme} style={{ flex: 1 }} onClick={ql("https://i.imgur.com/YvGLpv0.mp4", "Sentiment-Driven UI", "video")}>
                <AutoPlayVideo
                  src="https://i.imgur.com/YvGLpv0.mp4"
                  style={{ width: "100%", height: "100%", objectFit: "contain", display: "block", margin: 0, padding: 0 }}
                />
              </ImageWell>
            </div>
          </div>
        </div>

        <InfoPanel title="Challenge" theme={theme}>
          The trading screen needed to pack a lot of functionality — live charts, order entry, position tracking, sentiment indicators — all into a single view with very limited screen real estate. After several rounds of internal testing and iteration, we landed on this final layout that balances information density with clarity.
        </InfoPanel>

        <SectionRule label="Leaderboard & Ranking" theme={theme} />

        <InfoPanel title="Aesthetic" theme={theme}>
          We are going for the dark mode professional, High-contrast, "Bloomberg-meets-Gaming" aesthetics.
        </InfoPanel>

        <div style={{ display: isMobile ? "flex" : "grid", gridTemplateColumns: "1fr 1fr", flexDirection: "column", gap: "8px" }}>
          <ImageWell theme={theme} padding="12px" onClick={ql(imgLeaderboard, "Leaderboard")}>
            <img src={imgLeaderboard} alt="Spray & Pray competitive leaderboard ranking traders by PnL performance" loading="lazy" style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }} />
          </ImageWell>
          <div style={{ display: "grid", gridTemplateRows: "1fr 1fr", gap: "8px" }}>
            <InfoPanel theme={theme} centered>
              Higher PnL &rarr; High rank &rarr; Bigger prize
            </InfoPanel>
            <ImageWell theme={theme} padding="12px" onClick={ql(imgTournamentStats, "Tournament Stats")}>
              <img src={imgTournamentStats} alt="Tournament statistics showing prize pool distribution and player rankings" loading="lazy" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
            </ImageWell>
          </div>
        </div>

        <ImageWell theme={theme} aspectRatio="16/9" padding="24px" onClick={ql(imgTournament, "Tournament View")}>
          <img className="rounded-[16px]" src={imgTournament} alt="Full tournament overview with bracket-style competitive trading view" loading="lazy" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
        </ImageWell>
      </div>
    </div>
  );
}
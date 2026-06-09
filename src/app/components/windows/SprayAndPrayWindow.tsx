import React from "react";
import { useIsMobile } from "../../hooks/useIsMobile";
import { useTheme } from "../../hooks/useTheme";
import { useQuickLook } from "../QuickLookOverlay";
import { AutoPlayVideo } from "../AutoPlayVideo";
import { NextProject } from "../NextProject";
import {
  ProjectHeader,
  ImageWell,
  SectionRule,
  InfoPanel,
} from "./ProjectLayout";

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
        description="Learning to trade is expensive. Spray &amp; Pray is a starter town (新手村) for new traders: practice perps with real prizes, no real losses. Paper trading alone isn't compelling, so we tied wins to real rewards ($ETH, $PENGU, $USDC). The goal: bring beginners into trading through play, before they touch their own money."
        tags={["Mobile & Desktop App", "Web3", "Design System", "UI Motion"]}
        theme={theme}
      />

      <div className="flex flex-col gap-4" style={{ padding: "16px 16px 24px" }}>
        <ImageWell theme={theme} aspectRatio="16/10" onClick={ql("https://i.imgur.com/rO78uX9.mp4", "Spray & Pray Hero", "video")}>
          <AutoPlayVideo
            src="https://i.imgur.com/rO78uX9.mp4"
            style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
          />
        </ImageWell>

        <SectionRule label="Results" theme={theme} />

        <div style={{ display: isMobile ? "flex" : "grid", gridTemplateColumns: "1fr 1fr", flexDirection: "column", gap: "8px" }}>
          {[
            { stat: "5×", label: "Avg trades per session" },
            { stat: "3%", label: "Free-to-paid conversion" },
          ].map(({ stat, label }) => (
            <InfoPanel key={label} theme={theme} centered>
              <span style={{ display: "block", fontSize: 36, fontWeight: 700, color: theme.windowTitleText, fontFamily: "'IBM Plex Mono', monospace", lineHeight: 1, marginBottom: 6 }}>{stat}</span>
              <span style={{ fontSize: 11, color: theme.textMuted }}>{label}</span>
            </InfoPanel>
          ))}
        </div>

        <InfoPanel theme={theme}>
          Players got liquidated fast and came back. The loudest signal was wanting shorter tournaments for quicker prizes. The reward loop was working. It just needed tightening.
        </InfoPanel>

        <SectionRule label="Chip Economy" theme={theme} />

        <InfoPanel title="How It Works" theme={theme}>
          Players receive a free daily chip allowance every 12 hours. Chips are the entry fee into tournaments. Pick a direction, trade, and climb the leaderboard. The higher your PnL, the bigger the prize. Get liquidated? Re-enter as long as you have chips. Run out? Wait for the free daily allowance or buy more.
        </InfoPanel>

        <ImageWell theme={theme} onClick={() => openQuickLook({ src: "/the-loop.png", alt: "Chip Economy Loop", type: "image", bg: "#000000" })} style={{ height: isMobile ? "auto" : "320px" }}>
          <img src="/the-loop.png" alt="Chip economy loop flowchart: daily allowance → enter tournament → trade → win/lose → climb leaderboard or run out of chips" loading="lazy" style={{ maxHeight: "300px", width: "auto", objectFit: "contain", margin: "0 auto", display: "block" }} />
        </ImageWell>

        <div style={{ display: isMobile ? "flex" : "grid", gridTemplateColumns: "1fr 1fr", flexDirection: "column", gap: "8px" }}>
          <div className="flex flex-col gap-2">
            <ImageWell theme={theme} style={isMobile ? { minHeight: "240px" } : undefined} onClick={ql("https://i.imgur.com/uf9h04I.mp4", "Daily Chip Top-Up", "video")}>
              <AutoPlayVideo
                className="rounded-[16px]"
                src="https://i.imgur.com/uf9h04I.mp4"
                style={{ maxWidth: "100%", maxHeight: "100%", width: "auto", height: "auto", objectFit: "contain", display: "block", margin: "0 auto" }}
              />
            </ImageWell>
            <InfoPanel title="Daily Top-Up" theme={theme}>
              Chips replenish every 12 hours automatically. The countdown timer creates a daily return habit.
            </InfoPanel>
          </div>
          <div className="flex flex-col gap-2">
            <ImageWell theme={theme} style={isMobile ? { minHeight: "240px" } : undefined} onClick={ql("https://i.imgur.com/O74Q0Ds.png", "Tournament Entry")}>
              <img src="https://i.imgur.com/O74Q0Ds.png" alt="Spray & Pray tournament entry screen showing chip balance and buy-in options" loading="lazy" style={{ height: isMobile ? "auto" : "100%", maxHeight: isMobile ? "220px" : undefined, width: "auto", objectFit: "contain", margin: "0 auto", display: "block" }} />
            </ImageWell>
            <InfoPanel title="Tournament Entry" theme={theme}>
              Each tournament has a fixed chip buy-in, prize pool, and timer. Spending chips creates commitment. Players trade more boldly because they've already bought in.
            </InfoPanel>
          </div>
        </div>

        <SectionRule label="Trading Interface" theme={theme} />

        <div style={{ display: isMobile ? "flex" : "grid", gridTemplateColumns: "1fr 1fr", flexDirection: "column", gap: "8px" }}>
          <ImageWell theme={theme} style={{ flex: 1, minWidth: 0 }} onClick={ql("/enter-tournament.mov", "Enter Tournament", "video")}>
            <AutoPlayVideo
              src="/enter-tournament.mov"
              style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
            />
          </ImageWell>
          <div className="flex flex-col gap-2">
            <InfoPanel title="Home Screen" theme={theme}>
              The home screen keeps it simple: collect your chips, pick a tournament, and enter. Two actions, no distractions. Users are never overwhelmed before they even start trading.
            </InfoPanel>
            <InfoPanel title="Challenge" theme={theme}>
              At 1000x leverage, PnL moves in seconds. We originally put active positions on a separate screen, but that meant switching screens to close a trade. Too slow when a position can flip in a heartbeat. We moved active positions directly onto the trading screen, above the chart. More information, less space, but users can lock in profit without leaving the view.
            </InfoPanel>
          </div>
        </div>

        <div style={{ display: isMobile ? "flex" : "grid", gridTemplateColumns: "1fr 1fr", flexDirection: "column", gap: "8px" }}>
          <ImageWell theme={theme} style={{ flex: 1, minWidth: 0 }} onClick={ql("/social-feed.mov", "Social Feed", "video")}>
            <AutoPlayVideo
              src="/social-feed.mov"
              style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
            />
          </ImageWell>
          <InfoPanel title="Social Feed" theme={theme}>
            New traders don't know what a good position looks like. Showing live trades from top-ranked players gives beginners a reference point without a tutorial. No feature explanation needed. Watch, copy, learn by doing.
          </InfoPanel>
        </div>

        <InfoPanel title="Gamified Feedback" theme={theme}>
          Every outcome is animated and felt. Win, lose, or get wiped out. The interface reacts. Motion makes each trade memorable, turning what could be a dry data screen into something closer to a game.
        </InfoPanel>

        <div style={{ display: isMobile ? "flex" : "grid", gridTemplateColumns: "1fr 1fr 1fr", flexDirection: "column", gap: "8px" }}>
          <ImageWell theme={theme} onClick={ql("/profit.mov", "Profit", "video")}>
            <AutoPlayVideo src="/profit.mov" style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }} />
          </ImageWell>
          <ImageWell theme={theme} onClick={ql("/loss.mov", "Loss", "video")}>
            <AutoPlayVideo src="/loss.mov" style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }} />
          </ImageWell>
          <ImageWell theme={theme} onClick={ql("/liquidated.mov", "Liquidated", "video")}>
            <AutoPlayVideo src="/liquidated.mov" style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }} />
          </ImageWell>
        </div>

        <SectionRule label="Leaderboard & Ranking" theme={theme} />

        <div style={{ display: isMobile ? "flex" : "grid", gridTemplateColumns: "1fr 1fr", flexDirection: "column", gap: "8px" }}>
          <ImageWell theme={theme} onClick={ql("/leaderboard.mov", "Leaderboard", "video")}>
            <AutoPlayVideo src="/leaderboard.mov" style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }} />
          </ImageWell>
          <div className="flex flex-col gap-2">
            <InfoPanel theme={theme} centered>
              Higher PnL &rarr; High rank &rarr; Bigger prize
            </InfoPanel>
            <InfoPanel title="Why It Works" theme={theme}>
              Rank is the primary motivator. Seeing your name move up the leaderboard in real time pushes users to trade more, take bigger positions, and return for the next tournament. The higher your PnL rank, the larger your share of the prize pool. Every trade is a competitive act.
            </InfoPanel>
          </div>
        </div>

        <SectionRule label="Desktop" theme={theme} />

        <InfoPanel title="Cards Scale Up" theme={theme}>
          Because the mobile UI was built on a card-based layout, adapting it to desktop was straightforward. The same components rearrange into a wider canvas without redesigning from scratch. More space, same system.
        </InfoPanel>

        <ImageWell theme={theme} aspectRatio="16/9" padding="24px" onClick={ql(imgTournament, "Tournament View")}>
          <img className="rounded-[16px]" src={imgTournament} alt="Full tournament overview with bracket-style competitive trading view" loading="lazy" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
        </ImageWell>

        <NextProject id="perpetualTrading" label="Perpetual Trading" />
      </div>
    </div>
  );
}
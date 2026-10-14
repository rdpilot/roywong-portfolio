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
  DecisionBlock,
  StatCard,
} from "./ProjectLayout";


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
        company="Animoca Brands"
        role="Sole product designer"
        description="Learning to trade is expensive. Spray &amp; Pray is a starter town (新手村) for new traders: practice perps with real prizes, no real losses. Paper trading alone isn't compelling, so we tied wins to real rewards ($ETH, $PENGU, $USDC). The goal: bring beginners into trading through play, before they touch their own money."
        tags={["Mobile & Desktop App", "Web3", "Design System", "UI Motion"]}
        theme={theme}
      />

      <div className="flex flex-col gap-6" style={{ padding: "32px 0 0" }}>
        <ImageWell theme={theme} aspectRatio="16/10" onClick={ql("https://i.imgur.com/rO78uX9.mp4", "Spray & Pray Hero", "video")}>
          <AutoPlayVideo
            src="https://i.imgur.com/rO78uX9.mp4"
            style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
          />
        </ImageWell>

        <SectionRule label="Results" theme={theme} />

        <div style={{ display: isMobile ? "flex" : "grid", gridTemplateColumns: "1fr 1fr", flexDirection: "column", gap: "24px 40px" }}>
          <StatCard theme={theme} stat="5×" label="Average trades per session" />
          <StatCard theme={theme} stat="3%" label="Free-to-paid conversion" />
        </div>

        <InfoPanel theme={theme}>
          Players got liquidated fast and came back. The loudest signal was wanting shorter tournaments for quicker prizes. The reward loop was working. It just needed tightening.
        </InfoPanel>

        <SectionRule label="Chip Economy" theme={theme} />

        <ImageWell theme={theme} onClick={() => openQuickLook({ src: "/the-loop.png", alt: "Chip Economy Loop", type: "image", bg: "#000000" })} style={{ height: isMobile ? "auto" : "320px" }}>
          <img src="/the-loop.png" alt="Chip economy loop flowchart: daily allowance → enter tournament → trade → win/lose → climb leaderboard or run out of chips" loading="lazy" style={{ maxHeight: "300px", width: "auto", objectFit: "contain", margin: "0 auto", display: "block" }} />
        </ImageWell>

        <InfoPanel title="How It Works" theme={theme}>
          Players receive a free daily chip allowance. Chips are the entry fee into tournaments. Pick a direction, trade, and climb the leaderboard. The higher your PnL, the bigger the prize. Get liquidated? Re-enter as long as you have chips. Run out? Wait for the free daily allowance or buy more.
        </InfoPanel>


        <SectionRule label="Design Decisions" theme={theme} />

        <DecisionBlock
          theme={theme}
          title="How long should a tournament be?"
          options={[
            { label: "A", text: "Minutes to under 24 hours. Short and intense." },
            { label: "B", text: "Weekly rounds. Softer pacing, but engagement drops between entry and result." },
          ]}
          outcome="We chose short. 1000x leverage works as adrenaline, not as a weeklong wait."
        />

        <DecisionBlock
          theme={theme}
          title="Should we give chips back after a loss?"
          options={[
            { label: "A", text: "Yes. Softens the loss, keeps users playing, looks good on re-entry rate." },
            { label: "B", text: "No. Daily allowance only, paywall after that." },
          ]}
          outcome="We chose B. Rewarding losses trains the wrong behavior and undermines the tournament's stakes. The daily reset gives a softer landing without breaking the economy."
        />

        <div style={{ display: isMobile ? "flex" : "grid", gridTemplateColumns: "1fr 1fr", flexDirection: "column", gap: "24px 40px", alignItems: "start" }}>
          <div className="flex flex-col gap-4">
            <ImageWell theme={theme} onClick={ql("/Pray Trade Overlay_long.png", "Betting UI")}>
              <img src="/Pray Trade Overlay_long.png" alt="Bet and leverage sliders in one gesture" loading="lazy" style={{ maxWidth: "100%", maxHeight: "100%", width: "auto", height: "auto", objectFit: "contain", display: "block", margin: "0 auto" }} />
            </ImageWell>
            <InfoPanel title="Input UI had to match" theme={theme}>
              A slider sets bet and leverage in one gesture. No keyboard, no thinking in numbers.
            </InfoPanel>
          </div>
          <div className="flex flex-col gap-4">
            <ImageWell theme={theme} onClick={ql("/buy chip.png", "Buy Chips UI")}>
              <img src="/buy chip.png" alt="Buy chips screen showing daily allowance and purchase options" loading="lazy" style={{ maxWidth: "100%", maxHeight: "100%", width: "auto", height: "auto", objectFit: "contain", display: "block", margin: "0 auto" }} />
            </ImageWell>
          </div>
        </div>

        <SectionRule label="Trading Interface" theme={theme} />

        <div style={{ display: isMobile ? "flex" : "grid", gridTemplateColumns: "1fr 1fr", flexDirection: "column", gap: "32px 40px", alignItems: "start" }}>
          <div className="flex flex-col gap-4">
            <ImageWell theme={theme} onClick={ql("/enter-tournament.mov", "Enter Tournament", "video")}>
              <AutoPlayVideo src="/enter-tournament.mov" style={{ display: "block" }} />
            </ImageWell>
            <InfoPanel title="Home Screen" theme={theme}>
              The home screen keeps it simple: collect your chips, pick a tournament, and enter. Two actions, no distractions. Users are never overwhelmed before they even start trading.
            </InfoPanel>
            <InfoPanel title="Challenge" theme={theme}>
              At 1000x leverage, PnL moves in seconds. We originally put active positions on a separate screen, but that meant switching screens to close a trade. Too slow when a position can flip in a heartbeat. We moved active positions directly onto the trading screen, above the chart. More information, less space, but users can lock in profit without leaving the view.
            </InfoPanel>
          </div>
          <div className="flex flex-col gap-4">
            <ImageWell theme={theme} onClick={ql("/liquidated.mov", "Liquidated", "video")}>
              <AutoPlayVideo src="/liquidated.mov" style={{ display: "block" }} />
            </ImageWell>
            <InfoPanel title="Gamified Feedback" theme={theme}>
              Every outcome is animated and felt. Win, lose, or get wiped out. The interface reacts. Motion makes each trade memorable, turning what could be a dry data screen into something closer to a game.
            </InfoPanel>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <ImageWell theme={theme} onClick={ql("/social-feed.mov", "Social Feed", "video")}>
            <AutoPlayVideo src="/social-feed.mov" style={{ display: "block" }} />
          </ImageWell>
          <div style={{ maxWidth: "640px" }}>
            <InfoPanel title="Social Feed" theme={theme}>
              New traders don't know what a good position looks like. Showing live trades from top-ranked players gives beginners a reference point without a tutorial. No feature explanation needed. Watch, copy, learn by doing.
            </InfoPanel>
          </div>
        </div>

        <SectionRule label="Leaderboard & Ranking" theme={theme} />

        <div style={{ display: isMobile ? "flex" : "grid", gridTemplateColumns: "1fr 1fr", flexDirection: "column", gap: "24px 40px" }}>
          <ImageWell theme={theme} onClick={ql("/leaderboard.mov", "Leaderboard", "video")}>
            <AutoPlayVideo src="/leaderboard.mov" style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }} />
          </ImageWell>
          <div className="flex flex-col gap-4">
            <InfoPanel theme={theme} centered>
              Higher PnL &rarr; Higher rank &rarr; Bigger prize
            </InfoPanel>
            <InfoPanel title="Why It Works" theme={theme}>
              Rank is the primary motivator. Seeing your name move up the leaderboard in real time pushes users to trade more, take bigger positions, and return for the next tournament. The higher your PnL rank, the larger your share of the prize pool. Every trade is a competitive act.
            </InfoPanel>
          </div>
        </div>

        <NextProject id="perpetualTrading" label="Perpetual Trading" />
      </div>
    </div>
  );
}
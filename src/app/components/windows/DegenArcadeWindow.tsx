import React from "react";
import { useIsMobile } from "../../hooks/useIsMobile";
import { useTheme } from "../../hooks/useTheme";
import type { ThemeTokens } from "../../hooks/useTheme";
const isLight = (t: ThemeTokens) => t.mode === "light";
import { useQuickLook } from "../QuickLookOverlay";
import { AutoPlayVideo } from "../AutoPlayVideo";
import {
  ProjectHeader,
  ImageWell,
  SectionRule,
  InfoPanel,
  DecisionBlock,
} from "./ProjectLayout";

function HeroSection({ onClick }: { theme?: ThemeTokens; onClick?: () => void }) {
  return (
    <div
      onClick={onClick}
      style={{ overflow: "hidden", borderRadius: "12px", cursor: onClick ? "pointer" : undefined }}
    >
      <AutoPlayVideo
        src="https://i.imgur.com/CCsujLL.mp4"
        style={{ display: "block" }}
      />
    </div>
  );
}

export function DegenArcadeWindow() {
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
        title="Degen Arcade"
        company="Crypto.com"
        role="Sole product designer"
        description="Memecoins are exciting and dangerous in equal measure. Beginners want in, but scam tokens, rug pulls, and contract verification kill the fun before it starts. Degen Arcade removes the security layer from the user's hands entirely. Pre-vetted tokens, one-swipe trading, no contract addresses to check."
        tags={["Mobile Application", "WEB3 Application", "UI Motion"]}
        theme={theme}
      />

      <div className="flex flex-col gap-6" style={{ padding: "32px 0 0" }}>
        <HeroSection onClick={ql("https://i.imgur.com/CCsujLL.mp4", "Degen Arcade: Hero", "video")} />

        <SectionRule label="Results" theme={theme} />

        <InfoPanel theme={theme}>
          Zero paid marketing. Players found the product, traded, and came back. The arcade mechanic drove organic volume from day one.
        </InfoPanel>

        <SectionRule label="The Opportunity" theme={theme} />

        <div style={{ display: isMobile ? "flex" : "grid", gridTemplateColumns: "1fr 1fr", flexDirection: "column", gap: "24px 40px" }}>
          <ImageWell theme={theme} onClick={ql("/unibot.png", "UniBot: Telegram memecoin trading bot")}>
            <img src="/unibot.png" alt="UniBot Sniper Telegram bot interface for memecoin trading" loading="lazy" style={{ maxWidth: "100%", maxHeight: "100%", width: "auto", height: "auto", objectFit: "contain", display: "block", margin: "0 auto" }} />
          </ImageWell>
          <InfoPanel title="Why we built this" theme={theme}>
            In June 2023, people were trading memecoins heavily on UniBot, a Telegram bot charging 1% per transaction. It was making millions in revenue. The UX was a chat window. We saw the opportunity: bring that same memecoin energy into a proper mobile app, with a better experience and a monetization model to match.
          </InfoPanel>
        </div>

        <SectionRule label="Core Flow" theme={theme} />

        <div style={{ display: isMobile ? "flex" : "grid", gridTemplateColumns: "1fr 1fr", flexDirection: "column", minHeight: isMobile ? undefined : "320px", gap: "24px 40px" }}>
          <ImageWell theme={theme} style={isMobile ? { minHeight: "320px" } : { paddingTop: "4px", paddingBottom: "4px" }} onClick={ql("https://i.imgur.com/kOfXQck.mp4", "Core Flow", "video")}>
            <AutoPlayVideo
              src="https://i.imgur.com/kOfXQck.mp4"
              style={{ maxWidth: "100%", maxHeight: "100%", width: "auto", height: "auto", objectFit: "contain", display: "block", margin: "0 auto" }}
            />
          </ImageWell>
          <div className="flex flex-col gap-4">
            <InfoPanel title="1 · Discover" theme={theme}>
              Browse the curated Arcade Floor: a live feed of tokens that have already passed automated security checks. No contract addresses to verify, no scam tokens to dodge.
            </InfoPanel>
            <InfoPanel title="2 · Swipe to Trade" theme={theme}>
              A swipe executes the trade. Fast enough for impulse, deliberate enough to prevent accidents. Minimizing steps also minimizes the chance of making a mistake.
            </InfoPanel>
            <InfoPanel title="3 · Review & Confirm" theme={theme}>
              Market cap, liquidity, and volume surface at the point of decision. Users get the data they need exactly when they need it, without hunting for it.
            </InfoPanel>
          </div>
        </div>

        <SectionRule label="Design Decision" theme={theme} />

        <DecisionBlock
          theme={theme}
          title="Should a memecoin product look serious?"
          options={[
            { label: "A", text: 'Polished, serious trading UI. Trustworthy, signals "we handle real money."' },
            { label: "B", text: "Retro arcade aesthetic. Matches memecoin culture: fun, a bit absurd, unapologetically speculative." },
          ]}
          outcome="We chose B. Memecoin trading isn't serious trading. The users wanted something that matched the energy of the culture. A polished UI would've felt off-brand. The aesthetic was a positioning decision: it signaled to the community we were part of the culture, not a serious exchange dabbling in it."
        />

        <div style={{ display: isMobile ? "flex" : "grid", gridTemplateColumns: "1fr 1fr", flexDirection: "column", gap: "24px 40px" }}>
          <div className="flex flex-col gap-2">
            <ImageWell theme={theme} style={{ height: isMobile ? "240px" : "360px" }} onClick={ql("/optionA.png", "Option A: Polished trading UI")}>
            <img src="/optionA.png" alt="Option A: clean, serious memecoin trading interface" loading="lazy" style={{ maxWidth: "100%", maxHeight: "100%", width: "auto", height: "auto", objectFit: "contain", display: "block", margin: "0 auto" }} />
          </ImageWell>
            <div style={{ fontSize: "13px", color: theme.textMuted }}>Option A</div>
          </div>
          <div className="flex flex-col gap-2">
            <ImageWell theme={theme} style={{ height: isMobile ? "240px" : "360px" }} onClick={ql("/optionB.png", "Option B: Degen Arcade")}>
            <img src="/optionB.png" alt="Option B: retro arcade aesthetic with character select and dark theme" loading="lazy" style={{ maxWidth: "100%", maxHeight: "100%", width: "auto", height: "auto", objectFit: "contain", display: "block", margin: "0 auto" }} />
          </ImageWell>
            <div style={{ fontSize: "13px", color: theme.textMuted }}>Option B</div>
          </div>
        </div>

        <SectionRule label="Process & Testing" theme={theme} />

        <div style={{ display: isMobile ? "flex" : "grid", gridTemplateColumns: "1fr 1fr", flexDirection: "column", gap: "24px 40px" }}>
          <ImageWell theme={theme} onClick={ql("/streetfighter.png", "Street Fighter player select reference")}>
            <img src="/streetfighter.png" alt="Street Fighter player select, the reference behind the character picker" loading="lazy" style={{ maxWidth: "100%", maxHeight: "100%", width: "auto", height: "auto", objectFit: "contain", display: "block", margin: "0 auto" }} />
          </ImageWell>
          <InfoPanel theme={theme}>
            We prototyped a character select screen modeled on Street Fighter's player pick: Chad, Doomer, Boomer, each surfacing a different token risk profile. Memecoin trading is a game. Pick your fighter. Culturally on point. Confused every first-time user who hadn't figured out the product yet.
          </InfoPanel>
        </div>

        <SectionRule label="Explorations" theme={theme} />

        <div style={{ display: isMobile ? "flex" : "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", flexDirection: "column", height: isMobile ? undefined : "260px", gap: "16px" }}>
          <ImageWell theme={theme} style={isMobile ? { minHeight: "280px" } : undefined} onClick={ql("https://i.imgur.com/iGPCmH0.png", "Degen in the Dark Room 1")}>
            <img src="https://i.imgur.com/iGPCmH0.png" alt="Illustration of a lone trader in a dimly lit room surrounded by glowing chart screens" loading="lazy" style={{ maxWidth: "100%", maxHeight: "100%", width: "auto", height: "auto", objectFit: "contain", display: "block", margin: "0 auto" }} />
          </ImageWell>
          <ImageWell theme={theme} style={isMobile ? { minHeight: "280px" } : undefined} onClick={ql("https://i.imgur.com/91HNrOB.png", "Degen in the Dark Room 2")}>
            <img src="https://i.imgur.com/91HNrOB.png" alt="Dark room memecoin trading illustration capturing underground crypto culture aesthetic" loading="lazy" style={{ maxWidth: "100%", maxHeight: "100%", width: "auto", height: "auto", objectFit: "contain", display: "block", margin: "0 auto" }} />
          </ImageWell>
          <ImageWell theme={theme} style={isMobile ? { minHeight: "280px" } : undefined} onClick={ql("https://i.imgur.com/PJCSNF5.png", "Degen in the Dark Room 3")}>
            <img src="https://i.imgur.com/PJCSNF5.png" alt="Dark room memecoin trading illustration showing immersive market atmosphere" loading="lazy" style={{ maxWidth: "100%", maxHeight: "100%", width: "auto", height: "auto", objectFit: "contain", display: "block", margin: "0 auto" }} />
          </ImageWell>
          <ImageWell theme={theme} style={isMobile ? { minHeight: "280px" } : undefined} onClick={ql("https://i.imgur.com/C8FZW3n.png", "Degen in the Dark Room 4")}>
            <img src="https://i.imgur.com/C8FZW3n.png" alt="Dark room memecoin trading scene capturing crypto culture energy" loading="lazy" style={{ maxWidth: "100%", maxHeight: "100%", width: "auto", height: "auto", objectFit: "contain", display: "block", margin: "0 auto" }} />
          </ImageWell>
        </div>

        <InfoPanel title="Degen in the Dark Room" theme={theme}>
          These visuals explored the narrative of a lone degen trading memecoins from a dimly lit room: screens glowing, charts flickering, fully immersed in the chaos of the market. The illustrations aimed to capture the raw, underground energy of memecoin culture but were ultimately set aside as the product shifted toward a more approachable, arcade-style identity.
        </InfoPanel>

      </div>
    </div>
  );
}
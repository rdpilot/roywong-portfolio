import React from "react";
import { useIsMobile } from "../../hooks/useIsMobile";
import { useTheme } from "../../hooks/useTheme";
import type { ThemeTokens } from "../../hooks/useTheme";
const isLight = (t: ThemeTokens) => t.mode !== "dark" && t.mode !== "hailmary";
import { useQuickLook } from "../QuickLookOverlay";
import { AutoPlayVideo } from "../AutoPlayVideo";
import {
  ProjectHeader,
  ImageWell,
  SectionRule,
  InfoPanel,
  PropRow,
} from "./ProjectLayout";

function HeroSection({ theme, onClick }: { theme: ThemeTokens; onClick?: () => void }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: "#151515",
        borderRadius: "2px",
        border: `1px solid ${isLight(theme) ? "#999" : "#111"}`,
        boxShadow:
          isLight(theme)
            ? "inset 1px 1px 3px rgba(0,0,0,0.18)"
            : "inset 1px 1px 4px rgba(0,0,0,0.5)",
        overflow: "hidden",
        position: "relative",
        cursor: onClick ? "pointer" : undefined,
      }}
    >
      <AutoPlayVideo
        src="https://i.imgur.com/CCsujLL.mp4"
        style={{ width: "100%", height: "300px", objectFit: "contain", display: "block" }}
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
        description="Discover a fast and straightforward method to trade memecoins within a secure environment, ensuring your investments are protected while you enjoy the excitement of the crypto market."
        tags={["Mobile Application", "WEB3 Application", "UI Motion"]}
        theme={theme}
      />

      <div className="flex flex-col gap-4" style={{ padding: "16px 16px 24px" }}>
        <HeroSection theme={theme} onClick={ql("https://i.imgur.com/CCsujLL.mp4", "Degen Arcade — Hero", "video")} />

        <SectionRule label="Design Strategy" theme={theme} />

        <PropRow
          label="Mission"
          value='To create a "Secure-by-Design" arcade for memecoin trading, removing the friction of manual contract verification.'
          theme={theme}
        />
        <PropRow
          label="Problem"
          value="Beginners crave the excitement of the crypto market but are often paralyzed by security concerns, the fear of trading a scam coin, or simply buying the wrong coin due to complex interfaces."
          theme={theme}
        />
        <PropRow
          label="Key Win"
          value='Executing a "One-Swipe" trade on a trending coin with the confidence that automated security protocols are protecting their investment in the background.'
          theme={theme}
        />
        <PropRow
          label="Outcome"
          value="Transform a high-stress activity into a safe, straightforward, and engaging experience that encourages frequent participation."
          theme={theme}
        />

        <SectionRule label="Core Flow" theme={theme} />

        <div style={{ display: isMobile ? "flex" : "grid", gridTemplateColumns: "1fr 1fr", flexDirection: "column", minHeight: isMobile ? undefined : "320px", gap: "8px" }}>
          <ImageWell theme={theme} style={isMobile ? { minHeight: "320px" } : { paddingTop: "4px", paddingBottom: "4px" }} onClick={ql("https://i.imgur.com/kOfXQck.mp4", "Core Flow", "video")}>
            <AutoPlayVideo
              src="https://i.imgur.com/kOfXQck.mp4"
              style={{ maxWidth: "100%", maxHeight: "100%", width: "auto", height: "auto", objectFit: "contain", display: "block", margin: "0 auto" }}
            />
          </ImageWell>
          <div className="flex flex-col gap-2">
            <InfoPanel title="1 · Discover" theme={theme}>
              Browse the curated "Arcade Floor" — a live feed of tokens that have
              already passed automated security checks, so users never have to
              verify contracts manually.
            </InfoPanel>
            <InfoPanel title="2 · Swipe to Trade" theme={theme}>
              Execute a "One-Swipe" trade on any trending coin. The deliberate
              swipe gesture prevents accidental purchases while keeping the flow
              fast and satisfying.
            </InfoPanel>
            <InfoPanel title="3 · Review & Confirm" theme={theme}>
              Transparent token data — Market Cap, Liquidity, and Volume — is
              surfaced at the point of decision, giving users full confidence
              before committing.
            </InfoPanel>
          </div>
        </div>

        <SectionRule label="Process & Testing" theme={theme} />

        <div style={{ display: isMobile ? "flex" : "grid", gridTemplateColumns: "1fr 1fr 1fr", flexDirection: "column", gap: "8px" }}>
          <InfoPanel title="Bulk Buy" theme={theme}>
            Early prototypes included a batch-purchase flow for buying multiple tokens at once. Testing revealed it added too much cognitive load — users second-guessed selections and abandoned carts. A single-token flow proved far more decisive.
          </InfoPanel>
          <InfoPanel title="Loading Time" theme={theme}>
            On-chain data fetches introduced noticeable wait times between screens. We trimmed redundant calls and added optimistic UI updates, but some flows still felt sluggish and were simplified to reduce round-trips.
          </InfoPanel>
          <InfoPanel title="Character Select" theme={theme}>
            An avatar/character-picker was designed to personalize the arcade experience. User testing showed it confused first-time users who didn't understand its purpose, so the feature was removed to streamline onboarding.
          </InfoPanel>
        </div>

        <SectionRule label="Unused Designs" theme={theme} />

        <InfoPanel title="Degen in the Dark Room" theme={theme}>
          These visuals explored the narrative of a lone degen trading memecoins from a dimly lit room — screens glowing, charts flickering, fully immersed in the chaos of the market. The illustrations aimed to capture the raw, underground energy of memecoin culture but were ultimately set aside as the product shifted toward a more approachable, arcade-style identity.
        </InfoPanel>

        <div style={{ display: isMobile ? "flex" : "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", flexDirection: "column", height: isMobile ? undefined : "260px", gap: "8px" }}>
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
      </div>
    </div>
  );
}
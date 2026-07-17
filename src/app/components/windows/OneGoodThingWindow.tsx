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

export function OneGoodThingWindow() {
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
        title="1 Good Thing"
        company="Personal Project"
        role="Designer, developer, QA & marketing"
        description="I wanted to start journaling. I can't write. So I built an app where I draw instead. One small drawing a day drops into a jar. Proof your life has more good in it than it feels like sometimes."
        tags={["iOS App", "Side Project", "Consumer Product", "Swift"]}
        theme={theme}
        demoLink="https://apps.apple.com/us/app/1-good-thing-gratitude-jar/id6784074256"
      />

      <div className="flex flex-col gap-4" style={{ padding: "16px 16px 24px" }}>

        <ImageWell theme={theme} aspectRatio="9/16" onClick={ql("/1goodthing/hero.mp4", "1 Good Thing — App walkthrough", "video")}>
          <AutoPlayVideo
            src="/1goodthing/hero.mp4"
            style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
          />
        </ImageWell>

        <SectionRule label="Why I built this" theme={theme} />

        <div style={{ display: isMobile ? "flex" : "grid", gridTemplateColumns: "1fr 1fr", flexDirection: "column", gap: "8px" }}>
          <InfoPanel title="The constraint" theme={theme}>
            Every journaling app I tried assumed I'd write. I don't write. I draw on my phone when I'm bored on the MTR. I wanted a record of good days but the blank text field felt like homework. Drawing one thing felt like nothing. That gap is the product.
          </InfoPanel>
          <InfoPanel title="Shipped solo" theme={theme}>
            Design, Swift code, QA, App Store screenshots, copy, pricing. Everything. Released in early 2026, currently live on the App Store. This portfolio is full of products I designed for teams. This one I shipped alone.
          </InfoPanel>
        </div>

        <SectionRule label="The app" theme={theme} />

        <div style={{ display: isMobile ? "flex" : "grid", gridTemplateColumns: "1fr 1fr", flexDirection: "column", gap: "8px" }}>
          <div className="flex flex-col gap-2">
            <ImageWell theme={theme} style={{ height: "280px" }} onClick={ql("/1goodthing/preview-draw.png", "Drawing interface")}>
              <img src="/1goodthing/preview-draw.png" alt="Drawing interface: canvas with a shiba drawing, color palette, brush tools, add to jar button" loading="lazy" style={{ maxWidth: "100%", maxHeight: "100%", width: "auto", height: "auto", objectFit: "contain", display: "block", margin: "0 auto" }} />
            </ImageWell>
            <InfoPanel theme={theme}>
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: theme.textMuted }}>DRAW</span>
              <br />A canvas, a few brushes, a color picker. Draw one thing. Name it. Add to jar.
            </InfoPanel>
          </div>
          <div className="flex flex-col gap-2">
            <ImageWell theme={theme} style={{ height: "280px" }} onClick={ql("/1goodthing/preview-calendar.png", "Calendar and jar view")}>
              <img src="/1goodthing/preview-calendar.png" alt="Calendar view showing month of drawings with weekly recap, mood graph, and weather patterns" loading="lazy" style={{ maxWidth: "100%", maxHeight: "100%", width: "auto", height: "auto", objectFit: "contain", display: "block", margin: "0 auto" }} />
            </ImageWell>
            <InfoPanel theme={theme}>
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: theme.textMuted }}>JAR</span>
              <br />Drawings stack up in a calendar. Mood, weather, streaks. The jar fills with proof.
            </InfoPanel>
          </div>
        </div>

        <div style={{ display: isMobile ? "flex" : "grid", gridTemplateColumns: "1fr 1fr", flexDirection: "column", gap: "8px" }}>
          <div className="flex flex-col gap-2">
            <ImageWell theme={theme} style={{ height: "280px" }} onClick={ql("/1goodthing/preview-bad.png", "Bad thing jar")}>
              <img src="/1goodthing/preview-bad.png" alt="Bad thing jar in dark mode: floating storm cloud drawings on a black background" loading="lazy" style={{ maxWidth: "100%", maxHeight: "100%", width: "auto", height: "auto", objectFit: "contain", display: "block", margin: "0 auto" }} />
            </ImageWell>
            <InfoPanel theme={theme}>
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: theme.textMuted }}>BAD THING JAR (PRO)</span>
              <br />Draw today's bad thing. Let it go. A place for it to land that isn't you.
            </InfoPanel>
          </div>
          <div className="flex flex-col gap-2">
            <ImageWell theme={theme} style={{ height: "280px" }} onClick={ql("/1goodthing/preview-widget.png", "Home screen widget")}>
              <img src="/1goodthing/preview-widget.png" alt="Home screen with 1 Good Thing widget showing a collection of drawings" loading="lazy" style={{ maxWidth: "100%", maxHeight: "100%", width: "auto", height: "auto", objectFit: "contain", display: "block", margin: "0 auto" }} />
            </ImageWell>
            <InfoPanel theme={theme}>
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: theme.textMuted }}>WIDGET</span>
              <br />Your good days live on your home screen. You'll forget today. The widget won't.
            </InfoPanel>
          </div>
        </div>

        <SectionRule label="Design Decisions" theme={theme} />

        <InfoPanel title="Drawing instead of writing" theme={theme}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div><span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: theme.textMuted }}>THE PROBLEM</span><br />Every gratitude app I found put a text field in front of me. That's journaling with extra steps. Most people don't journal because writing feels like work.</div>
            <div style={{ borderTop: `1px solid ${theme.windowBorder}`, paddingTop: 8, color: theme.linkColor, fontSize: 12, lineHeight: 1.6 }}>
              Drawing is faster, more personal, and lower stakes. A bad drawing still captures the memory. The bar is low enough that you actually do it.
            </div>
          </div>
        </InfoPanel>

        <InfoPanel title="No streaks" theme={theme}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div><span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: theme.textMuted }}>THE PROBLEM</span><br />Habit apps use streaks to keep you coming back. Break the streak and you feel bad. Gratitude apps that make you feel bad when you miss a day defeat the whole point.</div>
            <div style={{ borderTop: `1px solid ${theme.windowBorder}`, paddingTop: 8, color: theme.linkColor, fontSize: 12, lineHeight: 1.6 }}>
              No streaks to protect. Draw when you have something to draw. Skip when you don't. The jar fills at its own pace.
            </div>
          </div>
        </InfoPanel>

        <InfoPanel title="The bad thing jar" theme={theme}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div><span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: theme.textMuted }}>THE INSIGHT</span><br />If drawing good things helps you remember them, drawing bad things helps you release them. But the bad jar needed to feel different: darker, heavier, separate from the good.</div>
            <div style={{ borderTop: `1px solid ${theme.windowBorder}`, paddingTop: 8, color: theme.linkColor, fontSize: 12, lineHeight: 1.6 }}>
              It's a pro feature not because it costs more to build, but because it's for people who actually need the release, not a gimmick to unlock.
            </div>
          </div>
        </InfoPanel>

        <NextProject id="deFiWallet" label="DeFi Wallet Onboarding" />
      </div>
    </div>
  );
}

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
        description="I wanted to start journaling. I can't write. So I built an app where I draw instead. One drawing a day drops into a jar. Now you can share a jar with friends: everyone adds their own good things, and you all watch it fill together."
        tags={["iOS App", "Side Project", "Consumer Product", "Swift"]}
        theme={theme}
        demoLink="https://apps.apple.com/us/app/1-good-thing-memory-jar/id6784074256"
        demoLabel="Install Now"
        followLink="https://www.instagram.com/hoyin.build/"
        followLabel="Follow my build journey"
      />

      <div className="flex flex-col gap-4" style={{ padding: "16px 16px 24px" }}>

        <SectionRule label="Why I built this" theme={theme} />

        <div style={{ display: isMobile ? "flex" : "grid", gridTemplateColumns: "1fr 1fr", flexDirection: "column", gap: "8px", minHeight: isMobile ? undefined : "320px" }}>
          <ImageWell theme={theme} onClick={ql("/1goodthing/hero.mp4", "1 Good Thing — App walkthrough", "video")} style={{ minHeight: isMobile ? "320px" : undefined }}>
            <AutoPlayVideo
              src="/1goodthing/hero.mp4"
              style={{ maxWidth: "100%", maxHeight: "100%", width: "auto", height: "auto", objectFit: "contain", display: "block", margin: "0 auto" }}
            />
          </ImageWell>
          <div className="flex flex-col gap-2">
            <InfoPanel title="The constraint" theme={theme}>
              Every journaling app I tried assumed I'd write. I don't write. I draw on my phone when I'm bored on the MTR. I wanted a record of good days but the blank text field felt like homework. Drawing one thing felt like nothing. That gap is the product.
            </InfoPanel>
            <InfoPanel title="Shipped solo" theme={theme}>
              Design, Swift code, QA, App Store screenshots, copy, pricing. Everything. Released in early 2026, currently live on the App Store. This portfolio is full of products I designed for teams. This one I shipped alone.
            </InfoPanel>
          </div>
        </div>

        <SectionRule label="The app" theme={theme} />

        <div style={{ display: isMobile ? "flex" : "grid", gridTemplateColumns: "1fr 1fr", flexDirection: "column", gap: "8px" }}>
          <div className="flex flex-col gap-2">
            <ImageWell theme={theme} style={{ height: "280px" }} onClick={ql("/1goodthing/preview-shared-jar.png", "Shared jar")}>
              <img src="/1goodthing/preview-shared-jar.png" alt="Shared jar: friends adding their drawings together with live notifications" loading="lazy" style={{ maxWidth: "100%", maxHeight: "100%", width: "auto", height: "auto", objectFit: "contain", display: "block", margin: "0 auto" }} />
            </ImageWell>
            <InfoPanel theme={theme}>
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: theme.textMuted }}>SHARED JAR</span>
              <br />Share a jar with up to 6 friends or family. Everyone adds their own good things. No accounts or sign-ups needed.
            </InfoPanel>
          </div>
          <div className="flex flex-col gap-2">
            <ImageWell theme={theme} style={{ height: "280px" }} onClick={ql("/1goodthing/preview-widget.png", "Shared widget")}>
              <img src="/1goodthing/preview-widget.png" alt="Shared widget: everyone's drawings arranged into one collage on the home screen" loading="lazy" style={{ maxWidth: "100%", maxHeight: "100%", width: "auto", height: "auto", objectFit: "contain", display: "block", margin: "0 auto" }} />
            </ImageWell>
            <InfoPanel theme={theme}>
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: theme.textMuted }}>SHARED WIDGET</span>
              <br />Build a widget together. Everyone's drawings in one collage, updated the moment anyone adds something.
            </InfoPanel>
          </div>
        </div>

        <div style={{ display: isMobile ? "flex" : "grid", gridTemplateColumns: "1fr 1fr", flexDirection: "column", gap: "8px" }}>
          <div className="flex flex-col gap-2">
            <ImageWell theme={theme} style={{ height: "280px" }} onClick={ql("/1goodthing/preview-draw.png", "Drawing interface")}>
              <img src="/1goodthing/preview-draw.png" alt="Drawing interface with canvas, brush tools and color picker" loading="lazy" style={{ maxWidth: "100%", maxHeight: "100%", width: "auto", height: "auto", objectFit: "contain", display: "block", margin: "0 auto" }} />
            </ImageWell>
            <InfoPanel theme={theme}>
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: theme.textMuted }}>DRAW</span>
              <br />A canvas, a few brushes, a color picker. Draw one thing. Name it. Drop it in.
            </InfoPanel>
          </div>
          <div className="flex flex-col gap-2">
            <ImageWell theme={theme} style={{ height: "280px" }} onClick={ql("/1goodthing/preview-sticker.png", "Sticker maker")}>
              <img src="/1goodthing/preview-sticker.png" alt="Sticker maker: turn any photo into a sticker for your drawings" loading="lazy" style={{ maxWidth: "100%", maxHeight: "100%", width: "auto", height: "auto", objectFit: "contain", display: "block", margin: "0 auto" }} />
            </ImageWell>
            <InfoPanel theme={theme}>
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: theme.textMuted }}>STICKER MAKER</span>
              <br />Turn any photo into a sticker. Mix real photos and drawings in the same memory.
            </InfoPanel>
          </div>
        </div>

        <div style={{ display: isMobile ? "flex" : "grid", gridTemplateColumns: "1fr 1fr", flexDirection: "column", gap: "8px" }}>
          <div className="flex flex-col gap-2">
            <ImageWell theme={theme} style={{ height: "280px" }} onClick={ql("/1goodthing/preview-calendar.png", "Calendar and memory view")}>
              <img src="/1goodthing/preview-calendar.png" alt="Calendar view with monthly drawings, weekly recap, mood tracking, and AI summary" loading="lazy" style={{ maxWidth: "100%", maxHeight: "100%", width: "auto", height: "auto", objectFit: "contain", display: "block", margin: "0 auto" }} />
            </ImageWell>
            <InfoPanel theme={theme}>
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: theme.textMuted }}>MEMORY JAR</span>
              <br />Every drawing lands in a calendar. Mood, weather, location. Weekly recap. AI summary of what you actually captured.
            </InfoPanel>
          </div>
          <div className="flex flex-col gap-2" style={{ justifyContent: "flex-start" }}>
            <InfoPanel title="What's in pro" theme={theme}>
              Unlimited good things, the bad thing jar for letting go, custom widgets, and shared jars with up to 6 people. Free tier gives you 3 good things, forever.
            </InfoPanel>
          </div>
        </div>

        <SectionRule label="Design Decisions" theme={theme} />

        <InfoPanel title="Drawing instead of writing" theme={theme}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div><span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: theme.textMuted }}>THE PROBLEM</span><br />Every journaling app puts a text field in front of you. Most people don't journal because writing feels like work.</div>
            <div style={{ borderTop: `1px solid ${theme.windowBorder}`, paddingTop: 8, color: theme.linkColor, fontSize: 12, lineHeight: 1.6 }}>
              Drawing is faster, more personal, and lower stakes. A bad drawing still captures the memory. The bar is low enough that you actually do it.
            </div>
          </div>
        </InfoPanel>

        <InfoPanel title="Shared jar with no accounts" theme={theme}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div><span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: theme.textMuted }}>THE DECISION</span><br />Most social apps gate sharing behind sign-up. The friction kills adoption before the feature even lands.</div>
            <div style={{ borderTop: `1px solid ${theme.windowBorder}`, paddingTop: 8, color: theme.linkColor, fontSize: 12, lineHeight: 1.6 }}>
              Shared jars need no account: share a link, join instantly. Family and close friends shouldn't have to download an app and create a profile just to share a jar with you.
            </div>
          </div>
        </InfoPanel>

        <InfoPanel title="No streaks" theme={theme}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div><span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: theme.textMuted }}>THE PROBLEM</span><br />Habit apps use streaks to keep you coming back. Break the streak and you feel bad. A memory app that punishes you for missing a day defeats the point.</div>
            <div style={{ borderTop: `1px solid ${theme.windowBorder}`, paddingTop: 8, color: theme.linkColor, fontSize: 12, lineHeight: 1.6 }}>
              No streaks to protect. Draw when you have something. Skip when you don't. The jar fills at its own pace.
            </div>
          </div>
        </InfoPanel>

        <NextProject id="deFiWallet" label="DeFi Wallet Onboarding" />
      </div>
    </div>
  );
}

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
        demoLabel="Download on the App Store"
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
            <ImageWell theme={theme} style={{ height: "280px" }} onClick={ql("/1goodthing/preview-trace.png", "Tracing guide")}>
              <img src="/1goodthing/preview-trace.png" alt="Drawing canvas with a photo loaded as a faint tracing guide underneath" loading="lazy" style={{ maxWidth: "100%", maxHeight: "100%", width: "auto", height: "auto", objectFit: "contain", display: "block", margin: "0 auto" }} />
            </ImageWell>
            <InfoPanel theme={theme}>
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: theme.textMuted }}>TRACING GUIDE</span>
              <br />Never learned to draw? Load any photo as a faint guide, trace the shape, then make it your own.
            </InfoPanel>
          </div>
          <div className="flex flex-col gap-2">
            <ImageWell theme={theme} style={{ height: "280px" }} onClick={ql("/1goodthing/preview-sticker.png", "Sticker maker")}>
              <img src="/1goodthing/preview-sticker.png" alt="Style your sticker screen with colour border options, copy as sticker to send in chat" loading="lazy" style={{ maxWidth: "100%", maxHeight: "100%", width: "auto", height: "auto", objectFit: "contain", display: "block", margin: "0 auto" }} />
            </ImageWell>
            <InfoPanel theme={theme}>
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: theme.textMuted }}>STICKER MAKER</span>
              <br />Draw it, add a colour border, copy as a sticker. Drop it into any chat. Your doodles, ready to steal the conversation.
            </InfoPanel>
          </div>
        </div>

        <div style={{ display: isMobile ? "flex" : "grid", gridTemplateColumns: "1fr 1fr", flexDirection: "column", gap: "8px" }}>
          <div className="flex flex-col gap-2">
            <ImageWell theme={theme} style={{ height: "280px" }} onClick={ql("/1goodthing/preview-note.png", "Note and drawing entry")}>
              <img src="/1goodthing/preview-note.png" alt="Entry detail showing a cat drawing with a title and short written note below" loading="lazy" style={{ maxWidth: "100%", maxHeight: "100%", width: "auto", height: "auto", objectFit: "contain", display: "block", margin: "0 auto" }} />
            </ImageWell>
            <InfoPanel theme={theme}>
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: theme.textMuted }}>NOTE</span>
              <br />Add a title and a few words. 200 characters, plenty. The drawing carries the feeling. The note carries the detail.
            </InfoPanel>
          </div>
          <div className="flex flex-col gap-2">
            <ImageWell theme={theme} style={{ height: "280px" }} onClick={ql("/1goodthing/preview-calendar.png", "Calendar and scrapbook")}>
              <img src="/1goodthing/preview-calendar.png" alt="Calendar view showing a month of drawings per day, with scrapbook mode cards" loading="lazy" style={{ maxWidth: "100%", maxHeight: "100%", width: "auto", height: "auto", objectFit: "contain", display: "block", margin: "0 auto" }} />
            </ImageWell>
            <InfoPanel theme={theme}>
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: theme.textMuted }}>CALENDAR + SCRAPBOOK</span>
              <br />Every drawing lands in a calendar. Scrapbook mode lets you arrange a day as a collage card to keep or share.
            </InfoPanel>
          </div>
        </div>

        <div style={{ display: isMobile ? "flex" : "grid", gridTemplateColumns: "1fr 1fr", flexDirection: "column", gap: "8px" }}>
          <div className="flex flex-col gap-2">
            <ImageWell theme={theme} style={{ height: "280px" }} onClick={ql("/1goodthing/preview-widget.png", "Home screen widget")}>
              <img src="/1goodthing/preview-widget.png" alt="iPhone home screen with 1 good thing widget showing recent drawings of cats and flowers" loading="lazy" style={{ maxWidth: "100%", maxHeight: "100%", width: "auto", height: "auto", objectFit: "contain", display: "block", margin: "0 auto" }} />
            </ImageWell>
            <InfoPanel theme={theme}>
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: theme.textMuted }}>WIDGET</span>
              <br />Your drawings on your home screen. A little joy every time you check your phone.
            </InfoPanel>
          </div>
          <div className="flex flex-col gap-2">
            <ImageWell theme={theme} style={{ height: "280px" }} onClick={ql("/1goodthing/preview-wallpaper.png", "Lock screen wallpaper")}>
              <img src="/1goodthing/preview-wallpaper.png" alt="Wallpaper generator showing a grid of drawings arranged as a phone lock screen" loading="lazy" style={{ maxWidth: "100%", maxHeight: "100%", width: "auto", height: "auto", objectFit: "contain", display: "block", margin: "0 auto" }} />
            </ImageWell>
            <InfoPanel theme={theme}>
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: theme.textMuted }}>WALLPAPER</span>
              <br />Generate a wallpaper from your jar. Good things, bad things, or any collection. Your good days on your lock screen.
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
            <div><span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: theme.textMuted }}>THE DECISION</span><br />Most social apps gate sharing behind sign-up. The friction kills adoption before the feature even lands. Shared jars needed no account: share a link, join instantly.</div>
            <div style={{ borderTop: `1px solid ${theme.windowBorder}`, paddingTop: 8, color: theme.linkColor, fontSize: 12, lineHeight: 1.6 }}>
              It shipped. Then the bad reviews came in. Sync bugs, missing entries, confused users who couldn't tell whose drawings were whose. A month in, I paused the feature. The idea was right. The stability wasn't there yet.
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

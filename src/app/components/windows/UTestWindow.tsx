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

/* ── Metric Card ─────────────────────────────────────────── */
function MetricCard({
  value,
  label,
  theme,
}: {
  value: string;
  label: string;
  theme: ReturnType<typeof useTheme>["theme"];
}) {
  return (
    <div
      style={{
        flex: 1,
        background: theme.mode === "dark" || theme.mode === "hailmary" ? "#22262c" : "#EDEDED",
        borderRadius: "2px",
        border: `1px solid ${theme.mode === "dark" || theme.mode === "hailmary" ? "#333" : "#C4C4C4"}`,
        padding: "16px 12px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "4px",
        boxShadow:
          theme.mode === "dark" || theme.mode === "hailmary"
            ? "inset 0 1px 0 rgba(255,255,255,0.03)"
            : "inset 0 1px 0 rgba(255,255,255,0.55)",
      }}
    >
      <span
        style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: "22px",
          color: theme.textStrong,
          letterSpacing: "-0.5px",
        }}
      >
        {value}
      </span>
      <span
        style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: "9px",
          color: theme.textMuted,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          textAlign: "center",
        }}
      >
        {label}
      </span>
    </div>
  );
}

/* ── Flow Step ───────────────────────────────────────────── */
function FlowStep({
  number,
  title,
  description,
  theme,
}: {
  number: string;
  title: string;
  description: string;
  theme: ReturnType<typeof useTheme>["theme"];
}) {
  return (
    <div
      style={{
        flex: 1,
        background: theme.mode === "dark" || theme.mode === "hailmary" ? "#22262c" : "#EDEDED",
        borderRadius: "2px",
        border: `1px solid ${theme.mode === "dark" || theme.mode === "hailmary" ? "#333" : "#C4C4C4"}`,
        padding: "14px 14px",
        boxShadow:
          theme.mode === "dark" || theme.mode === "hailmary"
            ? "inset 0 1px 0 rgba(255,255,255,0.03)"
            : "inset 0 1px 0 rgba(255,255,255,0.55)",
      }}
    >
      <div
        style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: "9px",
          color: theme.textMuted,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          marginBottom: "6px",
        }}
      >
        {number}. {title}
      </div>
      <div
        style={{
          fontFamily: "'IBM Plex Sans', sans-serif",
          fontSize: "13px",
          color: theme.infocardText,
          lineHeight: "1.55",
        }}
      >
        {description}
      </div>
    </div>
  );
}

export function UTestWindow() {
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
        title="u/test"
        company="Solo Project"
        description="A lightweight, unmoderated usability testing tool built for designers who move fast. Define tasks with a URL and CSS selectors, share a link, get data back — no HTML changes needed on the site being tested."
        tags={["Product Strategy", "UX Design", "Frontend Development"]}
        theme={theme}
        demoLink="https://boisterous-dieffenbachia-c01bce.netlify.app/"
      />

      <div className="flex flex-col gap-4" style={{ padding: "16px 16px 24px" }}>

        {/* ── Hero Video ───────────────────────────────────── */}
        <ImageWell theme={theme} aspectRatio="16/10" onClick={ql("https://i.imgur.com/RzE33Yy.mp4", "u/test — Hero", "video")}>
          <AutoPlayVideo
            src="https://i.imgur.com/RzE33Yy.mp4"
            style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
          />
        </ImageWell>

        {/* ── The Problem ──────────────────────────────────── */}
        <SectionRule label="The Problem" theme={theme} />

        <InfoPanel theme={theme}>
          Every usability test I ran as a designer had the same friction: too
          much setup, too much waiting. Existing tools like Maze required
          recruiting participants through their platform, and Hotjar needed
          engineers to instrument the site. I needed something I could spin up
          in minutes and send to anyone — without touching their codebase.
        </InfoPanel>

        {/* ── The Solution ─────────────────────────────────── */}
        <SectionRule label="The Solution" theme={theme} />

        <div className="flex flex-col gap-2">
          <PropRow
            label="What"
            value="A lightweight, unmoderated usability testing tool — define tasks with a URL and CSS selectors, share a link, get data back."
            theme={theme}
          />
          <PropRow
            label="How"
            value="The tracking script auto-detects correct clicks, rage clicks, misclicks, and time-on-task — no HTML changes needed on the site being tested."
            theme={theme}
          />
          <PropRow
            label="Why"
            value="Designers shouldn't need to wait for an engineer to instrument a site just to run a usability test."
            theme={theme}
          />
        </div>

        {/* ── How It Works ─────────────────────────────────── */}
        <SectionRule label="How It Works" theme={theme} />

        <ImageWell theme={theme} aspectRatio="16/10" onClick={ql("https://i.imgur.com/IKkZvd3.mp4", "u/test — How It Works", "video")}>
          <AutoPlayVideo
            src="https://i.imgur.com/IKkZvd3.mp4"
            style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
          />
        </ImageWell>

        <div
          style={{
            display: isMobile ? "flex" : "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          <FlowStep
            number="1"
            title="Create"
            description="Define a test with a task prompt and CSS selectors for each step. The script auto-detects target elements without requiring any changes to the site being tested."
            theme={theme}
          />
          <FlowStep
            number="2"
            title="Run"
            description="Testers receive a briefing screen with their task and three simple instructions. Their navigation is tracked automatically. They can flag when they're stuck or give up."
            theme={theme}
          />
          <FlowStep
            number="3"
            title="Report"
            description="Results surface as a completion funnel, step-by-step insights, a friction heatmap across sessions, and individual session breakdowns."
            theme={theme}
          />
        </div>

        {/* ── Report Insights ──────────────────────────────── */}
        <SectionRule label="Report Insights" theme={theme} />

        <InfoPanel title="What the report surfaces" theme={theme}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "6px",
              marginTop: "4px",
            }}
          >
            {[
              "Completion funnel",
              "Success rate per step",
              "Click accuracy",
              "Min / Median / Max time",
              "Stuck rate",
              "Deviation tracking",
              "Friction heatmap",
              "Session breakdowns",
            ].map((item) => (
              <span
                key={item}
                style={{
                  fontSize: "10px",
                  fontFamily: "'IBM Plex Mono', monospace",
                  color: theme.tagText,
                  background: theme.tagBg,
                  borderRadius: "1px",
                  padding: "2px 6px",
                  border: `1px solid ${theme.tagBorder}`,
                  letterSpacing: "0.04em",
                }}
              >
                {item}
              </span>
            ))}
          </div>
        </InfoPanel>

        {/* Report Screenshots - Full Width Display */}
        <div className="flex flex-col gap-3">
          <ImageWell theme={theme} padding="0px" onClick={ql("https://i.imgur.com/8zmpRZQ.png", "u/test — Report insights")}>
            <img
              src="https://i.imgur.com/8zmpRZQ.png"
              alt="Report insights — main view"
              loading="lazy"
              style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", display: "block" }}
            />
          </ImageWell>
          <ImageWell theme={theme} padding="0px" onClick={ql("https://i.imgur.com/v6lxS9L.png", "u/test — Report overview")}>
            <img
              src="https://i.imgur.com/v6lxS9L.png"
              alt="Report insights — overview"
              loading="lazy"
              style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", display: "block" }}
            />
          </ImageWell>
          <ImageWell theme={theme} padding="0px" onClick={ql("https://i.imgur.com/Tn6gtpN.png", "u/test — Report details")}>
            <img
              src="https://i.imgur.com/Tn6gtpN.png"
              alt="Report insights — details"
              loading="lazy"
              style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", display: "block" }}
            />
          </ImageWell>
        </div>

        {/* ── Real-World Validation ────────────────────────── */}
        <SectionRule label="Real-World Validation" theme={theme} />

        <InfoPanel title="Agent Wallet Test" theme={theme}>
          Running u/test on the Agent Wallet — a crypto portfolio app — revealed
          something I wouldn't have caught in Figma: 57% of testers misclicked
          on step 1 (navigating to the AI Agent). The nav label was clear, but
          its position in the sidebar wasn't scannable enough at first glance.
          That single data point directly informed a layout change before launch.
        </InfoPanel>

        {/* ── Key Metrics ──────────────────────────────────── */}
        <SectionRule label="Metrics" theme={theme} />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr 1fr" : "1fr 1fr 1fr 1fr",
            gap: "8px",
          }}
        >
          <MetricCard value="21" label="Sessions Tracked" theme={theme} />
          <MetricCard value="0:21" label="Avg. Completion Time" theme={theme} />
          <MetricCard
            value="12/100"
            label="Avg. Frustration Score"
            theme={theme}
          />
          <MetricCard
            value="57%"
            label="Step 1 Misclick Rate"
            theme={theme}
          />
        </div>

        <InfoPanel theme={theme} centered>
          57% misclick rate on step 1 &rarr; led to a nav redesign
        </InfoPanel>

        {/* ── Built With ───────────────────────────────────── */}
        <SectionRule label="Built With" theme={theme} />

        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
          {["React", "Tailwind", "Figma Make"].map((tech) => (
            <span
              key={tech}
              style={{
                fontSize: "10px",
                fontFamily: "'IBM Plex Mono', monospace",
                color: theme.tagText,
                background: theme.tagBg,
                borderRadius: "1px",
                padding: "2px 6px",
                border: `1px solid ${theme.tagBorder}`,
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              {tech}
            </span>
          ))}
        </div>

        {/* ── Try Demo Link ────────────────────────────────── */}
        <p
          style={{
            fontSize: "13px",
            color: theme.textPrimary,
            lineHeight: "1.65",
            margin: "16px 0 0",
            fontFamily: "'IBM Plex Sans', sans-serif",
          }}
        >
          Try Demo{" "}
          <a
            href="https://boisterous-dieffenbachia-c01bce.netlify.app/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: isLight(theme) ? "#007AFF" : "#0A84FF",
              textDecoration: "underline",
            }}
          >
            here
          </a>
        </p>
      </div>
    </div>
  );
}
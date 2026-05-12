import React from "react";
import { useIsMobile } from "../../hooks/useIsMobile";
import { useTheme } from "../../hooks/useTheme";
import type { ThemeTokens } from "../../hooks/useTheme";
import {
  ProjectHeader,
  ImageWell,
  SectionRule,
  InfoPanel,
  PropRow,
  TagBadge,
} from "./ProjectLayout";

const isLight = (t: ThemeTokens) => t.mode !== "dark" && t.mode !== "hailmary";

/* ── Loop Diagram ─────────────────────────────────────────────────────────── */
function LoopDiagram({ theme }: { theme: ThemeTokens }) {
  const nodes = [
    { label: "Build prototype" },
    { label: "Share URL" },
    { label: "Reviewers click\n& comment" },
    { label: "AI reads &\napplies fixes" },
  ];

  const accent = isLight(theme) ? "#007AFF" : "#0A84FF";
  const nodeBg = isLight(theme) ? "#EDEDED" : "#22262c";
  const nodeBorder = isLight(theme) ? "#C4C4C4" : "#333";
  const arrowColor = isLight(theme) ? "#BEBEBE" : "#444";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0",
        flexWrap: "wrap",
        padding: "16px 8px",
        rowGap: "12px",
      }}
    >
      {nodes.map((node, i) => (
        <React.Fragment key={i}>
          <div
            style={{
              background: nodeBg,
              border: `1px solid ${i === 3 ? accent : nodeBorder}`,
              borderRadius: "2px",
              padding: "8px 12px",
              textAlign: "center",
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: "10px",
              color: i === 3 ? accent : theme.textSecondary,
              whiteSpace: "pre-line",
              lineHeight: 1.4,
              minWidth: "80px",
              boxShadow: i === 3
                ? `0 0 0 1px ${accent}22`
                : isLight(theme)
                  ? "inset 0 1px 0 rgba(255,255,255,0.55)"
                  : "inset 0 1px 0 rgba(255,255,255,0.03)",
            }}
          >
            {node.label}
          </div>
          {i < nodes.length - 1 && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "0 4px",
                color: arrowColor,
                fontSize: "12px",
                flexShrink: 0,
              }}
            >
              →
            </div>
          )}
          {i === nodes.length - 1 && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "0 4px",
                color: accent,
                fontSize: "10px",
                fontFamily: "'IBM Plex Mono', monospace",
                flexShrink: 0,
              }}
            >
              ↺
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

/* ── Iteration Entry ──────────────────────────────────────────────────────── */
function CutEntry({
  num,
  title,
  children,
  theme,
}: {
  num: number;
  title: string;
  children: React.ReactNode;
  theme: ThemeTokens;
}) {
  return (
    <div
      style={{
        display: "flex",
        gap: "10px",
        paddingBottom: "10px",
        borderBottom: `1px solid ${isLight(theme) ? "#E8E8E8" : "#2a2e34"}`,
      }}
    >
      <span
        style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: "10px",
          color: isLight(theme) ? "#007AFF" : "#0A84FF",
          flexShrink: 0,
          paddingTop: "1px",
          minWidth: "20px",
        }}
      >
        {String(num).padStart(2, "0")}
      </span>
      <div>
        <div
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: "10px",
            color: theme.textSecondary,
            marginBottom: "3px",
            textTransform: "uppercase",
            letterSpacing: "0.04em",
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: "12px",
            color: theme.textPrimary,
            lineHeight: "1.6",
            fontFamily: "'IBM Plex Sans', sans-serif",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

/* ── Main Component ───────────────────────────────────────────────────────── */
export function ProtoCommentsWindow() {
  const isMobile = useIsMobile();
  const { theme } = useTheme();

  const linkStyle: React.CSSProperties = {
    color: isLight(theme) ? "#007AFF" : "#0A84FF",
    textDecoration: "underline",
    cursor: "pointer",
  };

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
        title="proto-comments"
        company="Side project"
        description="Pinned comments on any prototype URL. Reviewers click without an account; AI agents act on the feedback."
        tags={["Design Tools", "AI Tooling", "Design Ops", "Open Source", "Developer Tools"]}
        theme={theme}
        demoLink="https://proto-comments.vercel.app"
      />

      <div className="flex flex-col gap-4" style={{ padding: "16px 16px 24px" }}>

        {/* Hero */}
        <ImageWell theme={theme} aspectRatio="16/8">
          <img
            src="https://proto-comments.vercel.app/og-image.png"
            alt="proto-comments — comment dialog and panel in action on a live prototype"
            loading="lazy"
            style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
          />
        </ImageWell>

        {/* Meta */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <PropRow label="Role"     value="Solo — design + engineering" theme={theme} />
          <PropRow label="Timeline" value="5 days end-to-end (idea → public demo → first launch)" theme={theme} />
          <PropRow label="Status"   value="Shipped v0.1.0 · Open source (MIT)" theme={theme} />
          <PropRow label="Links"    value={
            <span style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              <a href="https://proto-comments.vercel.app" target="_blank" rel="noopener noreferrer" style={linkStyle}>Live demo ↗</a>
              <a href="https://github.com/rdpilot/proto-comments" target="_blank" rel="noopener noreferrer" style={linkStyle}>GitHub ↗</a>
              <a href="https://www.notion.so/35cd6ef02c3781a793bbef482e621c47" target="_blank" rel="noopener noreferrer" style={linkStyle}>Long-form ↗</a>
              <a href="https://github.com/rdpilot/proto-comments/releases/tag/v0.1.0" target="_blank" rel="noopener noreferrer" style={linkStyle}>v0.1.0 ↗</a>
            </span>
          } theme={theme} />
        </div>

        <SectionRule label="Problem" theme={theme} />

        <div
          style={{
            display: isMobile ? "flex" : "grid",
            gridTemplateColumns: "1fr 1fr",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          <InfoPanel title="The old problem" theme={theme}>
            Getting feedback on a prototype is messy. Reviewers don't have accounts on whatever tool you're building in. They screenshot in Slack. They write paragraphs in Notion. They leave comments on a Figma frame that no longer matches the live build. By the time you read it all, half the context is gone.
          </InfoPanel>
          <InfoPanel title="The new problem" theme={theme}>
            AI agents can now help you build, but they can't read feedback that lives inside someone else's tool. To act on a comment in another product, you have to copy it, summarize it, hand it over. That's a loop that breaks at the handoff.
          </InfoPanel>
        </div>

        <SectionRule label="Approach" theme={theme} />

        <InfoPanel theme={theme}>
          Put comments where they're easy to act on. That meant my own GitHub repo — I already use it; the AI already reads it — and a slash command that turns "what did people say?" into one keystroke.
        </InfoPanel>

        <div
          style={{
            display: isMobile ? "flex" : "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          <InfoPanel title="01 — Script tag" theme={theme}>
            Visitors drop one script tag into their prototype HTML. No build step, no account, no SDK.
          </InfoPanel>
          <InfoPanel title="02 — Relay server" theme={theme}>
            A small server turns clicks into GitHub Issues. It saves nothing of its own — no database, no user data.
          </InfoPanel>
          <InfoPanel title="03 — Slash command" theme={theme}>
            A Claude Code slash command orchestrates setup and pulls comments back as a clean markdown list.
          </InfoPanel>
        </div>

        <div
          style={{
            display: "flex",
            gap: "6px",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: "11px", color: theme.textMuted, fontFamily: "'IBM Plex Mono', monospace" }}>Stack:</span>
          {["Next.js", "Vercel", "GitHub App", "Claude Code skill", "~1500 lines", "MIT"].map((s) => (
            <TagBadge key={s} theme={theme}>{s}</TagBadge>
          ))}
        </div>

        <SectionRule label="Use case" theme={theme} />

        <div
          style={{
            padding: "14px 16px",
            background: isLight(theme) ? "#EDEDED" : "#22262c",
            border: `1px solid ${isLight(theme) ? "#C4C4C4" : "#333"}`,
            borderRadius: "2px",
            fontFamily: "'IBM Plex Sans', sans-serif",
            fontSize: "13px",
            lineHeight: "1.75",
            color: theme.textPrimary,
          }}
        >
          <p style={{ margin: "0 0 10px" }}>
            A designer iterating on a new checkout flow. She doesn't want to touch the real codebase yet. She wants to test the design with her PM, two other designers, and a friendly customer first.
          </p>
          <p style={{ margin: "0 0 10px" }}>
            She runs <code style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "11px", background: isLight(theme) ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.07)", padding: "1px 5px", borderRadius: "2px" }}>/proto-comments new</code> in a fresh prototype directory. The slash command picks her team's feedback repo, installs the GitHub App, adds the script tag, turns on GitHub Pages, pushes the code, and prints a live URL.
          </p>
          <p style={{ margin: "0 0 10px" }}>
            She drops the URL in Slack. The PM clicks the discount field, types a comment, hits enter. Three more comments come in over the next hour. Nobody had to sign up for anything.
          </p>
          <p style={{ margin: "0" }}>
            <code style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "11px", background: isLight(theme) ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.07)", padding: "1px 5px", borderRadius: "2px" }}>/proto-comments fetch</code>{" "}
            brings four comments back as markdown. She asks Claude to apply 1, 2, and 4. The reviewers refresh and see those pins marked done. Total time from "first URL shared" to "feedback applied": 25 minutes.
          </p>
        </div>

        <SectionRule label="The loop" theme={theme} />

        <ImageWell theme={theme} padding="0">
          <LoopDiagram theme={theme} />
        </ImageWell>

        <SectionRule label="What got cut" theme={theme} />

        <InfoPanel theme={theme}>
          The shape didn't fall out fully formed. Ten things were built and removed. The recurring theme: anything that added friction got cut.
        </InfoPanel>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <CutEntry num={1} title="Database" theme={theme}>
            Pulled in week one — not for engineering reasons, for trust. People won't leave honest feedback on a prototype if a stranger running the service can read it all. Moving storage to the user's own GitHub repo fixed it in one move.
          </CutEntry>
          <CutEntry num={2} title="Required project name" theme={theme}>
            Removed. Asking for a name before showing value is friction.
          </CutEntry>
          <CutEntry num={3} title="Deploy to Vercel button" theme={theme}>
            Added then pulled. Anyone clicking it would already be in an ecosystem that has its own commenting tool. Wrong audience.
          </CutEntry>
          <CutEntry num={4} title="Hero copy — 4 versions" theme={theme}>
            Started informational ("Pinned comments on any preview URL"), ended use-case-forward ("Comment on any prototype URL. Turn feedback into something your AI agent can act on").
          </CutEntry>
          <CutEntry num={5} title="Hamburger icon on the pill" theme={theme}>
            Replaced with "+ Comment" text. People shouldn't have to decode an icon to know what to do.
          </CutEntry>
          <CutEntry num={6} title="Bottom-center default position" theme={theme}>
            Tried for two rounds. Blocked the page content and was easy to miss. Top-right wins on both counts.
          </CutEntry>
          <CutEntry num={7} title="Persistent drag position across refresh" theme={theme}>
            Caused a recurring "the tool is gone!" bug from stale coordinates. Now resets every refresh.
          </CutEntry>
          <CutEntry num={8} title="257-line slash command instructions" theme={theme}>
            Compressed to 125. Same behavior, half the per-call AI cost.
          </CutEntry>
          <CutEntry num={9} title="Real comments on the public demo" theme={theme}>
            Each demo visitor was creating GitHub Issues that piled up forever. Switched to memory-only mode: comments show live, vanish on refresh.
          </CutEntry>
          <CutEntry num={10} title="Persistent name on demo" theme={theme}>
            Cached forever in localStorage. Now defaults to "you" and never saves. Each visitor lands fresh.
          </CutEntry>
        </div>

        <SectionRule label="Reflection" theme={theme} />

        <InfoPanel theme={theme}>
          The goal was something a designer reaches for without thinking — like picking up a pen, not "an interesting tool people try once." Every cut above was about closing that gap. No database means nothing to trust. No accounts means nothing to create. No required fields means nothing to answer before you've seen the value. The AI slash command isn't a nice-to-have — it's the reason this exists. Without a fast path from "here's the feedback" to "Claude, apply fixes 1, 2, and 4," proto-comments is just another commenting widget. With it, feedback becomes code.
        </InfoPanel>

      </div>
    </div>
  );
}

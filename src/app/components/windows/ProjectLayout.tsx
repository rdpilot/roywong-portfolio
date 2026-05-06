import React from "react";
import type { ThemeTokens } from "../../hooks/useTheme";

// Sunny and Light share the same light-mode aesthetics
const isLight = (t: ThemeTokens) => t.mode !== "dark" && t.mode !== "hailmary";

/**
 * OS-themed primitives for UI/UX project case study windows.
 * Sharp corners, inset wells, bordered panels — matching the
 * classic desktop chrome used by the rest of the portfolio.
 */

/* ── Inset Image Well ─────────────────────────────────────── */
export function ImageWell({
  children,
  theme,
  aspectRatio,
  padding,
  style,
  onClick,
}: {
  children: React.ReactNode;
  theme: ThemeTokens;
  aspectRatio?: string;
  padding?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      style={{
        background: theme.imageBg,
        borderRadius: "2px",
        border: `1px solid ${isLight(theme) ? "#999" : "#111"}`,
        boxShadow:
          isLight(theme)
            ? "inset 1px 1px 3px rgba(0,0,0,0.18)"
            : "inset 1px 1px 4px rgba(0,0,0,0.5)",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        aspectRatio: aspectRatio || undefined,
        padding: padding || "16px",
        cursor: onClick ? "pointer" : undefined,
        ...style,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          maxWidth: "100%",
          maxHeight: "100%",
        }}
      >
        {children}
      </div>
    </div>
  );
}

/* ── Section Divider with optional monospace label ─────────── */
export function SectionRule({
  label,
  theme,
}: {
  label?: string;
  theme: ThemeTokens;
}) {
  const line = isLight(theme) ? "#BEBEBE" : "#333";

  if (!label) {
    return <div style={{ height: "1px", background: line }} />;
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <span
        style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: "9px",
          color: theme.textMuted,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </span>
      <div style={{ flex: 1, height: "1px", background: line }} />
    </div>
  );
}

/* ── Info Panel (replaces rounded InfoCard) ────────────────── */
export function InfoPanel({
  title,
  children,
  theme,
  centered,
}: {
  title?: string;
  children: React.ReactNode;
  theme: ThemeTokens;
  centered?: boolean;
}) {
  return (
    <div
      style={{
        background: isLight(theme) ? "#EDEDED" : "#22262c",
        borderRadius: "2px",
        border: `1px solid ${isLight(theme) ? "#C4C4C4" : "#333"}`,
        padding: "12px 16px",
        boxShadow:
          isLight(theme)
            ? "inset 0 1px 0 rgba(255,255,255,0.55)"
            : "inset 0 1px 0 rgba(255,255,255,0.03)",
        ...(centered && {
          display: "flex",
          flexDirection: "column" as const,
          alignItems: "center",
          justifyContent: "center",
        }),
      }}
    >
      {title && (
        <div
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: "10px",
            color: theme.textMuted,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            marginBottom: "4px",
          }}
        >
          {title}
        </div>
      )}
      <div className={centered ? "text-center" : "text-left"}
        style={{
          fontFamily: "'IBM Plex Sans', sans-serif",
          fontSize: "13px",
          color: theme.infocardText,
          lineHeight: "1.55",
        }}
      >
        {children}
      </div>
    </div>
  );
}

/* ── Property Row (key : value, like Get Info) ─────────────── */
export function PropRow({
  label,
  value,
  theme,
}: {
  label: string;
  value: React.ReactNode;
  theme: ThemeTokens;
}) {
  return (
    <div
      style={{
        display: "flex",
        gap: "12px",
        padding: "8px 0",
        borderWidth: "0 0 1px 0",
        borderStyle: "solid",
        borderColor: isLight(theme) ? "#D8D8D8" : "#2a2e34",
      }}
    >
      <span
        style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: "10px",
          color: theme.textMuted,
          minWidth: "72px",
          flexShrink: 0,
          textTransform: "uppercase",
          letterSpacing: "0.04em",
          paddingTop: "2px",
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: "'IBM Plex Sans', sans-serif",
          fontSize: "13px",
          color: theme.textPrimary,
          lineHeight: "1.55",
        }}
      >
        {value}
      </span>
    </div>
  );
}

/* ── Tag Badge (sharp, OS-style) ──────────────────────────── */
export function TagBadge({
  children,
  theme,
}: {
  children: React.ReactNode;
  theme: ThemeTokens;
}) {
  return (
    <span
      style={{
        fontSize: "10px",
        fontFamily: "'IBM Plex Mono', monospace",
        color: theme.tagText,
        background: theme.tagBg,
        borderRadius: "1px",
        padding: "2px 4px",
        border: `1px solid ${theme.tagBorder}`,
        textTransform: "uppercase",
        letterSpacing: "0.04em",
      }}
    >
      {children}
    </span>
  );
}

/* ── Project Header ──────────────────────────────────────── */
export function ProjectHeader({
  title,
  company,
  description,
  tags,
  theme,
  demoLink,
}: {
  title: string;
  company: string;
  description: string;
  tags: string[];
  theme: ThemeTokens;
  demoLink?: string;
}) {
  return (
    <div style={{ padding: "20px 20px 0" }}>
      {/* Title row */}
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: "8px",
          marginBottom: "8px",
        }}
      >
        <h2
          style={{
            fontSize: "18px",
            color: theme.textStrong,
            fontFamily: "'IBM Plex Sans', sans-serif",
            letterSpacing: "-0.3px",
            margin: 0,
          }}
        >
          {title}
        </h2>
        <span
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: "11px",
            color: theme.textMuted,
          }}
        >
          {company}
        </span>
      </div>

      {/* Description */}
      <p
        style={{
          fontSize: "13px",
          color: theme.textPrimary,
          lineHeight: "1.65",
          margin: "0 0 12px",
          fontFamily: "'IBM Plex Sans', sans-serif",
        }}
      >
        {description}
      </p>

      {/* Tags */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginBottom: "16px" }}>
        {tags.map((tag) => (
          <TagBadge key={tag} theme={theme}>
            {tag}
          </TagBadge>
        ))}
      </div>

      {/* Demo Link */}
      {demoLink && (
        <p
          style={{
            fontSize: "13px",
            color: theme.textPrimary,
            lineHeight: "1.65",
            margin: "0 0 16px",
            fontFamily: "'IBM Plex Sans', sans-serif",
          }}
        >
          Try Demo{" "}
          <a
            href={demoLink}
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
      )}

      {/* Rule */}
      <div
        style={{
          height: "1px",
          background: isLight(theme) ? "#BEBEBE" : "#333",
        }}
      />
    </div>
  );
}
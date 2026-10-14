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
        overflow: "hidden",
        borderRadius: "12px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        aspectRatio: aspectRatio || undefined,
        padding: padding || 0,
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
        padding: 0,
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
          fontSize: "14px",
          color: theme.infocardText,
          lineHeight: "1.6",
        }}
      >
        {children}
      </div>
    </div>
  );
}

/* ── Decision Block (title left, prose right) ─────────────── */
export function DecisionBlock({
  title,
  problem,
  options,
  outcome,
  theme,
}: {
  title: string;
  problem?: React.ReactNode;
  options?: { label: string; text: React.ReactNode }[];
  outcome: React.ReactNode;
  theme: ThemeTokens;
}) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 40px", padding: "8px 0" }}>
      <h3
        style={{
          flex: "0 0 200px",
          margin: 0,
          fontSize: "15px",
          fontWeight: 600,
          lineHeight: 1.4,
          color: theme.textStrong,
          fontFamily: "'IBM Plex Sans', sans-serif",
        }}
      >
        {title}
      </h3>
      <div
        style={{
          flex: "1 1 320px",
          minWidth: 0,
          fontSize: "15px",
          lineHeight: 1.65,
          fontFamily: "'IBM Plex Sans', sans-serif",
        }}
      >
        {problem && <p style={{ margin: 0, color: theme.textPrimary }}>{problem}</p>}
        {options && (
          <div style={{ display: "flex", flexDirection: "column", gap: "6px", color: theme.textPrimary }}>
            {options.map((o) => (
              <div key={o.label} style={{ display: "flex", gap: "12px" }}>
                <span style={{ flexShrink: 0, width: "14px", fontWeight: 600, color: theme.textMuted }}>{o.label}</span>
                <span>{o.text}</span>
              </div>
            ))}
          </div>
        )}
        <div style={{ margin: "12px 0 0", color: theme.textSecondary }}>{outcome}</div>
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
  role,
  description,
  tags,
  theme,
  demoLink,
  demoLabel,
  followLink,
  followLabel,
}: {
  title: string;
  company: string;
  role?: string;
  description: string;
  tags: string[];
  theme: ThemeTokens;
  demoLink?: string;
  demoLabel?: string;
  followLink?: string;
  followLabel?: string;
}) {
  return (
    <div style={{ padding: 0 }}>
      {/* Title row */}
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          flexWrap: "wrap",
          gap: "4px 12px",
          marginBottom: "12px",
        }}
      >
        <h2
          style={{
            fontSize: "28px",
            fontWeight: 600,
            color: theme.textStrong,
            fontFamily: "'IBM Plex Sans', sans-serif",
            letterSpacing: "-0.02em",
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
          {role && ` · ${role}`}
        </span>
      </div>

      {/* Description */}
      <p
        style={{
          fontSize: "15px",
          color: theme.textPrimary,
          lineHeight: "1.65",
          maxWidth: "640px",
          margin: "0 0 16px",
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

      {/* Demo / Follow links */}
      {(demoLink || followLink) && (
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginBottom: "16px" }}>
          {demoLink && (
            <a
              href={demoLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: "11px",
                color: isLight(theme) ? "#007AFF" : "#0A84FF",
                textDecoration: "none",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                borderBottom: `1px solid ${isLight(theme) ? "#007AFF" : "#0A84FF"}`,
                paddingBottom: "1px",
              }}
            >
              {demoLabel || "Try Demo"}
            </a>
          )}
          {followLink && (
            <a
              href={followLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: "11px",
                color: theme.textMuted,
                textDecoration: "none",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                borderBottom: `1px solid ${theme.textMuted}`,
                paddingBottom: "1px",
              }}
            >
              {followLabel || "Follow"}
            </a>
          )}
        </div>
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
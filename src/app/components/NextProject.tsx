import React from "react";
import { ArrowRight } from "lucide-react";
import { useTheme } from "../hooks/useTheme";
import { openPortfolioWindow } from "../utils/portfolioNav";

interface NextProjectProps {
  id: string;
  label: string;
}

export function NextProject({ id, label }: NextProjectProps) {
  const { theme } = useTheme();
  const [hovered, setHovered] = React.useState(false);

  return (
    <button
      onClick={() => openPortfolioWindow(id)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        padding: "12px 16px",
        marginTop: 0,
        background: "transparent",
        border: `1px solid ${hovered ? theme.linkColor : theme.windowBorder}`,
        borderRadius: "8px",
        cursor: "pointer",
        fontFamily: "'IBM Plex Mono', monospace",
        transition: "border-color 0.15s",
        textAlign: "left",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
        <span style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.08em", color: theme.textMuted }}>
          Next case study
        </span>
        <span style={{ fontSize: "13px", color: theme.textPrimary }}>
          {label}
        </span>
      </div>
      <ArrowRight size={16} color={theme.textMuted} />
    </button>
  );
}

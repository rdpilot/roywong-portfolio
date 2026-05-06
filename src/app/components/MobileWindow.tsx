import React, { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useTheme } from "../hooks/useTheme";
import type { ThemeTokens } from "../hooks/useTheme";
const isLight = (t: ThemeTokens) => t.mode !== "dark" && t.mode !== "hailmary";

interface MobileWindowProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  noPadding?: boolean;
}

export function MobileWindow({ title, children, defaultOpen = false, noPadding = false }: MobileWindowProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const { theme } = useTheme();

  return (
    <div
      className="overflow-hidden"
      style={{
        border: `1px solid ${theme.windowBorder}`,
        boxShadow: theme.windowBevelShadow,
        borderRadius: "3px",
      }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-2 px-2 py-2 cursor-pointer"
        style={{
          background: theme.windowChrome,
          borderBottom: isOpen ? `1px solid ${isLight(theme) ? "#999999" : "#1a1a1a"}` : "none",
        }}
      >
        {/* Collapse indicator */}
        <span
          className="flex-shrink-0"
          style={{
            width: "12px",
            height: "12px",
            border: `1px solid ${theme.closeBoxBorder}`,
            background: theme.closeBoxBg,
            borderRadius: "1px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: isLight(theme) ? "0.5px 0.5px 0 #FFFFFF inset" : "0.5px 0.5px 0 rgba(255,255,255,0.1) inset",
          }}
        >
          {isOpen ? (
            <ChevronDown size={9} style={{ color: theme.closeBoxIcon }} />
          ) : (
            <ChevronRight size={9} style={{ color: theme.closeBoxIcon }} />
          )}
        </span>

        {/* Pinstripe left */}
        <div
          className="flex-1 h-3"
          style={{
            background: `repeating-linear-gradient(
              to bottom,
              ${theme.pinstripeA} 0px,
              ${theme.pinstripeA} 1px,
              ${theme.pinstripeB} 1px,
              ${theme.pinstripeB} 2px
            )`,
          }}
        />

        <span
          className="flex-shrink-0 px-1"
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: "12px",
            color: theme.windowTitleText,
          }}
        >
          {title}
        </span>

        {/* Pinstripe right */}
        <div
          className="flex-1 h-3"
          style={{
            background: `repeating-linear-gradient(
              to bottom,
              ${theme.pinstripeA} 0px,
              ${theme.pinstripeA} 1px,
              ${theme.pinstripeB} 1px,
              ${theme.pinstripeB} 2px
            )`,
          }}
        />
      </button>
      {isOpen && (
        <div style={{ background: theme.windowContentBg }}>
          {children}
        </div>
      )}
    </div>
  );
}
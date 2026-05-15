import React, { useState, useEffect } from "react";
import { useTheme } from "../hooks/useTheme";

const STORAGE_KEY = "portfolio_hint_v1";

export function FirstVisitHint() {
  const { theme } = useTheme();
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY)) return;

    const timer = setTimeout(() => {
      setVisible(true);
      sessionStorage.setItem(STORAGE_KEY, "1");

      const autoFade = setTimeout(() => {
        setDismissed(true);
      }, 4000);

      return () => clearTimeout(autoFade);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  const isDark = theme.mode === "dark" || theme.mode === "hailmary";

  return (
    <div
      onClick={() => setDismissed(true)}
      style={{
        position: "fixed",
        top: "52px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 9000,
        padding: "8px 18px",
        borderRadius: "20px",
        border: `1px solid ${theme.windowBorder}`,
        background: isDark ? "rgba(30,30,35,0.94)" : "rgba(255,255,255,0.96)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: "11px",
        color: theme.textSecondary,
        cursor: "pointer",
        whiteSpace: "nowrap",
        pointerEvents: "auto",
        opacity: dismissed ? 0 : 1,
        transition: dismissed ? "opacity 500ms" : "opacity 300ms",
        boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
      }}
    >
      drag windows&nbsp; · &nbsp;click sidebar to explore&nbsp; · &nbsp;press 1–5 for projects
    </div>
  );
}

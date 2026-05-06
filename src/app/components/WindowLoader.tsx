import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "../hooks/useTheme";

export function WindowLoader() {
  const { theme } = useTheme();
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number>(0);
  const startRef = useRef<number>(0);

  const FILL_DURATION = 800;

  useEffect(() => {
    startRef.current = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startRef.current;
      const t = Math.min(elapsed / FILL_DURATION, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setProgress(eased);

      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const isDark = theme.mode === "dark";
  const barBorder = isDark ? "#555555" : "#888888";
  const barBg = isDark ? "#1e2228" : "#FFFFFF";
  const barFill = isDark ? "#888888" : "#555555";
  const textColor = isDark ? "#888888" : "#888888";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 16px",
        background: theme.windowContentBg,
        minHeight: "100%",
        height: "100%",
        gap: "8px",
      }}
    >
      <div
        style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: "11px",
          color: textColor,
          letterSpacing: "0.02em",
        }}
      >
        Loading...
      </div>

      <div
        style={{
          width: "140px",
          height: "12px",
          border: `1.5px solid ${barBorder}`,
          borderRadius: "1px",
          background: barBg,
          padding: "1.5px",
        }}
      >
        <div
          style={{
            width: `${progress * 100}%`,
            height: "100%",
            background: barFill,
            borderRadius: "0px",
          }}
        />
      </div>
    </div>
  );
}
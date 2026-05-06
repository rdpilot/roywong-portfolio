import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "../hooks/useTheme";

interface LoadingScreenProps {
  onFinished: () => void;
}

export function LoadingScreen({ onFinished }: LoadingScreenProps) {
  const { theme } = useTheme();
  const [phase, setPhase] = useState<"filling" | "out">("filling");
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number>(0);
  const startRef = useRef<number>(0);

  const FILL_DURATION = 1200; // ms to fill bar
  const FADE_DURATION = 400; // ms for fade-out

  useEffect(() => {
    startRef.current = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startRef.current;
      const t = Math.min(elapsed / FILL_DURATION, 1);
      // Ease-out cubic for a natural feel
      const eased = 1 - Math.pow(1 - t, 3);
      setProgress(eased);

      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        // Bar full — start fade-out
        setPhase("out");
        setTimeout(() => onFinished(), FADE_DURATION);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [onFinished]);

  const mode = theme.mode;

  const barBorder  = mode === "dark" ? "#888888"
                   : mode === "hailmary" ? "#3a1414"
                   : "#222222";
  const barBg      = mode === "dark" ? "#2a2e34"
                   : mode === "hailmary" ? "#1a0808"
                   : "#FFFFFF";
  const barFill    = mode === "dark" ? "#CCCCCC"
                   : mode === "hailmary" ? "#CC4422"
                   : "#000000";
  const textColor  = mode === "dark" ? "#CCCCCC"
                   : mode === "hailmary" ? "#CCBBBB"
                   : "#222222";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: theme.desktop,
        opacity: phase === "out" ? 0 : 1,
        transition: `opacity ${FADE_DURATION}ms ease-out`,
        pointerEvents: phase === "out" ? "none" : "auto",
      }}
    >
      {/* "Starting up..." label */}
      <div
        style={{
          fontFamily: "'IBM Plex Sans', sans-serif",
          fontSize: "14px",
          color: textColor,
          marginBottom: "12px",
          letterSpacing: "0.01em",
        }}
      >
        Starting up...
      </div>

      {/* Classic Mac progress bar */}
      <div
        style={{
          width: "260px",
          height: "18px",
          border: `2px solid ${barBorder}`,
          borderRadius: "1px",
          background: barBg,
          padding: "2px",
          boxShadow: mode === "dark" || mode === "hailmary"
            ? "inset 0 1px 2px rgba(0,0,0,0.3)"
            : "inset 0 1px 2px rgba(0,0,0,0.08)",
        }}
      >
        <div
          style={{
            width: `${progress * 100}%`,
            height: "100%",
            background: barFill,
            borderRadius: "0px",
            transition: "none",
          }}
        />
      </div>
    </div>
  );
}

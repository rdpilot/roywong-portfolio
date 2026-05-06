import React, { useRef, useState, useCallback, useEffect } from "react";
import { X } from "lucide-react";
import { useTheme } from "../hooks/useTheme";
import type { GestureConfig, GestureAction } from "../hooks/useGestureRecognition";

const GESTURE_KEYS = ["dwell", "fist"] as const;
type GestureKey = typeof GESTURE_KEYS[number];

const GESTURE_LABELS: Record<GestureKey, string> = {
  dwell: "Dwell (hold still)",
  fist:  "Fist",
};

const ACTION_OPTIONS: { value: GestureAction | "click" | "none"; label: string }[] = [
  { value: "click",         label: "Click (at cursor)" },
  { value: "cycle_theme",   label: "Cycle Theme" },
  { value: "open_about",    label: "Open: About" },
  { value: "open_gallery",  label: "Open: Gallery" },
  { value: "open_spray",    label: "Open: Spray & Pray" },
  { value: "open_trading",  label: "Open: Trading" },
  { value: "open_arcade",   label: "Open: Degen Arcade" },
  { value: "open_comiccon", label: "Open: ComicCon" },
  { value: "close_window",  label: "Close Window" },
  { value: "none",          label: "No action" },
];

// Gestures that are always built-in (not configurable)
const BUILT_IN_GESTURES = [
  { key: "open_palm", label: "Open Palm",   action: "Drag window" },
  { key: "two_finger", label: "2 Fingers",  action: "Scroll up / down" },
];

interface GestureConfigPanelProps {
  config: GestureConfig;
  currentGesture: string;
  onConfigChange: (config: GestureConfig) => void;
  onClose: () => void;
}

export function GestureConfigPanel({
  config,
  currentGesture,
  onConfigChange,
  onClose,
}: GestureConfigPanelProps) {
  const { theme } = useTheme();

  const panelRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<{ mouseX: number; mouseY: number; panelX: number; panelY: number } | null>(null);
  const [pos, setPos] = useState({ x: Math.max(20, window.innerWidth / 2 - 200), y: 80 });

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest("button") || target.closest("select")) return;
    dragStartRef.current = { mouseX: e.clientX, mouseY: e.clientY, panelX: pos.x, panelY: pos.y };
    e.preventDefault();
  }, [pos]);

  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      if (!dragStartRef.current) return;
      const { mouseX, mouseY, panelX, panelY } = dragStartRef.current;
      setPos({
        x: Math.max(0, Math.min(window.innerWidth - 400, panelX + (e.clientX - mouseX))),
        y: Math.max(0, Math.min(window.innerHeight - 400, panelY + (e.clientY - mouseY))),
      });
    }
    function onMouseUp() { dragStartRef.current = null; }
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  const handleActionChange = (gesture: GestureKey, value: string) => {
    onConfigChange({ ...config, [gesture]: value as GestureAction | "click" | "none" });
  };

  const gestureLabel = currentGesture !== "none"
    ? currentGesture.replace(/_/g, " ").toUpperCase()
    : "—";

  return (
    <div
      ref={panelRef}
      style={{
        position: "fixed",
        left: pos.x,
        top: pos.y,
        width: 360,
        zIndex: 10000,
        border: `1px solid ${theme.windowBorder}`,
        borderRadius: 8,
        overflow: "hidden",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4), " + theme.windowBevelShadow,
        fontFamily: "'IBM Plex Mono', monospace",
      }}
    >
      {/* Title bar */}
      <div
        style={{
          background: theme.windowChrome,
          borderBottom: `1px solid ${theme.windowBorder}`,
          userSelect: "none",
          cursor: "grab",
          display: "flex",
          alignItems: "center",
          height: 32,
          padding: "0 8px",
          gap: 8,
        }}
        onMouseDown={onMouseDown}
      >
        <button
          onClick={onClose}
          style={{
            width: 14, height: 14, borderRadius: "50%",
            border: `1px solid ${theme.closeBoxBorder}`,
            background: theme.closeBoxBg,
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", flexShrink: 0,
          }}
          aria-label="Close"
        >
          <X size={8} color={theme.closeBoxIcon} strokeWidth={2.5} />
        </button>

        <div
          style={{
            flex: 1, height: "100%",
            backgroundImage: `repeating-linear-gradient(90deg, ${theme.pinstripeA} 0px, ${theme.pinstripeA} 1px, ${theme.pinstripeB} 1px, ${theme.pinstripeB} 3px)`,
          }}
        />

        <span
          style={{
            fontSize: 11, color: theme.windowTitleText,
            position: "absolute", left: "50%", transform: "translateX(-50%)",
            whiteSpace: "nowrap",
          }}
        >
          Gesture Control
        </span>
      </div>

      {/* Content */}
      <div style={{ background: theme.windowContentBg, padding: 14 }}>
        {/* Detected gesture indicator */}
        <div
          style={{
            display: "flex", alignItems: "center", gap: 8,
            marginBottom: 12, padding: "6px 10px",
            background: theme.infocardBg, borderRadius: 5,
            border: `1px solid ${theme.windowBorder}`,
          }}
        >
          <div
            style={{
              width: 8, height: 8, borderRadius: "50%",
              background: currentGesture !== "none" ? "#34D399" : "#555",
              boxShadow: currentGesture !== "none" ? "0 0 6px rgba(52,211,153,0.7)" : "none",
              flexShrink: 0, transition: "background 0.2s, box-shadow 0.2s",
            }}
          />
          <span style={{ fontSize: 10, color: theme.textMuted }}>Detected:</span>
          <span
            style={{
              fontSize: 11,
              color: currentGesture !== "none" ? theme.textStrong : theme.textMuted,
              fontWeight: currentGesture !== "none" ? 600 : 400,
            }}
          >
            {gestureLabel}
          </span>
        </div>

        {/* Configurable mappings */}
        <div style={{ fontSize: 10, color: theme.textMuted, marginBottom: 6, letterSpacing: "0.05em" }}>
          CONFIGURABLE
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 10 }}>
          {GESTURE_KEYS.map((key) => (
            <div
              key={key}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "5px 8px",
                background: currentGesture === key ? "rgba(52,211,153,0.08)" : "transparent",
                borderRadius: 4,
                border: `1px solid ${currentGesture === key ? "rgba(52,211,153,0.25)" : "transparent"}`,
                transition: "background 0.2s, border-color 0.2s",
              }}
            >
              <span style={{ fontSize: 10, color: theme.textSecondary, width: 78, flexShrink: 0 }}>
                {GESTURE_LABELS[key]}
              </span>
              <select
                value={config[key] ?? "none"}
                onChange={(e) => handleActionChange(key, e.target.value)}
                style={{
                  flex: 1, fontSize: 10, color: theme.textPrimary,
                  background: theme.infocardBg,
                  border: `1px solid ${theme.windowBorder}`,
                  borderRadius: 3, padding: "3px 4px",
                  cursor: "pointer", fontFamily: "'IBM Plex Mono', monospace",
                  outline: "none",
                }}
              >
                {ACTION_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          ))}
        </div>

        {/* Built-in gestures */}
        <div style={{ fontSize: 10, color: theme.textMuted, marginBottom: 6, letterSpacing: "0.05em" }}>
          BUILT-IN
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          {BUILT_IN_GESTURES.map(({ key, label, action }) => (
            <div
              key={key}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "5px 8px",
                background: currentGesture === key ? "rgba(52,211,153,0.08)" : "transparent",
                borderRadius: 4,
                border: `1px solid ${currentGesture === key ? "rgba(52,211,153,0.25)" : "transparent"}`,
                transition: "background 0.2s, border-color 0.2s",
              }}
            >
              <span style={{ fontSize: 10, color: theme.textSecondary, width: 78, flexShrink: 0 }}>
                {label}
              </span>
              <span style={{ fontSize: 10, color: theme.textMuted, fontStyle: "italic" }}>
                {action}
              </span>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 10, fontSize: 9, color: theme.textMuted, lineHeight: 1.5 }}>
          Configurable mappings are saved to localStorage.
        </div>
      </div>
    </div>
  );
}

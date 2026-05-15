import React, { useState, useEffect, useRef, memo } from "react";
import { Atom, Sun, Moon, Disc3, Flame, Leaf, Coins, Gamepad2, Globe, Box, Type, Image, TrendingUp, FlaskConical, Camera } from "lucide-react";
import { useTheme } from "../hooks/useTheme";

type WindowId = "about" | "workGallery" | "asciiTool" | "texttura" | "polytrace" | "minecraftVoxelizer" | "orbwarp" | "wavetype" | "sprayAndPray" | "degenArcade" | "comicCon" | "perpetualTrading" | "uTest";

interface MenuBarProps {
  onToggleWindow?: (id: WindowId) => void;
  openWindows?: Set<WindowId>;
  gestureMode?: boolean;
  onToggleGesture?: () => void;
}

const menuItemIcons: Record<string, React.ComponentType<{ size: number; strokeWidth?: number }>> = {
  sprayAndPray: Coins,
  degenArcade: Gamepad2,
  comicCon: Globe,
  perpetualTrading: TrendingUp,
  workGallery: Image,
  asciiTool: Box,
  texttura: Type,
  polytrace: Box,
  minecraftVoxelizer: Box,
  orbwarp: Box,
  wavetype: Type,
  uTest: FlaskConical,
};

const menuCategories: { label: string; items: { id: WindowId; title: string }[] }[] = [
  {
    label: "UI/UX Projects",
    items: [
      { id: "uTest", title: "u/test" },
      { id: "sprayAndPray", title: "Spray & Pray" },
      { id: "degenArcade", title: "Degen Arcade" },
      { id: "comicCon", title: "0n1 Force ComicCon" },
      { id: "perpetualTrading", title: "Perpetual Trading" },
    ],
  },
  {
    label: "Interactive Experiments",
    items: [
      { id: "asciiTool", title: "ASCII effect 3D tool" },
      { id: "texttura", title: "Texttura" },
      { id: "polytrace", title: "Polytrace" },
      { id: "minecraftVoxelizer", title: "Minecraft Voxelizer" },
      { id: "orbwarp", title: "Orbwarp" },
      { id: "wavetype", title: "Wavetype" },
      { id: "workGallery", title: "Gallery" },
    ],
  },
];

/** Isolated clock component — re-renders every minute instead of every second,
 *  preventing the entire MenuBar from re-rendering unnecessarily */
const MenuClock = memo(function MenuClock({ color }: { color: string }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    // Update every 15 seconds — good enough for a clock display, 60x fewer renders
    const interval = setInterval(() => setTime(new Date()), 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span
      className="whitespace-nowrap"
      style={{
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: "12px",
        color,
      }}
    >
      {time.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
      {"  "}
      {time.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}
    </span>
  );
});

// ─── Theme options ────────────────────────────────────────────────────────────
const THEME_OPTIONS = [
  { mode: "light",    label: "Light",    Icon: Sun    },
  { mode: "dark",     label: "Dark",     Icon: Moon   },
  { mode: "hailmary", label: "Lava Lamp", Icon: Flame },
  { mode: "sunny",   label: "Sunny",    Icon: Leaf   },
] as const;

function ThemePicker() {
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };
  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  };

  // Also close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const current = THEME_OPTIONS.find(o => o.mode === theme.mode) ?? THEME_OPTIONS[0];
  const CurrentIcon = current.Icon;

  const btnBorder = theme.mode === "light" ? "#B0B0B0" : theme.mode === "hailmary" ? "#3a1010" : theme.mode === "sunny" ? "#B8B0A0" : "#444";
  const btnBg = theme.mode === "light"
    ? "linear-gradient(to bottom, #F2F2F2, #DDDDDD)"
    : theme.mode === "hailmary"
      ? "linear-gradient(to bottom, #2a0c0c, #1a0606)"
      : theme.mode === "sunny"
        ? "linear-gradient(to bottom, #E8E2D4, #D8D2C4)"
        : "linear-gradient(to bottom, #3a3e44, #2e3238)";

  return (
    <div
      ref={ref}
      style={{ position: "relative" }}
      onMouseEnter={() => { cancelClose(); setOpen(true); }}
      onMouseLeave={scheduleClose}
    >
      {/* Current-mode button */}
      <button
        className="flex items-center justify-center rounded-[3px] transition-colors cursor-pointer"
        style={{ width: 24, height: 24, border: `1px solid ${btnBorder}`, background: btnBg, boxShadow: "none" }}
        aria-label={`Theme: ${current.label}`}
      >
        <CurrentIcon size={12} color={theme.menuBarText} strokeWidth={2} />
      </button>

      {/* Invisible bridge fills the gap so mouse travel doesn't dismiss the menu */}
      {open && (
        <div style={{ position: "absolute", top: "100%", right: 0, width: "100%", height: 8 }} />
      )}

      {/* Dropdown */}
      {open && (
        <div
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            right: 0,
            background: theme.menuBar,
            border: `1px solid ${theme.menuBarBorder}`,
            borderRadius: 4,
            boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
            overflow: "hidden",
            zIndex: 9999,
            minWidth: 120,
          }}
        >
          {THEME_OPTIONS.map(({ mode, label, Icon }) => {
            const active = theme.mode === mode;
            return (
              <button
                key={mode}
                onClick={() => {
                  if (!active) {
                    const steps = (THEME_OPTIONS.findIndex(o => o.mode === mode) -
                      THEME_OPTIONS.findIndex(o => o.mode === theme.mode) + 4) % 4;
                    for (let i = 0; i < steps; i++) toggleTheme();
                  }
                  setOpen(false);
                }}
                className="flex items-center gap-2 w-full cursor-pointer transition-colors"
                style={{
                  padding: "6px 10px",
                  background: active ? "rgba(128,128,128,0.15)" : "transparent",
                  color: theme.menuBarText,
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: 11,
                  fontWeight: active ? 600 : 400,
                  border: "none",
                  textAlign: "left",
                  opacity: 1,
                }}
              >
                <Icon size={11} color={theme.menuBarText} strokeWidth={2} />
                {label}
                {active && (
                  <span style={{ marginLeft: "auto", fontSize: 9, opacity: 0.5 }}>✓</span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function GestureButton({ gestureMode, onToggleGesture }: { gestureMode: boolean; onToggleGesture: () => void }) {
  const { theme } = useTheme();
  const [hovered, setHovered] = useState(false);

  // Active colour is always green — universally means "on"
  const activeBorder = "#22aa66";
  const activeBg     = theme.mode === "dark"
    ? "linear-gradient(to bottom, #1a3a2a, #0f2a1a)"
    : theme.mode === "hailmary"
    ? "linear-gradient(to bottom, #0f2a1a, #0a1f12)"
    : "linear-gradient(to bottom, #d0f0e0, #a0e0c0)";
  const activeIcon   = theme.mode === "dark" || theme.mode === "hailmary" ? "#34D399" : "#059669";

  // Normal state: borrow exact chrome colours from the current theme
  const idleBorder = theme.windowBorder;
  const idleBg     = theme.windowChrome;
  const idleIcon   = theme.menuBarText;

  const isLight = theme.mode === "light" || theme.mode === "sunny";

  return (
    <div style={{ position: "relative" }} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <button
        onClick={onToggleGesture}
        className="flex items-center justify-center rounded-[3px] cursor-pointer"
        style={{
          width: 24,
          height: 24,
          border: `1px solid ${gestureMode ? activeBorder : idleBorder}`,
          background: gestureMode ? activeBg : idleBg,
          boxShadow: gestureMode ? "0 0 6px rgba(52,211,153,0.4)" : "none",
          transition: "background 0.2s, border-color 0.2s, box-shadow 0.2s",
        }}
        aria-label={gestureMode ? "Disable gesture control" : "Enable gesture control"}
      >
        <Camera size={12} color={gestureMode ? activeIcon : idleIcon} strokeWidth={2} />
      </button>

      {/* Custom tooltip */}
      {hovered && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            right: 0,
            width: 230,
            background: isLight ? "rgba(255,255,255,0.97)" : "rgba(30,30,35,0.97)",
            border: `1px solid ${theme.windowBorder}`,
            borderRadius: 6,
            padding: "9px 11px",
            boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
            zIndex: 99999,
            pointerEvents: "none",
            fontFamily: "'IBM Plex Mono', monospace",
          }}
        >
          {/* Arrow */}
          <div style={{
            position: "absolute",
            top: -5,
            right: 9,
            width: 8,
            height: 8,
            background: isLight ? "rgba(255,255,255,0.97)" : "rgba(30,30,35,0.97)",
            border: `1px solid ${theme.windowBorder}`,
            borderBottom: "none",
            borderRight: "none",
            transform: "rotate(45deg)",
          }} />

          <div style={{ fontSize: 10, fontWeight: 700, color: gestureMode ? "#34D399" : theme.textPrimary, marginBottom: 5 }}>
            {gestureMode ? "✦ Gesture mode ON" : "Gesture control"}
          </div>
          <div style={{ fontSize: 9, color: theme.textMuted, lineHeight: 1.65 }}>
            {gestureMode ? (
              <>
                Control the site with your hand via camera.<br />
                <span style={{ color: theme.textSecondary }}>✦ Dwell</span> — hold still over a target to click<br />
                <span style={{ color: theme.textSecondary }}>✦ 2 fingers</span> — swipe up/down to scroll<br />
                <span style={{ color: theme.textSecondary }}>✦ Open palm</span> — move to drag a window<br />
                <span style={{ color: theme.textSecondary }}>✦ Fist</span> — close the active window<br />
                <br />
                <span style={{ color: theme.textMuted }}>Click to turn off.</span>
              </>
            ) : (
              <>
                Use your hand + camera to navigate.<br />
                No touch or mouse needed — point your<br />
                finger at the camera to get started.
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function MenuBar({ onToggleWindow, openWindows, gestureMode, onToggleGesture }: MenuBarProps) {
  const { theme, toggleTheme } = useTheme();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    if (!activeMenu) return;
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setActiveMenu(null);
      }
    };
    window.addEventListener("mousedown", handleClick);
    return () => window.removeEventListener("mousedown", handleClick);
  }, [activeMenu]);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-[9999] h-10 flex items-center justify-between px-3 sm:px-4"
      style={{
        background: theme.menuBar,
        borderBottom: `1px solid ${theme.menuBarBorder}`,
        boxShadow: theme.menuBarShadow,
      }}
    >
      {/* Left: Name + Nav */}
      <div className="flex items-center gap-2" ref={menuRef}>
        <Atom size={16} color={theme.menuBarText} strokeWidth={2} />
        <span
          className="tracking-wide truncate"
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: "13px",
            color: theme.menuBarText,
          }}
        >
          Roy Wong
        </span>

      </div>

      {/* Right: Gesture toggle + Theme picker + Clock */}
      <div className="flex items-center gap-3">
        {onToggleGesture && (
          <GestureButton
            gestureMode={!!gestureMode}
            onToggleGesture={onToggleGesture}
          />
        )}
        <ThemePicker />
        <MenuClock color={theme.menuBarClockText} />
      </div>
    </header>
  );
}
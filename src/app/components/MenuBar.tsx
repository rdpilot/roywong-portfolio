import React, { useState, useEffect, useRef, memo } from "react";
import { Atom, Sun, Moon, Disc3, Flame, Leaf, Coins, Gamepad2, Globe, Box, Type, Image, TrendingUp, FlaskConical } from "lucide-react";
import { useTheme } from "../hooks/useTheme";

type WindowId = "about" | "workGallery" | "asciiTool" | "texttura" | "polytrace" | "minecraftVoxelizer" | "orbwarp" | "wavetype" | "sprayAndPray" | "degenArcade" | "comicCon" | "perpetualTrading" | "uTest";

interface MenuBarProps {
  onToggleWindow?: (id: WindowId) => void;
  openWindows?: Set<WindowId>;
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

export function MenuBar({ onToggleWindow, openWindows }: MenuBarProps) {
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

      {/* Right: Theme picker + Clock */}
      <div className="flex items-center gap-3">
        <ThemePicker />
        <MenuClock color={theme.menuBarClockText} />
      </div>
    </header>
  );
}
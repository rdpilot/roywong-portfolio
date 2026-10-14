import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

export interface ThemeTokens {
  mode: "light" | "dark";
  desktop: string;
  menuBar: string;
  menuBarBorder: string;
  menuBarShadow: string;
  menuBarText: string;
  menuBarClockText: string;
  windowChrome: string;
  windowBorder: string;
  windowBevelShadow: string;
  windowTitleText: string;
  windowContentBg: string;
  pinstripeA: string;
  pinstripeB: string;
  closeBoxBorder: string;
  closeBoxBg: string;
  closeBoxIcon: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textStrong: string;
  linkColor: string;
  linkHover: string;
  dotColor: readonly [number, number, number];
  dotBaseAlpha: number;
  dotMaxAlpha: number;
  iconColor: string;
  iconActiveGlow: string;
  iconActiveBorder: string;
  iconActiveColor: string;
  iconHoverBg: string;
  iconTextShadow: string;
  // WorkGallery-specific
  toolbarBg: string;
  toolbarBorder: string;
  toolbarText: string;
  toolbarActiveBg: string;
  toolbarActiveBorder: string;
  contentBgWhite: string;
  listHeaderBg: string;
  listHeaderBorder: string;
  listHoverBg: string;
  statusBarBg: string;
  statusBarBorder: string;
  thumbBg: string;
  // SprayAndPray
  infocardBg: string;
  infocardTitle: string;
  infocardText: string;
  tagBg: string;
  tagBorder: string;
  tagText: string;
  imageBg: string;
}

// ─── Light ────────────────────────────────────────────────────────────────────
const lightTheme: ThemeTokens = {
  mode: "light",
  desktop: "linear-gradient(160deg, #BDBDBD 0%, #BDBDBD 40%, #BDBDBD 100%)",
  menuBar: "linear-gradient(to bottom, #EEEEEE 0%, #D4D4D4 100%)",
  menuBarBorder: "#999999",
  menuBarShadow: "0 1px 0 rgba(255,255,255,0.6) inset, 0 1px 2px rgba(0,0,0,0.15)",
  menuBarText: "#222222",
  menuBarClockText: "#444444",
  windowChrome: "linear-gradient(to bottom, #E8E8E8 0%, #CCCCCC 100%)",
  windowBorder: "#888888",
  windowBevelShadow: "1px 1px 0 #555555, -1px -1px 0 #FFFFFF inset, 1px 1px 0 #AAAAAA inset",
  windowTitleText: "#222222",
  windowContentBg: "#F6F6F6",
  pinstripeA: "#CCCCCC",
  pinstripeB: "#E0E0E0",
  closeBoxBorder: "#666666",
  closeBoxBg: "linear-gradient(to bottom, #EEEEEE, #CCCCCC)",
  closeBoxIcon: "#444444",
  textPrimary: "#333333",
  textSecondary: "#555555",
  textMuted: "#6E6E6E",
  textStrong: "#111111",
  linkColor: "#0000CC",
  linkHover: "#000000",
  dotColor: [255, 255, 255] as const,
  dotBaseAlpha: 0.1,
  dotMaxAlpha: 0.35,
  iconColor: "#555555",
  iconActiveGlow: "rgba(52,211,153,0.5)",
  iconActiveBorder: "#059669",
  iconActiveColor: "#34D399",
  iconHoverBg: "rgba(0,0,0,0.08)",
  iconTextShadow: "0 1px 0 rgba(255,255,255,0.4)",
  toolbarBg: "linear-gradient(180deg, #F0F0F0 0%, #E0E0E0 100%)",
  toolbarBorder: "#C0C0C0",
  toolbarText: "#666",
  toolbarActiveBg: "#C8C8C8",
  toolbarActiveBorder: "#AAA",
  contentBgWhite: "#FFFFFF",
  listHeaderBg: "#F4F4F4",
  listHeaderBorder: "#D4D4D4",
  listHoverBg: "#F5F5F5",
  statusBarBg: "#F4F4F4",
  statusBarBorder: "#D4D4D4",
  thumbBg: "#E8E8E8",
  infocardBg: "#EAEAEA",
  infocardTitle: "#666",
  infocardText: "#111",
  tagBg: "#E4E4E4",
  tagBorder: "#D0D0D0",
  tagText: "#555",
  imageBg: "#131113",
};

// ─── Dark ─────────────────────────────────────────────────────────────────────
const darkTheme: ThemeTokens = {
  mode: "dark",
  desktop: "linear-gradient(160deg, #1e1e1e 0%, #181818 40%, #202020 100%)",
  menuBar: "linear-gradient(to bottom, #303030 0%, #2a2a2a 100%)",
  menuBarBorder: "#111111",
  menuBarShadow: "0 1px 0 rgba(255,255,255,0.05) inset, 0 1px 3px rgba(0,0,0,0.4)",
  menuBarText: "#CCCCCC",
  menuBarClockText: "#888888",
  windowChrome: "linear-gradient(to bottom, #3c3c3c 0%, #303030 100%)",
  windowBorder: "#3a3a3a",
  windowBevelShadow: "1px 1px 0 #111111, -1px -1px 0 #4a4a4a inset, 1px 1px 0 #3c3c3c inset",
  windowTitleText: "#CCCCCC",
  windowContentBg: "#262626",
  pinstripeA: "#2e2e2e",
  pinstripeB: "#383838",
  closeBoxBorder: "#555555",
  closeBoxBg: "linear-gradient(to bottom, #4a4a4a, #3c3c3c)",
  closeBoxIcon: "#999999",
  textPrimary: "#D4D4D4",
  textSecondary: "#B8B8B8",
  textMuted: "#9A9A9A",
  textStrong: "#E8E8E8",
  linkColor: "#6BA3FF",
  linkHover: "#FFFFFF",
  dotColor: [255, 255, 255] as const,
  dotBaseAlpha: 0.04,
  dotMaxAlpha: 0.18,
  iconColor: "#999999",
  iconActiveGlow: "rgba(52,211,153,0.5)",
  iconActiveBorder: "#059669",
  iconActiveColor: "#34D399",
  iconHoverBg: "rgba(255,255,255,0.06)",
  iconTextShadow: "0 1px 0 rgba(0,0,0,0.5)",
  toolbarBg: "linear-gradient(180deg, #303030 0%, #2c2c2c 100%)",
  toolbarBorder: "#1a1a1a",
  toolbarText: "#999",
  toolbarActiveBg: "#404040",
  toolbarActiveBorder: "#555",
  contentBgWhite: "#222222",
  listHeaderBg: "#2a2a2a",
  listHeaderBorder: "#333",
  listHoverBg: "#2c2c2c",
  statusBarBg: "#2a2a2a",
  statusBarBorder: "#333",
  thumbBg: "#2e2e2e",
  infocardBg: "#2c2c2c",
  infocardTitle: "#888",
  infocardText: "#D0D0D0",
  tagBg: "#333333",
  tagBorder: "#454545",
  tagText: "#B0B0B0",
  imageBg: "#1c1c1c",
};

// ─── Context ──────────────────────────────────────────────────────────────────
type ThemeMode = "light" | "dark";

interface ThemeContextValue {
  theme: ThemeTokens;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: lightTheme,
  toggleTheme: () => {},
});

const THEME_CYCLE: ThemeMode[] = ["light", "dark"];

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem("roywong-theme");
      if (saved === "light" || saved === "dark") return saved;
    } catch {}
    return "light";
  });

  // Persist mode
  useEffect(() => {
    try { localStorage.setItem("roywong-theme", mode); } catch {}
  }, [mode]);

  // Cycle: light → dark → light
  const toggleTheme = useCallback(() => {
    document.documentElement.classList.add("theme-transitioning");
    setMode((prev) => {
      const idx = THEME_CYCLE.indexOf(prev);
      return THEME_CYCLE[(idx + 1) % THEME_CYCLE.length];
    });
    setTimeout(() => {
      document.documentElement.classList.remove("theme-transitioning");
    }, 400);
  }, []);

  const theme = mode === "light" ? lightTheme : darkTheme;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

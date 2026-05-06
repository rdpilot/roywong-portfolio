import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

export interface ThemeTokens {
  mode: "light" | "dark" | "hailmary" | "sunny";
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
  textSecondary: "#666666",
  textMuted: "#999999",
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
  desktop: "linear-gradient(160deg, #141820 0%, #0e1218 40%, #181c24 100%)",
  menuBar: "linear-gradient(to bottom, #2e3238 0%, #22262c 100%)",
  menuBarBorder: "#111111",
  menuBarShadow: "0 1px 0 rgba(255,255,255,0.05) inset, 0 1px 3px rgba(0,0,0,0.4)",
  menuBarText: "#CCCCCC",
  menuBarClockText: "#888888",
  windowChrome: "linear-gradient(to bottom, #3a3e44 0%, #2e3238 100%)",
  windowBorder: "#1a1a1a",
  windowBevelShadow: "1px 1px 0 #111111, -1px -1px 0 #4a4e54 inset, 1px 1px 0 #3a3e44 inset",
  windowTitleText: "#CCCCCC",
  windowContentBg: "#1e2228",
  pinstripeA: "#2a2e34",
  pinstripeB: "#363a40",
  closeBoxBorder: "#555555",
  closeBoxBg: "linear-gradient(to bottom, #4a4e54, #3a3e44)",
  closeBoxIcon: "#999999",
  textPrimary: "#D0D0D0",
  textSecondary: "#999999",
  textMuted: "#666666",
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
  toolbarBg: "linear-gradient(180deg, #2e3238 0%, #262a30 100%)",
  toolbarBorder: "#1a1a1a",
  toolbarText: "#999",
  toolbarActiveBg: "#3e4248",
  toolbarActiveBorder: "#555",
  contentBgWhite: "#1a1e24",
  listHeaderBg: "#22262c",
  listHeaderBorder: "#333",
  listHoverBg: "#262a30",
  statusBarBg: "#22262c",
  statusBarBorder: "#333",
  thumbBg: "#2a2e34",
  infocardBg: "#262a30",
  infocardTitle: "#888",
  infocardText: "#D0D0D0",
  tagBg: "#2a2e34",
  tagBorder: "#3a3e44",
  tagText: "#999",
  imageBg: "#0e1014",
};

// ─── Hail Mary ────────────────────────────────────────────────────────────────
// Fully opaque dark windows over the Unicorn Studio WebGL background.
const hailmaryTheme: ThemeTokens = {
  mode: "hailmary",
  desktop: "#080202",
  menuBar: "linear-gradient(to bottom, #1a0a0a 0%, #120606 100%)",
  menuBarBorder: "#2a0808",
  menuBarShadow: "0 1px 0 rgba(255,80,40,0.06) inset, 0 1px 3px rgba(0,0,0,0.6)",
  menuBarText: "#DDCCCC",
  menuBarClockText: "#886666",
  windowChrome: "linear-gradient(to bottom, #1e0c0c 0%, #160808 100%)",
  windowBorder: "#2e1010",
  windowBevelShadow: "1px 1px 0 #0a0404, -1px -1px 0 #2e1414 inset, 1px 1px 0 #1e0c0c inset",
  windowTitleText: "#CCBBBB",
  windowContentBg: "#100606",
  pinstripeA: "#180a0a",
  pinstripeB: "#200e0e",
  closeBoxBorder: "#3a1414",
  closeBoxBg: "linear-gradient(to bottom, #2e1010, #1e0808)",
  closeBoxIcon: "#886666",
  textPrimary: "#CCBBBB",
  textSecondary: "#886666",
  textMuted: "#553333",
  textStrong: "#EEE0E0",
  linkColor: "#FF7755",
  linkHover: "#FFAA88",
  dotColor: [255, 255, 255] as const,
  dotBaseAlpha: 0.0,
  dotMaxAlpha: 0.0,
  iconColor: "#AA8888",
  iconActiveGlow: "rgba(255,80,40,0.5)",
  iconActiveBorder: "#CC3311",
  iconActiveColor: "#FF6644",
  iconHoverBg: "rgba(255,60,20,0.08)",
  iconTextShadow: "0 1px 0 rgba(0,0,0,0.6)",
  toolbarBg: "linear-gradient(180deg, #1a0a0a 0%, #140606 100%)",
  toolbarBorder: "#2a0e0e",
  toolbarText: "#886666",
  toolbarActiveBg: "#220c0c",
  toolbarActiveBorder: "#3a1414",
  contentBgWhite: "#0c0404",
  listHeaderBg: "#140808",
  listHeaderBorder: "#220e0e",
  listHoverBg: "#180a0a",
  statusBarBg: "#100606",
  statusBarBorder: "#1e0c0c",
  thumbBg: "#1e0c0c",
  infocardBg: "#160808",
  infocardTitle: "#775555",
  infocardText: "#CCBBBB",
  tagBg: "#1a0a0a",
  tagBorder: "#2e1212",
  tagText: "#886666",
  imageBg: "#131113",
};

// ─── Sunny ────────────────────────────────────────────────────────────────────
// Pale concrete / poured cement — light cool gray, like a sunny courtyard floor.
const sunnyTheme: ThemeTokens = {
  ...lightTheme,
  mode: "sunny",
  desktop: "#C8C8C4",
  menuBar: "linear-gradient(to bottom, #D8D8D4 0%, #CACAC6 100%)",
  menuBarBorder: "#ABABAB",
  menuBarShadow: "0 1px 0 rgba(255,255,255,0.5) inset, 0 1px 2px rgba(0,0,0,0.14)",
  menuBarText: "#222220",
  menuBarClockText: "#606060",
  windowChrome: "linear-gradient(to bottom, #E4E4E0 0%, #D8D8D4 100%)",
  windowBorder: "#ABABAB",
  windowTitleText: "#222220",
  windowContentBg: "#F6F6F4",
  pinstripeA: "#D4D4D0",
  pinstripeB: "#E0E0DC",
  closeBoxBorder: "#888888",
  closeBoxBg: "linear-gradient(to bottom, #DCDCDA, #CACAC6)",
  textPrimary: "#2A2A28",
  textSecondary: "#606060",
  textMuted: "#999998",
  textStrong: "#141412",
  linkColor: "#3A3A8A",
  linkHover: "#10106A",
  iconColor: "#444442",
  iconTextShadow: "0 1px 0 rgba(255,255,255,0.7)",
  dotBaseAlpha: 0,
  dotMaxAlpha: 0,
};

// ─── Context ──────────────────────────────────────────────────────────────────
type ThemeMode = "light" | "dark" | "hailmary" | "sunny";

interface ThemeContextValue {
  theme: ThemeTokens;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: lightTheme,
  toggleTheme: () => {},
});

const THEME_CYCLE: ThemeMode[] = ["light", "dark", "hailmary", "sunny"];

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem("roywong-theme");
      if (saved === "light" || saved === "dark" || saved === "hailmary" || saved === "sunny") return saved;
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

  const theme = mode === "light" ? lightTheme : mode === "dark" ? darkTheme : mode === "sunny" ? sunnyTheme : hailmaryTheme;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  lazy,
  Suspense,
  startTransition,
} from "react";
import type { ReactNode } from "react";
import { InteractiveDotGrid } from "./components/InteractiveDotGrid";
import { MobileWindow } from "./components/MobileWindow";
import { useIsMobile } from "./hooks/useIsMobile";
import { ThemeProvider, useTheme } from "./hooks/useTheme";
import { QuickLookProvider } from "./components/QuickLookOverlay";
import { LoadingScreen } from "./components/LoadingScreen";
import {
  routeToWindow,
  windowToRoute,
  getPageTitle,
  getPageDescription,
  type WindowId,
} from "./routes";
import ogImageSrc from "../og-image";
import { DesktopIcon } from "./components/DesktopIcon";
import { DraggableWindow } from "./components/DraggableWindow";
import { MenuBar } from "./components/MenuBar";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { UnicornBackground } from "./components/UnicornBackground";
import { SunnyBackground } from "./components/SunnyBackground";
import { GestureController } from "./components/GestureController";
import { FirstVisitHint } from "./components/FirstVisitHint";
import { Mail } from "lucide-react";

// ─── Lazy window imports ──────────────────────────────────────────────────────
const AboutWindow            = lazy(() => import("./components/windows/AboutWindow").then(m => ({ default: m.AboutWindow })).catch(() => ({ default: () => <div>Failed to load</div> })));
const WorkGalleryWindow      = lazy(() => import("./components/windows/WorkGalleryWindow").then(m => ({ default: m.WorkGalleryWindow })).catch(() => ({ default: () => <div>Failed to load</div> })));
const ProtoCommentsWindow    = lazy(() => import("./components/windows/ProtoCommentsWindow").then(m => ({ default: m.ProtoCommentsWindow })).catch(() => ({ default: () => <div>Failed to load</div> })));
const DeFiWalletWindow       = lazy(() => import("./components/windows/DeFiWalletWindow").then(m => ({ default: m.DeFiWalletWindow })).catch(() => ({ default: () => <div>Failed to load</div> })));
const SprayAndPrayWindow     = lazy(() => import("./components/windows/SprayAndPrayWindow").then(m => ({ default: m.SprayAndPrayWindow })).catch(() => ({ default: () => <div>Failed to load</div> })));
const DegenArcadeWindow      = lazy(() => import("./components/windows/DegenArcadeWindow").then(m => ({ default: m.DegenArcadeWindow })).catch(() => ({ default: () => <div>Failed to load</div> })));
const PerpetualTradingWindow = lazy(() => import("./components/windows/PerpetualTradingWindow").then(m => ({ default: m.PerpetualTradingWindow })).catch(() => ({ default: () => <div>Failed to load</div> })));
const AsciiToolWindow        = lazy(() => import("./components/windows/AsciiToolWindow").then(m => ({ default: m.AsciiToolWindow })).catch(() => ({ default: () => <div>Failed to load</div> })));
const TextturaWindow         = lazy(() => import("./components/windows/TextturaWindow").then(m => ({ default: m.TextturaWindow })).catch(() => ({ default: () => <div>Failed to load</div> })));
const OrbwarpWindow          = lazy(() => import("./components/windows/OrbwarpWindow").then(m => ({ default: m.OrbwarpWindow })).catch(() => ({ default: () => <div>Failed to load</div> })));
const WavetypeWindow         = lazy(() => import("./components/windows/WavetypeWindow").then(m => ({ default: m.WavetypeWindow })).catch(() => ({ default: () => <div>Failed to load</div> })));
const ColorMatchWindow       = lazy(() => import("./components/windows/ColorMatchWindow").then(m => ({ default: m.ColorMatchWindow })).catch(() => ({ default: () => <div>Failed to load</div> })));

// ─── WindowWrapper ────────────────────────────────────────────────────────────
// Lives at MODULE SCOPE so React never sees a new component type between renders.
// Per-window ErrorBoundary (inline) means one broken window never kills the app.
function WindowWrapper({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary inline>
      <Suspense
        fallback={
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              minHeight: "80px",
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: "11px",
              color: "#888",
              opacity: 0.6,
            }}
          >
            Loading…
          </div>
        }
      >
        {children}
      </Suspense>
    </ErrorBoundary>
  );
}

// ─── Window content map ───────────────────────────────────────────────────────
// Also at module scope so element identities are stable across renders.
// IMPORTANT: these elements are intentionally NOT rendered until a window is
// added to `mountedWindows` inside a startTransition — see AppContent below.
// This ensures lazy components NEVER suspend during a synchronous render pass.
const WINDOW_CONTENT: Record<WindowId, ReactNode> = {
  about:              <WindowWrapper><AboutWindow /></WindowWrapper>,
  workGallery:        <WindowWrapper><WorkGalleryWindow /></WindowWrapper>,
  protoComments:      <WindowWrapper><ProtoCommentsWindow /></WindowWrapper>,
  deFiWallet:         <WindowWrapper><DeFiWalletWindow /></WindowWrapper>,
  sprayAndPray:       <WindowWrapper><SprayAndPrayWindow /></WindowWrapper>,
  degenArcade:        <WindowWrapper><DegenArcadeWindow /></WindowWrapper>,
  perpetualTrading:   <WindowWrapper><PerpetualTradingWindow /></WindowWrapper>,
  asciiTool:          <WindowWrapper><AsciiToolWindow /></WindowWrapper>,
  texttura:           <WindowWrapper><TextturaWindow /></WindowWrapper>,
  orbwarp:            <WindowWrapper><OrbwarpWindow /></WindowWrapper>,
  wavetype:           <WindowWrapper><WavetypeWindow /></WindowWrapper>,
  colorMatch:         <WindowWrapper><ColorMatchWindow /></WindowWrapper>,
};

// ─── Static config ────────────────────────────────────────────────────────────
type WindowConfig = {
  id: WindowId;
  title: string;
  icon: string;
  label: string;
  company?: string;
  desc?: string;
  defaultPosition: { x: number; y: number };
  width: number | string;
  docked?: "bottom" | null;
  maxHeight?: number;
  resizable?: boolean;
};

const windowConfigs: WindowConfig[] = [
  { id: "about",              title: "About me",             icon: "about",              label: "About me",             defaultPosition: { x: 580, y: 40 },  width: 440 },
  { id: "workGallery",        title: "Gallery",              icon: "workGallery",        label: "Gallery",              desc: "Browse all work",                               defaultPosition: { x: 360, y: 60 },  width: 520, maxHeight: 480 },
  { id: "protoComments",      title: "proto-comments",       icon: "protoComments",      label: "proto-comments",       company: "Side project",   desc: "AI-native prototype review tool",          defaultPosition: { x: 420, y: 80 },  width: 600, maxHeight: 640 },
  { id: "deFiWallet",         title: "DeFi Wallet Onboarding", icon: "deFiWallet",       label: "DeFi Wallet Onboarding", company: "Crypto.com",   desc: "Wallet creation rate doubled 29% → 59%",   defaultPosition: { x: 460, y: 100 }, width: 600, maxHeight: 640 },
  { id: "sprayAndPray",       title: "Spray & Pray",         icon: "sprayAndPray",       label: "Spray & Pray",         company: "Animoca Brands", desc: "No-loss crypto trading platform",           defaultPosition: { x: 400, y: 60 },  width: 560, maxHeight: 640 },
  { id: "perpetualTrading",   title: "Perpetual Trading",    icon: "perpetualTrading",   label: "Perpetual Trading",    company: "Crypto.com",     desc: "Perpetual trading interface design",        defaultPosition: { x: 440, y: 100 }, width: 750, maxHeight: 560 },
  { id: "degenArcade",        title: "Degen Arcade",         icon: "degenArcade",        label: "Degen Arcade",         company: "Crypto.com",     desc: "Memecoin trading feature for Web3 gaming",      defaultPosition: { x: 480, y: 140 }, width: 560, maxHeight: 560 },
  { id: "asciiTool",          title: "ASCII effect 3D tool", icon: "asciiTool",          label: "ASCII effect 3D tool", desc: "3D models → ASCII art in real time",            defaultPosition: { x: 160, y: 60 },  width: 400 },
  { id: "texttura",           title: "Texttura",             icon: "texttura",           label: "Texttura",             desc: "Layered typography compositor",                 defaultPosition: { x: 200, y: 120 }, width: 400 },
  { id: "orbwarp",            title: "Orbwarp",              icon: "orbwarp",            label: "Orbwarp",              desc: "Shader-based orbital warp effects",             defaultPosition: { x: 320, y: 240 }, width: 400 },
  { id: "wavetype",           title: "Wavetype",             icon: "wavetype",           label: "Wavetype",             desc: "Wave-animated type renderer",                  defaultPosition: { x: 360, y: 280 }, width: 400 },
  { id: "colorMatch",         title: "Color Match",          icon: "colorMatch",         label: "Color Match",          desc: "Match colors by eye — global leaderboard",      defaultPosition: { x: 240, y: 80  }, width: 420, resizable: false },
];

const ALL_WINDOW_IDS = new Set(windowConfigs.map((c) => c.id));

const configMap = Object.fromEntries(
  windowConfigs.map((c) => [c.id, c])
) as Record<WindowId, WindowConfig>;

const desktopSections: { label: string; ids: WindowId[] }[] = [
  { label: "",                        ids: ["about"] },
  { label: "Case Studies",        ids: ["deFiWallet", "sprayAndPray", "perpetualTrading", "degenArcade"] },
  { label: "Built for AI agents", ids: ["protoComments"] },
  { label: "Creative Tools",      ids: ["asciiTool", "texttura", "orbwarp", "wavetype", "workGallery"] },
];

// ─── Color Match mini leaderboard (floating card) ────────────────────────────
const CM_URL = "https://lvpbjesawdsdlpcofoim.supabase.co";
const CM_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2cGJqZXNhd2RzZGxwY29mb2ltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0OTgxMTAsImV4cCI6MjA4NjA3NDExMH0.q9rhmhzGCR2FQGy-b9DE8l_mvVXuozgeWA4u01FWZJk";
const CM_MOCK = [
  { name: "James", score: 587 }, { name: "aaa", score: 543 },
  { name: "Sarah", score: 512 }, { name: "test", score: 478 },
  { name: "mike123", score: 441 }, { name: "asdf", score: 398 },
  { name: "player1", score: 362 }, { name: "idfk", score: 321 },
  { name: "no", score: 274 }, { name: "...", score: 201 },
];
function cmMerge(real: {name:string;score:number}[]) {
  const names = new Set(real.map(e => e.name.toLowerCase()));
  return [...real, ...CM_MOCK.filter(e => !names.has(e.name.toLowerCase()))]
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}

const mobileOrder: { id: WindowId; defaultOpen: boolean; category?: string }[] = [
  { id: "about",              defaultOpen: true },
  { id: "deFiWallet",         defaultOpen: true,  category: "Case Studies" },
  { id: "sprayAndPray",       defaultOpen: true },
  { id: "perpetualTrading",   defaultOpen: true },
  { id: "degenArcade",        defaultOpen: true },
  { id: "protoComments",      defaultOpen: true,  category: "Built for AI agents" },
  { id: "asciiTool",          defaultOpen: true,  category: "Creative Tools" },
  { id: "texttura",           defaultOpen: false },
  { id: "orbwarp",            defaultOpen: false },
  { id: "wavetype",           defaultOpen: false },
  { id: "workGallery",        defaultOpen: false },
];

/** Visually-hidden crawlable nav for SEO */
function CrawlableNav() {
  return (
    <nav
      aria-label="Site navigation"
      style={{
        position: "absolute",
        width: "1px",
        height: "1px",
        padding: 0,
        margin: "-1px",
        overflow: "hidden",
        clip: "rect(0,0,0,0)",
        whiteSpace: "nowrap",
        borderWidth: 0,
      }}
    >
      <h1>Roy Wong — Senior Product Designer</h1>
      <ul>
        <li><a href="/about">About Me</a></li>
        <li><a href="/gallery">Gallery</a></li>
      </ul>
      <h2>Case Studies</h2>
      <ul>
        <li><a href="/projects/defi-wallet">DeFi Wallet Onboarding</a></li>
        <li><a href="/projects/spray-and-pray">Spray &amp; Pray</a></li>
        <li><a href="/projects/perpetual-trading">Perpetual Trading</a></li>
        <li><a href="/projects/degen-arcade">Degen Arcade</a></li>
      </ul>
      <h2>Built for AI agents</h2>
      <ul>
        <li><a href="/projects/proto-comments">proto-comments</a></li>
      </ul>
      <h2>Creative Tools</h2>
      <ul>
        <li><a href="/tools/ascii">ASCII Effect 3D Tool</a></li>
        <li><a href="/tools/texttura">Texttura</a></li>
        <li><a href="/tools/orbwarp">Orbwarp</a></li>
        <li><a href="/tools/wavetype">Wavetype</a></li>
      </ul>
    </nav>
  );
}

// ─── AppContent ───────────────────────────────────────────────────────────────
function AppContent() {
  const isMobile = useIsMobile();
  const { theme, toggleTheme } = useTheme();
  const [siteLoading, setSiteLoading] = useState(true);
  const [gestureMode, setGestureMode] = useState(false);

  const handleLoadingFinished = useCallback(() => setSiteLoading(false), []);

  // Set OG image on mount
  useEffect(() => {
    document.querySelector('meta[property="og:image"]')?.setAttribute("content", ogImageSrc);
    document.querySelector('meta[name="twitter:image"]')?.setAttribute("content", ogImageSrc);
  }, []);

  // ── Window visibility state ──────────────────────────────────────────────
  const getInitialWindows = useCallback((): Set<WindowId> => {
    const path = window.location.pathname;
    const windowId = routeToWindow[path];
    if (windowId && windowId !== "about") {
      return new Set<WindowId>([windowId, "about", "sprayAndPray"]);
    }
    return new Set<WindowId>(["about", "sprayAndPray"]);
  }, []);

  const [openWindows,  setOpenWindows]  = useState<Set<WindowId>>(getInitialWindows);
  const [windowOrder,  setWindowOrder]  = useState<WindowId[]>(["sprayAndPray", "about"]);
  const [miniBoard, setMiniBoard] = useState<{name:string;score:number}[]>(CM_MOCK.slice(0, 3));
  const miniVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    fetch(`${CM_URL}/rest/v1/color_match_scores?select=name,score&order=score.desc&limit=10`, {
      headers: { apikey: CM_KEY, Authorization: `Bearer ${CM_KEY}` },
    })
      .then(r => r.json())
      .then((real: {name:string;score:number}[]) => setMiniBoard(cmMerge(real)))
      .catch(() => {});
  }, []);

  // ── mountedWindows gate ──────────────────────────────────────────────────
  // Starts EMPTY. Lazy content is NEVER rendered during the initial
  // synchronous commit. Everything goes through startTransition so React
  // can handle Suspense in concurrent mode without throwing the
  // "suspended while responding to synchronous input" error.
  const [mountedWindows, setMountedWindows] = useState<Set<WindowId>>(() => new Set());

  // Capture the initial open-set so we can mount it after first paint.
  const initialOpenRef = useRef<Set<WindowId> | null>(null);
  if (initialOpenRef.current === null) {
    initialOpenRef.current = getInitialWindows();
  }

  useEffect(() => {
    startTransition(() => {
      if (isMobile) {
        // Mobile: mount every window immediately — all panels are present in DOM
        setMountedWindows(new Set(ALL_WINDOW_IDS));
      } else {
        // Desktop: start with only the initially-open windows; others mount on
        // first open (inside toggleWindow's startTransition below).
        setMountedWindows(new Set(initialOpenRef.current!));
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentionally runs once

  // ── Window actions ───────────────────────────────────────────────────────
  const toggleWindow = useCallback((id: WindowId) => {
    startTransition(() => {
      setOpenWindows((prev) => {
        const next = new Set(prev);
        if (next.has(id)) { next.delete(id); } else { next.add(id); }
        return next;
      });
      // Mount lazy content for this window the first time it's opened.
      setMountedWindows((prev) => {
        if (prev.has(id)) return prev;
        const next = new Set(prev);
        next.add(id);
        return next;
      });
      setWindowOrder((order) => [...order.filter((w) => w !== id), id]);
    });
  }, []);

  const closeWindow = useCallback((id: WindowId) => {
    setOpenWindows((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const focusWindow = useCallback((id: WindowId) => {
    setWindowOrder((order) => {
      if (order[order.length - 1] === id) return order;
      return [...order.filter((w) => w !== id), id];
    });
  }, []);

  const getZIndex = useCallback(
    (id: WindowId) => {
      const index = windowOrder.indexOf(id);
      return index === -1 ? 10 : 10 + index;
    },
    [windowOrder]
  );

  // ── Gesture action handler ────────────────────────────────────────────────
  const handleGestureAction = useCallback((action: string) => {
    const windowMap: Record<string, WindowId> = {
      open_about:    "about",
      open_gallery:  "workGallery",
      open_spray:    "sprayAndPray",
      open_trading:  "perpetualTrading",
      open_arcade:   "degenArcade",
    };

    if (action === "cycle_theme") {
      toggleTheme();
    } else if (action === "close_window") {
      const focused = windowOrder[windowOrder.length - 1];
      if (focused) closeWindow(focused);
    } else if (windowMap[action]) {
      toggleWindow(windowMap[action]);
    }
    // "click" is handled internally in useGestureRecognition
  }, [toggleTheme, windowOrder, closeWindow, toggleWindow]);

  // ── Sync URL ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const focusedWindowId = windowOrder[windowOrder.length - 1];

    if (focusedWindowId && windowToRoute[focusedWindowId]) {
      const newPath = windowToRoute[focusedWindowId];
      if (window.location.pathname !== newPath) {
        window.history.pushState({}, "", newPath);
      }
    }

    const title       = getPageTitle(focusedWindowId || null);
    const description = getPageDescription(focusedWindowId || null);

    document.title = title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", description);
    document.querySelector('meta[property="og:title"]')?.setAttribute("content", title);
    document.querySelector('meta[property="og:description"]')?.setAttribute("content", description);
    document.querySelector('meta[name="twitter:title"]')?.setAttribute("content", title);
    document.querySelector('meta[name="twitter:description"]')?.setAttribute("content", description);

    if (focusedWindowId && windowToRoute[focusedWindowId]) {
      document.querySelector('link[rel="canonical"]')?.setAttribute(
        "href",
        `https://roywong.com${windowToRoute[focusedWindowId]}`
      );
    }
  }, [windowOrder]);

  // ── Browser back/forward ─────────────────────────────────────────────────
  useEffect(() => {
    const handlePopState = () => {
      const path     = window.location.pathname;
      const windowId = routeToWindow[path];
      if (!windowId) return;

      startTransition(() => {
        setOpenWindows((prev) => {
          if (prev.has(windowId)) return prev;
          const next = new Set(prev);
          next.add(windowId);
          return next;
        });
        setMountedWindows((prev) => {
          if (prev.has(windowId)) return prev;
          const next = new Set(prev);
          next.add(windowId);
          return next;
        });
        setWindowOrder((order) =>
          order.includes(windowId) ? order : [...order, windowId]
        );
      });
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // ── portfolio:navigate listener ───────────────────────────────────────────
  useEffect(() => {
    const handlePortfolioNavigate = (e: Event) => {
      const id = (e as CustomEvent<{ id: string }>).detail.id;
      if (ALL_WINDOW_IDS.has(id as WindowId)) {
        toggleWindow(id as WindowId);
      }
    };
    window.addEventListener("portfolio:navigate", handlePortfolioNavigate);
    return () => window.removeEventListener("portfolio:navigate", handlePortfolioNavigate);
  }, [toggleWindow]);

  // ── Keyboard shortcuts 1–5 ────────────────────────────────────────────────
  useEffect(() => {
    const keyMap: Record<string, WindowId> = {
      "1": "deFiWallet",
      "2": "sprayAndPray",
      "3": "perpetualTrading",
      "4": "degenArcade",
      "5": "protoComments",
    };
    const handleKeydown = (e: KeyboardEvent) => {
      const tag = document.activeElement?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      const id = keyMap[e.key];
      if (id) toggleWindow(id);
    };
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [toggleWindow]);

  // ── Konami code easter egg ─────────────────────────────────────────────────
  const konamiRef = useRef<string[]>([]);
  const KONAMI = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];
  const [konamiToast, setKonamiToast] = useState<string | null>(null);

  useEffect(() => {
    const handleKonami = (e: KeyboardEvent) => {
      konamiRef.current = [...konamiRef.current, e.key].slice(-10);
      if (konamiRef.current.join(",") === KONAMI.join(",")) {
        // Switch to hailmary theme
        const THEME_CYCLE = ["light", "dark", "hailmary", "sunny"];
        const currentIdx = THEME_CYCLE.indexOf(theme.mode);
        const hailmaryIdx = 2;
        const steps = (hailmaryIdx - currentIdx + 4) % 4;
        for (let i = 0; i < steps; i++) toggleTheme();

        setKonamiToast("🎮 cheat code activated");
        setTimeout(() => setKonamiToast(null), 3000);
      }
    };
    window.addEventListener("keydown", handleKonami);
    return () => window.removeEventListener("keydown", handleKonami);
  }, [theme.mode, toggleTheme]);

  // ── Helpers ──────────────────────────────────────────────────────────────
  // Returns the lazy content for a window only after it has been mounted via
  // a startTransition — guarantees no synchronous Suspense during user input.
  const getContent = (id: WindowId): ReactNode =>
    mountedWindows.has(id) ? WINDOW_CONTENT[id] : null;


  // ─── Mobile Layout ────────────────────────────────────────────────────────
  if (isMobile) {
    return (
      <main
        className="w-full min-h-screen"
        style={{ background: theme.desktop }}
      >
        {theme.mode === "hailmary" && <UnicornBackground />}
        {theme.mode === "sunny" && <SunnyBackground />}
        {siteLoading && <LoadingScreen onFinished={handleLoadingFinished} />}
        <CrawlableNav />
        <MenuBar />
        <div className="pt-12 pb-6 px-3 flex flex-col gap-2" style={{ position: "relative" }}>
          {mobileOrder.map(({ id, defaultOpen, category }) => (
            <div key={id}>
              {category && (
                <div
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: "10px",
                    color: theme.textMuted,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    padding: "8px 4px 0",
                  }}
                >
                  {category}
                </div>
              )}
              <MobileWindow title={configMap[id].title} defaultOpen={defaultOpen}>
                {getContent(id)}
              </MobileWindow>
            </div>
          ))}
        </div>
      </main>
    );
  }

  // ─── Desktop Layout ───────────────────────────────────────────────────────
  return (
    <main
      className="w-full h-screen overflow-hidden relative"
      style={{ background: theme.desktop }}
    >
      {theme.mode === "hailmary" && <UnicornBackground />}
      {theme.mode === "sunny" && <SunnyBackground />}
      {siteLoading && <LoadingScreen onFinished={handleLoadingFinished} />}
      <CrawlableNav />

      <MenuBar
        onToggleWindow={toggleWindow}
        openWindows={openWindows}
        gestureMode={gestureMode}
        onToggleGesture={() => setGestureMode((v) => !v)}
      />

      {gestureMode && <GestureController onAction={handleGestureAction} />}

      {/* Dotted background */}
      <div className="absolute inset-0 mt-10" style={{ zIndex: 1 }}>
        <InteractiveDotGrid />
      </div>

      {/* Desktop icons */}
      <div className="absolute top-14 bottom-0 left-4 z-[5] flex flex-col justify-between pb-5">
        <div className="flex flex-col gap-0.5">
          {desktopSections.map((category, catIdx) => (
            <div key={catIdx}>
              {category.label && (
                <div
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: "10px",
                    fontWeight: 500,
                    color: theme.textSecondary,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    padding: "10px 4px 4px",
                    marginTop: catIdx > 0 ? "6px" : "0",
                  }}
                >
                  {category.label}
                </div>
              )}
              {category.ids.map((id) => {
                const config = configMap[id];
                return (
                  <DesktopIcon
                    key={config.id}
                    label={config.label}
                    icon={config.icon}
                    company={config.company}
                    desc={config.desc}
                    onClick={() => toggleWindow(config.id)}
                    isOpen={openWindows.has(config.id)}
                  />
                );
              })}
            </div>
          ))}
        </div>

        {/* Color Match card — pinned to bottom of sidebar */}
        {(() => {
          const isDark = theme.mode === "dark" || theme.mode === "hailmary";
          const cardBg = isDark ? theme.windowContentBg : "#E0E0E0";
          const cardBorder = openWindows.has("colorMatch") ? theme.linkColor : theme.windowBorder;
          const cardShadow = openWindows.has("colorMatch") ? `0 0 0 1px ${theme.linkColor}40` : "none";
          const titleColor = theme.windowTitleText;
          const rankColor = theme.textMuted;
          const nameColor = isDark ? "rgba(255,255,255,0.65)" : theme.textSecondary ?? theme.textMuted;
          const scoreColor = titleColor;
          return (
            <button
              onClick={() => toggleWindow("colorMatch")}
              style={{
                width: "152px",
                borderRadius: "10px",
                border: `1px solid ${cardBorder}`,
                padding: "9px 11px 10px",
                cursor: "pointer",
                background: cardBg,
                boxShadow: cardShadow,
                transition: "box-shadow 0.15s, border-color 0.15s, transform 0.15s",
                textAlign: "left",
                fontFamily: "'Syne', sans-serif",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.04)"; miniVideoRef.current?.play(); }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; const v = miniVideoRef.current; if (v) { v.pause(); v.currentTime = 0; } }}
              title="Color Match — designer mini game"
            >
              <div style={{ display: "flex", gap: 9, alignItems: "stretch" }}>
                <div style={{ width: 52, flexShrink: 0, borderRadius: 6, overflow: "hidden", background: isDark ? cardBg : "#1a1a1a" }}>
                  <video ref={miniVideoRef} src="/color-match-hero.mp4" muted playsInline style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", mixBlendMode: isDark ? "screen" : "normal" }} />
                </div>
                <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 5 }}>
                  <span style={{ color: titleColor, fontSize: 8, fontWeight: 700, letterSpacing: "0.02em", fontFamily: "'Syne', sans-serif", whiteSpace: "nowrap" }}>Color Match</span>
                  <div style={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                    {miniBoard.map((e, i) => (
                      <div key={i} style={{ display: "flex", gap: 5, alignItems: "center" }}>
                        <span style={{ color: rankColor, fontSize: 8, width: 8, textAlign: "right", fontFamily: "'IBM Plex Mono', monospace", flexShrink: 0 }}>{i + 1}</span>
                        <span style={{ color: nameColor, fontSize: 8, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontFamily: "'IBM Plex Mono', monospace" }}>{e.name}</span>
                        <span style={{ color: scoreColor, fontSize: 8, fontFamily: "'IBM Plex Mono', monospace", flexShrink: 0 }}>{e.score}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </button>
          );
        })()}
      </div>

      {/* Windows */}
      <div className="absolute inset-0 mt-10">
        {windowConfigs.map((config) => (
          <DraggableWindow
            key={config.id}
            id={config.id}
            title={config.title}
            isOpen={openWindows.has(config.id)}
            onClose={() => closeWindow(config.id)}
            onFocus={() => focusWindow(config.id)}
            zIndex={config.docked ? 50 : getZIndex(config.id)}
            defaultPosition={config.defaultPosition}
            width={config.width}
            docked={config.docked || null}
            maxHeight={config.maxHeight || undefined}
            resizable={config.resizable !== false}
          >
            {getContent(config.id)}
          </DraggableWindow>
        ))}
      </div>

      {konamiToast && (
        <div style={{
          position: "fixed",
          top: "60px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 99999,
          background: "linear-gradient(135deg, #ff6b6b, #feca57, #48dbfb, #ff9ff3)",
          borderRadius: "12px",
          padding: "10px 20px",
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: "13px",
          color: "#111",
          fontWeight: 700,
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
          pointerEvents: "none",
        }}>
          {konamiToast}
        </div>
      )}


      <FirstVisitHint />
    </main>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <QuickLookProvider>
          <AppContent />
        </QuickLookProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
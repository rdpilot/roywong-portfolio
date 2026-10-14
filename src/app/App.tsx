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
import { useIsMobile } from "./hooks/useIsMobile";
import { ThemeProvider, useTheme } from "./hooks/useTheme";
import { QuickLookProvider } from "./components/QuickLookOverlay";
import {
  routeToWindow,
  windowToRoute,
  getPageTitle,
  getPageDescription,
  type WindowId,
} from "./routes";
import ogImageSrc from "../og-image";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { Menu, X, Sun, Moon } from "lucide-react";

// ─── Lazy window imports ──────────────────────────────────────────────────────
const AboutWindow            = lazy(() => import("./components/windows/AboutWindow").then(m => ({ default: m.AboutWindow })).catch(() => ({ default: () => <div>Failed to load</div> })));
const WorkGalleryWindow      = lazy(() => import("./components/windows/WorkGalleryWindow").then(m => ({ default: m.WorkGalleryWindow })).catch(() => ({ default: () => <div>Failed to load</div> })));
const DeFiWalletWindow       = lazy(() => import("./components/windows/DeFiWalletWindow").then(m => ({ default: m.DeFiWalletWindow })).catch(() => ({ default: () => <div>Failed to load</div> })));
const SprayAndPrayWindow     = lazy(() => import("./components/windows/SprayAndPrayWindow").then(m => ({ default: m.SprayAndPrayWindow })).catch(() => ({ default: () => <div>Failed to load</div> })));
const DegenArcadeWindow      = lazy(() => import("./components/windows/DegenArcadeWindow").then(m => ({ default: m.DegenArcadeWindow })).catch(() => ({ default: () => <div>Failed to load</div> })));
const PerpetualTradingWindow = lazy(() => import("./components/windows/PerpetualTradingWindow").then(m => ({ default: m.PerpetualTradingWindow })).catch(() => ({ default: () => <div>Failed to load</div> })));
const CreativeToolsWindow    = lazy(() => import("./components/windows/CreativeToolsWindow").then(m => ({ default: m.CreativeToolsWindow })).catch(() => ({ default: () => <div>Failed to load</div> })));
const OneGoodThingWindow     = lazy(() => import("./components/windows/OneGoodThingWindow").then(m => ({ default: m.OneGoodThingWindow })).catch(() => ({ default: () => <div>Failed to load</div> })));

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
              fontSize: "12px",
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
  oneGoodThing:       <WindowWrapper><OneGoodThingWindow /></WindowWrapper>,
  deFiWallet:         <WindowWrapper><DeFiWalletWindow /></WindowWrapper>,
  sprayAndPray:       <WindowWrapper><SprayAndPrayWindow /></WindowWrapper>,
  degenArcade:        <WindowWrapper><DegenArcadeWindow /></WindowWrapper>,
  perpetualTrading:   <WindowWrapper><PerpetualTradingWindow /></WindowWrapper>,
  creativeTools:      <WindowWrapper><CreativeToolsWindow /></WindowWrapper>,
};

// ─── Nav config ───────────────────────────────────────────────────────────────
const LABELS: Record<WindowId, string> = {
  about: "About",
  workGallery: "Gallery",
  oneGoodThing: "1 Good Thing",
  deFiWallet: "DeFi Wallet Onboarding",
  sprayAndPray: "Spray & Pray",
  perpetualTrading: "Perpetual Trading",
  degenArcade: "Degen Arcade",
  creativeTools: "Creative tools",
};

const navSections: { label: string; ids: WindowId[] }[] = [
  { label: "", ids: ["about"] },
  { label: "Case studies", ids: ["oneGoodThing", "deFiWallet", "sprayAndPray", "perpetualTrading", "degenArcade"] },
  { label: "", ids: ["creativeTools", "workGallery"] },
];

const ALL_WINDOW_IDS = new Set(Object.keys(LABELS));

const KEY_MAP: Record<string, WindowId> = {
  "1": "oneGoodThing",
  "2": "deFiWallet",
  "3": "sprayAndPray",
  "4": "perpetualTrading",
  "5": "degenArcade",
};

function NavList({ activeId, onSelect }: { activeId: WindowId; onSelect: (id: WindowId) => void }) {
  const { theme } = useTheme();
  return (
    <nav aria-label="Site navigation" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {navSections.map((section, i) => (
        <div key={i} style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          {section.label && (
            <div style={{ fontSize: "12px", fontWeight: 500, color: theme.textMuted, padding: "0 10px 6px" }}>
              {section.label}
            </div>
          )}
          {section.ids.map((id) => {
            const active = id === activeId;
            return (
              <a
                key={id}
                href={windowToRoute[id]}
                onClick={(e) => {
                  e.preventDefault();
                  onSelect(id);
                }}
                aria-current={active ? "page" : undefined}
                style={{
                  display: "block",
                  padding: "6px 10px",
                  borderRadius: "6px",
                  fontSize: "14px",
                  textDecoration: "none",
                  color: active ? theme.textStrong : theme.textSecondary,
                  fontWeight: active ? 500 : 400,
                  background: active ? theme.iconHoverBg : "transparent",
                }}
              >
                {LABELS[id]}
              </a>
            );
          })}
        </div>
      ))}
    </nav>
  );
}

// ─── AppContent ───────────────────────────────────────────────────────────────
function AppContent() {
  const isMobile = useIsMobile();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const [activeId, setActiveId] = useState<WindowId>(
    () => routeToWindow[window.location.pathname] ?? "about"
  );

  useEffect(() => {
    document.querySelector('meta[property="og:image"]')?.setAttribute("content", ogImageSrc);
    document.querySelector('meta[name="twitter:image"]')?.setAttribute("content", ogImageSrc);
  }, []);

  const select = useCallback((id: WindowId) => {
    startTransition(() => setActiveId(id));
    setMenuOpen(false);
  }, []);

  // URL + meta sync
  useEffect(() => {
    const route = windowToRoute[activeId];
    if (window.location.pathname !== route) window.history.pushState({}, "", route);
    const title = getPageTitle(activeId);
    const description = getPageDescription(activeId);
    document.title = title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", description);
    document.querySelector('meta[property="og:title"]')?.setAttribute("content", title);
    document.querySelector('meta[property="og:description"]')?.setAttribute("content", description);
    document.querySelector('meta[name="twitter:title"]')?.setAttribute("content", title);
    document.querySelector('meta[name="twitter:description"]')?.setAttribute("content", description);
    document.querySelector('link[rel="canonical"]')?.setAttribute("href", `https://roywong.com${route}`);
    panelRef.current?.scrollTo({ top: 0 });
  }, [activeId]);

  // Back/forward
  useEffect(() => {
    const onPop = () => {
      const id = routeToWindow[window.location.pathname];
      if (id) startTransition(() => setActiveId(id));
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  // In-content navigation (NextProject etc.)
  useEffect(() => {
    const onNavigate = (e: Event) => {
      const id = (e as CustomEvent<{ id: string }>).detail.id;
      if (ALL_WINDOW_IDS.has(id)) select(id as WindowId);
    };
    window.addEventListener("portfolio:navigate", onNavigate);
    return () => window.removeEventListener("portfolio:navigate", onNavigate);
  }, [select]);

  // Keyboard shortcuts 1-6
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = document.activeElement?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const id = KEY_MAP[e.key];
      if (id) select(id);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [select]);

  const isDark = theme.mode === "dark";
  const ThemeIcon = isDark ? Sun : Moon;

  const themeButton = (
    <button
      onClick={toggleTheme}
      aria-label="Change theme"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "6px 10px",
        borderRadius: "6px",
        border: "none",
        background: "transparent",
        color: theme.textSecondary,
        fontSize: "13px",
        cursor: "pointer",
        fontFamily: "inherit",
      }}
    >
      <ThemeIcon size={14} />
      <span style={{ textTransform: "capitalize" }}>{theme.mode}</span>
    </button>
  );

  const header = (
    <div style={{ padding: "0 10px 24px" }}>
      <div style={{ fontSize: "15px", fontWeight: 600, color: theme.textStrong, letterSpacing: "-0.01em" }}>Roy Wong</div>
      <div style={{ fontSize: "13px", color: theme.textMuted, marginTop: "2px" }}>Senior product designer</div>
    </div>
  );

  const content = (
    <div
      ref={panelRef}
      style={{ flex: 1, minWidth: 0, overflowY: "auto", height: isMobile ? "auto" : "100vh" }}
    >
      <div style={{ maxWidth: "920px", margin: "0 auto", padding: isMobile ? "24px 16px 56px" : "56px 48px 96px" }}>
        <WindowWrapper key={activeId}>{WINDOW_CONTENT[activeId]}</WindowWrapper>
      </div>
    </div>
  );

  return (
    <main
      className="geist-root"
      style={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        minHeight: "100vh",
        background: theme.windowContentBg,
        color: theme.textPrimary,
        fontFamily: "'Geist', system-ui, sans-serif",
      }}
    >
      {isMobile ? (
        <>
          <div
            style={{
              position: "sticky",
              top: 0,
              zIndex: 50,
              background: theme.windowContentBg,
              borderBottom: `1px solid ${theme.windowBorder}`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px" }}>
              <div>
                <div style={{ fontSize: "15px", fontWeight: 600, color: theme.textStrong }}>Roy Wong</div>
                <div style={{ fontSize: "12px", color: theme.textMuted }}>{LABELS[activeId]}</div>
              </div>
              <button
                onClick={() => setMenuOpen((o) => !o)}
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                aria-expanded={menuOpen}
                style={{ background: "transparent", border: "none", color: theme.textStrong, padding: "6px", cursor: "pointer" }}
              >
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
            {menuOpen && (
              <div style={{ padding: "4px 12px 16px", maxHeight: "calc(100vh - 64px)", overflowY: "auto" }}>
                <NavList activeId={activeId} onSelect={select} />
                <div style={{ marginTop: "16px" }}>{themeButton}</div>
              </div>
            )}
          </div>
          {content}
        </>
      ) : (
        <>
          <aside
            style={{
              width: "240px",
              flexShrink: 0,
              height: "100vh",
              position: "sticky",
              top: 0,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: "28px 14px 20px",
              borderRight: `1px solid ${theme.windowBorder}`,
              overflowY: "auto",
            }}
          >
            <div>
              {header}
              <NavList activeId={activeId} onSelect={select} />
            </div>
            {themeButton}
          </aside>
          {content}
        </>
      )}
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

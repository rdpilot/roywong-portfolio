import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from "react";
import { X } from "lucide-react";
import { useTheme } from "../hooks/useTheme";
import type { ThemeTokens } from "../hooks/useTheme";
const isLight = (t: ThemeTokens) => t.mode !== "dark" && t.mode !== "hailmary";

interface QuickLookItem {
  src: string;
  alt?: string;
  type: "image" | "video";
}

interface QuickLookCtx {
  openQuickLook: (item: QuickLookItem) => void;
  closeQuickLook: () => void;
}

const QuickLookContext = createContext<QuickLookCtx>({
  openQuickLook: () => {},
  closeQuickLook: () => {},
});

export const useQuickLook = () => useContext(QuickLookContext);

export function QuickLookProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  const [item, setItem] = useState<QuickLookItem | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const openQuickLook = useCallback((i: QuickLookItem) => setItem(i), []);
  const closeQuickLook = useCallback(() => setItem(null), []);

  // Escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Escape" && item) {
        setItem(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [item]);

  const safeAutoPlay = useCallback((el: HTMLVideoElement | null) => {
    videoRef.current = el;
    if (el) el.play().catch(() => {});
  }, []);

  // Derive a short filename from the src for the title bar
  const titleFromSrc = (src: string) => {
    try {
      const parts = src.split("/");
      return parts[parts.length - 1] || "Preview";
    } catch {
      return "Preview";
    }
  };

  return (
    <QuickLookContext.Provider value={{ openQuickLook, closeQuickLook }}>
      {children}

      {item && (
        <div
          className="fixed inset-0 flex items-center justify-center"
          style={{ zIndex: 9999, background: "rgba(0,0,0,0.75)" }}
          onClick={closeQuickLook}
        >
          <div
            className="relative overflow-hidden shadow-2xl"
            style={{
              maxWidth: "80vw",
              maxHeight: "80vh",
              border: `1px solid ${theme.windowBorder}`,
              boxShadow: `${theme.windowBevelShadow}, 0 20px 60px rgba(0,0,0,0.5)`,
              borderRadius: "3px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Title bar */}
            <div
              className="flex items-center justify-between px-2"
              style={{
                height: "24px",
                background: theme.windowChrome,
                borderBottom: `1px solid ${isLight(theme) ? "#999999" : "#1a1a1a"}`,
                minHeight: "24px",
              }}
            >
              <button
                className="flex-shrink-0 cursor-pointer"
                style={{
                  width: "12px",
                  height: "12px",
                  border: `1px solid ${theme.closeBoxBorder}`,
                  background: theme.closeBoxBg,
                  borderRadius: "1px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onClick={closeQuickLook}
              >
                <X size={8} color={theme.closeBoxIcon} strokeWidth={2.5} />
              </button>
              <span
                style={{
                  fontSize: "11px",
                  color: theme.windowTitleText,
                  fontFamily: "'IBM Plex Mono', monospace",
                }}
              >
                {item.alt || titleFromSrc(item.src)}
              </span>
              <div style={{ width: "12px" }} />
            </div>

            {/* Content */}
            <div style={{ background: isLight(theme) ? "#E0E0E0" : "#1a1e24" }}>
              {item.type === "image" ? (
                <img
                  src={item.src}
                  alt={item.alt || "Preview"}
                  loading="lazy"
                  className="block mx-auto"
                  style={{ maxWidth: "80vw", maxHeight: "calc(80vh - 24px)", objectFit: "contain" }}
                />
              ) : (
                <video
                  ref={safeAutoPlay}
                  src={item.src}
                  muted
                  loop
                  playsInline
                  preload="auto"
                  autoPlay
                  className="block mx-auto"
                  style={{ maxWidth: "80vw", maxHeight: "calc(80vh - 24px)", objectFit: "contain" }}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </QuickLookContext.Provider>
  );
}
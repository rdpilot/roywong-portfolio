import React, { useState, useCallback, useEffect, useRef } from "react";
import { useIsMobile } from "../../hooks/useIsMobile";
import { useTheme } from "../../hooks/useTheme";
import type { ThemeTokens } from "../../hooks/useTheme";
const isLight = (t: ThemeTokens) => t.mode !== "dark" && t.mode !== "hailmary";
import { X, LayoutGrid, List, Film, Shuffle, Image } from "lucide-react";

const videoItems = [
  { src: "https://i.imgur.com/dMTZqqk.mp4", name: "claude_prototype_05.mp4", size: "3.5 MB" },
  { src: "https://i.imgur.com/E8XOQFh.mp4", name: "wavetype_output_02.mp4", size: "2.5 MB" },
  { src: "https://i.imgur.com/4D7eumy.mp4", name: "orbwarp_shader_01.mp4", size: "4.2 MB" },
  { src: "https://i.imgur.com/33a6lqO.mp4", name: "ascii_3d_render_02.mp4", size: "2.0 MB" },
  { src: "https://i.imgur.com/uPsJ8Fc.mp4", name: "wavetype_output_05.mp4", size: "2.6 MB" },
  { src: "https://i.imgur.com/GwJFisG.mp4", name: "polytrace_output_01.mp4", size: "3.1 MB" },
  { src: "https://i.imgur.com/kAjf1CU.mp4", name: "claude_prototype_04.mp4", size: "980 KB" },
  { src: "https://i.imgur.com/tDEflFR.mp4", name: "ascii_3d_render_03.mp4", size: "3.3 MB" },
  { src: "https://i.imgur.com/rT4YJ7y.mp4", name: "wavetype_output_04.mp4", size: "2.2 MB" },
  { src: "https://i.imgur.com/L0a6mdz.mp4", name: "claude_prototype_02.mp4", size: "1.2 MB" },
  { src: "https://i.imgur.com/fh8nn35.mp4", name: "voxelizer_render_01.mp4", size: "2.4 MB" },
  { src: "https://i.imgur.com/dawv313.mp4", name: "ascii_3d_render_01.mp4", size: "2.1 MB" },
  { src: "https://i.imgur.com/TCIwR1h.mp4", name: "wavetype_output_01.mp4", size: "1.3 MB" },
  { src: "https://i.imgur.com/ElarQnN.mp4", name: "claude_prototype_03.mp4", size: "1.6 MB" },
  { src: "https://i.imgur.com/683vM09.mp4", name: "orbwarp_shader_02.mp4", size: "2.8 MB" },
  { src: "https://i.imgur.com/UIGUcBQ.mp4", name: "texttura_preview_01.mp4", size: "2.7 MB" },
  { src: "https://i.imgur.com/9CaShKP.mp4", name: "claude_prototype_01.mp4", size: "1.8 MB" },
  { src: "https://i.imgur.com/QJLSfpE.png", name: "polytrace_output_03.png", size: "1.1 MB" },
  { src: "https://i.imgur.com/fknajW8.mp4", name: "ascii_3d_render_04.mp4", size: "2.3 MB" },
  { src: "https://i.imgur.com/dWHaIK0.mp4", name: "wavetype_output_03.mp4", size: "1.9 MB" },
  { src: "https://i.imgur.com/ulwYRQS.mp4", name: "claude_prototype_07.mp4", size: "1.4 MB" },
  { src: "https://i.imgur.com/wg65B6m.mp4", name: "polytrace_output_02.mp4", size: "1.9 MB" },
];

type ViewMode = "grid" | "list";

const isImage = (src: string) => /\.(png|jpe?g|gif|webp|svg)$/i.test(src);

/* ── Lazy Video Thumbnail — only loads when scrolled into view ── */
function LazyVideoThumb({ src, onError }: { src: string; onError?: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let disposed = false;
    const markVisible = () => { if (!disposed) setIsVisible(true); };
    const timer = setTimeout(markVisible, 200);

    const el = ref.current;
    if (el) {
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) { markVisible(); obs.disconnect(); } },
        { rootMargin: "200px" }
      );
      obs.observe(el);
      return () => { disposed = true; clearTimeout(timer); obs.disconnect(); };
    }
    return () => { disposed = true; clearTimeout(timer); };
  }, []);

  return (
    <div ref={ref} className="w-full h-full relative" style={{ background: "#1a1a1a" }}>
      {isVisible && !failed && (
        <video
          src={src}
          autoPlay
          muted
          playsInline
          loop
          preload="auto"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
          style={{ pointerEvents: "none" }}
          onError={() => {
            setFailed(true);
            if (onError) onError();
          }}
        />
      )}
      {failed && (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.4)" }}
        >
          <Film size={20} style={{ color: "rgba(255,255,255,0.4)" }} />
        </div>
      )}
    </div>
  );
}

export function WorkGalleryWindow() {
  const isMobile = useIsMobile();
  const { theme } = useTheme();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [items, setItems] = useState(videoItems);
  const containerRef = useRef<HTMLDivElement>(null);

  const shuffleItems = useCallback(() => {
    setItems((prev) => {
      const shuffled = [...prev];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    });
    setSelectedIndex(null);
    setExpandedIndex(null);
  }, []);

  // Spacebar Quick Look
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && selectedIndex !== null && expandedIndex === null) {
        e.preventDefault();
        setExpandedIndex(selectedIndex);
      } else if (e.code === "Space" && expandedIndex !== null) {
        e.preventDefault();
        setExpandedIndex(null);
      } else if (e.code === "Escape" && expandedIndex !== null) {
        setExpandedIndex(null);
      } else if (e.code === "ArrowRight" && selectedIndex !== null) {
        e.preventDefault();
        setSelectedIndex(Math.min(selectedIndex + 1, items.length - 1));
      } else if (e.code === "ArrowLeft" && selectedIndex !== null) {
        e.preventDefault();
        setSelectedIndex(Math.max(selectedIndex - 1, 0));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, expandedIndex, items]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Toolbar */}
      <div
        className="flex items-center justify-between px-2"
        style={{
          height: "28px",
          background: theme.toolbarBg,
          borderBottom: `1px solid ${theme.toolbarBorder}`,
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: "10px",
          color: theme.toolbarText,
        }}
      >
        <div className="flex items-center gap-2">
          <button
            className="flex items-center justify-center rounded-[3px] transition-colors"
            style={{
              width: "24px",
              height: "20px",
              background: viewMode === "grid" ? theme.toolbarActiveBg : "transparent",
              border: viewMode === "grid" ? `1px solid ${theme.toolbarActiveBorder}` : "1px solid transparent",
            }}
            onClick={() => setViewMode("grid")}
            title="Icon view"
          >
            <LayoutGrid size={12} strokeWidth={1.5} />
          </button>
          <button
            className="flex items-center justify-center rounded-[3px] transition-colors"
            style={{
              width: "24px",
              height: "20px",
              background: viewMode === "list" ? theme.toolbarActiveBg : "transparent",
              border: viewMode === "list" ? `1px solid ${theme.toolbarActiveBorder}` : "1px solid transparent",
            }}
            onClick={() => setViewMode("list")}
            title="List view"
          >
            <List size={12} strokeWidth={1.5} />
          </button>
        </div>
        <button
          className="flex items-center justify-center rounded-[3px] transition-colors"
          style={{
            width: "24px",
            height: "20px",
            background: "transparent",
            border: "1px solid transparent",
          }}
          onClick={shuffleItems}
          title="Shuffle"
        >
          <Shuffle size={12} strokeWidth={1.5} />
        </button>
      </div>

      {/* Content */}
      <div
        ref={containerRef}
        className="overflow-auto"
        tabIndex={0}
        style={{
          background: theme.contentBgWhite,
          flex: 1,
          minHeight: 0,
          maxHeight: isMobile ? "none" : undefined,
          padding: viewMode === "grid" ? (isMobile ? "6px" : "8px") : "0",
          outline: "none",
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) setSelectedIndex(null);
        }}
      >
        {viewMode === "grid" ? (
          <div
            className="grid"
            style={{
              gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)",
              gap: isMobile ? "8px" : undefined,
              columnGap: isMobile ? undefined : "8px",
              rowGap: isMobile ? undefined : "4px",
            }}
          >
            {items.map((item, i) => (
              <div
                key={i}
                className="flex flex-col items-center cursor-pointer"
                style={{ padding: isMobile ? "0" : "4px 4px" }}
                onClick={() => setExpandedIndex(i)}
              >
                <div
                  className={`overflow-hidden rounded-[3px] w-full ${
                    selectedIndex === i ? "ring-2 ring-blue-500" : ""
                  }`}
                  style={{
                    aspectRatio: isMobile ? "16/9" : "16/10",
                    background: theme.thumbBg,
                  }}
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    setSelectedIndex(i);
                  }}
                  onTouchStart={() => {
                    setSelectedIndex(i);
                  }}
                >
                  {isImage(item.src) ? (
                    <img
                      src={item.src}
                      alt={item.name}
                      loading="lazy"
                      className="w-full h-full object-cover"
                      style={{ pointerEvents: "none" }}
                    />
                  ) : (
                    <LazyVideoThumb
                      src={item.src}
                      onError={() => {
                        (document.querySelector(`.thumb-${i}`) as HTMLElement).style.display = "none";
                      }}
                    />
                  )}
                </div>
                <span
                  className={`mt-1 text-center w-full truncate px-0.5 rounded-sm ${
                    selectedIndex === i ? "bg-blue-600 text-white" : ""
                  }`}
                  style={{
                    fontSize: isMobile ? "10px" : "9px",
                    lineHeight: "1.3",
                    fontFamily: "'IBM Plex Sans', sans-serif",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    wordBreak: "break-all",
                    color: selectedIndex === i ? "#fff" : theme.textSecondary,
                  }}
                >
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        ) : (
          /* List view */
          <div>
            {/* List header */}
            <div
              className="flex items-center px-3 gap-3"
              style={{
                height: "20px",
                background: theme.listHeaderBg,
                borderBottom: `1px solid ${theme.listHeaderBorder}`,
                fontSize: "9px",
                fontFamily: "'IBM Plex Mono', monospace",
                color: theme.textMuted,
              }}
            >
              <span className="flex-1">Name</span>
              <span style={{ width: "60px", textAlign: "right" }}>Size</span>
              <span style={{ width: "50px", textAlign: "right" }}>Kind</span>
            </div>
            {items.map((item, i) => (
              <div
                key={i}
                className={`flex items-center px-3 gap-3 cursor-pointer transition-colors ${
                  selectedIndex === i ? "bg-blue-600 text-white" : ""
                }`}
                style={{
                  height: "24px",
                  borderBottom: `1px solid ${isLight(theme) ? "#F0F0F0" : "#2a2e34"}`,
                  fontSize: "11px",
                  fontFamily: "'IBM Plex Sans', sans-serif",
                  color: selectedIndex === i ? "#fff" : theme.textPrimary,
                  backgroundColor: selectedIndex === i ? undefined : "transparent",
                }}
                onClick={() => setExpandedIndex(i)}
                onMouseDown={(e) => {
                  e.stopPropagation();
                  setSelectedIndex(i);
                }}
                onMouseEnter={(e) => {
                  if (selectedIndex !== i) e.currentTarget.style.backgroundColor = theme.listHoverBg;
                }}
                onMouseLeave={(e) => {
                  if (selectedIndex !== i) e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                {isImage(item.src) ? (
                  <Image
                    size={12}
                    className="flex-shrink-0"
                    style={{ color: selectedIndex === i ? "#fff" : theme.textMuted }}
                  />
                ) : (
                  <Film
                    size={12}
                    className="flex-shrink-0"
                    style={{ color: selectedIndex === i ? "#fff" : theme.textMuted }}
                  />
                )}
                <span className="flex-1 truncate">{item.name}</span>
                <span
                  className="flex-shrink-0"
                  style={{
                    width: "60px",
                    textAlign: "right",
                    fontSize: "10px",
                    fontFamily: "'IBM Plex Mono', monospace",
                    opacity: 0.7,
                  }}
                >
                  {item.size}
                </span>
                <span
                  className="flex-shrink-0"
                  style={{
                    width: "50px",
                    textAlign: "right",
                    fontSize: "10px",
                    fontFamily: "'IBM Plex Mono', monospace",
                    opacity: 0.7,
                  }}
                >
                  {isImage(item.src) ? "PNG" : "MP4"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Status bar */}
      <div
        className="flex items-center justify-between px-2"
        style={{
          height: "24px",
          background: theme.statusBarBg,
          borderTop: `1px solid ${theme.statusBarBorder}`,
          fontSize: "10px",
          color: theme.textMuted,
          fontFamily: "'IBM Plex Mono', monospace",
        }}
      >
        <span>{items.length} items</span>
        {selectedIndex !== null && (
          <span>"{items[selectedIndex].name}" selected</span>
        )}
      </div>

      {/* Quick Look expanded overlay */}
      {expandedIndex !== null && (
        <div
          className="fixed inset-0 flex items-center justify-center"
          style={{ zIndex: 9999, background: "rgba(0,0,0,0.75)" }}
          onClick={() => setExpandedIndex(null)}
        >
          <div
            className="relative overflow-hidden shadow-2xl"
            style={{
              maxWidth: isMobile ? "95vw" : "80vw",
              maxHeight: isMobile ? "85vh" : "80vh",
              border: `1px solid ${theme.windowBorder}`,
              boxShadow: `${theme.windowBevelShadow}, 0 20px 60px rgba(0,0,0,0.5)`,
              borderRadius: "3px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Quick Look title bar — matching Graphite pinstripe chrome */}
            <div
              className="flex items-center justify-between px-2"
              style={{
                height: "24px",
                background: theme.windowChrome,
                borderBottom: `1px solid ${isLight(theme) ? "#999999" : "#1a1a1a"}`,
                minHeight: "24px",
              }}
            >
              {/* Close box — classic square */}
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
                onClick={() => setExpandedIndex(null)}
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
                {items[expandedIndex].name}
              </span>
              <div style={{ width: "12px" }} />
            </div>
            <div style={{ background: isLight(theme) ? "#E0E0E0" : "#1a1e24" }}>
              {isImage(items[expandedIndex].src) ? (
                <img
                  src={items[expandedIndex].src}
                  alt={items[expandedIndex].name}
                  loading="lazy"
                  className="block mx-auto"
                  style={{
                    maxWidth: isMobile ? "95vw" : "80vw",
                    maxHeight: isMobile ? "calc(85vh - 24px)" : "calc(80vh - 24px)",
                    objectFit: "contain",
                  }}
                />
              ) : (
                <video
                  src={items[expandedIndex].src}
                  muted
                  loop
                  playsInline
                  preload="auto"
                  autoPlay
                  referrerPolicy="no-referrer"
                  className="block mx-auto"
                  style={{
                    maxWidth: isMobile ? "95vw" : "80vw",
                    maxHeight: isMobile ? "calc(85vh - 24px)" : "calc(80vh - 24px)",
                    objectFit: "contain",
                  }}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
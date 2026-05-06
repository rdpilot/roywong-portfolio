import React, { useRef, useState, useCallback, useEffect } from "react";
import { useTheme } from "../hooks/useTheme";
import type { ThemeTokens } from "../hooks/useTheme";
const isLight = (t: ThemeTokens) => t.mode !== "dark" && t.mode !== "hailmary";

type ResizeDirection = "right" | "bottom" | "corner" | null;

interface DraggableWindowProps {
  id: string;
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  onFocus: () => void;
  zIndex: number;
  defaultPosition: { x: number; y: number };
  width?: number | string;
  height?: number | string;
  minWidth?: number;
  minHeight?: number;
  className?: string;
  docked?: "bottom" | null;
  maxHeight?: number;
}

export function DraggableWindow({
  id,
  title,
  children,
  isOpen,
  onClose,
  onFocus,
  zIndex,
  defaultPosition,
  width = "auto",
  height = "auto",
  minWidth = 200,
  minHeight = 100,
  className = "",
  docked = null,
  maxHeight,
}: DraggableWindowProps) {
  const { theme } = useTheme();
  const [position, setPosition] = useState(defaultPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [isDocked, setIsDocked] = useState(!!docked);

  // Resize state
  const initWidth = typeof width === "number" ? width : 400;
  const [size, setSize] = useState<{ w: number; h: number | null }>({
    w: initWidth,
    h: maxHeight ?? null, // use maxHeight as initial height if provided, otherwise auto
  });
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDir, setResizeDir] = useState<ResizeDirection>(null);

  const dragRef = useRef<{ startX: number; startY: number; posX: number; posY: number }>({
    startX: 0,
    startY: 0,
    posX: defaultPosition.x,
    posY: defaultPosition.y,
  });
  const resizeRef = useRef<{ startX: number; startY: number; startW: number; startH: number }>({
    startX: 0,
    startY: 0,
    startW: initWidth,
    startH: 0,
  });
  const windowRef = useRef<HTMLDivElement>(null);

  const SNAP_THRESHOLD = 80;
  const MAX_WIDTH = 1200;
  const MAX_HEIGHT = 900;

  /* ── Drag handlers ──────────────────────────────────────── */
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      onFocus();
      setIsDragging(true);

      if (isDocked && windowRef.current) {
        const rect = windowRef.current.getBoundingClientRect();
        const parentRect = windowRef.current.offsetParent?.getBoundingClientRect() || { left: 0, top: 0 };
        const currentX = rect.left - parentRect.left;
        const currentY = rect.top - parentRect.top;
        setPosition({ x: currentX, y: currentY });
        setIsDocked(false);
        dragRef.current = {
          startX: e.clientX,
          startY: e.clientY,
          posX: currentX,
          posY: currentY,
        };
      } else {
        dragRef.current = {
          startX: e.clientX,
          startY: e.clientY,
          posX: position.x,
          posY: position.y,
        };
      }
    },
    [position, onFocus, isDocked]
  );

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;

      let newX = dragRef.current.posX + dx;
      let newY = dragRef.current.posY + dy;

      if (windowRef.current) {
        const parent = windowRef.current.offsetParent as HTMLElement | null;
        if (parent) {
          const parentRect = parent.getBoundingClientRect();
          const winRect = windowRef.current.getBoundingClientRect();
          const winWidth = winRect.width;

          const minX = -winWidth + 80;
          const maxX = parentRect.width - 80;
          const minY = 0;
          const maxY = parentRect.height - 32;

          newX = Math.max(minX, Math.min(newX, maxX));
          newY = Math.max(minY, Math.min(newY, maxY));
        }
      }

      setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);

      if (docked && windowRef.current) {
        const parent = windowRef.current.offsetParent as HTMLElement | null;
        if (parent) {
          const parentRect = parent.getBoundingClientRect();
          const winRect = windowRef.current.getBoundingClientRect();
          const distanceFromBottom = parentRect.bottom - winRect.bottom;

          if (distanceFromBottom <= SNAP_THRESHOLD) {
            setIsDocked(true);
          }
        }
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, docked]);

  /* ── Resize handlers ────────────────────────────────────── */
  const handleResizeStart = useCallback(
    (e: React.MouseEvent, direction: ResizeDirection) => {
      e.preventDefault();
      e.stopPropagation();
      onFocus();
      setIsResizing(true);
      setResizeDir(direction);

      const rect = windowRef.current?.getBoundingClientRect();
      resizeRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        startW: rect?.width || size.w,
        startH: rect?.height || size.h || 300,
      };
    },
    [onFocus, size]
  );

  useEffect(() => {
    if (!isResizing || !resizeDir) return;

    const handleMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - resizeRef.current.startX;
      const dy = e.clientY - resizeRef.current.startY;

      setSize((prev) => {
        let newW = prev.w;
        let newH = prev.h ?? resizeRef.current.startH;

        if (resizeDir === "right" || resizeDir === "corner") {
          newW = Math.max(minWidth, Math.min(resizeRef.current.startW + dx, MAX_WIDTH));
        }
        if (resizeDir === "bottom" || resizeDir === "corner") {
          newH = Math.max(minHeight, Math.min(resizeRef.current.startH + dy, MAX_HEIGHT));
        }

        return { w: newW, h: newH };
      });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      setResizeDir(null);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, resizeDir, minWidth, minHeight]);

  if (!isOpen) return null;

  /* ── Styles ─────────────────────────────────────────────── */
  const wrapperStyle: React.CSSProperties =
    docked && isDocked
      ? {
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex,
          width: "100%",
        }
      : {
          position: "absolute",
          left: position.x,
          top: position.y,
          zIndex,
          width: `${size.w}px`,
          height: size.h !== null ? `${size.h}px` : undefined,
          minWidth,
          minHeight,
          cursor: isDragging ? "grabbing" : "default",
          display: "flex",
          flexDirection: "column" as const,
          overflow: "hidden",
        };

  const gripColor = isLight(theme) ? "#999" : "#555";
  const gripHighlight = isLight(theme) ? "#E8E8E8" : "#3a3e44";

  return (
    <div
      ref={windowRef}
      style={wrapperStyle}
      className={`${className}`}
      onMouseDown={() => onFocus()}
      data-window-id={id}
    >
      {/* Outer beveled border — flex column so content fills */}
      <div
        style={{
          border: `1px solid ${theme.windowBorder}`,
          boxShadow: theme.windowBevelShadow,
          borderRadius: "3px",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          flex: 1,
          minHeight: 0,
          position: "relative",
        }}
      >
        {/* Title Bar — classic pinstripe */}
        <div
          className="flex items-center gap-2 px-2 py-1 select-none border-0"
          style={{
            cursor: isDragging ? "grabbing" : "grab",
            background: theme.windowChrome,
            borderBottom: `1px solid ${isLight(theme) ? "#999999" : "#1a1a1a"}`,
            minHeight: "24px",
            flexShrink: 0,
            position: "relative",
          }}
          onMouseDown={handleMouseDown}
          data-drag-handle="true"
        >
          {/* Close box — classic Mac square */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
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
              boxShadow:
                isLight(theme)
                  ? "0.5px 0.5px 0 #FFFFFF inset"
                  : "0.5px 0.5px 0 rgba(255,255,255,0.1) inset",
            }}
          >
            <span
              style={{
                fontSize: "8px",
                color: theme.closeBoxIcon,
                lineHeight: 1,
                marginTop: "-1px",
              }}
            >
              ✕
            </span>
          </button>

          {/* Pinstripe left */}
          <div
            className="flex-1 h-3"
            style={{
              background: `repeating-linear-gradient(
                to bottom,
                ${theme.pinstripeA} 0px,
                ${theme.pinstripeA} 1px,
                ${theme.pinstripeB} 1px,
                ${theme.pinstripeB} 2px
              )`,
            }}
          />

          {/* Title */}
          <span
            className="flex-shrink-0 px-2"
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: "12px",
              color: theme.windowTitleText,
            }}
          >
            {title}
          </span>

          {/* Pinstripe right */}
          <div
            className="flex-1 h-3"
            style={{
              background: `repeating-linear-gradient(
                to bottom,
                ${theme.pinstripeA} 0px,
                ${theme.pinstripeA} 1px,
                ${theme.pinstripeB} 1px,
                ${theme.pinstripeB} 2px
              )`,
            }}
          />
        </div>

        {/* Content */}
        <div
          style={{
            background: theme.windowContentBg,
            flex: 1,
            overflow: "hidden",
            minHeight: 0,
          }}
        >
          {children}
        </div>

        {/* ── Resize grip (bottom-right corner) ─────────── */}
        {!(docked && isDocked) && (
          <div
            onMouseDown={(e) => handleResizeStart(e, "corner")}
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              width: "16px",
              height: "16px",
              cursor: "nwse-resize",
              zIndex: 2,
            }}
          >
            {/* Classic Mac OS ridged grip lines */}
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              style={{ position: "absolute", bottom: 0, right: 0 }}
            >
              {/* Three diagonal ridged lines */}
              <line x1="14" y1="4" x2="4" y2="14" stroke={gripHighlight} strokeWidth="1" />
              <line x1="14" y1="5" x2="5" y2="14" stroke={gripColor} strokeWidth="1" />
              <line x1="14" y1="8" x2="8" y2="14" stroke={gripHighlight} strokeWidth="1" />
              <line x1="14" y1="9" x2="9" y2="14" stroke={gripColor} strokeWidth="1" />
              <line x1="14" y1="12" x2="12" y2="14" stroke={gripHighlight} strokeWidth="1" />
              <line x1="14" y1="13" x2="13" y2="14" stroke={gripColor} strokeWidth="1" />
            </svg>
          </div>
        )}
      </div>

      {/* ── Edge resize handles (invisible hit areas) ────── */}
      {!(docked && isDocked) && (
        <>
          {/* Right edge */}
          <div
            onMouseDown={(e) => handleResizeStart(e, "right")}
            style={{
              position: "absolute",
              top: 0,
              right: -2,
              width: "4px",
              height: "100%",
              cursor: "ew-resize",
            }}
          />
          {/* Bottom edge */}
          <div
            onMouseDown={(e) => handleResizeStart(e, "bottom")}
            style={{
              position: "absolute",
              bottom: -2,
              left: 0,
              width: "100%",
              height: "4px",
              cursor: "ns-resize",
            }}
          />
        </>
      )}
    </div>
  );
}
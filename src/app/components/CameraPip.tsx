import React from "react";
import { Settings } from "lucide-react";
import { useTheme } from "../hooks/useTheme";

interface CameraPipProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  isLoading: boolean;
  error: string | null;
  hasHand: boolean;
  onOpenConfig: () => void;
  onRetry: () => void;
}

export function CameraPip({
  videoRef,
  isLoading,
  error,
  hasHand,
  onOpenConfig,
  onRetry,
}: CameraPipProps) {
  const isPermissionDenied = error === "PERMISSION_DENIED";
  const { theme } = useTheme();

  return (
    <>
      {/* Hidden video — stays in DOM so MediaPipe can read frames */}
      <video
        ref={videoRef}
        style={{ display: "none" }}
        playsInline
        muted
        autoPlay
      />

      {/* Status chip — bottom right */}
      <div
        style={{
          position: "fixed",
          bottom: 20,
          right: 20,
          zIndex: 9998,
          borderRadius: 8,
          border: `1px solid ${theme.windowBorder}`,
          background: "rgba(0,0,0,0.72)",
          backdropFilter: "blur(8px)",
          boxShadow: "0 4px 16px rgba(0,0,0,0.5)",
          fontFamily: "'IBM Plex Mono', monospace",
          minWidth: 120,
        }}
      >
        {/* Loading state */}
        {isLoading && (
          <div
            style={{
              padding: "8px 10px",
              display: "flex",
              alignItems: "center",
              gap: 7,
            }}
          >
            <div
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "#888",
                animation: "gesturePulse 1.2s ease-in-out infinite",
              }}
            />
            <span style={{ fontSize: 9, color: "#888" }}>Initializing…</span>
            <style>{`@keyframes gesturePulse { 0%,100%{opacity:1} 50%{opacity:0.3} }`}</style>
          </div>
        )}

        {/* Error state */}
        {error && !isLoading && (
          <div
            style={{
              padding: "8px 10px",
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            {isPermissionDenied ? (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 12 }}>🚫</span>
                  <span style={{ fontSize: 9, color: "#ff6644", lineHeight: 1.4 }}>
                    Camera blocked.<br />Click 🔒 → Allow
                  </span>
                </div>
                <button
                  onClick={onRetry}
                  style={{
                    padding: "3px 8px",
                    fontSize: 8,
                    fontFamily: "'IBM Plex Mono', monospace",
                    background: "rgba(255,102,68,0.15)",
                    border: "1px solid #ff6644",
                    borderRadius: 3,
                    color: "#ff8866",
                    cursor: "pointer",
                  }}
                >
                  Retry
                </button>
              </>
            ) : (
              <>
                <span style={{ fontSize: 9, color: "#ff6644", lineHeight: 1.4 }}>{error}</span>
                <button
                  onClick={onRetry}
                  style={{
                    padding: "3px 8px",
                    fontSize: 8,
                    fontFamily: "'IBM Plex Mono', monospace",
                    background: "rgba(255,102,68,0.15)",
                    border: "1px solid #ff6644",
                    borderRadius: 3,
                    color: "#ff8866",
                    cursor: "pointer",
                  }}
                >
                  Retry
                </button>
              </>
            )}
          </div>
        )}

        {/* Active state */}
        {!isLoading && !error && (
          <div
            style={{
              padding: "6px 8px",
              display: "flex",
              alignItems: "center",
              gap: 7,
            }}
          >
            {/* Live dot */}
            <div
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: hasHand ? "#34D399" : "rgba(52,211,153,0.3)",
                boxShadow: hasHand ? "0 0 6px rgba(52,211,153,0.8)" : "none",
                transition: "background 0.2s, box-shadow 0.2s",
                flexShrink: 0,
              }}
            />
            <span style={{ fontSize: 9, color: "rgba(255,255,255,0.55)", flex: 1 }}>
              {hasHand ? "HAND DETECTED" : "GESTURE"}
            </span>
            <button
              onClick={onOpenConfig}
              style={{
                width: 20,
                height: 20,
                borderRadius: 4,
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                flexShrink: 0,
              }}
              aria-label="Open gesture settings"
            >
              <Settings size={10} color="rgba(255,255,255,0.7)" strokeWidth={2} />
            </button>
          </div>
        )}

        {/* Settings button when loading/error */}
        {(isLoading || error) && (
          <div
            style={{
              borderTop: `1px solid rgba(255,255,255,0.08)`,
              padding: "4px 8px",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <button
              onClick={onOpenConfig}
              style={{
                width: 20,
                height: 20,
                borderRadius: 4,
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
              aria-label="Open gesture settings"
            >
              <Settings size={10} color="rgba(255,255,255,0.7)" strokeWidth={2} />
            </button>
          </div>
        )}
      </div>
    </>
  );
}

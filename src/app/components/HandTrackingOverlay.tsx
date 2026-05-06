import React from "react";

interface HandTrackingOverlayProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}

/**
 * Full-screen transparent canvas that renders the hand skeleton.
 * The video feed is hidden — only the tracking overlay is visible.
 */
export function HandTrackingOverlay({ canvasRef }: HandTrackingOverlayProps) {
  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 9997,
      }}
    />
  );
}

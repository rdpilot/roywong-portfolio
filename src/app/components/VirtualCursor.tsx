import React from "react";

interface VirtualCursorProps {
  x: number;
  y: number;
  dwellProgress: number;   // 0–1
  isPalmDragging: boolean;
}

const RING_R   = 18;                            // progress ring radius
const RING_C   = 2 * Math.PI * RING_R;         // circumference ≈ 113.1

export function VirtualCursor({ x, y, dwellProgress, isPalmDragging }: VirtualCursorProps) {
  if (x < 0 && y < 0) return null;

  const isDwelling  = dwellProgress > 0.02;
  const color = isPalmDragging
    ? { ring: "rgba(120,160,255,0.8)", dot: "rgba(140,180,255,0.95)", glow: "rgba(100,140,255,0.5)" }
    : isDwelling
    ? { ring: "rgba(255,180,50,0.8)",  dot: "rgba(255,200,60,0.95)",  glow: "rgba(255,160,40,0.5)"  }
    : { ring: "rgba(0,220,150,0.6)",   dot: "rgba(0,240,160,0.95)",   glow: "rgba(0,220,150,0.4)"   };

  const outerSize = isPalmDragging ? 40 : 28;
  const dotSize   = isPalmDragging ? 12 : 8;

  return (
    <div
      style={{
        position: "fixed",
        left: x,
        top: y,
        transform: "translate(-50%, -50%)",
        pointerEvents: "none",
        zIndex: 99999,
      }}
    >
      {/* Dwell progress ring — SVG arc that fills clockwise */}
      {isDwelling && (
        <svg
          width={50}
          height={50}
          style={{
            position: "absolute",
            transform: "translate(-50%, -50%) rotate(-90deg)",
            overflow: "visible",
          }}
        >
          {/* Track */}
          <circle
            cx={25} cy={25} r={RING_R}
            fill="none"
            stroke="rgba(255,180,50,0.2)"
            strokeWidth={2.5}
          />
          {/* Fill arc */}
          <circle
            cx={25} cy={25} r={RING_R}
            fill="none"
            stroke="rgba(255,190,55,0.9)"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeDasharray={`${dwellProgress * RING_C} ${RING_C}`}
            style={{ transition: "stroke-dasharray 0.05s linear" }}
          />
        </svg>
      )}

      {/* Outer ring */}
      <div
        style={{
          position: "absolute",
          width: outerSize,
          height: outerSize,
          borderRadius: "50%",
          border: `2px solid ${color.ring}`,
          transform: "translate(-50%, -50%)",
          transition: "width 0.08s, height 0.08s, border-color 0.15s",
          boxShadow: `0 0 ${isPalmDragging ? 16 : 8}px ${color.glow}`,
        }}
      />
      {/* Inner dot */}
      <div
        style={{
          position: "absolute",
          width: dotSize,
          height: dotSize,
          borderRadius: "50%",
          background: color.dot,
          transform: "translate(-50%, -50%)",
          transition: "width 0.08s, height 0.08s, background 0.15s",
          boxShadow: `0 0 6px ${color.glow}`,
        }}
      />
    </div>
  );
}

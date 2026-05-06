import React, { useRef, useEffect, useCallback } from "react";
import { useTheme } from "../hooks/useTheme";

const DOT_SPACING = 20;
const BASE_RADIUS = 0.8;
const MAX_RADIUS = 1.4;
const INFLUENCE_RADIUS = 100;
const IDLE_TIMEOUT = 150; // ms after last mouse move to stop animation loop

export function InteractiveDotGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const animRef = useRef<number>(0);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isAnimatingRef = useRef(false);
  const { theme } = useTheme();
  const themeRef = useRef(theme);
  themeRef.current = theme;
  const sizeRef = useRef({ w: 0, h: 0 });

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { w, h } = sizeRef.current;
    ctx.clearRect(0, 0, w, h);

    const mx = mouseRef.current.x;
    const my = mouseRef.current.y;
    const t = themeRef.current;

    const cols = Math.ceil(w / DOT_SPACING) + 1;
    const rows = Math.ceil(h / DOT_SPACING) + 1;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = col * DOT_SPACING;
        const y = row * DOT_SPACING;

        const dx = x - mx;
        const dy = y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);

        let radius = BASE_RADIUS;
        let alpha = t.dotBaseAlpha;

        if (dist < INFLUENCE_RADIUS) {
          const f = 1 - dist / INFLUENCE_RADIUS;
          const ease = f * f * (3 - 2 * f);
          radius = BASE_RADIUS + (MAX_RADIUS - BASE_RADIUS) * ease;
          alpha = t.dotBaseAlpha + (t.dotMaxAlpha - t.dotBaseAlpha) * ease;
        }

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${t.dotColor[0]},${t.dotColor[1]},${t.dotColor[2]},${alpha})`;
        ctx.fill();
      }
    }
  }, []);

  const startAnimLoop = useCallback(() => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;
    const loop = () => {
      render();
      if (isAnimatingRef.current) {
        animRef.current = requestAnimationFrame(loop);
      }
    };
    animRef.current = requestAnimationFrame(loop);
  }, [render]);

  const stopAnimLoop = useCallback(() => {
    isAnimatingRef.current = false;
    cancelAnimationFrame(animRef.current);
    // Paint one final idle frame
    render();
  }, [render]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    // Start animation loop if not running
    startAnimLoop();

    // Reset idle timer
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => {
      stopAnimLoop();
    }, IDLE_TIMEOUT);
  }, [startAnimLoop, stopAnimLoop]);

  const handleMouseLeave = useCallback(() => {
    mouseRef.current = { x: -9999, y: -9999 };
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    // One more frame to clear hover effects, then stop
    requestAnimationFrame(() => {
      render();
      stopAnimLoop();
    });
  }, [render, stopAnimLoop]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      sizeRef.current = { w, h };
      // Paint static dots on resize
      render();
    };
    resize();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      cancelAnimationFrame(animRef.current);
      isAnimatingRef.current = false;
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      resizeObserver.disconnect();
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseLeave, render]);

  // Re-paint when theme changes
  useEffect(() => {
    render();
  }, [theme, render]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        display: "block",
      }}
    />
  );
}

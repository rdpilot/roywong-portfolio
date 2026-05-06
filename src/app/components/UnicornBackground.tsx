import { useEffect, useRef } from "react";
import UnicornScene from "unicornstudio-react";

function removeBadge() {
  document.querySelectorAll('a[href*="unicorn.studio"]').forEach(el => el.remove());
}

// ─── Seeded LCG ───────────────────────────────────────────────────────────────
function lcg(seed: number) {
  let s = seed;
  return () => {
    s = (Math.imul(1664525, s) + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
}

interface Blob {
  x: number; y: number;
  r: number;
  alpha: number;
  vy: number; vx: number;
  wobble: number; wobbleFreq: number; wobblePhase: number;
  pulseFreq: number; pulsePhase: number;
}

const RNG = lcg(0xF00DCAFE);

const EXTRA_BLOBS: Blob[] = (() => {
  const out: Blob[] = [];
  for (let i = 0; i < 55; i++) {
    // Wide variety of sizes: tiny specks up to large orbs
    const size = RNG();
    const r = size < 0.3
      ? 4  + RNG() * 10   // tiny
      : size < 0.65
      ? 14 + RNG() * 28   // medium
      : 40 + RNG() * 70;  // large

    out.push({
      x: RNG(), y: RNG(),
      r,
      alpha: 0.10 + RNG() * 0.22,
      vy: -(0.004 + RNG() * 0.014),
      vx: (RNG() - 0.5) * 0.006,
      wobble: 0.010 + RNG() * 0.030,
      wobbleFreq: 0.12 + RNG() * 0.28,
      wobblePhase: RNG() * Math.PI * 2,
      pulseFreq: 0.20 + RNG() * 0.80,
      pulsePhase: RNG() * Math.PI * 2,
    });
  }
  return out;
})();

// ─── Extra-blob canvas ────────────────────────────────────────────────────────
function BlobLayer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);
  const t0Ref     = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio ?? 1, 2);
      canvas.width  = Math.round(window.innerWidth  * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = (ts: number) => {
      if (!t0Ref.current) t0Ref.current = ts;
      const t = (ts - t0Ref.current) / 1000;

      const dpr = Math.min(window.devicePixelRatio ?? 1, 2);
      const W = canvas.width  / dpr;
      const H = canvas.height / dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = "lighter";

      for (const b of EXTRA_BLOBS) {
        const rawX = b.x + b.vx * t + b.wobble * Math.sin(b.wobbleFreq * t + b.wobblePhase);
        const rawY = b.y + b.vy * t;
        const px = ((rawX % 1) + 1) % 1;
        const py = ((rawY % 1) + 1) % 1;

        const x = px * W;
        const y = py * H;
        const pulse = 0.72 + 0.28 * Math.sin(b.pulseFreq * t + b.pulsePhase);
        const alpha = b.alpha * pulse;

        const grad = ctx.createRadialGradient(x, y, 0, x, y, b.r);
        grad.addColorStop(0.00, `rgba(210,65,40,${alpha})`);
        grad.addColorStop(0.25, `rgba(190,50,30,${(alpha * 0.75).toFixed(3)})`);
        grad.addColorStop(0.60, `rgba(160,35,20,${(alpha * 0.22).toFixed(3)})`);
        grad.addColorStop(0.85, `rgba(120,20,10,${(alpha * 0.05).toFixed(3)})`);
        grad.addColorStop(1.00, `rgba(80,10,5,0)`);

        ctx.beginPath();
        ctx.arc(x, y, b.r, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 1,
      }}
    />
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────
export function UnicornBackground() {
  useEffect(() => {
    removeBadge();
    const observer = new MutationObserver(removeBadge);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",
        animation: "unicornFadeIn 1.2s ease-out both",
      }}
    >
      <style>{`@keyframes unicornFadeIn { from { opacity: 0 } to { opacity: 1 } }`}</style>
      <UnicornScene
        projectId="ILkwhVN54JNfznyiX0Be"
        sdkUrl="https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v2.1.6/dist/unicornStudio.umd.js"
        width="100%"
        height="100%"
        production={true}
      />

      {/* Extra blobs layered above the Unicorn scene */}
      <BlobLayer />

      {/* Bottom vignette: covers the SDK watermark rendered onto the canvas */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 140,
          background: "linear-gradient(to bottom, transparent 0%, #080202 35%)",
          zIndex: 2,
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

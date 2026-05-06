import { useEffect, useRef } from "react";

// ─── Seeded LCG for deterministic particle layout ─────────────────────────────
function lcg(seed: number) {
  let s = seed;
  return () => {
    s = (Math.imul(1664525, s) + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
}

interface Particle {
  x: number;
  y: number;
  baseR: number;
  alpha: number;
  vy: number;
  vx: number;
  wobble: number;
  wobbleFreq: number;
  wobblePhase: number;
  pulseFreq: number;
  pulsePhase: number;
  r: number;
  g: number;
  b: number;
  type: "large" | "medium" | "tiny";
}

const RNG = lcg(0xDEADBEEF);

function makeParticles(): Particle[] {
  const out: Particle[] = [];

  // ── Large soft bokeh ──────────────────────────────────────────────────────
  for (let i = 0; i < 22; i++) {
    const warm = RNG();
    out.push({
      x: RNG(), y: RNG(),
      baseR: 55 + RNG() * 70,
      alpha: 0.06 + RNG() * 0.13,
      vy: -(0.006 + RNG() * 0.010),
      vx: (RNG() - 0.5) * 0.004,
      wobble: 0.015 + RNG() * 0.025,
      wobbleFreq: 0.18 + RNG() * 0.22,
      wobblePhase: RNG() * Math.PI * 2,
      pulseFreq: 0.20 + RNG() * 0.30,
      pulsePhase: RNG() * Math.PI * 2,
      r: 220 + Math.round(warm * 35),
      g: 30  + Math.round(warm * 60),
      b: 40  + Math.round(warm * 50),
      type: "large",
    });
  }

  // ── Medium bokeh ──────────────────────────────────────────────────────────
  for (let i = 0; i < 55; i++) {
    const warm = RNG();
    out.push({
      x: RNG(), y: RNG(),
      baseR: 7 + RNG() * 22,
      alpha: 0.15 + RNG() * 0.28,
      vy: -(0.012 + RNG() * 0.018),
      vx: (RNG() - 0.5) * 0.007,
      wobble: 0.010 + RNG() * 0.020,
      wobbleFreq: 0.35 + RNG() * 0.55,
      wobblePhase: RNG() * Math.PI * 2,
      pulseFreq: 0.60 + RNG() * 1.20,
      pulsePhase: RNG() * Math.PI * 2,
      r: 240 + Math.round(warm * 15),
      g: 80  + Math.round(warm * 100),
      b: 70  + Math.round(warm * 90),
      type: "medium",
    });
  }

  // ── Tiny sparkle stars ────────────────────────────────────────────────────
  for (let i = 0; i < 260; i++) {
    const bright = 0.6 + RNG() * 0.4;
    out.push({
      x: RNG(), y: RNG(),
      baseR: 0.8 + RNG() * 2.2,
      alpha: 0.25 + RNG() * 0.75,
      vy: -(0.018 + RNG() * 0.025),
      vx: (RNG() - 0.5) * 0.008,
      wobble: 0.005 + RNG() * 0.012,
      wobbleFreq: 0.8 + RNG() * 1.6,
      wobblePhase: RNG() * Math.PI * 2,
      pulseFreq: 1.2 + RNG() * 4.0,
      pulsePhase: RNG() * Math.PI * 2,
      r: Math.round(255 * bright),
      g: Math.round((160 + RNG() * 95) * bright),
      b: Math.round((140 + RNG() * 115) * bright),
      type: "tiny",
    });
  }

  return out;
}

const PARTICLES = makeParticles();

// ─── Component ────────────────────────────────────────────────────────────────
export function HailMaryBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);
  const t0Ref     = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
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

      // ── Deep crimson radial background ────────────────────────────────────
      const cx = W * 0.50;
      const cy = H * 0.55;
      const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.hypot(W, H) * 0.65);
      bg.addColorStop(0.00, "#42000e");
      bg.addColorStop(0.30, "#2e0009");
      bg.addColorStop(0.60, "#1c0005");
      bg.addColorStop(1.00, "#080202");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // ── Particles (additive blend for natural glow) ───────────────────────
      ctx.globalCompositeOperation = "lighter";

      for (const p of PARTICLES) {
        const rawX = p.x + p.vx * t + p.wobble * Math.sin(p.wobbleFreq * t + p.wobblePhase);
        const rawY = p.y + p.vy * t;
        const px = ((rawX % 1) + 1) % 1;
        const py = ((rawY % 1) + 1) % 1;

        const x = px * W;
        const y = py * H;

        const pulse  = 0.70 + 0.30 * Math.sin(p.pulseFreq * t + p.pulsePhase);
        const alpha  = p.alpha * pulse;
        const radius = p.baseR;
        const { r, g, b } = p;

        if (p.type === "large") {
          const grad = ctx.createRadialGradient(x, y, 0, x, y, radius);
          grad.addColorStop(0.00, `rgba(${r},${g},${b},${alpha})`);
          grad.addColorStop(0.20, `rgba(${r},${g},${b},${(alpha * 0.80).toFixed(3)})`);
          grad.addColorStop(0.55, `rgba(${r},${g},${b},${(alpha * 0.22).toFixed(3)})`);
          grad.addColorStop(0.80, `rgba(${r},${g},${b},${(alpha * 0.05).toFixed(3)})`);
          grad.addColorStop(1.00, `rgba(${r},${g},${b},0)`);
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.fill();

        } else if (p.type === "medium") {
          const grad = ctx.createRadialGradient(x, y, 0, x, y, radius);
          grad.addColorStop(0.00, `rgba(${r},${g},${b},${alpha})`);
          grad.addColorStop(0.30, `rgba(${r},${g},${b},${(alpha * 0.70).toFixed(3)})`);
          grad.addColorStop(0.65, `rgba(${r},${g},${b},${(alpha * 0.18).toFixed(3)})`);
          grad.addColorStop(1.00, `rgba(${r},${g},${b},0)`);
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.fill();

        } else {
          const grad = ctx.createRadialGradient(x, y, 0, x, y, radius * 2.5);
          grad.addColorStop(0.00, `rgba(${r},${g},${b},${alpha})`);
          grad.addColorStop(0.40, `rgba(${r},${g},${b},${(alpha * 0.40).toFixed(3)})`);
          grad.addColorStop(1.00, `rgba(${r},${g},${b},0)`);
          ctx.beginPath();
          ctx.arc(x, y, radius * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.fill();
        }
      }

      // ── Bottom vignette ───────────────────────────────────────────────────
      ctx.globalCompositeOperation = "source-over";
      const vig = ctx.createLinearGradient(0, H * 0.72, 0, H);
      vig.addColorStop(0, "rgba(8,2,2,0)");
      vig.addColorStop(1, "#080202");
      ctx.fillStyle = vig;
      ctx.fillRect(0, H * 0.72, W, H * 0.28);

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
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}

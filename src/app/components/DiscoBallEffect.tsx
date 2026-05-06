import { useEffect, useRef } from "react";

// ─── Seeded LCG for deterministic mirror parameters ───────────────────────────
function lcg(seed: number) {
  let s = seed;
  return () => {
    s = (Math.imul(1664525, s) + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
}

// ─── Coloured spotlights ──────────────────────────────────────────────────────
// Each light is defined as the direction FROM the ball TO the light source,
// in screen-space coords: x=right, y=down, z=into-screen.
// Three saturated RGB lights at different positions, like real stage rigs.
const RAW_LIGHTS = [
  { lx:  0.00, ly: -1.00, lz:  0.35, r: 255, g:  22, b:  22 }, // red    — front-above
  { lx: -0.55, ly: -0.82, lz:  0.15, r:  22, g: 255, b:  22 }, // green  — left-above
  { lx:  0.55, ly: -0.82, lz:  0.15, r:  22, g:  22, b: 255 }, // blue   — right-above
];
const LIGHTS = RAW_LIGHTS.map(d => {
  const len = Math.hypot(d.lx, d.ly, d.lz);
  return { lx: d.lx/len, ly: d.ly/len, lz: d.lz/len, r: d.r, g: d.g, b: d.b };
});

// ─── Mirror tile rings ────────────────────────────────────────────────────────
// φ = elevation above equator (rad). More rings, more tiles → dense spot field.
const RING_DEFS = [
  { phi: 0.18, count: 12 },
  { phi: 0.27, count: 16 },
  { phi: 0.36, count: 18 },
  { phi: 0.45, count: 18 },
  { phi: 0.54, count: 16 },
  { phi: 0.63, count: 14 },
  { phi: 0.71, count: 10 },
  { phi: 0.79, count:  8 },
  { phi: 0.86, count:  6 },
]; // 118 tiles total

interface Mirror {
  phi:     number; // elevation (rad)
  lambda0: number; // initial azimuth (rad)
  baseRx:  number; // nominal semi-major axis (px)
  baseRy:  number; // semi-minor axis (px)
  alpha:   number; // peak opacity
  twinkle: number; // individual flicker frequency
  twinklePhase: number;
}

const MIRRORS: Mirror[] = (() => {
  const rng = lcg(31337);
  const out: Mirror[] = [];
  for (const ring of RING_DEFS) {
    for (let i = 0; i < ring.count; i++) {
      const lambda0 = (i / ring.count) * Math.PI * 2 + (rng() - 0.5) * 0.12;
      out.push({
        phi:          ring.phi + (rng() - 0.5) * 0.04,
        lambda0,
        baseRx:       9  + rng() * 9,   //  9–18 px
        baseRy:       7  + rng() * 6,   //  7–13 px (closer to circular)
        alpha:        0.70 + rng() * 0.28,
        twinkle:      1.8 + rng() * 2.4,
        twinklePhase: rng() * Math.PI * 2,
      });
    }
  }
  return out;
})();

const BALL_OMEGA = 0.42; // rad/s ≈ one rotation every ~15 s

// ─── Component ────────────────────────────────────────────────────────────────
export function DiscoBallEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);
  const t0Ref     = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const MENU_H = 40;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio ?? 1, 2);
      canvas.width  = Math.round(window.innerWidth  * dpr);
      canvas.height = Math.round((window.innerHeight - MENU_H) * dpr);
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

      // Room depth — controls how far spots fan out horizontally
      const Dz = W * 0.50;
      // Ball position: just above the visible canvas (negative y = above top)
      const ballY = -H * 0.08;

      const D_LAM = 0.018; // finite-difference step for velocity/orientation

      for (const light of LIGHTS) {
        const { lx, ly, lz, r, g, b } = light;

        for (const m of MIRRORS) {
          const lambda = m.lambda0 + BALL_OMEGA * t;

          // ── Mirror normal (screen coords: x=right, y=down, z=into-screen) ──
          const cosLam = Math.cos(lambda);
          const sinLam = Math.sin(lambda);
          const cosPhi = Math.cos(m.phi);
          const sinPhi = Math.sin(m.phi);

          const Nx = cosPhi * sinLam;
          const Ny = -sinPhi;          // negative: top-hemisphere normals point up
          const Nz = cosPhi * cosLam;

          // ── Reflection ────────────────────────────────────────────────────
          const dot = Nx*lx + Ny*ly + Nz*lz;
          if (dot < 0.03) continue;   // light hits back of mirror → skip

          const Rx = 2*dot*Nx - lx;
          const Ry = 2*dot*Ny - ly;
          const Rz = 2*dot*Nz - lz;
          if (Rz < 0.04) continue;    // reflected away from back wall → skip

          // ── Wall-projection ───────────────────────────────────────────────
          const x = W/2 + Dz * Rx/Rz;
          const y = ballY + Dz * Ry/Rz;
          if (x < -280 || x > W+280 || y < -180 || y > H+180) continue;

          // ── Spot orientation via finite difference ────────────────────────
          // Advance λ by D_LAM to find where the spot will be next tick →
          // the ellipse major axis aligns with this velocity vector.
          const lam2    = lambda + D_LAM;
          const cosLam2 = Math.cos(lam2);
          const sinLam2 = Math.sin(lam2);
          const Nx2 = cosPhi * sinLam2;
          const Nz2 = cosPhi * cosLam2;
          const dot2 = Nx2*lx + Ny*ly + Nz2*lz;

          let angle  = 0;
          let stretch = 1;
          if (dot2 > 0.02) {
            const Rx2 = 2*dot2*Nx2 - lx;
            const Ry2 = 2*dot2*Ny  - ly;
            const Rz2 = 2*dot2*Nz2 - lz;
            if (Rz2 > 0.03) {
              const x2 = W/2 + Dz * Rx2/Rz2;
              const y2 = ballY + Dz * Ry2/Rz2;
              const dx = x2 - x;
              const dy = y2 - y;
              angle   = Math.atan2(dy, dx);
              // Stretch proportional to speed: faster = more elongated
              stretch = Math.min(1 + Math.hypot(dx, dy) / (D_LAM * 900), 3);
            }
          }

          const rx = m.baseRx * stretch;
          const ry = m.baseRy;

          // ── Per-mirror twinkle (subtle opacity flicker) ───────────────────
          const twinkle = 0.82 + 0.18 * Math.sin(t * m.twinkle + m.twinklePhase);

          // ── Alpha: fade in/out as mirror rotates toward/away from light ───
          const fade  = Math.min(1, (dot - 0.03) / 0.16);
          const alpha = m.alpha * fade * twinkle;

          // ── Draw ──────────────────────────────────────────────────────────
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(angle);

          // Tight radial gradient: bright crisp core, short soft halo
          const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
          grad.addColorStop(0,    `rgba(${r},${g},${b},${alpha})`);
          grad.addColorStop(0.25, `rgba(${r},${g},${b},${alpha * 0.85})`);
          grad.addColorStop(0.55, `rgba(${r},${g},${b},${alpha * 0.22})`);
          grad.addColorStop(0.78, `rgba(${r},${g},${b},${alpha * 0.04})`);
          grad.addColorStop(1,    `rgba(${r},${g},${b},0)`);

          ctx.scale(rx, ry);
          ctx.beginPath();
          ctx.arc(0, 0, 1, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.fill();
          ctx.restore();
        }
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
      aria-hidden="true"
      style={{
        position: "fixed",
        top: "40px",
        left: 0,
        right: 0,
        bottom: 0,
        width: "100%",
        height: "calc(100% - 40px)",
        pointerEvents: "none",
        zIndex: 4,
      }}
    />
  );
}

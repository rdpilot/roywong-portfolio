import { useEffect, useRef } from "react";

function lcg(seed: number) {
  let s = seed;
  return () => {
    s = (Math.imul(1664525, s) + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
}

interface Patch {
  baseX: number;
  baseY: number;
  rx: number;
  ry: number;
  rot: number;
  alpha: number;
  windScale: number;
  // propagation delay: gust arrives at right side first, sweeps left
  waveDelay: number;
  // per-patch branch oscillation
  branchFreq: number;
  branchAmp:  number;
  branchPhase: number;
  shimmerFreq: number;
  shimmerPhase: number;
}

function buildPatches(W: number, H: number): Patch[] {
  const rng = lcg(0x50BEEE11);
  const out: Patch[] = [];

  const tiers = [
    { count: 18, rxMin: 0.060, rxMax: 0.120, alphaMin: 0.35, alphaMax: 0.52 },
    { count: 48, rxMin: 0.024, rxMax: 0.060, alphaMin: 0.62, alphaMax: 0.82 },
    { count: 42, rxMin: 0.009, rxMax: 0.028, alphaMin: 0.78, alphaMax: 0.95 },
  ];

  for (const tier of tiers) {
    for (let i = 0; i < tier.count; i++) {
      const rawX = Math.pow(rng(), 0.50);
      const bx   = 0.02 + rawX * 1.05;
      const by   = -0.04 + rng() * 1.08;
      const rx   = W * (tier.rxMin + rng() * (tier.rxMax - tier.rxMin));
      const ry   = rx * (0.30 + rng() * 0.30);
      const dist = 1 - Math.min(rawX, 1); // 0 = near source, 1 = far left

      out.push({
        baseX: bx * W,
        baseY: by * H,
        rx, ry,
        rot:       0.20 + (rng() - 0.5) * 0.60,
        alpha:     tier.alphaMin + rng() * (tier.alphaMax - tier.alphaMin),
        windScale: 0.4 + dist * 1.2,   // far patches blow much more
        // Wave sweeps right→left at ~300 px/s; far patches respond later
        waveDelay: (bx * W) / 300 * (0.7 + rng() * 0.6),
        // Each branch has its own resonant oscillation freq
        branchFreq:  0.28 + rng() * 0.32,  // 0.28–0.60 Hz, 1.7–3.5 s period
        branchAmp:   (4 + dist * 14) * (0.6 + rng() * 0.8),
        branchPhase: rng() * Math.PI * 2,
        shimmerFreq:  0.30 + rng() * 0.50,
        shimmerPhase: rng() * Math.PI * 2,
      });
    }
  }

  return out;
}

// Smooth wind signal: sum of sines — no state, no jumps
// Dominant period ~5 s, secondary ~2.5 s, accent ~1.4 s
// Net direction: leftward (negative X) from right-side tree
function sampleWind(tw: number) {
  const wx = -32 * Math.sin(tw * 0.38 + 0.60)
           + -16 * Math.sin(tw * 0.71 + 2.20)
           +  -7 * Math.sin(tw * 1.37 + 1.00)
           +  10 * Math.sin(tw * 0.19 + 0.35);  // slow ease-back rightward
  const wy =   6 * Math.sin(tw * 0.43 + 0.80)
           +   3 * Math.sin(tw * 0.85 + 1.60);
  return { wx, wy };
}

export function SunnyBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);
  const t0Ref     = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const W   = window.innerWidth;
    const H   = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio ?? 1, 2);

    canvas.width  = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const patches = buildPatches(W, H);

    const draw = (ts: number) => {
      if (!t0Ref.current) t0Ref.current = ts;
      const t = (ts - t0Ref.current) / 1000;

      // Smoothstep ramp over first 2.5 s — patches start still, gradually come alive
      const rampRaw = Math.min(t / 2.5, 1.0);
      const ramp = rampRaw * rampRaw * (3 - 2 * rampRaw);

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = "screen";

      for (const c of patches) {
        // Each patch samples wind at a delayed time — gust sweeps left as a wave
        const tw = Math.max(0, t - c.waveDelay);
        const { wx, wy } = sampleWind(tw);

        // Branch oscillation — horizontal only, amplitude driven by wind strength
        const windStrength = Math.abs(wx) / 52; // 0–1
        const branchX = c.branchAmp * (0.4 + windStrength * 0.6)
                      * Math.sin(t * c.branchFreq + c.branchPhase);
        const branchY = c.branchAmp * (0.4 + windStrength * 0.6)
                      * Math.cos(t * c.branchFreq * 0.78 + c.branchPhase + 1.1);

        const x = c.baseX + (wx * c.windScale + branchX) * ramp;
        const y = c.baseY + (wy * c.windScale * 0.10 + branchY * 0.15) * ramp;

        const shimmer = 0.90 + 0.10 * Math.sin(t * c.shimmerFreq * 1.4 + c.shimmerPhase);
        const alpha   = c.alpha * shimmer;

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(c.rot);
        ctx.scale(1, c.ry / c.rx);

        const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, c.rx);
        grad.addColorStop(0.00, `rgba(255,255,255,${alpha.toFixed(3)})`);
        grad.addColorStop(0.45, `rgba(255,255,253,${(alpha * 0.88).toFixed(3)})`);
        grad.addColorStop(0.72, `rgba(252,254,255,${(alpha * 0.55).toFixed(3)})`);
        grad.addColorStop(0.90, `rgba(248,252,255,${(alpha * 0.20).toFixed(3)})`);
        grad.addColorStop(1.00, `rgba(245,250,255,0)`);

        ctx.beginPath();
        ctx.arc(0, 0, c.rx, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.restore();
      }

      ctx.globalCompositeOperation = "source-over";
      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
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
        filter: "blur(6px)",
        willChange: "transform",
      }}
    />
  );
}

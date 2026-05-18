import React, { useState, useCallback, useEffect, useRef } from "react";
import { useTheme } from "../../hooks/useTheme";

const SUPABASE_URL = "https://lvpbjesawdsdlpcofoim.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2cGJqZXNhd2RzZGxwY29mb2ltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0OTgxMTAsImV4cCI6MjA4NjA3NDExMH0.q9rhmhzGCR2FQGy-b9DE8l_mvVXuozgeWA4u01FWZJk";
const ROUNDS = 10;
const MAX_RGB_DIST = Math.sqrt(3 * 255 * 255);

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  s /= 100; l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [Math.round(f(0) * 255), Math.round(f(8) * 255), Math.round(f(4) * 255)];
}

function hslString(h: number, s: number, l: number) {
  return `hsl(${h},${s}%,${l}%)`;
}

function colorDistance(h1: number, s1: number, l1: number, h2: number, s2: number, l2: number) {
  const [r1, g1, b1] = hslToRgb(h1, s1, l1);
  const [r2, g2, b2] = hslToRgb(h2, s2, l2);
  return Math.sqrt((r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2);
}

function roundScore(dist: number) {
  return Math.max(0, Math.round(100 * (1 - dist / MAX_RGB_DIST)));
}

function makeTargets() {
  return Array.from({ length: ROUNDS }, () => ({
    h: Math.floor(Math.random() * 360),
    s: 45 + Math.floor(Math.random() * 45),
    l: 32 + Math.floor(Math.random() * 34),
  }));
}

type GamePhase = "intro" | "playing" | "reveal" | "done" | "submitting" | "board";

interface Entry { name: string; score: number }

// Inject slider CSS once
const SLIDER_CSS = `
.cmslider{-webkit-appearance:none;appearance:none;width:100%;height:10px;border-radius:5px;outline:none;cursor:pointer;border:none;}
.cmslider::-webkit-slider-thumb{-webkit-appearance:none;width:20px;height:20px;border-radius:50%;background:#fff;border:2px solid rgba(0,0,0,0.25);box-shadow:0 1px 5px rgba(0,0,0,0.35);cursor:pointer;}
.cmslider::-moz-range-thumb{width:20px;height:20px;border-radius:50%;background:#fff;border:2px solid rgba(0,0,0,0.25);box-shadow:0 1px 5px rgba(0,0,0,0.35);cursor:pointer;border:none;}
`;

let cssInjected = false;
function injectCSS() {
  if (cssInjected) return;
  const el = document.createElement("style");
  el.textContent = SLIDER_CSS;
  document.head.appendChild(el);
  cssInjected = true;
}

function Slider({
  value, min, max, onChange, gradient,
}: {
  value: number; min: number; max: number;
  onChange: (v: number) => void; gradient: string;
}) {
  return (
    <input
      type="range"
      className="cmslider"
      min={min} max={max} value={value}
      onChange={e => onChange(Number(e.target.value))}
      style={{ background: gradient }}
    />
  );
}

async function fetchBoard(): Promise<Entry[]> {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/color_match_scores?select=name,score&order=score.desc&limit=10`,
    { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
  );
  if (!res.ok) return [];
  return res.json();
}

async function submitEntry(name: string, score: number): Promise<void> {
  await fetch(`${SUPABASE_URL}/rest/v1/color_match_scores`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      Prefer: "return=minimal",
    },
    body: JSON.stringify({ name: name.trim(), score }),
  });
}

export function ColorMatchWindow() {
  const { theme } = useTheme();
  const isLight = theme.mode !== "dark" && theme.mode !== "hailmary";

  useEffect(() => { injectCSS(); }, []);

  const [phase, setPhase] = useState<GamePhase>("intro");
  const [targets, setTargets] = useState(() => makeTargets());
  const [round, setRound] = useState(0);
  const [scores, setScores] = useState<number[]>([]);
  const [playerH, setPlayerH] = useState(180);
  const [playerS, setPlayerS] = useState(50);
  const [playerL, setPlayerL] = useState(50);
  const [lastScore, setLastScore] = useState(0);
  const [name, setName] = useState("");
  const [board, setBoard] = useState<Entry[]>([]);
  const [boardLoading, setBoardLoading] = useState(false);
  const totalScore = scores.reduce((a, b) => a + b, 0);

  const target = targets[round] ?? targets[0];

  const lockIn = useCallback(() => {
    const dist = colorDistance(target.h, target.s, target.l, playerH, playerS, playerL);
    const s = roundScore(dist);
    setLastScore(s);
    setScores(prev => [...prev, s]);
    setPhase("reveal");
  }, [target, playerH, playerS, playerL]);

  const next = useCallback(() => {
    if (round + 1 >= ROUNDS) {
      setPhase("done");
    } else {
      setRound(r => r + 1);
      setPlayerH(180); setPlayerS(50); setPlayerL(50);
      setPhase("playing");
    }
  }, [round]);

  const restart = useCallback(() => {
    setTargets(makeTargets());
    setRound(0);
    setScores([]);
    setPlayerH(180); setPlayerS(50); setPlayerL(50);
    setPhase("intro");
  }, []);

  const submit = useCallback(async () => {
    if (!name.trim()) return;
    setPhase("submitting");
    try {
      await submitEntry(name.trim(), totalScore);
    } catch (_) { /* best-effort */ }
    setBoardLoading(true);
    setPhase("board");
    const entries = await fetchBoard();
    setBoard(entries);
    setBoardLoading(false);
  }, [name, totalScore]);

  const goBoard = useCallback(async () => {
    setPhase("board");
    setBoardLoading(true);
    const entries = await fetchBoard();
    setBoard(entries);
    setBoardLoading(false);
  }, []);

  const bg = isLight ? "#f8f8f8" : "#16181c";
  const card = isLight ? "#fff" : "#1e2025";
  const border = theme.windowBorder;
  const mono = "'IBM Plex Mono', monospace";
  const sans = "'IBM Plex Sans', sans-serif";

  const hGradient = "linear-gradient(to right,hsl(0,80%,50%),hsl(36,80%,50%),hsl(72,80%,50%),hsl(108,80%,50%),hsl(144,80%,50%),hsl(180,80%,50%),hsl(216,80%,50%),hsl(252,80%,50%),hsl(288,80%,50%),hsl(324,80%,50%),hsl(360,80%,50%))";
  const sGradient = `linear-gradient(to right,hsl(${playerH},0%,${playerL}%),hsl(${playerH},100%,${playerL}%))`;
  const lGradient = `linear-gradient(to right,hsl(${playerH},${playerS}%,5%),hsl(${playerH},${playerS}%,50%),hsl(${playerH},${playerS}%,95%))`;

  const swatchStyle = (h: number, s: number, l: number): React.CSSProperties => ({
    width: "100%",
    aspectRatio: "1/1",
    borderRadius: 10,
    background: hslString(h, s, l),
    border: `1px solid ${border}`,
    maxHeight: 160,
  });

  // ── Intro ─────────────────────────────────────────────────────────────────
  if (phase === "intro") return (
    <div style={{ background: bg, height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20, padding: 32, fontFamily: sans }}>
      <div style={{ fontSize: 28, fontWeight: 700, color: theme.textPrimary, textAlign: "center" }}>Color Match</div>
      <div style={{ fontSize: 14, color: theme.textSecondary, textAlign: "center", lineHeight: 1.7, maxWidth: 320 }}>
        We'll show you a color. Use the sliders to match it as closely as you can.<br />10 rounds. Max 1000 points.
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
        <button onClick={() => { setPhase("playing"); }} style={{ padding: "10px 28px", borderRadius: 8, background: theme.iconActiveColor, border: "none", color: "#fff", fontFamily: mono, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
          Play
        </button>
        <button onClick={goBoard} style={{ padding: "10px 20px", borderRadius: 8, background: "transparent", border: `1px solid ${border}`, color: theme.textSecondary, fontFamily: mono, fontSize: 13, cursor: "pointer" }}>
          Leaderboard
        </button>
      </div>
    </div>
  );

  // ── Playing / Reveal ──────────────────────────────────────────────────────
  if (phase === "playing" || phase === "reveal") {
    const isReveal = phase === "reveal";
    return (
      <div style={{ background: bg, height: "100%", overflowY: "auto", padding: "20px 20px 28px", fontFamily: sans, boxSizing: "border-box" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <span style={{ fontFamily: mono, fontSize: 11, color: theme.textMuted, textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Round {round + 1} / {ROUNDS}
          </span>
          <span style={{ fontFamily: mono, fontSize: 13, fontWeight: 600, color: theme.textPrimary }}>
            {totalScore} pts
          </span>
        </div>

        {/* Swatches */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 10, fontFamily: mono, color: theme.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Target</div>
            <div style={swatchStyle(target.h, target.s, target.l)} />
          </div>
          <div>
            <div style={{ fontSize: 10, fontFamily: mono, color: theme.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Your pick</div>
            <div style={swatchStyle(playerH, playerS, playerL)} />
          </div>
        </div>

        {/* Reveal score */}
        {isReveal && (
          <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 8, padding: "14px 16px", marginBottom: 16, textAlign: "center" }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: lastScore >= 80 ? "#22c55e" : lastScore >= 50 ? "#f59e0b" : "#ef4444", fontFamily: mono }}>
              +{lastScore}
            </div>
            <div style={{ fontSize: 11, color: theme.textMuted, marginTop: 2 }}>
              {lastScore >= 90 ? "Incredible eye!" : lastScore >= 70 ? "Nice match!" : lastScore >= 50 ? "Getting there." : "Keep practicing."}
            </div>
          </div>
        )}

        {/* Sliders */}
        {!isReveal && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 20 }}>
            {([
              { label: "Hue", value: playerH, min: 0, max: 360, set: setPlayerH, gradient: hGradient, unit: "°" },
              { label: "Saturation", value: playerS, min: 0, max: 100, set: setPlayerS, gradient: sGradient, unit: "%" },
              { label: "Lightness", value: playerL, min: 0, max: 100, set: setPlayerL, gradient: lGradient, unit: "%" },
            ] as const).map(({ label, value, min, max, set, gradient, unit }) => (
              <div key={label}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 11, fontFamily: mono, color: theme.textSecondary, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</span>
                  <span style={{ fontSize: 11, fontFamily: mono, color: theme.textMuted }}>{value}{unit}</span>
                </div>
                <Slider value={value} min={min} max={max} onChange={v => set(v)} gradient={gradient} />
              </div>
            ))}
          </div>
        )}

        {/* Action button */}
        <button
          onClick={isReveal ? next : lockIn}
          style={{ width: "100%", padding: "12px 0", borderRadius: 8, background: theme.iconActiveColor, border: "none", color: "#fff", fontFamily: mono, fontSize: 13, fontWeight: 600, cursor: "pointer" }}
        >
          {isReveal ? (round + 1 >= ROUNDS ? "See Results →" : "Next Round →") : "Lock It In"}
        </button>
      </div>
    );
  }

  // ── Done ──────────────────────────────────────────────────────────────────
  if (phase === "done" || phase === "submitting") {
    const grade = totalScore >= 900 ? "Designer-eye 👁" : totalScore >= 750 ? "Sharp eye 🎯" : totalScore >= 550 ? "Decent eye 👍" : "Needs training 😅";
    return (
      <div style={{ background: bg, height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: 32, fontFamily: sans }}>
        <div style={{ fontSize: 13, fontFamily: mono, color: theme.textMuted, textTransform: "uppercase", letterSpacing: "0.1em" }}>Game over</div>
        <div style={{ fontSize: 52, fontWeight: 700, color: theme.textPrimary, fontFamily: mono, lineHeight: 1 }}>{totalScore}</div>
        <div style={{ fontSize: 14, color: theme.textSecondary }}>{grade}</div>

        <div style={{ width: "100%", maxWidth: 320, marginTop: 8 }}>
          <input
            type="text"
            placeholder="Your name"
            maxLength={24}
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") submit(); }}
            style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: `1px solid ${border}`, background: card, color: theme.textPrimary, fontFamily: mono, fontSize: 13, outline: "none", boxSizing: "border-box" }}
          />
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <button
              onClick={submit}
              disabled={phase === "submitting" || !name.trim()}
              style={{ flex: 1, padding: "10px 0", borderRadius: 8, background: theme.iconActiveColor, border: "none", color: "#fff", fontFamily: mono, fontSize: 13, fontWeight: 600, cursor: name.trim() ? "pointer" : "not-allowed", opacity: name.trim() ? 1 : 0.5 }}
            >
              {phase === "submitting" ? "Submitting…" : "Submit Score"}
            </button>
            <button onClick={goBoard} style={{ padding: "10px 14px", borderRadius: 8, background: "transparent", border: `1px solid ${border}`, color: theme.textSecondary, fontFamily: mono, fontSize: 12, cursor: "pointer" }}>
              Skip
            </button>
          </div>
          <button onClick={restart} style={{ width: "100%", marginTop: 8, padding: "8px 0", borderRadius: 8, background: "transparent", border: "none", color: theme.textMuted, fontFamily: mono, fontSize: 12, cursor: "pointer" }}>
            Play again
          </button>
        </div>
      </div>
    );
  }

  // ── Leaderboard ───────────────────────────────────────────────────────────
  const myRank = scores.length === ROUNDS ? board.findIndex(e => e.score === totalScore && e.name === name.trim()) + 1 : 0;

  return (
    <div style={{ background: bg, height: "100%", overflowY: "auto", padding: "24px 20px 28px", fontFamily: sans, boxSizing: "border-box" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div style={{ fontFamily: mono, fontSize: 13, fontWeight: 600, color: theme.textPrimary }}>Leaderboard</div>
        <button onClick={restart} style={{ padding: "6px 12px", borderRadius: 6, background: "transparent", border: `1px solid ${border}`, color: theme.textSecondary, fontFamily: mono, fontSize: 11, cursor: "pointer" }}>
          Play again
        </button>
      </div>

      {boardLoading ? (
        <div style={{ textAlign: "center", color: theme.textMuted, fontFamily: mono, fontSize: 12, padding: "40px 0" }}>Loading…</div>
      ) : board.length === 0 ? (
        <div style={{ textAlign: "center", color: theme.textMuted, fontFamily: mono, fontSize: 12, padding: "40px 0" }}>No scores yet — be the first!</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {board.map((entry, i) => {
            const isYou = myRank > 0 && i === myRank - 1;
            const barW = `${Math.round((entry.score / 1000) * 100)}%`;
            return (
              <div key={i} style={{ background: isYou ? (isLight ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.06)") : "transparent", border: isYou ? `1px solid ${border}` : "1px solid transparent", borderRadius: 8, padding: "10px 12px", display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontFamily: mono, fontSize: 11, color: i < 3 ? theme.textPrimary : theme.textMuted, width: 18, textAlign: "right", flexShrink: 0 }}>
                  {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}.`}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 13, color: theme.textPrimary, fontWeight: isYou ? 600 : 400, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {entry.name}{isYou ? " (you)" : ""}
                    </span>
                    <span style={{ fontFamily: mono, fontSize: 12, color: theme.textSecondary, flexShrink: 0, marginLeft: 8 }}>
                      {entry.score}
                    </span>
                  </div>
                  <div style={{ height: 4, borderRadius: 2, background: isLight ? "#e5e7eb" : "#2a2e36", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: barW, borderRadius: 2, background: theme.iconActiveColor, transition: "width 0.6s ease" }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

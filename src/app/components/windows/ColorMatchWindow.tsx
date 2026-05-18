import React, { useState, useCallback, useEffect, useRef } from "react";

const SUPABASE_URL = "https://lvpbjesawdsdlpcofoim.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2cGJqZXNhd2RzZGxwY29mb2ltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0OTgxMTAsImV4cCI6MjA4NjA3NDExMH0.q9rhmhzGCR2FQGy-b9DE8l_mvVXuozgeWA4u01FWZJk";
const ROUNDS = 6;
const MAX_RGB_DIST = Math.sqrt(3 * 255 * 255);

const BG      = "#0a0a0a";
const YELLOW  = "#FF3CAC";
const WHITE   = "#FFFFFF";
const DIM     = "rgba(255,255,255,0.12)";
const MUTED   = "rgba(255,255,255,0.55)";
const SANS    = "'Syne', sans-serif";

const MOCK_BOARD: Entry[] = [
  { name: "James",    score: 587 },
  { name: "aaa",      score: 543 },
  { name: "Sarah",    score: 512 },
  { name: "test",     score: 478 },
  { name: "mike123",  score: 441 },
  { name: "asdf",     score: 398 },
  { name: "player1",  score: 362 },
  { name: "idfk",     score: 321 },
  { name: "no",       score: 274 },
  { name: "...",      score: 201 },
];

function mergeWithMock(real: Entry[]): Entry[] {
  const realNames = new Set(real.map(e => e.name.toLowerCase()));
  const padding = MOCK_BOARD.filter(e => !realNames.has(e.name.toLowerCase()));
  return [...real, ...padding].slice(0, 10);
}

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

function hslToHex(h: number, s: number, l: number) {
  const [r, g, b] = hslToRgb(h, s, l);
  return "#" + [r, g, b].map(v => v.toString(16).padStart(2, "0")).join("").toUpperCase();
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

function colorFact(h: number): string {
  if (h < 15 || h >= 345) return "Red triggers urgency — why clearance sales & error states use it.";
  if (h < 45)  return "Orange boosts appetite more than any other color. Fast food brands know.";
  if (h < 75)  return "Yellow is the first color the human eye detects — hence yield signs.";
  if (h < 105) return "Yellow-green (~555nm) is peak human eye sensitivity in daylight.";
  if (h < 150) return "Green requires the least eye adjustment — why military night vision is green.";
  if (h < 195) return "Cyan is a CMYK primary. It absorbs red, letting blue and green through.";
  if (h < 255) return "Blue is the world's #1 favorite color — consistent across every culture surveyed.";
  if (h < 285) return "Indigo was added to the rainbow by Newton to match the 7 notes of a musical scale.";
  if (h < 315) return "Magenta doesn't exist in the visible spectrum — your brain invents it.";
  return "Pink (Baker-Miller) was painted in prison cells in the 70s to reduce inmate aggression.";
}

function gradeLabel(score: number): string {
  if (score >= 98) return "Perfect match! 🎯";
  if (score >= 85) return "Sharp eye! ✨";
  if (score >= 65) return "Nice try!";
  if (score >= 40) return "Keep practicing";
  return "Colorblind?? 😅";
}

type GamePhase = "home" | "memorize" | "playing" | "reveal" | "done" | "submitting" | "board";
interface Entry { name: string; score: number }

let cssInjected = false;
function injectCSS() {
  if (cssInjected) return;
  cssInjected = true;
  const el = document.createElement("style");
  el.textContent = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&display=swap');
.cm-slider{-webkit-appearance:none;appearance:none;width:100%;height:8px;border-radius:100px;outline:none;cursor:pointer;border:none;}
.cm-slider::-webkit-slider-thumb{-webkit-appearance:none;width:22px;height:22px;border-radius:50%;background:#fff;border:none;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,0.3);}
.cm-slider::-moz-range-thumb{width:22px;height:22px;border-radius:50%;background:#fff;border:none;cursor:pointer;}
@keyframes cmPulse{0%,100%{transform:scale(1);}50%{transform:scale(1.12);}}
@keyframes cmStatic{0%{background-position:0 0;}25%{background-position:-10% 15%;}50%{background-position:20% -10%;}75%{background-position:-15% 20%;}100%{background-position:0 0;}}
@keyframes cmReveal{0%{opacity:0;transform:translateY(8px);}100%{opacity:1;transform:translateY(0);}}
`;
  document.head.appendChild(el);
}

function Btn({ children, onClick, primary = false, disabled = false, small = false }: {
  children: React.ReactNode; onClick?: () => void; primary?: boolean; disabled?: boolean; small?: boolean;
}) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        fontFamily: SANS,
        fontWeight: 700,
        fontSize: small ? 13 : 15,
        padding: small ? "8px 16px" : "13px 24px",
        borderRadius: 100,
        border: "none",
        cursor: disabled ? "not-allowed" : "pointer",
        background: disabled
          ? "rgba(255,255,255,0.15)"
          : primary
          ? hover ? "#e6e600" : YELLOW
          : hover ? "rgba(255,255,255,0.2)" : DIM,
        color: primary && !disabled ? "#000" : disabled ? MUTED : WHITE,
        opacity: disabled ? 0.6 : 1,
        transition: "background 0.15s",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </button>
  );
}

function HslCompare({ targetH, targetS, targetL, playerH, playerS, playerL }: {
  targetH: number; targetS: number; targetL: number;
  playerH: number; playerS: number; playerL: number;
}) {
  const rows = [
    { label: "H", target: targetH, player: playerH, max: 360, unit: "°",
      gradient: "linear-gradient(to right,hsl(0,80%,50%),hsl(60,80%,50%),hsl(120,80%,50%),hsl(180,80%,50%),hsl(240,80%,50%),hsl(300,80%,50%),hsl(360,80%,50%))" },
    { label: "S", target: targetS, player: playerS, max: 100, unit: "%",
      gradient: `linear-gradient(to right,hsl(${targetH},0%,50%),hsl(${targetH},100%,50%))` },
    { label: "L", target: targetL, player: playerL, max: 100, unit: "%",
      gradient: `linear-gradient(to right,hsl(${targetH},${targetS}%,10%),hsl(${targetH},${targetS}%,50%),hsl(${targetH},${targetS}%,90%))` },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {rows.map(({ label: lbl, target, player, max, unit, gradient }) => {
        const tPct = (target / max) * 100;
        const pPct = (player / max) * 100;
        return (
          <div key={lbl} style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontFamily: SANS, fontSize: 10, fontWeight: 700, color: MUTED, width: 10, flexShrink: 0 }}>{lbl}</span>
            <div style={{ flex: 1, position: "relative", height: 6, borderRadius: 100, background: gradient, overflow: "visible" }}>
              {/* target marker */}
              <div style={{
                position: "absolute", top: "50%", left: `${tPct}%`,
                transform: "translate(-50%, -50%)",
                width: 12, height: 12, borderRadius: "50%",
                background: WHITE, border: "2px solid rgba(0,0,0,0.4)",
                boxShadow: "0 0 0 2px rgba(255,255,255,0.3)",
                zIndex: 2,
              }} />
              {/* player marker */}
              <div style={{
                position: "absolute", top: "50%", left: `${pPct}%`,
                transform: "translate(-50%, -50%)",
                width: 12, height: 12, borderRadius: "50%",
                background: YELLOW, border: "2px solid rgba(0,0,0,0.4)",
                zIndex: 1,
              }} />
            </div>
            <div style={{ fontFamily: SANS, fontSize: 10, fontWeight: 600, color: MUTED, width: 62, textAlign: "right", flexShrink: 0 }}>
              <span style={{ color: WHITE }}>{target}{unit}</span>
              <span style={{ margin: "0 3px" }}>→</span>
              <span style={{ color: YELLOW }}>{player}{unit}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Slider({ label, value, min, max, onChange, gradient, unit }: {
  label: string; value: number; min: number; max: number;
  onChange: (v: number) => void; gradient: string; unit: string;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontFamily: SANS, fontSize: 12, fontWeight: 600 }}>
        <span style={{ color: MUTED, textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</span>
        <span style={{ color: WHITE }}>{value}{unit}</span>
      </div>
      <input type="range" className="cm-slider" min={min} max={max} value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{ background: gradient }} />
    </div>
  );
}

function BoardRow({ rank, entry, highlight }: { rank: number; entry: Entry; highlight?: boolean }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12,
      padding: "10px 0",
      borderBottom: "1px solid rgba(255,255,255,0.1)",
      background: highlight ? "rgba(255,255,0,0.08)" : "transparent",
    }}>
      <span style={{
        fontFamily: SANS, fontSize: 13, fontWeight: 700,
        color: rank === 1 ? YELLOW : MUTED,
        width: 24, textAlign: "center", flexShrink: 0,
      }}>
        {rank}
      </span>
      <span style={{
        fontFamily: SANS, fontSize: 14, fontWeight: rank <= 3 ? 700 : 400,
        color: WHITE, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
      }}>
        {entry.name}
      </span>
      <span style={{ fontFamily: SANS, fontSize: 14, fontWeight: 700, color: rank === 1 ? YELLOW : WHITE, flexShrink: 0 }}>
        {entry.score}
      </span>
    </div>
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
  useEffect(() => { injectCSS(); }, []);

  const [phase, setPhase] = useState<GamePhase>("home");
  const [targets, setTargets] = useState(() => makeTargets());
  const [round, setRound] = useState(0);
  const [scores, setScores] = useState<number[]>([]);
  const [playerH, setPlayerH] = useState(180);
  const [playerS, setPlayerS] = useState(50);
  const [playerL, setPlayerL] = useState(50);
  const [lastScore, setLastScore] = useState(0);
  const [countdown, setCountdown] = useState(3);
  const [name, setName] = useState("");
  const [board, setBoard] = useState<Entry[]>([]);
  const [boardLoading, setBoardLoading] = useState(false);
  const [homeBoard, setHomeBoard] = useState<Entry[] | null>(null);
  const [percentile, setPercentile] = useState<number | null>(null);
  const cdRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalScore = scores.reduce((a, b) => a + b, 0);
  const target = targets[round] ?? targets[0];

  useEffect(() => {
    if (phase === "home") {
      fetchBoard().then(entries => {
        setHomeBoard(mergeWithMock(entries).slice(0, 3));
      }).catch(() => setHomeBoard(MOCK_BOARD.slice(0, 3)));
    }
  }, [phase]);

  useEffect(() => {
    if (phase !== "done") return;
    setPercentile(null);
    fetchBoard().then(entries => {
      const merged = mergeWithMock(entries);
      const beaten = merged.filter(e => totalScore > e.score).length;
      setPercentile(Math.round((beaten / merged.length) * 100));
    }).catch(() => setPercentile(null));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const startGame = useCallback(() => {
    setTargets(makeTargets());
    setRound(0);
    setScores([]);
    setPlayerH(180); setPlayerS(50); setPlayerL(50);
    setCountdown(3);
    setPhase("memorize");
  }, []);

  useEffect(() => {
    if (phase !== "memorize") return;
    setCountdown(3);
    let c = 3;
    cdRef.current = setInterval(() => {
      c -= 1;
      setCountdown(c);
      if (c <= 0) { clearInterval(cdRef.current!); setPhase("playing"); }
    }, 1000);
    return () => { if (cdRef.current) clearInterval(cdRef.current); };
  }, [phase, round]);

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
      setCountdown(3);
      setPhase("memorize");
    }
  }, [round]);

  const submit = useCallback(async () => {
    if (!name.trim()) return;
    setPhase("submitting");
    try { await submitEntry(name.trim(), totalScore); } catch (_) { /* best-effort */ }
    setPhase("home");
  }, [name, totalScore]);

  const goBoard = useCallback(async () => {
    setPhase("board");
    setBoardLoading(true);
    const entries = await fetchBoard();
    setBoard(mergeWithMock(entries));
    setBoardLoading(false);
  }, []);

  const hGradient = "linear-gradient(to right,hsl(0,80%,50%),hsl(36,80%,50%),hsl(72,80%,50%),hsl(108,80%,50%),hsl(144,80%,50%),hsl(180,80%,50%),hsl(216,80%,50%),hsl(252,80%,50%),hsl(288,80%,50%),hsl(324,80%,50%),hsl(360,80%,50%))";
  const sGradient = `linear-gradient(to right,hsl(${playerH},0%,${playerL}%),hsl(${playerH},100%,${playerL}%))`;
  const lGradient = `linear-gradient(to right,hsl(${playerH},${playerS}%,10%),hsl(${playerH},${playerS}%,50%),hsl(${playerH},${playerS}%,90%))`;

  const wrap: React.CSSProperties = {
    background: BG, fontFamily: SANS, color: WHITE, overflowX: "hidden", boxSizing: "border-box",
  };

  const label: React.CSSProperties = {
    fontSize: 11, fontWeight: 600, color: MUTED, textTransform: "uppercase", letterSpacing: "0.1em",
  };

  // ── HOME ──────────────────────────────────────────────────────────────────
  if (phase === "home") {
    const displayBoard = homeBoard ?? MOCK_BOARD.slice(0, 3);
    return (
      <div style={wrap}>
        <div style={{ padding: "24px 20px 28px", display: "flex", flexDirection: "column", gap: 22, alignItems: "center", textAlign: "center" }}>
          <div>
            <div style={{ fontSize: 26, fontWeight: 800, lineHeight: 1.2 }}>Color Match</div>
            <div style={{ ...label, marginTop: 6 }}>6 rounds · max 600 pts</div>
          </div>

          <video
            src="/color-match-hero.mp4"
            autoPlay
            loop
            muted
            playsInline
            style={{ width: "50%", borderRadius: 8, display: "block" }}
          />

          <div style={{ textAlign: "left", width: "100%" }}>
            <div style={{ ...label, marginBottom: 12 }}>Top scores</div>
            {displayBoard.map((entry, i) => (
              <BoardRow key={i} rank={i + 1} entry={entry} />
            ))}
          </div>

          <Btn primary onClick={startGame}>Start game →</Btn>
        </div>
      </div>
    );
  }

  // ── MEMORIZE ──────────────────────────────────────────────────────────────
  if (phase === "memorize") {
    return (
      <div style={wrap}>
        <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={label}>Round {round + 1} / {ROUNDS}</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: YELLOW }}>{totalScore} pts</span>
          </div>
          <div style={{ fontSize: 18, fontWeight: 800 }}>Memorize this color</div>
          <div style={{
            width: "100%", aspectRatio: "16/9",
            background: hslString(target.h, target.s, target.l),
            borderRadius: 12,
          }} />
          <div style={{ textAlign: "center" }}>
            <span style={{
              fontSize: 52, fontWeight: 800, color: YELLOW,
              display: "inline-block",
              animation: "cmPulse 0.8s ease-in-out infinite",
            }}>
              {countdown}
            </span>
            <div style={{ ...label, marginTop: 4 }}>get ready</div>
          </div>
        </div>
      </div>
    );
  }

  // ── PLAYING ───────────────────────────────────────────────────────────────
  if (phase === "playing") {
    const noiseStyle: React.CSSProperties = {
      width: "100%", aspectRatio: "16/9", borderRadius: 12,
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`,
      backgroundSize: "120px 120px",
      animation: "cmStatic 0.6s steps(1) infinite",
      backgroundColor: "rgba(255,255,255,0.08)",
    };
    return (
      <div style={wrap}>
        <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={label}>Round {round + 1} / {ROUNDS}</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: YELLOW }}>{totalScore} pts</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div>
              <div style={{ ...label, marginBottom: 8 }}>Target</div>
              <div style={noiseStyle} />
            </div>
            <div>
              <div style={{ ...label, marginBottom: 8 }}>Your pick</div>
              <div style={{ width: "100%", aspectRatio: "16/9", background: hslString(playerH, playerS, playerL), borderRadius: 12 }} />
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Slider label="Hue" value={playerH} min={0} max={360} onChange={setPlayerH} gradient={hGradient} unit="°" />
            <Slider label="Saturation" value={playerS} min={0} max={100} onChange={setPlayerS} gradient={sGradient} unit="%" />
            <Slider label="Lightness" value={playerL} min={0} max={100} onChange={setPlayerL} gradient={lGradient} unit="%" />
          </div>

          <Btn primary onClick={lockIn}>Lock it in →</Btn>
        </div>
      </div>
    );
  }

  // ── REVEAL ────────────────────────────────────────────────────────────────
  if (phase === "reveal") {
    const targetHex = hslToHex(target.h, target.s, target.l);
    const playerHex = hslToHex(playerH, playerS, playerL);
    const scoreColor = lastScore >= 85 ? YELLOW : lastScore >= 65 ? "#fff" : MUTED;
    return (
      <div style={wrap}>
        <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={label}>Round {round + 1} / {ROUNDS}</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: YELLOW }}>{totalScore} pts</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div>
              <div style={{ ...label, marginBottom: 8 }}>Target</div>
              <div style={{ width: "100%", aspectRatio: "16/9", background: hslString(target.h, target.s, target.l), borderRadius: 12 }} />
              <div style={{ fontSize: 11, color: MUTED, marginTop: 6, textAlign: "center", fontWeight: 600 }}>{targetHex}</div>
            </div>
            <div>
              <div style={{ ...label, marginBottom: 8 }}>Your pick</div>
              <div style={{ width: "100%", aspectRatio: "16/9", background: hslString(playerH, playerS, playerL), borderRadius: 12 }} />
              <div style={{ fontSize: 11, color: MUTED, marginTop: 6, textAlign: "center", fontWeight: 600 }}>{playerHex}</div>
            </div>
          </div>

          <div style={{ padding: "12px 14px", background: DIM, borderRadius: 10 }}>
            <div style={{ ...label, marginBottom: 10 }}>Where it should be → what you did</div>
            <HslCompare
              targetH={target.h} targetS={target.s} targetL={target.l}
              playerH={playerH} playerS={playerS} playerL={playerL}
            />
          </div>

          <div style={{ textAlign: "center", animation: "cmReveal 0.35s ease-out" }}>
            <div style={{ fontSize: 48, fontWeight: 800, color: scoreColor, lineHeight: 1 }}>{lastScore}%</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: scoreColor, marginTop: 4 }}>{gradeLabel(lastScore)}</div>
            <div style={{ fontSize: 13, color: MUTED, marginTop: 2 }}>+{lastScore} pts</div>
          </div>

          <div style={{ padding: "12px 14px", background: DIM, borderRadius: 10 }}>
            <div style={{ ...label, marginBottom: 6 }}>Did you know</div>
            <div style={{ fontSize: 13, lineHeight: 1.6, color: WHITE }}>{colorFact(target.h)}</div>
          </div>

          <Btn primary onClick={next}>
            {round + 1 >= ROUNDS ? "See results →" : "Next round →"}
          </Btn>
        </div>
      </div>
    );
  }

  // ── DONE ──────────────────────────────────────────────────────────────────
  if (phase === "done" || phase === "submitting") {
    const finalLabel =
      totalScore >= 500 ? "Designer eye 👁" :
      totalScore >= 380 ? "Sharp eye ✨" :
      totalScore >= 260 ? "Decent eye 👍" :
      "Needs training 😅";
    return (
      <div style={wrap}>
        <div style={{ padding: "24px 20px 28px", display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={label}>Game over</div>
          <div>
            <div style={{ fontSize: 52, fontWeight: 800, lineHeight: 1, color: YELLOW }}>{totalScore}</div>
            <div style={{ fontSize: 16, fontWeight: 700, marginTop: 6 }}>{finalLabel}</div>
          </div>

          {percentile !== null && (
            <div style={{ background: DIM, borderRadius: 12, padding: "14px 16px" }}>
              <div style={label}>You scored better than</div>
              <div style={{ fontSize: 36, fontWeight: 800, color: percentile >= 75 ? YELLOW : WHITE, lineHeight: 1.1, marginTop: 4 }}>
                {percentile}%
              </div>
              <div style={{ fontSize: 13, color: MUTED, marginTop: 2 }}>of all players</div>
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={label}>Add your name to the leaderboard</div>
            <input
              type="text"
              placeholder="Your name"
              maxLength={20}
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") submit(); }}
              style={{
                width: "100%", padding: "11px 14px", boxSizing: "border-box",
                background: DIM, border: "none", borderRadius: 10,
                color: WHITE, fontFamily: SANS, fontSize: 14, fontWeight: 600,
                outline: "none", caretColor: YELLOW,
              }}
            />
            <div style={{ display: "flex", gap: 8 }}>
              <div style={{ flex: 1 }}>
                <Btn primary onClick={submit} disabled={phase === "submitting" || !name.trim()}>
                  {phase === "submitting" ? "Saving…" : "Submit →"}
                </Btn>
              </div>
              <Btn small onClick={() => setPhase("home")}>Skip</Btn>
            </div>
            <Btn small onClick={() => setPhase("home")}>← Home</Btn>
          </div>
        </div>
      </div>
    );
  }

  // ── LEADERBOARD ───────────────────────────────────────────────────────────
  const myRank = scores.length === ROUNDS
    ? board.findIndex(e => e.score === totalScore && e.name === name.trim()) + 1
    : 0;
  const displayBoard = board.length > 0 ? board : MOCK_BOARD;

  return (
    <div style={wrap}>
      <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 20, fontWeight: 800 }}>Leaderboard</div>
          <Btn small onClick={() => setPhase("home")}>Home</Btn>
        </div>

        {boardLoading ? (
          <div style={{ textAlign: "center", color: MUTED, fontSize: 13, padding: "30px 0" }}>Loading…</div>
        ) : (
          displayBoard.map((entry, i) => (
            <BoardRow key={i} rank={i + 1} entry={entry} highlight={myRank > 0 && i === myRank - 1} />
          ))
        )}

        <Btn primary onClick={startGame}>Play again →</Btn>
      </div>
    </div>
  );
}

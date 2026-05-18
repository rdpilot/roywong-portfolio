import { useEffect, useRef, useState, useCallback } from "react";
import type { HandLandmarks } from "./useHandTracking";

export type GestureAction =
  | "open_about"
  | "open_gallery"
  | "open_spray"
  | "open_trading"
  | "open_arcade"
  | "open_comiccon"
  | "close_window"
  | "cycle_theme"
  | "none";

export interface GestureConfig {
  dwell: GestureAction | "click";
  fist: GestureAction | "click";
  [key: string]: string;
}

const DEFAULT_CONFIG: GestureConfig = {
  dwell: "click",
  fist: "close_window",
};

const GESTURE_CONFIG_KEY = "gesture_config";

export function loadGestureConfig(): GestureConfig {
  try {
    const raw = localStorage.getItem(GESTURE_CONFIG_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // migrate old keys
      if ((parsed.pinch || parsed.tap) && !parsed.dwell)
        parsed.dwell = parsed.pinch ?? parsed.tap ?? "click";
      delete parsed.pinch; delete parsed.tap; delete parsed.open_palm;
      delete parsed.swipe_left; delete parsed.swipe_right;
      if (!parsed.fist) parsed.fist = "close_window";
      return { ...DEFAULT_CONFIG, ...parsed };
    }
  } catch {}
  return { ...DEFAULT_CONFIG };
}

export function saveGestureConfig(config: GestureConfig) {
  try {
    localStorage.setItem(GESTURE_CONFIG_KEY, JSON.stringify(config));
  } catch {}
}

interface CursorPos { x: number; y: number; }

interface UseGestureRecognitionResult {
  gesture: string;
  cursorPos: CursorPos;
  dwellProgress: number;       // 0–1, drives the progress ring on VirtualCursor
  isPalmDragging: boolean;
  config: GestureConfig;
  setConfig: (config: GestureConfig) => void;
  onAction: ((action: string) => void) | null;
}

function makeMouse(type: string, cx: number, cy: number) {
  return new MouseEvent(type, {
    bubbles: true, cancelable: true, view: window,
    clientX: cx, clientY: cy, button: 0,
  });
}

function findDragHandle(fromElement: Element | null): HTMLElement | null {
  let el = fromElement;
  while (el && el !== document.documentElement) {
    if (el.hasAttribute("data-window-id"))
      return el.querySelector("[data-drag-handle]") as HTMLElement | null;
    el = el.parentElement;
  }
  return null;
}

// ── Dwell-to-click ──
const DWELL_RADIUS_PX   = 38;   // px — cursor must stay inside this circle
const DWELL_TIME_MS     = 900;  // ms to hold still before click fires
const DWELL_DEBOUNCE_MS = 1200; // ms before next dwell can fire

// ── Fist ──
const FIST_DEBOUNCE_MS = 1000;

// ── 2-Finger scroll + momentum ──
// Single threshold high enough to ignore slow repositioning (returning fingers to
// start position) but low enough that intentional up OR down swipes both work.
const SCROLL_THRESHOLD  = 0.007;  // normalized units/frame — filters slow repositioning
const SCROLL_WINDOW     = 3;
const SCROLL_MULTIPLIER = 3.0;
const MOMENTUM_FRICTION = 0.88;
const MOMENTUM_MIN_PX   = 1.0;

// ── Palm drag ──
type PalmDragPhase = "idle" | "dragging" | "cooldown";
const PALM_DRAG_COOLDOWN_MS = 600;

export function useGestureRecognition(
  landmarks: HandLandmarks | null,
  externalOnAction?: (action: string) => void
): UseGestureRecognitionResult {
  const [config, setConfigState] = useState<GestureConfig>(() => loadGestureConfig());
  const setConfig = useCallback((c: GestureConfig) => {
    setConfigState(c);
    saveGestureConfig(c);
  }, []);

  const [gesture,        setGesture]        = useState("none");
  const [cursorPos,      setCursorPos]       = useState<CursorPos>({ x: -100, y: -100 });
  const [dwellProgress,  setDwellProgress]   = useState(0);
  const [isPalmDragging, setIsPalmDragging]  = useState(false);

  const smoothCursorRef      = useRef<CursorPos>({ x: -100, y: -100 });
  const twoFingerYHistoryRef = useRef<number[]>([]);

  // Dwell
  const dwellStartTimeRef  = useRef(0);
  const dwellZonePosRef    = useRef<CursorPos>({ x: -100, y: -100 });
  const lastDwellFireRef   = useRef(0);

  // Fist / swipe
  const lastFistTimeRef  = useRef(0);
  const wasFistRef       = useRef(false);

  // Palm drag
  const palmDragPhaseRef   = useRef<PalmDragPhase>("idle");
  const palmDragEndTimeRef = useRef(0);
  const wasOpenPalmRef     = useRef(false);

  // Scroll momentum
  const momentumVelRef    = useRef(0);
  const momentumTargetRef = useRef<Element | null>(null);
  const momentumRafRef    = useRef<number | null>(null);
  const wasTwoFingerRef   = useRef(false);
  const lastScrollVelRef  = useRef(0);

  const configRef = useRef(config);
  useEffect(() => { configRef.current = config; }, [config]);

  const externalOnActionRef = useRef(externalOnAction);
  useEffect(() => { externalOnActionRef.current = externalOnAction; }, [externalOnAction]);

  const startMomentum = useCallback((initialVel: number, target: Element | null) => {
    if (momentumRafRef.current !== null) cancelAnimationFrame(momentumRafRef.current);
    momentumVelRef.current    = initialVel;
    momentumTargetRef.current = target;
    function tick() {
      const v = momentumVelRef.current;
      if (Math.abs(v) < MOMENTUM_MIN_PX) { momentumVelRef.current = 0; momentumRafRef.current = null; return; }
      (momentumTargetRef.current as HTMLElement || document.documentElement).scrollTop += v;
      momentumVelRef.current = v * MOMENTUM_FRICTION;
      momentumRafRef.current = requestAnimationFrame(tick);
    }
    momentumRafRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => () => {
    if (momentumRafRef.current !== null) cancelAnimationFrame(momentumRafRef.current);
  }, []);

  useEffect(() => {
    if (!landmarks || landmarks.length === 0) {
      if (palmDragPhaseRef.current === "dragging") {
        window.dispatchEvent(makeMouse("mouseup", smoothCursorRef.current.x, smoothCursorRef.current.y));
        palmDragPhaseRef.current   = "cooldown";
        palmDragEndTimeRef.current = performance.now();
      }
      if (wasTwoFingerRef.current && Math.abs(lastScrollVelRef.current) > MOMENTUM_MIN_PX)
        startMomentum(lastScrollVelRef.current, momentumTargetRef.current);

      setGesture("none");
      setCursorPos({ x: -100, y: -100 });
      setDwellProgress(0);
      setIsPalmDragging(false);
      wasFistRef.current = false; wasOpenPalmRef.current = false;
      wasTwoFingerRef.current = false; lastScrollVelRef.current = 0;
      indexXHistoryRef.current = []; twoFingerYHistoryRef.current = [];
      dwellStartTimeRef.current = 0; dwellZonePosRef.current = { x: -100, y: -100 };
      return;
    }

    const thumb     = landmarks[4];
    const index     = landmarks[8];
    const indexPip  = landmarks[6];
    const middle    = landmarks[12];
    const ring      = landmarks[16];
    const pinky     = landmarks[20];
    const middlePip = landmarks[10];
    const ringPip   = landmarks[14];
    const pinkyPip  = landmarks[18];

    if (!thumb || !index || !indexPip) return;

    // ── Cursor ──
    const rawX = (1 - index.x) * window.innerWidth;
    const rawY = index.y * window.innerHeight;
    const alpha = 0.3;
    smoothCursorRef.current = {
      x: smoothCursorRef.current.x * (1 - alpha) + rawX * alpha,
      y: smoothCursorRef.current.y * (1 - alpha) + rawY * alpha,
    };
    if (cursorPos.x === -100) smoothCursorRef.current = { x: rawX, y: rawY };
    setCursorPos({ ...smoothCursorRef.current });

    const cx  = smoothCursorRef.current.x;
    const cy  = smoothCursorRef.current.y;
    const now = performance.now();

    // ── Finger extension ──
    const indexExtended  = index.y  < indexPip.y;
    const middleExtended = middle  && middlePip ? middle.y  < middlePip.y : false;
    const ringExtended   = ring    && ringPip   ? ring.y    < ringPip.y   : false;
    const pinkyExtended  = pinky   && pinkyPip  ? pinky.y   < pinkyPip.y  : false;

    const openPalm       = indexExtended && middleExtended && ringExtended && pinkyExtended;
    const twoFingerActive = indexExtended && middleExtended && !openPalm;
    const fist           = !indexExtended && !middleExtended && !ringExtended && !pinkyExtended;
    const isActiveGesture = openPalm || twoFingerActive || fist ||
                            palmDragPhaseRef.current === "dragging";

    // ── Dwell-to-click ──
    // Only counts down when hand is relatively still and not doing another gesture
    if (!isActiveGesture) {
      const dz  = dwellZonePosRef.current;
      const d   = Math.sqrt((cx - dz.x) ** 2 + (cy - dz.y) ** 2);

      if (d > DWELL_RADIUS_PX || dwellStartTimeRef.current === 0) {
        // Cursor moved — reset dwell zone
        dwellZonePosRef.current  = { x: cx, y: cy };
        dwellStartTimeRef.current = now;
      }

      const elapsed  = now - dwellStartTimeRef.current;
      const progress = Math.min(elapsed / DWELL_TIME_MS, 1);
      setDwellProgress(progress);

      if (progress >= 1 && now - lastDwellFireRef.current > DWELL_DEBOUNCE_MS) {
        lastDwellFireRef.current  = now;
        dwellStartTimeRef.current = now + DWELL_DEBOUNCE_MS; // hold off next charge
        const action = configRef.current.dwell;
        if (action === "click") {
          const el = document.elementFromPoint(cx, cy);
          if (el) (el as HTMLElement).click();
        } else if (action !== "none") {
          externalOnActionRef.current?.(action);
        }
      }
    } else {
      // Any active gesture resets dwell
      dwellStartTimeRef.current = now;
      dwellZonePosRef.current   = { x: cx, y: cy };
      setDwellProgress(0);
    }

    // ── Fist ──
    if (fist && !wasFistRef.current && palmDragPhaseRef.current === "idle" &&
        now - palmDragEndTimeRef.current > PALM_DRAG_COOLDOWN_MS) {
      if (now - lastFistTimeRef.current > FIST_DEBOUNCE_MS) {
        lastFistTimeRef.current = now;
        const action = configRef.current.fist;
        if (action === "click") {
          const el = document.elementFromPoint(cx, cy);
          if (el) (el as HTMLElement).click();
        } else if (action !== "none") {
          externalOnActionRef.current?.(action);
        }
      }
    }
    wasFistRef.current = fist;

    // ── Open palm drag ──
    if (palmDragPhaseRef.current === "idle") {
      if (openPalm && !wasOpenPalmRef.current) {
        const handle = findDragHandle(document.elementFromPoint(cx, cy));
        if (handle) {
          handle.dispatchEvent(makeMouse("mousedown", cx, cy));
          palmDragPhaseRef.current = "dragging";
        }
      }
    } else if (palmDragPhaseRef.current === "dragging") {
      if (openPalm) {
        window.dispatchEvent(makeMouse("mousemove", cx, cy));
      } else {
        window.dispatchEvent(makeMouse("mouseup", cx, cy));
        palmDragEndTimeRef.current = now;
        palmDragPhaseRef.current   = "cooldown";
      }
    } else if (palmDragPhaseRef.current === "cooldown") {
      if (now - palmDragEndTimeRef.current > PALM_DRAG_COOLDOWN_MS)
        palmDragPhaseRef.current = "idle";
    }
    wasOpenPalmRef.current = openPalm;
    setIsPalmDragging(palmDragPhaseRef.current === "dragging");

    // ── Swipe ──
    const normalizedX = 1 - index.x;
    indexXHistoryRef.current.push(normalizedX);
    if (indexXHistoryRef.current.length > HISTORY_SIZE) indexXHistoryRef.current.shift();

    if (indexXHistoryRef.current.length >= SWIPE_WINDOW) {
      const recent = indexXHistoryRef.current.slice(-SWIPE_WINDOW);
      const vel    = (recent[recent.length - 1] - recent[0]) / SWIPE_WINDOW;
      if (vel > SWIPE_VEL_THRESHOLD && indexExtended) {
        const action = configRef.current.swipe_right;
        if (action && action !== "none" && action !== "click" && now - lastSwipeTimeRef.current > SWIPE_DEBOUNCE_MS) {
          lastSwipeTimeRef.current = now; externalOnActionRef.current?.(action);
        }
        indexXHistoryRef.current = [];
      } else if (vel < -SWIPE_VEL_THRESHOLD && indexExtended) {
        const action = configRef.current.swipe_left;
        if (action && action !== "none" && action !== "click" && now - lastSwipeTimeRef.current > SWIPE_DEBOUNCE_MS) {
          lastSwipeTimeRef.current = now; externalOnActionRef.current?.(action);
        }
        indexXHistoryRef.current = [];
      }
    }

    // ── 2-Finger scroll + momentum ──
    // Threshold is tuned so intentional swipes (fast) trigger scroll in EITHER direction,
    // but slow repositioning movements (returning fingers to start) are ignored.
    if (twoFingerActive && middle) {
      if (!wasTwoFingerRef.current) {
        if (momentumRafRef.current !== null) { cancelAnimationFrame(momentumRafRef.current); momentumRafRef.current = null; }
        twoFingerYHistoryRef.current = [];
      }

      const avgY = (index.y + middle.y) / 2;
      twoFingerYHistoryRef.current.push(avgY);
      if (twoFingerYHistoryRef.current.length > SCROLL_WINDOW + 1)
        twoFingerYHistoryRef.current.shift();

      if (twoFingerYHistoryRef.current.length >= SCROLL_WINDOW) {
        const hist = twoFingerYHistoryRef.current;
        const vel  = (hist[hist.length - 1] - hist[0]) / SCROLL_WINDOW;

        // Cache scroll target on gesture start
        if (!momentumTargetRef.current) {
          const el = document.elementFromPoint(cx, cy);
          let t: Element | null = el;
          while (t && t !== document.documentElement) {
            const s = window.getComputedStyle(t);
            if (s.overflowY === "auto" || s.overflowY === "scroll") break;
            t = t.parentElement;
          }
          momentumTargetRef.current = t || document.documentElement;
        }

        if (Math.abs(vel) > SCROLL_THRESHOLD) {
          // Fingers up (vel<0) → page down; fingers down (vel>0) → page up
          const pxPerFrame = -vel * window.innerHeight * SCROLL_MULTIPLIER;
          (momentumTargetRef.current as HTMLElement).scrollTop += pxPerFrame;
          lastScrollVelRef.current = pxPerFrame;
        } else {
          // Below threshold = slow repositioning, don't scroll and don't clear
          // lastScrollVel so momentum still fires from the last real swipe
        }
      }
      wasTwoFingerRef.current = true;
    } else {
      if (wasTwoFingerRef.current && Math.abs(lastScrollVelRef.current) > MOMENTUM_MIN_PX)
        startMomentum(lastScrollVelRef.current, momentumTargetRef.current);
      twoFingerYHistoryRef.current = [];
      lastScrollVelRef.current  = 0;
      wasTwoFingerRef.current   = false;
      momentumTargetRef.current = null;
    }

    // ── Gesture label ──
    let detectedGesture = "none";
    if (dwellProgress >= 0.05 && !isActiveGesture)      detectedGesture = "dwell";
    else if (fist)                                        detectedGesture = "fist";
    else if (palmDragPhaseRef.current === "dragging")     detectedGesture = "open_palm";
    else if (openPalm)                                    detectedGesture = "open_palm";
    else if (twoFingerActive)                             detectedGesture = "two_finger";
    else if (indexExtended && !middleExtended && !ringExtended && !pinkyExtended)
                                                          detectedGesture = "point";
    setGesture(detectedGesture);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [landmarks, startMomentum, dwellProgress]);

  return { gesture, cursorPos, dwellProgress, isPalmDragging, config, setConfig, onAction: externalOnAction ?? null };
}

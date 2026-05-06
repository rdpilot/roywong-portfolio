import { useEffect, useRef, useState, useCallback } from "react";
import type { NormalizedLandmark } from "@mediapipe/tasks-vision";

export type HandLandmarks = NormalizedLandmark[];

interface UseHandTrackingResult {
  landmarks: HandLandmarks | null;
  isLoading: boolean;
  error: string | null;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}

export function useHandTracking(enabled: boolean, retryKey = 0): UseHandTrackingResult {
  const [landmarks, setLandmarks] = useState<HandLandmarks | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const handLandmarkerRef = useRef<import("@mediapipe/tasks-vision").HandLandmarker | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const lastTimestampRef = useRef<number>(-1);

  const cleanup = useCallback(() => {
    if (animFrameRef.current !== null) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (handLandmarkerRef.current) {
      handLandmarkerRef.current.close();
      handLandmarkerRef.current = null;
    }
    setLandmarks(null);
    lastTimestampRef.current = -1;
  }, []);

  useEffect(() => {
    if (!enabled) {
      cleanup();
      setIsLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;

    async function init() {
      setIsLoading(true);
      setError(null);

      try {
        // Dynamic import to avoid SSR issues
        const { FilesetResolver, HandLandmarker } = await import("@mediapipe/tasks-vision");

        if (cancelled) return;

        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
        );

        if (cancelled) return;

        const handLandmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
            delegate: "GPU",
          },
          runningMode: "VIDEO",
          numHands: 1,
        });

        if (cancelled) {
          handLandmarker.close();
          return;
        }

        handLandmarkerRef.current = handLandmarker;

        // Request camera
        let stream: MediaStream;
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "user", width: 320, height: 240 },
          });
        } catch (e: unknown) {
          if (cancelled) return;
          const name = e instanceof Error ? e.name : "";
          if (name === "NotAllowedError" || name === "PermissionDeniedError") {
            setError("PERMISSION_DENIED");
          } else {
            setError("Camera unavailable. Please check your device.");
          }
          setIsLoading(false);
          return;
        }

        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        streamRef.current = stream;

        const video = videoRef.current;
        if (!video) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        video.srcObject = stream;
        await new Promise<void>((resolve, reject) => {
          video.onloadedmetadata = () => {
            video.play().then(resolve).catch(reject);
          };
          video.onerror = reject;
        });

        if (cancelled) return;

        setIsLoading(false);

        // Detection loop
        function detect() {
          if (cancelled || !handLandmarkerRef.current) return;
          const v = videoRef.current;
          if (!v || v.readyState < 2) {
            animFrameRef.current = requestAnimationFrame(detect);
            return;
          }

          const now = performance.now();
          if (now === lastTimestampRef.current) {
            animFrameRef.current = requestAnimationFrame(detect);
            return;
          }
          lastTimestampRef.current = now;

          try {
            const result = handLandmarkerRef.current.detectForVideo(v, now);
            if (result.landmarks && result.landmarks.length > 0) {
              setLandmarks(result.landmarks[0]);
              drawLandmarks(result.landmarks[0]);
            } else {
              setLandmarks(null);
              clearCanvas();
            }
          } catch {
            // skip frame on error
          }

          animFrameRef.current = requestAnimationFrame(detect);
        }

        animFrameRef.current = requestAnimationFrame(detect);
      } catch (e) {
        if (!cancelled) {
          setError("Failed to initialize hand tracking. Please try again.");
          setIsLoading(false);
        }
      }
    }

    function drawLandmarks(lms: HandLandmarks) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Draw at full viewport size so skeleton overlays the whole page
      const W = window.innerWidth;
      const H = window.innerHeight;
      canvas.width = W;
      canvas.height = H;
      ctx.clearRect(0, 0, W, H);

      // Draw connections (simplified skeleton)
      const connections = [
        [0, 1], [1, 2], [2, 3], [3, 4],       // thumb
        [0, 5], [5, 6], [6, 7], [7, 8],         // index
        [0, 9], [9, 10], [10, 11], [11, 12],    // middle
        [0, 13], [13, 14], [14, 15], [15, 16],  // ring
        [0, 17], [17, 18], [18, 19], [19, 20],  // pinky
        [5, 9], [9, 13], [13, 17],              // palm
      ];

      ctx.strokeStyle = "rgba(0, 255, 120, 0.7)";
      ctx.lineWidth = 2;

      for (const [a, b] of connections) {
        const lmA = lms[a];
        const lmB = lms[b];
        if (!lmA || !lmB) continue;
        // Mirror X for natural display
        ctx.beginPath();
        ctx.moveTo((1 - lmA.x) * W, lmA.y * H);
        ctx.lineTo((1 - lmB.x) * W, lmB.y * H);
        ctx.stroke();
      }

      // Draw landmark dots
      for (const lm of lms) {
        ctx.beginPath();
        ctx.arc((1 - lm.x) * W, lm.y * H, 4, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0, 255, 180, 0.9)";
        ctx.fill();
      }
    }

    function clearCanvas() {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    init();

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [enabled, retryKey, cleanup]);

  return { landmarks, isLoading, error, videoRef, canvasRef };
}

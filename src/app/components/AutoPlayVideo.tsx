import React, { useRef, useEffect, useState } from "react";

interface AutoPlayVideoProps
  extends React.VideoHTMLAttributes<HTMLVideoElement> {
  src: string;
}

/**
 * Muted, looping, autoplay video — designed for GIF-replacement use.
 *
 * Key mobile fixes:
 *   1. `autoPlay` HTML attribute   — iOS Safari whitelists `autoPlay muted playsInline`
 *      as the ONLY allowed way to start video without a user gesture. Calling
 *      `video.play()` programmatically always requires a gesture on iOS, even
 *      for muted videos, so we removed the JS play() call entirely.
 *
 *   2. `preload="auto"`            — tells the browser to start buffering
 *      immediately so autoPlay has data to display; `preload="metadata"` was
 *      leaving the video black while waiting for a play trigger.
 *
 *   3. `referrerPolicy="no-referrer"` — suppresses the Referer HTTP header so
 *      Imgur's hotlink protection lets the request through (it only blocks
 *      requests from known third-party referrers).
 *
 *   4. 200 ms timeout fallback for IntersectionObserver — the observer silently
 *      fails inside overflow:hidden DraggableWindows, so we always force-render
 *      within 200 ms regardless.
 */
export function AutoPlayVideo({ src, className, style, ...props }: AutoPlayVideoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [failed,  setFailed]  = useState(false);

  // Lazy-render gate: only mount the <video> once the container is near the
  // viewport. A 200 ms timeout catches cases where the observer doesn't fire.
  useEffect(() => {
    let disposed = false;
    const markVisible = () => { if (!disposed) setVisible(true); };

    // Fallback: always render within 200 ms
    const timer = setTimeout(markVisible, 200);

    const el = containerRef.current;
    if (el) {
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) { markVisible(); obs.disconnect(); }
        },
        { rootMargin: "200px" }
      );
      obs.observe(el);
      return () => { disposed = true; clearTimeout(timer); obs.disconnect(); };
    }
    return () => { disposed = true; clearTimeout(timer); };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-full flex items-center justify-center">
      {/* Render video only after visibility check */}
      {visible && !failed && (
        <video
          src={src}
          // ── The iOS-safe autoplay trifecta ──────────────────────────────
          autoPlay
          muted
          playsInline
          // ───────────────────────────────────────────────────────────────
          loop
          preload="auto"
          referrerPolicy="no-referrer"
          className={className}
          style={style}
          onError={() => setFailed(true)}
          {...props}
        />
      )}

      {/* Fallback shown when the video errors (e.g. Imgur removed the file) */}
      {failed && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-1"
          style={{
            background: "rgba(0,0,0,0.55)",
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: "10px",
            color: "rgba(255,255,255,0.6)",
            textAlign: "center",
            padding: "8px",
          }}
        >
          <span style={{ fontSize: "16px", opacity: 0.5 }}>▶</span>
          <span>Preview unavailable</span>
        </div>
      )}
    </div>
  );
}

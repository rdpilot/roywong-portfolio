import React, { useState, useEffect, useRef } from "react";
import { useIsMobile } from "../../hooks/useIsMobile";
import { useQuickLook } from "../QuickLookOverlay";

const videoItems = [
  { src: "https://i.imgur.com/dMTZqqk.mp4", name: "claude_prototype_05.mp4", size: "3.5 MB" },
  { src: "https://i.imgur.com/E8XOQFh.mp4", name: "wavetype_output_02.mp4", size: "2.5 MB" },
  { src: "https://i.imgur.com/4D7eumy.mp4", name: "orbwarp_shader_01.mp4", size: "4.2 MB" },
  { src: "https://i.imgur.com/33a6lqO.mp4", name: "ascii_3d_render_02.mp4", size: "2.0 MB" },
  { src: "https://i.imgur.com/uPsJ8Fc.mp4", name: "wavetype_output_05.mp4", size: "2.6 MB" },
  { src: "https://i.imgur.com/GwJFisG.mp4", name: "polytrace_output_01.mp4", size: "3.1 MB" },
  { src: "https://i.imgur.com/kAjf1CU.mp4", name: "claude_prototype_04.mp4", size: "980 KB" },
  { src: "https://i.imgur.com/tDEflFR.mp4", name: "ascii_3d_render_03.mp4", size: "3.3 MB" },
  { src: "https://i.imgur.com/rT4YJ7y.mp4", name: "wavetype_output_04.mp4", size: "2.2 MB" },
  { src: "https://i.imgur.com/L0a6mdz.mp4", name: "claude_prototype_02.mp4", size: "1.2 MB" },
  { src: "https://i.imgur.com/fh8nn35.mp4", name: "voxelizer_render_01.mp4", size: "2.4 MB" },
  { src: "https://i.imgur.com/dawv313.mp4", name: "ascii_3d_render_01.mp4", size: "2.1 MB" },
  { src: "https://i.imgur.com/TCIwR1h.mp4", name: "wavetype_output_01.mp4", size: "1.3 MB" },
  { src: "https://i.imgur.com/ElarQnN.mp4", name: "claude_prototype_03.mp4", size: "1.6 MB" },
  { src: "https://i.imgur.com/683vM09.mp4", name: "orbwarp_shader_02.mp4", size: "2.8 MB" },
  { src: "https://i.imgur.com/UIGUcBQ.mp4", name: "texttura_preview_01.mp4", size: "2.7 MB" },
  { src: "https://i.imgur.com/9CaShKP.mp4", name: "claude_prototype_01.mp4", size: "1.8 MB" },
  { src: "https://i.imgur.com/QJLSfpE.png", name: "polytrace_output_03.png", size: "1.1 MB" },
  { src: "https://i.imgur.com/fknajW8.mp4", name: "ascii_3d_render_04.mp4", size: "2.3 MB" },
  { src: "https://i.imgur.com/dWHaIK0.mp4", name: "wavetype_output_03.mp4", size: "1.9 MB" },
  { src: "https://i.imgur.com/ulwYRQS.mp4", name: "claude_prototype_07.mp4", size: "1.4 MB" },
  { src: "https://i.imgur.com/wg65B6m.mp4", name: "polytrace_output_02.mp4", size: "1.9 MB" },
];

const isImage = (src: string) => /\.(png|jpe?g|gif|webp|svg)$/i.test(src);

function LazyVideoThumb({ src }: { src: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let disposed = false;
    const show = () => { if (!disposed) setVisible(true); };
    const timer = setTimeout(show, 200);
    const el = ref.current;
    const obs = el
      ? new IntersectionObserver(([e]) => { if (e.isIntersecting) { show(); obs?.disconnect(); } }, { rootMargin: "200px" })
      : null;
    if (el && obs) obs.observe(el);
    return () => { disposed = true; clearTimeout(timer); obs?.disconnect(); };
  }, []);

  return (
    <div ref={ref} style={{ width: "100%", height: "100%" }}>
      {visible && (
        <video
          className="gallery-thumb"
          src={src}
          autoPlay
          muted
          playsInline
          loop
          preload="auto"
          referrerPolicy="no-referrer"
          style={{ pointerEvents: "none" }}
        />
      )}
    </div>
  );
}

export function WorkGalleryWindow() {
  const isMobile = useIsMobile();
  const { openQuickLook } = useQuickLook();

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(3, 1fr)",
        gap: isMobile ? "12px" : "16px",
      }}
    >
      {videoItems.map((item) => {
        const image = isImage(item.src);
        return (
          <div
            key={item.src}
            onClick={() => openQuickLook({ src: item.src, alt: item.name, type: image ? "image" : "video" })}
            style={{
              aspectRatio: "16 / 10",
              borderRadius: "12px",
              overflow: "hidden",
              background: "#1a1a1a",
              cursor: "pointer",
            }}
          >
            {image ? (
              <img
                src={item.src}
                alt={item.name}
                loading="lazy"
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", pointerEvents: "none" }}
              />
            ) : (
              <LazyVideoThumb src={item.src} />
            )}
          </div>
        );
      })}
    </div>
  );
}

import React, { useState } from "react";
import { MousePointerClick, ExternalLink, AlertCircle } from "lucide-react";
import { useIsMobile } from "../../hooks/useIsMobile";
import { useTheme } from "../../hooks/useTheme";
import type { ThemeTokens } from "../../hooks/useTheme";
const isLight = (t: ThemeTokens) => t.mode !== "dark" && t.mode !== "hailmary";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import {
  ProjectHeader,
  ImageWell,
  SectionRule,
  InfoPanel,
  PropRow,
} from "./ProjectLayout";

export function PerpetualTradingWindow() {
  const isMobile = useIsMobile();
  const { theme } = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const prototypeUrl = "https://media-guard-40110023.figma.site/";

  return (
    <div
      className="overflow-auto"
      style={{
        background: theme.windowContentBg,
        height: "100%",
        fontFamily: "'IBM Plex Sans', sans-serif",
      }}
    >
      <ProjectHeader
        title="Perpetual Trading"
        company="Crypto.com"
        description="Simplifies complex perpetual futures trading into a clean, intuitive mobile experience. Lets users set leverage, manage risk with TP/SL, and execute trades confidently without the clutter of traditional trading platforms."
        tags={["Trading", "WEB3 Application", "Mobile Application", "Interactive Prototype"]}
        theme={theme}
      />

      <div className="flex flex-col gap-4" style={{ padding: "16px 16px 24px" }}>
        <div
          style={{
            display: isMobile ? "flex" : "grid",
            gridTemplateColumns: "1fr 1fr",
            flexDirection: "column",
            minHeight: isMobile ? undefined : "320px",
            gap: "8px",
          }}
        >
          <ImageWell
            theme={theme}
            style={isMobile ? { minHeight: "320px", background: isLight(theme) ? "#E0E0E0" : "#2A2A2A", flexDirection: "column", display: "flex", alignItems: "center", justifyContent: "center" } : { background: isLight(theme) ? "#E0E0E0" : "#2A2A2A", flexDirection: "column", display: "flex", alignItems: "center", justifyContent: "center" }}
            padding="16px 24px"
          >
            
            
            {/* Iframe Container */}
            <div
              style={{
                position: "relative",
                width: "300px",
                height: "530px",
                borderRadius: "24px",
                overflow: "hidden",
                background: isLight(theme) ? "#FFFFFF" : "#1A1A1A",
                border: `1px solid ${isLight(theme) ? "#E0E0E0" : "#3A3A3A"}`,
              }}
            >
              {/* Loading State */}
              {isLoading && !hasError && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "12px",
                    background: isLight(theme) ? "#F5F5F5" : "#1A1A1A",
                    zIndex: 10,
                  }}
                >
                  <div
                    className="animate-spin rounded-full border-2 border-t-transparent"
                    style={{
                      width: "24px",
                      height: "24px",
                      borderColor: isLight(theme) ? "#CCCCCC" : "#444444",
                      borderTopColor: "transparent",
                    }}
                  />
                  <div
                    style={{
                      fontSize: "10px",
                      color: theme.textMuted,
                      fontFamily: "'IBM Plex Mono', monospace",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Loading...
                  </div>
                </div>
              )}

              {/* Error State */}
              {hasError && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "12px",
                    background: isLight(theme) ? "#F5F5F5" : "#1A1A1A",
                    zIndex: 10,
                    padding: "24px",
                  }}
                >
                  <AlertCircle size={32} color={isLight(theme) ? "#FF6B6B" : "#FF8787"} />
                  <div
                    style={{
                      fontSize: "11px",
                      color: theme.text,
                      fontWeight: 600,
                      textAlign: "center",
                    }}
                  >
                    Unable to load
                  </div>
                  <a
                    href={prototypeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "8px 12px",
                      background: isLight(theme) ? "#0066FF" : "#3B82F6",
                      color: "white",
                      borderRadius: "6px",
                      fontSize: "10px",
                      fontFamily: "'IBM Plex Mono', monospace",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      textDecoration: "none",
                      fontWeight: 600,
                    }}
                  >
                    <span>Open Externally</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              )}

              {/* Iframe */}
              <iframe
                src={prototypeUrl}
                title="Perpetual Trading Prototype"
                style={{
                  width: "100%",
                  height: "100%",
                  border: "none",
                  display: hasError ? "none" : "block",
                }}
                onLoad={() => {
                  setIsLoading(false);
                  setHasError(false);
                }}
                onError={() => {
                  setIsLoading(false);
                  setHasError(true);
                }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-modals"
              />
            </div>
          </ImageWell>
          <div className="flex flex-col gap-2">
            <PropRow
              label="Mission"
              value="To simplify perpetual futures trading for mobile users by stripping away unnecessary complexity and focusing on the core trading actions."
              theme={theme}
            />
            <PropRow
              label="Problem"
              value="Existing perpetual trading interfaces are dense and intimidating — overloaded with charts, order books, and settings that overwhelm users who just want to open a position quickly."
              theme={theme}
            />
            <PropRow
              label="Solution"
              value="A streamlined mobile-first trading flow with clear leverage controls, integrated TP/SL management, and a single-tap execution that keeps the experience fast and confident."
              theme={theme}
            />
            <PropRow
              label="Outcome"
              value="Became one of the most-used features on the Crypto.com app. Traders could open leveraged positions in seconds — complex enough for professionals, approachable enough for first-timers."
              theme={theme}
            />
          </div>
        </div>

        <SectionRule label="Challenges" theme={theme} />

        <div
          style={{
            display: isMobile ? "flex" : "grid",
            gridTemplateColumns: "1fr 1fr",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          <InfoPanel title="Information Hierarchy" theme={theme}>
            Perpetual trading requires surfacing a large amount of real-time data — mark price, funding rate, liquidation price, margin ratio — without overwhelming the user. Finding the right balance between "enough info to trade confidently" and "too much noise" took multiple rounds of testing and iteration.
            <div style={{ marginTop: "12px", borderRadius: "8px", overflow: "hidden" }}>
              <ImageWithFallback
                src="https://i.imgur.com/HohOoum.png"
                alt="Information Hierarchy design"
                style={{ width: "100%", height: "auto", display: "block", borderRadius: "8px" }}
              />
            </div>
          </InfoPanel>
          <InfoPanel title="Leverage UX" theme={theme}>
            Leverage is the most powerful (and dangerous) control in perp trading. We needed to make it easy to adjust while communicating the amplified risk clearly. A slider felt intuitive but made it too easy to max out, so we paired it with explicit liquidation price feedback.
            <div style={{ marginTop: "12px", borderRadius: "8px", overflow: "hidden" }}>
              <ImageWithFallback
                src="https://i.imgur.com/pD8iYzO.png"
                alt="Leverage UX design"
                style={{ width: "100%", height: "auto", display: "block", borderRadius: "8px" }}
              />
            </div>
          </InfoPanel>
        </div>

        <div
          style={{
            display: isMobile ? "flex" : "grid",
            gridTemplateColumns: "1fr 1fr",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          <InfoPanel title="TP/SL Complexity" theme={theme}>
            Take-Profit and Stop-Loss are essential for risk management, but most platforms bury them in separate modals or post-trade settings. Integrating them inline without cluttering the order form was a significant layout challenge.
            <div style={{ marginTop: "12px", borderRadius: "8px", overflow: "hidden" }}>
              <ImageWithFallback
                src="https://i.imgur.com/m3dmz7T.png"
                alt="TP/SL design"
                style={{ width: "100%", height: "auto", display: "block", borderRadius: "8px" }}
              />
            </div>
          </InfoPanel>
          <InfoPanel title="Cross-Platform Parity" theme={theme}>
            Professional traders expect desktop-grade functionality on mobile. Translating complex order types, position management, and real-time P&L tracking into a thumb-friendly interface required rethinking traditional trading patterns from scratch.
            <div style={{ marginTop: "12px", borderRadius: "8px", overflow: "hidden" }}>
              <ImageWithFallback
                src="https://i.imgur.com/h0ahqvX.png"
                alt="Cross-Platform Parity design"
                style={{ width: "100%", height: "auto", display: "block", borderRadius: "8px" }}
              />
            </div>
          </InfoPanel>
        </div>
      </div>
    </div>
  );
}
import React from "react";

interface Props {
  fallback?: React.ReactNode;
  children: React.ReactNode;
  /**
   * When true, renders a compact in-window error state rather than a
   * full-viewport takeover. Use this for per-window boundaries so a single
   * broken window never crashes the whole desktop.
   */
  inline?: boolean;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

// React 18 throws this as an Error (to the nearest ErrorBoundary) when a
// component suspends during a synchronous render pass — even if the suspension
// is inside a <Suspense> boundary. This happens in environments (like the
// Figma Make preview) where all renders are treated as synchronous regardless
// of startTransition. We must NOT treat it as a fatal content failure; Suspense
// will handle the retry automatically once the lazy module resolves.
const SUSPENSION_WARNING =
  "A component suspended while responding to synchronous input.";

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, errorMessage: "" };
  }

  static getDerivedStateFromError(error: unknown): State {
    const msg =
      error instanceof Error ? error.message : String(error ?? "Unknown error");

    // Swallow React's own suspension-timing warning.
    // Suspense will display its fallback and retry when the module is ready —
    // we just must not replace the window content with an error UI here.
    if (msg.includes(SUSPENSION_WARNING)) {
      return { hasError: false, errorMessage: "" };
    }

    return { hasError: true, errorMessage: msg };
  }

  componentDidCatch(error: unknown, info: React.ErrorInfo) {
    const msg =
      error instanceof Error ? error.message : String(error ?? "Unknown error");
    // Skip noisy Figma/suspension warnings in the console
    if (msg.includes(SUSPENSION_WARNING)) return;
    console.error("[ErrorBoundary] Caught render error:", error, info);
  }

  reset = () => this.setState({ hasError: false, errorMessage: "" });

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      // ── Inline: contained inside a window ────────────────────────────
      if (this.props.inline) {
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              minHeight: "80px",
              padding: "16px",
              gap: "8px",
              fontFamily: "'IBM Plex Mono', monospace",
              textAlign: "center",
            }}
          >
            <span style={{ fontSize: "18px" }}>⚠️</span>
            <span style={{ fontSize: "11px", color: "#888" }}>
              This window failed to render.
            </span>
            {this.state.errorMessage && (
              <span
                style={{
                  fontSize: "9px",
                  color: "#aaa",
                  maxWidth: "260px",
                  wordBreak: "break-word",
                  opacity: 0.7,
                }}
              >
                {this.state.errorMessage}
              </span>
            )}
            <button
              onClick={this.reset}
              style={{
                marginTop: "4px",
                padding: "4px 12px",
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: "10px",
                cursor: "pointer",
                border: "1px solid #888",
                borderRadius: "3px",
                background: "transparent",
                color: "#888",
              }}
            >
              Retry
            </button>
          </div>
        );
      }

      // ── Full-page fallback (top-level boundary) ───────────────────────
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            width: "100vw",
            padding: "24px",
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: "11px",
            color: "#888",
            textAlign: "center",
            gap: "12px",
            background: "#f5f5f5",
          }}
        >
          <span style={{ fontSize: "24px" }}>⚠️</span>
          <div>Something went wrong.</div>
          {this.state.errorMessage && (
            <div
              style={{
                fontSize: "9px",
                color: "#aaa",
                maxWidth: "340px",
                wordBreak: "break-word",
                opacity: 0.7,
              }}
            >
              {this.state.errorMessage}
            </div>
          )}
          <button
            onClick={this.reset}
            style={{
              padding: "6px 16px",
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: "11px",
              cursor: "pointer",
              border: "1px solid #888",
              borderRadius: "3px",
              background: "transparent",
              color: "#666",
            }}
          >
            Reload app
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

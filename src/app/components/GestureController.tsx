import React, { useState } from "react";
import { useHandTracking } from "../hooks/useHandTracking";
import { useGestureRecognition } from "../hooks/useGestureRecognition";
import { VirtualCursor } from "./VirtualCursor";
import { CameraPip } from "./CameraPip";
import { HandTrackingOverlay } from "./HandTrackingOverlay";
import { GestureConfigPanel } from "./GestureConfigPanel";

interface GestureControllerProps {
  onAction: (action: string) => void;
}

export function GestureController({ onAction }: GestureControllerProps) {
  const [configOpen, setConfigOpen] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  const { landmarks, isLoading, error, videoRef, canvasRef } = useHandTracking(true, retryKey);

  const { gesture, cursorPos, dwellProgress, isPalmDragging, config, setConfig } =
    useGestureRecognition(landmarks, onAction);

  const hasHand = landmarks !== null && landmarks.length > 0;

  return (
    <>
      <HandTrackingOverlay canvasRef={canvasRef} />

      <VirtualCursor
        x={cursorPos.x}
        y={cursorPos.y}
        dwellProgress={dwellProgress}
        isPalmDragging={isPalmDragging}
      />

      <CameraPip
        videoRef={videoRef}
        isLoading={isLoading}
        error={error}
        hasHand={hasHand}
        onOpenConfig={() => setConfigOpen(true)}
        onRetry={() => setRetryKey(k => k + 1)}
      />

      {configOpen && (
        <GestureConfigPanel
          config={config}
          currentGesture={gesture}
          onConfigChange={setConfig}
          onClose={() => setConfigOpen(false)}
        />
      )}
    </>
  );
}

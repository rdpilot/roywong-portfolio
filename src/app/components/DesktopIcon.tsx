import React, { useRef, useState } from "react";
import { FileText, FolderOpen, User, Type, Box, Gamepad2, Globe, Coins, TrendingUp, FlaskConical, MessageSquare, Wallet, Palette } from "lucide-react";
import { useTheme } from "../hooks/useTheme";

interface DesktopIconProps {
  label: string;
  icon: string;
  company?: string;
  onClick: () => void;
  isOpen: boolean;
  desc?: string;
}

const iconKeys = ["about", "workGallery", "asciiTool", "texttura", "polytrace", "minecraftVoxelizer", "orbwarp", "wavetype", "sprayAndPray", "degenArcade", "comicCon", "perpetualTrading", "uTest"] as const;

const iconComponents: Record<string, React.ComponentType<{ size: number; color?: string }>> = {
  about: User,
  workGallery: FolderOpen,
  asciiTool: Box,
  texttura: Type,
  polytrace: Box,
  minecraftVoxelizer: Box,
  orbwarp: Box,
  wavetype: Type,
  sprayAndPray: Coins,
  degenArcade: Gamepad2,
  comicCon: Globe,
  perpetualTrading: TrendingUp,
  protoComments: MessageSquare,
  deFiWallet: Wallet,
  colorMatch: Palette,
  uTest: FlaskConical,
};

export function DesktopIcon({ label, icon, company, onClick, isOpen, desc }: DesktopIconProps) {
  const { theme } = useTheme();
  const IconComponent = iconComponents[icon] || FileText;
  const ref = useRef<HTMLButtonElement>(null);
  const [hovered, setHovered] = useState(false);
  const [previewTop, setPreviewTop] = useState(0);

  return (
    <div style={{ position: "relative" }}>
      <button
        ref={ref}
        onClick={onClick}
        className="flex items-center gap-2 px-1 py-0.5 rounded transition-colors text-left group cursor-pointer"
        style={{ backgroundColor: "transparent" }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = theme.iconHoverBg;
          if (desc && ref.current) {
            setPreviewTop(ref.current.getBoundingClientRect().top);
          }
          setHovered(true);
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "transparent";
          setHovered(false);
        }}
      >
        <span className="w-4 h-4 flex items-center justify-center">
          {isOpen ? (
            <span
              className="w-2 h-2 rounded-full"
              style={{
                background: theme.iconActiveColor,
                border: `1px solid ${theme.iconActiveBorder}`,
                boxShadow: `0 0 4px ${theme.iconActiveGlow}`,
              }}
            />
          ) : (
            <IconComponent size={16} color={theme.iconColor} />
          )}
        </span>
        <span
          className="transition-colors"
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: "13px",
            color: theme.textPrimary,
            textShadow: theme.iconTextShadow,
          }}
        >
          {label}
        </span>
      </button>

      {hovered && desc && (
        <div
          style={{
            position: "fixed",
            left: "196px",
            top: previewTop,
            zIndex: 99999,
            pointerEvents: "none",
            background: theme.mode === "dark" || theme.mode === "hailmary" ? "rgba(24,26,30,0.96)" : "rgba(255,255,255,0.96)",
            border: `1px solid ${theme.windowBorder}`,
            borderRadius: "6px",
            padding: "6px 10px",
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: "11px",
            color: theme.textSecondary,
            whiteSpace: "nowrap",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}
        >
          {desc}
        </div>
      )}
    </div>
  );
}
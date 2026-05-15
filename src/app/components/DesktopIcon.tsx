import React, { useRef, useState } from "react";
import { FileText, FolderOpen, User, Type, Box, Gamepad2, Globe, Coins, TrendingUp, FlaskConical, MessageSquare, Wallet } from "lucide-react";
import { useTheme } from "../hooks/useTheme";

interface PreviewData {
  stat?: string;
  desc: string;
  image?: string;
}

interface DesktopIconProps {
  label: string;
  icon: string;
  company?: string;
  onClick: () => void;
  isOpen: boolean;
  preview?: PreviewData;
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
  uTest: FlaskConical,
};

export function DesktopIcon({ label, icon, company, onClick, isOpen, preview }: DesktopIconProps) {
  const { theme } = useTheme();
  const IconComponent = iconComponents[icon] || FileText;
  const ref = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);
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
          setIsHovered(true);
          if (preview && ref.current) {
            const rect = ref.current.getBoundingClientRect();
            setPreviewTop(rect.top);
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "transparent";
          setIsHovered(false);
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
      {isHovered && preview && (
        <div
          style={{
            position: "fixed",
            left: "200px",
            top: previewTop,
            width: "220px",
            zIndex: 99999,
            background: theme.mode === "dark" || theme.mode === "hailmary" ? "#1e2025" : "#fff",
            border: `1px solid ${theme.windowBorder}`,
            borderRadius: "8px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
            overflow: "hidden",
            pointerEvents: "none",
            fontFamily: "'IBM Plex Mono', monospace",
          }}
        >
          {preview.image && (
            <div style={{ width: "100%", height: "100px", overflow: "hidden", background: "#111" }}>
              <img src={preview.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          )}
          <div style={{ padding: "10px 12px" }}>
            {preview.stat && (
              <div style={{ fontSize: "16px", fontWeight: 700, color: theme.textPrimary, marginBottom: "4px" }}>
                {preview.stat}
              </div>
            )}
            <div style={{ fontSize: "11px", color: theme.textSecondary, lineHeight: 1.5 }}>
              {preview.desc}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
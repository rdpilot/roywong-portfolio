import React from "react";
import { FileText, FolderOpen, User, Type, Box, Gamepad2, Globe, Coins, TrendingUp, FlaskConical } from "lucide-react";
import { useTheme } from "../hooks/useTheme";

interface DesktopIconProps {
  label: string;
  icon: string;
  onClick: () => void;
  isOpen: boolean;
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
  uTest: FlaskConical,
};

export function DesktopIcon({ label, icon, onClick, isOpen }: DesktopIconProps) {
  const { theme } = useTheme();
  const IconComponent = iconComponents[icon] || FileText;

  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-1 py-0.5 rounded transition-colors text-left group cursor-pointer"
      style={{ backgroundColor: "transparent" }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = theme.iconHoverBg)}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
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
  );
}
import React from "react";
import { useIsMobile } from "../../hooks/useIsMobile";
import { useTheme } from "../../hooks/useTheme";
import { useQuickLook } from "../QuickLookOverlay";
import { AutoPlayVideo } from "../AutoPlayVideo";
import {
  ProjectHeader,
  ImageWell,
  SectionRule,
} from "./ProjectLayout";

import imgHero from "figma:asset/eebe82d4f3da27bfa7c452b08a28052a8c80f476.png";
import imgMobileFrame from "figma:asset/674e629a004b9a4e8e1c52ffb643abe9c50490b3.png";
import imgMarketplace from "figma:asset/c3f1496eaf26bea9657897de7673b3517dda02fb.png";
import imgArtDetail from "figma:asset/ae14c6decc018229e9db03174c95f04337694232.png";
import imgMacBook from "figma:asset/f85d894ad6e8fcae4186daa21d21d0808cb57497.png";

export function ComicConWindow() {
  const isMobile = useIsMobile();
  const { theme } = useTheme();
  const { openQuickLook } = useQuickLook();

  const ql = (src: string, alt: string, type: "image" | "video" = "image") =>
    () => openQuickLook({ src, alt, type });

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
        title="0n1 Force ComicCon Landing Page"
        company="0n1 FORCE"
        description="Worked with 0n1 FORCE on a comic-con website and their official website revamp."
        tags={["Landing Page", "Dashboard", "WEB3 Project"]}
        theme={theme}
      />

      <div className="flex flex-col gap-4" style={{ padding: "16px 16px 24px" }}>
        <ImageWell theme={theme} aspectRatio="16/11" padding="0" onClick={ql(imgHero, "0n1 FORCE Artwork")}>
          <img
            src={imgHero}
            alt="0n1 FORCE anime-style character artwork for ComicCon landing page"
            loading="lazy"
            style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", display: "block" }}
          />
        </ImageWell>

        <SectionRule label="Comics Reader" theme={theme} />

        <ImageWell theme={theme} aspectRatio="16/10" padding="24px" onClick={ql("https://i.imgur.com/8HIhBIv.mp4", "Comics Reader", "video")}>
          <AutoPlayVideo
            src="https://i.imgur.com/8HIhBIv.mp4"
            style={{ maxWidth: "85%", maxHeight: "100%", objectFit: "contain" }}
          />
        </ImageWell>

        <SectionRule label="NFT Gallery" theme={theme} />

        <div style={{ display: isMobile ? "flex" : "grid", gridTemplateColumns: "1fr 1fr", flexDirection: "column", height: isMobile ? undefined : "280px", gap: "8px" }}>
          <ImageWell theme={theme} padding="16px" style={isMobile ? { minHeight: "280px" } : undefined} onClick={ql("https://i.imgur.com/s0quD32.mp4", "Collection View", "video")}>
            <AutoPlayVideo
              src="https://i.imgur.com/s0quD32.mp4"
              style={{ maxWidth: "100%", maxHeight: isMobile ? "260px" : "100%", objectFit: "contain" }}
            />
          </ImageWell>
          <ImageWell theme={theme} style={isMobile ? { minHeight: "280px" } : undefined} onClick={ql(imgMobileFrame, "Mobile View")}>
            <img src={imgMobileFrame} alt="0n1 FORCE NFT gallery mobile responsive layout with card grid" loading="lazy" style={{ height: isMobile ? undefined : "90%", maxHeight: isMobile ? "260px" : undefined, width: isMobile ? "auto" : undefined, objectFit: "contain" }} />
          </ImageWell>
        </div>

        <ImageWell theme={theme} aspectRatio="16/10" padding="24px" onClick={ql(imgMarketplace, "Marketplace")}>
          <img src={imgMarketplace} alt="0n1 FORCE NFT marketplace interface showing collection listings and filters" loading="lazy" style={{ maxWidth: "85%", maxHeight: "100%", objectFit: "contain" }} />
        </ImageWell>

        <ImageWell theme={theme} aspectRatio="16/10" padding="24px" onClick={ql("https://i.imgur.com/ryvn6R9.mp4", "NFT Detail View", "video")}>
          <AutoPlayVideo
            src="https://i.imgur.com/ryvn6R9.mp4"
            style={{ maxWidth: "85%", maxHeight: "100%", objectFit: "contain" }}
          />
        </ImageWell>

        <ImageWell theme={theme} aspectRatio="16/10" padding="24px" onClick={ql(imgArtDetail, "Art Detail")}>
          <img src={imgArtDetail} alt="0n1 FORCE individual NFT art detail view with traits and metadata" loading="lazy" style={{ maxWidth: "85%", maxHeight: "100%", objectFit: "contain" }} />
        </ImageWell>

        <ImageWell theme={theme} aspectRatio="16/10" padding="24px" onClick={ql(imgMacBook, "Device Preview")}>
          <img src={imgMacBook} alt="0n1 FORCE website rendered on MacBook showing full desktop experience" loading="lazy" style={{ maxWidth: "85%", maxHeight: "100%", objectFit: "contain" }} />
        </ImageWell>
      </div>
    </div>
  );
}
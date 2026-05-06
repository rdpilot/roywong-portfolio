/**
 * URL route configuration for SEO-friendly project URLs
 * Maps URL paths to window IDs
 */

export type WindowId =
  | "about"
  | "workGallery"
  | "asciiTool"
  | "texttura"
  | "polytrace"
  | "minecraftVoxelizer"
  | "orbwarp"
  | "wavetype"
  | "sprayAndPray"
  | "degenArcade"
  | "comicCon"
  | "perpetualTrading";

/**
 * Maps URL paths to window IDs for routing
 * Example: /projects/spray-and-pray -> "sprayAndPray"
 */
export const routeToWindow: Record<string, WindowId> = {
  // Home/default windows (no path needed)
  "/": "about",
  "/about": "about",
  "/gallery": "workGallery",
  
  // UI/UX Projects
  "/projects/spray-and-pray": "sprayAndPray",
  "/projects/perpetual-trading": "perpetualTrading",
  "/projects/degen-arcade": "degenArcade",
  "/projects/comiccon": "comicCon",
  // Interactive Experiments
  "/tools/ascii": "asciiTool",
  "/tools/texttura": "texttura",
  "/tools/polytrace": "polytrace",
  "/tools/minecraft-voxelizer": "minecraftVoxelizer",
  "/tools/orbwarp": "orbwarp",
  "/tools/wavetype": "wavetype",
};

/**
 * Reverse mapping: window ID to canonical URL path
 */
export const windowToRoute: Record<WindowId, string> = {
  about: "/about",
  workGallery: "/gallery",
  sprayAndPray: "/projects/spray-and-pray",
  perpetualTrading: "/projects/perpetual-trading",
  degenArcade: "/projects/degen-arcade",
  comicCon: "/projects/comiccon",
  asciiTool: "/tools/ascii",
  texttura: "/tools/texttura",
  polytrace: "/tools/polytrace",
  minecraftVoxelizer: "/tools/minecraft-voxelizer",
  orbwarp: "/tools/orbwarp",
  wavetype: "/tools/wavetype",
};

/**
 * Get the SEO-friendly title for a given window ID
 */
export const getPageTitle = (windowId: WindowId | null): string => {
  const titles: Record<WindowId, string> = {
    about: "About Me - Roy Wong | Product Designer",
    workGallery: "Gallery - Roy Wong | Product Designer",
    sprayAndPray: "Spray & Pray - UI/UX Case Study | Roy Wong",
    perpetualTrading: "Perpetual Trading - UI/UX Case Study | Roy Wong",
    degenArcade: "Degen Arcade - UI/UX Case Study | Roy Wong",
    comicCon: "0n1 Force ComicCon - UI/UX Case Study | Roy Wong",
    asciiTool: "ASCII Effect 3D Tool | Roy Wong",
    texttura: "Texttura - Typography Tool | Roy Wong",
    polytrace: "Polytrace - Creative Tool | Roy Wong",
    minecraftVoxelizer: "Minecraft Voxelizer | Roy Wong",
    orbwarp: "Orbwarp - Interactive Tool | Roy Wong",
    wavetype: "Wavetype - Typography Tool | Roy Wong",
  };
  
  return windowId ? titles[windowId] : "Roy Wong - Product Designer | UI/UX Portfolio";
};

/**
 * Get the meta description for a given window ID
 */
export const getPageDescription = (windowId: WindowId | null): string => {
  const descriptions: Record<WindowId, string> = {
    about: "Roy Wong is a senior product designer with 9 years of experience at Crypto.com and Animoca Brands, specializing in fintech, Web3, and consumer mobile. Based in Hong Kong.",
    workGallery: "Browse Roy Wong's portfolio gallery of UI/UX projects, crypto wallet designs, trading platforms, and creative web applications.",
    sprayAndPray: "Spray & Pray — UI/UX case study by Roy Wong. Tournament-based gaming platform design featuring leaderboards, stats, and competitive gameplay interfaces.",
    perpetualTrading: "Perpetual Trading — UI/UX case study by Roy Wong. Crypto perpetual trading platform design with advanced charting, order flows, and risk management interfaces.",
    degenArcade: "Degen Arcade — UI/UX case study by Roy Wong. Web3 gaming arcade interface design featuring game lobbies, NFT integration, and reward systems.",
    comicCon: "0n1 Force ComicCon — UI/UX case study by Roy Wong. Event experience design for a ComicCon activation blending physical and digital worlds.",
    asciiTool: "ASCII Effect 3D Tool — Interactive web application by Roy Wong. Transform 3D models into real-time ASCII art renderings in the browser.",
    texttura: "Texttura — Interactive typography tool by Roy Wong. Create textured, layered type compositions with real-time visual controls.",
    polytrace: "Polytrace — Creative polygon tracing tool by Roy Wong. Generate low-poly art from images with adjustable triangle density and color sampling.",
    minecraftVoxelizer: "Minecraft Voxelizer — Interactive tool by Roy Wong. Convert images into Minecraft-style voxel block art with customizable palettes.",
    orbwarp: "Orbwarp — Interactive orbital warping effect tool by Roy Wong. Create mesmerizing animated orb distortions with shader-based effects.",
    wavetype: "Wavetype — Wave-based typography tool by Roy Wong. Animate text along sine-wave paths with adjustable frequency, amplitude, and speed.",
  };
  
  return windowId 
    ? descriptions[windowId] 
    : "Product designer portfolio featuring UI/UX projects including Spray & Pray, Perpetual Trading, Degen Arcade, and creative interactive experiments.";
};
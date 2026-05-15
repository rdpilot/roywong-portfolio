import React from "react";
import { useIsMobile } from "../../hooks/useIsMobile";
import { useTheme } from "../../hooks/useTheme";
import type { ThemeTokens } from "../../hooks/useTheme";
import { useQuickLook } from "../QuickLookOverlay";
import {
  ProjectHeader,
  ImageWell,
  SectionRule,
  InfoPanel,
  PropRow,
} from "./ProjectLayout";

const isLight = (t: ThemeTokens) => t.mode !== "dark" && t.mode !== "hailmary";

function StatBlock({
  theme,
  stats,
}: {
  theme: ThemeTokens;
  stats: { value: string; label: string; highlight?: boolean }[];
}) {
  return (
    <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
      {stats.map((s, i) => (
        <div key={i}>
          <div
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: "22px",
              fontWeight: 600,
              color: s.highlight
                ? isLight(theme) ? "#007AFF" : "#0A84FF"
                : theme.textPrimary,
              lineHeight: 1.2,
            }}
          >
            {s.value}
          </div>
          <div
            style={{
              fontSize: "11px",
              color: theme.textMuted,
              fontFamily: "'IBM Plex Mono', monospace",
              marginTop: "2px",
            }}
          >
            {s.label}
          </div>
        </div>
      ))}
    </div>
  );
}

function QuoteCard({
  theme,
  children,
  color = "green",
}: {
  theme: ThemeTokens;
  children: React.ReactNode;
  color?: "green" | "pink" | "purple";
}) {
  const colors = {
    green:  isLight(theme) ? "#d4f5e9" : "#1a3d2e",
    pink:   isLight(theme) ? "#fde8e8" : "#3d1a1a",
    purple: isLight(theme) ? "#ede8fd" : "#2a1a3d",
  };
  const textColors = {
    green:  isLight(theme) ? "#0a5c38" : "#4ade80",
    pink:   isLight(theme) ? "#7c1d1d" : "#f87171",
    purple: isLight(theme) ? "#4c1d95" : "#c084fc",
  };
  return (
    <div
      style={{
        background: colors[color],
        borderRadius: "2px",
        padding: "12px 14px",
        fontSize: "12px",
        lineHeight: "1.6",
        color: textColors[color],
        fontFamily: "'IBM Plex Sans', sans-serif",
        fontStyle: "italic",
      }}
    >
      {children}
    </div>
  );
}

export function DeFiWalletWindow() {
  const isMobile = useIsMobile();
  const { theme } = useTheme();
  const { openQuickLook } = useQuickLook();

  const ql = (src: string, alt: string) => () =>
    openQuickLook({ src, alt, type: "image" });

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
        title="DeFi Wallet Onboarding"
        company="Crypto.com"
        description="After FTX collapsed, downloads spiked 300% but wallet creation barely moved. We ran research to find out why, redesigned the flow, and doubled creation rate. Then found the next problem."
        tags={["Mobile Application", "UX Research", "Onboarding", "Web3"]}
        theme={theme}
      />

      <div className="flex flex-col gap-4" style={{ padding: "16px 16px 24px" }}>

        {/* Headline stats */}
        <div
          style={{
            padding: "16px",
            background: isLight(theme) ? "#F5F5F5" : "#1a1e24",
            border: `1px solid ${isLight(theme) ? "#E0E0E0" : "#2a2e34"}`,
            borderRadius: "2px",
          }}
        >
          <div
            style={{
              fontSize: "11px",
              color: theme.textMuted,
              fontFamily: "'IBM Plex Mono', monospace",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              marginBottom: "12px",
            }}
          >
            The question
          </div>
          <div
            style={{
              fontSize: "13px",
              color: theme.textPrimary,
              lineHeight: "1.7",
              marginBottom: "16px",
            }}
          >
            Why did a 300% download spike only convert 12% more wallets?
          </div>
          <StatBlock
            theme={theme}
            stats={[
              { value: "↑ 300%", label: "Download rate" },
              { value: "↑ 12%", label: "Wallet creation rate" },
            ]}
          />
        </div>

        <SectionRule label="Research" theme={theme} />

        <div
          style={{
            display: isMobile ? "flex" : "grid",
            gridTemplateColumns: "1fr 1fr",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          <InfoPanel title="Setup" theme={theme}>
            10 participants — current users and crypto-curious non-users. Surveys plus 1-on-1 interviews to understand where and why people dropped off during wallet creation.
          </InfoPanel>
          <InfoPanel title="My role" theme={theme}>
            Built the prototype, ran card-sorting sessions, translated insights into design decisions. Research to shipped redesign in one cycle.
          </InfoPanel>
        </div>

        <ImageWell theme={theme} onClick={ql("/defi-wallet/research-notes.png", "Affinity map from research sessions")}>
          <img
            src="/defi-wallet/research-notes.png"
            alt="Affinity map from research sessions showing clustered user insights"
            style={{ width: "100%", height: "auto", display: "block" }}
          />
        </ImageWell>

        <SectionRule label="Insights" theme={theme} />

        {/* Insight 1 */}
        <InfoPanel title="01  Users needed a reason to create a wallet" theme={theme}>
          Downloads from FTX anxiety didn't convert because anxiety isn't a use case. Users who did create wallets had a concrete reason first: an NFT to buy, a yield farm to join, a friend earning in Axie.
        </InfoPanel>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <QuoteCard theme={theme} color="green">"I saw the insane APY on VVS Finance, which is the first DApp that I got in"</QuoteCard>
          <QuoteCard theme={theme} color="green">"I joined Web3 because of pay2earn. I saw my friend make a fortune in Axie"</QuoteCard>
          <QuoteCard theme={theme} color="green">"I was looking to get my first NFT"</QuoteCard>
        </div>

        {/* Insight 2 */}
        <InfoPanel title="02  Fund size dictates how seriously users back up" theme={theme}>
          Small balances live on Dropbox or a screenshot. Big balances get a Ledger. Users don't apply uniform security — they scale it to what's at stake.
        </InfoPanel>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <QuoteCard theme={theme} color="pink">"For the ease of use, any wallet with less than 5k, I backup on Dropbox"</QuoteCard>
          <QuoteCard theme={theme} color="pink">"I have my Ledger as well as my hot wallets. Ledger is for long term holding and bigger fund"</QuoteCard>
        </div>

        {/* Insight 3 */}
        <InfoPanel title="03  Recovery phrases were the biggest friction point" theme={theme}>
          "Too much of a chore." "I don't know where to put it." Users either skipped backup entirely or relied on YouTube tutorials and friends. The 12-word seed phrase was the moment most people quit.
        </InfoPanel>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <QuoteCard theme={theme} color="purple">"I watch walkthrough video from some crypto influencer, or get help from my friends"</QuoteCard>
          <QuoteCard theme={theme} color="purple">"Too much of a chore of writing it down and put it somewhere safe"</QuoteCard>
        </div>

        <SectionRule label="The old flow" theme={theme} />

        <InfoPanel theme={theme}>
          The existing onboarding assumed everyone needed maximum security from day one. An educational walkthrough, forced memorization, security tips — 12 taps just to reveal the recovery phrase. Most users quit here.
        </InfoPanel>

        <ImageWell theme={theme} onClick={ql("/defi-wallet/wallet-old-flow.png", "Old onboarding flow — 12 taps to reveal recovery phrase")}>
          <img
            src="/defi-wallet/wallet-old-flow.png"
            alt="Old onboarding flow diagram showing too many steps and high drop-off points"
            style={{ width: "100%", height: "auto", display: "block" }}
          />
        </ImageWell>

        <div style={{ display: "flex", flexDirection: "column", gap: "6px", paddingLeft: "2px" }}>
          {[
            "Too many steps — high drop-off",
            "Forcing users to memorize a recovery phrase they may not care about",
            "Revealing the phrase took 12 taps",
          ].map((p, i) => (
            <div key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
              <span style={{ color: isLight(theme) ? "#FF3B30" : "#FF6961", fontFamily: "'IBM Plex Mono', monospace", fontSize: "11px", flexShrink: 0, paddingTop: "2px" }}>✕</span>
              <span style={{ fontSize: "12px", color: theme.textSecondary, lineHeight: "1.6" }}>{p}</span>
            </div>
          ))}
        </div>

        <SectionRule label="The redesign" theme={theme} />

        <div
          style={{
            display: isMobile ? "flex" : "grid",
            gridTemplateColumns: "1fr 1fr",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          <InfoPanel title="Change 1 — Simplified onboarding" theme={theme}>
            Cut the educational walkthrough and the security tips that pushed users toward "write it down or else." For most new users with small balances, the friction wasn't worth the security gain.
          </InfoPanel>
          <InfoPanel title="Change 2 — Cloud backup" theme={theme}>
            Added Drive and iCloud backup. Met users where they already store things they care about. Writing down the phrase stayed available as the higher-security option.
          </InfoPanel>
        </div>

        <ImageWell theme={theme} onClick={ql("/defi-wallet/wallet-new-flow.png", "New onboarding flow — scales security to user intent")}>
          <img
            src="/defi-wallet/wallet-new-flow.png"
            alt="New onboarding flow diagram showing streamlined path with backup options"
            style={{ width: "100%", height: "auto", display: "block" }}
          />
        </ImageWell>

        <div style={{ display: "flex", flexDirection: "column", gap: "6px", paddingLeft: "2px" }}>
          {[
            "Removed educational walkthrough",
            "Backup options screen: Drive, iCloud, or write it down",
            "All phrases on one screen (down from 12 taps)",
            "Removed forced security tips",
          ].map((p, i) => (
            <div key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
              <span style={{ color: isLight(theme) ? "#34C759" : "#30D158", fontFamily: "'IBM Plex Mono', monospace", fontSize: "11px", flexShrink: 0, paddingTop: "2px" }}>✓</span>
              <span style={{ fontSize: "12px", color: theme.textSecondary, lineHeight: "1.6" }}>{p}</span>
            </div>
          ))}
        </div>

        <SectionRule label="Results" theme={theme} />

        <div
          style={{
            padding: "16px",
            background: isLight(theme) ? "#F5F5F5" : "#1a1e24",
            border: `1px solid ${isLight(theme) ? "#E0E0E0" : "#2a2e34"}`,
            borderRadius: "2px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <StatBlock
            theme={theme}
            stats={[
              { value: "29% → 59%", label: "Wallet creation rate", highlight: true },
              { value: "70%", label: "Dead wallets (zero balance)" },
            ]}
          />
          <div style={{ fontSize: "12px", color: theme.textSecondary, lineHeight: "1.7" }}>
            Removing friction doubled wallet creation. But most wallets stayed empty — which meant we'd solved the wrong problem. Users got through onboarding, then didn't know what to do next.
          </div>
        </div>

        <SectionRule label="The next problem" theme={theme} />

        <InfoPanel theme={theme}>
          70% of new wallets had zero balance and zero transactions. Users weren't unmotivated — they were lost. The empty home screen didn't tell them what to do. So we rebuilt it.
        </InfoPanel>

        <ImageWell theme={theme} aspectRatio="16/9" onClick={ql("/defi-wallet/slide-11-solution.png", "Redesigned home screen for first-time users")}>
          <img
            src="/defi-wallet/slide-11-solution.png"
            alt="Redesigned home screen guiding new users through buy a token then deposit to earn"
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        </ImageWell>

        <InfoPanel title="A 2-step home for first-time users" theme={theme}>
          Most users created a wallet to invest in yield farming, but the empty wallet didn't tell them how. We rebuilt the home screen around two concrete actions: buy a token, then deposit it to earn.
        </InfoPanel>

        <div
          style={{
            padding: "16px",
            background: isLight(theme) ? "#F5F5F5" : "#1a1e24",
            border: `1px solid ${isLight(theme) ? "#E0E0E0" : "#2a2e34"}`,
            borderRadius: "2px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          <div
            style={{
              fontSize: "11px",
              color: theme.textMuted,
              fontFamily: "'IBM Plex Mono', monospace",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            Final result
          </div>
          <StatBlock
            theme={theme}
            stats={[
              { value: "2.41% → 9.91%", label: "First-purchase rate (Jul → Aug)", highlight: true },
            ]}
          />
          <div style={{ fontSize: "12px", color: theme.textSecondary, lineHeight: "1.7" }}>
            A small nudge — telling new users what to do next — moved first-purchase rate from 2.4% to nearly 10%. The lesson: users weren't unmotivated. They were lost.
          </div>
        </div>

        <PropRow label="Role" value="UX Research, Product Design" theme={theme} />
        <PropRow label="Company" value="Crypto.com" theme={theme} />
        <PropRow label="Platform" value="iOS and Android" theme={theme} />

      </div>
    </div>
  );
}

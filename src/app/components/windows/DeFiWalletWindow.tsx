import React from "react";
import { useIsMobile } from "../../hooks/useIsMobile";
import { useTheme } from "../../hooks/useTheme";
import { NextProject } from "../NextProject";
import type { ThemeTokens } from "../../hooks/useTheme";
import { useQuickLook } from "../QuickLookOverlay";
import {
  ProjectHeader,
  ImageWell,
  SectionRule,
  InfoPanel,
} from "./ProjectLayout";

const isLight = (t: ThemeTokens) => t.mode !== "dark" && t.mode !== "hailmary";

function QuoteGroup({
  theme,
  quotes,
  color = "green",
}: {
  theme: ThemeTokens;
  quotes: string[];
  color?: "green" | "pink" | "purple";
}) {
  const borderColors = {
    green:  isLight(theme) ? "#34C759" : "#4ade80",
    pink:   isLight(theme) ? "#FF3B30" : "#f87171",
    purple: isLight(theme) ? "#7C3AED" : "#c084fc",
  };
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      gap: "8px",
    }}>
      {quotes.map((q, i) => (
        <div key={i} style={{
          fontSize: "12px",
          lineHeight: "1.6",
          color: theme.textSecondary,
          fontFamily: "'IBM Plex Sans', sans-serif",
          fontStyle: "italic",
        }}>
          {q}
        </div>
      ))}
    </div>
  );
}

function StatCard({ theme, stat, label }: { theme: ThemeTokens; stat: string; label: string }) {
  return (
    <InfoPanel theme={theme} centered>
      <span style={{ display: "block", fontSize: 32, fontWeight: 700, color: theme.windowTitleText, fontFamily: "'IBM Plex Mono', monospace", lineHeight: 1, marginBottom: 6 }}>{stat}</span>
      <span style={{ fontSize: 11, color: theme.textMuted }}>{label}</span>
    </InfoPanel>
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

        {/* Opening hook: the gap */}
        <InfoPanel title="The question" theme={theme}>
          Why did a 300% download spike only convert 12% more wallets?
        </InfoPanel>
        <div style={{ display: isMobile ? "flex" : "grid", gridTemplateColumns: "1fr 1fr", flexDirection: "column", gap: "8px" }}>
          <StatCard theme={theme} stat="↑ 300%" label="Download rate" />
          <StatCard theme={theme} stat="↑ 12%" label="Wallet creation rate" />
        </div>

        <SectionRule label="Research" theme={theme} />

        <InfoPanel title="Objective" theme={theme}>
          Understand why users dropped off during wallet creation, and what would help them complete it.
        </InfoPanel>

        <div
          style={{
            display: isMobile ? "flex" : "grid",
            gridTemplateColumns: "1fr 1fr",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          <InfoPanel title="Setup" theme={theme}>
            10 participants: current users and crypto-curious non-users. Surveys plus 1-on-1 interviews to understand where and why people dropped off during wallet creation.
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

        <InfoPanel title="01  Users needed a reason to create a wallet" theme={theme}>
          Downloads from FTX anxiety didn't convert because anxiety isn't a use case. Users who did create wallets had a concrete reason first: an NFT to buy, a yield farm to join, a friend earning in Axie.
        </InfoPanel>
        <QuoteGroup theme={theme} color="green" quotes={[
          '"I saw the insane APY on VVS Finance, which is the first DApp that I got in"',
          '"I joined Web3 because of pay2earn. I saw my friend make a fortune in Axie"',
          '"I was looking to get my first NFT"',
        ]} />

        <InfoPanel title="02  Fund size dictates how seriously users back up" theme={theme}>
          Small balances live on Dropbox or a screenshot. Big balances get a Ledger. Users don't apply uniform security. They scale it to what's at stake.
        </InfoPanel>
        <QuoteGroup theme={theme} color="pink" quotes={[
          '"For the ease of use, any wallet with less than 5k, I backup on Dropbox"',
          '"I have my Ledger as well as my hot wallets. Ledger is for long term holding and bigger fund"',
        ]} />

        <InfoPanel title="03  Recovery phrases were the biggest friction point" theme={theme}>
          "Too much of a chore." "I don't know where to put it." Users either skipped backup entirely or relied on YouTube tutorials and friends. The 12-word seed phrase was the moment most people quit.
        </InfoPanel>
        <QuoteGroup theme={theme} color="purple" quotes={[
          '"I watch walkthrough video from some crypto influencer, or get help from my friends"',
          '"Too much of a chore of writing it down and put it somewhere safe"',
        ]} />

        <SectionRule label="The old flow" theme={theme} />

        <InfoPanel theme={theme}>
          The existing onboarding assumed everyone needed maximum security from day one. An educational walkthrough, forced memorization, security tips. 12 taps just to reveal the recovery phrase. Most users quit here.
        </InfoPanel>

        <ImageWell theme={theme} onClick={ql("/defi-wallet/wallet-old-flow.png", "Old onboarding flow, 12 taps to reveal recovery phrase")}>
          <img
            src="/defi-wallet/wallet-old-flow.png"
            alt="Old onboarding flow diagram showing too many steps and high drop-off points"
            style={{ width: "100%", height: "auto", display: "block" }}
          />
        </ImageWell>

        <div style={{ display: "flex", flexDirection: "column", gap: "6px", paddingLeft: "2px" }}>
          {[
            "Too many steps, leading to high drop-off",
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
          <InfoPanel title="Change 1: Simplified onboarding" theme={theme}>
            Cut the educational walkthrough and the security tips that pushed users toward "write it down or else." For most new users with small balances, the friction wasn't worth the security gain.
          </InfoPanel>
          <InfoPanel title="Change 2: Cloud backup" theme={theme}>
            Added Drive and iCloud backup. Met users where they already store things they care about. Writing down the phrase stayed available as the higher-security option.
          </InfoPanel>
        </div>

        <ImageWell theme={theme} onClick={ql("/defi-wallet/wallet-new-flow.png", "New onboarding flow that scales security to user intent")}>
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

        <div style={{ display: isMobile ? "flex" : "grid", gridTemplateColumns: "1fr 1fr", flexDirection: "column", gap: "8px" }}>
          <StatCard theme={theme} stat="29% → 59%" label="Wallet creation rate" />
          <StatCard theme={theme} stat="70%" label="Dead wallets (zero balance)" />
        </div>

        <InfoPanel theme={theme}>
          Removing friction doubled wallet creation. But most wallets stayed empty. We had solved the wrong problem. Users got through onboarding, then didn't know what to do next.
        </InfoPanel>

        <SectionRule label="The next problem" theme={theme} />

        <InfoPanel theme={theme}>
          70% of new wallets had zero balance and zero transactions. Users weren't unmotivated. They were lost. Most created a wallet to invest in yield farming, but the empty home screen didn't tell them how. We rebuilt it around two concrete actions.
        </InfoPanel>

        {/* Step 1 */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: "10px",
              color: isLight(theme) ? "#007AFF" : "#0A84FF",
              background: isLight(theme) ? "#E5F0FF" : "#0a1929",
              border: `1px solid ${isLight(theme) ? "#007AFF" : "#0A84FF"}`,
              borderRadius: "2px",
              padding: "2px 7px",
              flexShrink: 0,
            }}>STEP 1</span>
            <span style={{ fontSize: "12px", fontWeight: 600, color: theme.textPrimary }}>
              Buy a token
            </span>
          </div>
          <div style={{ fontSize: "12px", color: theme.textSecondary, lineHeight: "1.6" }}>
            The home screen now surfaces tokens with their APY rates and a one-tap "Get" button. New users see exactly what to buy and why. No need to find their way to a separate purchase flow.
          </div>
          <ImageWell theme={theme} onClick={ql("/defi-wallet/step1.png", "Step 1: Buy a token")}>
            <img
              src="/defi-wallet/step1.png"
              alt="Step 1: new home screen showing tokens to buy with APY rates, and the buy flow"
              style={{ width: "100%", height: "auto", display: "block" }}
            />
          </ImageWell>
        </div>

        {/* Step 2 */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: "10px",
              color: isLight(theme) ? "#007AFF" : "#0A84FF",
              background: isLight(theme) ? "#E5F0FF" : "#0a1929",
              border: `1px solid ${isLight(theme) ? "#007AFF" : "#0A84FF"}`,
              borderRadius: "2px",
              padding: "2px 7px",
              flexShrink: 0,
            }}>STEP 2</span>
            <span style={{ fontSize: "12px", fontWeight: 600, color: theme.textPrimary }}>
              Deposit into DeFi Earn
            </span>
          </div>
          <div style={{ fontSize: "12px", color: theme.textSecondary, lineHeight: "1.6" }}>
            Once step 1 is complete, the home screen updates to show available earning pools. Step 1 is marked done, step 2 is surfaced next. Users deposit, stake, and land on a confirmation screen. Their wallet is no longer empty.
          </div>
          <ImageWell theme={theme} onClick={ql("/defi-wallet/step2.png", "Step 2: Deposit into DeFi Earn")}>
            <img
              src="/defi-wallet/step2.png"
              alt="Step 2: home screen after purchase showing DeFi Earn pools and deposit flow"
              style={{ width: "100%", height: "auto", display: "block" }}
            />
          </ImageWell>
        </div>

        <SectionRule label="Final result" theme={theme} />

        <StatCard theme={theme} stat="2.41% → 9.91%" label="First-purchase rate (Jul → Aug)" />

        <InfoPanel theme={theme}>
          A small nudge (surfacing what to do next) moved first-purchase rate from 2.4% to nearly 10%. Users weren't unmotivated. They were lost.
        </InfoPanel>

        <NextProject id="sprayAndPray" label="Spray & Pray" />
      </div>
    </div>
  );
}

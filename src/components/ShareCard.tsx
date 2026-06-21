"use client";

import { useRef, useState, forwardRef, useImperativeHandle, Fragment } from "react";
import type { ReactElement } from "react";
import { QuizResult, Archetype } from "@/lib/types";

// ─── Gradient configs ───────────────────────────────────────────────────────

const GRADIENTS: Record<Archetype, { story: string; linkedin: string }> = {
  Builder: {
    story:   "linear-gradient(175deg,#C04808 0%,#D86428 22%,#E88050 48%,#F0A478 70%,#F8CAB0 85%,#FEF2E8 100%)",
    linkedin:"linear-gradient(120deg,#C04808 0%,#D86428 20%,#E88050 45%,#F0A478 68%,#F8CAB0 84%,#FEF2E8 100%)",
  },
  Disruptor: {
    story:   "linear-gradient(175deg,#C02020 0%,#D84040 22%,#E86868 48%,#F09090 70%,#F8B8B8 85%,#FEF0F0 100%)",
    linkedin:"linear-gradient(120deg,#C02020 0%,#D84040 20%,#E86868 45%,#F09090 68%,#F8B8B8 84%,#FEF0F0 100%)",
  },
  Anchor: {
    story:   "linear-gradient(175deg,#0A7070 0%,#189090 22%,#38AAAA 48%,#68C8C8 70%,#A4E0E0 85%,#E4F6F6 100%)",
    linkedin:"linear-gradient(120deg,#0A7070 0%,#189090 20%,#38AAAA 45%,#68C8C8 68%,#A4E0E0 84%,#E4F6F6 100%)",
  },
  Catalyst: {
    story:   "linear-gradient(175deg,#907800 0%,#AEA000 22%,#C4B830 48%,#D8CC70 70%,#EADFA8 85%,#FAF8E8 100%)",
    linkedin:"linear-gradient(120deg,#907800 0%,#AEA000 20%,#C4B830 45%,#D8CC70 68%,#EADFA8 84%,#FAF8E8 100%)",
  },
  Sovereign: {
    story:   "linear-gradient(175deg,#7040C8 0%,#9060DE 22%,#AA80EC 48%,#C4A8F8 70%,#D8C4FE 85%,#EDE6FF 100%)",
    linkedin:"linear-gradient(120deg,#7040C8 0%,#9060DE 20%,#AA80EC 45%,#C4A8F8 68%,#D8C4FE 84%,#EDE6FF 100%)",
  },
};

// ─── Stable entry number (no DB yet — deterministic per combination) ────────

const ENTRY_BASES: Record<Archetype, number> = {
  Builder: 1203, Disruptor: 2891, Anchor: 3540, Catalyst: 4126, Sovereign: 5407,
};
const PREFIX_OFFSET = { Relentless: 0, Quiet: 412, Bold: 718, Grounded: 1034 } as const;

function entryNumber(result: QuizResult): string {
  const n = ENTRY_BASES[result.archetype] + PREFIX_OFFSET[result.prefix];
  return `#${n.toLocaleString("en-US")}`;
}

// ─── Dot-grid texture SVG (used in both formats) ───────────────────────────

const DOT_GRID = `url("data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 16 16' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='8' cy='8' r='1.1' fill='%23ffffff'/%3E%3C/svg%3E")`;

// ─── Ghost character SVGs (white silhouettes, 110×110 viewBox) ─────────────

function GhostSovereign() {
  return (
    <svg viewBox="0 0 110 110" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
      <path d="M24 30 L30 12 L42 24 L55 8 L68 24 L80 12 L86 30 Z" fill="white"/>
      <circle cx="30" cy="12" r="5" fill="white"/>
      <circle cx="55" cy="8" r="6" fill="white"/>
      <circle cx="80" cy="12" r="5" fill="white"/>
      <rect x="22" y="28" width="66" height="8" rx="4" fill="white"/>
      <circle cx="55" cy="54" r="23" fill="white"/>
      <ellipse cx="55" cy="80" rx="18" ry="12" fill="white"/>
      <path d="M26 72 L14 106 L96 106 L84 72 Q55 84 26 72 Z" fill="white"/>
    </svg>
  );
}

function GhostBuilder() {
  return (
    <svg viewBox="0 0 110 110" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
      <path d="M22 44 Q22 18 55 18 Q88 18 88 44 Z" fill="white"/>
      <rect x="10" y="40" width="90" height="10" rx="5" fill="white"/>
      <circle cx="55" cy="64" r="21" fill="white"/>
      <rect x="26" y="86" width="58" height="22" rx="11" fill="white"/>
      <rect x="2" y="88" width="26" height="12" rx="6" fill="white"/>
      <rect x="82" y="88" width="26" height="12" rx="6" fill="white"/>
      <circle cx="105" cy="80" r="9" fill="white"/>
      <rect x="101" y="80" width="8" height="18" rx="3" fill="white"/>
      <circle cx="105" cy="97" r="6" fill="white"/>
    </svg>
  );
}

function GhostDisruptor() {
  return (
    <svg viewBox="0 0 110 110" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
      <polygon points="32,36 36,16 42,30 48,12 55,28 62,12 68,30 74,16 78,36" fill="white"/>
      <circle cx="55" cy="54" r="22" fill="white"/>
      <circle cx="55" cy="86" r="18" fill="white"/>
      <path d="M36 68 L14 46" stroke="white" strokeWidth="12" strokeLinecap="round"/>
      <path d="M74 68 L96 46" stroke="white" strokeWidth="12" strokeLinecap="round"/>
      <path d="M88 18 L90 24 L96 24 L91 28 L93 34 L88 30 L83 34 L85 28 L80 24 L86 24 Z" fill="white"/>
    </svg>
  );
}

function GhostAnchor() {
  return (
    <svg viewBox="0 0 110 110" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
      <circle cx="55" cy="38" r="20" fill="white"/>
      <rect x="22" y="58" width="66" height="28" rx="14" fill="white"/>
      <ellipse cx="55" cy="96" rx="48" ry="16" fill="white"/>
      <rect x="0" y="60" width="24" height="14" rx="7" fill="white"/>
      <rect x="86" y="60" width="24" height="14" rx="7" fill="white"/>
      <circle cx="55" cy="69" r="5" stroke="white" strokeWidth="2.5" fill="none"/>
      <line x1="55" y1="73" x2="55" y2="82" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="47" y1="76" x2="63" y2="76" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  );
}

function GhostCatalyst() {
  return (
    <svg viewBox="0 0 110 110" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
      <line x1="55" y1="55" x2="55" y2="8" stroke="white" strokeWidth="6" strokeLinecap="round"/>
      <line x1="55" y1="55" x2="94" y2="16" stroke="white" strokeWidth="5" strokeLinecap="round"/>
      <line x1="55" y1="55" x2="102" y2="55" stroke="white" strokeWidth="5" strokeLinecap="round"/>
      <line x1="55" y1="55" x2="94" y2="94" stroke="white" strokeWidth="5" strokeLinecap="round"/>
      <line x1="55" y1="55" x2="55" y2="102" stroke="white" strokeWidth="4" strokeLinecap="round"/>
      <line x1="55" y1="55" x2="16" y2="94" stroke="white" strokeWidth="5" strokeLinecap="round"/>
      <line x1="55" y1="55" x2="8" y2="55" stroke="white" strokeWidth="5" strokeLinecap="round"/>
      <line x1="55" y1="55" x2="16" y2="16" stroke="white" strokeWidth="5" strokeLinecap="round"/>
      <circle cx="55" cy="8" r="5" fill="white"/>
      <circle cx="94" cy="16" r="4" fill="white"/>
      <circle cx="102" cy="55" r="4" fill="white"/>
      <circle cx="94" cy="94" r="4" fill="white"/>
      <circle cx="55" cy="102" r="4" fill="white"/>
      <circle cx="16" cy="94" r="4" fill="white"/>
      <circle cx="8" cy="55" r="4" fill="white"/>
      <circle cx="16" cy="16" r="4" fill="white"/>
      <circle cx="55" cy="55" r="26" fill="white"/>
    </svg>
  );
}

const GHOST_CHARS: Record<Archetype, () => ReactElement> = {
  Sovereign: GhostSovereign,
  Builder:   GhostBuilder,
  Disruptor: GhostDisruptor,
  Anchor:    GhostAnchor,
  Catalyst:  GhostCatalyst,
};

// ─── Mini icons for "Works with" pills ─────────────────────────────────────

function MiniIcon({ archetype }: { archetype: Archetype }) {
  const s: React.CSSProperties = { display: "block" };
  if (archetype === "Builder") return (
    <svg width="11" height="9" viewBox="0 0 18 14" fill="none" style={s}>
      <path d="M3 9 Q3 3 9 3 Q15 3 15 9 Z" fill="white" opacity="0.85"/>
      <rect x="1" y="8" width="16" height="5" rx="2.5" fill="white" opacity="0.85"/>
    </svg>
  );
  if (archetype === "Disruptor") return (
    <svg width="10" height="10" viewBox="0 0 16 16" fill="none" style={s}>
      <polygon points="8,1 9.5,5 13.5,5 10.5,7.5 11.5,12 8,9.5 4.5,12 5.5,7.5 2.5,5 6.5,5" fill="white" opacity="0.85"/>
    </svg>
  );
  if (archetype === "Anchor") return (
    <svg width="9" height="11" viewBox="0 0 14 17" fill="none" style={s}>
      <circle cx="7" cy="4" r="2.5" stroke="white" strokeWidth="1.5" fill="none" opacity="0.85"/>
      <line x1="7" y1="6" x2="7" y2="15" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.85"/>
      <path d="M3 11 Q3 15 7 15 Q11 15 11 11" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.85"/>
      <line x1="3" y1="8" x2="11" y2="8" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.85"/>
    </svg>
  );
  if (archetype === "Catalyst") return (
    <svg width="11" height="11" viewBox="0 0 16 16" fill="none" style={s}>
      <line x1="8" y1="8" x2="8" y2="2" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.85"/>
      <line x1="8" y1="8" x2="13" y2="3" stroke="white" strokeWidth="1.8" strokeLinecap="round" opacity="0.85"/>
      <line x1="8" y1="8" x2="14" y2="8" stroke="white" strokeWidth="1.8" strokeLinecap="round" opacity="0.85"/>
      <line x1="8" y1="8" x2="2" y2="8" stroke="white" strokeWidth="1.8" strokeLinecap="round" opacity="0.85"/>
      <line x1="8" y1="8" x2="3" y2="3" stroke="white" strokeWidth="1.8" strokeLinecap="round" opacity="0.85"/>
      <circle cx="8" cy="8" r="4" fill="white" opacity="0.85"/>
    </svg>
  );
  // Sovereign
  return (
    <svg width="10" height="10" viewBox="0 0 14 14" fill="none" style={s}>
      <path d="M3 6 L5 2 L7 5 L9 2 L11 6 L3 6 Z" fill="white" opacity="0.85"/>
      <rect x="2" y="5.5" width="10" height="2" rx="1" fill="white" opacity="0.85"/>
      <rect x="3" y="8" width="8" height="5" rx="2" fill="white" opacity="0.85"/>
    </svg>
  );
}

// ─── Dot rows for attributes ────────────────────────────────────────────────

function DotRow({ label, value }: { label: string; value: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <span style={{
        fontSize: "7px", fontWeight: 700, letterSpacing: "0.07em",
        textTransform: "uppercase", color: "rgba(255,255,255,0.82)",
        width: "74px", flexShrink: 0,
      }}>
        {label}
      </span>
      <div style={{ display: "flex", gap: "4px" }}>
        {[1,2,3,4,5].map(i => (
          <div key={i} style={{
            width: "8px", height: "8px", borderRadius: "50%",
            background: i <= value ? "rgba(255,255,255,0.95)" : "transparent",
            border: `1.5px solid ${i <= value ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.45)"}`,
          }}/>
        ))}
      </div>
      <span style={{ fontSize: "7px", fontWeight: 800, color: "rgba(255,255,255,0.9)", marginLeft: "2px" }}>
        {value}
      </span>
    </div>
  );
}

// ─── Wavy underline ─────────────────────────────────────────────────────────

function WavyUnderline({ width = 60 }: { width?: number }) {
  return (
    <svg width={width} height="7" viewBox={`0 0 ${width} 7`} fill="none" style={{ display: "block", marginTop: "3px" }}>
      <path
        d={`M1 5 C${width*0.1} 2.5 ${width*0.22} 6 ${width*0.34} 4 C${width*0.46} 2 ${width*0.58} 6.5 ${width*0.72} 4.5 C${width*0.82} 3 ${width*0.92} 4.5 ${width-1} 5.5`}
        stroke="rgba(255,255,255,0.5)" strokeWidth="1.6" strokeLinecap="round" fill="none"
      />
    </svg>
  );
}

// ─── Adjective badge shapes ──────────────────────────────────────────────────

const ADJ_SHAPES = [
  // star
  (adj: string) => (
    <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", position: "relative", flexShrink: 0 }}>
      <svg width="62" height="26" viewBox="0 0 62 26" fill="none" style={{ display: "block" }}>
        <path d="M31 1 L35 8 L43 5 L40 13 L48 16 L40 19 L43 23 L35 20 L31 25 L27 20 L19 23 L22 19 L14 16 L22 13 L19 5 L27 8 Z" fill="rgba(255,255,255,0.25)" stroke="rgba(255,255,255,0.45)" strokeWidth="0.8"/>
      </svg>
      <span style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", fontSize: "7.5px", fontWeight: 800, letterSpacing: "0.03em", whiteSpace: "nowrap", color: "rgba(0,0,0,0.72)" }}>
        {adj}
      </span>
    </span>
  ),
  // hexagon
  (adj: string) => (
    <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", position: "relative", flexShrink: 0 }}>
      <svg width="70" height="26" viewBox="0 0 70 26" fill="none" style={{ display: "block" }}>
        <path d="M12 2 L58 2 L68 13 L58 24 L12 24 L2 13 Z" fill="rgba(255,255,255,0.25)" stroke="rgba(255,255,255,0.45)" strokeWidth="0.8"/>
      </svg>
      <span style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", fontSize: "7.5px", fontWeight: 800, letterSpacing: "0.03em", whiteSpace: "nowrap", color: "rgba(0,0,0,0.72)" }}>
        {adj}
      </span>
    </span>
  ),
  // oval
  (adj: string) => (
    <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", position: "relative", flexShrink: 0 }}>
      <svg width="62" height="26" viewBox="0 0 62 26" fill="none" style={{ display: "block" }}>
        <ellipse cx="31" cy="13" rx="28" ry="11" fill="rgba(255,255,255,0.25)" stroke="rgba(255,255,255,0.45)" strokeWidth="0.8" transform="rotate(-6 31 13)"/>
      </svg>
      <span style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", fontSize: "7.5px", fontWeight: 800, letterSpacing: "0.03em", whiteSpace: "nowrap", color: "rgba(0,0,0,0.72)" }}>
        {adj}
      </span>
    </span>
  ),
];

// ─── Compat pill ─────────────────────────────────────────────────────────────

function CompatPill({ archetype, shape = "pill" }: { archetype: Archetype; shape?: "pill" | "diamond" }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", position: "relative", flexShrink: 0 }}>
      <svg width="84" height="28" viewBox="0 0 84 28" fill="none" style={{ display: "block" }}>
        {shape === "pill"
          ? <path d="M14 2 L70 2 Q82 2 82 14 Q82 26 70 26 L14 26 Q2 26 2 14 Q2 2 14 2 Z" fill="rgba(255,255,255,0.22)" stroke="rgba(255,255,255,0.4)" strokeWidth="1"/>
          : <path d="M14 2 L70 2 L82 14 L70 26 L14 26 L2 14 Z" fill="rgba(255,255,255,0.22)" stroke="rgba(255,255,255,0.4)" strokeWidth="1"/>
        }
      </svg>
      <span style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", display: "flex", alignItems: "center", gap: "4px", fontSize: "7.5px", fontWeight: 800, whiteSpace: "nowrap", color: "rgba(0,0,0,0.72)" }}>
        <MiniIcon archetype={archetype}/>
        The {archetype}
      </span>
    </span>
  );
}

// ─── STORY CARD (270 × 480) ──────────────────────────────────────────────────

function StoryCard({ result, cardRef }: { result: QuizResult; cardRef: React.RefObject<HTMLDivElement | null> }) {
  const GhostChar = GHOST_CHARS[result.archetype];
  const gradient = GRADIENTS[result.archetype].story;
  const entry = entryNumber(result);
  const prefixText = `The ${result.prefix}`;
  const prefixWidth = prefixText.length * 6.5;

  return (
    <div
      ref={cardRef}
      style={{
        width: "270px",
        height: "480px",
        borderRadius: "0px",
        overflow: "hidden",
        position: "relative",
        background: gradient,
        display: "flex",
        flexDirection: "column",
        fontFamily: "'Manrope', sans-serif",
        boxShadow: "0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06)",
      }}
    >
      {/* Dot-grid texture */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
        backgroundImage: DOT_GRID,
        backgroundSize: "16px 16px",
        opacity: 0.18,
      }}/>

      {/* Ghost character */}
      <div style={{
        position: "absolute", top: "56px", right: "10px",
        width: "104px", height: "104px", opacity: 0.2, zIndex: 0,
      }}>
        <GhostChar/>
      </div>

      {/* Inner content */}
      <div style={{
        position: "relative", zIndex: 1,
        display: "flex", flexDirection: "column", flex: 1,
        padding: "22px 20px 18px",
      }}>
        {/* Top row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "18px" }}>
          <span style={{ fontSize: "8px", fontWeight: 800, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)" }}>
            Profyle
          </span>
          <span style={{ fontSize: "9px", fontWeight: 800, letterSpacing: "0.06em", color: "rgba(255,255,255,0.55)", fontVariantNumeric: "tabular-nums" }}>
            {entry}
          </span>
        </div>

        {/* Prefix */}
        <div style={{ marginBottom: "6px", display: "inline-block" }}>
          <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.88)", display: "block" }}>
            {prefixText}
          </span>
          <WavyUnderline width={Math.max(44, Math.min(prefixWidth, 80))}/>
        </div>

        {/* Archetype name */}
        <h1 style={{
          fontSize: "42px", fontWeight: 800, lineHeight: 0.9, letterSpacing: "-0.05em",
          color: "#fff", whiteSpace: "nowrap", marginBottom: "18px",
          textTransform: "uppercase",
        }}>
          {result.archetype}
        </h1>

        {/* Tagline */}
        <p style={{
          fontSize: "10px", fontWeight: 500, color: "rgba(255,255,255,0.88)", lineHeight: 1.55,
          borderLeft: "2.5px solid rgba(255,255,255,0.55)", paddingLeft: "9px",
          marginBottom: "24px", maxWidth: "185px",
        }}>
          {result.tagline}
        </p>

        {/* Attribute dots */}
        <div style={{ display: "flex", flexDirection: "column", gap: "9px", marginBottom: "24px" }}>
          <DotRow label="Execution"     value={result.attributes.execution}/>
          <DotRow label="Vision"        value={result.attributes.vision}/>
          <DotRow label="Independence"  value={result.attributes.independence}/>
          <DotRow label="Collaboration" value={result.attributes.collaboration}/>
          <DotRow label="Adaptability"  value={result.attributes.adaptability}/>
        </div>

        {/* Adjective badges */}
        <div style={{ display: "flex", gap: "6px", flexWrap: "nowrap", marginBottom: "20px" }}>
          {result.adjectives.map((adj, i) => (
            <Fragment key={adj}>{ADJ_SHAPES[i]?.(adj)}</Fragment>
          ))}
        </div>

        {/* Blind spot */}
        <p style={{ fontSize: "8.5px", fontWeight: 500, color: "rgba(255,255,255,0.82)", lineHeight: 1.5, marginBottom: "20px" }}>
          <strong style={{ color: "#fff", fontWeight: 800 }}>Blind spot —</strong>{" "}{result.blindSpot}
        </p>

        {/* Works with */}
        <div>
          <p style={{ fontSize: "7px", fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(255,255,255,0.65)", marginBottom: "7px" }}>
            Works with
          </p>
          <div style={{ display: "flex", gap: "7px" }}>
            <CompatPill archetype={result.compatibleWith[0]} shape="pill"/>
            <CompatPill archetype={result.compatibleWith[1]} shape="diamond"/>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ position: "relative", zIndex: 1, padding: "6px 20px 16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: "7px", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(0,0,0,0.55)" }}>
          profyle.com
        </span>
      </div>
    </div>
  );
}

// ─── LINKEDIN CARD (540 × 283) ───────────────────────────────────────────────

function LinkedInCard({ result, cardRef }: { result: QuizResult; cardRef: React.RefObject<HTMLDivElement | null> }) {
  const GhostChar = GHOST_CHARS[result.archetype];
  const gradient = GRADIENTS[result.archetype].linkedin;
  const entry = entryNumber(result);
  const prefixText = `The ${result.prefix}`;
  const prefixWidth = Math.max(44, Math.min(prefixText.length * 5.5, 70));

  return (
    <div
      ref={cardRef}
      style={{
        width: "540px",
        height: "283px",
        borderRadius: "0px",
        overflow: "hidden",
        position: "relative",
        background: gradient,
        display: "flex",
        fontFamily: "'Manrope', sans-serif",
        boxShadow: "0 24px 64px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.06)",
      }}
    >
      {/* Dot-grid texture */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
        backgroundImage: DOT_GRID,
        backgroundSize: "16px 16px",
        opacity: 0.18,
      }}/>

      {/* Ghost character bottom-left of left panel */}
      <div style={{
        position: "absolute", bottom: 0, left: "128px",
        width: "84px", height: "84px", opacity: 0.14, zIndex: 0,
      }}>
        <GhostChar/>
      </div>

      {/* LEFT panel */}
      <div style={{
        width: "216px", flexShrink: 0, position: "relative", zIndex: 1,
        padding: "22px 20px 16px", display: "flex", flexDirection: "column",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <p style={{ fontSize: "7px", fontWeight: 800, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)" }}>
            Profyle
          </p>
          <span style={{ fontSize: "8px", fontWeight: 800, letterSpacing: "0.06em", color: "rgba(255,255,255,0.45)" }}>
            {entry}
          </span>
        </div>
        <div style={{ display: "inline-block", marginBottom: "4px" }}>
          <span style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.68)", display: "block" }}>
            {prefixText}
          </span>
          <WavyUnderline width={prefixWidth}/>
        </div>
        <h1 style={{ fontSize: "34px", fontWeight: 800, lineHeight: 0.88, letterSpacing: "-0.05em", color: "#fff", whiteSpace: "nowrap", marginBottom: "8px", textTransform: "uppercase" }}>
          {result.archetype}
        </h1>
        <p style={{ fontSize: "8px", fontWeight: 500, color: "rgba(255,255,255,0.82)", lineHeight: 1.55, flex: 1 }}>
          {result.tagline}
        </p>
        <p style={{ fontSize: "6.5px", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(0,0,0,0.55)", marginTop: "auto" }}>
          profyle.com
        </p>
      </div>

      {/* RIGHT frosted-glass panel */}
      <div style={{
        flex: 1, position: "relative", zIndex: 1,
        margin: "12px 12px 12px 0",
        borderRadius: "10px",
        background: "rgba(255,255,255,0.16)",
        border: "1px solid rgba(255,255,255,0.28)",
        padding: "16px 16px 14px",
        display: "flex", flexDirection: "column", gap: "10px",
      }}>
        {/* Dots */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <DotRow label="Execution"     value={result.attributes.execution}/>
          <DotRow label="Vision"        value={result.attributes.vision}/>
          <DotRow label="Independence"  value={result.attributes.independence}/>
          <DotRow label="Collaboration" value={result.attributes.collaboration}/>
          <DotRow label="Adaptability"  value={result.attributes.adaptability}/>
        </div>

        {/* Adjective badges (smaller) */}
        <div style={{ display: "flex", gap: "5px" }}>
          {result.adjectives.map((adj, i) => (
            <span key={adj} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", position: "relative", flexShrink: 0 }}>
              <svg width={i === 1 ? 62 : 54} height="22" viewBox={`0 0 ${i === 1 ? 66 : 56} 24`} fill="none" style={{ display: "block" }}>
                {i === 0 && <path d="M28 1 L32 8 L39 5 L37 12 L44 15 L37 18 L39 21 L32 18 L28 23 L24 18 L17 21 L19 18 L12 15 L19 12 L17 5 L24 8 Z" fill="rgba(255,255,255,0.25)" stroke="rgba(255,255,255,0.45)" strokeWidth="0.8"/>}
                {i === 1 && <path d="M10 2 L56 2 L64 12 L56 22 L10 22 L2 12 Z" fill="rgba(255,255,255,0.25)" stroke="rgba(255,255,255,0.45)" strokeWidth="0.8"/>}
                {i === 2 && <ellipse cx="28" cy="12" rx="25" ry="10" fill="rgba(255,255,255,0.25)" stroke="rgba(255,255,255,0.45)" strokeWidth="0.8" transform="rotate(-5 28 12)"/>}
              </svg>
              <span style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.03em", whiteSpace: "nowrap", color: "rgba(0,0,0,0.72)" }}>
                {adj}
              </span>
            </span>
          ))}
        </div>

        {/* Blind spot */}
        <p style={{ fontSize: "7.5px", fontWeight: 500, color: "rgba(255,255,255,0.85)", lineHeight: 1.5 }}>
          <strong style={{ color: "#fff", fontWeight: 800 }}>Blind spot —</strong>{" "}{result.blindSpot}
        </p>

        {/* Compatible with */}
        <div style={{ marginTop: "auto" }}>
          <p style={{ fontSize: "7px", fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(255,255,255,0.7)", marginBottom: "5px" }}>
            Works with
          </p>
          <div style={{ display: "flex", gap: "6px" }}>
            {result.compatibleWith.map((arch, i) => (
              <span key={arch} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", position: "relative", flexShrink: 0 }}>
                <svg width="78" height="24" viewBox="0 0 78 24" fill="none" style={{ display: "block" }}>
                  {i === 0
                    ? <path d="M12 2 L66 2 Q76 2 76 12 Q76 22 66 22 L12 22 Q2 22 2 12 Q2 2 12 2 Z" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.35)" strokeWidth="1"/>
                    : <path d="M12 2 L66 2 L76 12 L66 22 L12 22 L2 12 Z" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.35)" strokeWidth="1"/>
                  }
                </svg>
                <span style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", display: "flex", alignItems: "center", gap: "3px", fontSize: "7px", fontWeight: 800, whiteSpace: "nowrap", color: "rgba(0,0,0,0.72)" }}>
                  <MiniIcon archetype={arch}/>
                  The {arch}
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Export ──────────────────────────────────────────────────────────────────

export interface ShareCardHandle {
  captureStory: () => Promise<Blob | null>;
}

interface ShareCardProps {
  result: QuizResult;
  format?: "story" | "linkedin";
  mobileBlob?: Blob | null;
}

export const ShareCard = forwardRef<ShareCardHandle, ShareCardProps>(
  function ShareCard({ result, format = "story", mobileBlob }, ref) {
    const cardRef = useRef<HTMLDivElement>(null);
    const hiddenStoryRef = useRef<HTMLDivElement>(null);
    const [saveDataUrl, setSaveDataUrl] = useState<string | null>(null);
    const [isDownloading, setIsDownloading] = useState(false);

    const runHtml2canvas = async (el: HTMLDivElement): Promise<string> => {
      const { default: html2canvas } = await import("html2canvas");
      const canvas = await html2canvas(el, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        logging: false,
      });
      return canvas.toDataURL("image/png");
    };

    useImperativeHandle(ref, () => ({
      async captureStory() {
        const target = hiddenStoryRef.current;
        if (!target) return null;
        try {
          const dataUrl = await runHtml2canvas(target);
          const res = await fetch(dataUrl);
          return res.blob();
        } catch { return null; }
      },
    }));

    const handleDownload = async () => {
      if (isDownloading || !cardRef.current) return;
      setIsDownloading(true);
      const slug = `profyle-${result.prefix.toLowerCase()}-${result.archetype.toLowerCase()}.png`;
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

      try {
        if (isMobile) {
          // Mobile: use pre-captured blob for the overlay (no html2canvas delay)
          if (mobileBlob) {
            const reader = new FileReader();
            reader.onload = () => setSaveDataUrl(reader.result as string);
            reader.readAsDataURL(mobileBlob);
          } else {
            const dataUrl = await runHtml2canvas(cardRef.current);
            setSaveDataUrl(dataUrl);
          }
        } else {
          // Desktop: html2canvas → dataURL → trigger download
          const dataUrl = await runHtml2canvas(cardRef.current);
          const a = document.createElement("a");
          a.href = dataUrl;
          a.download = slug;
          a.style.display = "none";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }
      } catch (err) {
        console.error("Save failed:", err);
      } finally {
        setIsDownloading(false);
      }
    };

    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "16px" }}>
        {format === "story"
          ? <StoryCard result={result} cardRef={cardRef}/>
          : <LinkedInCard result={result} cardRef={cardRef}/>
        }

        {/* Hidden story card always available for image sharing */}
        <div style={{ position: "fixed", left: "-10000px", top: "-10000px", pointerEvents: "none" }}>
          <StoryCard result={result} cardRef={hiddenStoryRef}/>
        </div>

        <button
          onClick={handleDownload}
          disabled={isDownloading}
          style={{
            padding: "11px 22px",
            borderRadius: "10px",
            background: isDownloading ? "var(--muted)" : "var(--ink)",
            color: "white",
            fontSize: "13px",
            fontWeight: 700,
            border: "none",
            cursor: isDownloading ? "default" : "pointer",
            fontFamily: "inherit",
            letterSpacing: "0.01em",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            transition: "background 200ms ease",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M8 2 L8 10 M5 7 L8 10 L11 7" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 12 L2 14 L14 14 L14 12" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
          {isDownloading ? "Saving…" : "Save as PNG"}
        </button>

        {/* Mobile save overlay — long-press image to save to Photos */}
        {saveDataUrl && (
          <div
            onClick={() => setSaveDataUrl(null)}
            style={{
              position: "fixed", inset: 0, zIndex: 9999,
              background: "rgba(0,0,0,0.92)",
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              gap: "20px", padding: "32px 24px",
            }}
          >
            <img
              src={saveDataUrl}
              onClick={(e) => e.stopPropagation()}
              style={{ maxWidth: "85vw", maxHeight: "65dvh", display: "block", borderRadius: "0px" }}
              alt="Your Profyle card"
            />
            <p style={{
              color: "rgba(255,255,255,0.75)",
              fontFamily: "inherit", fontSize: "15px",
              textAlign: "center", margin: 0, lineHeight: 1.5,
            }}>
              Hold down on the image to save it to your photos
            </p>
            <button
              onClick={() => setSaveDataUrl(null)}
              style={{
                padding: "12px 32px", borderRadius: "10px",
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.2)",
                color: "white", fontSize: "14px", fontWeight: 600,
                cursor: "pointer", fontFamily: "inherit",
              }}
            >
              Done
            </button>
          </div>
        )}
      </div>
    );
  }
);

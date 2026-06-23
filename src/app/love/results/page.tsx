"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LoveResult } from "@/lib/love-types";
import { LOVE_ARCHETYPE_POPULATION, LOVE_DIMENSION_POPULATION } from "@/lib/love-scoring";
import {
  FlameCharacter,
  HarbourCharacter,
  WandererCharacter,
  ArchitectCharacter,
  DevoteeCharacter,
  MirrorCharacter,
  SparkCharacter,
  AnchorLoveCharacter,
} from "@/components/love-characters";

const BURGUNDY        = "#8B2252";
const BURGUNDY_LIGHT  = "#FDF0F5";
const BURGUNDY_BORDER = "#F0C8D8";

function CharacterForArchetype({ archetype, size }: { archetype: string; size: number }) {
  const props = { size };
  if (archetype === "Flame")     return <FlameCharacter {...props}/>;
  if (archetype === "Harbour")   return <HarbourCharacter {...props}/>;
  if (archetype === "Wanderer")  return <WandererCharacter {...props}/>;
  if (archetype === "Architect") return <ArchitectCharacter {...props}/>;
  if (archetype === "Devotee")   return <DevoteeCharacter {...props}/>;
  if (archetype === "Mirror")    return <MirrorCharacter {...props}/>;
  if (archetype === "Spark")     return <SparkCharacter {...props}/>;
  return <AnchorLoveCharacter {...props}/>;
}

function buildCardImageUrl(result: LoveResult): string {
  const base = typeof window !== "undefined" ? window.location.origin : "";
  const archPct = LOVE_ARCHETYPE_POPULATION[result.archetype] ?? 12;
  const dimPct  = LOVE_DIMENSION_POPULATION[result.dimension] ?? 25;
  const pct     = Math.round(archPct * dimPct / 100 * 10) / 10;
  const p = new URLSearchParams({
    d:   result.dimension,
    a:   result.archetype,
    t:   result.tagline,
    in:  String(result.attributes.intimacy),
    ex:  String(result.attributes.expressiveness),
    id:  String(result.attributes.independence),
    de:  String(result.attributes.devotion),
    op:  String(result.attributes.openness),
    j1:  result.adjectives[0] ?? "",
    j2:  result.adjectives[1] ?? "",
    j3:  result.adjectives[2] ?? "",
    b:   result.blindSpot,
    w1:  result.compatibleWith[0] ?? "",
    w2:  result.compatibleWith[1] ?? "",
    pct: String(pct),
  });
  return `${base}/api/love-card-image?${p}`;
}

const ATTR_LABELS = ["Intimacy", "Expressiveness", "Independence", "Devotion", "Openness"] as const;

const dividerStyle: React.CSSProperties = {
  borderTop: `1.5px solid ${BURGUNDY_BORDER}`,
  maxWidth: "760px", margin: "0 auto",
};
const sectionStyle: React.CSSProperties = {
  maxWidth: "760px", margin: "0 auto", padding: "0 24px",
};

export default function LoveResultsPage() {
  const router = useRouter();
  const [result, setResult] = useState<LoveResult | null>(null);
  const [mounted, setMounted] = useState(false);
  const [cardFormat, setCardFormat] = useState<"story" | "linkedin">("story");
  const [isCopied, setIsCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [cardBlob, setCardBlob] = useState<Blob | null>(null);
  const barsRef = useRef<HTMLDivElement>(null);
  const [barsVisible, setBarsVisible] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem("profyle_love_result");
    if (!raw) { router.replace("/love/quiz"); return; }
    try { setResult(JSON.parse(raw)); } catch { router.replace("/love/quiz"); }
    setMounted(true);
  }, [router]);

  useEffect(() => {
    if (!barsRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setBarsVisible(true); },
      { threshold: 0.2 }
    );
    observer.observe(barsRef.current);
    return () => observer.disconnect();
  }, [result]);

  useEffect(() => {
    if (!mounted || !result) return;
    const url = buildCardImageUrl(result);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(url);
        if (res.ok) setCardBlob(await res.blob());
      } catch { /* silent */ }
    }, 800);
    return () => clearTimeout(timer);
  }, [mounted, result]);

  const handleDownload = async () => {
    if (!result) return;
    setIsDownloading(true);
    try {
      const url = buildCardImageUrl(result);
      const blob: Blob = cardBlob ?? await fetch(url).then((r) => r.blob());
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `profyle-love-${result.archetype.toLowerCase()}.png`;
      a.click();
      URL.revokeObjectURL(a.href);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = async (platform: "generic" | "whatsapp") => {
    if (!result) return;
    const url = "https://www.profyle.one/love";
    const text = `I'm ${result.fullTitle} — find out how you love at profyle.one/love`;
    if (platform === "whatsapp") {
      window.open(`https://wa.me/?text=${encodeURIComponent(text + " " + url)}`, "_blank");
      return;
    }
    if (navigator.share && cardBlob) {
      try {
        await navigator.share({ title: result.fullTitle, text, files: [new File([cardBlob], "profyle-love.png", { type: "image/png" })] });
        return;
      } catch { /* fall through */ }
    }
    navigator.clipboard.writeText(url).catch(() => {});
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText("https://www.profyle.one/love").then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  if (!mounted || !result) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: "13px", color: "var(--faint)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
          Discovering your type…
        </span>
      </div>
    );
  }

  const cardImageUrl = buildCardImageUrl(result);
  const attrValues   = [result.attributes.intimacy, result.attributes.expressiveness, result.attributes.independence, result.attributes.devotion, result.attributes.openness];
  const archPct      = LOVE_ARCHETYPE_POPULATION[result.archetype] ?? 12;
  const dimPct       = LOVE_DIMENSION_POPULATION[result.dimension] ?? 25;
  const permPct      = Math.round(archPct * dimPct / 100 * 10) / 10;

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>

      {/* Nav */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        padding: "20px 32px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "rgba(245,243,238,0.85)", backdropFilter: "blur(8px)",
      }}>
        <Link href="/love" style={{ fontSize: "13px", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--ink)", textDecoration: "none" }}>
          Profyle
        </Link>
        <Link href="/love/quiz" style={{
          padding: "9px 20px", borderRadius: "8px",
          background: BURGUNDY, color: "white",
          fontSize: "13px", fontWeight: 700, textDecoration: "none",
        }}>
          Retake
        </Link>
      </nav>

      {/* ─── 1. HERO ─── */}
      <section style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "120px 24px 80px" }}>
        <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: BURGUNDY, marginBottom: "20px", display: "block" }}>
          Your love type
        </span>

        <div style={{ marginBottom: "28px" }}>
          <CharacterForArchetype archetype={result.archetype} size={160}/>
        </div>

        <p style={{ fontSize: "clamp(13px, 1.8vw, 16px)", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(139,34,82,0.7)", marginBottom: "8px" }}>
          {result.dimension}
        </p>
        <h1 style={{ fontSize: "clamp(52px, 10vw, 88px)", fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1.0, color: "var(--ink)", marginBottom: "20px" }}>
          The {result.archetype}
        </h1>
        <p style={{ fontSize: "clamp(16px, 2.2vw, 20px)", fontWeight: 500, color: "var(--muted)", fontStyle: "italic", marginBottom: "40px", maxWidth: "480px", lineHeight: 1.55 }}>
          "{result.tagline}"
        </p>

        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
          <a href="#share-card" style={{
            display: "inline-block", padding: "14px 36px", borderRadius: "12px",
            background: BURGUNDY, color: "white",
            fontSize: "14px", fontWeight: 700, textDecoration: "none",
          }}>
            Share my result
          </a>
          <a href="#profile" style={{
            display: "inline-block", padding: "14px 36px", borderRadius: "12px",
            border: `1.5px solid ${BURGUNDY_BORDER}`,
            background: BURGUNDY_LIGHT, color: BURGUNDY,
            fontSize: "14px", fontWeight: 700, textDecoration: "none",
          }}>
            Explore my profile ↓
          </a>
        </div>
      </section>

      <div style={dividerStyle}/>

      {/* ─── 2. SHAREABLE CARD ─── */}
      <section id="share-card" style={{ padding: "64px 0" }}>
        <div style={sectionStyle}>
          <div style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--faint)", marginBottom: "24px" }}>
            Your card
          </div>

          {/* Format toggle */}
          <div style={{ display: "flex", gap: "6px", marginBottom: "28px" }}>
            {(["story", "linkedin"] as const).map((fmt) => (
              <button
                key={fmt}
                onClick={() => setCardFormat(fmt)}
                style={{
                  padding: "8px 18px", borderRadius: "8px",
                  fontSize: "12px", fontWeight: 700, letterSpacing: "0.02em",
                  border: cardFormat === fmt ? `1.5px solid ${BURGUNDY}` : "1.5px solid var(--border)",
                  background: cardFormat === fmt ? BURGUNDY_LIGHT : "transparent",
                  color: cardFormat === fmt ? BURGUNDY : "var(--muted)",
                  cursor: "pointer", fontFamily: "inherit",
                  transition: "all 160ms ease",
                }}
              >
                {fmt === "story" ? "Vertical" : "Landscape"}
              </button>
            ))}
          </div>

          {/* Card preview */}
          <div style={{ overflowX: "auto", paddingBottom: "4px" }}>
            {cardFormat === "story" ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "16px" }}>
                <div style={{ boxShadow: "0 32px 80px rgba(0,0,0,0.35), 0 0 0 1px rgba(0,0,0,0.06)", borderRadius: "20px", overflow: "hidden" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={cardImageUrl} width={270} height={480} alt="Your love card" style={{ display: "block" }}/>
                </div>
                <button
                  onClick={handleDownload}
                  disabled={isDownloading}
                  style={{
                    padding: "11px 22px", borderRadius: "10px",
                    background: isDownloading ? "var(--muted)" : BURGUNDY,
                    color: "white", fontSize: "13px", fontWeight: 700,
                    border: "none", cursor: isDownloading ? "default" : "pointer",
                    fontFamily: "inherit", letterSpacing: "0.01em",
                    display: "flex", alignItems: "center", gap: "8px",
                    transition: "background 200ms ease",
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path d="M8 2 L8 10 M5 7 L8 10 L11 7" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 12 L2 14 L14 14 L14 12" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
                  </svg>
                  {isDownloading ? "Saving…" : "Save as PNG"}
                </button>
              </div>
            ) : (
              /* Landscape: CSS-rendered preview */
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{
                  width: "540px", height: "283px", borderRadius: "16px", overflow: "hidden",
                  background: "linear-gradient(110deg, #1A0505 0%, #4A0E0E 20%, #8B2020 45%, #C0402A 68%, #E8652A 85%, #F5A050 100%)",
                  boxShadow: "0 24px 64px rgba(0,0,0,0.35)",
                  display: "flex", position: "relative",
                }}>
                  {/* Left panel */}
                  <div style={{ width: "215px", padding: "22px 20px 16px", display: "flex", flexDirection: "column", position: "relative", zIndex: 2 }}>
                    <p style={{ fontSize: "7px", fontWeight: 800, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.38)", marginBottom: "14px" }}>
                      Profyle · Love
                    </p>
                    <span style={{ fontSize: "8px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.72)", display: "block", marginBottom: "2px" }}>
                      {result.dimension}
                    </span>
                    <p style={{ fontSize: "42px", fontWeight: 900, letterSpacing: "-0.05em", color: "white", lineHeight: 0.85, marginBottom: "10px", textTransform: "uppercase" }}>
                      {result.archetype}
                    </p>
                    <p style={{ fontSize: "8px", fontWeight: 600, color: "rgba(255,255,255,0.72)", lineHeight: 1.5, fontStyle: "italic", flex: 1 }}>
                      "{result.tagline}"
                    </p>
                    <p style={{ fontSize: "6.5px", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(255,255,255,0.28)" }}>
                      profyle.one
                    </p>
                  </div>
                  {/* Divider */}
                  <div style={{ width: "1px", background: "rgba(255,255,255,0.12)", alignSelf: "stretch", flexShrink: 0 }}/>
                  {/* Right panel */}
                  <div style={{ flex: 1, padding: "18px 18px 14px", display: "flex", flexDirection: "column", gap: "8px", position: "relative", zIndex: 2 }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                      {ATTR_LABELS.map((label, idx) => (
                        <div key={label} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <span style={{ fontSize: "6px", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)", width: "80px", flexShrink: 0 }}>
                            {label}
                          </span>
                          <div style={{ display: "flex", gap: "3px" }}>
                            {[1,2,3,4,5].map((i) => (
                              <div key={i} style={{
                                width: "7px", height: "7px",
                                background: i <= attrValues[idx] ? "rgba(255,255,255,0.92)" : "transparent",
                                border: `1.5px solid ${i <= attrValues[idx] ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.28)"}`,
                                borderRadius: "1px", transform: "rotate(45deg)",
                                flexShrink: 0,
                              }}/>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div style={{ display: "flex", gap: "0px" }}>
                      {result.adjectives.map((adj, i) => (
                        <span key={adj} style={{
                          fontSize: "7px", fontWeight: 800, color: "white",
                          padding: "3px 8px", border: "1px solid rgba(255,255,255,0.3)",
                          borderRadius: i === 0 ? "4px" : i === 1 ? "0" : "4px",
                          background: "rgba(255,255,255,0.14)",
                        }}>
                          {adj}
                        </span>
                      ))}
                    </div>
                    <p style={{ fontSize: "7.5px", fontWeight: 500, color: "rgba(255,255,255,0.65)", lineHeight: 1.5, borderLeft: "2px solid rgba(255,255,255,0.25)", paddingLeft: "8px", flex: 1 }}>
                      <strong style={{ color: "white", fontWeight: 800 }}>Blind spot — </strong>
                      {result.blindSpot}
                    </p>
                  </div>
                </div>
                <p style={{ fontSize: "12px", color: "var(--faint)" }}>
                  Landscape preview — save from Vertical format for full-quality PNG
                </p>
              </div>
            )}
          </div>

          {/* Share buttons */}
          <div style={{ display: "flex", gap: "10px", marginTop: "20px", flexWrap: "wrap" }}>
            <button
              onClick={() => handleShare("generic")}
              style={{
                padding: "12px 24px", borderRadius: "10px",
                background: BURGUNDY, color: "white",
                fontSize: "14px", fontWeight: 700, border: "none",
                cursor: "pointer", fontFamily: "inherit",
                display: "flex", alignItems: "center", gap: "8px",
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
              </svg>
              Share
            </button>
            <button
              onClick={() => handleShare("whatsapp")}
              style={{
                padding: "12px 24px", borderRadius: "10px",
                background: "#25D366", color: "white",
                fontSize: "14px", fontWeight: 700, border: "none",
                cursor: "pointer", fontFamily: "inherit",
                display: "flex", alignItems: "center", gap: "8px",
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WhatsApp
            </button>
            <button
              onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent("https://www.profyle.one/love")}`, "_blank")}
              style={{
                padding: "12px 24px", borderRadius: "10px",
                background: "#0A66C2", color: "white",
                fontSize: "14px", fontWeight: 700, border: "none",
                cursor: "pointer", fontFamily: "inherit",
                display: "flex", alignItems: "center", gap: "8px",
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              LinkedIn
            </button>
            <button
              onClick={handleCopyLink}
              style={{
                padding: "12px 24px", borderRadius: "10px",
                background: "transparent",
                color: isCopied ? BURGUNDY : "var(--ink)",
                fontSize: "14px", fontWeight: 700,
                border: `1.5px solid ${isCopied ? BURGUNDY : "var(--border)"}`,
                cursor: "pointer", fontFamily: "inherit",
                transition: "color 200ms ease, border-color 200ms ease",
              }}
            >
              {isCopied ? "Copied ✓" : "Copy link"}
            </button>
          </div>
        </div>
      </section>

      <div style={dividerStyle}/>

      {/* ─── 3. RARITY ─── */}
      <section id="profile" style={{ padding: "64px 0" }}>
        <div style={sectionStyle}>
          <div style={{ marginBottom: "32px" }}>
            <div style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--faint)", marginBottom: "16px" }}>
              Rarity
            </div>
            <h2 style={{ fontSize: "clamp(24px, 4vw, 34px)", fontWeight: 900, letterSpacing: "-0.03em", color: "var(--ink)", lineHeight: 1.15 }}>
              Only {permPct}% of people are {result.fullTitle}
            </h2>
          </div>

          {/* Attribute bars */}
          <div ref={barsRef} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {ATTR_LABELS.map((label, idx) => {
              const val = attrValues[idx];
              const pctBar = (val / 5) * 100;
              return (
                <div key={label}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "6px" }}>
                    <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--ink)" }}>{label}</span>
                    <span style={{ fontSize: "12px", fontWeight: 600, color: BURGUNDY }}>{val}/5</span>
                  </div>
                  <div style={{ height: "6px", background: BURGUNDY_BORDER, borderRadius: "3px", overflow: "hidden" }}>
                    <div style={{
                      height: "100%", background: BURGUNDY, borderRadius: "3px",
                      width: barsVisible ? `${pctBar}%` : "0%",
                      transition: `width 800ms cubic-bezier(0.16,1,0.3,1) ${idx * 100}ms`,
                    }}/>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Adjective badges */}
          <div style={{ display: "flex", gap: "8px", marginTop: "28px", flexWrap: "wrap" }}>
            {result.adjectives.map((adj) => (
              <span key={adj} style={{
                padding: "8px 18px", borderRadius: "99px",
                background: BURGUNDY_LIGHT, border: `1.5px solid ${BURGUNDY_BORDER}`,
                fontSize: "13px", fontWeight: 700, color: BURGUNDY,
              }}>
                {adj}
              </span>
            ))}
          </div>
        </div>
      </section>

      <div style={dividerStyle}/>

      {/* ─── 4. WHO YOU ARE ─── */}
      <section style={{ padding: "64px 0" }}>
        <div style={sectionStyle}>
          <div style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--faint)", marginBottom: "16px" }}>
            Who you are in love
          </div>
          <p style={{ fontSize: "clamp(15px, 2vw, 18px)", fontWeight: 400, color: "var(--ink)", lineHeight: 1.75, marginBottom: "28px" }}>
            {result.whoYouAre}
          </p>

          {/* Blind spot */}
          <div style={{
            borderLeft: `3px solid ${BURGUNDY}`,
            paddingLeft: "20px",
            padding: "16px 20px",
            background: BURGUNDY_LIGHT,
            borderRadius: "0 12px 12px 0",
          }}>
            <p style={{ fontSize: "12px", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: BURGUNDY, marginBottom: "8px" }}>
              Blind spot
            </p>
            <p style={{ fontSize: "15px", fontWeight: 500, color: "var(--ink)", lineHeight: 1.6, margin: 0 }}>
              {result.blindSpot}
            </p>
          </div>
        </div>
      </section>

      <div style={dividerStyle}/>

      {/* ─── 5. FAMOUS PEOPLE ─── */}
      <section style={{ padding: "64px 0" }}>
        <div style={sectionStyle}>
          <div style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--faint)", marginBottom: "16px" }}>
            People who love like you
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {result.famousPeople.map((p, i) => (
              <div key={p.name} style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                <span style={{
                  width: "28px", height: "28px", borderRadius: "8px", flexShrink: 0,
                  background: BURGUNDY_LIGHT, border: `1.5px solid ${BURGUNDY_BORDER}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "11px", fontWeight: 800, color: BURGUNDY,
                }}>
                  0{i + 1}
                </span>
                <div>
                  <p style={{ fontSize: "15px", fontWeight: 800, color: "var(--ink)", marginBottom: "4px" }}>{p.name}</p>
                  <p style={{ fontSize: "14px", fontWeight: 400, color: "var(--muted)", lineHeight: 1.6, margin: 0 }}>{p.reason}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div style={dividerStyle}/>

      {/* ─── 6. HOW YOU LOVE ─── */}
      <section style={{ padding: "64px 0" }}>
        <div style={sectionStyle}>
          <div style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--faint)", marginBottom: "16px" }}>
            How you love
          </div>
          <p style={{ fontSize: "clamp(15px, 2vw, 18px)", fontWeight: 400, color: "var(--ink)", lineHeight: 1.75, margin: 0 }}>
            {result.howYouLove}
          </p>
        </div>
      </section>

      <div style={dividerStyle}/>

      {/* ─── 7. COMPATIBLE WITH ─── */}
      <section style={{ padding: "64px 0" }}>
        <div style={sectionStyle}>
          <div style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--faint)", marginBottom: "8px" }}>
            Compatible with
          </div>
          <p style={{ fontSize: "13px", color: "var(--muted)", marginBottom: "28px" }}>
            Know someone with this type? Send them this.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
            {result.compatibleWith.map((arch, i) => (
              <div key={arch} style={{
                padding: "24px", borderRadius: "20px",
                background: BURGUNDY_LIGHT, border: `1.5px solid ${BURGUNDY_BORDER}`,
              }}>
                <p style={{ fontSize: "11px", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: BURGUNDY, marginBottom: "12px" }}>
                  The {arch}
                </p>
                <p style={{ fontSize: "14px", fontWeight: 400, color: "var(--ink)", lineHeight: 1.65, margin: 0 }}>
                  {result.compatCopy[i]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div style={dividerStyle}/>

      {/* ─── 8. SHARE CTA ─── */}
      <section style={{ padding: "96px 24px 112px", textAlign: "center" }}>
        <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--faint)", marginBottom: "24px" }}>
          Free · No signup
        </p>
        <h2 style={{ fontSize: "clamp(34px, 6vw, 58px)", fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1.05, color: "var(--ink)", marginBottom: "36px" }}>
          Share how you love.
        </h2>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          <button
            onClick={() => handleShare("generic")}
            style={{
              display: "inline-block", padding: "16px 44px", borderRadius: "12px",
              background: BURGUNDY, color: "white",
              fontSize: "15px", fontWeight: 700, border: "none",
              cursor: "pointer", fontFamily: "inherit",
            }}
          >
            Share my result →
          </button>
          <Link href="/love/quiz" style={{
            display: "inline-block", padding: "16px 44px", borderRadius: "12px",
            border: `1.5px solid ${BURGUNDY_BORDER}`,
            background: BURGUNDY_LIGHT, color: BURGUNDY,
            fontSize: "15px", fontWeight: 700, textDecoration: "none",
          }}>
            Retake the quiz
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: `1.5px solid ${BURGUNDY_BORDER}`, padding: "28px 32px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: "12px",
      }}>
        <span style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--faint)" }}>Profyle</span>
        <span style={{ fontSize: "12px", color: "var(--faint)" }}>profyle.one</span>
      </footer>

    </div>
  );
}

"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { QuizResult } from "@/lib/types";
import {
  ARCHETYPE_THEMES,
  ADJECTIVE_PILL_COLORS,
  ATTRIBUTE_LABELS,
  getIndustryRecommendations,
  ARCHETYPE_POPULATION,
  DIMENSION_POPULATION,
} from "@/lib/archetypes";
import { ArchetypeCharacter } from "@/components/characters";
import { ShareCard } from "@/components/ShareCard";
import type { ShareCardHandle } from "@/components/ShareCard";

function buildCardImageUrl(result: QuizResult): string {
  const base = typeof window !== "undefined" ? window.location.origin : "";
  const archetypePct = ARCHETYPE_POPULATION[result.archetype] ?? 20;
  const dimPct = DIMENSION_POPULATION[result.prefix] ?? 25;
  const permutationPct = Math.round(archetypePct * dimPct / 100 * 10) / 10;
  const p = new URLSearchParams({
    p: result.prefix,
    a: result.archetype,
    t: result.tagline,
    e: String(result.attributes.execution),
    v: String(result.attributes.vision),
    i: String(result.attributes.independence),
    c: String(result.attributes.collaboration),
    ad: String(result.attributes.adaptability),
    j1: result.adjectives[0] ?? "",
    j2: result.adjectives[1] ?? "",
    j3: result.adjectives[2] ?? "",
    b: result.blindSpot,
    w1: result.compatibleWith[0] ?? "",
    w2: result.compatibleWith[1] ?? "",
    pct: String(permutationPct),
  });
  return `${base}/api/card-image?${p}`;
}

export default function ResultsPage() {
  const router = useRouter();
  const [result, setResult] = useState<QuizResult | null>(null);
  const [mounted, setMounted] = useState(false);
  const [cardFormat, setCardFormat] = useState<"story" | "linkedin">("story");
  const barsRef = useRef<HTMLDivElement>(null);
  const [barsVisible, setBarsVisible] = useState(false);
  const shareCardRef = useRef<ShareCardHandle>(null);
  const [cardBlob, setCardBlob] = useState<Blob | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem("profyle_result");
    if (!raw) {
      router.replace("/quiz");
      return;
    }
    try {
      setResult(JSON.parse(raw));
    } catch {
      router.replace("/quiz");
    }
    setMounted(true);
  }, [router]);

  // Trigger bar animation when section scrolls into view
  useEffect(() => {
    if (!barsRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setBarsVisible(true); },
      { threshold: 0.2 }
    );
    observer.observe(barsRef.current);
    return () => observer.disconnect();
  }, [result]);

  // Pre-fetch card image blob so iOS share is instant within user gesture
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

  if (!mounted || !result) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontSize: "13px", color: "var(--faint)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
          Loading…
        </div>
      </div>
    );
  }

  const theme = ARCHETYPE_THEMES[result.archetype];
  const industryQ18 = result.industryAnswers[0] ?? "A";
  const industry = getIndustryRecommendations(result.archetype, industryQ18);
  const attrEntries = Object.entries(result.attributes) as [keyof typeof result.attributes, number][];

  const cardImageUrl = result ? buildCardImageUrl(result) : "";
  const filename = result ? `profyle-${result.prefix.toLowerCase()}-${result.archetype.toLowerCase()}.png` : "profyle.png";

  const handleStoryDownload = async () => {
    if (isDownloading) return;
    setIsDownloading(true);
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent) ||
      (/Macintosh/i.test(navigator.userAgent) && navigator.maxTouchPoints > 1);

    try {
      let blob = (cardBlob && cardBlob.size > 0) ? cardBlob : null;
      if (!blob) blob = await fetch(cardImageUrl).then(r => r.blob());

      if (isIOS && blob && navigator.share) {
        const file = new File([blob], filename, { type: "image/png" });
        if (navigator.canShare?.({ files: [file] })) {
          try { await navigator.share({ files: [file] }); } catch (e) { if ((e as Error)?.name !== "AbortError") throw e; }
          return;
        }
        // Fallback: open in new tab so user can long-press → Save to Photos
        const url = URL.createObjectURL(blob);
        window.open(url, "_blank");
        setTimeout(() => URL.revokeObjectURL(url), 60000);
        return;
      }

      // Desktop / Android: trigger download
      const objectUrl = URL.createObjectURL(blob!);
      const a = document.createElement("a");
      a.href = objectUrl; a.download = filename;
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(objectUrl), 2000);
    } catch (err) {
      console.error("Download failed:", err);
    } finally {
      setIsDownloading(false);
    }
  };

  const shareUrl = typeof window !== "undefined" ? window.location.origin : "https://www.profyle.one";
  const shareMsg = `I'm a ${result.fullTitle} on Profyle.\n"${result.tagline}"\n\nWhat's your type? → ${shareUrl}`;
  const shareSlug = `profyle-${result.prefix.toLowerCase()}-${result.archetype.toLowerCase()}.png`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareMsg);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = shareMsg;
      ta.style.cssText = "position:fixed;left:-9999px;top:-9999px;opacity:0";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      try { document.execCommand("copy"); } catch { /* silent */ }
      document.body.removeChild(ta);
    }
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const captureAndShare = async (mode: "whatsapp" | "generic") => {
    let blob = (cardBlob && cardBlob.size > 0) ? cardBlob : null;
    if (!blob) {
      try { blob = await fetch(cardImageUrl).then(r => r.blob()); } catch { /* ignore */ }
    }

    const file = blob ? new File([blob], shareSlug, { type: "image/png" }) : null;

    // Mobile: native share sheet — call navigator.share before any await
    if (navigator.share) {
      const canShareFiles = file && !!navigator.canShare?.({ files: [file] });
      try {
        if (canShareFiles) {
          await navigator.share({ title: result.fullTitle, files: [file!], text: shareMsg });
        } else {
          await navigator.share({ title: result.fullTitle, text: shareMsg, url: shareUrl });
        }
        return;
      } catch (err) {
        // AbortError = user dismissed sheet — don't fall through
        if ((err as Error)?.name === "AbortError") return;
        // Other errors (e.g. file type not supported) — fall through to fallback
      }
    }

    // Desktop / unsupported browser fallback
    if (mode === "whatsapp") {
      window.open(`https://wa.me/?text=${encodeURIComponent(shareMsg)}`, "_blank");
    } else {
      await handleCopyLink();
    }
  };

  const sectionStyle: React.CSSProperties = {
    maxWidth: "720px",
    margin: "0 auto",
    padding: "0 24px",
  };

  const dividerStyle: React.CSSProperties = {
    borderTop: "1.5px solid var(--border)",
    maxWidth: "720px",
    margin: "0 auto",
  };

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='10' cy='10' r='1.4' fill='%230E0E0E' fill-opacity='0.07'/%3E%3C/svg%3E\")", backgroundSize: "20px 20px" }}>

      {/* ─── 1. HERO ─── */}
      <section
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "80px 24px 64px",
          position: "relative",
          background: theme.bgTint,
        }}
      >
        {/* Wordmark */}
        <Link
          href="/"
          style={{
            position: "absolute",
            top: "28px",
            left: "28px",
            fontSize: "12px",
            fontWeight: 700,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "var(--ink)",
            textDecoration: "none",
          }}
        >
          Profyle
        </Link>

        {/* Character */}
        <div
          className="animate-scale-in"
          style={{ marginBottom: "24px" }}
        >
          <ArchetypeCharacter archetype={result.archetype} size={180} />
        </div>

        {/* Label */}
        <div
          className="animate-fade-up"
          style={{
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: theme.accent,
            marginBottom: "16px",
            animationDelay: "100ms",
          }}
        >
          Your type
        </div>

        {/* Type name */}
        <h1
          className="animate-fade-up"
          style={{
            fontSize: "clamp(52px, 10vw, 80px)",
            fontWeight: 900,
            letterSpacing: "-0.04em",
            lineHeight: 1,
            color: "var(--ink)",
            marginBottom: "20px",
            animationDelay: "180ms",
          }}
        >
          {result.fullTitle}
        </h1>

        {/* Tagline */}
        <p
          className="animate-fade-up"
          style={{
            fontSize: "clamp(16px, 2.5vw, 20px)",
            fontWeight: 500,
            color: "var(--muted)",
            maxWidth: "480px",
            lineHeight: 1.5,
            marginBottom: "40px",
            animationDelay: "260ms",
          }}
        >
          {result.tagline}
        </p>

        {/* CTAs */}
        <div
          className="animate-fade-up"
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
            justifyContent: "center",
            animationDelay: "340ms",
          }}
        >
          <button
            onClick={() => {
              const el = document.getElementById("share-card");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
            style={{
              padding: "14px 28px",
              borderRadius: "12px",
              background: theme.accent,
              color: "white",
              fontSize: "14px",
              fontWeight: 700,
              border: "none",
              cursor: "pointer",
              fontFamily: "inherit",
              letterSpacing: "0.01em",
            }}
          >
            Share my result
          </button>
          <button
            onClick={() => {
              const el = document.getElementById("deep-dive");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
            style={{
              padding: "14px 28px",
              borderRadius: "12px",
              background: "transparent",
              color: "var(--ink)",
              fontSize: "14px",
              fontWeight: 700,
              border: "1.5px solid var(--border)",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Explore my profile ↓
          </button>
        </div>
      </section>

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
                  padding: "8px 18px",
                  borderRadius: "8px",
                  fontSize: "12px",
                  fontWeight: 700,
                  letterSpacing: "0.02em",
                  border: cardFormat === fmt ? `1.5px solid ${theme.accent}` : "1.5px solid var(--border)",
                  background: cardFormat === fmt ? theme.pillBg : "transparent",
                  color: cardFormat === fmt ? theme.accent : "var(--muted)",
                  cursor: "pointer",
                  fontFamily: "inherit",
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
                <div style={{ boxShadow: "0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06)" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={cardImageUrl} width={270} height={480} alt="Your Profyle card" style={{ display: "block" }}/>
                </div>
                <button
                  onClick={handleStoryDownload}
                  disabled={isDownloading}
                  style={{
                    padding: "11px 22px", borderRadius: "10px",
                    background: isDownloading ? "var(--muted)" : "var(--ink)",
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
              <ShareCard ref={shareCardRef} result={result} format="linkedin" mobileBlob={cardBlob}/>
            )}
          </div>

          {/* Share link buttons */}
          <div style={{ display: "flex", gap: "10px", marginTop: "20px", flexWrap: "wrap" }}>
            <button
              onClick={() => captureAndShare("generic")}
              style={{
                padding: "12px 24px", borderRadius: "10px",
                background: theme.accent, color: "white",
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
              onClick={() => captureAndShare("whatsapp")}
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
              onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent("https://www.profyle.one")}`, "_blank")}
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
                background: "transparent", color: isCopied ? theme.accent : "var(--ink)",
                fontSize: "14px", fontWeight: 700,
                border: `1.5px solid ${isCopied ? theme.accent : "var(--border)"}`,
                cursor: "pointer", fontFamily: "inherit",
                transition: "color 200ms ease, border-color 200ms ease",
              }}
            >
              {isCopied ? "Copied ✓" : "Copy link"}
            </button>
          </div>
        </div>
      </section>

      <div style={dividerStyle} />

      {/* ─── 3. RARITY ─── */}
      <section style={{ padding: "64px 0" }}>
        <div style={sectionStyle}>
          {(() => {
            const archetypePct = ARCHETYPE_POPULATION[result.archetype];
            const dimPct = DIMENSION_POPULATION[result.prefix];
            const permutationPct = Math.round(archetypePct * dimPct / 100 * 10) / 10;
            const allArchetypes: Array<typeof result.archetype> = ["Builder", "Anchor", "Catalyst", "Sovereign", "Disruptor"];
            return (
              <>
                <div style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--faint)", marginBottom: "16px" }}>
                  How rare is your type
                </div>
                <div style={{ marginBottom: "32px" }}>
                  <p style={{ fontSize: "clamp(22px, 3.5vw, 30px)", fontWeight: 800, letterSpacing: "-0.03em", color: "var(--ink)", lineHeight: 1.2, marginBottom: "8px" }}>
                    Only <span style={{ color: theme.accent }}>{permutationPct}%</span> of people are {result.fullTitle}.
                  </p>
                  <p style={{ fontSize: "15px", fontWeight: 400, color: "var(--muted)", lineHeight: 1.6 }}>
                    {archetypePct}% of people share your archetype. Your {result.prefix.toLowerCase()} dimension narrows that to a rare {permutationPct}%.
                  </p>
                </div>

                {/* Archetype breakdown bar chart */}
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "480px" }}>
                  {allArchetypes.map((a) => {
                    const pct = ARCHETYPE_POPULATION[a];
                    const isYours = a === result.archetype;
                    const t = ARCHETYPE_THEMES[a];
                    return (
                      <div key={a} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <span style={{ fontSize: "12px", fontWeight: isYours ? 700 : 500, color: isYours ? "var(--ink)" : "var(--muted)", width: "80px", flexShrink: 0 }}>
                          {a}
                        </span>
                        <div style={{ flex: 1, height: "8px", borderRadius: "4px", background: "var(--border)", overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${(pct / 24) * 100}%`, borderRadius: "4px", background: isYours ? t.accent : "var(--border)", transition: "width 800ms ease" }}/>
                        </div>
                        <span style={{ fontSize: "12px", fontWeight: isYours ? 700 : 400, color: isYours ? t.accent : "var(--faint)", width: "36px", textAlign: "right" }}>
                          {pct}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              </>
            );
          })()}
        </div>
      </section>

      <div style={dividerStyle} />

      {/* ─── 4. ATTRIBUTES ─── */}
      <section style={{ padding: "64px 0" }}>
        <div style={sectionStyle}>
          <div style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--faint)", marginBottom: "24px" }}>
            Your attributes
          </div>
          <div ref={barsRef} style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "520px" }}>
            {attrEntries.map(([key, val], idx) => {
              const pct = (val / 5) * 100;
              return (
                <div key={key}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "7px" }}>
                    <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--ink)" }}>{ATTRIBUTE_LABELS[key]}</span>
                    <span style={{ fontSize: "12px", fontWeight: 600, color: theme.accent }}>{val}/5</span>
                  </div>
                  <div style={{ height: "6px", background: theme.pillBorder, borderRadius: "3px", overflow: "hidden" }}>
                    <div style={{
                      height: "100%", background: theme.accent, borderRadius: "3px",
                      width: barsVisible ? `${pct}%` : "0%",
                      transition: `width 800ms cubic-bezier(0.16,1,0.3,1) ${idx * 100}ms`,
                    }}/>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ display: "flex", gap: "8px", marginTop: "28px", flexWrap: "wrap" }}>
            {result.adjectives.map((adj) => (
              <span key={adj} style={{
                padding: "8px 18px", borderRadius: "99px",
                background: theme.pillBg, border: `1.5px solid ${theme.pillBorder}`,
                fontSize: "13px", fontWeight: 700, color: theme.accent,
              }}>
                {adj}
              </span>
            ))}
          </div>
        </div>
      </section>

      <div style={dividerStyle} />

      {/* ─── 5. WHO YOU ARE (DEEP DIVE) ─── */}
      <section id="deep-dive" style={{ padding: "64px 0" }}>
        <div style={sectionStyle}>
          <div style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--faint)", marginBottom: "20px" }}>
            Who you are
          </div>
          <h2 style={{ fontSize: "clamp(24px, 4vw, 32px)", fontWeight: 800, letterSpacing: "-0.03em", color: "var(--ink)", marginBottom: "20px", lineHeight: 1.2 }}>
            {result.fullTitle}
          </h2>
          <p style={{ fontSize: "17px", fontWeight: 400, color: "var(--ink)", lineHeight: 1.7, maxWidth: "600px" }}>
            {result.description}
          </p>
        </div>
      </section>

      <div style={dividerStyle} />

      {/* ─── 5. FAMOUS PEOPLE ─── */}
      <section style={{ padding: "64px 0" }}>
        <div style={sectionStyle}>
          <div style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--faint)", marginBottom: "20px" }}>
            Famous people with your type
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {result.famousPeople.map((person, i) => (
              <div
                key={person.name}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "16px",
                  padding: "20px 22px",
                  borderRadius: "16px",
                  background: "var(--surface)",
                  border: "1.5px solid var(--border)",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                }}
              >
                {/* Index */}
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "8px",
                    background: theme.pillBg,
                    border: `1.5px solid ${theme.pillBorder}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "13px",
                    fontWeight: 800,
                    color: theme.accent,
                    flexShrink: 0,
                  }}
                >
                  {i + 1}
                </div>
                <div>
                  <div style={{ fontSize: "15px", fontWeight: 700, color: "var(--ink)", marginBottom: "4px" }}>
                    {person.name}
                  </div>
                  <div style={{ fontSize: "14px", fontWeight: 400, color: "var(--muted)", lineHeight: 1.5 }}>
                    {person.reason}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div style={dividerStyle} />

      {/* ─── 5. HOW YOU WORK ─── */}
      <section style={{ padding: "64px 0" }}>
        <div style={sectionStyle}>
          <div style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--faint)", marginBottom: "20px" }}>
            How you work best
          </div>
          <h2 style={{ fontSize: "clamp(22px, 3.5vw, 28px)", fontWeight: 800, letterSpacing: "-0.03em", color: "var(--ink)", marginBottom: "20px", lineHeight: 1.2 }}>
            Your working style
          </h2>
          <p style={{ fontSize: "16px", fontWeight: 400, color: "var(--ink)", lineHeight: 1.7, maxWidth: "600px", marginBottom: "28px" }}>
            {result.howYouWork}
          </p>

          {/* Strength attributes */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {attrEntries
              .filter(([, v]) => v >= 4)
              .map(([key, val]) => (
                <span
                  key={key}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "99px",
                    background: theme.pillBg,
                    border: `1.5px solid ${theme.pillBorder}`,
                    fontSize: "13px",
                    fontWeight: 700,
                    color: theme.accent,
                  }}
                >
                  {ATTRIBUTE_LABELS[key]} {val}/5
                </span>
              ))}
          </div>
        </div>
      </section>

      <div style={dividerStyle} />

      {/* ─── 6. COMPATIBLE WITH ─── */}
      <section style={{ padding: "64px 0" }}>
        <div style={sectionStyle}>
          <div style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--faint)", marginBottom: "20px" }}>
            Compatible with
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {result.compatibleWith.map((type) => {
              const t = ARCHETYPE_THEMES[type];
              return (
                <div
                  key={type}
                  style={{
                    padding: "24px",
                    borderRadius: "16px",
                    background: t.bgTint,
                    border: `1.5px solid ${t.pillBorder}`,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                    <span
                      style={{
                        padding: "5px 14px",
                        borderRadius: "99px",
                        background: t.pillBg,
                        border: `1.5px solid ${t.pillBorder}`,
                        fontSize: "13px",
                        fontWeight: 700,
                        color: t.accent,
                      }}
                    >
                      The {type}
                    </span>
                  </div>
                  <p style={{ fontSize: "14px", fontWeight: 400, color: "var(--ink)", lineHeight: 1.6 }}>
                    Your strengths complement each other. Where you lead, they follow — and vice versa. Together you cover the full spectrum of what great teams need.
                  </p>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: "24px", padding: "18px 22px", borderRadius: "14px", background: "var(--surface)", border: "1.5px solid var(--border)" }}>
            <p style={{ fontSize: "14px", fontWeight: 500, color: "var(--muted)", lineHeight: 1.5 }}>
              Know someone who might match? Send them to{" "}
              <strong style={{ color: "var(--ink)" }}>profyle.one</strong> to find their type.
            </p>
          </div>
        </div>
      </section>

      <div style={dividerStyle} />

      {/* ─── 7. WHERE YOU BELONG ─── */}
      <section style={{ padding: "64px 0" }}>
        <div style={sectionStyle}>
          <div style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--faint)", marginBottom: "20px" }}>
            Where you belong
          </div>
          <h2 style={{ fontSize: "clamp(22px, 3.5vw, 28px)", fontWeight: 800, letterSpacing: "-0.03em", color: "var(--ink)", marginBottom: "24px", lineHeight: 1.2 }}>
            Industries & companies that fit your profile
          </h2>

          {/* Industries */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "28px" }}>
            {industry.industries.map((ind) => (
              <span
                key={ind}
                style={{
                  padding: "8px 16px",
                  borderRadius: "10px",
                  background: "var(--surface)",
                  border: "1.5px solid var(--border)",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "var(--ink)",
                }}
              >
                {ind}
              </span>
            ))}
          </div>

          {/* Companies */}
          <div style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--faint)", marginBottom: "12px" }}>
            Companies to watch
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {industry.companies.map((co) => (
              <span
                key={co}
                style={{
                  padding: "8px 16px",
                  borderRadius: "10px",
                  background: theme.pillBg,
                  border: `1.5px solid ${theme.pillBorder}`,
                  fontSize: "14px",
                  fontWeight: 700,
                  color: theme.accent,
                }}
              >
                {co}
              </span>
            ))}
          </div>
        </div>
      </section>

      <div style={dividerStyle} />

      {/* ─── 8. FOOTER ─── */}
      <footer style={{ padding: "64px 24px 48px", textAlign: "center" }}>
        <div style={{ maxWidth: "480px", margin: "0 auto" }}>
          <div style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--faint)", marginBottom: "16px" }}>
            Profyle
          </div>
          <h3 style={{ fontSize: "clamp(24px, 4vw, 32px)", fontWeight: 900, letterSpacing: "-0.03em", color: "var(--ink)", marginBottom: "12px" }}>
            Share your type
          </h3>
          <p style={{ fontSize: "15px", fontWeight: 400, color: "var(--muted)", marginBottom: "28px", lineHeight: 1.6 }}>
            Find out who else on your team has taken Profyle.
          </p>
          <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={() => captureAndShare("generic")}
              style={{
                padding: "14px 28px", borderRadius: "12px",
                background: theme.accent, color: "white",
                fontSize: "14px", fontWeight: 700, border: "none",
                cursor: "pointer", fontFamily: "inherit",
                display: "flex", alignItems: "center", gap: "8px",
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
              </svg>
              Share my result
            </button>
            <button
              onClick={() => captureAndShare("whatsapp")}
              style={{
                padding: "14px 28px", borderRadius: "12px",
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
            <Link
              href="/quiz"
              style={{
                padding: "14px 28px", borderRadius: "12px",
                background: "transparent", color: "var(--ink)",
                fontSize: "14px", fontWeight: 700,
                border: "1.5px solid var(--border)",
                textDecoration: "none", display: "inline-flex",
                alignItems: "center",
              }}
            >
              Retake quiz
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

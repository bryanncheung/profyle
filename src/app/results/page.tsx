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
} from "@/lib/archetypes";
import { ArchetypeCharacter } from "@/components/characters";
import { ShareCard } from "@/components/ShareCard";
import type { ShareCardHandle } from "@/components/ShareCard";

export default function ResultsPage() {
  const router = useRouter();
  const [result, setResult] = useState<QuizResult | null>(null);
  const [mounted, setMounted] = useState(false);
  const [cardFormat, setCardFormat] = useState<"story" | "linkedin">("story");
  const barsRef = useRef<HTMLDivElement>(null);
  const [barsVisible, setBarsVisible] = useState(false);
  const shareCardRef = useRef<ShareCardHandle>(null);
  const [isCapturing, setIsCapturing] = useState(false);

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

  const shareMsg = `I'm a ${result.fullTitle} on Profyle.\nprofyle.co`;

  const captureAndShare = async (mode: "whatsapp" | "generic") => {
    setIsCapturing(true);
    try {
      const blob = await shareCardRef.current?.captureStory();
      const slug = `profyle-${result.prefix.toLowerCase()}-${result.archetype.toLowerCase()}.png`;
      if (blob && navigator.canShare?.({ files: [new File([blob], slug, { type: "image/png" })] })) {
        await navigator.share({ files: [new File([blob], slug, { type: "image/png" })], text: shareMsg });
      } else if (mode === "whatsapp") {
        window.open(`https://wa.me/?text=${encodeURIComponent(shareMsg)}`, "_blank");
      } else if (navigator.share) {
        await navigator.share({ text: shareMsg });
      } else {
        navigator.clipboard.writeText(shareMsg);
      }
    } finally {
      setIsCapturing(false);
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
                {fmt === "story" ? "Instagram Story" : "LinkedIn Post"}
              </button>
            ))}
          </div>

          {/* Scrollable container for the wider LinkedIn card */}
          <div style={{ overflowX: "auto", paddingBottom: "4px" }}>
            <ShareCard ref={shareCardRef} result={result} format={cardFormat}/>
          </div>

          {/* Share link buttons */}
          <div style={{ display: "flex", gap: "10px", marginTop: "20px", flexWrap: "wrap" }}>
            <button
              onClick={() => captureAndShare("generic")}
              disabled={isCapturing}
              style={{
                padding: "12px 24px", borderRadius: "10px",
                background: theme.accent, color: "white",
                fontSize: "14px", fontWeight: 700, border: "none",
                cursor: isCapturing ? "default" : "pointer", fontFamily: "inherit",
                display: "flex", alignItems: "center", gap: "8px",
                opacity: isCapturing ? 0.7 : 1,
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
              </svg>
              {isCapturing ? "Preparing…" : "Share"}
            </button>
            <button
              onClick={() => captureAndShare("whatsapp")}
              disabled={isCapturing}
              style={{
                padding: "12px 24px", borderRadius: "10px",
                background: "#25D366", color: "white",
                fontSize: "14px", fontWeight: 700, border: "none",
                cursor: isCapturing ? "default" : "pointer", fontFamily: "inherit",
                display: "flex", alignItems: "center", gap: "8px",
                opacity: isCapturing ? 0.7 : 1,
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WhatsApp
            </button>
            <button
              onClick={() => navigator.clipboard.writeText(shareMsg)}
              style={{
                padding: "12px 24px", borderRadius: "10px",
                background: "transparent", color: "var(--ink)",
                fontSize: "14px", fontWeight: 700,
                border: "1.5px solid var(--border)",
                cursor: "pointer", fontFamily: "inherit",
              }}
            >
              Copy link
            </button>
          </div>
        </div>
      </section>

      <div style={dividerStyle} />

      {/* ─── 3. WHO YOU ARE ─── */}
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

      {/* ─── 4. FAMOUS PEOPLE ─── */}
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
              <strong style={{ color: "var(--ink)" }}>profyle.co</strong> to find their type.
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
              disabled={isCapturing}
              style={{
                padding: "14px 28px", borderRadius: "12px",
                background: theme.accent, color: "white",
                fontSize: "14px", fontWeight: 700, border: "none",
                cursor: isCapturing ? "default" : "pointer", fontFamily: "inherit",
                display: "flex", alignItems: "center", gap: "8px",
                opacity: isCapturing ? 0.7 : 1,
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
              </svg>
              {isCapturing ? "Preparing…" : "Share my result"}
            </button>
            <button
              onClick={() => captureAndShare("whatsapp")}
              disabled={isCapturing}
              style={{
                padding: "14px 28px", borderRadius: "12px",
                background: "#25D366", color: "white",
                fontSize: "14px", fontWeight: 700, border: "none",
                cursor: isCapturing ? "default" : "pointer", fontFamily: "inherit",
                display: "flex", alignItems: "center", gap: "8px",
                opacity: isCapturing ? 0.7 : 1,
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

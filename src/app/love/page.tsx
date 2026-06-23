"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
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

const BURGUNDY = "#8B2252";
const BURGUNDY_LIGHT = "#FDF0F5";
const BURGUNDY_BORDER = "#F0C8D8";
const DOT_BG = "url(\"data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='10' cy='10' r='1.4' fill='%230E0E0E' fill-opacity='0.07'/%3E%3C/svg%3E\")";
const DOT_BG_WHITE = "url(\"data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='10' cy='10' r='1.4' fill='%23FFFFFF' fill-opacity='0.08'/%3E%3C/svg%3E\")";

const INTRO_LINES = [
  "You've felt it before.",
  "That pull toward someone.",
  "The way you love is unlike anyone else's.",
  "Some love loudly. Some love in silence.",
  "Some love freely. Some love carefully.",
  "This is yours.",
];

const LOVE_TYPES = [
  {
    name: "The Flame",
    desc: "Loves intensely, all in. You feel everything and hide nothing.",
    Char: FlameCharacter,
  },
  {
    name: "The Harbour",
    desc: "Loves through consistency. You are the person they come home to.",
    Char: HarbourCharacter,
  },
  {
    name: "The Wanderer",
    desc: "Loves deeply but needs space. You chase connection then freedom.",
    Char: WandererCharacter,
  },
  {
    name: "The Architect",
    desc: "Loves intentionally. Slow to open, impossible to shake once you do.",
    Char: ArchitectCharacter,
  },
  {
    name: "The Devotee",
    desc: "Loves through giving. You pour yourself into the people you choose.",
    Char: DevoteeCharacter,
  },
  {
    name: "The Mirror",
    desc: "Loves through understanding. You see people more clearly than they see themselves.",
    Char: MirrorCharacter,
  },
  {
    name: "The Spark",
    desc: "Loves with electricity. You make people feel alive just by being around.",
    Char: SparkCharacter,
  },
  {
    name: "The Anchor",
    desc: "Loves with steadiness. The person everyone wants to be loved by.",
    Char: AnchorLoveCharacter,
  },
];

function CinematicIntro({ onDismiss }: { onDismiss: () => void }) {
  const [visibleLines, setVisibleLines] = useState(0);
  const [showButton, setShowButton] = useState(false);
  const [dismissing, setDismissing] = useState(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    INTRO_LINES.forEach((_, i) => {
      const t = setTimeout(() => setVisibleLines(i + 1), 400 + i * 1200);
      timersRef.current.push(t);
    });
    const btnT = setTimeout(() => setShowButton(true), 400 + INTRO_LINES.length * 1200 + 500);
    timersRef.current.push(btnT);
    return () => timersRef.current.forEach(clearTimeout);
  }, []);

  function dismiss() {
    timersRef.current.forEach(clearTimeout);
    setDismissing(true);
    setTimeout(onDismiss, 500);
  }

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 100,
        background: BURGUNDY,
        backgroundImage: DOT_BG_WHITE,
        backgroundSize: "20px 20px",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        opacity: dismissing ? 0 : 1,
        transition: "opacity 0.5s ease",
      }}
    >
      {/* Skip */}
      <button
        onClick={dismiss}
        style={{
          position: "absolute", top: "24px", right: "32px",
          background: "none", border: "none", cursor: "pointer",
          fontSize: "13px", fontWeight: 600, letterSpacing: "0.06em",
          color: "rgba(255,255,255,0.45)",
          fontFamily: "inherit",
        }}
      >
        Skip
      </button>

      {/* Lines */}
      <div style={{
        display: "flex", flexDirection: "column", gap: "18px",
        textAlign: "center", padding: "0 40px", maxWidth: "640px",
      }}>
        {INTRO_LINES.map((line, i) => (
          <p
            key={i}
            style={{
              fontSize: "clamp(20px, 3vw, 30px)",
              fontWeight: 700,
              color: "white",
              margin: 0,
              lineHeight: 1.3,
              opacity: visibleLines > i ? 1 : 0,
              transform: visibleLines > i ? "translateY(0)" : "translateY(14px)",
              transition: "opacity 0.8s ease, transform 0.8s ease",
            }}
          >
            {line}
          </p>
        ))}

        {/* CTA button */}
        <div style={{
          marginTop: "32px",
          opacity: showButton ? 1 : 0,
          transform: showButton ? "translateY(0)" : "translateY(12px)",
          transition: "opacity 0.7s ease, transform 0.7s ease",
        }}>
          <button
            onClick={dismiss}
            style={{
              padding: "16px 44px", borderRadius: "12px",
              background: "white", color: BURGUNDY,
              fontSize: "15px", fontWeight: 700, letterSpacing: "0.01em",
              border: "none", cursor: "pointer", fontFamily: "inherit",
            }}
          >
            Find out how you love →
          </button>
        </div>
      </div>
    </div>
  );
}

export default function LovePage() {
  const [introDone, setIntroDone] = useState(false);

  const divider: React.CSSProperties = {
    borderTop: `1.5px solid ${BURGUNDY_BORDER}`,
    maxWidth: "960px",
    margin: "0 auto",
  };

  const sectionWrap: React.CSSProperties = {
    maxWidth: "960px",
    margin: "0 auto",
    padding: "0 24px",
  };

  return (
    <>
      {!introDone && <CinematicIntro onDismiss={() => setIntroDone(true)} />}

      <div style={{
        background: "var(--bg)", minHeight: "100vh",
        backgroundImage: DOT_BG, backgroundSize: "20px 20px",
      }}>

        {/* ── NAV ── */}
        <nav style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
          padding: "20px 32px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <Link href="/" style={{ fontSize: "13px", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--ink)", textDecoration: "none" }}>
            Profyle
          </Link>
          <Link href="/love/quiz" style={{
            padding: "9px 20px", borderRadius: "8px",
            background: BURGUNDY, color: "white",
            fontSize: "13px", fontWeight: 700, letterSpacing: "0.01em", textDecoration: "none",
          }}>
            Take the quiz
          </Link>
        </nav>

        {/* ── HERO ── */}
        <section style={{
          minHeight: "100vh",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          textAlign: "center", padding: "120px 24px 80px",
        }}>
          <span style={{
            fontSize: "11px", fontWeight: 700, letterSpacing: "0.18em",
            textTransform: "uppercase", color: BURGUNDY,
            marginBottom: "28px", display: "block",
          }}>
            Dimension 02
          </span>

          <h1 style={{
            fontSize: "clamp(52px, 10vw, 88px)",
            fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1.0,
            color: "var(--ink)", maxWidth: "680px", marginBottom: "28px",
          }}>
            How you love.
          </h1>

          <p style={{
            fontSize: "clamp(16px, 2vw, 19px)", fontWeight: 400,
            color: "var(--muted)", maxWidth: "460px", lineHeight: 1.65, marginBottom: "40px",
          }}>
            Most people never understand their own patterns in love. This changes that.
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "center", marginBottom: "48px" }}>
            {LOVE_TYPES.slice(0, 4).map(({ name }) => (
              <span key={name} style={{
                padding: "8px 18px", borderRadius: "99px",
                background: BURGUNDY_LIGHT, border: `1.5px solid ${BURGUNDY_BORDER}`,
                fontSize: "13px", fontWeight: 600, color: BURGUNDY,
              }}>
                {name}
              </span>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "14px" }}>
            <Link href="/love/quiz" style={{
              display: "inline-block", padding: "16px 44px", borderRadius: "12px",
              background: BURGUNDY, color: "white",
              fontSize: "15px", fontWeight: 700, letterSpacing: "0.01em", textDecoration: "none",
            }}>
              Find out how you love →
            </Link>
            <p style={{ fontSize: "13px", color: "var(--faint)", fontWeight: 500, letterSpacing: "0.02em" }}>
              Free · No signup · 8 minutes
            </p>
          </div>
        </section>

        <div style={divider} />

        {/* ── THE 8 TYPES ── */}
        <section style={{ padding: "80px 0 88px" }}>
          <div style={sectionWrap}>
            <div style={{ marginBottom: "48px" }}>
              <div style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--faint)", marginBottom: "16px" }}>
                The 8 types
              </div>
              <h2 style={{ fontSize: "clamp(26px, 4vw, 36px)", fontWeight: 900, letterSpacing: "-0.03em", color: "var(--ink)", lineHeight: 1.15 }}>
                Which one are you?
              </h2>
            </div>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: "16px",
            }}>
              {LOVE_TYPES.map(({ name, desc, Char }) => (
                <div key={name} style={{
                  padding: "28px 22px 24px", borderRadius: "20px",
                  background: BURGUNDY_LIGHT, border: `1.5px solid ${BURGUNDY_BORDER}`,
                  display: "flex", flexDirection: "column", alignItems: "flex-start",
                }}>
                  <div style={{ marginBottom: "16px", alignSelf: "center" }}>
                    <Char size={96} />
                  </div>
                  <div style={{ fontSize: "13px", fontWeight: 800, letterSpacing: "0.01em", color: BURGUNDY, marginBottom: "8px" }}>
                    {name}
                  </div>
                  <p style={{ fontSize: "13px", fontWeight: 400, color: "var(--muted)", lineHeight: 1.55, margin: 0 }}>
                    {desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div style={divider} />

        {/* ── HOW IT WORKS ── */}
        <section style={{ padding: "80px 0 88px" }}>
          <div style={sectionWrap}>
            <div style={{ marginBottom: "48px" }}>
              <div style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--faint)", marginBottom: "16px" }}>
                How it works
              </div>
              <h2 style={{ fontSize: "clamp(26px, 4vw, 36px)", fontWeight: 900, letterSpacing: "-0.03em", color: "var(--ink)", lineHeight: 1.15 }}>
                Three steps to your type
              </h2>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "32px" }}>
              {[
                { num: "01", title: "Answer 24 questions", body: "Scenario-based, reflective, and uncomfortably accurate prompts." },
                { num: "02", title: "Get your love type",  body: "One of 32 possible outcomes built from 8 archetypes and 4 love dimensions." },
                { num: "03", title: "Share your card",     body: "Download a shareable card for Instagram stories or LinkedIn. Show the world how you love." },
              ].map(({ num, title, body }) => (
                <div key={num}>
                  <div style={{ fontSize: "13px", fontWeight: 800, color: BURGUNDY, letterSpacing: "0.08em", marginBottom: "16px", opacity: 0.5 }}>
                    {num}
                  </div>
                  <h3 style={{ fontSize: "18px", fontWeight: 800, letterSpacing: "-0.02em", color: "var(--ink)", marginBottom: "10px", lineHeight: 1.25 }}>
                    {title}
                  </h3>
                  <p style={{ fontSize: "14px", color: "var(--muted)", lineHeight: 1.6, margin: 0 }}>
                    {body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div style={divider} />

        {/* ── BOTTOM CTA ── */}
        <section style={{ padding: "96px 24px 112px", textAlign: "center" }}>
          <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--faint)", marginBottom: "24px" }}>
            Free · No signup · 8 minutes
          </p>
          <h2 style={{
            fontSize: "clamp(36px, 6vw, 60px)", fontWeight: 900,
            letterSpacing: "-0.04em", lineHeight: 1.05, color: "var(--ink)", marginBottom: "36px",
          }}>
            Stop guessing how you love.<br />Find out.
          </h2>
          <Link href="/love/quiz" style={{
            display: "inline-block", padding: "18px 52px", borderRadius: "14px",
            background: BURGUNDY, color: "white",
            fontSize: "16px", fontWeight: 700, letterSpacing: "0.01em", textDecoration: "none",
          }}>
            Find your type →
          </Link>
        </section>

        {/* ── FOOTER ── */}
        <footer style={{
          borderTop: `1.5px solid ${BURGUNDY_BORDER}`, padding: "28px 32px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: "12px",
        }}>
          <span style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--faint)" }}>
            Profyle
          </span>
          <span style={{ fontSize: "12px", color: "var(--faint)" }}>
            profyle.one
          </span>
        </footer>

      </div>
    </>
  );
}

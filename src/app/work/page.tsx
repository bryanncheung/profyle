"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ARCHETYPE_THEMES } from "@/lib/archetypes";
import {
  BuilderCharacter,
  DisruptorCharacter,
  AnchorCharacter,
  CatalystCharacter,
  SovereignCharacter,
} from "@/components/characters";

const VIOLET = "#6B3FD0";
const DOT_BG_WHITE = "url(\"data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='10' cy='10' r='1.4' fill='%23FFFFFF' fill-opacity='0.08'/%3E%3C/svg%3E\")";
const SESSION_KEY = "work-intro-seen";

const INTRO_LINES = [
  "You show up every day.",
  "You deliver.",
  "But do you know how you actually work?",
  "Some lead quietly.",
  "Some lead loudly.",
  "Some build.",
  "Some disrupt.",
  "This is you.",
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
    sessionStorage.setItem(SESSION_KEY, "1");
    setTimeout(onDismiss, 500);
  }

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 100,
      background: VIOLET,
      backgroundImage: DOT_BG_WHITE,
      backgroundSize: "20px 20px",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      opacity: dismissing ? 0 : 1,
      transition: "opacity 0.5s ease",
    }}>
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
          <p key={i} style={{
            fontSize: "clamp(20px, 3vw, 30px)",
            fontWeight: 700, color: "white",
            margin: 0, lineHeight: 1.3,
            opacity: visibleLines > i ? 1 : 0,
            transform: visibleLines > i ? "translateY(0)" : "translateY(14px)",
            transition: "opacity 0.8s ease, transform 0.8s ease",
          }}>
            {line}
          </p>
        ))}

        {/* CTA */}
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
              background: "transparent", color: "white",
              fontSize: "15px", fontWeight: 700, letterSpacing: "0.01em",
              border: "1.5px solid rgba(255,255,255,0.7)", cursor: "pointer", fontFamily: "inherit",
            }}
          >
            Find out how you work →
          </button>
        </div>
      </div>
    </div>
  );
}

const ARCHETYPE_NAMES = ["Builder", "Disruptor", "Anchor", "Catalyst", "Sovereign"] as const;

const ARCHETYPE_COPY: Record<typeof ARCHETYPE_NAMES[number], { headline: string; body: string }> = {
  Builder:   { headline: "The Builder",   body: "The one who makes it real. While others are still talking, you're already building." },
  Disruptor: { headline: "The Disruptor", body: "Wired to question everything. You don't break rules for fun — you break the ones that deserve it." },
  Anchor:    { headline: "The Anchor",    body: "The person people look for when things go sideways. Calm, reliable, and quietly powerful." },
  Catalyst:  { headline: "The Catalyst",  body: "You light the match. Others catch fire. Energy is your tool and rooms remember you." },
  Sovereign: { headline: "The Sovereign", body: "You play a different game entirely. Impossible to categorise, impossible to ignore." },
};

const CHAR_COMPONENTS = {
  Builder: BuilderCharacter,
  Disruptor: DisruptorCharacter,
  Anchor: AnchorCharacter,
  Catalyst: CatalystCharacter,
  Sovereign: SovereignCharacter,
};

const divider: React.CSSProperties = {
  borderTop: "1.5px solid var(--border)",
  maxWidth: "960px",
  margin: "0 auto",
};

const section: React.CSSProperties = {
  maxWidth: "960px",
  margin: "0 auto",
  padding: "0 24px",
};

export default function WorkPage() {
  const [introDone, setIntroDone] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY)) setIntroDone(true);
  }, []);

  return (
    <>
      {!introDone && <CinematicIntro onDismiss={() => setIntroDone(true)} />}

      <div style={{
        background: "var(--bg)",
        minHeight: "100vh",
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='10' cy='10' r='1.4' fill='%230E0E0E' fill-opacity='0.07'/%3E%3C/svg%3E\")",
        backgroundSize: "20px 20px",
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
          <Link href="/work/quiz" style={{
            padding: "9px 20px", borderRadius: "8px",
            background: "var(--ink)", color: "white",
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
            textTransform: "uppercase", color: "var(--muted)",
            marginBottom: "28px", display: "block",
          }}>
            Dimension 01 · How you work
          </span>

          <h1 style={{
            fontSize: "clamp(48px, 9vw, 84px)",
            fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1.02,
            color: "var(--ink)", maxWidth: "720px",
            marginBottom: "32px",
          }}>
            Your professional<br />identity. Revealed.
          </h1>

          <p style={{
            fontSize: "clamp(16px, 2vw, 19px)", fontWeight: 400,
            color: "var(--muted)", maxWidth: "480px", lineHeight: 1.6, marginBottom: "40px",
          }}>
            20 questions. A profile built around how you actually think and work — not who you wish you were.
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "center", marginBottom: "48px" }}>
            {ARCHETYPE_NAMES.map((name) => {
              const theme = ARCHETYPE_THEMES[name];
              return (
                <span key={name} style={{
                  padding: "8px 18px", borderRadius: "99px",
                  background: theme.pillBg, border: `1.5px solid ${theme.pillBorder}`,
                  fontSize: "13px", fontWeight: 600, color: theme.accent,
                }}>
                  The {name}
                </span>
              );
            })}
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "14px" }}>
            <Link href="/work/quiz" style={{
              display: "inline-block", padding: "16px 44px", borderRadius: "12px",
              background: "var(--ink)", color: "white",
              fontSize: "15px", fontWeight: 700, letterSpacing: "0.01em", textDecoration: "none",
            }}>
              Find your type →
            </Link>
            <p style={{ fontSize: "13px", color: "var(--faint)", fontWeight: 500, letterSpacing: "0.02em" }}>
              Free · No signup · 5 minutes
            </p>
          </div>
        </section>

        <div style={divider} />

        {/* ── THE 5 TYPES ── */}
        <section style={{ padding: "80px 0 88px" }}>
          <div style={section}>
            <div style={{ marginBottom: "48px" }}>
              <div style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--faint)", marginBottom: "16px" }}>
                The 5 types
              </div>
              <h2 style={{ fontSize: "clamp(26px, 4vw, 36px)", fontWeight: 900, letterSpacing: "-0.03em", color: "var(--ink)", lineHeight: 1.15 }}>
                Which one are you?
              </h2>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "16px" }}>
              {ARCHETYPE_NAMES.map((name) => {
                const theme = ARCHETYPE_THEMES[name];
                const copy = ARCHETYPE_COPY[name];
                const Char = CHAR_COMPONENTS[name];
                return (
                  <div key={name} style={{
                    padding: "28px 22px 24px", borderRadius: "20px",
                    background: theme.bgTint, border: `1.5px solid ${theme.pillBorder}`,
                    display: "flex", flexDirection: "column", alignItems: "flex-start",
                  }}>
                    <div style={{ marginBottom: "16px", alignSelf: "center" }}>
                      <Char size={96} />
                    </div>
                    <div style={{ fontSize: "13px", fontWeight: 800, letterSpacing: "0.01em", color: theme.accent, marginBottom: "8px" }}>
                      {copy.headline}
                    </div>
                    <p style={{ fontSize: "13px", fontWeight: 400, color: "var(--muted)", lineHeight: 1.55, margin: 0 }}>
                      {copy.body}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <div style={divider} />

        {/* ── HOW IT WORKS ── */}
        <section style={{ padding: "80px 0 88px" }}>
          <div style={section}>
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
                { num: "01", title: "Answer 20 questions", body: "Scenario-based, word-association, and reflective prompts — no vague personality sliders." },
                { num: "02", title: "Get your work type",  body: "One of 20 possible outcomes built from 5 archetypes and 4 behavioural dimensions." },
                { num: "03", title: "Share your card",     body: "Download a shareable card for Instagram or LinkedIn. Show the world how you work." },
              ].map(({ num, title, body }) => (
                <div key={num}>
                  <div style={{ fontSize: "13px", fontWeight: 800, color: "var(--faint)", letterSpacing: "0.08em", marginBottom: "16px" }}>
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
            Free · No signup · 5 minutes
          </p>
          <h2 style={{
            fontSize: "clamp(36px, 6vw, 60px)", fontWeight: 900,
            letterSpacing: "-0.04em", lineHeight: 1.05, color: "var(--ink)",
            marginBottom: "36px",
          }}>
            Stop guessing how you work.<br />Find out.
          </h2>
          <Link href="/work/quiz" style={{
            display: "inline-block", padding: "18px 52px", borderRadius: "14px",
            background: "var(--ink)", color: "white",
            fontSize: "16px", fontWeight: 700, letterSpacing: "0.01em", textDecoration: "none",
          }}>
            Find your type →
          </Link>
        </section>

        {/* ── FOOTER ── */}
        <footer style={{
          borderTop: "1.5px solid var(--border)", padding: "28px 32px",
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

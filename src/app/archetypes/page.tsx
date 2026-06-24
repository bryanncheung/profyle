import Link from "next/link";
import { ARCHETYPE_THEMES, ARCHETYPE_POPULATION } from "@/lib/archetypes";
import { Archetype } from "@/lib/types";

const ARCHETYPE_DATA: Record<Archetype, {
  tagline: string;
  description: string;
  traits: string[];
  compatibleWith: string[];
  famousPeople: string[];
  gradient: string;
}> = {
  Builder: {
    tagline: "You don't talk about it. You build it.",
    description: "Builders are the people who make things real. While others are still debating the idea, they've already started. Methodical, output-oriented, and deeply independent — Builders find satisfaction in tangible progress that most people don't fully understand.",
    traits: ["High execution", "Works independently", "Output over optics", "Builds to last"],
    compatibleWith: ["Catalyst", "Disruptor"],
    famousPeople: ["Jensen Huang", "Tim Cook", "Sara Blakely", "Steve Wozniak"],
    gradient: "linear-gradient(135deg, #C04808 0%, #F0A478 100%)",
  },
  Disruptor: {
    tagline: "You see what everyone else has normalised. And it bothers you.",
    description: "Disruptors have an almost allergic reaction to the way things have always been done. They notice inefficiencies, assumptions, and blind spots that others walk past every day. Rare, independent, and visionary — they're the ones who change industries, not just companies.",
    traits: ["High vision", "Challenges assumptions", "Independent thinker", "Industry-level thinking"],
    compatibleWith: ["Anchor", "Builder"],
    famousPeople: ["Steve Jobs", "Alan Turing", "Ray Dalio", "Reed Hastings"],
    gradient: "linear-gradient(135deg, #C02020 0%, #F09090 100%)",
  },
  Anchor: {
    tagline: "People don't always know why they trust you. They just do.",
    description: "Anchors are the people every high-performing team quietly depends on. Not because they're the loudest or most visible, but because they're the most reliable. They hold teams together under pressure without making it look like effort — and that steadiness is rarer than any individual skill.",
    traits: ["High execution", "Team-first", "Reliable under pressure", "Builds trust naturally"],
    compatibleWith: ["Disruptor", "Catalyst"],
    famousPeople: ["Satya Nadella", "Beyoncé", "Angela Merkel", "Kobe Bryant"],
    gradient: "linear-gradient(135deg, #0A7070 0%, #68C8C8 100%)",
  },
  Catalyst: {
    tagline: "You don't just raise the energy in a room. You change what the room believes is possible.",
    description: "Catalysts operate through people. Their superpower isn't an idea or a skill — it's their ability to unlock both of those things in everyone around them. They make people feel capable of more than they thought, and that's rarer and more valuable than most realise.",
    traits: ["High vision", "Collaborative", "Unlocks others", "Inspires action"],
    compatibleWith: ["Builder", "Anchor"],
    famousPeople: ["Oprah Winfrey", "LeBron James", "Nelson Mandela", "Sheryl Sandberg"],
    gradient: "linear-gradient(135deg, #907800 0%, #D8CC70 100%)",
  },
  Sovereign: {
    tagline: "You're hard to put in a box. That's not a coincidence.",
    description: "Sovereigns don't fit neatly into one mode because they've never needed to. They can hold a vision and execute it. They can lead a room and do the quiet work. Most people develop one of these as a strength — Sovereigns develop all of them, which makes them genuinely rare.",
    traits: ["Balanced vision + execution", "Adapts to any context", "Leads by example", "Full-spectrum range"],
    compatibleWith: ["Builder", "Anchor"],
    famousPeople: ["Barack Obama", "Rihanna", "Warren Buffett", "Jeff Bezos"],
    gradient: "linear-gradient(135deg, #7040C8 0%, #C4A8F8 100%)",
  },
};

const ORDER: Archetype[] = ["Builder", "Disruptor", "Anchor", "Catalyst", "Sovereign"];

export default function ArchetypesPage() {
  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      {/* Nav */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, padding: "20px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(250,249,247,0.88)", backdropFilter: "blur(12px)", borderBottom: "1px solid var(--border)" }}>
        <Link href="/" style={{ fontSize: "12px", fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--ink)", textDecoration: "none" }}>
          Profyle
        </Link>
        <div style={{ display: "flex", gap: "24px" }}>
          <Link href="/archetypes" style={{ fontSize: "13px", fontWeight: 700, color: "var(--ink)", textDecoration: "none" }}>Archetypes</Link>
          <Link href="/dimensions" style={{ fontSize: "13px", fontWeight: 500, color: "var(--muted)", textDecoration: "none" }}>Dimensions</Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ paddingTop: "120px", paddingBottom: "64px", textAlign: "center", padding: "120px 24px 64px" }}>
        <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--faint)", marginBottom: "16px" }}>
          The five archetypes
        </p>
        <h1 style={{ fontSize: "clamp(36px, 6vw, 64px)", fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1, color: "var(--ink)", marginBottom: "20px" }}>
          Which one are you?
        </h1>
        <p style={{ fontSize: "clamp(15px, 2vw, 18px)", fontWeight: 400, color: "var(--muted)", maxWidth: "520px", margin: "0 auto 40px", lineHeight: 1.6 }}>
          Every person operates from one of five core archetypes. These aren&apos;t job titles or personality quirks — they describe how you fundamentally create value.
        </p>
        <Link href="/work/quiz" style={{ display: "inline-block", padding: "14px 32px", borderRadius: "12px", background: "var(--ink)", color: "white", fontSize: "14px", fontWeight: 700, textDecoration: "none", letterSpacing: "0.01em" }}>
          Find your archetype →
        </Link>
      </section>

      {/* Archetypes */}
      <section style={{ padding: "0 24px 96px", maxWidth: "800px", margin: "0 auto" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
          {ORDER.map((archetype) => {
            const data = ARCHETYPE_DATA[archetype];
            const theme = ARCHETYPE_THEMES[archetype];
            const pct = ARCHETYPE_POPULATION[archetype];
            return (
              <div key={archetype} style={{ borderRadius: "20px", overflow: "hidden", border: "1.5px solid var(--border)", background: "var(--surface)" }}>
                {/* Gradient header */}
                <div style={{ background: data.gradient, padding: "32px 32px 28px", position: "relative", overflow: "hidden" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <p style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)", marginBottom: "8px" }}>
                        Archetype
                      </p>
                      <h2 style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 900, letterSpacing: "-0.04em", color: "white", marginBottom: "8px" }}>
                        {archetype}
                      </h2>
                      <p style={{ fontSize: "13px", fontWeight: 500, color: "rgba(255,255,255,0.82)", fontStyle: "italic" }}>
                        &ldquo;{data.tagline}&rdquo;
                      </p>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0, marginLeft: "16px" }}>
                      <p style={{ fontSize: "32px", fontWeight: 900, color: "white", letterSpacing: "-0.03em", lineHeight: 1 }}>{pct}%</p>
                      <p style={{ fontSize: "10px", fontWeight: 600, color: "rgba(255,255,255,0.6)", letterSpacing: "0.08em", textTransform: "uppercase" }}>of people</p>
                    </div>
                  </div>
                </div>

                {/* Body */}
                <div style={{ padding: "28px 32px 32px", display: "flex", flexDirection: "column", gap: "24px" }}>
                  <p style={{ fontSize: "15px", fontWeight: 400, color: "var(--ink)", lineHeight: 1.7 }}>
                    {data.description}
                  </p>

                  <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
                    {/* Traits */}
                    <div style={{ flex: 1, minWidth: "200px" }}>
                      <p style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--faint)", marginBottom: "10px" }}>
                        Core traits
                      </p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                        {data.traits.map(t => (
                          <span key={t} style={{ padding: "5px 12px", borderRadius: "99px", background: theme.pillBg, border: `1.5px solid ${theme.pillBorder}`, fontSize: "12px", fontWeight: 600, color: theme.accent }}>
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Famous people */}
                    <div style={{ flex: 1, minWidth: "200px" }}>
                      <p style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--faint)", marginBottom: "10px" }}>
                        Famous examples
                      </p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                        {data.famousPeople.map(p => (
                          <span key={p} style={{ padding: "5px 12px", borderRadius: "8px", background: "var(--bg)", border: "1.5px solid var(--border)", fontSize: "12px", fontWeight: 600, color: "var(--ink)" }}>
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Works with */}
                  <div>
                    <p style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--faint)", marginBottom: "8px" }}>
                      Works best with
                    </p>
                    <div style={{ display: "flex", gap: "8px" }}>
                      {data.compatibleWith.map(a => {
                        const t = ARCHETYPE_THEMES[a as Archetype];
                        return (
                          <span key={a} style={{ padding: "6px 14px", borderRadius: "99px", background: t.pillBg, border: `1.5px solid ${t.pillBorder}`, fontSize: "12px", fontWeight: 700, color: t.accent }}>
                            {a}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section style={{ textAlign: "center", padding: "0 24px 96px" }}>
        <p style={{ fontSize: "18px", fontWeight: 600, color: "var(--ink)", marginBottom: "16px" }}>
          Don&apos;t know yours yet?
        </p>
        <Link href="/work/quiz" style={{ display: "inline-block", padding: "14px 32px", borderRadius: "12px", background: "var(--ink)", color: "white", fontSize: "14px", fontWeight: 700, textDecoration: "none" }}>
          Take the quiz — 5 minutes
        </Link>
      </section>
    </div>
  );
}

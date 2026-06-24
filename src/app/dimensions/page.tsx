import Link from "next/link";
import { DIMENSION_POPULATION } from "@/lib/archetypes";
import { Prefix } from "@/lib/types";

const DIMENSION_DATA: Record<Prefix, {
  label: string;
  headline: string;
  description: string;
  inPractice: string[];
  watchOut: string;
  color: string;
  bg: string;
  border: string;
}> = {
  Relentless: {
    label: "Relentless",
    headline: "You don't stop. Where others slow down, you accelerate.",
    description: "Your output is relentless — not because you're working harder than everyone else, but because you simply don't know how to half-commit. You bring an intensity to everything you touch that raises the bar for people around you, whether they asked for it or not.",
    inPractice: [
      "The last one to leave, not because you're slow but because you're not done",
      "Sets personal standards that make team targets feel low",
      "Momentum is oxygen — sitting still feels like backwards",
      "Inspires through output, not words",
    ],
    watchOut: "Burnout sneaks up on you because you treat it as a weakness rather than a signal.",
    color: "#E82B2B",
    bg: "#FEF4F4",
    border: "#F5BABA",
  },
  Quiet: {
    label: "Quiet",
    headline: "You don't need the room to know you're in it.",
    description: "Your power is understated, and that's by design. The best work you do, nobody sees coming. You don't perform capability — you just have it. People often underestimate you at first, and that's fine with you. You've seen how that plays out.",
    inPractice: [
      "Observes before speaking — and says the thing everyone else was thinking",
      "Influence travels through depth, not volume",
      "The quietest person in the meeting who changes the direction of it",
      "Does the work without needing credit — sometimes to a fault",
    ],
    watchOut: "You can disappear into your own competence and forget that visibility is part of impact.",
    color: "#0F8A8A",
    bg: "#F0FAF9",
    border: "#B0E4E0",
  },
  Bold: {
    label: "Bold",
    headline: "You walk into rooms like you own them. Not out of arrogance — out of conviction.",
    description: "You set the pace, frame the narrative, and make other people feel like they're capable of more. You don't wait for permission to have a perspective, and you've learned that the cost of staying quiet is usually higher than the cost of speaking.",
    inPractice: [
      "Names the thing in the room that nobody else will say",
      "Comfortable making a call before all the information is in",
      "Others look to you to set the tone — you've accepted that",
      "Takes up space in a way that invites others to do the same",
    ],
    watchOut: "You can fill a room so completely that quieter voices stop trying to be heard.",
    color: "#7B4FE0",
    bg: "#F5F2FF",
    border: "#D0BBFF",
  },
  Grounded: {
    label: "Grounded",
    headline: "Nothing rattles you. That's not passivity — it's the most active thing in the room.",
    description: "While everyone else is reacting, you're observing. Your steadiness gives others permission to slow down and think. You're the person people call when things are on fire — not because you know how to fight fires, but because you know how not to make them worse.",
    inPractice: [
      "Keeps the long view when everyone else has lost it",
      "Calm in a crisis in a way that isn't performed",
      "Makes complex decisions without needing to announce them",
      "Trusted precisely because you don't need to be trusted loudly",
    ],
    watchOut: "Your steadiness can read as indifference to people who need to feel urgency from you.",
    color: "#C4A800",
    bg: "#FDFBEE",
    border: "#EAE090",
  },
};

const ORDER: Prefix[] = ["Bold", "Grounded", "Quiet", "Relentless"];

export default function DimensionsPage() {
  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      {/* Nav */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, padding: "20px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(250,249,247,0.88)", backdropFilter: "blur(12px)", borderBottom: "1px solid var(--border)" }}>
        <Link href="/" style={{ fontSize: "12px", fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--ink)", textDecoration: "none" }}>
          Profyle
        </Link>
        <div style={{ display: "flex", gap: "24px" }}>
          <Link href="/archetypes" style={{ fontSize: "13px", fontWeight: 500, color: "var(--muted)", textDecoration: "none" }}>Archetypes</Link>
          <Link href="/dimensions" style={{ fontSize: "13px", fontWeight: 700, color: "var(--ink)", textDecoration: "none" }}>Dimensions</Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ padding: "120px 24px 64px", textAlign: "center" }}>
        <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--faint)", marginBottom: "16px" }}>
          The four dimensions
        </p>
        <h1 style={{ fontSize: "clamp(36px, 6vw, 64px)", fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1, color: "var(--ink)", marginBottom: "20px" }}>
          How do you operate?
        </h1>
        <p style={{ fontSize: "clamp(15px, 2vw, 18px)", fontWeight: 400, color: "var(--muted)", maxWidth: "540px", margin: "0 auto 40px", lineHeight: 1.6 }}>
          Your archetype tells you <em>what</em> you are. Your dimension tells you <em>how</em> you are it. The same archetype can show up in radically different ways depending on your dimension.
        </p>
        <Link href="/work/quiz" style={{ display: "inline-block", padding: "14px 32px", borderRadius: "12px", background: "var(--ink)", color: "white", fontSize: "14px", fontWeight: 700, textDecoration: "none", letterSpacing: "0.01em" }}>
          Find your dimension →
        </Link>
      </section>

      {/* Explainer */}
      <section style={{ padding: "0 24px 64px", maxWidth: "700px", margin: "0 auto" }}>
        <div style={{ padding: "24px 28px", borderRadius: "16px", background: "var(--surface)", border: "1.5px solid var(--border)" }}>
          <p style={{ fontSize: "14px", fontWeight: 500, color: "var(--muted)", lineHeight: 1.7 }}>
            <strong style={{ color: "var(--ink)" }}>A Quiet Catalyst</strong> and a <strong style={{ color: "var(--ink)" }}>Bold Catalyst</strong> are both wired to unlock people — but they do it completely differently. One through depth and listening, the other through presence and conviction. Same archetype. Different dimension. Totally different experience of working with them.
          </p>
        </div>
      </section>

      {/* Dimensions */}
      <section style={{ padding: "0 24px 96px", maxWidth: "800px", margin: "0 auto" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
          {ORDER.map((dim) => {
            const data = DIMENSION_DATA[dim];
            const pct = DIMENSION_POPULATION[dim];
            return (
              <div key={dim} style={{ borderRadius: "20px", border: `1.5px solid ${data.border}`, overflow: "hidden", background: "var(--surface)" }}>
                {/* Header */}
                <div style={{ background: data.bg, borderBottom: `1.5px solid ${data.border}`, padding: "32px 32px 28px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <p style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: data.color, marginBottom: "8px", opacity: 0.7 }}>
                        Dimension
                      </p>
                      <h2 style={{ fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 900, letterSpacing: "-0.03em", color: data.color, marginBottom: "10px" }}>
                        {data.label}
                      </h2>
                      <p style={{ fontSize: "14px", fontWeight: 600, color: "var(--ink)", lineHeight: 1.4, maxWidth: "420px" }}>
                        &ldquo;{data.headline}&rdquo;
                      </p>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0, marginLeft: "16px" }}>
                      <p style={{ fontSize: "32px", fontWeight: 900, color: data.color, letterSpacing: "-0.03em", lineHeight: 1 }}>{pct}%</p>
                      <p style={{ fontSize: "10px", fontWeight: 600, color: "var(--faint)", letterSpacing: "0.08em", textTransform: "uppercase" }}>of people</p>
                    </div>
                  </div>
                </div>

                {/* Body */}
                <div style={{ padding: "28px 32px 32px", display: "flex", flexDirection: "column", gap: "24px" }}>
                  <p style={{ fontSize: "15px", fontWeight: 400, color: "var(--ink)", lineHeight: 1.7 }}>
                    {data.description}
                  </p>

                  {/* In practice */}
                  <div>
                    <p style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--faint)", marginBottom: "12px" }}>
                      In practice
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      {data.inPractice.map(item => (
                        <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                          <span style={{ fontSize: "16px", color: data.color, marginTop: "1px", flexShrink: 0 }}>—</span>
                          <span style={{ fontSize: "14px", fontWeight: 400, color: "var(--ink)", lineHeight: 1.5 }}>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Watch out */}
                  <div style={{ padding: "14px 18px", borderRadius: "10px", background: data.bg, border: `1.5px solid ${data.border}` }}>
                    <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: data.color, marginBottom: "6px", opacity: 0.8 }}>
                      Watch out for
                    </p>
                    <p style={{ fontSize: "13px", fontWeight: 400, color: "var(--ink)", lineHeight: 1.5 }}>
                      {data.watchOut}
                    </p>
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
          Curious which dimension is yours?
        </p>
        <Link href="/work/quiz" style={{ display: "inline-block", padding: "14px 32px", borderRadius: "12px", background: "var(--ink)", color: "white", fontSize: "14px", fontWeight: 700, textDecoration: "none" }}>
          Take the quiz — 5 minutes
        </Link>
      </section>
    </div>
  );
}

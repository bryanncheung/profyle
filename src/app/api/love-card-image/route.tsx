import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export const runtime = "nodejs";

const GRADIENT = "linear-gradient(135deg, #1A0505 0%, #4A0E0E 25%, #8B2020 50%, #C0402A 72%, #E8652A 88%, #F5A050 100%)";
const S = 3;
const W = 270 * S;
const H = 480 * S;

export async function GET(req: NextRequest): Promise<Response> {
  try {
    const img = await render(req);
    return new Response(img.body, {
      headers: {
        ...Object.fromEntries(img.headers.entries()),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500, headers: { "content-type": "application/json" } });
  }
}

function LoveGhostSVG({ archetype }: { archetype: string }) {
  const common = { style: { width: "100%", height: "100%" } as React.CSSProperties };
  if (archetype === "Flame") return (
    <svg viewBox="0 0 130 130" fill="none" {...common}>
      <ellipse cx="65" cy="88" rx="34" ry="38" fill="rgba(255,255,255,0.22)"/>
      <path d="M44 56 C44 34 52 18 65 8 C78 18 86 34 86 56" fill="rgba(255,255,255,0.18)"/>
      <path d="M50 60 C50 42 57 26 65 16 C73 26 80 42 80 60" fill="rgba(255,255,255,0.26)"/>
      <path d="M56 63 C56 50 60 37 65 27 C70 37 74 50 74 63" fill="rgba(255,255,255,0.34)"/>
      <circle cx="57" cy="80" r="4" fill="rgba(0,0,0,0.25)"/>
      <circle cx="73" cy="80" r="4" fill="rgba(0,0,0,0.25)"/>
      <path d="M55 91 Q65 101 75 91" stroke="rgba(0,0,0,0.25)" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    </svg>
  );
  if (archetype === "Harbour") return (
    <svg viewBox="0 0 130 130" fill="none" {...common}>
      <ellipse cx="65" cy="115" rx="56" ry="14" fill="rgba(255,255,255,0.15)"/>
      <rect x="20" y="65" width="90" height="48" rx="16" fill="rgba(255,255,255,0.22)"/>
      <circle cx="65" cy="44" r="24" fill="rgba(255,255,255,0.22)"/>
      <circle cx="57" cy="40" r="3.5" fill="rgba(0,0,0,0.25)"/>
      <circle cx="73" cy="40" r="3.5" fill="rgba(0,0,0,0.25)"/>
      <path d="M58 52 Q65 58 72 52" stroke="rgba(0,0,0,0.22)" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M50 90 L50 100 M65 85 L65 100 M80 90 L80 100" stroke="rgba(0,0,0,0.15)" strokeWidth="3" strokeLinecap="round"/>
    </svg>
  );
  if (archetype === "Wanderer") return (
    <svg viewBox="0 0 130 130" fill="none" {...common}>
      <ellipse cx="60" cy="48" rx="18" ry="22" fill="rgba(255,255,255,0.22)"/>
      <rect x="44" y="68" width="32" height="40" rx="10" fill="rgba(255,255,255,0.18)"/>
      <rect x="26" y="74" width="22" height="10" rx="5" fill="rgba(255,255,255,0.18)" transform="rotate(-25 26 74)"/>
      <rect x="70" y="80" width="28" height="10" rx="5" fill="rgba(255,255,255,0.18)" transform="rotate(20 70 80)"/>
      <path d="M80 25 C92 20 105 28 100 40 C95 52 80 48 80 38" fill="rgba(255,255,255,0.14)" stroke="rgba(255,255,255,0.22)" strokeWidth="1.5"/>
    </svg>
  );
  if (archetype === "Architect") return (
    <svg viewBox="0 0 130 130" fill="none" {...common}>
      <rect x="28" y="42" width="74" height="74" rx="8" fill="rgba(255,255,255,0.14)" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5"/>
      <circle cx="65" cy="32" r="18" fill="rgba(255,255,255,0.22)"/>
      <line x1="28" y1="70" x2="102" y2="70" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5"/>
      <line x1="28" y1="90" x2="102" y2="90" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5"/>
      <line x1="54" y1="42" x2="54" y2="116" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5"/>
      <line x1="78" y1="42" x2="78" y2="116" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5"/>
    </svg>
  );
  if (archetype === "Devotee") return (
    <svg viewBox="0 0 130 130" fill="none" {...common}>
      <circle cx="65" cy="46" r="20" fill="rgba(255,255,255,0.22)"/>
      <rect x="40" y="64" width="50" height="44" rx="12" fill="rgba(255,255,255,0.18)"/>
      <path d="M10 74 Q20 66 30 74 Q20 82 10 74" fill="rgba(255,255,255,0.18)" transform="rotate(-15 20 74)"/>
      <path d="M120 74 Q110 66 100 74 Q110 82 120 74" fill="rgba(255,255,255,0.18)" transform="rotate(15 110 74)"/>
      <path d="M52 100 C52 88 58 82 65 80 C72 82 78 88 78 100" fill="rgba(255,255,255,0.15)"/>
    </svg>
  );
  if (archetype === "Mirror") return (
    <svg viewBox="0 0 130 130" fill="none" {...common}>
      <ellipse cx="65" cy="46" rx="26" ry="36" fill="rgba(255,255,255,0.18)" stroke="rgba(255,255,255,0.3)" strokeWidth="2"/>
      <rect x="58" y="82" width="14" height="30" rx="4" fill="rgba(255,255,255,0.18)"/>
      <rect x="40" y="108" width="50" height="10" rx="5" fill="rgba(255,255,255,0.22)"/>
      <circle cx="57" cy="40" r="3" fill="rgba(0,0,0,0.2)"/>
      <circle cx="73" cy="40" r="3" fill="rgba(0,0,0,0.2)"/>
    </svg>
  );
  if (archetype === "Spark") return (
    <svg viewBox="0 0 130 130" fill="none" {...common}>
      <circle cx="65" cy="65" r="26" fill="rgba(255,255,255,0.22)"/>
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
        const rad = (deg * Math.PI) / 180;
        const x1 = 65 + 30 * Math.cos(rad);
        const y1 = 65 + 30 * Math.sin(rad);
        const x2 = 65 + 52 * Math.cos(rad);
        const y2 = 65 + 52 * Math.sin(rad);
        return <line key={deg} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,0.28)" strokeWidth="3" strokeLinecap="round"/>;
      })}
      <circle cx="57" cy="60" r="4" fill="rgba(0,0,0,0.25)"/>
      <circle cx="73" cy="60" r="4" fill="rgba(0,0,0,0.25)"/>
      <path d="M55 74 Q65 82 75 74" stroke="rgba(0,0,0,0.22)" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    </svg>
  );
  // Anchor
  return (
    <svg viewBox="0 0 130 130" fill="none" {...common}>
      <circle cx="65" cy="32" r="14" fill="rgba(255,255,255,0.22)" stroke="rgba(255,255,255,0.3)" strokeWidth="2"/>
      <line x1="65" y1="46" x2="65" y2="110" stroke="rgba(255,255,255,0.28)" strokeWidth="8" strokeLinecap="round"/>
      <path d="M28 80 Q28 110 65 110 Q102 110 102 80" stroke="rgba(255,255,255,0.28)" strokeWidth="5" strokeLinecap="round" fill="none"/>
      <line x1="38" y1="65" x2="92" y2="65" stroke="rgba(255,255,255,0.28)" strokeWidth="5" strokeLinecap="round"/>
    </svg>
  );
}

function LoveMiniIcon({ archetype }: { archetype: string }) {
  if (archetype === "Flame") return (
    <svg width={9*S} height={10*S} viewBox="0 0 14 16" fill="none">
      <path d="M7 1 C10 4 12 7 12 10 C12 13 10 15 7 15 C4 15 2 13 2 10 C2 7 4 4 7 1Z" fill="white" opacity="0.85"/>
      <path d="M7 6 C8.5 8 9 9.5 9 11 C9 12.5 8 13.5 7 13.5" fill="rgba(0,0,0,0.2)" opacity="0.85"/>
    </svg>
  );
  if (archetype === "Harbour") return (
    <svg width={9*S} height={10*S} viewBox="0 0 14 16" fill="none">
      <circle cx="7" cy="4" r="2.5" stroke="white" strokeWidth="1.5" fill="none" opacity="0.85"/>
      <line x1="7" y1="6.5" x2="7" y2="14" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.85"/>
      <path d="M3 11 Q3 14 7 14 Q11 14 11 11" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.85"/>
      <line x1="3" y1="8" x2="11" y2="8" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.85"/>
    </svg>
  );
  if (archetype === "Wanderer") return (
    <svg width={10*S} height={10*S} viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6" stroke="white" strokeWidth="1.5" fill="none" opacity="0.85"/>
      <line x1="8" y1="2" x2="8" y2="14" stroke="white" strokeWidth="1.2" strokeLinecap="round" opacity="0.6"/>
      <line x1="2" y1="8" x2="14" y2="8" stroke="white" strokeWidth="1.2" strokeLinecap="round" opacity="0.6"/>
      <circle cx="8" cy="8" r="2" fill="white" opacity="0.85"/>
    </svg>
  );
  if (archetype === "Architect") return (
    <svg width={10*S} height={10*S} viewBox="0 0 16 16" fill="none">
      <rect x="2" y="2" width="12" height="12" rx="2" stroke="white" strokeWidth="1.5" fill="none" opacity="0.85"/>
      <line x1="2" y1="8" x2="14" y2="8" stroke="white" strokeWidth="1.2" opacity="0.6"/>
      <line x1="8" y1="2" x2="8" y2="14" stroke="white" strokeWidth="1.2" opacity="0.6"/>
    </svg>
  );
  if (archetype === "Devotee") return (
    <svg width={10*S} height={9*S} viewBox="0 0 16 14" fill="none">
      <path d="M8 13 C8 13 2 9 2 5 C2 3 3.5 2 5 2 C6.5 2 7.5 3 8 4 C8.5 3 9.5 2 11 2 C12.5 2 14 3 14 5 C14 9 8 13 8 13Z" fill="white" opacity="0.85"/>
    </svg>
  );
  if (archetype === "Mirror") return (
    <svg width={8*S} height={11*S} viewBox="0 0 12 18" fill="none">
      <ellipse cx="6" cy="7" rx="5" ry="7" stroke="white" strokeWidth="1.5" fill="none" opacity="0.85"/>
      <rect x="5" y="14" width="2" height="3" rx="1" fill="white" opacity="0.7"/>
      <rect x="2" y="16" width="8" height="2" rx="1" fill="white" opacity="0.7"/>
    </svg>
  );
  if (archetype === "Spark") return (
    <svg width={10*S} height={10*S} viewBox="0 0 16 16" fill="none">
      {[0, 60, 120, 180, 240, 300].map((deg) => {
        const rad = (deg * Math.PI) / 180;
        return <line key={deg} x1={8 + 3 * Math.cos(rad)} y1={8 + 3 * Math.sin(rad)} x2={8 + 7 * Math.cos(rad)} y2={8 + 7 * Math.sin(rad)} stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.85"/>;
      })}
      <circle cx="8" cy="8" r="3" fill="white" opacity="0.85"/>
    </svg>
  );
  // Anchor
  return (
    <svg width={9*S} height={11*S} viewBox="0 0 14 17" fill="none">
      <circle cx="7" cy="4" r="2.5" stroke="white" strokeWidth="1.5" fill="none" opacity="0.85"/>
      <line x1="7" y1="6" x2="7" y2="15" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.85"/>
      <path d="M3 11 Q3 15 7 15 Q11 15 11 11" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.85"/>
      <line x1="3" y1="8" x2="11" y2="8" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.85"/>
    </svg>
  );
}

async function render(req: NextRequest) {
  const sp = new URL(req.url).searchParams;
  const dimension  = sp.get("d")  ?? "Fierce";
  const archetype  = sp.get("a")  ?? "Flame";
  const tagline    = sp.get("t")  ?? "";
  const intimacy   = parseInt(sp.get("in") ?? "5");
  const express    = parseInt(sp.get("ex") ?? "5");
  const indep      = parseInt(sp.get("id") ?? "2");
  const devotion   = parseInt(sp.get("de") ?? "5");
  const openness   = parseInt(sp.get("op") ?? "5");
  const adj1       = sp.get("j1") ?? "";
  const adj2       = sp.get("j2") ?? "";
  const adj3       = sp.get("j3") ?? "";
  const blindSpot  = sp.get("b")  ?? "";
  const compat1    = sp.get("w1") ?? "";
  const compat2    = sp.get("w2") ?? "";
  const pct        = sp.get("pct") ?? "";

  const adjectives = [adj1, adj2, adj3].filter(Boolean);
  const compats    = [compat1, compat2].filter(Boolean);
  const attrs = [
    { label: "Intimacy",       value: intimacy },
    { label: "Expressiveness", value: express  },
    { label: "Independence",   value: indep    },
    { label: "Devotion",       value: devotion },
    { label: "Openness",       value: openness },
  ];

  const ADJ_STAR = "M31 1 L35 8 L43 5 L40 13 L48 16 L40 19 L43 23 L35 20 L31 25 L27 20 L19 23 L22 19 L14 16 L22 13 L19 5 L27 8 Z";
  const ADJ_HEX  = "M12 2 L58 2 L68 13 L58 24 L12 24 L2 13 Z";
  const PILL_PATH = "M14 2 L70 2 Q82 2 82 14 Q82 26 70 26 L14 26 Q2 26 2 14 Q2 2 14 2 Z";
  const DIAM_PATH = "M14 2 L70 2 L82 14 L70 26 L14 26 L2 14 Z";

  const waveW = Math.max(36, Math.min(dimension.length * 7, 70));

  return new ImageResponse(
    (
      <div style={{
        width: `${W}px`, height: `${H}px`,
        display: "flex", flexDirection: "column",
        fontFamily: "sans-serif",
        backgroundImage: GRADIENT,
        position: "relative", overflow: "hidden",
      }}>

        {/* Ghost archetype name — bleeds off bottom edge */}
        <div style={{
          position: "absolute", bottom: `-${20*S}px`, left: `-${8*S}px`,
          fontSize: `${108*S}px`, fontWeight: 900, lineHeight: 0.82,
          letterSpacing: "-0.06em", color: "rgba(255,255,255,0.08)",
          whiteSpace: "nowrap", pointerEvents: "none",
          display: "flex",
        }}>
          {archetype.toUpperCase()}
        </div>

        {/* Diagonal strip */}
        <div style={{ position: "absolute", top: `${145*S}px`, left: `-${20*S}px`, right: `-${20*S}px`, height: `${3*S}px`, background: "rgba(255,255,255,0.22)", display: "flex", transform: "rotate(-8deg)" }}/>
        <div style={{ position: "absolute", top: `${152*S}px`, left: `-${20*S}px`, right: `-${20*S}px`, height: `${1*S}px`, background: "rgba(255,255,255,0.1)", display: "flex", transform: "rotate(-8deg)" }}/>

        {/* Character top-right */}
        <div style={{
          position: "absolute", top: `${78*S}px`, right: `-${16*S}px`,
          width: `${130*S}px`, height: `${130*S}px`,
          opacity: 0.85, display: "flex", transform: "rotate(8deg)",
        }}>
          <LoveGhostSVG archetype={archetype}/>
        </div>

        {/* Content */}
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", flexDirection: "column",
          padding: `${20*S}px ${18*S}px ${38*S}px`,
        }}>

          {/* Top row */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: `${16*S}px` }}>
            <span style={{ fontSize: `${8*S}px`, fontWeight: 800, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)" }}>
              Profyle · Love
            </span>
          </div>

          {/* Dimension label + squiggly underline */}
          <div style={{ display: "flex", flexDirection: "column", marginBottom: `${4*S}px` }}>
            <span style={{ fontSize: `${10*S}px`, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.7)" }}>
              {dimension}
            </span>
            <svg width={waveW*S} height={7*S} viewBox={`0 0 ${waveW} 7`} fill="none" style={{ marginTop: `${3*S}px` }}>
              <path
                d={`M1 5 C${waveW*0.12} 2.5 ${waveW*0.25} 6 ${waveW*0.4} 3.5 C${waveW*0.55} 1 ${waveW*0.7} 6 ${waveW*0.85} 4 C${waveW*0.93} 3 ${waveW-2} 5 ${waveW-1} 5`}
                stroke="rgba(255,255,255,0.5)" strokeWidth="1.4" strokeLinecap="round" fill="none"
              />
            </svg>
          </div>

          {/* Archetype name — big, -2deg; font scales down for long names */}
          <div style={{
            display: "flex",
            fontSize: `${(archetype.length <= 5 ? 58 : archetype.length <= 6 ? 52 : archetype.length <= 7 ? 46 : archetype.length <= 8 ? 40 : 33) * S}px`,
            fontWeight: 900,
            letterSpacing: "-0.05em", color: "#fff", lineHeight: 0.85,
            transform: "rotate(-2deg)", transformOrigin: "left center",
            marginLeft: `-${2*S}px`, marginBottom: `${14*S}px`,
            textTransform: "uppercase", whiteSpace: "nowrap",
          }}>
            {archetype}
          </div>

          {/* Tagline — italic, +1deg */}
          <div style={{
            display: "flex", fontSize: `${10*S}px`, fontWeight: 600,
            color: "rgba(255,255,255,0.8)", lineHeight: 1.5,
            fontStyle: "italic", transform: "rotate(1deg)",
            maxWidth: `${170*S}px`, marginBottom: `${16*S}px`,
          }}>
            "{tagline}"
          </div>

          {/* Attribute diamond dots */}
          <div style={{ display: "flex", flexDirection: "column", gap: `${6*S}px`, marginBottom: `${6*S}px` }}>
            {attrs.map(({ label, value }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: `${7*S}px` }}>
                <span style={{ fontSize: `${6.5*S}px`, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)", width: `${78*S}px` }}>
                  {label}
                </span>
                <div style={{ display: "flex", gap: `${4*S}px`, alignItems: "center", height: `${14*S}px` }}>
                  {[1,2,3,4,5].map((i) => (
                    <div key={i} style={{
                      width: `${7*S}px`, height: `${7*S}px`, flexShrink: 0,
                      background: i <= value ? "rgba(255,255,255,0.92)" : "transparent",
                      border: `${1.5*S}px solid ${i <= value ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.28)"}`,
                      borderRadius: `${1*S}px`,
                      transform: "rotate(45deg)",
                    }}/>
                  ))}
                </div>
                <span style={{ fontSize: `${7*S}px`, fontWeight: 800, color: "rgba(255,255,255,0.7)", marginLeft: `${2*S}px` }}>
                  {value}
                </span>
              </div>
            ))}
          </div>

          {/* % stat */}
          <div style={{ display: "flex", marginBottom: `${10*S}px` }}>
            <span style={{ fontSize: `${6.5*S}px`, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)" }}>
              {pct ? `Only ${pct}% of people share this profile` : ""}
            </span>
          </div>

          {/* Adjective badges — collage */}
          {adjectives.length > 0 && (
            <div style={{ display: "flex", gap: `${0*S}px`, marginBottom: `${10*S}px`, flexWrap: "wrap" }}>
              {adjectives.map((adj, i) => {
                const bw = i === 0 ? 58 : i === 1 ? 66 : 80;
                const bh = 24;
                const rot = i === 0 ? "rotate(-4deg)" : i === 1 ? "rotate(2deg)" : "rotate(-1deg)";
                const mt  = i === 1 ? `${3*S}px` : i === 2 ? `-${2*S}px` : "0px";
                return (
                  <div key={adj} style={{ position: "relative", width: `${bw*S}px`, height: `${bh*S}px`, display: "flex", alignItems: "center", justifyContent: "center", marginRight: `-${4*S}px`, marginTop: mt, transform: rot }}>
                    <svg width={bw*S} height={bh*S} viewBox={`0 0 ${bw} ${bh}`} fill="none" style={{ position: "absolute", top: 0, left: 0 }}>
                      {i === 0 && <path d={ADJ_STAR} fill="rgba(255,255,255,0.18)" stroke="rgba(255,255,255,0.38)" strokeWidth="0.8"/>}
                      {i === 1 && <path d={ADJ_HEX}  fill="rgba(255,255,255,0.18)" stroke="rgba(255,255,255,0.38)" strokeWidth="0.8"/>}
                      {i === 2 && <ellipse cx={bw/2} cy={bh/2} rx={bw/2-2} ry={bh/2-1} fill="rgba(255,255,255,0.18)" stroke="rgba(255,255,255,0.38)" strokeWidth="0.8"/>}
                    </svg>
                    <span style={{ position: "relative", fontSize: `${7.5*S}px`, fontWeight: 800, color: "white", letterSpacing: "0.03em", whiteSpace: "nowrap" }}>
                      {adj}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Blind spot */}
          <div style={{
            display: "flex", flexWrap: "wrap",
            fontSize: `${8*S}px`, fontWeight: 500,
            color: "rgba(255,255,255,0.65)", lineHeight: 1.5,
            borderLeft: `${2*S}px solid rgba(255,255,255,0.3)`,
            paddingLeft: `${8*S}px`, marginBottom: `${10*S}px`,
          }}>
            <span style={{ fontWeight: 800, color: "#fff", marginRight: `${3*S}px` }}>Blind spot —</span>
            <span>{blindSpot}</span>
          </div>

          {/* Works with */}
          <div style={{ display: "flex", flexDirection: "column", gap: `${5*S}px` }}>
            <span style={{ fontSize: `${6.5*S}px`, fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)" }}>
              Works with
            </span>
            <div style={{ display: "flex", gap: `${6*S}px` }}>
              {compats.map((arch, idx) => (
                <div key={arch} style={{ position: "relative", width: `${84*S}px`, height: `${28*S}px`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width={84*S} height={28*S} viewBox="0 0 84 28" fill="none" style={{ position: "absolute", top: 0, left: 0 }}>
                    <path d={idx === 0 ? PILL_PATH : DIAM_PATH} fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
                  </svg>
                  <div style={{ position: "relative", display: "flex", alignItems: "center", gap: `${3*S}px`, fontSize: `${7.5*S}px`, fontWeight: 800, color: "rgba(255,255,255,0.9)", whiteSpace: "nowrap" }}>
                    <LoveMiniIcon archetype={arch}/>
                    The {arch}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer watermark */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          padding: `${6*S}px ${20*S}px ${14*S}px`,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <span style={{ fontSize: `${7*S}px`, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(20,5,5,0.5)" }}>
            profyle.one
          </span>
        </div>
      </div>
    ),
    { width: W, height: H }
  );
}

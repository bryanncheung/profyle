import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export const runtime = "nodejs";

const GRADIENTS: Record<string, string> = {
  Builder:   "linear-gradient(175deg, #C04808 0%, #D86428 22%, #E88050 48%, #F0A478 70%, #F8CAB0 85%, #FEF2E8 100%)",
  Disruptor: "linear-gradient(175deg, #C02020 0%, #D84040 22%, #E86868 48%, #F09090 70%, #F8B8B8 85%, #FEF0F0 100%)",
  Anchor:    "linear-gradient(175deg, #0A7070 0%, #189090 22%, #38AAAA 48%, #68C8C8 70%, #A4E0E0 85%, #E4F6F6 100%)",
  Catalyst:  "linear-gradient(175deg, #907800 0%, #AEA000 22%, #C4B830 48%, #D8CC70 70%, #EADFA8 85%, #FAF8E8 100%)",
  Sovereign: "linear-gradient(175deg, #7040C8 0%, #9060DE 22%, #AA80EC 48%, #C4A8F8 70%, #D8C4FE 85%, #EDE6FF 100%)",
};

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

function GhostSVG({ archetype }: { archetype: string }) {
  const common = { style: { width: "100%", height: "100%" } as React.CSSProperties };
  if (archetype === "Catalyst") return (
    <svg viewBox="0 0 110 110" fill="none" {...common}>
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
  if (archetype === "Builder") return (
    <svg viewBox="0 0 110 110" fill="none" {...common}>
      <path d="M22 44 Q22 18 55 18 Q88 18 88 44 Z" fill="white"/>
      <rect x="10" y="40" width="90" height="10" rx="5" fill="white"/>
      <circle cx="55" cy="64" r="21" fill="white"/>
      <rect x="26" y="86" width="58" height="22" rx="11" fill="white"/>
      <rect x="2" y="88" width="26" height="12" rx="6" fill="white"/>
      <rect x="82" y="88" width="26" height="12" rx="6" fill="white"/>
    </svg>
  );
  if (archetype === "Disruptor") return (
    <svg viewBox="0 0 110 110" fill="none" {...common}>
      <polygon points="32,36 36,16 42,30 48,12 55,28 62,12 68,30 74,16 78,36" fill="white"/>
      <circle cx="55" cy="54" r="22" fill="white"/>
      <circle cx="55" cy="86" r="18" fill="white"/>
      <path d="M36 68 L14 46" stroke="white" strokeWidth="12" strokeLinecap="round"/>
      <path d="M74 68 L96 46" stroke="white" strokeWidth="12" strokeLinecap="round"/>
    </svg>
  );
  if (archetype === "Anchor") return (
    <svg viewBox="0 0 110 110" fill="none" {...common}>
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
  // Sovereign
  return (
    <svg viewBox="0 0 110 110" fill="none" {...common}>
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

function MiniIcon({ archetype }: { archetype: string }) {
  if (archetype === "Builder") return (
    <svg width={11*S} height={9*S} viewBox="0 0 18 14" fill="none">
      <path d="M3 9 Q3 3 9 3 Q15 3 15 9 Z" fill="white" opacity="0.85"/>
      <rect x="1" y="8" width="16" height="5" rx="2.5" fill="white" opacity="0.85"/>
    </svg>
  );
  if (archetype === "Disruptor") return (
    <svg width={10*S} height={10*S} viewBox="0 0 16 16" fill="none">
      <polygon points="8,1 9.5,5 13.5,5 10.5,7.5 11.5,12 8,9.5 4.5,12 5.5,7.5 2.5,5 6.5,5" fill="white" opacity="0.85"/>
    </svg>
  );
  if (archetype === "Anchor") return (
    <svg width={9*S} height={11*S} viewBox="0 0 14 17" fill="none">
      <circle cx="7" cy="4" r="2.5" stroke="white" strokeWidth="1.5" fill="none" opacity="0.85"/>
      <line x1="7" y1="6" x2="7" y2="15" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.85"/>
      <path d="M3 11 Q3 15 7 15 Q11 15 11 11" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.85"/>
      <line x1="3" y1="8" x2="11" y2="8" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.85"/>
    </svg>
  );
  if (archetype === "Catalyst") return (
    <svg width={11*S} height={11*S} viewBox="0 0 16 16" fill="none">
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
    <svg width={10*S} height={10*S} viewBox="0 0 14 14" fill="none">
      <path d="M3 6 L5 2 L7 5 L9 2 L11 6 L3 6 Z" fill="white" opacity="0.85"/>
      <rect x="2" y="5.5" width="10" height="2" rx="1" fill="white" opacity="0.85"/>
      <rect x="3" y="8" width="8" height="5" rx="2" fill="white" opacity="0.85"/>
    </svg>
  );
}

async function render(req: NextRequest) {
  const sp = new URL(req.url).searchParams;
  const prefix    = sp.get("p") ?? "Bold";
  const archetype = sp.get("a") ?? "Catalyst";
  const tagline   = sp.get("t") ?? "";
  const exec      = parseInt(sp.get("e") ?? "3");
  const vis       = parseInt(sp.get("v") ?? "3");
  const ind       = parseInt(sp.get("i") ?? "3");
  const col       = parseInt(sp.get("c") ?? "3");
  const adp       = parseInt(sp.get("ad") ?? "3");
  const adj1      = sp.get("j1") ?? "";
  const adj2      = sp.get("j2") ?? "";
  const adj3      = sp.get("j3") ?? "";
  const blindSpot = sp.get("b") ?? "";
  const compat1   = sp.get("w1") ?? "";
  const compat2   = sp.get("w2") ?? "";

  const gradient = GRADIENTS[archetype] ?? GRADIENTS.Builder;
  const prefixLabel = `The ${prefix}`;
  const adjectives = [adj1, adj2, adj3].filter(Boolean);
  const compats = [compat1, compat2].filter(Boolean);
  const attrs = [
    { label: "Execution",     value: exec },
    { label: "Vision",        value: vis  },
    { label: "Independence",  value: ind  },
    { label: "Collaboration", value: col  },
    { label: "Adaptability",  value: adp  },
  ];

  const waveW = Math.max(44, Math.min(prefixLabel.length * 6.5, 80));

  const ADJ_STAR  = "M31 1 L35 8 L43 5 L40 13 L48 16 L40 19 L43 23 L35 20 L31 25 L27 20 L19 23 L22 19 L14 16 L22 13 L19 5 L27 8 Z";
  const ADJ_HEX   = "M12 2 L58 2 L68 13 L58 24 L12 24 L2 13 Z";
  const PILL_PATH = "M14 2 L70 2 Q82 2 82 14 Q82 26 70 26 L14 26 Q2 26 2 14 Q2 2 14 2 Z";
  const DIAM_PATH = "M14 2 L70 2 L82 14 L70 26 L14 26 L2 14 Z";

  return new ImageResponse(
    (
      <div
        style={{
          width: `${W}px`, height: `${H}px`,
          display: "flex", flexDirection: "column",
          fontFamily: "sans-serif",
          backgroundImage: gradient,
          position: "relative", overflow: "hidden",
        }}
      >
        {/* Dot grid */}
        <div style={{ position: "absolute", inset: 0, display: "flex", opacity: 0.18 }}>
          <svg width={W} height={H} xmlns="http://www.w3.org/2000/svg">
            {Array.from({ length: Math.ceil(W / (16*S)) * Math.ceil(H / (16*S)) }).map((_, i) => {
              const cols = Math.ceil(W / (16*S));
              return <circle key={i} cx={(i % cols)*16*S + 8*S} cy={Math.floor(i/cols)*16*S + 8*S} r={1.1*S} fill="white"/>;
            })}
          </svg>
        </div>

        {/* Ghost character */}
        <div style={{ position: "absolute", top: `${56*S}px`, right: `${10*S}px`, width: `${104*S}px`, height: `${104*S}px`, display: "flex", opacity: 0.2 }}>
          <GhostSVG archetype={archetype}/>
        </div>

        {/* Content */}
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", flexDirection: "column",
          padding: `${22*S}px ${20*S}px ${18*S}px`,
        }}>

          {/* Top row: PROFYLE only */}
          <div style={{ display: "flex", marginBottom: `${14*S}px` }}>
            <span style={{ fontSize: `${8*S}px`, fontWeight: 800, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)" }}>
              Profyle
            </span>
          </div>

          {/* "I am" label */}
          <div style={{ display: "flex", marginBottom: `${4*S}px` }}>
            <span style={{ fontSize: `${14*S}px`, fontWeight: 700, letterSpacing: "0.04em", color: "rgba(255,255,255,0.75)", fontStyle: "italic" }}>
              I am
            </span>
          </div>

          {/* Prefix + wavy underline */}
          <div style={{ display: "flex", flexDirection: "column", marginBottom: `${6*S}px` }}>
            <span style={{ fontSize: `${11*S}px`, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.88)" }}>
              {prefixLabel}
            </span>
            <svg width={waveW*S} height={7*S} viewBox={`0 0 ${waveW} 7`} fill="none" style={{ marginTop: `${3*S}px` }}>
              <path
                d={`M1 5 C${waveW*0.10} 2.5 ${waveW*0.22} 6 ${waveW*0.34} 4 C${waveW*0.46} 2 ${waveW*0.58} 6.5 ${waveW*0.72} 4.5 C${waveW*0.82} 3 ${waveW*0.92} 4.5 ${waveW-1} 5.5`}
                stroke="rgba(255,255,255,0.5)" strokeWidth="1.6" strokeLinecap="round" fill="none"
              />
            </svg>
          </div>

          {/* Archetype name */}
          <div style={{ display: "flex", fontSize: `${42*S}px`, fontWeight: 800, letterSpacing: "-0.05em", color: "#fff", marginBottom: `${18*S}px`, textTransform: "uppercase", lineHeight: 0.9 }}>
            {archetype}
          </div>

          {/* Tagline */}
          <div style={{
            display: "flex", fontSize: `${10*S}px`, fontWeight: 500,
            color: "rgba(255,255,255,0.88)", lineHeight: 1.55,
            borderLeft: `${2.5*S}px solid rgba(255,255,255,0.55)`,
            paddingLeft: `${9*S}px`, marginBottom: `${20*S}px`,
            maxWidth: `${185*S}px`,
          }}>
            {tagline}
          </div>

          {/* Attribute dots */}
          <div style={{ display: "flex", flexDirection: "column", gap: `${9*S}px`, marginBottom: `${20*S}px` }}>
            {attrs.map(({ label, value }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: `${8*S}px` }}>
                <span style={{ fontSize: `${7*S}px`, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "rgba(255,255,255,0.82)", width: `${74*S}px` }}>
                  {label}
                </span>
                <div style={{ display: "flex", gap: `${4*S}px` }}>
                  {[1,2,3,4,5].map((i) => (
                    <div key={i} style={{
                      width: `${8*S}px`, height: `${8*S}px`, borderRadius: "50%",
                      background: i <= value ? "rgba(255,255,255,0.95)" : "transparent",
                      border: `${1.5*S}px solid ${i <= value ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.45)"}`,
                    }} />
                  ))}
                </div>
                <span style={{ fontSize: `${7*S}px`, fontWeight: 800, color: "rgba(255,255,255,0.9)", marginLeft: `${2*S}px` }}>
                  {value}
                </span>
              </div>
            ))}
          </div>

          {/* Adjective badges — star / hexagon / oval */}
          {adjectives.length > 0 && (
            <div style={{ display: "flex", gap: `${6*S}px`, marginBottom: `${18*S}px` }}>
              {adjectives.map((adj, i) => {
                const bw = i === 1 ? 70 : 62;
                const bh = 26;
                return (
                  <div key={adj} style={{ position: "relative", width: `${bw*S}px`, height: `${bh*S}px`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width={bw*S} height={bh*S} viewBox={`0 0 ${bw} ${bh}`} fill="none" style={{ position: "absolute", top: 0, left: 0 }}>
                      {i === 0 && <path d={ADJ_STAR} fill="rgba(255,255,255,0.25)" stroke="rgba(255,255,255,0.45)" strokeWidth="0.8"/>}
                      {i === 1 && <path d={ADJ_HEX}  fill="rgba(255,255,255,0.25)" stroke="rgba(255,255,255,0.45)" strokeWidth="0.8"/>}
                      {i === 2 && <ellipse cx="31" cy="13" rx="28" ry="11" fill="rgba(255,255,255,0.25)" stroke="rgba(255,255,255,0.45)" strokeWidth="0.8" transform="rotate(-6 31 13)"/>}
                    </svg>
                    <span style={{ position: "relative", fontSize: `${7.5*S}px`, fontWeight: 800, color: "rgba(0,0,0,0.72)", letterSpacing: "0.3px" }}>
                      {adj}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Blind spot */}
          <div style={{ display: "flex", flexWrap: "wrap", fontSize: `${8.5*S}px`, fontWeight: 500, color: "rgba(255,255,255,0.82)", lineHeight: 1.5, marginBottom: `${14*S}px` }}>
            <span style={{ fontWeight: 800, color: "#fff", marginRight: `${3*S}px` }}>Blind spot —</span>
            <span>{blindSpot}</span>
          </div>

          {/* Works with */}
          <div style={{ display: "flex", flexDirection: "column", gap: `${6*S}px` }}>
            <span style={{ fontSize: `${7*S}px`, fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(255,255,255,0.65)" }}>
              Works with
            </span>
            <div style={{ display: "flex", gap: `${7*S}px` }}>
              {compats.map((arch, idx) => (
                <div key={arch} style={{ position: "relative", width: `${84*S}px`, height: `${28*S}px`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width={84*S} height={28*S} viewBox="0 0 84 28" fill="none" style={{ position: "absolute", top: 0, left: 0 }}>
                    <path d={idx === 0 ? PILL_PATH : DIAM_PATH} fill="rgba(255,255,255,0.22)" stroke="rgba(255,255,255,0.4)" strokeWidth="1"/>
                  </svg>
                  <div style={{ position: "relative", display: "flex", alignItems: "center", gap: `${4*S}px`, fontSize: `${7.5*S}px`, fontWeight: 800, color: "rgba(0,0,0,0.72)", whiteSpace: "nowrap" }}>
                    <MiniIcon archetype={arch}/>
                    The {arch}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          padding: `${6*S}px ${20*S}px ${14*S}px`,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <span style={{ fontSize: `${7*S}px`, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(0,0,0,0.55)" }}>
            profyle.com
          </span>
        </div>
      </div>
    ),
    { width: W, height: H }
  );
}

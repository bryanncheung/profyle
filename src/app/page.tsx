import Link from "next/link";

const DOT_BG = "url(\"data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='10' cy='10' r='1.4' fill='%230E0E0E' fill-opacity='0.07'/%3E%3C/svg%3E\")";

export default function Home() {
  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", backgroundImage: DOT_BG, backgroundSize: "20px 20px" }}>

      {/* ── NAV ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        padding: "20px 32px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <Link href="/" style={{ fontSize: "13px", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--ink)", textDecoration: "none" }}>
          Profyle
        </Link>
        <Link href="#dimensions" style={{ fontSize: "13px", fontWeight: 600, color: "var(--muted)", textDecoration: "none", letterSpacing: "0.01em" }}>
          Explore →
        </Link>
      </nav>

      {/* ── SECTION 1: HERO ── */}
      <section style={{
        minHeight: "100vh",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        textAlign: "center", padding: "120px 24px 80px",
      }}>
        <h1 style={{
          fontSize: "clamp(52px, 10vw, 96px)",
          fontWeight: 900,
          letterSpacing: "-0.04em",
          lineHeight: 1.0,
          color: "var(--ink)",
          maxWidth: "800px",
          marginBottom: "28px",
        }}>
          You are more than<br />one thing.
        </h1>

        <p style={{
          fontSize: "clamp(16px, 2vw, 20px)",
          fontWeight: 400,
          color: "var(--muted)",
          maxWidth: "520px",
          lineHeight: 1.65,
          marginBottom: "44px",
        }}>
          Profyle maps every dimension of who you are — how you work, how you love, and everything in between.
        </p>

        <Link href="#dimensions" style={{
          display: "inline-block",
          padding: "16px 44px",
          borderRadius: "12px",
          background: "var(--ink)",
          color: "white",
          fontSize: "15px",
          fontWeight: 700,
          letterSpacing: "0.01em",
          textDecoration: "none",
        }}>
          Start building your Profyle →
        </Link>
      </section>

      {/* ── SECTION 2: THE TWO PATHS ── */}
      <section id="dimensions" style={{ padding: "80px 24px 100px", maxWidth: "1040px", margin: "0 auto" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "20px",
        }}>

          {/* Left card — violet */}
          <div style={{
            borderRadius: "24px",
            background: "#6B3FD0",
            padding: "48px 40px 40px",
            display: "flex", flexDirection: "column",
            backgroundImage: DOT_BG.replace("0E0E0E", "FFFFFF").replace("0.07", "0.08"),
            backgroundSize: "20px 20px",
            minHeight: "380px",
          }}>
            <span style={{
              fontSize: "11px", fontWeight: 700, letterSpacing: "0.18em",
              textTransform: "uppercase", color: "rgba(255,255,255,0.6)",
              marginBottom: "32px", display: "block",
            }}>
              Dimension 01
            </span>
            <div style={{ flex: 1 }}>
              <h2 style={{
                fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 900,
                letterSpacing: "-0.03em", color: "#fff", lineHeight: 1.05,
                marginBottom: "16px",
              }}>
                How you work
              </h2>
              <p style={{ fontSize: "16px", fontWeight: 500, color: "rgba(255,255,255,0.75)", marginBottom: "10px", lineHeight: 1.5 }}>
                Discover your professional identity.
              </p>
              <p style={{ fontSize: "14px", fontWeight: 400, color: "rgba(255,255,255,0.55)", lineHeight: 1.6, margin: 0 }}>
                Are you The Relentless Builder or The Quiet Sovereign?
              </p>
            </div>
            <Link href="/work" style={{
              display: "inline-block", marginTop: "36px",
              padding: "14px 28px", borderRadius: "10px",
              background: "rgba(255,255,255,0.15)",
              border: "1.5px solid rgba(255,255,255,0.3)",
              color: "#fff", fontSize: "14px", fontWeight: 700,
              letterSpacing: "0.01em", textDecoration: "none",
              alignSelf: "flex-start",
            }}>
              Take the work test →
            </Link>
          </div>

          {/* Right card — burgundy */}
          <div style={{
            borderRadius: "24px",
            background: "#8B2252",
            padding: "48px 40px 40px",
            display: "flex", flexDirection: "column",
            backgroundImage: DOT_BG.replace("0E0E0E", "FFFFFF").replace("0.07", "0.08"),
            backgroundSize: "20px 20px",
            minHeight: "380px",
          }}>
            <span style={{
              fontSize: "11px", fontWeight: 700, letterSpacing: "0.18em",
              textTransform: "uppercase", color: "rgba(255,255,255,0.6)",
              marginBottom: "32px", display: "block",
            }}>
              Dimension 02
            </span>
            <div style={{ flex: 1 }}>
              <h2 style={{
                fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 900,
                letterSpacing: "-0.03em", color: "#fff", lineHeight: 1.05,
                marginBottom: "16px",
              }}>
                How you love
              </h2>
              <p style={{ fontSize: "16px", fontWeight: 500, color: "rgba(255,255,255,0.75)", marginBottom: "10px", lineHeight: 1.5 }}>
                Discover your love identity.
              </p>
              <p style={{ fontSize: "14px", fontWeight: 400, color: "rgba(255,255,255,0.55)", lineHeight: 1.6, margin: 0 }}>
                Are you The Fierce Flame or The Guarded Architect?
              </p>
            </div>
            <Link href="/love" style={{
              display: "inline-block", marginTop: "36px",
              padding: "14px 28px", borderRadius: "10px",
              background: "rgba(255,255,255,0.15)",
              border: "1.5px solid rgba(255,255,255,0.3)",
              color: "#fff", fontSize: "14px", fontWeight: 700,
              letterSpacing: "0.01em", textDecoration: "none",
              alignSelf: "flex-start",
            }}>
              Take the love test →
            </Link>
          </div>

        </div>
      </section>

      {/* ── SECTION 3: THE VISION ── */}
      <section style={{
        padding: "80px 24px 112px",
        textAlign: "center",
        borderTop: "1.5px solid var(--border)",
        maxWidth: "680px",
        margin: "0 auto",
      }}>
        <p style={{ fontSize: "clamp(17px, 2vw, 21px)", fontWeight: 600, color: "var(--ink)", lineHeight: 1.6, marginBottom: "16px" }}>
          Every quiz adds a new dimension to your Profyle.
        </p>
        <p style={{ fontSize: "clamp(15px, 1.8vw, 18px)", fontWeight: 400, color: "var(--muted)", lineHeight: 1.7, marginBottom: "28px" }}>
          Share it as a link. Put it in your bio. Let people know who they&apos;re dealing with.
        </p>
        <p style={{ fontSize: "clamp(14px, 1.6vw, 16px)", fontWeight: 600, color: "var(--faint)", letterSpacing: "0.03em" }}>
          profyle.one/yourname — coming soon.
        </p>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        borderTop: "1.5px solid var(--border)",
        padding: "28px 32px",
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
  );
}

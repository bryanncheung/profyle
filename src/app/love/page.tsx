import Link from "next/link";

export default function LovePage() {
  return (
    <div style={{
      background: "var(--bg)", minHeight: "100vh",
      backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='10' cy='10' r='1.4' fill='%230E0E0E' fill-opacity='0.07'/%3E%3C/svg%3E\")",
      backgroundSize: "20px 20px",
      display: "flex", flexDirection: "column",
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
        <Link href="/" style={{ fontSize: "13px", fontWeight: 600, color: "var(--muted)", textDecoration: "none" }}>
          ← Back
        </Link>
      </nav>

      {/* ── MAIN ── */}
      <main style={{
        flex: 1, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        textAlign: "center", padding: "120px 24px 80px",
      }}>
        <span style={{
          fontSize: "11px", fontWeight: 700, letterSpacing: "0.18em",
          textTransform: "uppercase", color: "#8B2252",
          marginBottom: "28px", display: "block",
        }}>
          Dimension 02 · How you love
        </span>

        <h1 style={{
          fontSize: "clamp(48px, 9vw, 84px)",
          fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1.02,
          color: "var(--ink)", maxWidth: "640px", marginBottom: "28px",
        }}>
          This one&apos;s still being built.
        </h1>

        <p style={{
          fontSize: "clamp(16px, 2vw, 19px)", fontWeight: 400,
          color: "var(--muted)", maxWidth: "460px", lineHeight: 1.65, marginBottom: "48px",
        }}>
          The love dimension is coming soon. In the meantime, find out how you work.
        </p>

        <Link href="/work" style={{
          display: "inline-block", padding: "16px 44px", borderRadius: "12px",
          background: "var(--ink)", color: "white",
          fontSize: "15px", fontWeight: 700, letterSpacing: "0.01em", textDecoration: "none",
        }}>
          Take the work test →
        </Link>
      </main>

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
  );
}

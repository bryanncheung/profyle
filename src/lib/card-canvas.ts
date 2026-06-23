import type { QuizResult, Archetype } from "./types";

const SCALE = 3;
const W = 270;
const H = 480;

const GRADIENT_STOPS: Record<Archetype, [number, string][]> = {
  Builder:   [[0,"#C04808"],[0.22,"#D86428"],[0.48,"#E88050"],[0.70,"#F0A478"],[0.85,"#F8CAB0"],[1,"#FEF2E8"]],
  Disruptor: [[0,"#C02020"],[0.22,"#D84040"],[0.48,"#E86868"],[0.70,"#F09090"],[0.85,"#F8B8B8"],[1,"#FEF0F0"]],
  Anchor:    [[0,"#0A7070"],[0.22,"#189090"],[0.48,"#38AAAA"],[0.70,"#68C8C8"],[0.85,"#A4E0E0"],[1,"#E4F6F6"]],
  Catalyst:  [[0,"#907800"],[0.22,"#AEA000"],[0.48,"#C4B830"],[0.70,"#D8CC70"],[0.85,"#EADFA8"],[1,"#FAF8E8"]],
  Sovereign: [[0,"#7040C8"],[0.22,"#9060DE"],[0.48,"#AA80EC"],[0.70,"#C4A8F8"],[0.85,"#D8C4FE"],[1,"#EDE6FF"]],
};
const ENTRY_BASES: Record<Archetype, number> = { Builder:1203, Disruptor:2891, Anchor:3540, Catalyst:4126, Sovereign:5407 };
const PREFIX_OFFSET = { Relentless:0, Quiet:412, Bold:718, Grounded:1034 } as const;

function rrect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  const R = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + R, y);
  ctx.lineTo(x + w - R, y);
  ctx.arcTo(x + w, y,     x + w, y + R,     R);
  ctx.lineTo(x + w, y + h - R);
  ctx.arcTo(x + w, y + h, x + w - R, y + h, R);
  ctx.lineTo(x + R, y + h);
  ctx.arcTo(x,     y + h, x,     y + h - R, R);
  ctx.lineTo(x, y + R);
  ctx.arcTo(x,     y,     x + R, y,          R);
  ctx.closePath();
}

// Get font-family: reads body computed style which resolves the Next.js CSS variable
function getManropeFontFamily(): string {
  if (typeof document === "undefined") return "sans-serif";
  const body = getComputedStyle(document.body).fontFamily;
  if (body && body !== "serif" && body !== "sans-serif") return body;
  const cssVar = getComputedStyle(document.documentElement).getPropertyValue("--font-manrope").trim();
  if (cssVar) return cssVar;
  for (const font of document.fonts) {
    if (font.family.toLowerCase().includes("manrope")) return font.family;
  }
  return "sans-serif";
}

// Pre-wrap text; returns each line with its draw coordinates
function prewrap(
  ctx: CanvasRenderingContext2D,
  text: string,
  startX: number,
  startY: number,
  maxRight: number,
  lineH: number,
  wrapX = startX,
): { lines: { text: string; x: number; y: number }[]; endY: number } {
  const words = text.split(" ");
  const lines: { text: string; x: number; y: number }[] = [];
  let line = ""; let x = startX; let y = startY;
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (x + ctx.measureText(test).width > maxRight && line) {
      lines.push({ text: line, x, y });
      line = word; x = wrapX; y += lineH;
    } else line = test;
  }
  if (line) lines.push({ text: line, x, y });
  return { lines, endY: y };
}

// ── Ghost character drawing ──────────────────────────────────────────────────

function ghostSovereign(ctx: CanvasRenderingContext2D) {
  ctx.fill(new Path2D("M24 30 L30 12 L42 24 L55 8 L68 24 L80 12 L86 30 Z"));
  ctx.beginPath(); ctx.arc(30, 12, 5, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(55, 8, 6, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(80, 12, 5, 0, Math.PI*2); ctx.fill();
  rrect(ctx, 22, 28, 66, 8, 4); ctx.fill();
  ctx.beginPath(); ctx.arc(55, 54, 23, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(55, 80, 18, 12, 0, 0, Math.PI*2); ctx.fill();
  ctx.fill(new Path2D("M26 72 L14 106 L96 106 L84 72 Q55 84 26 72 Z"));
}

function ghostBuilder(ctx: CanvasRenderingContext2D) {
  ctx.fill(new Path2D("M22 44 Q22 18 55 18 Q88 18 88 44 Z"));
  rrect(ctx, 10, 40, 90, 10, 5); ctx.fill();
  ctx.beginPath(); ctx.arc(55, 64, 21, 0, Math.PI*2); ctx.fill();
  rrect(ctx, 26, 86, 58, 22, 11); ctx.fill();
  rrect(ctx, 2, 88, 26, 12, 6); ctx.fill();
  rrect(ctx, 82, 88, 26, 12, 6); ctx.fill();
  ctx.beginPath(); ctx.arc(105, 80, 9, 0, Math.PI*2); ctx.fill();
  rrect(ctx, 101, 80, 8, 18, 3); ctx.fill();
  ctx.beginPath(); ctx.arc(105, 97, 6, 0, Math.PI*2); ctx.fill();
}

function ghostDisruptor(ctx: CanvasRenderingContext2D) {
  ctx.fill(new Path2D("M32 36 L36 16 L42 30 L48 12 L55 28 L62 12 L68 30 L74 16 L78 36 Z"));
  ctx.beginPath(); ctx.arc(55, 54, 22, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(55, 86, 18, 0, Math.PI*2); ctx.fill();
  ctx.save();
  ctx.strokeStyle = "white"; ctx.lineWidth = 12; ctx.lineCap = "round";
  ctx.beginPath(); ctx.moveTo(36, 68); ctx.lineTo(14, 46); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(74, 68); ctx.lineTo(96, 46); ctx.stroke();
  ctx.restore();
  ctx.fill(new Path2D("M88 18 L90 24 L96 24 L91 28 L93 34 L88 30 L83 34 L85 28 L80 24 L86 24 Z"));
}

function ghostAnchor(ctx: CanvasRenderingContext2D) {
  ctx.beginPath(); ctx.arc(55, 38, 20, 0, Math.PI*2); ctx.fill();
  rrect(ctx, 22, 58, 66, 28, 14); ctx.fill();
  ctx.beginPath(); ctx.ellipse(55, 96, 48, 16, 0, 0, Math.PI*2); ctx.fill();
  rrect(ctx, 0, 60, 24, 14, 7); ctx.fill();
  rrect(ctx, 86, 60, 24, 14, 7); ctx.fill();
  ctx.save();
  ctx.strokeStyle = "white"; ctx.lineWidth = 2.5; ctx.lineCap = "round";
  ctx.beginPath(); ctx.arc(55, 69, 5, 0, Math.PI*2); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(55, 73); ctx.lineTo(55, 82); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(47, 76); ctx.lineTo(63, 76); ctx.stroke();
  ctx.restore();
}

function ghostCatalyst(ctx: CanvasRenderingContext2D) {
  const spokes: [number,number,number,number,number][] = [
    [55,55,55,8,6],[55,55,94,16,5],[55,55,102,55,5],[55,55,94,94,5],
    [55,55,55,102,4],[55,55,16,94,5],[55,55,8,55,5],[55,55,16,16,5],
  ];
  ctx.save();
  ctx.strokeStyle = "white"; ctx.lineCap = "round";
  for (const [x1,y1,x2,y2,w] of spokes) {
    ctx.lineWidth = w;
    ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke();
  }
  ctx.restore();
  for (const [cx,cy,r] of [[55,8,5],[94,16,4],[102,55,4],[94,94,4],[55,102,4],[16,94,4],[8,55,4],[16,16,4]] as [number,number,number][]) {
    ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2); ctx.fill();
  }
  ctx.beginPath(); ctx.arc(55, 55, 26, 0, Math.PI*2); ctx.fill();
}

function drawGhost(ctx: CanvasRenderingContext2D, archetype: Archetype) {
  const size = 104, tx = W - 10 - size, ty = 56;
  ctx.save();
  ctx.translate(tx, ty);
  ctx.scale(size / 110, size / 110);
  ctx.globalAlpha = 0.2;
  ctx.fillStyle = "white";
  switch (archetype) {
    case "Builder":   ghostBuilder(ctx);   break;
    case "Disruptor": ghostDisruptor(ctx); break;
    case "Anchor":    ghostAnchor(ctx);    break;
    case "Catalyst":  ghostCatalyst(ctx);  break;
    case "Sovereign": ghostSovereign(ctx); break;
  }
  ctx.restore();
}

// ── Main renderer ────────────────────────────────────────────────────────────

export async function renderCardToBlob(result: QuizResult): Promise<Blob | null> {
  try {
    const canvas = document.createElement("canvas");
    canvas.width = W * SCALE;
    canvas.height = H * SCALE;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // Wait for all @font-face declarations to resolve (includes Next.js Manrope)
    try {
      await Promise.race([
        document.fonts.ready,
        new Promise<void>(r => setTimeout(r, 2000)),
      ]);
    } catch { /* continue with whatever is loaded */ }

    // Body's computed font-family is the resolved value of var(--font-manrope), sans-serif
    const FF = getManropeFontFamily();
    const f = (weight: number, size: number) => { ctx.font = `${weight} ${size}px ${FF}`; };

    ctx.scale(SCALE, SCALE);

    // ── Gradient ──
    // CSS linear-gradient(175deg) formula: direction = (sinθ, -cosθ) in y-down coords.
    // Start (first color) = center - direction × r; End (last color) = center + direction × r.
    const θ = 175 * Math.PI / 180;
    const sinθ = Math.sin(θ), cosθ = Math.cos(θ); // sin≈0.087, cos≈-0.996
    const r = Math.sqrt(W * W + H * H) / 2;
    const grad = ctx.createLinearGradient(
      W/2 - sinθ * r, H/2 + cosθ * r,  // start: first color (dark) near top
      W/2 + sinθ * r, H/2 - cosθ * r,  // end: last color (light) near bottom
    );
    for (const [stop, color] of GRADIENT_STOPS[result.archetype]) grad.addColorStop(stop, color);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // ── Dot grid ──
    ctx.fillStyle = "rgba(255,255,255,0.18)";
    for (let gx = 8; gx < W; gx += 16)
      for (let gy = 8; gy < H; gy += 16) {
        ctx.beginPath(); ctx.arc(gx, gy, 1.1, 0, Math.PI*2); ctx.fill();
      }

    // ── Ghost character ──
    drawGhost(ctx, result.archetype);

    const px = 20;
    let cy = 22;

    // ── PROFYLE + entry number ──
    f(800, 8); ctx.fillStyle = "rgba(255,255,255,0.55)";
    ctx.fillText("PROFYLE", px, cy + 7);
    const entry = `#${(ENTRY_BASES[result.archetype] + PREFIX_OFFSET[result.prefix]).toLocaleString("en-US")}`;
    f(800, 9); ctx.textAlign = "right";
    ctx.fillText(entry, W - px, cy + 7);
    ctx.textAlign = "left";
    cy += 26;

    // ── Prefix + wavy underline ──
    f(700, 11); ctx.fillStyle = "rgba(255,255,255,0.88)";
    const prefixLabel = `THE ${result.prefix.toUpperCase()}`;
    ctx.fillText(prefixLabel, px, cy + 9);
    f(700, 11);
    const pw = Math.min(ctx.measureText(prefixLabel).width, 80);
    cy += 13;
    ctx.strokeStyle = "rgba(255,255,255,0.5)"; ctx.lineWidth = 1.6; ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(px, cy+4);
    ctx.bezierCurveTo(px+pw*.10,cy+2,  px+pw*.22,cy+5.5, px+pw*.34,cy+3.5);
    ctx.bezierCurveTo(px+pw*.46,cy+1.5,px+pw*.58,cy+6,   px+pw*.72,cy+4);
    ctx.bezierCurveTo(px+pw*.82,cy+2.5,px+pw*.92,cy+4,   px+pw,    cy+5);
    ctx.stroke();
    cy += 12;

    // ── Archetype name ──
    f(800, 42); ctx.fillStyle = "#ffffff";
    ctx.fillText(result.archetype.toUpperCase(), px, cy + 36);
    cy += 52;

    // ── Tagline: pre-calculate wrapping so border height matches text ──
    f(500, 10);
    // maxRight matches React card's maxWidth: 185px from px=20, so px + 185 = 205
    const { lines: tagLines, endY: tagEndY } = prewrap(
      ctx, result.tagline, px + 9, cy + 11, px + 185, 15.5
    );
    const tagH = Math.max(tagEndY - cy + 16, 28);

    ctx.save();
    ctx.strokeStyle = "rgba(255,255,255,0.55)"; ctx.lineWidth = 2.5; ctx.lineCap = "butt";
    ctx.beginPath(); ctx.moveTo(px, cy); ctx.lineTo(px, cy + tagH); ctx.stroke();
    ctx.restore();

    ctx.fillStyle = "rgba(255,255,255,0.88)";
    for (const { text, x, y } of tagLines) ctx.fillText(text, x, y);
    cy += tagH + 18;

    // ── Attribute rows (label · dots · number) ──
    const attrs: [string, number][] = [
      ["Execution",    result.attributes.execution],
      ["Vision",       result.attributes.vision],
      ["Independence", result.attributes.independence],
      ["Collaboration",result.attributes.collaboration],
      ["Adaptability", result.attributes.adaptability],
    ];
    for (const [label, val] of attrs) {
      f(700, 7); ctx.fillStyle = "rgba(255,255,255,0.82)";
      ctx.fillText(label.toUpperCase(), px, cy + 6);
      for (let i = 1; i <= 5; i++) {
        const dx = px + 76 + (i-1)*12;
        ctx.beginPath(); ctx.arc(dx, cy+4, 4, 0, Math.PI*2);
        if (i <= val) {
          ctx.fillStyle = "rgba(255,255,255,0.95)"; ctx.fill();
        } else {
          ctx.fillStyle = "rgba(0,0,0,0)";
          ctx.strokeStyle = "rgba(255,255,255,0.45)"; ctx.lineWidth = 1.5; ctx.stroke();
        }
      }
      f(800, 7); ctx.fillStyle = "rgba(255,255,255,0.9)";
      ctx.fillText(String(val), px + 76 + 5*12 + 5, cy + 6);
      cy += 15;
    }
    cy += 6;

    // ── Adjective badges — matching star/hexagon/oval shapes from the React card ──
    {
      let bx = px;
      const BH = 26;
      for (let bi = 0; bi < result.adjectives.length; bi++) {
        const adj = result.adjectives[bi];
        const BW = bi === 1 ? 70 : 62;
        ctx.save();
        ctx.translate(bx, cy);
        ctx.beginPath();
        if (bi === 0) {
          // Star: M31 1 L35 8 L43 5 L40 13 L48 16 L40 19 L43 23 L35 20 L31 25 L27 20 L19 23 L22 19 L14 16 L22 13 L19 5 L27 8 Z
          const sp = [31,1,35,8,43,5,40,13,48,16,40,19,43,23,35,20,31,25,27,20,19,23,22,19,14,16,22,13,19,5,27,8];
          ctx.moveTo(sp[0],sp[1]);
          for (let i=2;i<sp.length;i+=2) ctx.lineTo(sp[i],sp[i+1]);
          ctx.closePath();
        } else if (bi === 1) {
          // Hexagon in 70×26: M12 2 L58 2 L68 13 L58 24 L12 24 L2 13 Z
          ctx.moveTo(12,2);ctx.lineTo(58,2);ctx.lineTo(68,13);ctx.lineTo(58,24);ctx.lineTo(12,24);ctx.lineTo(2,13);ctx.closePath();
        } else {
          // Oval: ellipse cx=31 cy=13 rx=28 ry=11 rotated -6°
          ctx.save(); ctx.translate(31,13); ctx.rotate(-6*Math.PI/180); ctx.ellipse(0,0,28,11,0,0,Math.PI*2); ctx.restore();
        }
        ctx.fillStyle="rgba(255,255,255,0.25)"; ctx.fill();
        ctx.strokeStyle="rgba(255,255,255,0.45)"; ctx.lineWidth=0.8; ctx.stroke();
        f(800,7.5); ctx.fillStyle="rgba(0,0,0,0.72)";
        ctx.textAlign="center"; ctx.textBaseline="middle";
        ctx.fillText(adj, BW/2, BH/2);
        ctx.textAlign="left"; ctx.textBaseline="alphabetic";
        ctx.restore();
        bx += BW + 6;
      }
      cy += BH + 8;
    }

    // ── Blind spot (bold prefix + normal text, wraps back to left margin) ──
    f(800, 8.5); ctx.fillStyle = "#ffffff";
    const bsPrefix = "Blind spot — ";
    ctx.fillText(bsPrefix, px, cy + 7);
    const bsPrefW = ctx.measureText(bsPrefix).width;

    f(500, 8.5); ctx.fillStyle = "rgba(255,255,255,0.82)";
    {
      // First line starts after the bold prefix; wrapped lines go back to px
      const { lines: bsLines, endY: bsEndY } = prewrap(
        ctx, result.blindSpot, px + bsPrefW, cy + 7, W - px, 13, px
      );
      for (const { text, x, y } of bsLines) ctx.fillText(text, x, y);
      cy = bsEndY + 18;
    }

    // ── Works with ──
    f(800, 7); ctx.fillStyle = "rgba(255,255,255,0.65)";
    ctx.fillText("WORKS WITH", px, cy + 6);
    cy += 14;

    let pillX = px;
    for (let pi = 0; pi < 2; pi++) {
      const arch = result.compatibleWith[pi];
      if (!arch) continue;
      f(800, 7.5);
      const label = `The ${arch}`;
      const PW = ctx.measureText(label).width + 22, PH = 22;
      if (pi === 0) {
        rrect(ctx, pillX, cy, PW, PH, PH / 2); // pill
      } else {
        const ind = 10;
        ctx.beginPath();
        ctx.moveTo(pillX+ind,cy); ctx.lineTo(pillX+PW-ind,cy);
        ctx.lineTo(pillX+PW,cy+PH/2); ctx.lineTo(pillX+PW-ind,cy+PH);
        ctx.lineTo(pillX+ind,cy+PH); ctx.lineTo(pillX,cy+PH/2);
        ctx.closePath();
      }
      ctx.fillStyle = "rgba(255,255,255,0.22)"; ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.4)"; ctx.lineWidth = 1; ctx.stroke();
      f(800, 7.5); ctx.fillStyle = "rgba(0,0,0,0.72)";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(label, pillX + PW/2, cy + PH/2);
      ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
      pillX += PW + 6;
    }

    // ── Footer ──
    f(700, 7); ctx.fillStyle = "rgba(0,0,0,0.55)";
    ctx.textAlign = "center";
    ctx.fillText("PROFYLE.COM", W/2, H - 10);
    ctx.textAlign = "left";

    return new Promise<Blob | null>(resolve => canvas.toBlob(resolve, "image/png"));
  } catch (err) {
    console.error("renderCardToBlob:", err);
    return null;
  }
}

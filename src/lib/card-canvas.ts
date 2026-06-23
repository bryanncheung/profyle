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

// arcTo-based rounded rect — works on iOS 9+
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

// Read Next.js font CSS variable so canvas uses the actual loaded font
function getManropeFontFamily(): string {
  if (typeof document === "undefined") return "sans-serif";
  const v = getComputedStyle(document.documentElement).getPropertyValue("--font-manrope").trim();
  return v || "Manrope, sans-serif";
}

// ── Ghost character drawing (all 5 archetypes) ───────────────────────────────

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
  ctx.strokeStyle = "white"; ctx.lineWidth = 12; ctx.lineCap = "round";
  ctx.beginPath(); ctx.moveTo(36, 68); ctx.lineTo(14, 46); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(74, 68); ctx.lineTo(96, 46); ctx.stroke();
  ctx.fill(new Path2D("M88 18 L90 24 L96 24 L91 28 L93 34 L88 30 L83 34 L85 28 L80 24 L86 24 Z"));
}

function ghostAnchor(ctx: CanvasRenderingContext2D) {
  ctx.beginPath(); ctx.arc(55, 38, 20, 0, Math.PI*2); ctx.fill();
  rrect(ctx, 22, 58, 66, 28, 14); ctx.fill();
  ctx.beginPath(); ctx.ellipse(55, 96, 48, 16, 0, 0, Math.PI*2); ctx.fill();
  rrect(ctx, 0, 60, 24, 14, 7); ctx.fill();
  rrect(ctx, 86, 60, 24, 14, 7); ctx.fill();
  ctx.strokeStyle = "white"; ctx.lineWidth = 2.5; ctx.lineCap = "round";
  ctx.beginPath(); ctx.arc(55, 69, 5, 0, Math.PI*2); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(55, 73); ctx.lineTo(55, 82); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(47, 76); ctx.lineTo(63, 76); ctx.stroke();
}

function ghostCatalyst(ctx: CanvasRenderingContext2D) {
  const spokes: [number,number,number,number,number][] = [
    [55,55,55,8,6],[55,55,94,16,5],[55,55,102,55,5],[55,55,94,94,5],
    [55,55,55,102,4],[55,55,16,94,5],[55,55,8,55,5],[55,55,16,16,5],
  ];
  ctx.strokeStyle = "white"; ctx.lineCap = "round";
  for (const [x1,y1,x2,y2,w] of spokes) {
    ctx.lineWidth = w;
    ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke();
  }
  const dots: [number,number,number][] = [
    [55,8,5],[94,16,4],[102,55,4],[94,94,4],[55,102,4],[16,94,4],[8,55,4],[16,16,4],
  ];
  ctx.fillStyle = "white";
  for (const [cx,cy,r] of dots) {
    ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2); ctx.fill();
  }
  ctx.beginPath(); ctx.arc(55, 55, 26, 0, Math.PI*2); ctx.fill();
}

function drawGhost(ctx: CanvasRenderingContext2D, archetype: Archetype) {
  // Position: top=56, right=10, size=104×104
  const size = 104, tx = W - 10 - size, ty = 56;
  ctx.save();
  ctx.translate(tx, ty);
  ctx.scale(size / 110, size / 110);
  ctx.globalAlpha = 0.2;
  ctx.fillStyle = "white";
  ctx.strokeStyle = "white";
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

    const FF = getManropeFontFamily();
    const f = (weight: number, size: number) => { ctx.font = `${weight} ${size}px ${FF}`; };

    // Ensure the font is ready before drawing text
    try {
      await Promise.race([
        document.fonts.load(`700 12px ${FF}`),
        document.fonts.load(`800 12px ${FF}`),
        new Promise<void>(r => setTimeout(r, 1200)),
      ]);
    } catch { /* fall back to system font */ }

    ctx.scale(SCALE, SCALE);

    // ── Gradient ──
    const diag = Math.sqrt(W * W + H * H);
    const rad = (175 - 90) * (Math.PI / 180);
    const grad = ctx.createLinearGradient(
      W/2 + Math.cos(rad)*diag/2, H/2 + Math.sin(rad)*diag/2,
      W/2 - Math.cos(rad)*diag/2, H/2 - Math.sin(rad)*diag/2,
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

    // ── PROFYLE + entry ──
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
    cy += 54;

    // ── Tagline with left border ──
    ctx.strokeStyle = "rgba(255,255,255,0.55)"; ctx.lineWidth = 2.5; ctx.lineCap = "butt";
    ctx.beginPath(); ctx.moveTo(px, cy); ctx.lineTo(px, cy + 50); ctx.stroke();

    f(500, 10); ctx.fillStyle = "rgba(255,255,255,0.88)";
    const words = result.tagline.split(" ");
    let line = ""; let tY = cy + 11;
    for (const word of words) {
      const test = line ? `${line} ${word}` : word;
      if (ctx.measureText(test).width > 176 && line) {
        ctx.fillText(line, px + 9, tY); line = word; tY += 15.5;
      } else line = test;
    }
    if (line) ctx.fillText(line, px + 9, tY);
    cy = Math.max(cy + 50, tY) + 20;

    // ── Attribute rows ──
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
        if (i <= val) { ctx.fillStyle = "rgba(255,255,255,0.95)"; ctx.fill(); }
        else { ctx.strokeStyle = "rgba(255,255,255,0.45)"; ctx.lineWidth = 1.5; ctx.stroke(); }
      }
      cy += 14;
    }
    cy += 8;

    // ── Adjective badges ──
    let bx = px;
    for (const adj of result.adjectives) {
      f(800, 7.5);
      const bw = ctx.measureText(adj).width + 16, bh = 18;
      rrect(ctx, bx, cy, bw, bh, 3);
      ctx.fillStyle = "rgba(255,255,255,0.25)"; ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.45)"; ctx.lineWidth = 0.8; ctx.stroke();
      ctx.fillStyle = "rgba(0,0,0,0.72)"; ctx.fillText(adj, bx+8, cy+13);
      bx += bw + 6;
    }
    cy += 26;

    // ── Blind spot ──
    f(800, 8.5); ctx.fillStyle = "#ffffff";
    const bsPrefix = "Blind spot — ";
    ctx.fillText(bsPrefix, px, cy + 7);
    const bsPrefW = ctx.measureText(bsPrefix).width;
    f(500, 8.5); ctx.fillStyle = "rgba(255,255,255,0.82)";
    {
      const bsWords = result.blindSpot.split(" ");
      let bsLine = ""; let bsX = px + bsPrefW; let bsY = cy + 7;
      for (const word of bsWords) {
        const test = bsLine ? `${bsLine} ${word}` : word;
        if (bsX + ctx.measureText(test).width > W - px && bsLine) {
          ctx.fillText(bsLine, bsX, bsY); bsX = px; bsY += 13; bsLine = word;
        } else bsLine = test;
      }
      if (bsLine) ctx.fillText(bsLine, bsX, bsY);
      cy = bsY + 16;
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
      const pw2 = ctx.measureText(label).width + 18;
      rrect(ctx, pillX, cy, pw2, 18, pi === 0 ? 9 : 2);
      ctx.fillStyle = "rgba(255,255,255,0.22)"; ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.4)"; ctx.lineWidth = 1; ctx.stroke();
      ctx.fillStyle = "rgba(0,0,0,0.72)"; ctx.fillText(label, pillX+9, cy+13);
      pillX += pw2 + 6;
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

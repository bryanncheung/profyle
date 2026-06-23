import { NextRequest, NextResponse } from "next/server";
import { scoreLoveQuiz } from "@/lib/love-scoring";
import { LoveAnswer, LoveSubmitPayload } from "@/lib/love-types";

const QUESTION_IDS = new Set([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24]);
const SLIDER_IDS   = new Set([4, 7, 11, 16, 21]);
const BINARY_IDS   = new Set([1, 5, 10, 15, 17, 23]);
const MULTI_OPTS   = new Set(["A", "B", "C", "D"]);
const BINARY_OPTS  = new Set(["LEFT", "RIGHT"]);
const SLIDER_OPTS  = new Set(["1", "2", "3", "4", "5"]);

export async function POST(req: NextRequest) {
  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const payload = body as LoveSubmitPayload;
  if (!payload?.answers || typeof payload.answers !== "object") {
    return NextResponse.json({ error: "Missing answers" }, { status: 400 });
  }

  for (const [key, val] of Object.entries(payload.answers)) {
    const id = Number(key);
    if (!QUESTION_IDS.has(id)) return NextResponse.json({ error: `Unknown question ${key}` }, { status: 400 });
    if (SLIDER_IDS.has(id) && !SLIDER_OPTS.has(val)) return NextResponse.json({ error: `Invalid slider answer ${val}` }, { status: 400 });
    if (BINARY_IDS.has(id) && !BINARY_OPTS.has(val)) return NextResponse.json({ error: `Invalid binary answer ${val}` }, { status: 400 });
    if (!SLIDER_IDS.has(id) && !BINARY_IDS.has(id) && !MULTI_OPTS.has(val)) return NextResponse.json({ error: `Invalid answer ${val}` }, { status: 400 });
  }

  const answered = Object.keys(payload.answers).map(Number);
  const missing  = [...QUESTION_IDS].filter((id) => !answered.includes(id));
  if (missing.length > 0) return NextResponse.json({ error: `Missing: ${missing.join(",")}` }, { status: 400 });

  const result = scoreLoveQuiz(payload.answers as Record<number, LoveAnswer>);
  return NextResponse.json({ result });
}

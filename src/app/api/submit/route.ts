import { NextRequest, NextResponse } from "next/server";
import { scoreQuiz } from "@/lib/scoring";
import { AnswerOption, SubmitPayload } from "@/lib/types";

const VALID_ANSWERS = new Set<AnswerOption>(["A", "B", "C", "D"]);
const QUESTION_IDS = new Set([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]);

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const payload = body as SubmitPayload;
  if (!payload?.answers || typeof payload.answers !== "object") {
    return NextResponse.json({ error: "Missing answers object" }, { status: 400 });
  }

  // Validate all answers
  for (const [key, val] of Object.entries(payload.answers)) {
    const qId = Number(key);
    if (!QUESTION_IDS.has(qId)) {
      return NextResponse.json({ error: `Unknown question id: ${key}` }, { status: 400 });
    }
    if (!VALID_ANSWERS.has(val as AnswerOption)) {
      return NextResponse.json({ error: `Invalid answer "${val}" for question ${key}` }, { status: 400 });
    }
  }

  // Require all 20 answers
  const answered = Object.keys(payload.answers).map(Number);
  const missing = [...QUESTION_IDS].filter((id) => !answered.includes(id));
  if (missing.length > 0) {
    return NextResponse.json({ error: `Missing answers for questions: ${missing.join(", ")}` }, { status: 400 });
  }

  const result = scoreQuiz(payload.answers as Record<number, AnswerOption>);
  return NextResponse.json({ result });
}

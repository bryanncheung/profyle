"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { questions } from "@/lib/questions";
import { AnswerOption } from "@/lib/types";

const OPTION_LETTERS: AnswerOption[] = ["A", "B", "C", "D"];

const QUIZ_ACCENT = "#0E0E0E";
const QUIZ_PILL_BG = "#F0EDEA";
const QUIZ_PILL_BORDER = "#E8E4DC";
const QUIZ_SELECTED_BG = "#0E0E0E";

export default function QuizPage() {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, AnswerOption>>({});
  const [visible, setVisible] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [missingIds, setMissingIds] = useState<number[]>([]);

  // Shuffle once on mount so every session has a different question order
  const shuffled = useMemo(() => {
    const arr = [...questions];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, []);

  const question = shuffled[current];
  const progress = ((current + 1) / shuffled.length) * 100;
  const isLast = current === shuffled.length - 1;
  const selectedAnswer = answers[question.id];
  const canGoForward = !isLast && !!answers[question.id];

  const transition = useCallback((fn: () => void) => {
    setVisible(false);
    setTimeout(() => {
      fn();
      setVisible(true);
    }, 160);
  }, []);

  const handleSelect = useCallback(
    (option: AnswerOption) => {
      const newAnswers = { ...answers, [question.id]: option };
      setAnswers(newAnswers);
      if (isLast) return;
      setTimeout(() => {
        transition(() => setCurrent((c) => c + 1));
      }, 220);
    },
    [answers, question.id, isLast, transition]
  );

  const handleBack = useCallback(() => {
    if (current === 0) return;
    transition(() => setCurrent((c) => c - 1));
  }, [current, transition]);

  const handleForward = useCallback(() => {
    if (isLast) return;
    transition(() => setCurrent((c) => c + 1));
  }, [isLast, transition]);

  const jumpTo = useCallback((idx: number) => {
    transition(() => setCurrent(idx));
  }, [transition]);

  const handleSubmit = useCallback(async () => {
    const allIds = shuffled.map((q) => q.id);
    const missing = allIds.filter((id) => !answers[id]);
    if (missing.length > 0) {
      setMissingIds(missing);
      return;
    }
    setMissingIds([]);
    setSubmitting(true);

    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong");
      }

      const data = await res.json();
      sessionStorage.setItem("profyle_result", JSON.stringify(data.result));
      router.push("/results");
    } catch {
      setSubmitting(false);
      setMissingIds([]);
    }
  }, [answers, router]);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg)", backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='10' cy='10' r='1.4' fill='%230E0E0E' fill-opacity='0.07'/%3E%3C/svg%3E\")", backgroundSize: "20px 20px" }}>

      {/* Progress bar */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: "3px", background: "var(--border)", zIndex: 50 }}>
        <div style={{
          height: "100%",
          background: QUIZ_ACCENT,
          width: `${progress}%`,
          transition: "width 400ms cubic-bezier(0.16, 1, 0.3, 1)",
        }} />
      </div>

      {/* Profyle home link — top-left on all screen sizes */}
      <a href="/" style={{
        position: "fixed", top: "20px", left: "24px",
        fontSize: "12px", fontWeight: 800, letterSpacing: "0.18em",
        textTransform: "uppercase", color: "var(--ink)",
        textDecoration: "none", zIndex: 50, opacity: 0.5,
        fontFamily: "inherit",
      }}>
        Profyle
      </a>

      {/* Question counter */}
      <div style={{
        position: "fixed", top: "20px", right: "24px",
        fontSize: "11px", fontWeight: 700, letterSpacing: "0.14em",
        textTransform: "uppercase", color: "var(--faint)", zIndex: 50,
      }}>
        {current + 1} of {shuffled.length}
      </div>

      {/* Main content */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "80px 24px 120px" }}>
        <div style={{
          maxWidth: "600px", width: "100%",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(10px)",
          transition: "opacity 280ms ease, transform 280ms ease",
        }}>
          {/* Question text */}
          <h2 style={{
            fontSize: "clamp(22px, 4vw, 30px)",
            fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.2,
            color: "var(--ink)", marginBottom: "32px",
            textWrap: "balance" as const,
          }}>
            {question.text}
          </h2>

          {/* Options */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {OPTION_LETTERS.map((letter) => {
              const isSelected = selectedAnswer === letter;
              return (
                <button
                  key={letter}
                  onClick={() => handleSelect(letter)}
                  style={{
                    display: "flex", alignItems: "flex-start", gap: "14px",
                    padding: "18px 22px", borderRadius: "14px",
                    border: `1.5px solid ${isSelected ? QUIZ_ACCENT : QUIZ_PILL_BORDER}`,
                    background: isSelected ? QUIZ_SELECTED_BG : QUIZ_PILL_BG,
                    cursor: "pointer", textAlign: "left", fontFamily: "inherit",
                    transition: "border-color 180ms ease, background 180ms ease",
                    width: "100%",
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      (e.currentTarget as HTMLElement).style.borderColor = "#999992";
                      (e.currentTarget as HTMLElement).style.background = "#EAE8E3";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      (e.currentTarget as HTMLElement).style.borderColor = QUIZ_PILL_BORDER;
                      (e.currentTarget as HTMLElement).style.background = QUIZ_PILL_BG;
                    }
                  }}
                >
                  <span style={{
                    width: "28px", height: "28px", borderRadius: "8px",
                    background: isSelected ? "rgba(255,255,255,0.15)" : "var(--border)",
                    color: isSelected ? "white" : "var(--muted)",
                    fontSize: "12px", fontWeight: 700,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0, letterSpacing: "0.04em",
                  }}>
                    {letter}
                  </span>
                  <span style={{
                    fontSize: "15px", fontWeight: isSelected ? 600 : 500,
                    lineHeight: 1.5, color: isSelected ? "white" : "var(--ink)",
                    paddingTop: "3px",
                  }}>
                    {question.options[letter]}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Submit on last question */}
          {isLast && selectedAnswer && (
            <div style={{ marginTop: "28px" }}>
              {missingIds.length > 0 && (
                <div style={{ marginBottom: "16px" }}>
                  <p style={{ fontSize: "14px", fontWeight: 600, color: "#E82B2B", marginBottom: "10px" }}>
                    You skipped {missingIds.length} question{missingIds.length > 1 ? "s" : ""}:
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {missingIds.map((id) => {
                      const idx = shuffled.findIndex((q) => q.id === id);
                      return (
                        <button
                          key={id}
                          onClick={() => jumpTo(idx)}
                          style={{
                            padding: "6px 14px", borderRadius: "8px",
                            background: "#FEF4F4", border: "1.5px solid #F5BABA",
                            fontSize: "13px", fontWeight: 700, color: "#E82B2B",
                            cursor: "pointer", fontFamily: "inherit",
                          }}
                        >
                          Q{idx + 1}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
              <button
                onClick={handleSubmit}
                disabled={submitting}
                style={{
                  width: "100%", padding: "16px", borderRadius: "12px",
                  background: submitting ? "var(--muted)" : "var(--ink)",
                  color: "white", fontSize: "15px", fontWeight: 700,
                  letterSpacing: "0.01em", border: "none",
                  cursor: submitting ? "default" : "pointer",
                  fontFamily: "inherit", transition: "background 180ms ease",
                }}
              >
                {submitting ? "Revealing your type..." : "See my result →"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Question dots bar */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        padding: "16px 24px",
        display: "flex", justifyContent: "center",
        background: "linear-gradient(to top, var(--bg) 70%, transparent)",
        zIndex: 40,
      }}>
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", justifyContent: "center", maxWidth: "480px" }}>
          {shuffled.map((q, idx) => {
            const isAnswered = !!answers[q.id];
            const isCurrent = idx === current;
            const isMissing = missingIds.includes(q.id);
            return (
              <button
                key={q.id}
                onClick={() => jumpTo(idx)}
                title={`Question ${idx + 1}`}
                style={{
                  width: "28px", height: "28px",
                  borderRadius: "8px",
                  border: isCurrent
                    ? "2px solid var(--ink)"
                    : isMissing
                    ? "2px solid #E82B2B"
                    : "2px solid transparent",
                  background: isCurrent
                    ? "var(--ink)"
                    : isAnswered
                    ? "#BEBBB5"
                    : "var(--border)",
                  color: isCurrent ? "white" : isAnswered ? "white" : "var(--faint)",
                  fontSize: "10px",
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  transition: "all 160ms ease",
                  padding: 0,
                  lineHeight: 1,
                }}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}

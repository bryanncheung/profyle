"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { questions } from "@/lib/questions";
import { AnswerOption } from "@/lib/types";

const OPTION_LETTERS: AnswerOption[] = ["A", "B", "C", "D"];
const SLIDER_TO_OPTION: Record<number, AnswerOption> = { 1: "A", 2: "B", 3: "C", 4: "D" };
const OPTION_TO_SLIDER: Record<AnswerOption, number> = { A: 1, B: 2, C: 3, D: 4 };

export default function QuizPage() {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, AnswerOption>>({});
  const [visible, setVisible] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [missingIds, setMissingIds] = useState<number[]>([]);

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
  const p = shuffled.length > 1 ? current / (shuffled.length - 1) : 0;
  const isLast = current === shuffled.length - 1;
  const selectedAnswer = answers[question.id];

  // Background: warm white → deep violet
  const bgR = Math.round(250 - 232 * p);
  const bgG = Math.round(249 - 243 * p);
  const bgB = Math.round(246 - 202 * p);
  const bgColor = `rgb(${bgR},${bgG},${bgB})`;

  // Switch text/UI to light theme when bg is dark enough
  const isDark = p >= 0.45;

  const inkColor = isDark ? "rgba(245,243,238,0.92)" : "#0E0E0E";
  const faintColor = isDark ? "rgba(245,243,238,0.45)" : "rgba(14,14,14,0.45)";
  const optBg = isDark ? "rgba(255,255,255,0.09)" : "#F0EDEA";
  const optBorder = isDark ? "rgba(255,255,255,0.15)" : "#E8E4DC";
  const optSelBg = isDark ? "rgba(255,255,255,0.20)" : "#0E0E0E";
  const optSelBorder = isDark ? "rgba(255,255,255,0.65)" : "#0E0E0E";
  const optSelText = isDark ? "rgba(255,255,255,0.95)" : "white";
  const optNormText = isDark ? "rgba(245,243,238,0.85)" : "var(--ink)";
  const progressFill = isDark ? "rgba(255,255,255,0.85)" : "#0E0E0E";
  const progressTrack = isDark ? "rgba(255,255,255,0.15)" : "var(--border)";

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

      const allIds = shuffled.map((q) => q.id);
      const missing = allIds.filter((id) => !newAnswers[id]);

      if (missing.length === 0) {
        setMissingIds([]);
        setTimeout(async () => {
          setSubmitting(true);
          try {
            const res = await fetch("/api/submit", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ answers: newAnswers }),
            });
            if (!res.ok) throw new Error("Error");
            const data = await res.json();
            sessionStorage.setItem("profyle_result", JSON.stringify(data.result));
            router.push("/results");
          } catch {
            setSubmitting(false);
          }
        }, 380);
        return;
      }

      if (isLast) {
        setMissingIds(missing);
        return;
      }

      setTimeout(() => {
        transition(() => setCurrent((c) => c + 1));
      }, 220);
    },
    [answers, question.id, isLast, shuffled, router, transition]
  );

  const jumpTo = useCallback((idx: number) => {
    setMissingIds([]);
    transition(() => setCurrent(idx));
  }, [transition]);

  return (
    <div style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      backgroundColor: bgColor,
      backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='10' cy='10' r='1.4' fill='%230E0E0E' fill-opacity='0.07'/%3E%3C/svg%3E\")",
      backgroundSize: "20px 20px",
      transition: "background-color 700ms ease",
    }}>

      {/* Progress bar */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: "3px", background: progressTrack, zIndex: 50, transition: "background 700ms ease" }}>
        <div style={{
          height: "100%",
          background: progressFill,
          width: `${progress}%`,
          transition: "width 400ms cubic-bezier(0.16, 1, 0.3, 1), background 700ms ease",
        }} />
      </div>

      {/* Profyle link */}
      <a href="/" style={{
        position: "fixed", top: "20px", left: "24px",
        fontSize: "12px", fontWeight: 800, letterSpacing: "0.18em",
        textTransform: "uppercase", color: inkColor,
        textDecoration: "none", zIndex: 50, opacity: 0.5,
        fontFamily: "inherit",
        transition: "color 700ms ease",
      }}>
        Profyle
      </a>

      {/* Question counter */}
      <div style={{
        position: "fixed", top: "20px", right: "24px",
        fontSize: "11px", fontWeight: 700, letterSpacing: "0.14em",
        textTransform: "uppercase", color: faintColor, zIndex: 50,
        transition: "color 700ms ease",
      }}>
        {current + 1} of {shuffled.length}
      </div>

      {/* Main content */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "80px 24px 120px" }}>
        <div style={{
          maxWidth: question.format === "binary" ? "680px" : "600px",
          width: "100%",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(10px)",
          transition: "opacity 280ms ease, transform 280ms ease",
        }}>
          {/* Question text */}
          <h2 style={{
            fontSize: "clamp(22px, 4vw, 30px)",
            fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.2,
            color: inkColor, marginBottom: "32px",
            textWrap: "balance" as const,
            transition: "color 700ms ease",
          }}>
            {question.text}
          </h2>

          {/* ─── BINARY ─── */}
          {question.format === "binary" && (
            <div style={{ display: "flex", gap: "14px" }}>
              {(["LEFT", "RIGHT"] as const).map((side) => {
                const opt = side === "LEFT" ? question.binaryLeft! : question.binaryRight!;
                const isSelected = selectedAnswer === opt;
                return (
                  <button
                    key={side}
                    onClick={() => handleSelect(opt)}
                    style={{
                      flex: 1, padding: "28px 22px", borderRadius: "16px",
                      border: `1.5px solid ${isSelected ? optSelBorder : optBorder}`,
                      background: isSelected ? optSelBg : optBg,
                      cursor: "pointer", textAlign: "center", fontFamily: "inherit",
                      transition: "border-color 200ms ease, background 200ms ease",
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        (e.currentTarget as HTMLElement).style.borderColor = isDark ? "rgba(255,255,255,0.35)" : "#999992";
                        (e.currentTarget as HTMLElement).style.background = isDark ? "rgba(255,255,255,0.13)" : "#EAE8E3";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        (e.currentTarget as HTMLElement).style.borderColor = optBorder;
                        (e.currentTarget as HTMLElement).style.background = optBg;
                      }
                    }}
                  >
                    <span style={{
                      fontSize: "clamp(14px, 1.8vw, 16px)", fontWeight: 700, lineHeight: 1.45,
                      color: isSelected ? optSelText : optNormText,
                      display: "block",
                      transition: "color 700ms ease",
                    }}>
                      {question.options[opt]}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* ─── PILL ─── */}
          {question.format === "pill" && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {OPTION_LETTERS.map((letter) => {
                const isSelected = selectedAnswer === letter;
                return (
                  <button
                    key={letter}
                    onClick={() => handleSelect(letter)}
                    style={{
                      padding: "13px 22px", borderRadius: "100px",
                      border: `1.5px solid ${isSelected ? optSelBorder : optBorder}`,
                      background: isSelected ? optSelBg : optBg,
                      cursor: "pointer", fontFamily: "inherit",
                      fontSize: "14px", fontWeight: isSelected ? 700 : 500,
                      color: isSelected ? optSelText : optNormText,
                      transition: "all 200ms ease",
                      whiteSpace: "nowrap" as const,
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        (e.currentTarget as HTMLElement).style.borderColor = isDark ? "rgba(255,255,255,0.35)" : "#999992";
                        (e.currentTarget as HTMLElement).style.background = isDark ? "rgba(255,255,255,0.13)" : "#EAE8E3";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        (e.currentTarget as HTMLElement).style.borderColor = optBorder;
                        (e.currentTarget as HTMLElement).style.background = optBg;
                      }
                    }}
                  >
                    {question.options[letter]}
                  </button>
                );
              })}
            </div>
          )}

          {/* ─── SLIDER ─── */}
          {question.format === "slider" && (
            <div style={{ paddingTop: "8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: "24px", marginBottom: "28px" }}>
                <span style={{
                  fontSize: "13px", fontWeight: 600, lineHeight: 1.4,
                  color: faintColor, maxWidth: "40%",
                  transition: "color 700ms ease",
                }}>
                  {question.options["A"]}
                </span>
                <span style={{
                  fontSize: "13px", fontWeight: 600, lineHeight: 1.4,
                  color: faintColor, maxWidth: "40%", textAlign: "right",
                  transition: "color 700ms ease",
                }}>
                  {question.options["D"]}
                </span>
              </div>
              <div style={{ position: "relative", height: "52px", display: "flex", alignItems: "center" }}>
                {/* Track line */}
                <div style={{
                  position: "absolute", left: "18px", right: "18px", height: "2px",
                  background: isDark ? "rgba(255,255,255,0.18)" : "#E0DDD6",
                  borderRadius: "2px",
                  transition: "background 700ms ease",
                }}/>
                {/* 4 stop buttons */}
                <div style={{ display: "flex", justifyContent: "space-between", width: "100%", position: "relative", zIndex: 1 }}>
                  {[1, 2, 3, 4].map((pos) => {
                    const opt = SLIDER_TO_OPTION[pos];
                    const isSelected = selectedAnswer ? OPTION_TO_SLIDER[selectedAnswer] === pos : false;
                    return (
                      <button
                        key={pos}
                        onClick={() => handleSelect(opt)}
                        style={{
                          width: "38px", height: "38px", borderRadius: "50%",
                          border: `2px solid ${isSelected ? optSelBorder : (isDark ? "rgba(255,255,255,0.22)" : "#C8C4BE")}`,
                          background: isSelected ? optSelBg : optBg,
                          cursor: "pointer", padding: 0, fontFamily: "inherit",
                          transition: "all 200ms ease",
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}
                        onMouseEnter={(e) => {
                          if (!isSelected) {
                            (e.currentTarget as HTMLElement).style.borderColor = isDark ? "rgba(255,255,255,0.5)" : "#888881";
                            (e.currentTarget as HTMLElement).style.background = isDark ? "rgba(255,255,255,0.15)" : "#E8E5DE";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected) {
                            (e.currentTarget as HTMLElement).style.borderColor = isDark ? "rgba(255,255,255,0.22)" : "#C8C4BE";
                            (e.currentTarget as HTMLElement).style.background = optBg;
                          }
                        }}
                      >
                        {isSelected && (
                          <div style={{
                            width: "10px", height: "10px", borderRadius: "50%",
                            background: optSelText,
                          }}/>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ─── BARE ─── */}
          {question.format === "bare" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {OPTION_LETTERS.map((letter) => {
                const isSelected = selectedAnswer === letter;
                return (
                  <button
                    key={letter}
                    onClick={() => handleSelect(letter)}
                    style={{
                      padding: "18px 22px", borderRadius: "14px",
                      border: `1.5px solid ${isSelected ? optSelBorder : optBorder}`,
                      background: isSelected ? optSelBg : optBg,
                      cursor: "pointer", textAlign: "left", fontFamily: "inherit",
                      transition: "all 200ms ease",
                      width: "100%",
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        (e.currentTarget as HTMLElement).style.borderColor = isDark ? "rgba(255,255,255,0.35)" : "#999992";
                        (e.currentTarget as HTMLElement).style.background = isDark ? "rgba(255,255,255,0.13)" : "#EAE8E3";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        (e.currentTarget as HTMLElement).style.borderColor = optBorder;
                        (e.currentTarget as HTMLElement).style.background = optBg;
                      }
                    }}
                  >
                    <span style={{
                      fontSize: "15px", fontWeight: isSelected ? 600 : 500,
                      lineHeight: 1.5,
                      color: isSelected ? optSelText : optNormText,
                      transition: "color 700ms ease",
                    }}>
                      {question.options[letter]}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* ─── STANDARD (fallback) ─── */}
          {(!question.format || question.format === "standard") && (
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
                      border: `1.5px solid ${isSelected ? optSelBorder : optBorder}`,
                      background: isSelected ? optSelBg : optBg,
                      cursor: "pointer", textAlign: "left", fontFamily: "inherit",
                      transition: "all 200ms ease",
                      width: "100%",
                    }}
                  >
                    <span style={{
                      width: "28px", height: "28px", borderRadius: "8px",
                      background: isSelected ? "rgba(255,255,255,0.15)" : (isDark ? "rgba(255,255,255,0.12)" : "var(--border)"),
                      color: isSelected ? "white" : (isDark ? "rgba(255,255,255,0.5)" : "var(--muted)"),
                      fontSize: "12px", fontWeight: 700,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0, letterSpacing: "0.04em",
                    }}>
                      {letter}
                    </span>
                    <span style={{
                      fontSize: "15px", fontWeight: isSelected ? 600 : 500,
                      lineHeight: 1.5, color: isSelected ? optSelText : optNormText,
                      paddingTop: "3px",
                    }}>
                      {question.options[letter]}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Missing questions reminder (shown when last question is answered but others remain) */}
          {isLast && missingIds.length > 0 && (
            <p style={{ marginTop: "24px", fontSize: "13px", fontWeight: 600, color: "#E82B2B", textAlign: "center" }}>
              {missingIds.length} question{missingIds.length > 1 ? "s" : ""} still unanswered — tap the red dots below
            </p>
          )}
        </div>
      </div>

      {/* Question dots bar */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        padding: "16px 24px",
        display: "flex", justifyContent: "center",
        background: `linear-gradient(to top, ${bgColor} 70%, transparent)`,
        zIndex: 40,
        transition: "background 700ms ease",
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
                    ? `2px solid ${isDark ? "rgba(255,255,255,0.85)" : "var(--ink)"}`
                    : isMissing
                    ? "2px solid #E82B2B"
                    : "2px solid transparent",
                  background: isCurrent
                    ? (isDark ? "rgba(255,255,255,0.85)" : "var(--ink)")
                    : isAnswered
                    ? (isDark ? "rgba(255,255,255,0.40)" : "#BEBBB5")
                    : (isDark ? "rgba(255,255,255,0.12)" : "var(--border)"),
                  color: isCurrent
                    ? (isDark ? "#1A0A2E" : "white")
                    : isAnswered
                    ? (isDark ? "rgba(255,255,255,0.9)" : "white")
                    : faintColor,
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

      {/* Submitting overlay */}
      {submitting && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 100,
          display: "flex", alignItems: "center", justifyContent: "center",
          backgroundColor: bgColor, transition: "background-color 700ms ease",
        }}>
          <p style={{ fontSize: "17px", fontWeight: 700, color: inkColor, letterSpacing: "0.01em" }}>
            Revealing your type…
          </p>
        </div>
      )}

    </div>
  );
}

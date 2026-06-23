"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { loveQuestions } from "@/lib/love-questions";
import { LoveAnswer } from "@/lib/love-types";

const BURGUNDY = "#8B2252";
const TOTAL = loveQuestions.length;

function bgColor(progress: number) {
  // cream #F5F3EE → deep blush #F0D5D5
  const r = Math.round(245 - 5  * progress);
  const g = Math.round(243 - 30 * progress);
  const b = Math.round(238 - 25 * progress);
  return `rgb(${r},${g},${b})`;
}

// ─── Question-type renderers ──────────────────────────────────────────────────

function BinaryQuestion({
  question, answer, onAnswer,
}: {
  question: typeof loveQuestions[0];
  answer: LoveAnswer | undefined;
  onAnswer: (a: LoveAnswer) => void;
}) {
  return (
    <div style={{ position: "fixed", inset: 0, display: "flex" }}>
      {/* Left half */}
      <div
        onClick={() => { if (!answer) onAnswer("LEFT"); }}
        style={{
          flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
          padding: "48px 32px", cursor: answer ? "default" : "pointer",
          background: answer === "LEFT" ? BURGUNDY : "rgba(0,0,0,0.04)",
          borderRight: "1px solid rgba(0,0,0,0.08)",
          transition: "background 300ms ease",
        }}
      >
        <p style={{
          fontSize: "clamp(16px, 2.5vw, 22px)", fontWeight: 600, lineHeight: 1.5,
          textAlign: "center", color: answer === "LEFT" ? "white" : "var(--ink)",
          maxWidth: "260px",
          transition: "color 300ms ease",
        }}>
          {question.left}
        </p>
      </div>
      {/* Right half */}
      <div
        onClick={() => { if (!answer) onAnswer("RIGHT"); }}
        style={{
          flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
          padding: "48px 32px", cursor: answer ? "default" : "pointer",
          background: answer === "RIGHT" ? BURGUNDY : "rgba(0,0,0,0.04)",
          transition: "background 300ms ease",
        }}
      >
        <p style={{
          fontSize: "clamp(16px, 2.5vw, 22px)", fontWeight: 600, lineHeight: 1.5,
          textAlign: "center", color: answer === "RIGHT" ? "white" : "var(--ink)",
          maxWidth: "260px",
          transition: "color 300ms ease",
        }}>
          {question.right}
        </p>
      </div>
    </div>
  );
}

function BareQuestion({
  question, answer, onAnswer,
}: {
  question: typeof loveQuestions[0];
  answer: LoveAnswer | undefined;
  onAnswer: (a: LoveAnswer) => void;
}) {
  const opts = ["A", "B", "C", "D"] as const;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {opts.map((letter) => {
        const isSelected = answer === letter;
        return (
          <button
            key={letter}
            onClick={() => { if (!answer) onAnswer(letter); }}
            style={{
              background: "none", border: "none", cursor: answer ? "default" : "pointer",
              textAlign: "left", fontFamily: "inherit", padding: "0",
              display: "flex", alignItems: "flex-start", gap: "14px",
            }}
          >
            {isSelected && (
              <span style={{ width: "3px", height: "24px", background: BURGUNDY, borderRadius: "2px", flexShrink: 0, marginTop: "2px" }}/>
            )}
            <span style={{
              fontSize: "clamp(18px, 3vw, 24px)", fontWeight: isSelected ? 700 : 400,
              color: isSelected ? "var(--ink)" : "var(--muted)",
              lineHeight: 1.4,
              transition: "color 200ms ease, font-weight 200ms ease",
            }}>
              {question.options?.[letter]}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function PillQuestion({
  question, answer, onAnswer,
}: {
  question: typeof loveQuestions[0];
  answer: LoveAnswer | undefined;
  onAnswer: (a: LoveAnswer) => void;
}) {
  const opts = ["A", "B", "C", "D"] as const;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {opts.map((letter) => {
        const isSelected = answer === letter;
        return (
          <button
            key={letter}
            onClick={() => onAnswer(letter)}
            style={{
              display: "flex", alignItems: "flex-start", gap: "14px",
              padding: "18px 22px", borderRadius: "14px",
              border: `1.5px solid ${isSelected ? BURGUNDY : "var(--border)"}`,
              background: isSelected ? "rgba(139,34,82,0.08)" : "var(--bg)",
              cursor: "pointer", textAlign: "left", fontFamily: "inherit",
              transition: "border-color 180ms ease, background 180ms ease",
              width: "100%",
            }}
          >
            <span style={{
              width: "28px", height: "28px", borderRadius: "8px", flexShrink: 0,
              background: isSelected ? BURGUNDY : "var(--border)",
              color: isSelected ? "white" : "var(--muted)",
              fontSize: "12px", fontWeight: 700,
              display: "flex", alignItems: "center", justifyContent: "center",
              letterSpacing: "0.04em",
            }}>
              {letter}
            </span>
            <span style={{
              fontSize: "15px", fontWeight: isSelected ? 600 : 500,
              lineHeight: 1.5, color: "var(--ink)", paddingTop: "3px",
            }}>
              {question.options?.[letter]}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function SliderQuestion({
  question, answer, onAnswer,
}: {
  question: typeof loveQuestions[0];
  answer: LoveAnswer | undefined;
  onAnswer: (a: LoveAnswer) => void;
}) {
  const [val, setVal] = useState(() => parseInt((answer as string) ?? "3"));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseInt(e.target.value);
    setVal(v);
    onAnswer(String(v) as LoveAnswer);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
      <style>{`
        .love-slider {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 4px;
          border-radius: 2px;
          background: var(--border);
          outline: none;
          cursor: pointer;
        }
        .love-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: ${BURGUNDY};
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(139,34,82,0.4);
        }
        .love-slider::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: ${BURGUNDY};
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 8px rgba(139,34,82,0.4);
        }
      `}</style>

      <input
        type="range" min={1} max={5} step={1}
        value={val}
        onChange={handleChange}
        className="love-slider"
      />

      <div style={{ display: "flex", justifyContent: "space-between", gap: "24px" }}>
        <p style={{
          fontSize: "14px", fontWeight: 500, color: val === 1 ? "var(--ink)" : "var(--muted)",
          lineHeight: 1.5, maxWidth: "180px",
          transition: "color 200ms ease",
        }}>
          {question.sliderLeft}
        </p>
        <p style={{
          fontSize: "14px", fontWeight: 500, color: val === 5 ? "var(--ink)" : "var(--muted)",
          lineHeight: 1.5, textAlign: "right", maxWidth: "180px",
          transition: "color 200ms ease",
        }}>
          {question.sliderRight}
        </p>
      </div>

      {/* Position dots */}
      <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "4px" }}>
        {[1,2,3,4,5].map((n) => (
          <div key={n} style={{
            width: "8px", height: "8px", borderRadius: "50%",
            background: n <= val ? BURGUNDY : "var(--border)",
            transition: "background 200ms ease",
          }}/>
        ))}
      </div>
    </div>
  );
}

// ─── Main quiz ────────────────────────────────────────────────────────────────

export default function LoveQuizPage() {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, LoveAnswer>>({});
  const [visible, setVisible] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const autoAdvanceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const question = loveQuestions[current];
  const progress = (current + 1) / TOTAL;
  const isLast   = current === TOTAL - 1;
  const currentAnswer = answers[question.id];
  const isBinary = question.type === "binary";
  const isBare   = question.type === "bare";
  const isSlider = question.type === "slider";
  const isPill   = question.type === "pill";
  const autoAdvance = isBinary || isBare;
  const needsNext   = isSlider || isPill;

  const transition = useCallback((fn: () => void) => {
    setVisible(false);
    setTimeout(() => { fn(); setVisible(true); }, 200);
  }, []);

  const advance = useCallback(() => {
    if (!isLast) transition(() => setCurrent((c) => c + 1));
  }, [isLast, transition]);

  const handleAnswer = useCallback((answer: LoveAnswer) => {
    setAnswers((prev) => ({ ...prev, [question.id]: answer }));
    if (autoAdvance && !isLast) {
      const delay = isBinary ? 800 : 600;
      autoAdvanceRef.current = setTimeout(() => {
        transition(() => setCurrent((c) => c + 1));
      }, delay);
    }
  }, [question.id, autoAdvance, isBinary, isLast, transition]);

  // Clear auto-advance timers on unmount
  useEffect(() => () => { if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current); }, []);

  // For sliders, pre-fill with default "3" so user can tap Next without dragging
  useEffect(() => {
    if (isSlider && !answers[question.id]) {
      setAnswers((prev) => ({ ...prev, [question.id]: "3" }));
    }
  }, [question.id, isSlider, answers]);

  const handleSubmit = useCallback(async () => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/love-submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });
      const data = await res.json();
      sessionStorage.setItem("profyle_love_result", JSON.stringify(data.result));
      router.push("/love/results");
    } catch {
      setSubmitting(false);
    }
  }, [answers, router]);

  const bg = bgColor(progress);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: bg, transition: "background 600ms ease" }}>

      {/* Progress bar */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: "3px", background: "rgba(0,0,0,0.08)", zIndex: 50 }}>
        <div style={{
          height: "100%", background: BURGUNDY,
          width: `${progress * 100}%`,
          transition: "width 400ms cubic-bezier(0.16,1,0.3,1)",
        }}/>
      </div>

      {/* Nav */}
      <a href="/love" style={{
        position: "fixed", top: "20px", left: "24px",
        fontSize: "12px", fontWeight: 800, letterSpacing: "0.18em",
        textTransform: "uppercase", color: "var(--ink)",
        textDecoration: "none", zIndex: 50, opacity: 0.45,
        fontFamily: "inherit",
      }}>
        Profyle
      </a>
      <div style={{
        position: "fixed", top: "20px", right: "24px",
        fontSize: "11px", fontWeight: 700, letterSpacing: "0.14em",
        textTransform: "uppercase", color: "var(--faint)", zIndex: 50,
      }}>
        {current + 1} of {TOTAL}
      </div>

      {/* Binary questions use full-screen split */}
      {isBinary ? (
        <div style={{
          opacity: visible ? 1 : 0, transition: "opacity 200ms ease",
          position: "fixed", inset: 0, zIndex: 10,
        }}>
          {/* Question text at top centre */}
          <div style={{
            position: "absolute", top: "72px", left: 0, right: 0, zIndex: 20,
            textAlign: "center", padding: "0 24px",
          }}>
            <p style={{
              fontSize: "clamp(14px, 2vw, 18px)", fontWeight: 600, fontStyle: "italic",
              color: "var(--muted)", display: "inline",
            }}>
              {question.text}
            </p>
          </div>
          <BinaryQuestion question={question} answer={currentAnswer} onAnswer={handleAnswer}/>
        </div>
      ) : (
        <div style={{
          flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
          padding: "80px 24px 120px",
        }}>
          <div style={{
            maxWidth: "560px", width: "100%",
            opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(10px)",
            transition: "opacity 200ms ease, transform 200ms ease",
          }}>
            <h2 style={{
              fontSize: "clamp(20px, 3.5vw, 28px)", fontWeight: 800,
              letterSpacing: "-0.02em", lineHeight: 1.25,
              color: "var(--ink)", marginBottom: "32px",
              fontStyle: isBare ? "italic" : "normal",
            }}>
              {question.text}
            </h2>

            {isBare   && <BareQuestion   question={question} answer={currentAnswer} onAnswer={handleAnswer}/>}
            {isPill   && <PillQuestion   question={question} answer={currentAnswer} onAnswer={handleAnswer}/>}
            {isSlider && <SliderQuestion question={question} answer={currentAnswer} onAnswer={handleAnswer}/>}

            {/* Next / Submit */}
            {needsNext && (
              <div style={{ marginTop: "36px" }}>
                {isLast ? (
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    style={{
                      width: "100%", padding: "16px", borderRadius: "12px",
                      background: submitting ? "var(--muted)" : BURGUNDY,
                      color: "white", fontSize: "15px", fontWeight: 700,
                      border: "none", cursor: submitting ? "default" : "pointer",
                      fontFamily: "inherit",
                    }}
                  >
                    {submitting ? "Discovering your type…" : "See how I love →"}
                  </button>
                ) : (
                  <button
                    onClick={advance}
                    style={{
                      padding: "14px 36px", borderRadius: "12px",
                      background: BURGUNDY, color: "white",
                      fontSize: "14px", fontWeight: 700,
                      border: "none", cursor: "pointer", fontFamily: "inherit",
                    }}
                  >
                    Next →
                  </button>
                )}
              </div>
            )}

            {/* Auto-advance questions: show submit on last question */}
            {autoAdvance && isLast && currentAnswer && (
              <div style={{ marginTop: "36px" }}>
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  style={{
                    width: "100%", padding: "16px", borderRadius: "12px",
                    background: submitting ? "var(--muted)" : BURGUNDY,
                    color: "white", fontSize: "15px", fontWeight: 700,
                    border: "none", cursor: submitting ? "default" : "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  {submitting ? "Discovering your type…" : "See how I love →"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bottom dots (hidden for binary) */}
      {!isBinary && (
        <div style={{
          position: "fixed", bottom: 0, left: 0, right: 0,
          padding: "16px 24px",
          display: "flex", justifyContent: "center",
          background: `linear-gradient(to top, ${bg} 70%, transparent)`,
          zIndex: 40, transition: "background 600ms ease",
        }}>
          <div style={{ display: "flex", gap: "5px", flexWrap: "wrap", justifyContent: "center", maxWidth: "520px" }}>
            {loveQuestions.map((q, idx) => {
              const isAnswered = !!answers[q.id];
              const isCurrent  = idx === current;
              return (
                <div
                  key={q.id}
                  onClick={() => { if (!isBinary) { transition(() => setCurrent(idx)); } }}
                  title={`Question ${idx + 1}`}
                  style={{
                    width: "24px", height: "24px", borderRadius: "6px",
                    border: isCurrent ? `2px solid ${BURGUNDY}` : "2px solid transparent",
                    background: isCurrent ? BURGUNDY : isAnswered ? "rgba(139,34,82,0.35)" : "rgba(0,0,0,0.1)",
                    color: isCurrent ? "white" : "transparent",
                    fontSize: "9px", fontWeight: 700,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer",
                    transition: "all 160ms ease",
                  }}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

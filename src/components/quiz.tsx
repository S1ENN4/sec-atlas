"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle2, RotateCcw, XCircle } from "lucide-react";

import { useProgress, topicKey } from "@/lib/progress";
import { cn } from "@/lib/utils";
import type { DomainId, QuizQuestion } from "@/content/types";

// Deterministic shuffle (seeded by the question text) so server and client
// render the same order, and the right answer isn't always in the same slot.
function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function shuffled(q: QuizQuestion): { options: string[]; answer: number } {
  const idx = q.options.map((_, i) => i);
  let seed = hash(q.q);
  for (let i = idx.length - 1; i > 0; i--) {
    seed = Math.imul(seed ^ (seed >>> 15), 2246822519) >>> 0;
    const j = seed % (i + 1);
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  return { options: idx.map((i) => q.options[i]), answer: idx.indexOf(q.answer) };
}

// The question bank is one static JSON file, fetched once per page view the
// first time a quiz scrolls near the viewport (not baked into every topic).
let bankPromise: Promise<Record<string, QuizQuestion[]>> | null = null;
function loadBank() {
  bankPromise ??= fetch("/quiz.json").then((r) => {
    if (!r.ok) throw new Error(String(r.status));
    return r.json() as Promise<Record<string, QuizQuestion[]>>;
  });
  bankPromise.catch(() => {
    bankPromise = null;
  });
  return bankPromise;
}

export function Quiz({ domain, slug }: { domain: DomainId; slug: string }) {
  const { state, saveQuiz, markSeen } = useProgress();
  const sectionRef = useRef<HTMLElement>(null);
  const [questions, setQuestions] = useState<QuizQuestion[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    let cancelled = false;
    const load = () =>
      loadBank()
        .then((bank) => !cancelled && setQuestions(bank[topicKey(domain, slug)] ?? []))
        .catch(() => !cancelled && setFailed(true));
    if (typeof IntersectionObserver === "undefined") {
      load();
      return () => {
        cancelled = true;
      };
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          load();
        }
      },
      { rootMargin: "800px" },
    );
    io.observe(el);
    return () => {
      cancelled = true;
      io.disconnect();
    };
  }, [domain, slug]);

  const prepared = useMemo(
    () => (questions ?? []).map((q) => ({ ...shuffled(q), q: q.q, explain: q.explain })),
    [questions],
  );

  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const best = state.quiz[topicKey(domain, slug)];
  const cur = prepared[i];

  const pick = (n: number) => {
    if (picked !== null) return;
    setPicked(n);
    if (n === cur.answer) setScore((s) => s + 1);
  };

  const next = () => {
    if (i + 1 < prepared.length) {
      setI(i + 1);
      setPicked(null);
      return;
    }
    saveQuiz(domain, slug, score, prepared.length);
    if (score >= Math.ceil(prepared.length * 0.66)) markSeen(domain, slug);
    setDone(true);
  };

  const restart = () => {
    setI(0);
    setPicked(null);
    setScore(0);
    setDone(false);
  };

  return (
    <section ref={sectionRef} className="mt-14 border-t border-border pt-8 print:hidden" aria-labelledby="quiz-title">
      <div className="flex items-baseline justify-between gap-3">
        <h2 id="quiz-title" className="font-mono text-sm uppercase tracking-wider text-muted-foreground">
          teste o que entendeu
        </h2>
        {best ? (
          <span className="font-mono text-xs text-primary/80">
            melhor: {best.best}/{best.total}
          </span>
        ) : null}
      </div>

      <div className="mt-4 min-h-[14rem] rounded-xl border border-border bg-card p-5">
        {failed ? (
          <p className="text-sm text-muted-foreground">Não foi possível carregar as perguntas agora.</p>
        ) : !questions ? (
          <p className="text-sm text-muted-foreground" role="status">
            Carregando perguntas…
          </p>
        ) : prepared.length === 0 ? (
          <p className="text-sm text-muted-foreground">Ainda não há perguntas para este tópico.</p>
        ) : done ? (
          <div className="text-center" role="status">
            <p className="font-mono text-3xl font-bold text-primary">
              {score}/{prepared.length}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {score === prepared.length
                ? "Perfeito. Esse tópico já está no bolso."
                : score >= Math.ceil(prepared.length * 0.66)
                  ? "Bom! O tópico foi marcado como estudado."
                  : "Vale reler o tópico e tentar de novo."}
            </p>
            <button
              type="button"
              onClick={restart}
              className="mt-4 inline-flex items-center gap-1.5 rounded-md border border-border bg-muted/40 px-3 py-1.5 font-mono text-xs transition-colors hover:border-primary/60 hover:text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <RotateCcw className="size-3.5" aria-hidden /> refazer
            </button>
          </div>
        ) : (
          <>
            <p className="font-mono text-[11px] text-muted-foreground">
              pergunta {i + 1} de {prepared.length}
            </p>
            <p className="mt-2 text-base font-medium leading-snug">{cur.q}</p>
            <ul className="mt-4 space-y-2">
              {cur.options.map((opt, n) => {
                const isRight = picked !== null && n === cur.answer;
                const isWrong = picked === n && n !== cur.answer;
                return (
                  <li key={opt}>
                    <button
                      type="button"
                      disabled={picked !== null}
                      onClick={() => pick(n)}
                      className={cn(
                        "flex w-full items-start gap-3 rounded-lg border px-3 py-2.5 text-left text-sm leading-snug transition-colors duration-[120ms] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                        picked === null && "border-border bg-muted/30 hover:border-primary/60 hover:bg-primary/5",
                        isRight && "border-emerald-500/70 bg-emerald-500/10",
                        isWrong && "border-red-500/70 bg-red-500/10",
                        picked !== null && !isRight && !isWrong && "border-border/60 opacity-60",
                      )}
                    >
                      <span
                        className="mt-0.5 flex size-4 shrink-0 items-center justify-center font-mono text-[10px] text-muted-foreground"
                        aria-hidden
                      >
                        {isRight ? (
                          <CheckCircle2 className="size-4 text-emerald-400" />
                        ) : isWrong ? (
                          <XCircle className="size-4 text-red-400" />
                        ) : (
                          String.fromCharCode(65 + n)
                        )}
                      </span>
                      <span>{opt}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
            {picked !== null ? (
              <div className="animate-page-enter mt-4" role="status">
                <p className="text-sm leading-relaxed text-foreground/85">
                  <span className="font-semibold">{picked === cur.answer ? "Certo. " : "Quase. "}</span>
                  {cur.explain}
                </p>
                <button
                  type="button"
                  onClick={next}
                  className="mt-3 rounded-md border border-primary/50 bg-primary/10 px-3 py-1.5 font-mono text-xs text-primary transition-colors hover:bg-primary/20 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  {i + 1 < prepared.length ? "próxima" : "ver resultado"}
                </button>
              </div>
            ) : null}
          </>
        )}
      </div>
    </section>
  );
}

"use client";

import { useState } from "react";
import { useLocale } from "@/components/locale-provider";
import { latestPopulationObservation, populationObservations, populationSource } from "@/lib/data/population";
import type { TranslationKey } from "@/lib/i18n/dictionaries/en";

type QuestionTarget = "population-kpi" | "population-timeseries" | "population-compare";
type Question = { id: string; key: TranslationKey; target: QuestionTarget; baseline: string; end: string; value: number; percent: number | null; tone: "blue" | "orange" | "purple" | "cyan" };

const point = (year: string) => populationObservations.find((item) => item.reference_period === year)!;
const latest = latestPopulationObservation;
const previous = populationObservations.at(-2)!;
const decadeYear = String(Number(latest.reference_period) - 10);
const first = populationObservations[0];
const changeFrom = (baseline: typeof latest) => ({ absolute: latest.value - baseline.value, percent: baseline.value === 0 ? null : (latest.value - baseline.value) / baseline.value * 100 });
const decade = changeFrom(point(decadeYear));
const annual = changeFrom(previous);
const history = changeFrom(first);

const questions: Question[] = [
  { id: "latest", key: "question.latest", target: "population-kpi", baseline: latest.reference_period, end: latest.reference_period, value: latest.value, percent: null, tone: "blue" },
  { id: "decade", key: "question.decade", target: "population-timeseries", baseline: decadeYear, end: latest.reference_period, value: decade.absolute, percent: decade.percent, tone: "orange" },
  { id: "compare", key: "question.compare", target: "population-compare", baseline: previous.reference_period, end: latest.reference_period, value: annual.absolute, percent: annual.percent, tone: "purple" },
  { id: "history", key: "question.history", target: "population-timeseries", baseline: first.reference_period, end: latest.reference_period, value: history.absolute, percent: history.percent, tone: "cyan" },
];

export function QuestionDeck() {
  const { t, format } = useLocale();
  const [active, setActive] = useState("latest");
  const choose = (question: Question) => {
    setActive(question.id);
    const detail = { target: question.target, baseline: question.baseline, end: question.end, questionId: question.id };
    window.dispatchEvent(new CustomEvent("index-world:question-select", { detail }));
    const params = new URLSearchParams({ content: question.target, region: "kr" });
    if (question.target === "population-timeseries") { params.set("start", question.baseline); params.set("end", question.end); params.set("period", question.end); }
    if (question.target === "population-compare") { params.set("compare", "period"); params.set("baseline", question.baseline); params.set("target", question.end); }
    window.history.replaceState(null, "", `?${params}#${question.target}`);
    document.getElementById(question.target)?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
  };
  return (
    <section className="question-deck shell" aria-labelledby="question-heading">
      <div className="question-deck-heading"><span>ASK INDEX</span><h2 id="question-heading">{t("search.heading")}</h2><p>{t("discovery.verified")}</p></div>
      <div className="question-grid">
        {questions.map((question, index) => <button type="button" key={question.id} className={`question-card tone-${question.tone}`} aria-pressed={active === question.id} onClick={() => choose(question)}>
          <span className="question-number">0{index + 1}</span>
          <strong>{t(question.key)}</strong>
          <span className="question-answer">{question.id === "latest" ? format.number(question.value) : format.number(question.value, { signDisplay: "always" })} <small>{t("data.people")}</small></span>
          <span className="question-meta">{question.baseline}{question.baseline !== question.end ? ` → ${question.end}` : ""}{question.percent === null ? "" : ` · ${format.number(question.percent, { maximumFractionDigits: 2, signDisplay: "always" })}%`}</span>
          <span className="question-route">{question.target === "population-compare" ? t("compare.heading") : question.target === "population-timeseries" ? t("timeseries.heading") : t("kpi.heading")} <b aria-hidden="true">→</b></span>
        </button>)}
      </div>
      <p className="question-source">VERIFIED · {populationSource.source_org} · {populationSource.source_id}</p>
    </section>
  );
}

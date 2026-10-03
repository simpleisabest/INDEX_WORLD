"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale } from "@/components/locale-provider";
import type { TranslationKey } from "@/lib/i18n/dictionaries/en";
import { latestPopulationObservation, populationObservations } from "@/lib/data/population";
import { ShareButton } from "@/components/share-button";

import { populationChange } from "@/lib/data/population-tools";

export type KpiDatum = {
  labelKey: TranslationKey;
  indicatorId: string;
  value: number | null;
  unit: string | null;
  referencePeriod: string | null;
  change: string | null;
  quality: "PENDING" | "VERIFIED" | "PROVISIONAL" | "STALE" | "REVIEW_REQUIRED";
  source: string | null;
};

const latestChange = populationChange(latestPopulationObservation, populationObservations.at(-2))!;

const populationKpis: KpiDatum[] = [
  { labelKey: "kpi.total", indicatorId: "population_total", value: latestPopulationObservation.value, unit: "person", referencePeriod: latestPopulationObservation.reference_period, change: null, quality: "VERIFIED", source: latestPopulationObservation.source_org },
  { labelKey: "kpi.change", indicatorId: "population_change", value: latestChange.absolute, unit: "person", referencePeriod: `${Number(latestPopulationObservation.reference_period) - 1}–${latestPopulationObservation.reference_period}`, change: null, quality: "VERIFIED", source: latestPopulationObservation.source_org },
  { labelKey: "kpi.changeRate", indicatorId: "population_change_percent", value: latestChange.percent, unit: "percent", referencePeriod: `${Number(latestPopulationObservation.reference_period) - 1}–${latestPopulationObservation.reference_period}`, change: null, quality: "VERIFIED", source: latestPopulationObservation.source_org },
  { labelKey: "kpi.age65", indicatorId: "population_age_65_plus", value: null, unit: "percent", referencePeriod: null, change: null, quality: "PENDING", source: null },
];

const sparklineValues = populationObservations.slice(-12).map((item) => item.value);
const sparklineWidth = 240;
const sparklineHeight = 58;
const sparklineMin = Math.min(...sparklineValues);
const sparklineSpread = Math.max(Math.max(...sparklineValues) - sparklineMin, 1);
const sparklinePath = sparklineValues.map((value, index) => `${index ? "L" : "M"}${(index / (sparklineValues.length - 1) * sparklineWidth).toFixed(1)},${(6 + (Math.max(...sparklineValues) - value) / sparklineSpread * (sparklineHeight - 12)).toFixed(1)}`).join(" ");

function AnimatedValue({ value, decimals = 0, signed = false }: { value: number; decimals?: number; signed?: boolean }) {
  const { format } = useLocale();
  const [displayed, setDisplayed] = useState(value);
  const node = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const target = node.current;
    if (!target) return;
    let frame = 0;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      const started = performance.now();
      const start = value < 0 ? value * .82 : value * .94;
      const tick = (time: number) => {
        const progress = Math.min((time - started) / 720, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplayed(start + (value - start) * eased);
        if (progress < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    });
    observer.observe(target);
    return () => { observer.disconnect(); cancelAnimationFrame(frame); };
  }, [value]);
  return <span ref={node}>{format.number(displayed, { maximumFractionDigits: decimals, minimumFractionDigits: decimals, ...(signed ? { signDisplay: "always" as const } : {}) })}</span>;
}

export function KPIBlock({ items = populationKpis }: { items?: KpiDatum[] }) {
  const { t, format } = useLocale();
  return (
    <section id="population-kpi" className="kpi-section" aria-labelledby="kpi-heading">
      <div className="shell">
        <div className="kpi-header">
          <div>
            <p>{t("kpi.kicker")}</p>
            <h2 id="kpi-heading">{t("kpi.heading")}</h2>
          </div>
          <div className="block-tools"><div className="kpi-status"><i /> {t("kpi.status")}</div><ShareButton contentId="population-kpi" regionId="kr" referencePeriod={latestPopulationObservation.reference_period} title={t("kpi.heading")} description={`${t("kpi.disclaimer")} · ${latestPopulationObservation.source_org} · ${latestPopulationObservation.source_id}`} /></div>
        </div>

        <div className="kpi-grid">
          {items.map((item, index) => (
            <article className="kpi-card" key={item.indicatorId}>
              <div className="kpi-card-top">
                <span>0{index + 1}</span>
                <span>{item.quality}</span>
              </div>
              <p>{item.indicatorId}</p>
              <h3>{t(item.labelKey)}</h3>
              <div className="kpi-value" aria-label={item.value === null ? `${t(item.labelKey)} ${t("kpi.preparing")}` : `${t(item.labelKey)} ${format.number(item.value, { maximumFractionDigits: item.unit === "percent" ? 2 : 0, ...(item.indicatorId.startsWith("population_change") ? { signDisplay: "always" as const } : {}) })} ${(item.unit === "percent" ? "%" : t("data.people"))}`}>
                <strong>{item.value === null ? "—" : <AnimatedValue value={item.value} decimals={item.unit === "percent" ? 2 : 0} signed={item.indicatorId.startsWith("population_change")} />}</strong>
                {item.value !== null && item.unit && <span>{(item.unit === "percent" ? "%" : t("data.people"))}</span>}
              </div>
              {index === 0 && <div className="kpi-sparkline" aria-label={`${populationObservations.at(-12)!.reference_period}–${latestPopulationObservation.reference_period}`}>
                <svg viewBox={`0 0 ${sparklineWidth} ${sparklineHeight}`} role="img" aria-label={`${t("timeseries.heading")} · ${populationObservations.at(-12)!.reference_period}–${latestPopulationObservation.reference_period}`}>
                  <path className="sparkline-area" d={`${sparklinePath} L${sparklineWidth},${sparklineHeight} L0,${sparklineHeight} Z`} />
                  <path className="sparkline-line" d={sparklinePath} pathLength="1" />
                  <circle cx={sparklineWidth} cy={6 + (Math.max(...sparklineValues) - sparklineValues.at(-1)!) / sparklineSpread * (sparklineHeight - 12)} r="4" />
                </svg>
                <a href="#population-timeseries">12Y TREND <span aria-hidden="true">→</span></a>
              </div>}
              <dl>
                <div><dt>{t("kpi.period")}</dt><dd>{item.referencePeriod ?? t("kpi.preparing")}</dd></div>
                <div><dt>{t("kpi.source")}</dt><dd>{item.source ?? t("kpi.preparing")}</dd></div>
              </dl>
            </article>
          ))}
        </div>
        <p className="kpi-disclaimer">{t("kpi.disclaimer")}</p>
      </div>
    </section>
  );
}

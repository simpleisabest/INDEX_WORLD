"use client";

import { useLocale } from "@/components/locale-provider";
import type { TranslationKey } from "@/lib/i18n/dictionaries/en";
import { latestPopulationObservation } from "@/lib/data/population";

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

const populationKpis: KpiDatum[] = [
  { labelKey: "kpi.total", indicatorId: "population_total", value: latestPopulationObservation.value, unit: "person", referencePeriod: latestPopulationObservation.reference_period, change: null, quality: "VERIFIED", source: latestPopulationObservation.source_org },
  { labelKey: "kpi.change", indicatorId: "population_change", value: null, unit: "percent", referencePeriod: null, change: null, quality: "PENDING", source: null },
  { labelKey: "kpi.age65", indicatorId: "population_age_65_plus", value: null, unit: "percent", referencePeriod: null, change: null, quality: "PENDING", source: null },
  { labelKey: "kpi.youth", indicatorId: "population_youth", value: null, unit: "person", referencePeriod: null, change: null, quality: "PENDING", source: null },
];

export function KPIBlock({ items = populationKpis }: { items?: KpiDatum[] }) {
  const { t, format } = useLocale();
  return (
    <section className="kpi-section" aria-labelledby="kpi-heading">
      <div className="shell">
        <div className="kpi-header">
          <div>
            <p>{t("kpi.kicker")}</p>
            <h2 id="kpi-heading">{t("kpi.heading")}</h2>
          </div>
          <div className="kpi-status"><i /> {t("kpi.status")}</div>
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
              <div className="kpi-value" aria-label={item.value === null ? `${t(item.labelKey)} ${t("kpi.preparing")}` : `${t(item.labelKey)} ${format.number(item.value)} ${t("data.people")}`}>
                <strong>{item.value === null ? "—" : format.number(item.value)}</strong>
                {item.value !== null && item.unit && <span>{t("data.people")}</span>}
              </div>
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

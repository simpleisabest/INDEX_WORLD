"use client";

import { useMemo, useState } from "react";
import { useLocale } from "@/components/locale-provider";
import { populationObservations, populationSource } from "@/lib/data/population";

const ranges = [10, 25, 0] as const;

export function PopulationTimeSeriesBlock() {
  const { t, format } = useLocale();
  const [range, setRange] = useState<(typeof ranges)[number]>(25);
  const observations = useMemo(() => range ? populationObservations.slice(-range) : populationObservations, [range]);
  const [selectedPeriod, setSelectedPeriod] = useState(populationObservations.at(-1)!.reference_period);
  const selected = populationObservations.find((item) => item.reference_period === selectedPeriod) ?? observations.at(-1)!;
  const width = 900;
  const height = 300;
  const inset = { top: 24, right: 22, bottom: 42, left: 22 };
  const values = observations.map((item) => item.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const spread = Math.max(max - min, 1);
  const points = observations.map((item, index) => ({
    ...item,
    x: inset.left + (index / Math.max(observations.length - 1, 1)) * (width - inset.left - inset.right),
    y: inset.top + ((max - item.value) / spread) * (height - inset.top - inset.bottom),
  }));
  const path = points.map((point, index) => `${index ? "L" : "M"}${point.x.toFixed(1)},${point.y.toFixed(1)}`).join(" ");

  return (
    <section className="timeseries-section" aria-labelledby="timeseries-heading">
      <div className="shell">
        <div className="timeseries-header">
          <div>
            <p>{t("timeseries.kicker")}</p>
            <h2 id="timeseries-heading">{t("timeseries.heading")}</h2>
          </div>
          <div className="timeseries-range" aria-label={t("timeseries.range")}>
            {ranges.map((years) => <button key={years} type="button" aria-pressed={range === years} onClick={() => setRange(years)}>{years || t("timeseries.all")}{years ? t("timeseries.years") : ""}</button>)}
          </div>
        </div>

        <div className="timeseries-grid">
          <div className="chart-panel">
            <div className="chart-reading" aria-live="polite">
              <span>{t("timeseries.region")}</span><strong>{t("timeseries.korea")}</strong>
              <span>{selected.reference_period}</span><strong>{format.number(selected.value)} {t("data.people")}</strong>
            </div>
            <div className="chart-scroll">
              <svg className="population-chart" viewBox={`0 0 ${width} ${height}`} role="img" aria-labelledby="chart-title chart-desc">
                <title id="chart-title">{t("timeseries.heading")}</title>
                <desc id="chart-desc">{t("timeseries.description")}</desc>
                {[0, .5, 1].map((step) => <line key={step} x1={inset.left} x2={width - inset.right} y1={inset.top + step * (height - inset.top - inset.bottom)} y2={inset.top + step * (height - inset.top - inset.bottom)} />)}
                <path className="chart-area" d={`${path} L${points.at(-1)!.x},${height - inset.bottom} L${points[0].x},${height - inset.bottom} Z`} />
                <path className="chart-line" d={path} />
                {points.map((point) => <circle key={point.reference_period} className={selected.reference_period === point.reference_period ? "is-selected" : ""} cx={point.x} cy={point.y} r="8" role="button" tabIndex={0} aria-label={`${point.reference_period}: ${format.number(point.value)} ${t("data.people")}`} onMouseEnter={() => setSelectedPeriod(point.reference_period)} onFocus={() => setSelectedPeriod(point.reference_period)} onClick={() => setSelectedPeriod(point.reference_period)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") setSelectedPeriod(point.reference_period); }} />)}
                <text x={inset.left} y={height - 12}>{observations[0].reference_period}</text>
                <text x={width - inset.right} y={height - 12} textAnchor="end">{observations.at(-1)!.reference_period}</text>
              </svg>
            </div>
          </div>

          <aside className="source-card" aria-label={t("timeseries.sourceDetails")}>
            <span className="quality-badge">● {selected.quality_status}</span>
            <h3>{t("timeseries.sourceDetails")}</h3>
            <dl>
              <div><dt>{t("timeseries.organization")}</dt><dd>{populationSource.source_org}</dd></div>
              <div><dt>{t("timeseries.dataset")}</dt><dd>{populationSource.dataset_name}</dd></div>
              <div><dt>{t("timeseries.indicator")}</dt><dd>{populationSource.source_id}</dd></div>
              <div><dt>{t("timeseries.reference")}</dt><dd>{selected.reference_period}</dd></div>
              <div><dt>{t("timeseries.updated")}</dt><dd>{format.date(selected.ingested_at, { dateStyle: "medium" })}</dd></div>
              <div><dt>{t("timeseries.license")}</dt><dd>{populationSource.license}</dd></div>
            </dl>
            <a href={populationSource.source_url} target="_blank" rel="noreferrer">{t("timeseries.original")} ↗</a>
          </aside>
        </div>
      </div>
    </section>
  );
}

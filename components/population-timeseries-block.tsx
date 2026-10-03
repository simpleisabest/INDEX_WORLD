"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale } from "@/components/locale-provider";
import { populationObservations, populationSource } from "@/lib/data/population";
import { ExportMenu } from "@/components/export-menu";

import { clampPopulationPeriod, populationChange, populationCsv, selectPopulationRange } from "@/lib/data/population-tools";

const ranges = [10, 25, 0] as const;
const firstYear = Number(populationObservations[0].reference_period);
const lastYear = Number(populationObservations.at(-1)!.reference_period);

export function PopulationTimeSeriesBlock() {
  const { t, format } = useLocale();
  const [startYear, setStartYear] = useState(lastYear - 24);
  const [endYear, setEndYear] = useState(lastYear);
  const observations = useMemo(() => selectPopulationRange(populationObservations, startYear, endYear), [startYear, endYear]);
  const [selectedPeriod, setSelectedPeriod] = useState(String(lastYear));
  const selected = clampPopulationPeriod(observations, selectedPeriod);
  const previous = populationObservations.find((point) => Number(point.reference_period) === Number(selected.reference_period) - 1);
  const change = populationChange(selected, previous);
  const citation = `${populationSource.source_org}. ${populationSource.dataset_name}, ${populationSource.source_id}, Korea, Rep., ${startYear}–${endYear}. ${populationSource.source_url}. ${populationSource.license}. INDEX WORLD: ${selected.version}; ${selected.ingested_at}.`;
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const period = params.get("period");
    if (params.get("content") === "population-timeseries" && params.get("region") === "kr" && period && populationObservations.some((point) => point.reference_period === period)) {
      const id = window.setTimeout(() => { const start = Number(params.get("start")), end = Number(params.get("end"));
        if (params.has("start") && params.has("end") && Number.isInteger(start) && Number.isInteger(end) && start >= firstYear && end <= lastYear && start <= Number(period) && end >= Number(period)) { setStartYear(start); setEndYear(end); }
        else setStartYear(Math.min(lastYear - 24, Number(period)));
        setSelectedPeriod(period); document.getElementById("population-timeseries")?.scrollIntoView(); }, 0);
      return () => window.clearTimeout(id);
    }
  }, []);
  const shareState = { contentId: "population-timeseries", regionId: "kr", referencePeriod: selected.reference_period, timeRange: { start: startYear, end: endYear } };
  const artifact = {
    title: t("timeseries.heading"), subtitle: `${startYear}–${endYear} · ${selected.reference_period}: ${format.number(selected.value)} ${t("data.people")}`,
    headers: [t("timeseries.reference"), t("kpi.total")], rows: observations.map(point => [point.reference_period, `${format.number(point.value)} ${t("data.people")}`]),
    points: observations.map(point => ({ label: point.reference_period, value: point.value, display: `${format.number(point.value)} ${t("data.people")}` })),
    chart: "line" as const, citation, source: `${populationSource.source_org} · ${populationSource.dataset_name} · ${populationSource.source_id}`,
    sourceUrl: populationSource.source_url, license: populationSource.license, licenseUrl: populationSource.license_url,
    metadata: `${t("export.axis")} · ${selected.version} · ${t("timeseries.updated")}: ${selected.ingested_at}`,
    quality: observations.every(point => point.quality_status === "VERIFIED") ? "VERIFIED" : "REVIEW_REQUIRED",
    csv: populationCsv(observations, populationSource, selected.version, selected.ingested_at), filename: `index-world-korea-population-${startYear}-${endYear}`,
  };
  const width = 900;
  const height = 300;
  const inset = { top: 24, right: 22, bottom: 42, left: 96 };
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
    <section id="population-timeseries" className="timeseries-section" aria-labelledby="timeseries-heading">
      <div className="shell">
        <div className="timeseries-header">
          <div>
            <p>{t("timeseries.kicker")}</p>
            <h2 id="timeseries-heading">{t("timeseries.heading")}</h2>
          </div>
          <div className="block-tools">
            <div className="timeseries-range" aria-label={t("timeseries.range")}>
              {ranges.map((years) => <button key={years} type="button" aria-pressed={endYear === lastYear && startYear === (years ? lastYear - years + 1 : firstYear)} onClick={() => { setStartYear(years ? lastYear - years + 1 : firstYear); setEndYear(lastYear); }}>{years || t("timeseries.all")}{years ? t("timeseries.years") : ""}</button>)}
            </div>
            <ExportMenu artifact={artifact} shareState={shareState} />
          </div>
        </div>

        <div className="period-controls">
          <label>{t("timeseries.start")}<select value={startYear} onChange={(event) => setStartYear(Number(event.target.value))}>{populationObservations.filter((point) => Number(point.reference_period) <= endYear).map((point) => <option key={point.reference_period}>{point.reference_period}</option>)}</select></label>
          <label>{t("timeseries.end")}<select value={endYear} onChange={(event) => setEndYear(Number(event.target.value))}>{populationObservations.filter((point) => Number(point.reference_period) >= startYear).map((point) => <option key={point.reference_period}>{point.reference_period}</option>)}</select></label>
        </div>
        <div className="timeseries-grid">
          <div className="chart-panel">
            <div className="chart-reading" aria-live="polite">
              <span>{t("timeseries.region")}</span><strong>{t("timeseries.korea")}</strong>
              <span>{selected.reference_period}</span><strong>{format.number(selected.value)} {t("data.people")}</strong>
            </div>
            <p className="chart-change">{t("kpi.change")}: {change ? `${format.number(change.absolute, { signDisplay: "always" })} ${t("data.people")} · ${change.percent === null ? "—" : format.number(change.percent, { maximumFractionDigits: 2, signDisplay: "always" }) + "%"}` : t("timeseries.unavailable")}</p>
            <label className="year-slider">{t("timeseries.selectYear")} · {selected.reference_period}<input type="range" min={startYear} max={endYear} value={Number(selected.reference_period)} onChange={(event) => setSelectedPeriod(event.target.value)} /></label>
            <div className="chart-scroll">
              <svg className="population-chart" viewBox={`0 0 ${width} ${height}`} role="group" aria-labelledby="chart-title chart-desc">
                <title id="chart-title">{t("timeseries.heading")}</title>
                <desc id="chart-desc">{t("timeseries.description")}</desc>
                {[0, .5, 1].map((step) => <line key={step} x1={inset.left} x2={width - inset.right} y1={inset.top + step * (height - inset.top - inset.bottom)} y2={inset.top + step * (height - inset.top - inset.bottom)} />)}
                {[0, .5, 1].map((step) => <text key={step} x={inset.left - 10} y={inset.top + step * (height - inset.top - inset.bottom) + 4} textAnchor="end">{format.number(Math.round(max - step * spread))}</text>)}
                <path className="chart-area" d={`${path} L${points.at(-1)!.x},${height - inset.bottom} L${points[0].x},${height - inset.bottom} Z`} />
                <path className="chart-line" d={path} />
                {points.map((point) => <circle key={point.reference_period} className={selected.reference_period === point.reference_period ? "is-selected" : ""} cx={point.x} cy={point.y} r="8" role="button" tabIndex={0} aria-pressed={selected.reference_period === point.reference_period} aria-label={`${point.reference_period}: ${format.number(point.value)} ${t("data.people")}`} onMouseEnter={() => setSelectedPeriod(point.reference_period)} onFocus={() => setSelectedPeriod(point.reference_period)} onClick={() => setSelectedPeriod(point.reference_period)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setSelectedPeriod(point.reference_period); } }} />)}
                <text x={inset.left} y={height - 12}>{observations[0].reference_period}</text>
                <text x={width - inset.right} y={height - 12} textAnchor="end">{observations.at(-1)!.reference_period}</text>
              </svg>
            </div>
            <details className="population-table"><summary>{t("timeseries.table")}</summary><table><caption>{startYear}–{endYear} · {t("data.people")}</caption><thead><tr><th scope="col">{t("timeseries.reference")}</th><th scope="col">{t("kpi.total")}</th></tr></thead><tbody>{observations.map((point) => <tr key={point.reference_period}><th scope="row">{point.reference_period}</th><td>{format.number(point.value)}</td></tr>)}</tbody></table></details>
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
              <div><dt>{t("timeseries.license")}</dt><dd><a href={populationSource.license_url} target="_blank" rel="noreferrer">{populationSource.license} ↗</a></dd></div>
              <div><dt>{t("timeseries.publication")}</dt><dd>{selected.publication_date ? format.date(selected.publication_date) : t("timeseries.unavailable")}</dd></div>
            </dl>
            <p className="source-note">{t("timeseries.methodology")}</p>
            <details><summary>{t("timeseries.citation")}</summary><p className="citation-text">{citation}</p></details>
            <a href={populationSource.source_url} target="_blank" rel="noreferrer">{t("timeseries.original")} ↗</a>
          </aside>
        </div>
      </div>
    </section>
  );
}

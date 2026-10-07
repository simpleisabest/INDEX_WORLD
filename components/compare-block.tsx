"use client";

import type { TranslationKey } from "@/lib/i18n/dictionaries/en";
import { useEffect, useState } from "react";
import { useLocale } from "@/components/locale-provider";
import { ExportMenu } from "@/components/export-menu";

import { compareObservations, comparisonCsv, resolveComparisonIds, type CompareModel } from "@/lib/data/compare";
import { populationCompareModel } from "@/lib/data/population-compare";

type CompareCopyKey = Extract<TranslationKey, `compare.${string}`>;
export type CompareBlockProps = { model?: CompareModel; labels?: Partial<Record<CompareCopyKey, TranslationKey>> };

export function CompareBlock({ model = populationCompareModel, labels = {} }: CompareBlockProps) {
  const { t, format } = useLocale();
  const text = (key: CompareCopyKey) => t(labels[key] ?? key);
  const [baselineId, setBaselineId] = useState(model.baselineId);
  const [targetId, setTargetId] = useState(model.targetId);
  const baseline = model.options.find((option) => option.id === baselineId)!;
  const target = model.options.find((option) => option.id === targetId)!;
  const result = compareObservations(model.dimension, baseline.observation, target.observation);
  const unit = (value: string) => value === "person" ? text("compare.people") : value;
  const number = (value: number) => format.number(value, { maximumFractionDigits: 0 });
  const signed = (value: number, precision = 0) => format.number(value, { signDisplay: "always", maximumFractionDigits: precision });
  const maxValue = Math.max(baseline.observation.value, target.observation.value, 0);
  const shareState = { contentId: model.contentId, regionId: baseline.observation.region_id, comparison: { dimension: model.dimension, baselineId, targetId } };
  const citation = [baseline, target].map((option) => `${option.label}: ${option.observation.source_org}, ${option.observation.dataset_name}, ${option.observation.source_id}, ${option.observation.country_id}/${option.observation.region_id}, ${option.observation.reference_period}: ${option.observation.value} ${option.observation.unit}. ${option.observation.source_url}. ${option.observation.license} (${option.observation.license_url}). ${option.observation.version}; ${option.observation.ingested_at}.`).join("\n");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("content") !== model.contentId || params.get("compare") !== model.dimension) return;
    const restored = resolveComparisonIds(model.options, params.get("baseline"), params.get("target"));
    if (!restored || params.get("region") !== model.options.find((option) => option.id === restored.baselineId)?.observation.region_id) return;
    const id = window.setTimeout(() => { setBaselineId(restored.baselineId); setTargetId(restored.targetId); document.getElementById(model.contentId)?.scrollIntoView(); }, 0);
    return () => window.clearTimeout(id);
  }, [model]);
  useEffect(() => {
    const select = (event: Event) => {
      const detail = (event as CustomEvent<{ target: string; baseline: string; end: string }>).detail;
      if (detail.target !== "population-compare") return;
      if (model.options.some((option) => option.id === detail.baseline)) setBaselineId(detail.baseline);
      if (model.options.some((option) => option.id === detail.end)) setTargetId(detail.end);
    };
    window.addEventListener("index-world:question-select", select);
    return () => window.removeEventListener("index-world:question-select", select);
  }, [model.options]);

  const artifact = {
    title: `${text("compare.heading")}: ${baseline.label} → ${target.label}`,
    subtitle: `${text("compare.difference")}: ${result.absolute === null ? text("compare.unavailable") : signed(result.absolute)} ${unit(target.observation.unit)} · ${text("compare.rate")}: ${result.percent === null ? text("compare.unavailable") : signed(result.percent, 2) + "%"}`,
    headers: [text("compare.role"), text("compare.period"), text("compare.value")],
    rows: [baseline, target].map((option, index) => [text(index ? "compare.target" : "compare.baseline"), option.observation.reference_period, `${number(option.observation.value)} ${unit(option.observation.unit)}`]),
    points: [baseline, target].map(option => ({ label: option.label, value: option.observation.value, display: `${number(option.observation.value)} ${unit(option.observation.unit)}` })),
    chart: "bars" as const, citation,
    source: `${baseline.observation.source_org} · ${baseline.observation.dataset_name} · ${baseline.observation.source_id}`,
    sourceUrl: baseline.observation.source_url, license: baseline.observation.license, licenseUrl: baseline.observation.license_url,
    metadata: `${text("compare.formula")} ${text("compare.zeroAxis")} · ${baseline.observation.version} · ${text("compare.ingested")}: ${baseline.observation.ingested_at}`,
    quality: result.comparable ? "VERIFIED" : "REVIEW_REQUIRED", csv: comparisonCsv(result), filename: `index-world-population-compare-${baselineId}-${targetId}`,
  };

  return (
    <section id={model.contentId} className="compare-section" aria-labelledby={`${model.contentId}-heading`}>
      <div className="shell">
        <div className="timeseries-header">
          <div><p>{text("compare.kicker")}</p><h2 id={`${model.contentId}-heading`}>{text("compare.heading")}</h2></div>
          <ExportMenu artifact={artifact} shareState={shareState} />
        </div>
        <p className="compare-intro">{text("compare.description")}</p>
        <div className="compare-dimensions" aria-label="Compare dimensions"><span className="is-active">YEAR ↔ YEAR <b>LIVE</b></span><span>REGION ↔ REGION <b>REVIEW</b></span><span>COUNTRY ↔ COUNTRY <b>ROADMAP</b></span><span>INDICATOR ↔ INDICATOR <b>ROADMAP</b></span></div>
        <div className="period-controls">
          <label>{text("compare.baseline")}<select value={baselineId} onChange={(event) => setBaselineId(event.target.value)}>{model.options.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}</select></label>
          <button type="button" onClick={() => { setBaselineId(targetId); setTargetId(baselineId); }}>{text("compare.swap")}</button>
          <label>{text("compare.target")}<select value={targetId} onChange={(event) => setTargetId(event.target.value)}>{model.options.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}</select></label>
        </div>
        <div className="compare-summary" aria-live="polite" aria-atomic="true">
          <article><h3>{text("compare.difference")}</h3><strong>{result.absolute === null ? text("compare.unavailable") : signed(result.absolute)}</strong><span>{result.absolute === null ? "" : unit(target.observation.unit)}</span><p>{baseline.label} → {target.label}</p></article>
          <article><h3>{text("compare.rate")}</h3><strong>{result.percent === null ? text("compare.unavailable") : `${signed(result.percent, 2)}%`}</strong><p>{text("compare.denominator")}: {baseline.label}</p></article>
        </div>
        {baselineId === targetId && <p className="compare-note">{text("compare.same")}</p>}
        <p className="compare-note">{text("compare.formula")}</p>
        <div className="compare-visual-grid">
          <div className="compare-chart" role="img" aria-label={`${text("compare.chart")}: ${baseline.label}: ${number(baseline.observation.value)} ${unit(baseline.observation.unit)}; ${target.label}: ${number(target.observation.value)} ${unit(target.observation.unit)}`}>
            <h3>{text("compare.chart")}</h3>
            {result.comparable && baseline.observation.value >= 0 && target.observation.value >= 0 ? <>
              {[baseline, target].map((option, index) => <div className="compare-bar-row" key={index} aria-hidden="true"><div><span>{option.label}</span><strong>{number(option.observation.value)} {unit(option.observation.unit)}</strong></div><div className="compare-track"><div className={index ? "compare-bar target" : "compare-bar"} style={{ width: `${maxValue ? option.observation.value / maxValue * 100 : 0}%` }} /></div></div>)}
              <p className="compare-note">{text("compare.zeroAxis")}</p>
            </> : <p>{text("compare.incompatible")}</p>}
          </div>
          <div className="compare-table-wrap"><table className="compare-table"><caption>{text("compare.table")}</caption><thead><tr><th scope="col">{text("compare.role")}</th><th scope="col">{text("compare.period")}</th><th scope="col">{text("compare.value")}</th></tr></thead><tbody>{[baseline, target].map((option, index) => <tr key={index}><th scope="row">{text(index ? "compare.target" : "compare.baseline")} · {option.label}</th><td>{option.observation.reference_period}</td><td>{number(option.observation.value)} {unit(option.observation.unit)}</td></tr>)}</tbody></table></div>
        </div>
        <details className="compare-sources" open>
          <summary>{text("compare.sources")}</summary>
          <div className="compare-source-grid">{[baseline, target].map((option, index) => <div key={index} className="compare-source"><h3>{text(index ? "compare.target" : "compare.baseline")} · {option.label}</h3><dl>
            <div><dt>{text("compare.source")}</dt><dd><a href={option.observation.source_url} target="_blank" rel="noreferrer">{option.observation.source_org} · {option.observation.dataset_name} ↗</a></dd></div>
            <div><dt>{text("compare.indicator")}</dt><dd>{option.observation.source_id}</dd></div>
            <div><dt>{text("compare.period")}</dt><dd>{option.observation.reference_period}</dd></div>
            <div><dt>{text("compare.quality")}</dt><dd>{option.observation.quality_status}</dd></div>
            <div><dt>{text("compare.version")}</dt><dd>{option.observation.version}</dd></div>
            <div><dt>{text("compare.ingested")}</dt><dd>{format.date(option.observation.ingested_at, { dateStyle: "medium" })}</dd></div>
            <div><dt>{text("compare.published")}</dt><dd>{option.observation.publication_date ? format.date(option.observation.publication_date, { dateStyle: "medium" }) : text("compare.unavailable")}</dd></div>
            <div><dt>{text("compare.license")}</dt><dd><a href={option.observation.license_url} target="_blank" rel="noreferrer">{option.observation.license} ↗</a></dd></div>
          </dl></div>)}</div>
          <p className="compare-note">{text("compare.methodology")}</p>
          <details className="compare-citation"><summary>{text("compare.citation")}</summary><p className="citation-text">{citation}</p></details>
        </details>
      </div>
    </section>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale } from "@/components/locale-provider";
import { ExportMenu } from "@/components/export-menu";
import { CompareBlock } from "@/components/compare-block";
import { connectedIndicatorSeries, indicatorRegistry } from "@/lib/data/catalog";
import { validatePublication } from "@/lib/data/publication";
import { verifiedDataRecords } from "@/lib/data/verified-records";
import { indicatorArtifact, indicatorCompareModel, indicatorContentId, indicatorSelection, liveSprintIds } from "@/lib/data/indicator-tools";

const notes: Record<string, { ko: string; en: string }> = {
  business_birth_rate: { ko: "기업생멸행정통계의 산업 전체 신생률 공표값입니다. 제11차 산업분류 기준 2016~2024년 확정치만 표시하며 2025년 잠정치는 제외했습니다. 비율 차이는 %p입니다.", en: "Published enterprise birth rate, all industries, KSIC 11th revision. Final observations for 2016–2024 only; 2025 provisional values excluded. Rate differences are percentage points." },
  business_death_rate: { ko: "기업생멸행정통계의 산업 전체 소멸률 공표값입니다. 제11차 산업분류 기준 2016~2024년 확정치만 표시하며 미공표·잠정치는 생성하지 않습니다. 비율 차이는 %p입니다.", en: "Published enterprise death rate, all industries, KSIC 11th revision. Final observations for 2016–2024 only. Missing or provisional observations are never generated. Rate differences are percentage points." },
  apartment_price_index: { ko: "월간 전국 아파트 매매가격지수, 2026년 6월=100. 계절조정하지 않은 조사 지수이며 실거래가격지수와 다릅니다. 공개 CSV의 2025년 12월~2026년 9월 10개월 범위입니다.", en: "Monthly national apartment sale survey index, June 2026=100, not seasonally adjusted or a transaction-price index. Public CSV coverage: December 2025–September 2026 (10 months)." },
  apartment_jeonse_price_index: { ko: "월간 전국 아파트 전세가격지수, 2026년 6월=100. 계절조정하지 않은 조사 지수입니다. 공개 CSV의 2025년 12월~2026년 9월 10개월 범위입니다.", en: "Monthly national apartment jeonse survey index, June 2026=100, not seasonally adjusted. Public CSV coverage: December 2025–September 2026 (10 months)." },
  gdp_per_capita_usd: { ko: "당해년 미국 달러 기준의 명목 1인당 GDP입니다. 물가 조정값이나 개인 급여가 아닙니다.", en: "GDP per person in current US dollars. Not inflation-adjusted income or an individual's salary." },
  consumer_price_inflation_wdi: { ko: "소비자물가의 연간 상승률입니다. CPI 지수 수준이나 전월 대비 수치가 아닙니다. 두 연도의 차이는 %p이며, 비교의 증감률은 기준값 대비 상대 변화입니다.", en: "Annual consumer-price inflation, not the CPI level or a monthly change. Differences between rates are percentage points; relative change uses the selected baseline." },
  unemployment_ilo_modelled: { ko: "전체 노동력 대비 실업자의 비율인 ILO 모형 추정치입니다. 한국의 월간 공식 조사 실업률과 구분하며 국가·지역 순위에는 사용하지 않습니다.", en: "ILO modeled unemployment as a share of the total labor force. Distinct from Korea's monthly national survey rate; not used for country or regional rankings." },
};

export function IndicatorExplorer() {
  const { locale } = useLocale();
  const [id, setId] = useState(liveSprintIds[0]);
  const [requestedPeriod, setRequestedPeriod] = useState<string | null>(null);
  useEffect(() => {
    const restore = () => {
      const selection = indicatorSelection(new URLSearchParams(window.location.search));
      if (!selection) return;
      setId(selection.id); setRequestedPeriod(selection.period);
      window.setTimeout(() => document.getElementById(selection.compare ? `${indicatorContentId(selection.id)}-compare` : indicatorContentId(selection.id))?.scrollIntoView(), 0);
    };
    restore(); window.addEventListener("popstate", restore);
    return () => window.removeEventListener("popstate", restore);
  }, []);
  return <section id="verified-indicators" className="verified-explorer" aria-labelledby="verified-indicators-heading">
    <div className="shell"><div className="timeseries-header"><div><p>OFFICIAL DATA · VERIFIED</p><h2 id="verified-indicators-heading">{locale === "ko" ? "공식 데이터, 연결된 지표" : "Explore verified indicators"}</h2></div></div>
      <label className="indicator-picker">{locale === "ko" ? "지표 선택" : "Choose an indicator"}<select value={id} onChange={event => { setId(event.target.value); setRequestedPeriod(null); }}>
        {liveSprintIds.map(item => { const indicator = indicatorRegistry.find(record => record.id === item)!; return <option key={item} value={item}>{locale === "ko" ? indicator.title.ko : indicator.title.en}</option>; })}
      </select></label>
    </div>
    <IndicatorPanel key={`${id}:${requestedPeriod ?? "latest"}`} id={id} requestedPeriod={requestedPeriod} />
  </section>;
}

function IndicatorPanel({ id, requestedPeriod }: { id: string; requestedPeriod: string | null }) {
  const { t, locale, format } = useLocale();
  const points = useMemo(() => { const series = connectedIndicatorSeries(id); validatePublication(series); return series; }, [id]);
  const model = useMemo(() => indicatorCompareModel(id), [id]);
  const [period, setPeriod] = useState(requestedPeriod && points.some(point => point.reference_period === requestedPeriod) ? requestedPeriod : points.at(-1)!.reference_period);
  const selected = points.find(point => point.reference_period === period)!;
  const record = verifiedDataRecords.find(item => item.id === id)!;
  const indicator = indicatorRegistry.find(item => item.id === id)!;
  const title = locale === "ko" ? indicator.title.ko : indicator.title.en;
  const note = notes[id][locale === "ko" ? "ko" : "en"];
  const artifact = indicatorArtifact(id, title, selected.reference_period);
  const min = Math.min(...points.map(point => point.value));
  const max = Math.max(...points.map(point => point.value));
  const spread = max - min || 1;
  const line = points.map((point, index) => `${index ? "L" : "M"}${90 + index / (points.length - 1) * 780},${24 + (max - point.value) / spread * 240}`).join(" ");
  return <>
    <section className="timeseries-section indicator-series" id={indicatorContentId(id)} aria-labelledby={`${id}-heading`}>
      <div className="shell"><div className="timeseries-header"><div><p>VERIFIED · KOREA, REP. · {record.cadence.toUpperCase()}</p><h2 id={`${id}-heading`}>{title}</h2></div><ExportMenu artifact={artifact} shareState={{ contentId: indicatorContentId(id), regionId: "kr", referencePeriod: selected.reference_period }} allowEmbed={false} /></div>
        <p className="source-note">{note}</p>
        <div className="period-controls"><label>{locale === "ko" ? "시점" : "Period"}<select value={selected.reference_period} onChange={event => setPeriod(event.target.value)}>{points.map(point => <option key={point.reference_period}>{point.reference_period}</option>)}</select></label></div>
        <div className="compare-summary" aria-live="polite"><article><h3>{selected.reference_period}</h3><strong>{format.number(selected.value, { maximumFractionDigits: 2 })}</strong><span>{selected.unit}</span></article><article><h3>{t("compare.quality")}</h3><strong>VERIFIED</strong><span>{points[0].reference_period}–{points.at(-1)!.reference_period}</span></article></div>
        <figure className="timeseries-chart indicator-chart"><svg viewBox="0 0 900 310" role="img" aria-labelledby={`${id}-chart-title`}><title id={`${id}-chart-title`}>{`${title}, ${points[0].reference_period}–${points.at(-1)!.reference_period}, ${selected.unit}`}</title>
          {[0, .5, 1].map(step => <g key={step}><line x1="90" x2="870" y1={24 + step * 240} y2={24 + step * 240} stroke="currentColor" opacity=".15" /><text x="80" y={28 + step * 240} textAnchor="end" fontSize="13">{format.number(max - step * spread, { maximumFractionDigits: 2 })}</text></g>)}
          <path d={line} fill="none" stroke="currentColor" strokeWidth="3" /><text x="90" y="300" fontSize="13">{points[0].reference_period}</text><text x="870" y="300" textAnchor="end" fontSize="13">{points.at(-1)!.reference_period}</text>
        </svg><figcaption>{selected.unit} · {locale === "ko" ? "세로축 범위" : "Vertical axis"}: {format.number(min, { maximumFractionDigits: 2 })}–{format.number(max, { maximumFractionDigits: 2 })}</figcaption></figure>
        <details className="compare-sources" open><summary>{t("compare.sources")}</summary><p><a href={record.source_url} target="_blank" rel="noreferrer">{record.source_org} · {record.code} ↗</a> · <a href={record.license_url} target="_blank" rel="noreferrer">{record.license}</a></p><p className="source-note">{record.original_source}</p><p className="source-note">{t("timeseries.updated")}: {record.ingested_at.slice(0, 10)} · {locale === "ko" ? "원본 DB 갱신" : "Source database updated"}: {record.source_last_updated ?? t("timeseries.unavailable")} · {t("timeseries.publication")}: {t("timeseries.unavailable")}</p><p className="citation-text">{artifact.citation}</p></details>
        <details><summary>{t("compare.table")}</summary><div className="compare-table-wrap"><table className="compare-table"><caption>{title} · {selected.unit}</caption><thead><tr><th scope="col">{t("compare.period")}</th><th scope="col">{locale === "ko" ? "값" : "Value"}</th></tr></thead><tbody>{points.map(point => <tr key={point.reference_period}><th scope="row">{point.reference_period}</th><td>{format.number(point.value, { maximumFractionDigits: 4 })}</td></tr>)}</tbody></table></div></details>
      </div>
    </section>
    <CompareBlock key={id} model={model} heading={`${title} · ${locale === "ko" ? "시점 비교" : "Compare periods"}`} description={note} differenceUnit={indicator.unit === "percent" ? (locale === "ko" ? "%p" : "percentage points") : indicator.unit} copy={{ "compare.kicker": "COMPARE · VERIFIED DATA", "compare.period": locale === "ko" ? "시점" : "Period", "compare.baseline": locale === "ko" ? "기준 시점" : "Baseline period", "compare.target": locale === "ko" ? "비교 시점" : "Comparison period", "compare.swap": locale === "ko" ? "시점 바꾸기" : "Swap periods", "compare.difference": locale === "ko" ? "값의 차이" : "Value difference", "compare.value": locale === "ko" ? "값" : "Value", "compare.chart": title, "compare.methodology": note, "compare.same": locale === "ko" ? "동일 연도: 차이는 0입니다." : "Same year: the difference is zero." }} precision={2} allowNegative={id === "consumer_price_inflation_wdi"} allowEmbed={false} />
  </>;
}

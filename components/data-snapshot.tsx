"use client";

import { useLocale } from "@/components/locale-provider";
import { categoryRegistry, connectedIndicatorSeries, indicatorRegistry } from "@/lib/data/catalog";

import { liveSprintIds, indicatorContentId } from "@/lib/data/indicator-tools";
import { validatePublication } from "@/lib/data/publication";

const connectedIds = ["population_total","population_change_annual","population_change_rate_annual"];
const snapshotIds = [...connectedIds, ...liveSprintIds];
const reviewCategories = ["real-estate-housing","economy-income","jobs-employment","business-startup"] as const;

export function DataSnapshot() {
  const { locale, format, t } = useLocale();
  return <section className="snapshot-section" id="data-snapshot" aria-labelledby="snapshot-heading"><div className="shell">
    <div className="snapshot-heading"><div><p>DATA SNAPSHOT · VERIFIED ONLY</p><h2 id="snapshot-heading">{locale==="ko"?"지금 연결된 데이터":"Data connected now"}</h2></div><p>{locale==="ko"?"숫자는 검증 완료된 데이터만 표시합니다. 다른 분야는 공식 출처 검토 상태입니다.":"Numbers appear only after verification. Other categories show their official-source review status."}</p></div>
    <div className="snapshot-grid">
      {snapshotIds.map((id,index)=>{const indicator=indicatorRegistry.find(item=>item.id===id)!;const series=connectedIndicatorSeries(id);validatePublication(series);const point=series.at(-1)!;const values=series.slice(-8);const min=Math.min(...values.map(item=>item.value));const max=Math.max(...values.map(item=>item.value));const points=values.map((item,i)=>`${i/(values.length-1)*100},${36-(item.value-min)/Math.max(max-min,1)*30}`).join(" ");return <a href={liveSprintIds.includes(id)?`?content=${indicatorContentId(id)}&region=kr&period=${point.reference_period}#${indicatorContentId(id)}`:id==="population_total"?"#population-kpi":"#population-timeseries"} className={`snapshot-card verified snapshot-${index}`} key={id}><span>VERIFIED · {point.reference_period}</span><strong>{format.number(point.value,{maximumFractionDigits:point.unit==="person"?0:2,signDisplay:index===1||index===2?"always":"auto"})}<small>{point.unit==="person"?` ${t("data.people")}`:point.unit==="percent"?"%":` ${point.unit}`}</small></strong><p>{locale==="ko"?indicator.title.ko:indicator.title.en}</p><svg viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true"><polyline points={points} /></svg><small>{point.source_org} ↗</small></a>})}
      {reviewCategories.some(id=>!indicatorRegistry.some(item=>item.categoryId===id&&item.status==="CONNECTED")) && <div className="snapshot-review"><span>SOURCE REVIEW · NO VALUES</span>{reviewCategories.filter(id=>!indicatorRegistry.some(item=>item.categoryId===id&&item.status==="CONNECTED")).map(id=>{const category=categoryRegistry.find(item=>item.id===id)!;const candidate=indicatorRegistry.find(item=>item.categoryId===id)!;return <a key={id} href="#data-catalog"><i className={`tone-dot tone-${category.color}`} /><strong>{t(category.labelKey)}</strong><small>{locale==="ko"?candidate.title.ko:candidate.title.en}</small><b>{candidate.status}</b></a>})}</div>}
    </div>
  </div></section>;
}

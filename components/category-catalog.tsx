"use client";
import { useMemo, useState } from "react";
import { useLocale } from "@/components/locale-provider";
import { categoryRegistry, catalogSummary, indicatorRegistry, connectedIndicatorSeries, type CategoryId } from "@/lib/data/catalog";

export function CategoryCatalog() {
  const { t, locale, format } = useLocale();
  const [selected, setSelected] = useState<CategoryId>("population-household");
  const category=categoryRegistry.find(item=>item.id===selected)!;
  const indicators=useMemo(()=>indicatorRegistry.filter(item=>item.categoryId===selected),[selected]);
  const latestChange=connectedIndicatorSeries("population_change_annual").at(-1)!;
  return <section id="data-catalog" className="catalog-section" aria-labelledby="catalog-heading"><div className="shell">
    <div className="catalog-heading"><div><p>12 DATA CATEGORIES · PHASE 1</p><h2 id="catalog-heading">{t("catalog.heading")}</h2></div><p>{t("catalog.description")}</p></div>
    <div className="catalog-layout">
      <div className="catalog-grid" aria-label={t("catalog.heading")}>{categoryRegistry.map(item=>{const summary=catalogSummary(item.id);return <button type="button" key={item.id} className={`catalog-card tone-${item.color}`} aria-pressed={selected===item.id} onClick={()=>setSelected(item.id)}><span>{String(item.order).padStart(2,"0")}</span><strong>{t(item.labelKey)}</strong><small>{summary.connected ? `${summary.connected} ${t("catalog.connected")}` : item.phase===1?t("catalog.research"):"PHASE 2"}</small></button>})}</div>
      <aside className="catalog-detail" aria-live="polite"><div className="catalog-detail-head"><span>0{category.order} · {category.phase===1?"PHASE 1":"PHASE 2"}</span><h3>{t(category.labelKey)}</h3><p>{indicators.length ? `${indicators.length} ${t("catalog.candidates")}` : t("catalog.phase2")}</p></div>
        <div className="indicator-list">{indicators.length ? indicators.map(item=><article key={item.id} className={`indicator-row status-${item.status.toLowerCase()}`}><div><span>{item.status}</span><strong>{locale==="ko"?item.title.ko:item.title.en}</strong><small>{item.sourceOrg} · {item.cadence} · {item.unit}</small></div>{item.status==="CONNECTED"?<a href={item.id==="population_total"?"#population-kpi":"#population-timeseries"}>{t("catalog.open")} ↗</a>:<em>{item.status==="BLOCKED"?t("catalog.blocked"):t("catalog.review")}</em>}</article>):<p className="catalog-empty">{t("catalog.phase2")}</p>}</div>
      </aside>
    </div>
    <div className="catalog-discovery">
      <a href="#population-kpi"><span>{t("catalog.recommended")}</span><strong>{t("discovery.latest")}</strong><small>{t("discovery.curated")}</small></a>
      <a href="#population-timeseries"><span>{t("catalog.updated")}</span><strong>{latestChange.reference_period} · {format.number(latestChange.value,{signDisplay:"always"})} {t("data.people")}</strong><small>{latestChange.source_org} · {latestChange.version}</small></a>
      <a href="#population-compare"><span>{t("catalog.compare")}</span><strong>2024 → 2025</strong><small>{t("compare.description")}</small></a>
      <div><span>{t("catalog.ranking")}</span><strong>{t("catalog.rankingBlocked")}</strong><small>{t("catalog.rankingReason")}</small></div>
    </div>
  </div></section>;
}

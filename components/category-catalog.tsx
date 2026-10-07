"use client";

import { useMemo, useState } from "react";
import { useLocale } from "@/components/locale-provider";
import { categoryRegistry, catalogSummary, indicatorRegistry, type CategoryDefinition, type CategoryId } from "@/lib/data/catalog";

function CategoryVisual({ category }: { category: CategoryDefinition }) {
  const bars = [34 + category.order % 3 * 7, 55 + category.order % 4 * 6, 42 + category.order % 5 * 5, 76 - category.order % 3 * 4];
  return <span className="catalog-visual" aria-hidden="true"><i>{category.icon.slice(0,1).toUpperCase()}</i><span>{bars.map((height,index)=><b key={index} style={{height:`${height}%`}} />)}</span></span>;
}

export function CategoryCatalog() {
  const { t, locale } = useLocale();
  const [selected, setSelected] = useState<CategoryId>("population-household");
  const category=categoryRegistry.find(item=>item.id===selected)!;
  const indicators=useMemo(()=>indicatorRegistry.filter(item=>item.categoryId===selected),[selected]);
  const copy = <T,>(value:{en:T;ko:T}) => locale === "ko" ? value.ko : value.en;
  return <section id="data-catalog" className="catalog-section" aria-labelledby="catalog-heading"><div className="shell">
    <div className="catalog-heading"><div><p>EXPLORE BY CATEGORY · 12</p><h2 id="catalog-heading">{t("catalog.heading")}</h2></div><p>{t("catalog.description")}</p></div>
    <div className="catalog-grid" aria-label={t("catalog.heading")}>{categoryRegistry.map(item=>{const summary=catalogSummary(item.id);return <button type="button" key={item.id} className={`catalog-card tone-${item.color}`} aria-pressed={selected===item.id} onClick={()=>setSelected(item.id)}>
      <span className="catalog-card-top"><span>{String(item.order).padStart(2,"0")}</span><CategoryVisual category={item} /></span>
      <strong>{t(item.labelKey)}</strong><p>{copy(item.description)}</p>
      <span className="catalog-examples">{copy(item.examples).slice(0,3).map(example=><small key={example}>{example}</small>)}</span>
      <span className="catalog-card-foot"><small>{summary.connected ? `${summary.connected} ${t("catalog.connected")}` : item.phase===1?t("catalog.research"):"ROADMAP"}</small><b aria-hidden="true">→</b></span>
    </button>})}</div>
    <aside className={`catalog-detail tone-${category.color}`} aria-live="polite">
      <div className="catalog-detail-head"><span>{String(category.order).padStart(2,"0")} · {category.phase===1?"PHASE 1":"ROADMAP"}</span><div><h3>{t(category.labelKey)}</h3><p>{copy(category.description)}</p></div></div>
      <div className="indicator-list">{indicators.length ? indicators.map(item=><article key={item.id} className={`indicator-row status-${item.status.toLowerCase()}`}><div><span>{item.status}</span><strong>{locale==="ko"?item.title.ko:item.title.en}</strong><small>{item.sourceOrg} · {item.cadence}</small></div>{item.status==="CONNECTED"?<a href={item.id==="population_total"?"#population-kpi":"#population-timeseries"}>{t("catalog.open")} ↗</a>:<em>{item.status==="BLOCKED"?t("catalog.blocked"):t("catalog.review")}</em>}</article>):<p className="catalog-empty">{t("catalog.phase2")}</p>}</div>
    </aside>
  </div></section>;
}

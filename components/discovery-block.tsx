"use client";
import { useLocale } from "@/components/locale-provider";
import { ShareButton } from "@/components/share-button";
import { populationObservations, populationSource, latestPopulationObservation } from "@/lib/data/population";
import { populationChange } from "@/lib/data/population-tools";
import { discoveryHref } from "@/lib/discovery";

export function DiscoveryBlock({ popular = false }: { popular?: boolean }) {
  const {t,format}=useLocale();
  const latest=latestPopulationObservation,first=populationObservations[0],previous=populationObservations.at(-2)!;
  if (populationObservations.some(point=>point.quality_status!=="VERIFIED")) return null;
  const change=populationChange(latest,previous)!;
  const href=(target:"population-kpi"|"population-timeseries"|"population-compare")=>discoveryHref(target,first.reference_period,latest.reference_period,previous.reference_period);
  const items=[{target:"population-kpi",label:t("discovery.latest"),value:`${latest.reference_period} · ${format.number(latest.value)} ${t("data.people")}`},{target:"population-timeseries",label:t("discovery.history"),value:`${first.reference_period}–${latest.reference_period}`},{target:"population-compare",label:t("discovery.compare"),value:`${previous.reference_period} → ${latest.reference_period} · ${format.number(change.absolute,{signDisplay:"always"})} ${t("data.people")}`} ] as const;
  return <section id={popular?"popular-data":"related-data"} className="section shell discovery-section" aria-labelledby={popular?"popular-heading":"related-heading"}>
    <div className="section-title"><div><p>{t("discovery.kicker")}</p><h2 id={popular?"popular-heading":"related-heading"}>{t(popular?"discovery.explore":"discovery.related")}</h2></div><ShareButton contentId={popular?"popular-data":"related-data"} regionId="kr" title={t(popular?"discovery.explore":"discovery.related")} description={`World Bank · ${populationSource.dataset_name} · ${populationSource.source_id}`} /></div>
    <p className="compare-note">{t(popular?"discovery.curated":"discovery.verified")}</p>
    <div className="discovery-links">{items.slice(0,popular?3:2).map(item=><a key={item.target} href={href(item.target)}><strong>{item.label}</strong><span>{item.value}</span><span aria-hidden="true">↗</span></a>)}</div>
    {!popular&&<details className="related-questions"><summary>{t("discovery.questions")}</summary><dl>
      <div><dt><a href={href("population-kpi")}>{t("discovery.qLatest")}</a></dt><dd>{latest.reference_period} · {format.number(latest.value)} {t("data.people")}</dd></div>
      <div><dt><a href={href("population-compare")}>{t("discovery.qChange")}</a></dt><dd>{previous.reference_period} → {latest.reference_period}: {format.number(change.absolute,{signDisplay:"always"})} {t("data.people")} · {format.number(change.percent!,{maximumFractionDigits:2,signDisplay:"always"})}%</dd></div>
      <div><dt><a href={href("population-timeseries")}>{t("discovery.qHistory")}</a></dt><dd>{first.reference_period}–{latest.reference_period} · {t("discovery.history")}</dd></div>
    </dl></details>}
    <p className="discovery-attribution">INDEX WORLD · <a href={populationSource.source_url} target="_blank" rel="noreferrer">World Bank · {populationSource.source_id} ↗</a></p>
  </section>;
}

export type DiscoveryTarget = "population-kpi" | "population-timeseries" | "population-compare";
export type InternalLinkContract = { contentId: DiscoveryTarget; indicatorId: "population_total"; regionId: "kr"; quality: "VERIFIED"; href: string; sourceUrl: string; version: string };
export type SearchDemandEvent = { schema_version: 1; locale: string; query: string; result_count: number; matched_content_ids: DiscoveryTarget[]; outcome: "MATCHED" | "ZERO_RESULT"; created_at: string; storage: "NOT_CONNECTED" };

export function searchDemandContract(query: string, locale: string, matches: DiscoveryTarget[]): SearchDemandEvent {
  return { schema_version: 1, query: query.trim().slice(0, 200), locale, result_count: matches.length, matched_content_ids: matches, outcome: matches.length ? "MATCHED" : "ZERO_RESULT", created_at: new Date().toISOString(), storage: "NOT_CONNECTED" };
}

export function discoveryHref(target: DiscoveryTarget, firstYear: string, latestYear: string, previousYear: string) {
  const params = new URLSearchParams({ content: target, region: "kr" });
  if (target === "population-timeseries") { params.set("period", latestYear); params.set("start", firstYear); params.set("end", latestYear); }
  if (target === "population-compare") { params.set("compare", "period"); params.set("baseline", previousYear); params.set("target", latestYear); }
  return `?${params}#${target}`;
}

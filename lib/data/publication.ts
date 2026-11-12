import { indicatorRegistry, connectedIndicatorSeries, type CatalogObservation } from "./catalog.ts";

export const pipelineStages = ["SOURCE", "INGEST", "NORMALIZE", "VALIDATE", "VERSION", "QUALITY", "PUBLISH"] as const;

// Existing verified WDI provenance is preserved. Research records alone cannot
// grant permission to publish; a new source needs its own reviewed adapter.
export function validatePublication(points: CatalogObservation[]) {
  if (!points.length) throw new Error("No observations to publish");
  const seen = new Set<string>();
  const first = points[0];
  const expectedByPeriod = new Map(connectedIndicatorSeries(first.indicator_id).map(point => [point.reference_period, point]));
  for (const point of points) {
    const indicator = indicatorRegistry.find(item => item.id === point.indicator_id);
    if (!indicator || indicator.status !== "CONNECTED" || indicator.categoryId !== point.category_id || indicator.unit !== point.unit) throw new Error("Indicator publication gate failed");
    if (point.quality_status !== "VERIFIED" || !Number.isFinite(point.value)) throw new Error("Quality gate failed");
    if (!/^(\d{4}|\d{4}-(0[1-9]|1[0-2]))$/.test(point.reference_period) || point.country_id !== "kr" || point.region_id !== "kr") throw new Error("Period/region gate failed");
    if (![point.source_id, point.source_org, point.source_url, point.dataset_name, point.license, point.license_url, point.version, point.ingested_at].every(Boolean) || !Number.isFinite(Date.parse(point.ingested_at))) throw new Error("Provenance gate failed");
    if (point.indicator_id !== first.indicator_id || point.unit !== first.unit || point.version !== first.version) throw new Error("Mixed series");
    const expected = expectedByPeriod.get(point.reference_period);
    // Exact adapter match prevents plausible arbitrary numbers or an invented
    // license/version from inheriting a connected indicator's status.
    if (!expected || Object.keys(expected).some(key => point[key as keyof CatalogObservation] !== expected[key as keyof CatalogObservation])) throw new Error("Verified adapter mismatch");
    const key = `${point.indicator_id}:${point.region_id}:${point.reference_period}`;
    if (seen.has(key)) throw new Error("Duplicate observation");
    seen.add(key);
  }
  return true;
}

export const blockedDataQueue = indicatorRegistry.filter(item => item.status !== "CONNECTED").map(item => ({
  indicator_id: item.id, category_id: item.categoryId, source_org: item.sourceOrg, source_url: item.sourceUrl,
  stage: "SOURCE" as const, reason: item.blockReason ?? "Dataset-level access, ID, license and definitions remain unverified",
  next_action: "Verify official endpoint and reuse terms, freeze region/period/unit mapping, then add and validate a versioned adapter",
}));

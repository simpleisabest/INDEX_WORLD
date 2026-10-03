export type CompareDimension = "period" | "region" | "country" | "indicator";

export type CompareObservation = {
  country_id: string;
  region_id: string;
  indicator_id: string;
  reference_period: string;
  value: number;
  unit: string;
  quality_status: string;
  source_org: string;
  dataset_name: string;
  source_id: string;
  source_url: string;
  publication_date: string | null;
  ingested_at: string;
  version: string;
  license: string;
  license_url: string;
};

export type CompareOption = { id: string; label: string; observation: CompareObservation };
export type CompareModel = { contentId: string; dimension: CompareDimension; options: CompareOption[]; baselineId: string; targetId: string };

// Additional adapters must supply verified observations; the UI never creates data or region mappings.
export function compareObservations(dimension: CompareDimension, baseline: CompareObservation, target: CompareObservation) {
  if (!["period", "region", "country", "indicator"].includes(dimension)) throw new Error("Unsupported comparison dimension");
  for (const point of [baseline, target]) {
    if (point.quality_status !== "VERIFIED" || !Number.isFinite(point.value)) throw new Error("Comparison requires verified numeric observations");
    for (const key of ["country_id", "region_id", "indicator_id", "reference_period", "unit", "source_org", "dataset_name", "source_id", "source_url", "ingested_at", "version", "license", "license_url"] as const) {
      if (!point[key]) throw new Error(`Missing comparison provenance: ${key}`);
    }
  }
  const sameGeography = baseline.country_id === target.country_id && baseline.region_id === target.region_id;
  const samePeriod = baseline.reference_period === target.reference_period;
  const sameIndicator = baseline.indicator_id === target.indicator_id;
  const comparable = sameIndicator && baseline.unit === target.unit && baseline.source_org === target.source_org && baseline.dataset_name === target.dataset_name && baseline.source_id === target.source_id && baseline.version === target.version;
  if (dimension === "period" && !sameGeography) throw new Error("Period comparison requires the same geography");
  if (dimension === "region" && (baseline.country_id !== target.country_id || !samePeriod)) throw new Error("Region comparison requires the same country and period");
  if (dimension === "country" && !samePeriod) throw new Error("Country comparison requires the same period");
  if (dimension === "indicator" && (!sameGeography || !samePeriod)) throw new Error("Indicator comparison requires the same geography and period");
  const absolute = comparable ? target.value - baseline.value : null;
  const percent = absolute !== null && baseline.value !== 0 ? absolute / baseline.value * 100 : null;
  return { dimension, baseline, target, comparable, absolute, percent };
}

export function comparisonCsv(result: ReturnType<typeof compareObservations>) {
  const columns = ["dimension", "role", "country_id", "region_id", "indicator_id", "reference_period", "value", "unit", "source_org", "dataset_name", "source_id", "source_url", "license", "license_url", "publication_date", "ingested_at", "version", "quality_status", "target_minus_baseline", "percent_of_baseline", "calculation"];
  const calculation = result.comparable ? "difference = target - baseline; percent = difference / baseline * 100; not annualized" : "Not comparable; no difference or percentage calculated";
  const rows = [columns, ...(["baseline", "target"] as const).map((role) => {
    const point = result[role];
    return [result.dimension, role, ...columns.slice(2, 18).map((key) => point[key as keyof CompareObservation] ?? ""), result.absolute ?? "", result.percent ?? "", calculation];
  })];
  return rows.map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(",")).join("\r\n") + "\r\n";
}

export function resolveComparisonIds(options: CompareOption[], baseline: string | null, target: string | null) {
  if (!baseline || !target || !options.some((option) => option.id === baseline) || !options.some((option) => option.id === target)) return null;
  return { baselineId: baseline, targetId: target };
}

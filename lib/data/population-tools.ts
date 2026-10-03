type Point = { reference_period: string; value: number };

export function selectPopulationRange<T extends Point>(series: T[], start: number, end: number) {
  if (!Number.isInteger(start) || !Number.isInteger(end) || start > end) throw new RangeError("Invalid annual range");
  return series.filter((point) => Number(point.reference_period) >= start && Number(point.reference_period) <= end);
}

export function populationChange(current: Point, previous?: Point) {
  if (!previous || Number(current.reference_period) !== Number(previous.reference_period) + 1) return null;
  const absolute = current.value - previous.value;
  return { absolute, percent: previous.value === 0 ? null : absolute / previous.value * 100 };
}

export function clampPopulationPeriod<T extends Point>(series: T[], period: string) {
  return series.find((point) => point.reference_period === period) ?? series.at(-1)!;
}

export function populationCsv(series: Point[], source: { source_org: string; dataset_name: string; source_id: string; source_url: string; license: string; license_url: string }, version: string, ingestedAt: string) {
  const escape = (value: string | number) => `"${String(value).replaceAll('"', '""')}"`;
  const header = ["country_id", "region_id", "indicator_id", "reference_period", "value", "unit", "source_org", "dataset", "source_id", "source_url", "license", "license_url", "version", "ingested_at"];
  const rows = series.map((point) => ["kr", "kr", "population_total", point.reference_period, point.value, "person", source.source_org, source.dataset_name, source.source_id, source.source_url, source.license, source.license_url, version, ingestedAt]);
  return [header, ...rows].map((row) => row.map(escape).join(",")).join("\r\n") + "\r\n";
}

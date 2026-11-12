import { connectedIndicatorSeries, type CatalogObservation } from "./catalog.ts";
import { validatePublication } from "./publication.ts";
import { verifiedDataRecords } from "./verified-records.ts";
import type { CompareModel } from "./compare.ts";
import type { ExportArtifact } from "../export.ts";
import { periodPositions } from "./periods.ts";

export const liveSprintIds = verifiedDataRecords.map(record => record.id);
export function indicatorContentId(id: string) { return `indicator-${id}`; }

export function indicatorSelection(params: URLSearchParams) {
  const content = params.get("content");
  const id = liveSprintIds.find(item => content === indicatorContentId(item) || content === `${indicatorContentId(item)}-compare`);
  if (!id || params.get("region") !== "kr") return null;
  const points = connectedIndicatorSeries(id);
  validatePublication(points);
  const period = params.get("period");
  if (period && !points.some(point => point.reference_period === period)) return null;
  if (content?.endsWith("-compare") && (params.get("compare") !== "period" ||
      !points.some(point => point.reference_period === params.get("baseline")) ||
      !points.some(point => point.reference_period === params.get("target")))) return null;
  return { id, period: period ?? points.at(-1)!.reference_period, compare: content?.endsWith("-compare") ?? false };
}

export function indicatorCitation(points: CatalogObservation[]) {
  validatePublication(points);
  const first = points[0];
  const record = verifiedDataRecords.find(item => item.id === first.indicator_id)!;
  return `${first.source_org}; original source: ${record.original_source}. ${first.dataset_name} (${first.source_id}), Korea, Rep., ${points[0].reference_period}–${points.at(-1)!.reference_period}, ${first.unit}. ${first.source_url}. ${first.license} (${first.license_url}). Version ${first.version}; retrieved ${first.ingested_at}. Values unchanged; INDEX WORLD presentation and period comparison.`;
}

export function indicatorCsv(points: CatalogObservation[]) {
  validatePublication(points);
  const columns = ["category_id", "indicator_id", "country_id", "region_id", "reference_period", "value", "unit", "source_org", "dataset_name", "source_id", "source_url", "license", "license_url", "publication_date", "ingested_at", "version", "quality_status"] as const;
  const rows = [columns, ...points.map(point => columns.map(key => point[key] ?? ""))];
  return rows.map(row => row.map(value => `"${String(value).replaceAll('"', '""')}"`).join(",")).join("\r\n") + "\r\n";
}

export function indicatorCompareModel(id: string): CompareModel {
  const points = connectedIndicatorSeries(id);
  validatePublication(points);
  return { contentId: `${indicatorContentId(id)}-compare`, dimension: "period",
    options: points.map(point => ({ id: point.reference_period, label: point.reference_period, observation: point })),
    baselineId: points.at(-2)!.reference_period, targetId: points.at(-1)!.reference_period };
}

export function indicatorArtifact(id: string, title: string, selectedPeriod: string): ExportArtifact {
  const points = connectedIndicatorSeries(id);
  validatePublication(points);
  const selected = points.find(point => point.reference_period === selectedPeriod);
  if (!selected) throw new Error("Unsupported indicator period");
  const positions = periodPositions(points.map(point => point.reference_period));
  return { title, subtitle: `Korea, Rep. · ${selectedPeriod}: ${selected.value} ${selected.unit}`,
    headers: ["Period", "Value", "Unit"], rows: points.map(point => [point.reference_period, point.value, point.unit]),
    points: points.map((point, index) => ({ label: point.reference_period, value: point.value, display: `${point.value} ${point.unit}`, position: positions[index] })),
    chart: "line", citation: indicatorCitation(points), source: `${selected.source_org} · ${selected.source_id}`,
    sourceUrl: selected.source_url, license: selected.license, licenseUrl: selected.license_url,
    metadata: `${verifiedDataRecords.find(item => item.id === id)!.cadence} · national · ${points[0].reference_period}–${points.at(-1)!.reference_period} · ${selected.version} · retrieved ${selected.ingested_at}`,
    quality: "VERIFIED", allowNegative: id === "consumer_price_inflation_wdi",
    csv: indicatorCsv(points), filename: `index-world-${id}-${selectedPeriod}` };
}

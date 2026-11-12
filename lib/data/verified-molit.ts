import snapshot from "../../data/verified-molit.json" with { type: "json" };
import type { CatalogObservation } from "./catalog.ts";

export const verifiedMolitRecords = snapshot.records;
const contracts = {
  housing_permits: { code: "MOLIT/31/626", cadence: "annual", count: 11, first: "2014", last: "2024" },
  housing_starts: { code: "MOLIT/471/5388", cadence: "annual", count: 11, first: "2014", last: "2024" },
  housing_completions: { code: "MOLIT/468/5374", cadence: "annual", count: 11, first: "2014", last: "2024" },
  unsold_housing: { code: "MOLIT/32/2082", cadence: "monthly", count: 33, first: "2024-01", last: "2026-09" },
  unsold_completed_housing: { code: "MOLIT/32/5328", cadence: "monthly", count: 3, first: "2026-07", last: "2026-09" },
} as const;

export function reviewedMolitSeries(id: string): CatalogObservation[] {
  const record = verifiedMolitRecords.find(item => item.id === id);
  if (!record || !(id in contracts)) return [];
  const contract = contracts[id as keyof typeof contracts];
  const [, rs, form] = (id === "unsold_completed_housing" ? "MOLIT/32/2082" : contract.code).split("/");
  const sourceUrl = `https://stat.molit.go.kr/portal/cate/statMetaView.do?hRsId=${rs}&hFormId=${form}&hSelectId=${form}&hPoint=00&sFormId=${form}`;
  if (record.code !== contract.code || record.cadence !== contract.cadence || record.category !== "real-estate-housing" ||
      record.unit !== "dwelling" || record.quality_status !== "VERIFIED" || record.series.length !== contract.count ||
      record.series[0][0] !== contract.first || record.series.at(-1)![0] !== contract.last ||
      record.source_org !== "Ministry of Land, Infrastructure and Transport (MOLIT)" ||
      record.license !== "MOLIT statistical information reuse policy (commercial reuse with attribution)" ||
      record.license_url !== "https://stat.molit.go.kr/portal/info/protect.do" ||
      record.source_url !== sourceUrl ||
      record.cell_evidence.length !== contract.count || !record.raw_files.every(file => /^[a-f0-9]{64}$/.test(file.raw_sha256))) throw new Error("Unreviewed MOLIT adapter contract");
  return record.series.map(([period, value], index) => {
    const evidence = record.cell_evidence.find(cell => Number(cell.value) === value && (
      "header" in cell ? contract.cadence === "annual"
        ? String(period).endsWith(String(cell.header).replace(/[’'년]/g, ""))
        : `20${String(cell.header).split(".")[0]}-${String(cell.header).split(".")[1].padStart(2, "0")}` === period
      : cell.raw_file.endsWith(`${period}.xlsx`)));
    const expectedPeriod = contract.cadence === "annual" ? String(2014 + index)
      : `${id === "unsold_housing" ? 2024 + Math.floor(index / 12) : 2026}-${String(id === "unsold_housing" ? index % 12 + 1 : index + 7).padStart(2, "0")}`;
    if (typeof period !== "string" || typeof value !== "number" || !Number.isSafeInteger(value) || value < 0 ||
        period !== expectedPeriod || !evidence || !record.raw_files.some(file => file.raw_file === evidence.raw_file)) throw new Error("MOLIT original-cell adapter mismatch");
    return { country_id: "kr", region_id: "kr", indicator_id: id, category_id: "real-estate-housing",
      reference_period: period, value, unit: record.unit, quality_status: "VERIFIED", source_id: record.code,
      source_org: record.source_org, dataset_name: record.dataset_name, source_url: record.source_url,
      license: record.license, license_url: record.license_url, publication_date: null,
      ingested_at: record.ingested_at, version: record.version, derivation: null };
  });
}

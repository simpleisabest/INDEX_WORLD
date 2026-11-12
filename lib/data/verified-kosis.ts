import snapshot from "../../data/verified-kosis.json" with { type: "json" };
import type { CatalogObservation } from "./catalog.ts";

export const verifiedKosisRecords = snapshot.records;
const items = { business_birth_rate: { code: "T04", label: "신생률" }, business_death_rate: { code: "T05", label: "소멸률" } } as const;

export function reviewedKosisSeries(id: string): CatalogObservation[] {
  const record = verifiedKosisRecords.find(item => item.id === id);
  if (!record || !(id in items)) return [];
  const item = items[id as keyof typeof items];
  if (record.code !== `DT_1BD1101/${item.code}/A=0` || record.item_label !== item.label ||
      record.category !== "business-startup" || record.unit !== "percent" || record.cadence !== "annual" ||
      record.quality_status !== "VERIFIED" || record.series.length !== 9 || record.csv_national_row[0] !== "전체" ||
      record.license !== "KOSIS domestic statistics reuse guidance (attribution required)" ||
      record.license_url !== "https://stat.kosis.kr/nsistN/kosisUseGuide.do" ||
      record.source_url !== "https://kosis.kr/statHtml/statHtml.do?orgId=101&tblId=DT_1BD1101&conn_path=I2") throw new Error("Unreviewed KOSIS adapter contract");
  return record.series.map(([period, value], index) => {
    const column = record.column_indices[index];
    if (typeof period !== "string" || typeof value !== "number" || !Number.isFinite(value) || value < 0 || value > 100 ||
        period !== String(2016 + index) || record.csv_header[0][column] !== period || record.csv_header[1][column] !== item.label ||
        Number(record.csv_national_row[column]) !== value || record.excluded_provisional_periods.includes(period)) throw new Error("KOSIS final-rate adapter mismatch");
    return { country_id: "kr", region_id: "kr", indicator_id: id, category_id: "business-startup",
      reference_period: period, value, unit: "percent", quality_status: "VERIFIED", source_id: record.code,
      source_org: record.source_org, dataset_name: record.dataset_name, source_url: record.source_url,
      license: record.license, license_url: record.license_url, publication_date: null,
      ingested_at: record.ingested_at, version: record.version, derivation: null };
  });
}

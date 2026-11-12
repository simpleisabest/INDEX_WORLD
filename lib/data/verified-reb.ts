import snapshot from "../../data/verified-reb.json" with { type: "json" };
import type { CatalogObservation } from "./catalog.ts";

export const verifiedRebRecords = snapshot.records;
const reviewed = { apartment_price_index: "A_2024_00045", apartment_jeonse_price_index: "A_2024_00050" } as const;

export function reviewedRebSeries(id: string): CatalogObservation[] {
  const record = verifiedRebRecords.find(item => item.id === id);
  if (!record || !(id in reviewed)) return [];
  const code = reviewed[id as keyof typeof reviewed];
  if (record.code !== code || record.category !== "real-estate-housing" || record.unit !== "index (2026.06=100)" ||
      record.cadence !== "monthly" || record.quality_status !== "VERIFIED" || record.license !== "이용허락범위 제한 없음" ||
      record.license_evidence.license.name !== record.license || record.source_org !== "Korea Real Estate Board" ||
      record.source_url !== `https://www.reb.or.kr/r-one/portal/stat/easyStatPage/${code}.do` ||
      record.series.length !== 10 || !record.csv_national_row.slice(1, 5).every(value => value === "전국")) throw new Error("Unreviewed REB adapter contract");
  return record.series.map(([period, value], index) => {
    const header = record.csv_header[index + 5].match(/^(\d{4})년 (\d{1,2})월$/);
    const expectedPeriod = header ? `${header[1]}-${header[2].padStart(2, "0")}` : "";
    if (typeof period !== "string" || typeof value !== "number" || !Number.isFinite(value) || value < 0 ||
        period !== expectedPeriod || Number(record.csv_national_row[index + 5]) !== value ||
        (index && String(record.series[index - 1][0]) >= period)) throw new Error("REB CSV adapter mismatch");
    return { country_id: "kr", region_id: "kr", indicator_id: id, category_id: "real-estate-housing",
      reference_period: period, value, unit: record.unit, quality_status: "VERIFIED", source_id: code,
      source_org: record.source_org, dataset_name: record.dataset_name, source_url: record.source_url,
      license: record.license, license_url: record.license_url, publication_date: null,
      ingested_at: record.ingested_at, version: record.version, derivation: null };
  });
}

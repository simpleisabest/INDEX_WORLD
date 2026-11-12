import snapshot from "../../data/verified-wdi.json" with { type: "json" };
import type { CatalogObservation } from "./catalog.ts";

export const verifiedWdiRecords = snapshot.records;

// This is an explicit adapter allowlist, not approval based on a provider name.
const reviewed = {
  gdp_per_capita_usd: { code: "NY.GDP.PCAP.CD", category: "economy-income", unit: "current USD/person" },
  consumer_price_inflation_wdi: { code: "FP.CPI.TOTL.ZG", category: "economy-income", unit: "percent" },
  unemployment_ilo_modelled: { code: "SL.UEM.TOTL.ZS", category: "jobs-employment", unit: "percent" },
} as const;

export function reviewedWdiSeries(indicatorId: string): CatalogObservation[] {
  const record = verifiedWdiRecords.find(item => item.id === indicatorId);
  if (!record || !(indicatorId in reviewed)) return [];
  const contract = reviewed[indicatorId as keyof typeof reviewed];
  if (record.code !== contract.code || record.category !== contract.category || record.unit !== contract.unit ||
      record.license !== "CC BY 4.0" || record.license_url !== "https://creativecommons.org/licenses/by/4.0/" ||
      record.quality_status !== "VERIFIED" || record.cadence !== "annual" ||
      record.country_id !== "kr" || record.region_id !== "kr" || record.metadata.id !== contract.code ||
      record.metadata.source.id !== "2" || !record.license_checked_at || !record.original_source ||
      record.source_url !== `https://data.worldbank.org/indicator/${contract.code}?locations=KR` ||
      record.series.length < 3) throw new Error("Unreviewed WDI adapter contract");
  const raw = JSON.parse(record.raw_response);
  const official = new Map<string, number>();
  for (const row of raw[1]) {
    if (row.value === null) continue;
    if (row.indicator.id !== contract.code || row.countryiso3code !== "KOR" || row.obs_status !== "" ||
        !/^\d{4}$/.test(row.date) || !Number.isFinite(row.value) || official.has(row.date)) throw new Error("Invalid official WDI observation");
    official.set(row.date, row.value);
  }
  if (raw[0].pages !== 1 || raw[1].length !== Number(raw[0].total) || official.size !== record.series.length) throw new Error("Incomplete WDI snapshot");
  return record.series.map(([period, value], index) => {
    if (typeof period !== "string" || typeof value !== "number" || official.get(period) !== value ||
        (index > 0 && Number(record.series[index - 1][0]) >= Number(period))) throw new Error("WDI snapshot mismatch");
    return {
      country_id: "kr", region_id: "kr", indicator_id: indicatorId, category_id: contract.category,
      reference_period: period, value, unit: contract.unit, quality_status: "VERIFIED",
      source_id: record.code, source_org: record.source_org, dataset_name: record.dataset_name,
      source_url: record.source_url, license: record.license, license_url: record.license_url,
      publication_date: record.publication_date, ingested_at: record.ingested_at, version: record.version, derivation: null,
    };
  });
}

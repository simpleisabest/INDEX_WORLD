import dataset from "@/data/population/korea-total.json";

export const qualityStatuses = ["VERIFIED", "PROVISIONAL", "STALE", "REVIEW_REQUIRED", "SOURCE_ERROR"] as const;
export type QualityStatus = (typeof qualityStatuses)[number];

export type PopulationObservation = {
  country_id: string;
  region_id: string;
  indicator_id: "population_total";
  reference_period: string;
  value: number;
  unit: "person";
  source_org: string;
  dataset_name: string;
  source_id: string;
  source_url: string;
  publication_date: string | null;
  ingested_at: string;
  version: string;
  quality_status: QualityStatus;
};

export const populationSource = dataset.source;
export const populationObservations: PopulationObservation[] = dataset.series.map(([year, value]) => ({
  country_id: dataset.country_id,
  region_id: dataset.region_id,
  indicator_id: dataset.indicator_id as "population_total",
  reference_period: String(year),
  value,
  unit: dataset.unit as "person",
  source_org: dataset.source.source_org,
  dataset_name: dataset.source.dataset_name,
  source_id: dataset.source.source_id,
  source_url: dataset.source.source_url,
  publication_date: dataset.publication_date,
  ingested_at: dataset.ingested_at,
  version: dataset.version,
  quality_status: dataset.quality_status as QualityStatus,
}));

export const latestPopulationObservation = populationObservations.at(-1)!;

export const populationCitation = {
  indicator_id: dataset.indicator_id,
  region_id: dataset.region_id,
  reference_period: latestPopulationObservation.reference_period,
  original_organization: dataset.source.source_org,
  dataset: dataset.source.dataset_name,
  index_world_page_url: "https://indexworld.app/",
};

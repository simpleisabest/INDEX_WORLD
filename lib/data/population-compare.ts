import { populationObservations, populationSource } from "@/lib/data/population";
import type { CompareModel } from "@/lib/data/compare";

export const populationCompareModel: CompareModel = {
  contentId: "population-compare",
  dimension: "period",
  baselineId: populationObservations.at(-2)!.reference_period,
  targetId: populationObservations.at(-1)!.reference_period,
  options: populationObservations.map((point) => ({
    id: point.reference_period,
    label: point.reference_period,
    observation: { ...point, license: populationSource.license, license_url: populationSource.license_url },
  })),
};

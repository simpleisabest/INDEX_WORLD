import type { CompareObservation } from "./compare.ts";
export type RankingModel = { contentId:string; indicatorId:string; referencePeriod:string; direction:"asc"|"desc"; observations:CompareObservation[] };
export function validateRanking(model: RankingModel) {
  if (model.observations.length < 2) throw new Error("Ranking requires at least two verified regions");
  const ids=new Set<string>();
  for(const point of model.observations){
    if(point.quality_status!=="VERIFIED"||!Number.isFinite(point.value))throw new Error("Ranking requires verified numeric observations");
    if(point.indicator_id!==model.indicatorId||point.reference_period!==model.referencePeriod)throw new Error("Ranking requires one indicator and period");
    if(!point.region_id||ids.has(point.region_id))throw new Error("Ranking requires unique stable region IDs"); ids.add(point.region_id);
  }
  const [first]=model.observations;
  if(model.observations.some(point=>point.country_id!==first.country_id||point.unit!==first.unit||point.version!==first.version))throw new Error("Ranking observations are not comparable");
  return true;
}
export function rankObservations(model: RankingModel){validateRanking(model);const sign=model.direction==="desc"?-1:1;return [...model.observations].sort((a,b)=>(a.value-b.value)*sign||a.region_id.localeCompare(b.region_id));}

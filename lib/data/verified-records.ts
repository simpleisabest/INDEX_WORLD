import { verifiedWdiRecords, reviewedWdiSeries } from "./verified-wdi.ts";
import { verifiedRebRecords, reviewedRebSeries } from "./verified-reb.ts";
import { verifiedKosisRecords, reviewedKosisSeries } from "./verified-kosis.ts";

export const verifiedDataRecords = [...verifiedRebRecords, ...verifiedWdiRecords, ...verifiedKosisRecords];
export function reviewedSprintSeries(id: string) {
  const reb = reviewedRebSeries(id); if (reb.length) return reb;
  const wdi = reviewedWdiSeries(id); if (wdi.length) return wdi;
  return reviewedKosisSeries(id);
}

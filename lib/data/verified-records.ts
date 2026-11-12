import { verifiedWdiRecords, reviewedWdiSeries } from "./verified-wdi.ts";
import { verifiedRebRecords, reviewedRebSeries } from "./verified-reb.ts";
import { verifiedKosisRecords, reviewedKosisSeries } from "./verified-kosis.ts";
import { verifiedMolitRecords, reviewedMolitSeries } from "./verified-molit.ts";

export const verifiedDataRecords = [...verifiedRebRecords, ...verifiedWdiRecords, ...verifiedKosisRecords, ...verifiedMolitRecords];
export function reviewedSprintSeries(id: string) {
  const reb = reviewedRebSeries(id); if (reb.length) return reb;
  const wdi = reviewedWdiSeries(id); if (wdi.length) return wdi;
  const kosis = reviewedKosisSeries(id); if (kosis.length) return kosis;
  return reviewedMolitSeries(id);
}

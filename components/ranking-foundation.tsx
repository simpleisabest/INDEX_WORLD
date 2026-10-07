"use client";

import { useLocale } from "@/components/locale-provider";

export function RankingFoundation() {
  const { locale, t } = useLocale();
  const gates=locale==="ko"?["검증된 관측값","안정적인 지역 ID","동일 기준시점·단위"]:["Verified observations","Stable region IDs","Same period and unit"];
  return <section className="ranking-section" id="data-ranking" aria-labelledby="ranking-heading"><div className="shell ranking-shell">
    <div className="ranking-copy"><p>RANKINGS · FOUNDATION</p><h2 id="ranking-heading">{locale==="ko"?"데이터 Ranking":"Data rankings"}</h2><span>{t("catalog.rankingReason")}</span><div className="ranking-tabs" aria-label="Ranking modes"><button disabled>TOP ↑</button><button disabled>TOP ↓</button><button disabled>MOST CHANGED</button></div></div>
    <div className="ranking-gate"><span>VERIFICATION GATE</span>{gates.map((gate,index)=><div key={gate}><b>{String(index+1).padStart(2,"0")}</b><strong>{gate}</strong><i>REQUIRED</i></div>)}<p>{t("catalog.rankingBlocked")}</p></div>
  </div></section>;
}

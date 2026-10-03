export type KpiDatum = {
  label: string;
  labelEn: string;
  value: string | null;
  unit: string | null;
  referencePeriod: string | null;
  change: string | null;
  quality: "PENDING" | "VERIFIED" | "PROVISIONAL" | "STALE" | "REVIEW_REQUIRED";
  source: string | null;
};

const populationKpis: KpiDatum[] = [
  { label: "총인구", labelEn: "Total population", value: null, unit: "명", referencePeriod: null, change: null, quality: "PENDING", source: null },
  { label: "인구 변화", labelEn: "Population change", value: null, unit: "%", referencePeriod: null, change: null, quality: "PENDING", source: null },
  { label: "65세 이상", labelEn: "Age 65+", value: null, unit: "%", referencePeriod: null, change: null, quality: "PENDING", source: null },
  { label: "청년인구", labelEn: "Youth population", value: null, unit: "명", referencePeriod: null, change: null, quality: "PENDING", source: null },
];

export function KPIBlock({ items = populationKpis }: { items?: KpiDatum[] }) {
  return (
    <section className="kpi-section" aria-labelledby="kpi-heading">
      <div className="shell">
        <div className="kpi-header">
          <div>
            <p>POPULATION · CORE INDICATORS</p>
            <h2 id="kpi-heading">대한민국 인구 한눈에 보기</h2>
          </div>
          <div className="kpi-status"><i /> OFFICIAL DATA CONNECTION PENDING</div>
        </div>

        <div className="kpi-grid">
          {items.map((item, index) => (
            <article className="kpi-card" key={item.label}>
              <div className="kpi-card-top">
                <span>0{index + 1}</span>
                <span>{item.quality}</span>
              </div>
              <p>{item.labelEn}</p>
              <h3>{item.label}</h3>
              <div className="kpi-value" aria-label={`${item.label} 공식 데이터 연결 준비 중`}>
                <strong>{item.value ?? "—"}</strong>
                {item.value && item.unit && <span>{item.unit}</span>}
              </div>
              <dl>
                <div><dt>기준 시점</dt><dd>{item.referencePeriod ?? "연결 준비 중"}</dd></div>
                <div><dt>공식 출처</dt><dd>{item.source ?? "연결 준비 중"}</dd></div>
              </dl>
            </article>
          ))}
        </div>
        <p className="kpi-disclaimer">표시될 모든 수치는 공식 출처·기준 시점·품질 상태와 함께 제공됩니다. 현재 실제 통계값은 표시하지 않습니다.</p>
      </div>
    </section>
  );
}

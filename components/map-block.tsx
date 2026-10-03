"use client";

import { useLocale } from "@/components/locale-provider";
import { ShareButton } from "@/components/share-button";

export function MapBlock() {
  const { t } = useLocale();


  return (
    <section className="map-section" id="map" aria-labelledby="map-heading">
      <div className="shell map-grid">
        <div className="map-copy">
          <div className="eyebrow light"><span /> {t("map.eyebrow")}</div>
          <h2 id="map-heading">{t("map.line1")}<br />{t("map.line2")}</h2>
          <p>{t("map.description")}</p>
          <div className="pending-badge"><i /> {t("map.status")}</div>
          <div className="map-selection" aria-live="polite">
            <span>{t("map.selected")}</span>
            <div><strong>{t("map.status")}</strong><p>{t("map.ready")}</p></div>
          </div>
          <ShareButton contentId="korea-map" regionId="kr" title={t("map.line1")} description={t("map.description")} tone="dark" />
        </div>

        <div className="map-visual" aria-label="대한민국 지도 탐색 Foundation">
          <div className="map-coordinates">MAP FOUNDATION · BLOCKED<br />NO DATA VALUES</div>
          <svg viewBox="0 0 320 420" role="img" aria-label="대한민국 지도 일러스트레이션 — 공식 행정경계 연결 준비 중">
            <path d="M165 25c19 18 14 43 30 62 16 19 45 29 46 56 1 25-22 36-18 61 5 28 26 38 16 71-8 27-40 33-51 59-8 19 3 44-17 59-18 13-34-9-49-21-16-13-39-17-44-40-6-25 17-40 23-61 7-25-7-46 0-68 8-25 40-33 53-54 14-22 3-54 20-73 12-14 24-3 37-21Z" />
            <path className="island" d="M91 373c13-8 36-5 42 7 6 13-9 25-28 24-19-1-28-20-14-31Z" />
          </svg>

          <div className="map-legend" aria-label="지도 상태 범례">
            <span><i /> {t("map.legend1")}</span>
            <span><i /> {t("map.legend2")}</span>
          </div>
          <div className="map-watermark">KOREA</div>
        </div>
      </div>
    </section>
  );
}

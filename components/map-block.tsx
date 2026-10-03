"use client";

import { useState } from "react";

type RegionFoundation = {
  id: `kr-${string}`;
  name: string;
  nameEn: string;
  type: "SPECIAL_CITY" | "METROPOLITAN_CITY" | "SPECIAL_SELF_GOVERNING_PROVINCE";
  position: { x: number; y: number };
};

const regionFoundation: RegionFoundation[] = [
  { id: "kr-seoul", name: "서울", nameEn: "SEOUL", type: "SPECIAL_CITY", position: { x: 42, y: 34 } },
  { id: "kr-daejeon", name: "대전", nameEn: "DAEJEON", type: "METROPOLITAN_CITY", position: { x: 49, y: 51 } },
  { id: "kr-daegu", name: "대구", nameEn: "DAEGU", type: "METROPOLITAN_CITY", position: { x: 62, y: 59 } },
  { id: "kr-gwangju", name: "광주", nameEn: "GWANGJU", type: "METROPOLITAN_CITY", position: { x: 43, y: 67 } },
  { id: "kr-busan", name: "부산", nameEn: "BUSAN", type: "METROPOLITAN_CITY", position: { x: 69, y: 69 } },
  { id: "kr-jeju", name: "제주", nameEn: "JEJU", type: "SPECIAL_SELF_GOVERNING_PROVINCE", position: { x: 42, y: 88 } },
];

export function MapBlock() {
  const [selectedRegionId, setSelectedRegionId] = useState<RegionFoundation["id"] | null>(null);
  const selectedRegion = regionFoundation.find((region) => region.id === selectedRegionId);

  return (
    <section className="map-section" id="map" aria-labelledby="map-heading">
      <div className="shell map-grid">
        <div className="map-copy">
          <div className="eyebrow light"><span /> INDEX KOREA</div>
          <h2 id="map-heading">지도로 발견하는<br />대한민국의 오늘</h2>
          <p>지역 마커를 선택해 탐색 구조를 미리 확인하세요. 공식 행정경계와 통계는 검증된 데이터 연결 후 표시됩니다.</p>
          <div className="pending-badge"><i /> OFFICIAL BOUNDARY DATA PENDING</div>
          <div className="map-selection" aria-live="polite">
            <span>SELECTED REGION</span>
            {selectedRegion ? (
              <div><strong>{selectedRegion.name}</strong><p>{selectedRegion.nameEn} · {selectedRegion.id}</p></div>
            ) : (
              <div><strong>지역을 선택하세요</strong><p>REGION CONTRACT READY</p></div>
            )}
          </div>
        </div>

        <div className="map-visual" aria-label="대한민국 지도 탐색 Foundation">
          <div className="map-coordinates">MAP FOUNDATION · V0.4<br />NO DATA VALUES</div>
          <svg viewBox="0 0 320 420" role="img" aria-label="대한민국 지도 일러스트레이션 — 공식 행정경계 연결 준비 중">
            <path d="M165 25c19 18 14 43 30 62 16 19 45 29 46 56 1 25-22 36-18 61 5 28 26 38 16 71-8 27-40 33-51 59-8 19 3 44-17 59-18 13-34-9-49-21-16-13-39-17-44-40-6-25 17-40 23-61 7-25-7-46 0-68 8-25 40-33 53-54 14-22 3-54 20-73 12-14 24-3 37-21Z" />
            <path className="island" d="M91 373c13-8 36-5 42 7 6 13-9 25-28 24-19-1-28-20-14-31Z" />
          </svg>

          {regionFoundation.map((region) => (
            <button
              type="button"
              className="region-marker"
              style={{ left: `${region.position.x}%`, top: `${region.position.y}%` }}
              key={region.id}
              aria-label={`${region.name} 선택`}
              aria-pressed={selectedRegionId === region.id}
              onClick={() => setSelectedRegionId(region.id)}
            >
              <span>{region.nameEn}</span><i />
            </button>
          ))}

          <div className="map-legend" aria-label="지도 상태 범례">
            <span><i /> 선택 가능 지역</span>
            <span><i /> 공식 데이터 연결 대기</span>
          </div>
          <div className="map-watermark">KOREA</div>
        </div>
      </div>
    </section>
  );
}

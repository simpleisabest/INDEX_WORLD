import type { TranslationKey } from "./en";
const ko: Partial<Record<TranslationKey,string>> = {
  "hero.line1":"세상을","hero.line2":"숫자로 보다.","hero.description":"세계 각국의 데이터를 검색하고, 비교하고, 발견하세요. 복잡한 세상을 이해하기 쉬운 인덱스로 만듭니다.","search.heading":"무엇을 알고 싶나요?","search.free":"100% 무료 · 회원가입 없음 · 바로 사용","search.support":"찾고, 비교하고, 시각화하고, 공유하세요.","search.placeholder":"서울 인구, 인천 1인가구, 서울 vs 부산...","search.recommended":"추천 검색","search.pendingText":"“{query}” 검색 데이터 연결 준비 중입니다.","search.contractText":"지역 · 지표 · 랭킹 · 비교 · 질문 검색을 준비하고 있습니다.","search.s1":"서울 인구","search.s2":"인천 1인가구","search.s3":"부산 주택","search.s4":"서울 vs 부산",
  "category.heading":"데이터로 세상을 탐색하세요","category.population":"인구","category.populationNote":"사람과 지역의 변화를 봅니다.","category.household":"가구","category.householdNote":"삶의 단위와 흐름을 읽습니다.","category.housing":"주택","category.housingNote":"공간과 거주의 모습을 찾습니다.","kpi.heading":"대한민국 인구 한눈에 보기","kpi.status":"총인구 · 공식 데이터 연결 완료","kpi.total":"총인구","kpi.change":"인구 변화","kpi.age65":"65세 이상","kpi.youth":"청년인구","kpi.period":"기준 시점","kpi.source":"공식 출처","kpi.preparing":"연결 준비 중","kpi.disclaimer":"총인구는 검증된 공식 데이터에 연결되었습니다. 연간 증감과 증감률은 검증된 총인구로 계산합니다. 65세 이상은 대기 상태이며 지역 통계는 공개하지 않습니다.",
  "map.line1":"지도로 발견하는","map.line2":"대한민국의 오늘","map.description":"공식 근거 검증 전까지 지역 탐색은 비활성 상태입니다. 공식 행정경계와 통계는 검증된 데이터 연결 후 표시됩니다.","map.status":"지역 데이터 · 검증 대기", "map.ready":"공식 근거 검증 전까지 비활성", "map.selected":"지역 탐색","map.prompt":"지역을 선택하세요","map.legend1":"지역 탐색 비활성","map.legend2":"공식 데이터 연결 대기","map.seoul":"서울","map.daejeon":"대전","map.daegu":"대구","map.gwangju":"광주","map.busan":"부산","map.jeju":"제주",
  "popular.heading":"사람들이 찾는 데이터","popular.side":"데이터 연결 후 실시간 콘텐츠가 표시됩니다.","popular.p1":"인구가 증가한 지역","popular.p2":"1인가구 비율이 높은 지역","popular.p3":"최근 인구 변화","popular.p4":"서울 vs 부산","share.line1":"발견한 데이터를","share.line2":"더 멀리.","share.description":"모든 데이터는 쉽게 공유하고, 비교하고, 새로운 관점으로 재구성할 수 있도록 설계됩니다.","share.action":"공유","share.copied":"링크 복사 완료","share.failed":"복사 실패","ad.label":"향후 광고 위치 · Preview 전용","ad.aria":"향후 광고 배치 영역","footer.advertising":"광고 문의",
  "timeseries.kicker":"공식 인구 · 연간","timeseries.heading":"대한민국 인구 장기 변화","timeseries.description":"세계개발지표가 제공하는 대한민국 연간 총인구 시계열입니다.","timeseries.region":"지역","timeseries.korea":"대한민국","timeseries.range":"기간","timeseries.all":"전체","timeseries.years":"년","timeseries.sourceDetails":"출처 및 데이터 계보","timeseries.organization":"기관","timeseries.dataset":"데이터셋","timeseries.indicator":"지표","timeseries.reference":"기준 시점","timeseries.updated":"INDEX 업데이트","timeseries.license":"라이선스","timeseries.original":"원본 보기","data.people":"명",
  "timeseries.start":"시작 연도",
  "timeseries.end":"종료 연도",
  "timeseries.selectYear":"연도 탐색",
  "timeseries.download":"CSV 다운로드",
  "timeseries.table":"연간 값 보기",
  "timeseries.unavailable":"제공되지 않음",
  "timeseries.publication":"원본 발표일",
  "timeseries.citation":"인용문",
  "timeseries.copyCitation":"인용문 복사",
  "timeseries.methodology":"WDI 국가 총인구이며 주민등록인구와 다릅니다. 연간 증감 = 올해 − 전년, 증감률 = 증감 / 전년 × 100. INDEX 업데이트는 수집일이며 원본 발표일이 아닙니다.",
  "kpi.changeRate":"연간 증감률",
}; export default ko;

# INDEX WORLD™ MASTER PRD v1.0

**Status:** APPROVED FOR DEVELOPMENT\
**Initial Service:** INDEX KOREA\
**Primary Host:** `indexworld.app`\
**Expansion:** INDEX KOREA → INDEX JAPAN → INDEX AMERICA → GLOBAL

## 1. Mission

**Brand Statement:**
`세상을 숫자로 보다. / Explore the World Through Data.`

공식 국가·지역 데이터를 누구나 회원가입 없이 **검색 → 발견 → 비교 →
시각화 → 재가공 → 공유 → 인용**할 수 있는 글로벌 데이터 네트워크를
만든다.

INDEX 영역은 광고 수익화를 허용하되 BIZAITO 본체는 광고 없이 분리한다.
AI는 숫자를 창작하지 않으며 모든 통계는 출처·기준일·업데이트일을
추적한다. 페이지와 콘텐츠 추가 한계비용은 자동화를 통해 0에 수렴하도록
설계한다.

## 2. Brand & Global Expansion

상위 브랜드는 **INDEX WORLD™**이며 공식 도메인은
**`indexworld.app`**이다.

국가별 서비스는 `INDEX KOREA / INDEX JAPAN / INDEX AMERICA / ...` 구조로
확장한다.

INDEX WORLD는 BIZAITO 코드베이스와 배포환경에 종속되지 않는 **독립
프로젝트 · 독립 Repository · 독립 배포 구조**로 운영한다.

예: - `/ko/korea/` - `/en/korea/` - `/ko/korea/region/incheon/` -
`/ko/korea/ranking/population-growth/` -
`/ko/korea/compare/namdong-gu-vs-bupyeong-gu/`

Canonical URL은 추적 파라미터 없는 원본 주소를 사용한다.

## 3. 13 Languages

English, Korean, Japanese, Spanish, Portuguese, German, French,
Simplified Chinese, Traditional Chinese, Hindi, Indonesian, Italian,
Vietnamese.

처음부터 locale route, hreflang, 언어별 SEO metadata, 숫자·날짜·단위
현지화를 지원한다. 저품질 자동번역 페이지를 무차별 색인하지 않는다.

## 4. INDEX KOREA V1

V1 데이터는 **인구·가구·주택**으로 시작한다.

-   PEOPLE: 총인구, 연령, 성별(가능 시), 청년, 65세+, 증감, 출생·사망,
    전입·전출, 외국인
-   HOUSEHOLD: 가구수, 1인가구, 가구원수, 가구구성
-   HOUSING: 주택수, 주택유형, 아파트/주택 구성 및 공식 지역지표

향후 사업체, 고용, 소득, 교육, 의료, 교통, 관광, 면적, 기후, 물가,
지역경제, K-Culture 데이터를 추가한다.

지역 계층은
`대한민국 → 시·도 → 시·군·구 → 읍·면·동(데이터 지원 시)`이다. 모든
지역에 stable `region_id`를 부여하고 행정구역 통합·분리·명칭변경 이력을
보존한다. 없는 세부 데이터는 추정하지 않는다.

## 5. Core UX

각 지역 페이지는 다음을 기본 제공한다.

1.  질문에 대한 직접 답
2.  핵심 KPI
3.  인터랙티브 지도
4.  장기 시계열 그래프
5.  지역·전국 순위
6.  전국/상위지역 평균 비교
7.  관련 지표와 질문
8.  공식 출처와 갱신일
9.  공유·다운로드·리믹스

추가 기능: - 전국/지역 랭킹 TOP 10/50/100 - 지역 VS 지역 비교 - 조건으로
지역 찾기 - 연도/월 Time Slider - 지도 선택과 그래프·비교표 연동

## 6. Data Pipeline

`OFFICIAL SOURCE → INGEST → NORMALIZE → VALIDATE → VERSION → STORE → CALCULATE → DISCOVER → PUBLISH/UPDATE → DISTRIBUTE → MEASURE → LEARN`

한국 초기 공식 데이터 후보는 KOSIS, 공공데이터포털, 행정안전부,
한국은행, 국토교통부 등이다. 각 Connector는 출처와 라이선스를 함께
저장한다.

모든 숫자에 기관, 데이터셋, 원본 ID/URL, 기준기간, 발표일, 수집시각,
단위, 지역레벨, 라이선스, 계산법, 데이터 버전을 기록한다.

## 7. Data Quality & History

자동 검사: 누락, 중복, 단위 오류, 비정상 급변, 지역코드 오류, stale
data, 잠정/확정치, 수정통계, source error.

상태: `VERIFIED / PROVISIONAL / STALE / REVIEW_REQUIRED / SOURCE_ERROR`

의심 데이터는 자동 발행하지 않는다. 과거값을 지우지 않고 수정 전후 값과
버전을 보존한다.

## 8. INDEX SIGNAL™

공식 지표를 교차해 `인구↓ + 사업체↑`, `고령인구↑ + 의료기관↓` 같은
흥미로운 변화를 발견한다.

이는 **관찰**이며 AI가 인과관계를 창작하지 않는다. 모든 Signal에는 근거
데이터를 표시한다.

## 9. Content Discovery

AI는 신규/변경 데이터를 분석해 검색가치, SNS 확산성, evergreen 가치,
중복도를 평가하고 콘텐츠 후보를 만든다. AI는 글 공장이 아니라 **데이터
편집장** 역할을 한다.

Search Demand Radar는 내부 검색, Zero-result, Search Console, 유입
키워드를 분석해 없는 데이터·페이지·랭킹·비교 후보를 만든다.

## 10. SHARE & REFERRAL CORE™

**모든 공개 페이지와 결과물에 공유 기능을 무조건 넣는다.**

대상: 지역, 랭킹, 그래프, 지도, 표, 비교, 카드뉴스, 인포그래픽, Remix.

기본 추적:
`content_id / share_id / user_id(nullable) / referral_token(nullable) / source / medium / campaign / channel / click / conversion / reshare`

공유 URL은 ref/UTM을 지원하되 canonical은 원본 URL을 유지한다. 향후
1단계 직접추천 Attribution을 지원할 수 있게 하며 다단계·피라미드 보상은
금지한다.

## 11. INDEX CREATOR™ / REMIX

사용자가 지역·지표·기간·비교지역·차트·제목을 선택해 콘텐츠를 만든다.

출력: - 값/표 복사 - CSV / Excel - PDF / Print - PNG / SVG(적합 시) -
PPT/Blog 이미지 - Instagram 1:1, 4:5 - Story/Reels/Shorts 9:16 - YouTube
16:9 - QR - Citation - Share URL

생성물에는 라이선스 범위에서 `Data: INDEX KOREA`, `indexworld.app`, 원본
페이지 QR을 자연스럽게 표시한다.

## 12. LIVE EMBED & CITATION

그래프·지도·랭킹은 다른 웹사이트에 Live Embed할 수 있게 한다. 원데이터
갱신 시 Embed도 갱신하며 원본 INDEX 링크를 제공한다. Snapshot Embed도
지원한다.

원클릭 Citation은 지표명, 기준시점, 원기관, INDEX 원본 URL을 복사한다.
목표는 **사용 편의 → 자연 인용 → 자연 백링크**다.

## 13. SEO / AEO / GEO

필수: SSR/SSG, Core Web Vitals, semantic HTML, clean URL, canonical, XML
sitemap, sitemap partition, hreflang, breadcrumb, structured data,
Dataset metadata, internal links, robots/noindex.

페이지 구조:
`직접 답 → 핵심 숫자 → 지도/그래프 → 비교 → 맥락 → 방법론 → 공식출처 → 관련질문 → 관련페이지`

생성 가능한 모든 조합을 색인하지 않는다. 데이터
충분성·독립가치·검색효용·출처·상호작용 가치가 있는 페이지만 index한다.

## 14. Distribution Loop

`DATA → INDEX → REMIX → Instagram/Blog/YouTube/SNS/Embed → SOURCE+QR+LINK → INDEX TRAFFIC → NEW USER → NEW REMIX`

대표/공식 Instagram용 카드·캐러셀·Reel 자산 생성도 이 파이프라인에
연결한다.

## 15. Advertising

광고는 **INDEX WORLD 공개 서비스**에만 적용한다. INDEX WORLD의 광고
정책은 다른 BIZAITO 서비스와 독립적으로 운영한다.

전역 무차별 광고 삽입을 금지한다. INDEX 전용 Ad Component가 route,
placement, density, mobile, performance를 제어한다.

광고는 데이터 탐색·지도·그래프·비교·다운로드·공유 경험을 훼손하지 않아야
한다.

## 16. INDEX TRUST

공개 Trust 페이지에 데이터 수집원칙, 출처, 계산법, 라이선스, 업데이트
주기, 수정이력, 오류신고, 품질정책을 공개한다. 모든 데이터 페이지에 오류
신고 기능을 둔다.

## 17. Cost Guard

무료 공공데이터 우선, cache 우선, static generation 우선, AI 호출
최소화, 중복계산 방지, API rate-limit 보호, CDN 활용.

목표:
`TRAFFIC ↑ / DATA ASSET ↑ / BACKLINK ↑ / REVENUE ↑ / MARGINAL COST → 0`

## 18. BIZAITO ASSET REUSE GATE

INDEX WORLD는 독립 프로젝트다. 다만 기존 BIZAITO에서 이미 검증·설계된
Engine, Agent, Skill, Tool, 개발 패턴을 필요할 때 선별 재사용한다.

모든 신규 기능 개발 전 다음 기준으로 대조한다.

`REUSE → ADAPT → REFERENCE → REJECT`

우선 검토 대상: - COMPANY BRAIN™ - AI COMMAND CENTER™ - ACTION AGENT™ -
MARKET INTELLIGENCE ENGINE™ - PRODUCT INTELLIGENCE ENGINE™ - KNOWLEDGE
ACQUISITION ENGINE™ - OPEN SOURCE RADAR™ - LIVE AI TESTER™ - BLOG
AGENT™ - ONE ID™ - CRM / Lead / Attribution / Referral - TRUST LEDGER™

기존 BIZAITO 코드를 통째로 복사하거나 INDEX WORLD를 BIZAITO 저장소에
종속시키지 않는다. 기존 자산으로 해결 가능한 기능은 중복
Engine/Agent/Skill/Tool을 새로 만들지 않는다.

## 19. AI COMMAND CENTER™

INDEX WORLD 내부에 BIZAITO COMMAND CENTER를 복제하지 않는다.

BIZAITO의 기존 전사 운영체계가 INDEX WORLD를 관리할 필요가 생길 경우
다음 구조를 **외부 운영 레이어**로 선택적으로 연결한다.

`COMPANY BRAIN™ → AI COMMAND CENTER™ → ACTION AGENT™ → RESULT/TRUST LEDGER™ → LEARNING`

CEO/CMO/CFO/CTO/COO/CRO 전략회의실, 반대참모장, 수익화 책임장 등 기존
BIZAITO 운영 설계는 참조·연동 자산으로 유지한다.

INDEX WORLD 자체 코드베이스, Repository, Cloud Environment, Preview,
Production, Domain은 독립적으로 유지한다.

중요 실행 원칙: `Preview → Approval → Execute → TRUST LEDGER`

## 20. Autopilot

목표는 대표의 일상 운영 개입 최소화다.

`공식데이터 수집 → 변경감지 → 검증 → DB → 계산 → 지도/그래프/페이지 갱신 → SEO metadata → sitemap → Signal → 콘텐츠 후보 → 품질검사 → 배포 후보 → 성과측정 → 오류감지 → 보고`

대표 개입은 정책, 비용, 시스템이 해결하지 못한 예외 중심으로 제한한다.

## 21. Analytics

측정: Search impressions/clicks, pageviews, internal query, zero-result,
CTR, engagement, return, share, remix, embed, backlinks/referrals,
언어/국가 성과, 광고성과, 데이터 freshness, source failure, 페이지당
비용.

성과 패턴은 COMPANY BRAIN™에 학습자산으로 축적한다.

## 22. OPEN SOURCE RADAR™ / LIVE AI TESTER™

지도·차트·데이터·SEO·성능·다국어 관련 오픈소스를
`ADD / PLUG-IN / UPGRADE / REPLACE / REJECT`로 평가한다.

LIVE AI TESTER는 PC/mobile에서 검색, 지도, 차트, 비교, 공유, referral,
다국어, download, embed, 광고영역, canonical/hreflang, broken link,
responsive overflow를 검사한다.

## 23. V1 Non-Goals

V1에서 하지 않는다: - 전 세계 국가 동시 완성 - 모든 한국 통계 동시
수집 - 회원가입 강제 - 유료구독 - AI의 인과관계 추정 - 저가치 대량
페이지 무차별 색인 - 기존 BIZAITO 본체 삭제 - 다단계 추천보상

## 24. Development Method & Sequence

INDEX WORLD 개발은 **Cloud-First + Frontend-First + Preview-First +
Visible Development**를 기본 원칙으로 한다.

대표가 장기간 결과물을 볼 수 없는 Backend-First / Architecture-First
개발을 피한다.

기본 개발 사이클:

`VISIBLE UI → BLOCK CONTRACT → IMPLEMENT → TEST → PREVIEW → 대표 확인 → NEXT BLOCK`

화면은 독립 Block/Module 단위로 성장시킨다.

-   HeaderBlock
-   HeroBlock
-   SearchBlock
-   DataCategoryBlock
-   MapBlock
-   KPIBlock
-   TimeSeriesBlock
-   RankingBlock
-   CompareBlock
-   ShareBlock
-   CitationBlock
-   RemixBlock
-   SourceBlock

### 현재 구현 기준

**V0.1 Frontend Shell 완료**

-   HeaderBlock
-   HeroBlock
-   SearchBlock
-   DataCategoryBlock
-   MapBlock
-   PopularDataBlock
-   ShareBlock

### 화면 중심 개발 순서

-   V0.1 Frontend Shell
-   V0.2 Search Interaction
-   V0.3 Population KPI
-   V0.4 Korea Map
-   V0.5 Population Time Series
-   V0.6 Ranking
-   V0.7 Compare
-   V0.8 Share / Referral
-   V0.9 Citation / Download / Remix
-   V1.0 Population Vertical Slice

각 단계는
`BUILD → TEST → GITHUB PUSH → PREVIEW UPDATE → 대표 화면 확인 → NEXT`
순서를 유지한다.

### 데이터·플랫폼 확장 순서

-   Foundation:
    locale/country/region/indicator/observation/provenance/quality/connector
    계약
-   First Vertical Slice: Population 하나를
    `source → ingest → validate → store → region page → map → time series → ranking → compare → share → citation → SEO → mobile test`까지
    연결
-   Household / Housing
-   Creator / Social formats / Live Embed / Referral
-   Signal / Daily Discovery / Search Demand Radar / Zero-result /
    Product Intelligence
-   품질·정책 조건 충족 후 광고
-   INDEX JAPAN → INDEX AMERICA → 전 세계 국가 확대

Fixture/Sample 데이터는 실제 공식 데이터처럼 오인되지 않도록
SAMPLE/DEMO/PENDING 상태를 명확하게 표시한다.

## 25. Definition of Done

V1 완료 조건: - INDEX KOREA 공개 - 회원가입 없이 핵심 사용 - 공식
인구·가구·주택 - 전국 지역 탐색 - 지도·시계열 그래프·비교·랭킹 -
출처·기준일·업데이트일 - CSV/Excel/PDF/이미지/Print - SHARE +
Referral-ready - Social Remix - Citation / Live Embed - 13-language
architecture - SEO/AEO/GEO 기반 - canonical/hreflang/sitemap - INDEX
광고와 BIZAITO 본체 분리 - 데이터 자동 갱신 - 데이터 오류 검증 - LIVE AI
TESTER 통과 - 필요 시 검증된 BIZAITO 운영 자산과 선택적 연동 - 모바일
가로스크롤/잘림 없음 - 기존 BIZAITO 자산 및 코드베이스와 독립성 유지

## 26. Non-Negotiable Principles

1.  정확성 \> 문장 유창성
2.  공식 출처 없는 숫자 금지
3.  AI 숫자 창작 금지
4.  없는 데이터 추측 금지
5.  페이지 수보다 페이지 가치
6.  자동 생성과 자동 색인을 구분
7.  모든 결과물에 SHARE
8.  SHARE는 Referral-ready
9.  사용자가 가져가기 쉽게 설계
10. 인용·Embed로 자연 백링크 유도
11. INDEX WORLD 광고·운영 구조 독립
12. 기존 BIZAITO 자산 우선 재사용
13. BIZAITO COMMAND CENTER는 필요 시 외부 운영 레이어로만 선택적 연동
14. INDEX WORLD 내부에 BIZAITO COMMAND CENTER를 복제하지 않음
15. 한계비용이 0에 수렴하도록 설계
16. Contract First → Vertical Slice → Continuous Integration
17. Preview → Approval → Execute → TRUST LEDGER
18. 글로벌 확장 구조, 실행은 KOREA부터
19. 고객에게는 단순하게, 뒤에서는 자동화
20. 기능 추가보다 먼저 첫 Vertical Slice를 완성한다.
21. 화면이 보이는 상태에서 Block/Module 단위로 개발한다.
22. 주요 화면 변화는 Preview에서 대표가 확인한 뒤 다음 단계로 진행한다.
23. Fixture/Sample은 실제 공식 데이터로 오인되지 않게 표시한다.
24. INDEX WORLD는 BIZAITO 코드베이스와 배포환경에 종속되지 않는다.

------------------------------------------------------------------------

**END OF MASTER SPEC v1.0**

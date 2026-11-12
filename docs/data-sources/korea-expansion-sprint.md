# Korea Data Expansion Sprint — historical Cloud research (2026-10-08)

## Recovery provenance

Recovered from recorded patches and commands for Cloud commit a0bcc466eb355e1545a4a97e08d238a55c9eb775, based on main 895e2a2328154011554249276c3ca498d8a4833c. The original commit object was unavailable locally. Code follows the recorded diffs; this document reconstructs the recorded findings rather than claiming byte-identical recovery.

## Publication result

No new observations are published. The existing WDI population snapshot and its two reproducible derivatives remain the only connected indicators. There are 26 added research targets; all are BLOCKED, without numeric observations or enabled capabilities. An institution name, proposed source code, cadence or geography is not dataset-level verification.

## Historical environment evidence

On 2026-10-08, the Cloud session recorded proxy HTTP 403 for jumin.mois.go.kr, kosis.kr, data.go.kr, api.worldbank.org and indexworld.app, and a stale environment draft conflict. These are historical observations, not assertions about current connectivity or settings. The environment network proposal was explicitly excluded from local recovery and must not be applied. No network configuration, secret or credential was copied or created.

## Category coverage

| Category | Selected | Connected | Queued |
|---|---:|---:|---:|
| 사람·가구와 인구 구조의 변화 | 5 | 3 | 2 |
| 주택·가격과 거주의 변화 | 4 | 0 | 4 |
| 성장·소득과 생활물가 | 5 | 0 | 5 |
| 고용·실업과 일하는 사람들 | 4 | 0 | 4 |
| 사업체·창업과 지역 경제 활동 | 4 | 0 | 4 |
| 금융·시장과 가계 자산 | 3 | 0 | 3 |
| 학교·학생과 배움의 변화 | 3 | 0 | 3 |
| 건강·의료와 돌봄 접근성 | 3 | 0 | 3 |
| 생활·안전과 사회 변화 | 3 | 0 | 3 |
| 이동·교통과 자동차 | 3 | 0 | 3 |
| 기후·배출과 에너지 | 3 | 0 | 3 |
| 국가 비교와 세계의 변화 | 3 | 0 | 3 |

## Blocked data queue

| Indicator | Category | Discovery URL | Unresolved gate |
|---|---|---|---|
| household_total | population-household | https://jumin.mois.go.kr/ | Stable region history and dataset license not yet verified |
| single_person_household_share | population-household | https://kosis.kr/ | Dataset-level access, ID, license and definitions remain unverified |
| apartment_price_index | real-estate-housing | https://www.data.go.kr/tcs/dss/selectDataSetList.do?keyword=%EC%A3%BC%ED%83%9D%EA%B0%80%EA%B2%A9%EB%8F%99%ED%96%A5 | Dataset-level access, ID, license and definitions remain unverified |
| apartment_transaction_price | real-estate-housing | https://www.data.go.kr/tcs/dss/selectDataSetList.do?keyword=%EC%8B%A4%EA%B1%B0%EB%9E%98%EA%B0%80 | Service key, transaction cleaning and stable region codes required |
| housing_stock | real-estate-housing | https://kosis.kr/ | Dataset-level access, ID, license and definitions remain unverified |
| gdp_real | economy-income | https://ecos.bok.or.kr/ | Dataset-level access, ID, license and definitions remain unverified |
| grdp | economy-income | https://www.data.go.kr/tcs/dss/selectDataSetList.do?keyword=%EC%A7%80%EC%97%AD%EB%82%B4%EC%B4%9D%EC%83%9D%EC%82%B0 | Nationally consistent series and region history not yet verified |
| consumer_price_index | economy-income | https://kosis.kr/ | Dataset-level access, ID, license and definitions remain unverified |
| employment_rate | jobs-employment | https://www.data.go.kr/tcs/dss/selectDataSetList.do?keyword=%EA%B3%A0%EC%9A%A9%EB%A5%A0 | Dataset-level access, ID, license and definitions remain unverified |
| unemployment_rate | jobs-employment | https://kosis.kr/search/search.do?query=%EC%8B%A4%EC%97%85%EB%A5%A0 | Dataset-level access, ID, license and definitions remain unverified |
| employed_total | jobs-employment | https://kosis.kr/ | Dataset-level access, ID, license and definitions remain unverified |
| establishment_total | business-startup | https://www.data.go.kr/tcs/dss/selectDataSetList.do?keyword=%EC%A0%84%EA%B5%AD%EC%82%AC%EC%97%85%EC%B2%B4%EC%A1%B0%EC%82%AC | Industry revisions and stable region history need normalization |
| business_birth_rate | business-startup | https://kosis.kr/ | Dataset-level access, ID, license and definitions remain unverified |
| startup_total | business-startup | https://www.data.go.kr/ | Dataset-level access, ID, license and definitions remain unverified |
| housing_permits | real-estate-housing | https://www.data.go.kr/ | Official access, dataset ID, definitions, reuse terms and geography have not passed verification |
| gdp_per_capita_usd | economy-income | https://data.worldbank.org/ | Official access, dataset ID, definitions, reuse terms and geography have not passed verification |
| consumer_price_inflation_wdi | economy-income | https://data.worldbank.org/ | Official access, dataset ID, definitions, reuse terms and geography have not passed verification |
| unemployment_ilo_modelled | jobs-employment | https://data.worldbank.org/indicator/SL.UEM.TOTL.ZS | Official access, dataset ID, definitions, reuse terms and geography have not passed verification |
| business_death_rate | business-startup | https://kosis.kr/ | Official access, dataset ID, definitions, reuse terms and geography have not passed verification |
| base_interest_rate | finance-assets | https://ecos.bok.or.kr/ | Official access, dataset ID, definitions, reuse terms and geography have not passed verification |
| household_credit | finance-assets | https://ecos.bok.or.kr/ | Official access, dataset ID, definitions, reuse terms and geography have not passed verification |
| household_net_assets | finance-assets | https://kosis.kr/ | Official access, dataset ID, definitions, reuse terms and geography have not passed verification |
| student_total | education | https://kosis.kr/ | Official access, dataset ID, definitions, reuse terms and geography have not passed verification |
| school_total | education | https://kosis.kr/ | Official access, dataset ID, definitions, reuse terms and geography have not passed verification |
| tertiary_attainment | education | https://kosis.kr/ | Official access, dataset ID, definitions, reuse terms and geography have not passed verification |
| life_expectancy | health-medical | https://kosis.kr/ | Official access, dataset ID, definitions, reuse terms and geography have not passed verification |
| physician_total | health-medical | https://kosis.kr/ | Official access, dataset ID, definitions, reuse terms and geography have not passed verification |
| hospital_beds | health-medical | https://kosis.kr/ | Official access, dataset ID, definitions, reuse terms and geography have not passed verification |
| reported_crime_total | society-life | https://www.data.go.kr/ | Official access, dataset ID, definitions, reuse terms and geography have not passed verification |
| marriage_total | society-life | https://www.data.go.kr/ | Official access, dataset ID, definitions, reuse terms and geography have not passed verification |
| divorce_total | society-life | https://www.data.go.kr/ | Official access, dataset ID, definitions, reuse terms and geography have not passed verification |
| registered_vehicles | transport-vehicles | https://www.data.go.kr/ | Official access, dataset ID, definitions, reuse terms and geography have not passed verification |
| road_accident_total | transport-vehicles | https://www.data.go.kr/ | Official access, dataset ID, definitions, reuse terms and geography have not passed verification |
| public_transport_trips | transport-vehicles | https://www.data.go.kr/ | Official access, dataset ID, definitions, reuse terms and geography have not passed verification |
| pm25_annual_mean | environment-energy | https://www.data.go.kr/ | Official access, dataset ID, definitions, reuse terms and geography have not passed verification |
| electricity_consumption | environment-energy | https://www.data.go.kr/ | Official access, dataset ID, definitions, reuse terms and geography have not passed verification |
| annual_temperature | environment-energy | https://www.data.go.kr/ | Official access, dataset ID, definitions, reuse terms and geography have not passed verification |
| world_population | country-world | https://data.worldbank.org/ | Official access, dataset ID, definitions, reuse terms and geography have not passed verification |
| world_gdp_ppp | country-world | https://data.worldbank.org/ | Official access, dataset ID, definitions, reuse terms and geography have not passed verification |
| world_life_expectancy | country-world | https://data.worldbank.org/ | Official access, dataset ID, definitions, reuse terms and geography have not passed verification |

## Source review status

KOSIS, MOIS, Public Data Portal, ECOS, MOLIT, employment, education, health, police, transport, environment and meteorological institutions, World Bank, OECD and UN were discovery targets. Except for the inherited population adapter, dataset identity, download/API, definitions, revisions, commercial reuse terms, region-code history, update cadence and automation remain unverified. Portal or software licenses do not license underlying datasets. No new API key is needed for this recovery.

## Publication contract

SOURCE → INGEST → NORMALIZE → VALIDATE → VERSION → QUALITY → PUBLISH. Catalog observations carry category, indicator, geography, period, unit, source, dataset, license, version, quality and ingestion time. Ingestion time is not a fabricated source publication date. Publication rejects unconnected indicators, non-finite values, missing provenance/license, duplicate or mixed series and any mismatch with a reviewed adapter. Derivatives require adjacent verified years, matching versions and a positive denominator. The homepage snapshot validates before rendering; validation failure aborts rendering/build instead of publishing invalid values. This gate covers the recovered connected snapshot, not a newly implemented general ingestion system.

## Existing behavior

No population observation, Production AdSense snippet, policy route, canonical, asset, dependency or deployment workflow was changed. Existing Compare/CSV/PNG/Share/QR/Embed remain on their existing reviewed population adapter. Regional Map/Ranking require independently verified regional data. No new numeric geography, guessed statistic, empty category page, DB or API is introduced. The 12-category catalog now includes research targets, not 12 live data categories.

## Validation evidence

The historical Cloud record reported TypeScript, lint, tests, Production/Preview builds and 320px/13-language checks passing, followed by a failed push. Those results are historical only; local recovery must independently rerun its checks. No push or deployment is authorized by recovery.

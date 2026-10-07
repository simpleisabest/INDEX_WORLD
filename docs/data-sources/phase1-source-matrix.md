# INDEX WORLD Phase 1 Source Matrix

Reviewed: 2026-10-07 (Asia/Seoul). This is a publication gate, not a claim that every listed dataset is connected. Search demand is evaluated qualitatively from the user questions in the approved PRD; no search-volume or popularity number is invented.

## Gate

`SOURCE → ACCESS → LICENSE → GEOGRAPHY/HISTORY → NORMALIZE → VALIDATE → VERSION → CONNECT`

Only `CONNECTED` rows may expose values. `CANDIDATE` rows are source-research records. `BLOCKED` rows stay out of public answers, maps and rankings until every stated blocker is resolved.

## Connected indicators

| Category | Indicator | Status | Source | Period / geography | License | Calculation |
|---|---|---|---|---|---|---|
| Population & households | Total population | CONNECTED | World Bank, World Development Indicators, `SP.POP.TOTL` | Annual 1960–2025 / Korea (`kr`) | CC BY 4.0 | Original observation |
| Population & households | Annual population change | CONNECTED | Same versioned WDI series | Annual 1961–2025 / Korea | CC BY 4.0 | current − previous |
| Population & households | Annual population change rate | CONNECTED | Same versioned WDI series | Annual 1961–2025 / Korea | CC BY 4.0 | (current − previous) / previous × 100 |

The two derived indicators inherit the source ID, source URL, ingestion timestamp, data version and quality state of each verified total-population observation. They do not create or estimate a number.

## Phase 1 candidate evaluation

Legend: demand/access/automation `H/M/L`; geography describes the expected level, not a published promise.

| Priority | Candidate | Demand | Official source | Access | License | Update | Geography | Automation | Gate |
|---|---|---:|---|---|---|---|---|---:|---|
| Population | Households | H | MOIS resident registration / Statistics Korea | portal/download | dataset review | monthly/annual | national→eup/myeon/dong | M | BLOCKED: stable region history + license |
| Population | Single-person household share | H | Statistics Korea, KOSIS | OpenAPI key/download | KOSIS + dataset review | annual | national/region | M | CANDIDATE |
| Population | Population projections | M | Statistics Korea, KOSIS | OpenAPI/download | dataset review | revision cycle | national/region | M | CANDIDATE: projection status required |
| Population | Births / deaths | H | Statistics Korea, Vital Statistics | KOSIS/download | dataset review | monthly/annual | national/region | H | CANDIDATE |
| Housing | Apartment sale price index | H | Korea Real Estate Board | data.go.kr file/API | dataset review | monthly | region | H | CANDIDATE |
| Housing | Apartment actual transactions | H | MOLIT | data.go.kr service key | dataset review | monthly | legal-dong | H | BLOCKED: key + cleaning + region history |
| Housing | Housing stock / type | M | Statistics Korea, Population and Housing Census | KOSIS/download | dataset review | annual/census | region | M | CANDIDATE |
| Economy | Real GDP | H | Bank of Korea ECOS | OpenAPI key | ECOS terms | quarterly/annual | country | H | CANDIDATE |
| Economy | GRDP | H | Statistics Korea / regional accounts | KOSIS and fragmented files | dataset review | annual | region | L | BLOCKED: consistent national series |
| Economy | Consumer price index | H | Statistics Korea | KOSIS OpenAPI/download | dataset review | monthly | country/selected regions | H | CANDIDATE |
| Employment | Employment rate | H | Statistics Korea, Economically Active Population Survey | KOSIS/data.go.kr review | dataset review | monthly | national/region | H | CANDIDATE |
| Employment | Unemployment rate | H | Statistics Korea, Economically Active Population Survey | KOSIS OpenAPI/download | dataset review | monthly | national/region | H | CANDIDATE |
| Employment | Employed persons | M | Statistics Korea | KOSIS OpenAPI/download | dataset review | monthly | national/region | H | CANDIDATE |
| Business | Establishments | H | Statistics Korea, Census on Establishments | data.go.kr/KOSIS | dataset review | annual | region/industry | M | BLOCKED: industry revisions + region history |
| Business | Enterprise birth rate | M | Statistics Korea, Business Demography | KOSIS review | dataset review | annual | national/region | M | CANDIDATE |
| Business | New businesses | H | Ministry of SMEs and Startups / KOSIS | dataset review | dataset review | monthly/annual | mixed | M | CANDIDATE |

## Official discovery evidence

- [KOSIS unemployment-rate search](https://kosis.kr/search/search.do?query=%EC%8B%A4%EC%97%85%EB%A5%A0) — Statistics Korea tables; exact table, API parameters and terms remain to be frozen.
- [Public Data Portal housing-price search](https://www.data.go.kr/tcs/dss/selectDataSetList.do?keyword=%EC%A3%BC%ED%83%9D%EA%B0%80%EA%B2%A9%EB%8F%99%ED%96%A5) — Korea Real Estate Board monthly apartment sale-price index candidates.
- [Public Data Portal actual-transaction search](https://www.data.go.kr/tcs/dss/selectDataSetList.do?keyword=%EC%8B%A4%EA%B1%B0%EB%9E%98%EA%B0%80) — MOLIT apartment sale/rent transaction APIs; service keys are required.
- [Public Data Portal employment search](https://www.data.go.kr/tcs/dss/selectDataSetList.do?keyword=%EA%B3%A0%EC%9A%A9%EB%A5%A0) — Statistics Korea/SGIS and regional candidates; national comparability must be selected explicitly.
- [Public Data Portal Census on Establishments search](https://www.data.go.kr/tcs/dss/selectDataSetList.do?keyword=%EC%A0%84%EA%B5%AD%EC%82%AC%EC%97%85%EC%B2%B4%EC%A1%B0%EC%82%AC) — Statistics Korea official candidate.
- [Public Data Portal GRDP search](https://www.data.go.kr/tcs/dss/selectDataSetList.do?keyword=%EC%A7%80%EC%97%AD%EB%82%B4%EC%B4%9D%EC%83%9D%EC%82%B0) — results are fragmented by regional provider; no ranking publication is allowed yet.

## Blocked Data Queue

1. V0.6 regional population: legal boundary history, stable `region_id`, national coverage and licensing remain unresolved.
2. Household total: portal evidence exists; stable region history and dataset-specific reuse terms are not frozen.
3. MOLIT transactions: service credential, cancellation/duplicate handling, price/unit normalization and legal-dong history are unresolved.
4. GRDP: provider/year/price-basis consistency and region history are unresolved.
5. Establishment rankings: industrial-classification revisions and stable regional lineage are unresolved.

No blocked candidate is included in questions, values, charts, maps, rankings, exports or SEO pages.

## Template review

- Compare is already observation-driven. New adapters must provide verified observations and identical geography/period/source/version constraints for the chosen dimension.
- Ranking now has a shared validator requiring at least two verified observations, one indicator/period/unit/version, and unique stable region IDs. With V0.6 blocked, no regional ranking model is instantiated.
- KPI/time-series/share/export/citation/embed capabilities live in the indicator registry. UI blocks must render only capabilities declared by a `CONNECTED` indicator.
- Country and language are separate: `country_id`/`region_id` belong to observations, while locale remains a presentation concern.

# Next Data Sprint 2 — 2026-11-12

Baseline main 4501166, D:\INDEX WORLD. Eight new indicators and 206 unchanged official observations. Total: eighteen connected indicators, 607 observations including existing population and its two derived series, eight of twelve categories with live data. Of the original expansion list, three more candidates passed (housing permits, life expectancy, GDP PPP); nineteen remain BLOCKED. New adjacent series do not silently unlock similarly named datasets.

| Category | New indicator | Official code | Unit and cadence | Acquired/published scope |
|---|---|---|---|---|
| Housing | Housing permits | MOLIT/31/626 | dwellings, annual | 2014–2024 final, 11 |
| Housing | Housing starts | MOLIT/471/5388 | dwellings, annual | 2014–2024 final, 11 |
| Housing | Housing completions | MOLIT/468/5374 | dwellings, annual | 2014–2024 final, 11 |
| Housing | Unsold housing | MOLIT/32/2082 | dwellings, monthly stock | 2024-01–2026-09, 33 |
| Housing | Completed unsold housing | MOLIT/32/5328 | dwellings, monthly stock | 2026-07–2026-09, 3 |
| Health | Life expectancy at birth | SP.DYN.LE00.IN | years, annual | 1960–2024, 65 |
| Environment | Electricity consumption per capita | EG.USE.ELEC.KH.PC | kWh/person, annual | 1990–2025, 36 |
| Country/world | Korea GDP per capita, PPP, current international dollars | NY.GDP.PCAP.PP.CD | current international dollars/person, annual | 1990–2025, 36 |

## Official originals, definitions and reuse

MOLIT data were acquired using normal public metadata-page attachment download buttons, without an account or key. The six original XLSX files are retained unchanged under data/molit-*.xlsx. data/verified-molit.json identifies each workbook, SHA-256, worksheet, original header/national-total/value cell, normalized period and unchanged published value. scripts/verify-molit-xlsx.py independently opens the original ZIP/XML cells with the Python standard library, checking the whole normalized result; it never executes a workbook or fills missing cells.

The [MOLIT statistical-information reuse policy](https://stat.molit.go.kr/portal/info/protect.do) explicitly permits use, reuse and redistribution for commercial and noncommercial purposes with accurate attribution. The database, agency, survey and retrieval date are cited. This is recorded as the statistical-information policy, not an invented CC license or a blanket permission for third-party content. The individual [starts catalogue](https://www.data.go.kr/data/15068728/fileData.do) and [completions catalogue](https://www.data.go.kr/data/15068725/fileData.do) additionally specify free access and unrestricted reuse. The manifest molit-verification-2026-11-12.json records the evidence and original hashes.

Annual construction metadata explicitly states the revised final release for 2014–2024 was published on 2025-09-30. Only those years from the corresponding “24년” annual attachments are used. Later annual attachments, populated later-year columns and monthly provisional releases were inspected but are excluded from the publication pipeline. The annual series are a bounded final historical selection, not a claim of current monthly supply or the newest available finalized year. A permit concerns dwellings, not building count. Starts use final approval; completions use first approval (including temporary/partial approval) as defined by the source revision. No different-vintage monthly sums are substituted.

Unsold housing is the reported private-sector month-end stock, including before and after completion, not sales, transactions or new monthly supply. Completed unsold housing is a subset, never added to the total. Only three acquired monthly workbooks support the completed subset. The total uses the latest workbook's explicit 2024-01–2026-09 labels; ambiguous early numeric month headers are not interpreted. Reported figures may be revised by the agency; no source publication or DB-update timestamp is invented.

WDI records retain the full original country API response, raw SHA-256, metadata, original organizations, definition, license evidence URL and check time, source DB date and acquisition time. Individual official [life expectancy](https://data.worldbank.org/indicator/SP.DYN.LE00.IN?locations=KR), [education glossary](https://databank.worldbank.org/metadataglossary/world-development-indicators/series/SE.TER.CUAT.ST.ZS), [electricity](https://data.worldbank.org/indicator/EG.USE.ELEC.KH.PC?locations=KR) and [PPP GDP](https://data.worldbank.org/indicator/NY.GDP.PCAP.PP.CD?locations=KR) identify CC BY 4.0. Source definitions and original providers are included in citations. No provisional/nonblank observation-status values, missing data, foreign-country observations or partial API pages are accepted. Existing three WDI records are preserved exactly. The collector now isolates failed new records, retaining other independently verified candidates; its normal verification mode is read-only.

Life expectancy is a population mortality measure, not an individual's prognosis. The quarantined education series is cumulative ISCED attainment for age 25+, not enrollment or the OECD 25–64 denominator. Its historical missing years are not generated; the reusable screen/PNG period axis preserves actual elapsed year distances. Electricity is per capita, not total consumption; the original electricity_consumption candidate remains blocked. PPP dollars are current international dollars, not constant-price growth, income, salary or convertible USD. Korea-only data do not enable country rankings/comparison; world_population and world_life_expectancy remain blocked.

## Quarantine and next candidates

- Education attainment was initially acquired and licensed but repeatedly failed CI live-source verification with HTTP 502, including a separate official source=2 query. It is BLOCKED for this release. The original response, hash, metadata, license evidence and 27 observations are preserved in quarantined-tertiary-attainment-2026-11-12.json outside the runtime/publication imports. No current global outage is inferred. A healthy exact source recheck and explicit review are required before promotion.
- R-ONE API connectors still require a key and remain BLOCKED. Existing licensed sale/jeonse public CSV records are unchanged. No secret was read, installed, generated or copied.
- Housing transaction-volume data were not acquired and reconciled in this sprint; no placeholder is published.
- An official index.go.kr single-person household table was accessible, but its policy requires a dataset-level KOGL mark; such permission was not established for this acquired table. It is quarantined in ignored local research only. Household totals and single-person share remain unconnected pending a directly licensed KOSIS original. Census general households must not be substituted with resident-registration households or projections.
- Wages, employment-survey rates, establishments and startup/closure counts still require exact definitions, industry revisions, original files and reuse verification. Existing enterprise rates and ILO modeled unemployment are unchanged; enterprise counts are not labeled establishments.
- Finance, society and transport remain categories to fill. All nineteen unreconciled expansion candidates stay BLOCKED. Historical Cloud 403 notes are not used as current source availability evidence.

## Reproduction and release checks

Use each public table's normal attachment button; do not fetch API-key-only endpoints or infer missing values. To review retained originals: python scripts/verify-molit-xlsx.py. --normalize is an explicit manual operation confined to the reviewed final/monthly scopes. A newer selection requires reviewing definitions, revision/final status, unit, geography, cadence and reuse terms again.

The publication allowlists bind source code/URL/license/unit/category/cadence/period/quality, and all displayed/exported observations must equal the reviewed adapter. New tamper tests reject changed raw values, provisional/later construction periods, units, fake provenance, extrapolated months and unreviewed datasets. Existing KPI/Chart/Compare/Citation/CSV/Share and thirteen-language controls are reused; unsupported Embed/map/ranking features stay unavailable. Run TypeScript, Lint, all tests, Publication tests, source verification, production and preview builds, browser checks of all fifteen frozen series, secret scan and git diff --check before push/deployment.

No DB, schema, environment variable, secret, paid API, workflow or production infrastructure change.

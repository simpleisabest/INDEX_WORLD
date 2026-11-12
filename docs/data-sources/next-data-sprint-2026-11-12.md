# Next Data Sprint — 2026-11-12

Baseline: main f869383. No DB, Secret, paid API or infrastructure changes.

## Final publication scope

Seven new indicators, 205 official observations, across all four priority categories. Together with existing population, ten connected indicators across five categories. Four of the recovered 26 candidates were promoted; the remaining 22 stay BLOCKED.

| Category | Indicator | Official code | Unit / cadence | Published selection |
|---|---|---|---|---|
| Housing | Apartment sale survey index | A_2024_00045 | June 2026=100 / monthly | 2025-12–2026-09, 10 points |
| Housing | Apartment jeonse survey index | A_2024_00050 | June 2026=100 / monthly | 2025-12–2026-09, 10 points |
| Economy | GDP per capita | NY.GDP.PCAP.CD | current USD/person / annual | 1960–2025, 66 points |
| Economy | Consumer-price inflation | FP.CPI.TOTL.ZG | annual percent change / annual | 1960–2025, 66 points |
| Jobs | ILO modeled unemployment | SL.UEM.TOTL.ZS | percent of labor force / annual | 1991–2025, 35 points |
| Business | Enterprise birth rate | DT_1BD1101/T04/A=0 | percent / annual | 2016–2024 final, 9 points |
| Business | Enterprise death rate | DT_1BD1101/T05/A=0 | percent / annual | 2016–2024 final, 9 points |

These are dated frozen national snapshots, not real-time updates or full-history claims. Existing population values are unchanged.

## Official sources and licenses

WDI: data/verified-wdi.json retains the complete API responses, SHA-256, original sources, definitions, unchanged observations, metadata/API URLs, retrieval and source DB dates. Individual official pages label CC BY-4.0: [GDP](https://data.worldbank.org/indicator/NY.GDP.PCAP.CD?locations=KR), [inflation](https://data.worldbank.org/indicator/FP.CPI.TOTL.ZG?locations=KR), [ILO unemployment](https://data.worldbank.org/indicator/SL.UEM.TOTL.ZS?locations=KR). Attribution includes World Bank and original providers. [Reuse terms](https://datacatalog.worldbank.org/public-licenses?fragment=cc).

REB: data/reb-A_2024_00045.csv and data/reb-A_2024_00050.csv were downloaded through each normal public table's CSV button, without login or API key. They contain 236 regional rows for the ten selected months. Only the unique national row is published. data/verified-reb.json preserves the exact header/national row, raw-file SHA-256, base and individual license metadata. Official file catalogues [15069821](https://www.data.go.kr/data/15069821/fileData.do) and [15044018](https://www.data.go.kr/data/15044018/fileData.do) explicitly permit unrestricted reuse and link to R-ONE. CSV precision is preserved; higher-precision API values are not mixed into the snapshot.

KOSIS: data/kosis-DT_1BD1101.csv came from the normal public [latest table](https://kosis.kr/statHtml/statHtml.do?orgId=101&tblId=DT_1BD1101&conn_path=I2), selecting the last ten years with statistical symbols included. Published national/all-industry T04/T05 values are used directly. All 2025 p) columns are excluded. No rate is inferred from counts. data/verified-kosis.json retains the original header/row, selected column indices and raw-file hash. [KOSIS domestic macro-statistics guidance](https://stat.kosis.kr/nsistN/kosisUseGuide.do) permits attributed commercial/noncommercial reuse, with exceptions. This use is domestic macro-statistics, not international/North Korea data, microdata or paid raw-data resale. kosis-DT_1BD1101-metadata.json confirms the 11th industry classification, item codes, units and DB update date.

Source DB dates are distinct from retrieval dates. Exact source publication dates remain null/unknown; neither date is invented as publication time.

## Interpretation and gates

GDP is nominal current-dollar GDP per person, not salary or inflation-adjusted income. Inflation is an annual price change, not a CPI level or monthly change. ILO estimates are labeled modeled, distinct from Korea's monthly national survey, and not used for country/regional rankings.

REB values are non-seasonally-adjusted housing survey indexes, not transaction-price indexes or currency amounts. Both use the same June 2026 base and the exact ten-month selection. No different-base history is joined.

KOSIS rates cover all industries under the 11th classification. The latest published final year is 2024. Provisional 2025 is never promoted, and missing death-rate observations are never generated. Percentage-rate differences are labeled percentage points; relative change is separately described.

Explicit adapter allowlists bind indicator/code/category/unit/license/period. Snapshot values must match retained official responses or CSV rows. Publication then requires an exact adapter match for every displayed/exported observation. Unknown indicators, value/source/license/quality tampering, duplicates, mixed versions and provisional observations are rejected.

Existing Category/Snapshot, SVG chart styling, CompareBlock, ExportMenu, ShareButton, Citation and attributed CSV are reused. Share links validate and restore the actual year/month/comparison. New indicators do not advertise Embed, regional maps or rankings without compatible adapters.

## R-ONE API and public CSV are separate connectors

r-one-verification-2026-11-12.json distinguishes API BLOCKED from CSV VERIFIED. Exact survey codes are A_2024_00045 and A_2024_00050; DTACYCLE_CD=MM, ITM_ID=100001, national CLS_ID=500001.

The [official guide](https://www.reb.or.kr/r-one/portal/openapi/openApiDevPage.do) and observed keyless responses limit API access to five rows; full API access needs an issued key. No key was created, read or installed. No pagination/window loop bypasses that limit. The independent normal public CSV route supplied the complete selected national window. A bounded public sample is used only as a supplementary cross-check against those CSV values.

A_2024_00178 and A_2024_00182 are different transaction-price series and were not substituted. Inconsistent catalogue DATA_END_YY is not used for freshness.

## Reproduction and remaining candidates

- node scripts/collect-verified-wdi.mjs --collect explicitly collects reviewed snapshots. Default mode is read-only official-value verification.
- Use each normal public table's CSV button for REB/KOSIS and retain original bytes and statistical symbols. scripts/normalize-reb-csv.py and scripts/normalize-kosis-csv.py validate the acquired selections. Any refresh requires reviewing scope, basis, classification, reuse terms and final/provisional flags again.
- npm run data:verify compares population/WDI to official APIs, verifies original CSV hashes/national selections/final periods, and supplements REB with a bounded public sample cross-check. It does not silently replace snapshots.
- Housing permits and all other unreconciled candidates remain BLOCKED. MOLIT describes provisional monthly and revised final releases, but an acquired complete series with reviewed aggregation/reuse scope was not established for permits.
- The initial direct KOSIS request's access-block notice applied to that request. Normal public browsing/CSV subsequently worked. It is not described as a current global outage. Historical Cloud 403 notes do not establish current availability.

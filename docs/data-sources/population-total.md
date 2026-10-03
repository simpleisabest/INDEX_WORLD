# Population total — V0.5 source decision

## Selected source

- Organization: World Bank
- Dataset: World Development Indicators (WDI)
- Indicator / source ID: `SP.POP.TOTL`
- Economy: Korea, Rep. (`KOR`)
- Official page: https://data.worldbank.org/indicator/SP.POP.TOTL?locations=KR
- Official API: https://api.worldbank.org/v2/country/KOR/indicator/SP.POP.TOTL?format=json&per_page=100
- Access: public API, no credential
- Format: JSON/XML API and downloadable data
- Frequency: annual
- Geographic level: national
- Time coverage used: 1960–2025
- Unit: people
- License: CC BY 4.0 under the World Bank Dataset Terms of Use
- Rate limit: no published fixed request quota; this project makes one CI verification request and serves static output

WDI was selected for V0.5 because it provides a long, stable, keyless official time series with clear reuse terms and near-zero serving cost. The committed static series is checked against the official API during Preview deployment; a mismatch, missing year, new official year, or source failure blocks publication.

## Korean source review and limitation

KOSIS, Ministry of the Interior and Safety resident-registration statistics, and the Public Data Portal remain the preferred candidates for future province and municipality data. They were not selected for this national V0.5 slice because their official endpoints could not be reproducibly accessed in the current cloud network and some programmatic routes require credentials. No bypass or unofficial Korean figure is used.

WDI national population is not treated as resident-registration population and must not be joined to subnational Korean observations without an explicit methodology review. Region IDs and indicator IDs remain source-independent so a Korean official connector can be added later.

## Storage and provenance

V0.5 uses a small versioned static JSON dataset. A database would add cost and operational complexity without improving this single annual series. UI components consume normalized observations rather than source-specific API rows. Each normalized observation inherits organization, dataset, source ID/URL, ingestion timestamp, version, unit, and quality status.

Quality checks cover nulls, duplicate periods, invalid/negative values, invalid identity, invalid periods, unit mismatch, annual gaps, abnormal year-over-year changes, staleness, and source/API failures.

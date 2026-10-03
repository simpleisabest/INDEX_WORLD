# V0.7 Compare Foundation

The default CompareBlock compares two years from the preserved, verified World Bank KOR/SP.POP.TOTL national population snapshot. It supports baseline and comparison years, swapping, same-year and reversed comparisons, two bars on a shared zero-based scale, an accessible numeric table, share-state restoration, CSV, and copyable citations with source links and licenses. Multi-year percentage change is total change, not annualized growth. The denominator is the selected baseline; zero baseline produces an unavailable percentage.

## Contract and extension

`CompareModel` supplies a content ID, comparison dimension, options containing complete verified observations, and default baseline/target IDs. `CompareBlock` accepts a model plus optional translation-key overrides. The Population adapter supplies all 66 official annual observations; the component never synthesizes missing values or region IDs.

The dimension contract supports `period`, `region`, `country`, and `indicator`. Later adapters must provide official verified data and evidence before use. Region/country comparisons require matching periods; region comparisons require the same country; indicator comparisons require the same geography and period. Differences require matching indicator, unit, source methodology identifiers, and snapshot version. Incompatible values may be displayed separately, but differences and rates remain unavailable. Future adapters must review methodology and geographic-level compatibility too; this contract alone is not an authorization to publish regional or foreign data.

V0.7 exposes only the year comparison. No future-mode controls, fixture values, or invented region mappings are published. V0.6's regional gate, verification document, CSV absence record, and hashes remain unchanged.

## Existing assets

Reuse/adapt: current Population connector, LocaleProvider and number/date formatting, ShareButton and Share event contract, static Preview deployment, and ad component. No additional chart library, backend, analytics service, or BIZAITO dependency is introduced. Share URLs now carry dimension, baseline, and target IDs; other blocks clear these parameters when shared. Only valid supplied options can be restored from a URL.

All 32 Compare strings are explicitly supplied in the 13 supported dictionaries. Ad slots A/B/C and the existing national time series remain in place. Preview stays static and noindex, and deployment still requires live World Bank verification.

CSV includes both raw values, identities, source ID/URL, publication date (empty when unknown), ingestion date, version, quality, license, absolute difference, percentage, and calculation. Citation copying adds the current INDEX comparison URL. Unknown publication dates are never substituted with ingestion dates.

## Validation

Twelve automated tests pass, including comparison arithmetic, zero/missing/incompatible baselines, share-state validation, complete Compare translations, and unchanged source/gate hashes. Type checking, lint, and static Preview build pass. Chromium checks cover default/distant/reversed/same-year comparisons, CSV contents, citation clipboard, share/restoration/invalid URLs, all 13 locale switches, 320–1440px layouts, existing national time-series interactions, all three ad slots, and absence of regional markers.

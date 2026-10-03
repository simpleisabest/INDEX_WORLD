# National Population UX

This update uses the existing verified World Bank `KOR / SP.POP.TOTL` snapshot only (1960–2025). Regional publication remains BLOCKED in `data/regions/gate.json`; Map has no selectable regional markers or mappings, and regional rankings have no data connection. Existing Share actions remain available, including restoring a shared national time-series year.

The series supports 10/25/all-year presets, inclusive start/end years, a year slider, keyboard-focusable chart points, a numeric axis, and an annual-value table. A selection outside a newly narrowed range falls back to its latest year. A single-year range is supported.

Latest total and annual absolute/percentage change use the national snapshot. Change is current minus previous year; percentage uses previous-year population as denominator. Missing prior years or a zero percentage denominator display unavailable. Age 65+ remains pending.

Citation UI links to the original source and dataset license, offers a copyable citation, and distinguishes ingestion date from an unavailable source publication date. The population definition remains WDI national population, not resident-registration population.

CSV download exports the selected national years with machine-readable units, source, license, version, and ingestion timestamp. The full snapshot is preserved at `data/population/korea-total.csv`. `docs/data-sources/SHA256SUMS` preserves hashes for the source JSON, CSV, V0.6 verification document, and regional gate. No regional CSV exists in this checkout; the gate records that absence rather than manufacturing a snapshot or hash.

Preview workflow still requires live World Bank source verification before deployment. The managed Runtime denies `api.worldbank.org` (proxy HTTP 403); this local limitation does not waive the CI check.

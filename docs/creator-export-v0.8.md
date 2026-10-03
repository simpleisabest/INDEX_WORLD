# V0.8 Creator / Export

The national Population time series and CompareBlock now use one Export / Share menu per block. Actions: chart PNG, Print, table/data copy, citation copy, CSV, square share-card PNG, and the existing native mobile Share / clipboard fallback. Period selectors and compare swapping stay outside the menu; duplicate CSV/citation buttons are removed.

## Data and attribution

Exports use the active verified Population snapshot and current selections. Every export is guarded against non-VERIFIED quality, missing provenance, non-finite or negative population. No regional adapter or mapping is added; V0.6 files and preservation hashes remain unchanged.

PNG is rendered locally with browser Canvas, without remote rendering, screenshot services, or new dependencies. Both PNG formats are 1200×1200. The chart image and share card use different plot heights. Time series retain numeric axes and explicit range-scale/unit metadata; comparison bars use a shared zero-based scale with both exact values and calculated difference/rate. Images carry INDEX WORLD, selected periods/value, original result URL, official source URL, license URL, ingestion/version information, and comparison methodology. Text uses locale number formatting and word/grapheme-aware wrapping.

Print creates a local document containing the chart, all selected table rows, citation, source/license links, and original result URL. It excludes page advertising and controls. Text is escaped, fonts/images finish loading before the browser print dialog is called, and the transient document is cleaned up after printing. Final printer/PDF choice is handled by the browser.

Table copy is TSV plus citation and attribution. Citation copy includes the actual result URL. CSV keeps existing source columns and adds `exported_by` and `index_world_url`, with UTF-8 BOM for spreadsheet compatibility. Its parser preserves quoted commas, quotes, and multiline fields.

Time-series result links now retain start/end years as well as the selected year. Restoration accepts only valid, bounded ranges containing the selected year. Comparison result links continue to retain both selected IDs. Sharing another block clears unrelated selection parameters.

## UX and verification

All ten Export strings are translated in all 13 dictionaries. Small screens use a contained bottom menu; keyboard Escape closes the menu and returns focus. Status and disabled controls communicate progress/failure. Ad slots A/B/C remain, and no regional markers or statistics are published.

Seventeen unit/contract tests pass, plus type checking, lint, and static Preview build. Chromium checks verify PNG signatures and dimensions, share card download, copied values/citations, attributed CSV contents, generated Print table and invocation (the print call is intercepted in tests), exact range restoration, link Share, Escape, all 13 locale switches, 320–1440px overflow, all three ad slots, and regional inactivity. PNG output is visually inspected. A loopback-only local server serves only the Preview build artifacts for testing.

The Preview workflow retains live World Bank verification before publication.

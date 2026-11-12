# Open Source Radar — historical Cloud research (2026-10-08)

Current policy: [Open Source First](../open-source-first.md). The dated 2026-11-12 review inventory supersedes the historical adoption decisions below; the historical record is preserved. 365 RADAR now reviews cost-saving OSS alongside official open data using SEARCH → LICENSE → SECURITY → MAINTENANCE → decision.

Scheduling status (2026-11-12): no new recurring automation was registered. Automatic approval review rejected creation of a permanent daily task with future main Push/Production Deploy authority because explicit schedule/recurring-deployment authorization was insufficient. A safer proposal is daily 09:00 Asia/Seoul read-only discovery and a short evidence/cost report, with no scheduled installs, writes, Push or Deploy; this awaits the user's explicit confirmation. This document is a policy and review record, not a running scheduler. Existing user authorization for the current normal tested change is unchanged.

Recovered from the recorded work for Cloud commit a0bcc466eb355e1545a4a97e08d238a55c9eb775. The original commit object is unavailable locally; this document reconstructs its research decisions, not a byte-identical export. Repository availability, maintenance, licenses and security were not rechecked during local recovery.

No new package, code, dataset or geometry is imported by this recovery.

| Candidate | Historical reference | Recorded license | Decision |
|---|---|---|---|
| D3 | https://github.com/d3/d3/tree/ca958d45217b4c15332d971b935451a6d4c978f4 | ISC | REFERENCE; existing native SVG meets present needs |
| Frictionless Framework | https://github.com/frictionlessdata/frictionless-py/tree/6c7146c07fa0f15b5c1bdc09e73309fb339dfe9a | MIT | REFERENCE; schema/validation concepts only; no Python infrastructure |
| TopoJSON Client | https://github.com/topojson/topojson-client/tree/71e5bd6428fd8b7a40fa980d2ef7862140851f03 | ISC | REFERENCE; wait for independently licensed official geometry |

Before any reuse, review the pinned license, dependencies, advisories, maintenance and data-specific redistribution rights. A parser's license does not license map data.

Unofficial statistics mirrors and unattributed Korean GeoJSON were rejected for this sprint because official provenance, revision status, region lineage, reference period and redistribution rights were unverified. Continue reusing the existing Next.js/React UI, native SVG and QR/export/share utilities.

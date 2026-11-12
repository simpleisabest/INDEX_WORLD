# INDEX WORLD Open Source First

Effective 2026-11-12. The default is to acquire, verify and connect an existing solution. Writing new code is a last resort after checking the current repository, native platform functionality and suitable upstream projects.

## Required review order

1. SEARCH: describe a real need and its current implementation. Check official public datasets/international organizations, official upstream GitHub projects and the existing local utility first. Record source URLs and the exact version/commit. Popularity alone is not evidence.
2. LICENSE: inspect the selected release's actual license and bundled third-party notices. Prefer MIT/Apache-2.0/BSD/ISC with commercial use. Unknown or incompatible rights mean REJECT. MPL-2.0 is commercially usable but needs an explicit file-level review; unmodified test-only axe-core is not shipped in the application. Review dataset/geometry/tile/font rights independently, including attribution, revisions, units, periods, update cadence and redistribution.
3. SECURITY: inspect applicable upstream advisories, exact-version OSV results, install scripts and the resolved dependency graph. Use npm audit on the actual lockfile; a root-package OSV result does not cover all transitive dependencies or prove absence of vulnerabilities. Distinguish a package warning from an exposed runtime path. No automatic install scripts, credentials or unknown downloaded executables. Never hide or disable a failed gate to get a deployment through.
4. MAINTENANCE: check archived/disabled status, supported versions, releases/commits, relevant issue response, compatibility and bus-factor indicators. A recent push is useful evidence, not a support guarantee; an old release alone is not proof of abandonment. If support cannot be established for a new dependency, reject current adoption and set a re-review trigger.
5. DECIDE: compare correctness, integration work, browser bytes, number of dependencies, operational/API cost, update burden and rollback against the current implementation.

| Decision | Meaning |
|---|---|
| REUSE | Use an already reviewed upstream component, official dataset or existing project utility without rebuilding it. |
| ADAPT | Add a small integration around a reviewed component; keep upstream unchanged when possible. |
| REFERENCE | Keep a useful specification/design or a conditional future candidate; no package installation or data-publication permission. |
| REJECT | Do not adopt this version/use case because a gate fails, maintenance is unverified, complexity duplicates existing work, or cost is worse. Re-review only when the reason changes. |

No quota requires adding packages. Full D3/ETL/GIS frameworks are not a substitute for establishing a real need. Use individual modules only if they have a measured benefit. Browser-native Intl, SVG, Canvas, Print/PDF and the existing Compare/Share/Citation/Embed utilities remain the default where they already work.

## 365 RADAR

Each discovery pass covers both (a) official licensed open data for the twelve categories and (b) OSS that can reduce development, QA, maintenance or operating effort. Reuse the previous review to avoid repeatedly researching the same unchanged candidate. Prefer a small number of relevant candidates over a feed of stars/releases.

Record: need/category, official repository/provider URL, selected version/commit, license and obligations, exact security sources/check dates, maintenance evidence and uncertainty, dependency/browser/operational footprint, current implementation, decision/reason, adoption/re-review trigger and cost evidence. Use the dated review inventory in docs/data-sources/. Cash/time savings are measured or explicitly described as estimates; do not invent saved hours or money.

Discovery does not publish datasets. A collector/parser/schema validator must still feed the existing exact-value/provenance Publication Gate. API keys, payment, DB, Auth, DNS or infrastructure changes remain at the user's approval gates. Prefer public keyless downloads; keep key-dependent connectors BLOCKED. Existing production behavior and source snapshots must be preserved until the replacement passes all checks.

Recurring local discovery uses the Codex app automation tool, not an invented cron script or a new production service. Its actual enabled state/schedule must be reported from the tool result, never inferred from this document. Local scheduled execution depends on the app's availability. No production workflow, paid API or infrastructure is introduced by this policy.

## Acceptance and release

Keep source and version/license notices with any shipped code. Pin accepted packages in the manifest/lockfile, review their transitive changes and validate a clean install. Run the project's full TypeScript/Lint/tests, publication and official-source checks, production and preview builds, dependency audit, secret scan, diff check and appropriate browser tests. Test import/export compatibility with preserved real source files and full-precision values. Accessibility automation supplements keyboard/screen-reader/manual review and is not a claim of complete WCAG conformance.

Normal validated changes proceed through local commit, ordinary main push, the existing deployment workflow and production verification under the user's standing authorization. No force push, reset hard, manual production modifications or failed-gate deployment.

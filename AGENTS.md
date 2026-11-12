<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## INDEX WORLD — Open Source First

Before any new implementation, follow **SEARCH → LICENSE → SECURITY → MAINTENANCE → REUSE/ADAPT/REFERENCE/REJECT**. Read [the policy](docs/open-source-first.md) and record dated, version-pinned evidence in `docs/data-sources/`. Search official datasets, existing repository utilities, maintained upstream projects and native platform APIs before writing another implementation.

- Prefer commercially usable MIT, Apache-2.0, BSD and ISC code; preserve copyright/license notices. Review other licenses explicitly. Unknown/conflicting licenses, unacceptable security or maintenance risk, and greater complexity than the current implementation mean REJECT. A code license never licenses a dataset, map geometry, tiles or fonts.
- Prefer zero-cost local/static reuse; avoid duplicate implementations, unnecessary runtime packages, remote services and paid API calls. A mature low-activity project requires evidence of support, not an invented claim that it is maintained or abandoned.
- Publication Gate remains mandatory. Discovery, a parser/schema check, an OSS score or a successful download cannot promote unverified data. Failed candidates stay isolated and BLOCKED.
- For an accepted change, run TypeScript, Lint, all tests, publication/source checks, production/preview builds, relevant browser/QA checks, dependency/secret scans and `git diff --check`. Record the version, source, license, security/maintenance evidence, tradeoff and actual cost impact.
- User authorization already covers normal validated changes through commit → ordinary main push → existing deployment → production verification. Do not ask again for routine Push/Deploy. DB/schema, Secrets/environment variables, paid APIs/cost commitments, Auth/payments, DNS/domains, production infrastructure and destructive data changes retain their separate approval gates. Never force push, reset hard, or deploy a failed gate.
- Work only in `D:\INDEX WORLD`. Do not create another checkout/work folder. If the tree is dirty or another task owns changes, the 365 RADAR performs read-only discovery and reports evidence; it does not overwrite concurrent work.

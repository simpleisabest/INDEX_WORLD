# INDEX WORLD™

INDEX WORLD™ is a global data platform for exploring, comparing, visualizing, and sharing the world through data.

The product and development requirements are governed by the [INDEX WORLD™ Master PRD v1.0](docs/INDEX_WORLD_MASTER_PRD_v1.0.md). When temporary implementation instructions conflict with the Master PRD, report the conflict before proceeding.

## V0.1 Frontend Shell

The first visible product shell is built with Next.js App Router, TypeScript, and responsive CSS. All statistics and map data are intentionally marked as pending until official data sources are connected.

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. Production validation is available through `npm run typecheck`, `npm run lint`, and `npm run build`.

## Preview

The `preview` branch deploys an isolated static build to GitHub Pages. Preview builds set `INDEX_PREVIEW=true`, use the `/INDEX_WORLD` base path, and block search indexing through robots metadata and `robots.txt`. This workflow does not configure the production domain.

# Custom domain and Pages artifact

Production: https://indexworld.app/
Preview: https://indexworld.app/preview/

The former Pages workflow exported only INDEX_PREVIEW=true, with /INDEX_WORLD as basePath. Serving that artifact at the custom-domain root made asset requests use the repository prefix. Production now always uses static export, unoptimized local images, and no basePath; Preview has /preview as its own basePath. Neither target uses an assetPrefix.

`npm run build:pages` independently builds both targets, assembles pages-artifact, adds CNAME and .nojekyll, and validates referenced assets, manifest scopes/icons, noindex, robots, and domain configuration before upload. Main pushes deploy this artifact through GitHub Pages Actions.

Both targets remain noindex. Share, QR, citation, CSV, and embed original URLs use https://indexworld.app/ while preserving selected periods and comparison state. The existing three ad placeholders stay enabled independently of basePath. Region V0.6 evidence and publication gate are unchanged and BLOCKED.

Local validation: 23 unit tests; lint/typecheck; both static builds and artifact checks; browser asset loading, mobile 320–1440px, 13 locales, official-origin exports/share, decoded QR in all three card formats, print and embed restoration. Runtime proxy denies live HTTP and HTTPS requests to indexworld.app (403); live domain responses require an environment that allows that hostname. Local checks cannot establish live DNS/TLS/redirect correctness.

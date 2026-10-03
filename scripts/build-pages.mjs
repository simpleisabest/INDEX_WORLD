import { spawnSync } from 'node:child_process';
import { cpSync, rmSync, writeFileSync } from 'node:fs';

// Each export is compiled separately so Preview never borrows root assets.
rmSync('pages-artifact', { recursive: true, force: true });
for (const preview of [false, true]) {
  rmSync('.next', { recursive: true, force: true });
  rmSync('out', { recursive: true, force: true });
  const result = spawnSync('npm', ['run', 'build'], {
    stdio: 'inherit', env: { ...process.env, INDEX_PREVIEW: String(preview) },
  });
  if (result.status !== 0) process.exit(result.status ?? 1);
  cpSync('out', preview ? 'pages-artifact/preview' : 'pages-artifact', { recursive: true });
}
writeFileSync('pages-artifact/CNAME', 'indexworld.app\n');
writeFileSync('pages-artifact/.nojekyll', '');

await import('./validate-pages.mjs');

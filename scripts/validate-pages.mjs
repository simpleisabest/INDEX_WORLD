import { readFileSync, existsSync } from 'node:fs';
import assert from 'node:assert/strict';
for (const prefix of ['', '/preview']) {
 for (const page of ['index.html', 'embed/index.html']) {
 const html = readFileSync(`pages-artifact${prefix}/${page}`, 'utf8');
 assert.ok(html.includes('https://indexworld.app/'));
 assert.ok(html.includes('noindex'));
 assert.ok(!html.includes('/INDEX_WORLD/'));
 const urls = [...html.matchAll(/(?:src|href)="([^"?#]+)"/g)].map(m => m[1]);
 const assets = urls.filter(u => u.startsWith('/') && (u.includes('/_next/') || /\.(webp|jpg|jpeg|png|ico|svg|webmanifest)$/.test(u)));
 assert.ok(assets.length > 0);
 for (const asset of assets) {
  assert.ok(asset.startsWith(`${prefix}/`), `Wrong asset scope: ${asset}`);
  if (!prefix) assert.ok(!asset.startsWith('/preview/'), `Production uses Preview asset: ${asset}`);
  assert.ok(existsSync(`pages-artifact${asset}`), `Missing asset: ${asset}`);
 }
 }
 const manifest = JSON.parse(readFileSync(`pages-artifact${prefix}/manifest.webmanifest`, 'utf8'));
 assert.equal(manifest.scope, `${prefix}/`);
 for (const icon of manifest.icons) assert.ok(existsSync(`pages-artifact${icon.src}`));
 assert.ok(readFileSync(`pages-artifact${prefix}/robots.txt`, 'utf8').includes('Disallow: /'));
}
assert.equal(readFileSync('pages-artifact/CNAME', 'utf8').trim(), 'indexworld.app');
console.log('Pages artifact PASS: root/preview asset isolation, manifests/icons, canonical host, noindex, CNAME');

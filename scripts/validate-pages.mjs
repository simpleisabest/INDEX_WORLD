import { readFileSync, existsSync } from 'node:fs';
import assert from 'node:assert/strict';
for (const prefix of ['', '/preview']) {
 const html = readFileSync(`pages-artifact${prefix}/index.html`, 'utf8');
 assert.ok(html.includes('https://indexworld.app/'));
 assert.ok(html.includes('noindex'));
 assert.ok(!html.includes('/INDEX_WORLD/'));
 const urls = [...html.matchAll(/(?:src|href)="([^"?#]+)"/g)].map(m => m[1]);
 const assets = urls.filter(u => u.includes('/_next/') || /\.(png|ico|svg|webmanifest)$/.test(u));
 assert.ok(assets.length > 0);
 for (const asset of assets) {
  assert.ok(asset.startsWith(`${prefix}/`), `Wrong asset scope: ${asset}`);
  assert.ok(existsSync(`pages-artifact${asset}`), `Missing asset: ${asset}`);
 }
 const manifest = JSON.parse(readFileSync(`pages-artifact${prefix}/manifest.webmanifest`, 'utf8'));
 assert.equal(manifest.scope, `${prefix}/`);
 for (const icon of manifest.icons) assert.ok(existsSync(`pages-artifact${icon.src}`));
 assert.ok(readFileSync(`pages-artifact${prefix}/robots.txt`, 'utf8').includes('Disallow: /'));
}
assert.equal(readFileSync('pages-artifact/CNAME', 'utf8').trim(), 'indexworld.app');
console.log('Pages artifact PASS: root/preview asset isolation, manifests/icons, canonical host, noindex, CNAME');

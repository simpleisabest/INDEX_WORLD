import test from 'node:test';
import assert from 'node:assert/strict';
import { originalResultUrl } from '../lib/share.ts';
import { embedCode } from '../lib/embed.ts';

test('official result URLs remove preview/embed paths but retain data selection', () => {
 for (const path of ['/preview/', '/INDEX_WORLD/', '/preview/embed/']) {
  const url = originalResultUrl(`http://localhost:4183${path}?content=population-compare&baseline=2024&target=2025#chart`, 'https://indexworld.app');
  assert.equal(url.origin, 'https://indexworld.app');
  assert.equal(url.pathname, '/');
  assert.equal(url.hash, '');
  assert.equal(url.searchParams.get('baseline'), '2024');
  assert.ok(embedCode(url.toString(), 'Population', 'World Bank', 'https://data.worldbank.org/').includes('https://indexworld.app/embed/'));
 }
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { selectPopulationRange, clampPopulationPeriod, populationChange, populationCsv } from '../lib/data/population-tools.ts';
const dataset = JSON.parse(await readFile(new URL('../data/population/korea-total.json', import.meta.url), 'utf8'));
const series = dataset.series.map(([year, value]) => ({ reference_period: String(year), value }));
test('period selection is inclusive, supports one year and rejects reversed ranges', () => {
  assert.equal(selectPopulationRange(series, 2001, 2025).length, 25);
  assert.equal(selectPopulationRange(series, 2025, 2025).length, 1);
  assert.equal(selectPopulationRange(series, 1960, 2025).length, 66);
  assert.throws(() => selectPopulationRange(series, 2025, 2024), RangeError);
  const visible = selectPopulationRange(series, 2016, 2025);
  assert.equal(clampPopulationPeriod(visible, '1960').reference_period, '2025');
  assert.equal(clampPopulationPeriod(visible, '2020').reference_period, '2020');
});
test('official annual change has correct sign and denominator; missing/zero baseline is explicit', () => {
  const change = populationChange(series.at(-1), series.at(-2));
  assert.equal(change.absolute, -66501);
  assert.equal(change.percent, -66501 / 51751065 * 100);
  assert.equal(populationChange(series[0]), null);
  assert.equal(populationChange(series.at(-1), series.at(-3)), null);
  assert.deepEqual(populationChange({ reference_period: '2001', value: 2 }, { reference_period: '2000', value: 0 }), { absolute: 2, percent: null });
});
test('CSV exports only selected official national observations with license and provenance', () => {
  const csv = populationCsv(selectPopulationRange(series, 2024, 2025), dataset.source, dataset.version, dataset.ingested_at);
  assert.equal(csv.trim().split('\r\n').length, 3);
  assert.ok(csv.includes('"2025","51684564","person"'));
  assert.ok(csv.includes('"CC BY 4.0"'));
  assert.ok(csv.includes(dataset.source.license_url));
  assert.ok(csv.includes(dataset.version));
  assert.ok(!csv.includes('kr-seoul'));
  const escaped = populationCsv(series.slice(0, 1), { ...dataset.source, dataset_name: 'A, "B"' }, dataset.version, dataset.ingested_at);
  assert.ok(escaped.includes('"A, ""B"""'));
});

test('preserved evidence hashes match files and regional publication remains blocked', async () => {
  const { createHash } = await import('node:crypto');
  const sums = await readFile(new URL('../docs/data-sources/SHA256SUMS', import.meta.url), 'utf8');
  for (const line of sums.trim().split('\n')) {
    const [hash, path] = line.split('  ');
    assert.equal(createHash('sha256').update(await readFile(new URL(`../${path}`, import.meta.url))).digest('hex'), hash, path);
  }
  const gate = JSON.parse(await readFile(new URL('../data/regions/gate.json', import.meta.url), 'utf8'));
  assert.equal(gate.status, 'BLOCKED');
  assert.equal(gate.publishable, false);
  assert.equal(gate.map_enabled, false);
  assert.equal(gate.ranking_enabled, false);
});

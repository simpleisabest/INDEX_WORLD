import test from 'node:test';
import assert from 'node:assert/strict';
import { expansionCandidates } from '../lib/data/expansion-candidates.ts';
import { indicatorRegistry, connectedIndicatorSeries } from '../lib/data/catalog.ts';
import { blockedDataQueue, pipelineStages, validatePublication } from '../lib/data/publication.ts';

test('each connected adapter publishes exact verified observations with license and category', () => {
  for (const indicator of indicatorRegistry.filter(item => item.status === 'CONNECTED')) {
    const points = connectedIndicatorSeries(indicator.id);
    assert.equal(validatePublication(points), true);
    for (const point of points) {
      assert.equal(point.category_id, indicator.categoryId);
      assert.ok(point.license && point.license_url);
      assert.ok(point.ingested_at && point.version);
    }
  }
});

test('publication rejects tampered values, unknown licenses, bad geography and quality', () => {
  const point = connectedIndicatorSeries('population_total').at(-1);
  for (const change of [
    {value: point.value + 1}, {value: NaN}, {license: ''}, {license: 'invented'},
    {region_id: 'seoul'}, {reference_period: '2025-01'}, {version: 'new'},
    {source_url: 'https://example.org'}, {quality_status: 'PROVISIONAL'},
    {ingested_at: 'invalid'}, {category_id: 'economy-income'}, {unit: 'KRW'},
    {indicator_id: 'housing_stock'},
  ]) assert.throws(() => validatePublication([{...point, ...change}]));
  assert.throws(() => validatePublication([]));
  assert.throws(() => validatePublication([point, point]));
  assert.throws(() => validatePublication([point, connectedIndicatorSeries('population_change_annual').at(-1)]));
});

test('signed derived observations are real calculations and remain publishable', () => {
  for (const id of ['population_change_annual', 'population_change_rate_annual']) {
    const points = connectedIndicatorSeries(id);
    assert.ok(points.some(point => point.value < 0));
    assert.equal(validatePublication(points), true);
    assert.ok(points.every(point => point.derivation));
  }
});

test('every unconnected dataset remains queued and cannot supply numeric observations', () => {
  assert.deepEqual(pipelineStages, ['SOURCE','INGEST','NORMALIZE','VALIDATE','VERSION','QUALITY','PUBLISH']);
  const ids = indicatorRegistry.filter(item => item.status !== 'CONNECTED').map(item => item.id);
  assert.deepEqual(blockedDataQueue.map(item => item.indicator_id), ids);
  assert.equal(new Set(indicatorRegistry.map(item => item.id)).size, indicatorRegistry.length);
  for (const item of blockedDataQueue) {
    assert.ok(item.reason && item.next_action && item.source_url.startsWith('https://'));
    assert.deepEqual(connectedIndicatorSeries(item.indicator_id), []);
  }
});

// Local recovery acceptance: research targets must never become live datasets.
test('only four reviewed expansion candidates leave the blocked queue', () => {
  assert.equal(expansionCandidates.length, 26);
  const connected = expansionCandidates.filter(item => item.status === 'CONNECTED');
  assert.deepEqual(connected.map(item => item.id), ['gdp_per_capita_usd','consumer_price_inflation_wdi','unemployment_ilo_modelled','business_death_rate']);
  const blocked = expansionCandidates.filter(item => item.status === 'BLOCKED');
  assert.equal(blocked.length, 22);
  for (const candidate of blocked) {
    assert.deepEqual(candidate.capabilities, []);
    assert.deepEqual(connectedIndicatorSeries(candidate.id), []);
    assert.ok(blockedDataQueue.some(item => item.indicator_id === candidate.id));
  }
});

test('publication rejects every missing provenance field before display', () => {
  const point = connectedIndicatorSeries('population_total').at(-1);
  for (const key of ['source_id','source_org','source_url','dataset_name','license','license_url','version','ingested_at']) {
    assert.throws(() => validatePublication([{...point, [key]: ''}]), key);
  }
});

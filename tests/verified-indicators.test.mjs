import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { verifiedWdiRecords, reviewedWdiSeries } from '../lib/data/verified-wdi.ts';
import { indicatorRegistry, connectedIndicatorSeries } from '../lib/data/catalog.ts';
import { validatePublication } from '../lib/data/publication.ts';
import { indicatorArtifact, indicatorCompareModel, indicatorCsv, indicatorSelection, indicatorContentId } from '../lib/data/indicator-tools.ts';
import { buildShareUrl } from '../lib/share.ts';
import { compareObservations, comparisonCsv } from '../lib/data/compare.ts';
import { validateExport } from '../lib/export.ts';
import { verifiedRebRecords } from '../lib/data/verified-reb.ts';
import { verifyRebCsv } from '../scripts/verify-reb-csv.mjs';
import { verifyKosisCsv } from '../scripts/verify-kosis-csv.mjs';
import { verifiedDataRecords } from '../lib/data/verified-records.ts';
import { verifiedKosisRecords } from '../lib/data/verified-kosis.ts';

test('seven reviewed WDI series preserve every official value, raw hash, definition, license and national annual scope', () => {
  assert.equal(verifiedWdiRecords.length, 7);
  for (const record of verifiedWdiRecords) {
    assert.equal(createHash('sha256').update(record.raw_response).digest('hex'), record.raw_sha256);
    assert.equal(record.license, 'CC BY 4.0');
    assert.equal(record.license_evidence_url, ['life_expectancy','tertiary_attainment','electricity_consumption_per_capita'].includes(record.id) ? `https://databank.worldbank.org/metadataglossary/world-development-indicators/series/${record.code}` : record.source_url);
    assert.ok(record.license_checked_at && record.original_source && record.definition);
    assert.equal(record.cadence, 'annual');
    const [header, rows] = JSON.parse(record.raw_response);
    assert.equal(header.pages, 1);
    assert.equal(header.sourceid, '2');
    assert.equal(header.total, rows.length);
    const points = connectedIndicatorSeries(record.id);
    assert.equal(points.length, rows.filter(row => row.value !== null).length);
    for (const point of points) {
      const raw = rows.find(row => row.date === point.reference_period);
      assert.equal(raw.countryiso3code, 'KOR');
      assert.equal(raw.indicator.id, record.code);
      assert.equal(raw.obs_status, '');
      assert.equal(point.value, raw.value);
      assert.equal(point.region_id, 'kr');
      assert.equal(point.quality_status, 'VERIFIED');
      assert.equal(point.publication_date, null);
    }
    assert.equal(validatePublication(points), true);
  }
});

test('every new series rejects source, license, value and quality tampering before publication/export', () => {
  for (const record of verifiedDataRecords) {
    const point = connectedIndicatorSeries(record.id).at(-1);
    for (const change of [{value: point.value + 0.001}, {value: Infinity}, {unit: 'person'}, {license: 'unknown'}, {source_id: 'other'}, {source_url: ''}, {quality_status: 'PROVISIONAL'}, {region_id: 'seoul'}, {version: 'new'}]) {
      assert.throws(() => validatePublication([{...point, ...change}]), record.id);
      assert.throws(() => indicatorCsv([{...point, ...change}]), record.id);
    }
    const artifact = indicatorArtifact(record.id, record.dataset_name, point.reference_period);
    validateExport(artifact);
    assert.ok(artifact.csv.includes(record.code) && artifact.citation.includes(record.original_source));
    assert.throws(() => indicatorArtifact(record.id, 'bad period', '1900-not-a-period'));
  }
});

test('rate exports support signed test fixtures without inventing a negative official observation', () => {
  const points = connectedIndicatorSeries('consumer_price_inflation_wdi');
  const artifact = indicatorArtifact('consumer_price_inflation_wdi', 'Inflation', points.at(-1).reference_period);
  assert.equal(artifact.allowNegative, true);
  validateExport(artifact);
  // Synthetic export-only boundary fixture; never inserted into the source snapshot.
  const signedFixture = {...artifact, points: [{label: 'fixture', value: -1, display: '-1%'}]};
  validateExport(signedFixture);
  assert.throws(() => validateExport({...signedFixture, allowNegative: false}));
  assert.throws(() => validatePublication([{...points[0], value: -1}]));
  const model = indicatorCompareModel('consumer_price_inflation_wdi');
  const last = model.options.at(-1).observation;
  const baseline = model.options.at(-2).observation;
  const result = compareObservations('period', baseline, last);
  assert.equal(result.absolute, last.value - baseline.value);
  assert.ok(comparisonCsv(result).includes(String(baseline.value)));
  assert.deepEqual(reviewedWdiSeries('unreviewed'), []);
});

test('new share URLs restore exact indicator, year and comparison without accepting unverified selections', () => {
  for (const record of verifiedDataRecords) {
    const points = connectedIndicatorSeries(record.id);
    const state = {contentId: indicatorContentId(record.id), regionId: 'kr', referencePeriod: points[0].reference_period};
    const url = new URL(buildShareUrl('https://indexworld.app/?utm_source=old', state));
    assert.deepEqual(indicatorSelection(url.searchParams), {id: record.id, period: points[0].reference_period, compare: false});
    assert.equal(url.searchParams.has('utm_source'), false);
    url.searchParams.set('period', '9999');
    assert.equal(indicatorSelection(url.searchParams), null);
    const model = indicatorCompareModel(record.id);
    const shared = new URL(buildShareUrl('https://indexworld.app/', {contentId: model.contentId, regionId: 'kr', comparison: {dimension: 'period', baselineId: model.baselineId, targetId: model.targetId}}));
    assert.equal(indicatorSelection(shared.searchParams).compare, true);
    shared.searchParams.set('baseline', 'bad');
    assert.equal(indicatorSelection(shared.searchParams), null);
  }
  for (const id of ['household_credit', 'electricity_consumption']) {
    assert.equal(indicatorRegistry.find(item => item.id === id).status, 'BLOCKED');
    assert.deepEqual(connectedIndicatorSeries(id), []);
  }
});

test('KOSIS publishes official final national rates only, never provisional 2025 or inferred missing values', async () => {
  await verifyKosisCsv();
  for (const record of verifiedKosisRecords) {
    const points = connectedIndicatorSeries(record.id);
    assert.equal(points.length, 9);
    assert.equal(points.at(-1).reference_period, '2024');
    assert.equal(points.at(-1).value, record.id === 'business_birth_rate' ? 12.1 : 10.1);
    assert.ok(points.every(point => point.unit === 'percent' && point.derivation === null));
    validatePublication(points);
    assert.throws(() => validatePublication([{...points.at(-1), reference_period: '2025'}]));
    assert.throws(() => validatePublication([{...points.at(-1), quality_status: 'PROVISIONAL'}]));
    const model = indicatorCompareModel(record.id);
    assert.equal(model.baselineId, '2023');
    assert.equal(model.targetId, '2024');
    assert.ok(!model.options.some(option => option.id === '2025'));
  }
});

test('REB published national observations exactly match the licensed original CSV selection and hashes', async () => {
  await verifyRebCsv();
  for (const record of verifiedRebRecords) {
    const points = connectedIndicatorSeries(record.id);
    assert.equal(points.length, 10);
    assert.equal(points[0].reference_period, '2025-12');
    assert.equal(points.at(-1).reference_period, '2026-09');
    assert.equal(points.find(point => point.reference_period === '2026-06').value, 100);
    validatePublication(points);
    assert.equal(record.source_region_count, 236);
    assert.equal(record.cadence, 'monthly');
    const shared = new URL(buildShareUrl('https://indexworld.app/', {contentId: indicatorContentId(record.id), regionId: 'kr', referencePeriod: '2026-06'}));
    assert.equal(indicatorSelection(shared.searchParams).period, '2026-06');
    assert.throws(() => validatePublication([{...points[0], reference_period: '2026-13'}]));
    assert.throws(() => validatePublication([{...points[0], unit: 'KRW'}]));
    assert.throws(() => validatePublication([{...points[0], value: points[0].value + 0.01}]));
    assert.deepEqual(connectedIndicatorSeries('apartment_transaction_price'), []);
  }
});

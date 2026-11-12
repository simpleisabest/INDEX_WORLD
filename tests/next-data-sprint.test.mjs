import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { verifiedMolitRecords, reviewedMolitSeries } from '../lib/data/verified-molit.ts';
import { connectedIndicatorSeries, indicatorRegistry } from '../lib/data/catalog.ts';
import { validatePublication } from '../lib/data/publication.ts';
import { periodPositions } from '../lib/data/periods.ts';
import { indicatorArtifact, indicatorCsv } from '../lib/data/indicator-tools.ts';

test('MOLIT displayed values reproduce original XLSX cells and all original file hashes', async () => {
  assert.equal(verifiedMolitRecords.length, 5);
  execFileSync('python', ['scripts/verify-molit-xlsx.py'], { stdio: 'pipe' });
  for (const record of verifiedMolitRecords) {
    for (const file of record.raw_files) {
      assert.equal(createHash('sha256').update(await readFile(new URL('../' + file.raw_file, import.meta.url))).digest('hex'), file.raw_sha256);
    }
    const points = connectedIndicatorSeries(record.id);
    assert.equal(points.length, record.series.length);
    assert.equal(validatePublication(points), true);
    assert.ok(points.every(point => point.derivation === null && point.unit === 'dwelling'));
    for (const [period, value] of record.series) assert.equal(points.find(point => point.reference_period === period).value, value);
  }
});

test('annual housing publishes only the explicitly finalized 2014–2024 range', () => {
  for (const id of ['housing_permits','housing_starts','housing_completions']) {
    const points = connectedIndicatorSeries(id);
    assert.deepEqual(points.map(point => point.reference_period), Array.from({length:11}, (_, i) => String(2014+i)));
    for (const change of [{reference_period:'2025'}, {reference_period:'2026-09'}, {unit:'building'}, {quality_status:'PROVISIONAL'}]) {
      assert.throws(() => validatePublication([{...points.at(-1), ...change}]));
      assert.throws(() => indicatorCsv([{...points.at(-1), ...change}]));
    }
  }
});

test('MOLIT stock series preserve month identity and original proof, rejecting tampering and extrapolation', () => {
  const total = connectedIndicatorSeries('unsold_housing');
  const completed = connectedIndicatorSeries('unsold_completed_housing');
  assert.equal(total.length,33); assert.equal(completed.length,3);
  assert.equal(total.at(-1).value,65941); assert.equal(completed.at(-1).value,27549);
  for (const point of completed) assert.ok(point.value <= total.find(item=>item.reference_period===point.reference_period).value);
  for (const record of verifiedMolitRecords) {
    const original = record.series[0][1];
    try { record.series[0][1] = original + 1; assert.throws(()=>reviewedMolitSeries(record.id)); }
    finally { record.series[0][1] = original; }
    assert.throws(()=>validatePublication([{...connectedIndicatorSeries(record.id).at(-1),reference_period:'2026-10'}]));
  }
  assert.deepEqual(reviewedMolitSeries('unreviewed-housing'),[]);
});

test('irregular annual education observations retain actual elapsed time in screen and PNG artifacts', () => {
  assert.deepEqual(periodPositions(['2010','2012','2020']),[0,.2,1]);
  assert.deepEqual(periodPositions(['2024-11','2024-12','2025-01']),[0,.5,1]);
  for (const periods of [[],['2025','2024'],['2025','2025'],['2025-13']]) assert.throws(()=>periodPositions(periods));
  const points = connectedIndicatorSeries('tertiary_attainment');
  assert.ok(points.some((point,index)=>index>0 && Number(point.reference_period)-Number(points[index-1].reference_period)>1));
  const artifact = indicatorArtifact('tertiary_attainment','Education',points.at(-1).reference_period);
  assert.deepEqual(artifact.points.map(point=>point.position),periodPositions(points.map(point=>point.reference_period)));
  assert.equal(artifact.rows.length,points.length);
});

test('per-capita electricity and Korea-only PPP never unlock total electricity or country rankings', () => {
  const perCapita = indicatorRegistry.find(item=>item.id==='electricity_consumption_per_capita');
  assert.equal(perCapita.unit,'kWh/person');
  assert.equal(indicatorRegistry.find(item=>item.id==='electricity_consumption').status,'BLOCKED');
  assert.deepEqual(connectedIndicatorSeries('electricity_consumption'),[]);
  assert.equal(indicatorRegistry.find(item=>item.id==='world_population').status,'BLOCKED');
  assert.equal(indicatorRegistry.find(item=>item.id==='world_gdp_ppp').capabilities.includes('ranking'),false);
  assert.ok(connectedIndicatorSeries('world_gdp_ppp').every(point=>point.country_id==='kr'&&point.region_id==='kr'));
});

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

test('irregular annual observations retain actual elapsed time without fabricating missing years', async () => {
  assert.deepEqual(periodPositions(['2010','2012','2020']),[0,.2,1]);
  assert.deepEqual(periodPositions(['2024-11','2024-12','2025-01']),[0,.5,1]);
  for (const periods of [[],['2025','2024'],['2025','2025'],['2025-13']]) assert.throws(()=>periodPositions(periods));
  const quarantined = JSON.parse(await readFile(new URL('../docs/data-sources/quarantined-tertiary-attainment-2026-11-12.json',import.meta.url),'utf8'));
  const periods = quarantined.retained_record.series.map(([period])=>period);
  assert.ok(periods.some((period,index)=>index>0 && Number(period)-Number(periods[index-1])>1));
  const positions = periodPositions(periods);
  assert.equal(positions[0],0); assert.equal(positions.at(-1),1);
  const points = connectedIndicatorSeries('life_expectancy');
  const artifact = indicatorArtifact('life_expectancy','Life expectancy',points.at(-1).reference_period);
  assert.deepEqual(artifact.points.map(point=>point.position),periodPositions(points.map(point=>point.reference_period)));
  assert.equal(artifact.rows.length,points.length);
});

test('education with repeated failed live-source checks stays quarantined and cannot display or export', async () => {
  const quarantine = JSON.parse(await readFile(new URL('../docs/data-sources/quarantined-tertiary-attainment-2026-11-12.json',import.meta.url),'utf8'));
  assert.equal(quarantine.publication_allowed,false);
  assert.equal(quarantine.status,'BLOCKED');
  assert.equal(quarantine.retained_record.series.length,27);
  assert.equal(createHash('sha256').update(quarantine.retained_record.raw_response).digest('hex'),quarantine.retained_record.raw_sha256);
  assert.equal(indicatorRegistry.find(item=>item.id==='tertiary_attainment').status,'BLOCKED');
  assert.deepEqual(connectedIndicatorSeries('tertiary_attainment'),[]);
  assert.throws(()=>indicatorArtifact('tertiary_attainment','Education','2024'));
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

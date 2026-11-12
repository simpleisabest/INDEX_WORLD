import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { writeFile, readFile } from 'node:fs/promises';

const specs = [
  { id: 'gdp_per_capita_usd', code: 'NY.GDP.PCAP.CD', category: 'economy-income', unit: 'current USD/person' },
  { id: 'consumer_price_inflation_wdi', code: 'FP.CPI.TOTL.ZG', category: 'economy-income', unit: 'percent' },
  { id: 'unemployment_ilo_modelled', code: 'SL.UEM.TOTL.ZS', category: 'jobs-employment', unit: 'percent' },
  { id: 'life_expectancy', code: 'SP.DYN.LE00.IN', category: 'health-medical', unit: 'year' },
  { id: 'world_gdp_ppp', code: 'NY.GDP.PCAP.PP.CD', category: 'country-world', unit: 'current international dollar/person' },
  { id: 'tertiary_attainment', code: 'SE.TER.CUAT.ST.ZS', category: 'education', unit: 'percent' },
  { id: 'electricity_consumption_per_capita', code: 'EG.USE.ELEC.KH.PC', category: 'environment-energy', unit: 'kWh/person' },
];

async function request(url, json = true) {
  let last;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await fetch(url, { headers: { Accept: json ? 'application/json' : 'text/html' }, signal: AbortSignal.timeout(30000) });
      assert.ok(response.ok, `${url}: HTTP ${response.status}`);
      const text = await response.text();
      assert.ok(text.length > 0, `${url}: empty response`);
      return { text, value: json ? JSON.parse(text) : text };
    } catch (error) { last = new Error(`${url}: ${error.message}`); }
  }
  throw last;
}

const target = new URL('../data/verified-wdi.json', import.meta.url);
if (process.argv.includes('--collect')) {
  const previous = JSON.parse(await readFile(target, 'utf8'));
  // A new sprint never silently refreshes already published observations.
  const pending = specs.filter(spec => !previous.records.some(record => record.id === spec.id));
  const results = await Promise.allSettled(pending.map(async spec => {
    const apiUrl = `https://api.worldbank.org/v2/country/KOR/indicator/${spec.code}?format=json&per_page=1000`;
    const metadataUrl = `https://api.worldbank.org/v2/indicator/${spec.code}?format=json`;
    const sourceUrl = `https://data.worldbank.org/indicator/${spec.code}?locations=KR`;
    const licenseEvidenceUrl = !['gdp_per_capita_usd', 'consumer_price_inflation_wdi', 'unemployment_ilo_modelled', 'world_gdp_ppp'].includes(spec.id)
      ? `https://databank.worldbank.org/metadataglossary/world-development-indicators/series/${spec.code}`
      : sourceUrl;
    const [data, metadata, license] = await Promise.all([request(apiUrl), request(metadataUrl), request(licenseEvidenceUrl, false)]);
    assert.ok(/CC BY(?:-|\s)*4\.0/.test(license.text), `${spec.code}: explicit indicator license absent`);
    const [header, rows] = data.value;
    assert.equal(header.pages, 1, 'Incomplete paginated series');
    assert.equal(String(header.sourceid), '2');
    assert.equal(rows.length, Number(header.total));
    const definition = metadata.value[1][0];
    assert.equal(definition.id, spec.code);
    assert.equal(String(definition.source.id), '2');
    const valid = rows.filter(row => row.value !== null);
    assert.ok(valid.length >= 3);
    for (const row of valid) {
      assert.equal(row.indicator.id, spec.code);
      assert.equal(row.countryiso3code, 'KOR');
      assert.match(row.date, /^\d{4}$/);
      assert.equal(row.obs_status, '', 'Provisional observations require review');
      assert.ok(Number.isFinite(row.value));
    }
    assert.equal(new Set(valid.map(row => row.date)).size, valid.length);
    return {
      ...spec, cadence: 'annual', country_id: 'kr', region_id: 'kr', quality_status: 'VERIFIED',
      license: 'CC BY 4.0', license_url: 'https://creativecommons.org/licenses/by/4.0/',
      license_evidence_url: licenseEvidenceUrl, license_checked_at: new Date().toISOString(),
      api_url: apiUrl, metadata_url: metadataUrl, source_url: sourceUrl,
      source_org: 'World Bank WDI', original_source: definition.sourceOrganization,
      definition: definition.sourceNote, dataset_name: definition.name,
      publication_date: null, source_last_updated: header.lastupdated,
      ingested_at: new Date().toISOString(), version: `wdi-${header.lastupdated}-${spec.code}`,
      raw_sha256: createHash('sha256').update(data.text).digest('hex'),
      raw_response: data.text, metadata: definition,
      series: valid.map(row => [row.date, row.value]).sort((a, b) => Number(a[0]) - Number(b[0])),
    };
  }));
  const added = results.flatMap((result, index) => {
    if (result.status === 'fulfilled') return [result.value];
    console.error(`BLOCKED: ${pending[index].id}: ${result.reason.message}`);
    return [];
  });
  const records = [...previous.records, ...added];
  await writeFile(target, JSON.stringify({ schema_version: 1, records }, null, 2) + '\n');
  console.log(records.map(r => ({ id: r.id, periods: r.series.length, latest: r.series.at(-1), license: r.license })));
} else {
  // Read-only check: source revisions never silently overwrite a reviewed snapshot.
  const snapshot = JSON.parse(await readFile(target, 'utf8'));
  for (const record of snapshot.records) {
    const { value: [header, rows] } = await request(record.api_url);
    assert.equal(header.pages, 1);
    assert.equal(rows.length, Number(header.total));
    const current = rows.filter(row => row.value !== null);
    assert.equal(current.length, record.series.length, `${record.id}: coverage changed`);
    for (const [period, value] of record.series) {
      const row = current.find(item => item.date === period);
      assert.equal(row?.countryiso3code, 'KOR');
      assert.equal(row?.indicator.id, record.code);
      assert.equal(row?.obs_status, '');
      assert.equal(row?.value, value, `${record.id}/${period}: official revision needs review`);
    }
    console.log(`Verified source PASS: ${record.id}, ${record.series.length} periods, latest ${record.series.at(-1)[0]}`);
  }
}

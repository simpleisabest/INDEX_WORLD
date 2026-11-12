import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import { parseCsv } from '../lib/csv.ts';
export { parseCsv } from '../lib/csv.ts';

export async function verifyRebCsv(online = false) {
  const snapshot = JSON.parse(await readFile(new URL('../data/verified-reb.json', import.meta.url), 'utf8'));
  for (const record of snapshot.records) {
    const raw = await readFile(new URL('../' + record.raw_file, import.meta.url));
    assert.equal(createHash('sha256').update(raw).digest('hex'), record.raw_sha256);
    const rows = parseCsv(new TextDecoder('euc-kr').decode(raw));
    assert.deepEqual(rows[0], record.csv_header);
    assert.deepEqual(rows.filter(row => row.slice(1, 5).join('|') === '전국|전국|전국|전국'), [record.csv_national_row]);
    assert.equal(record.source_region_count, rows.length - 2);
    assert.equal(record.license_evidence.license.name, '이용허락범위 제한 없음');
    for (const [index, [period, value]] of record.series.entries()) {
      const match = rows[0][index + 5].match(/^(\d{4})년 (\d{1,2})월$/);
      assert.equal(period, `${match[1]}-${match[2].padStart(2, '0')}`);
      assert.equal(value, Number(record.csv_national_row[index + 5]));
    }
    if (online) {
      const url = `https://www.reb.or.kr/r-one/openapi/SttsApiTblData.do?Type=json&STATBL_ID=${record.code}&DTACYCLE_CD=MM&CLS_ID=500001&ITM_ID=100001&START_WRTTIME=202512&END_WRTTIME=202609`;
      const response = await fetch(url, { signal: AbortSignal.timeout(20000) });
      assert.ok(response.ok);
      const payload = await response.json();
      const rows = payload.SttsApiTblData?.[1]?.row;
      assert.ok(rows?.length > 0, 'Public sample cross-check unavailable');
      // Supplementary cross-check only. Published data comes from the complete
      // public CSV selection, never by paginating around the sample restriction.
      for (const row of rows) {
        const period = row.WRTTIME_IDTFR_ID.slice(0, 4) + '-' + row.WRTTIME_IDTFR_ID.slice(4);
        assert.equal(row.STATBL_ID, record.code);
        assert.equal(row.CLS_NM, '전국');
        assert.equal(row.ITM_ID, 100001);
        assert.equal(Number(Number(row.DTA_VAL).toFixed(2)), new Map(record.series).get(period));
      }
    }
    console.log(`REB CSV verification PASS: ${record.id}, ${record.series.length} selected months; full selected national CSV preserved`);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) await verifyRebCsv(true);

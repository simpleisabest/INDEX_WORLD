import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import { parseCsv } from './verify-reb-csv.mjs';

export async function verifyKosisCsv() {
  const snapshot = JSON.parse(await readFile(new URL('../data/verified-kosis.json', import.meta.url), 'utf8'));
  for (const record of snapshot.records) {
    const raw = await readFile(new URL('../' + record.raw_file, import.meta.url));
    assert.equal(createHash('sha256').update(raw).digest('hex'), record.raw_sha256);
    const rows = parseCsv(new TextDecoder('euc-kr').decode(raw));
    assert.deepEqual(rows.slice(0, 2), record.csv_header);
    assert.deepEqual(rows.filter(row => row[0] === '전체'), [record.csv_national_row]);
    assert.equal(record.series.length, 9);
    for (const [index, [period, value]] of record.series.entries()) {
      const column = record.column_indices[index];
      assert.equal(period, String(2016 + index));
      assert.equal(rows[0][column], period, 'Provisional/annotated headers cannot be published as final');
      assert.equal(rows[1][column], record.item_label);
      assert.equal(Number(record.csv_national_row[column]), value);
      assert.ok(value >= 0 && value <= 100);
    }
    assert.ok(rows[0].some(header => header === '2025 p)'));
    assert.ok(record.series.every(([period]) => period !== '2025'));
    assert.equal(record.license_url, 'https://stat.kosis.kr/nsistN/kosisUseGuide.do');
    console.log(`KOSIS CSV verification PASS: ${record.id}, 9 final years; 2025 provisional values excluded`);
  }
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) await verifyKosisCsv();

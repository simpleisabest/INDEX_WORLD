import test from 'node:test';
import assert from 'node:assert/strict';
import { parseCsv } from '../lib/csv.ts';
import { attributedCsv } from '../lib/export.ts';

test('reviewed CSV parser preserves quoted commas, escaped quotes, CRLF/newlines, duplicates and leading zeros', () => {
  assert.deepEqual(parseCsv('year,year,note\r\n"0012","0020","한글, ""quoted""\r\nnext"\r\n'),[
    ['year','year','note'], ['0012','0020','한글, "quoted"\r\nnext'],
  ]);
  assert.deepEqual(parseCsv('\ufeffid,value\n01,0\n\n02,2\n'),[['id','value'],['01','0'],[''],['02','2']]);
});

test('CSV parser preserves a quoted empty last record but not a phantom record separator', () => {
  assert.deepEqual(parseCsv(''),[]);
  assert.deepEqual(parseCsv('""'),[['']]);
  assert.deepEqual(parseCsv('a\n""\n'),[['a'],['']]);
  assert.deepEqual(parseCsv('a,b,'),[['a','b','']]);
});

test('malformed quote boundaries fail before source validation or attributed export', () => {
  for (const csv of ['a,"unfinished','"a"invalid,b']) {
    assert.throws(()=>parseCsv(csv),/Invalid CSV/);
    assert.throws(()=>attributedCsv(csv,'https://indexworld.app/'),/Invalid CSV/);
  }
});

test('attributed CSV reuses the same parser and retains exact strings and selection URL', () => {
  const original='id,value,note\r\n"0001","36226.9663637512","one\ntwo, ""three"""\r\n';
  const url='https://indexworld.app/?content=indicator-gdp_per_capita_usd&period=2025';
  const rows=parseCsv(attributedCsv(original,url));
  assert.deepEqual(rows[0],['id','value','note','exported_by','index_world_url']);
  assert.deepEqual(rows[1],['0001','36226.9663637512','one\ntwo, "three"','INDEX WORLD',url]);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { compareObservations, comparisonCsv, resolveComparisonIds } from '../lib/data/compare.ts';
import { buildShareUrl, createShareEvent } from '../lib/share.ts';
const data=JSON.parse(await readFile(new URL('../data/population/korea-total.json',import.meta.url),'utf8'));
const point=(year)=>({country_id:data.country_id,region_id:data.region_id,indicator_id:data.indicator_id,reference_period:String(year),value:data.series.find(([period])=>period===year)[1],unit:data.unit,quality_status:data.quality_status,...data.source,publication_date:data.publication_date,ingested_at:data.ingested_at,version:data.version});
const baseline=point(2024),target=point(2025);
test('comparison preserves official values and uses the selected baseline denominator',()=>{
 const r=compareObservations('period',baseline,target);
 assert.equal(r.baseline.value,51751065);assert.equal(r.target.value,51684564);
 assert.equal(r.absolute,-66501);assert.equal(r.percent,-66501/51751065*100);
 const reverse=compareObservations('period',target,baseline);
 assert.equal(reverse.absolute,66501);assert.equal(reverse.percent,66501/51684564*100);
 const distant=compareObservations('period',point(1960),target);
 assert.equal(distant.absolute,26672190);assert.equal(distant.percent,26672190/25012374*100);
 const same=compareObservations('period',target,target);assert.equal(same.absolute,0);assert.equal(same.percent,0);
});
test('unverified, missing, incompatible and zero-baseline values cannot produce misleading percentages',()=>{
 for(const quality of ['PENDING','PROVISIONAL','STALE','REVIEW_REQUIRED','SOURCE_ERROR'])assert.throws(()=>compareObservations('period',baseline,{...target,quality_status:quality}),/verified/);
 assert.throws(()=>compareObservations('period',baseline,{...target,value:NaN}),/verified/);
 assert.throws(()=>compareObservations('period',baseline,{...target,source_url:''}),/provenance/);
 assert.throws(()=>compareObservations('period',baseline,{...target,region_id:'unverified'}),/geography/);
 for(const change of [{unit:'percent'},{indicator_id:'other'},{source_id:'other'},{version:'other'}]) {
  const r=compareObservations('period',baseline,{...target,...change});assert.equal(r.comparable,false);assert.equal(r.absolute,null);assert.equal(r.percent,null);
 }
 const r=compareObservations('period',{...baseline,value:0},target);assert.equal(r.absolute,target.value);assert.equal(r.percent,null);
 assert.throws(()=>compareObservations('unknown',baseline,target),/Unsupported/);
});
test('future dimensions enforce geography and period consistency; no adapter data is invented',()=>{
 assert.throws(()=>compareObservations('region',baseline,target),/period/);
 assert.throws(()=>compareObservations('country',baseline,target),/period/);
 assert.throws(()=>compareObservations('indicator',baseline,target),/period/);
});
test('CSV includes both selected values, units, full provenance and explicit calculation',()=>{
 const csv=comparisonCsv(compareObservations('period',baseline,target));
 const rows=csv.trim().split('\r\n');assert.equal(rows.length,3);
 assert.ok(rows[1].includes('"baseline"'));assert.ok(rows[2].includes('"target"'));
 for(const row of rows.slice(1)){assert.ok(row.includes('"-66501"'));assert.ok(row.includes(data.source.license_url));assert.ok(row.includes(data.version));assert.ok(row.includes('not annualized'));assert.ok(row.includes('"VERIFIED"'));}
 const unavailable=comparisonCsv(compareObservations('period',{...baseline,value:0},target));assert.ok(!unavailable.includes('Infinity'));
});
test('shared compare state restores exact valid choices and clears compare parameters when sharing other blocks',()=>{
 const comparison={dimension:'period',baselineId:'1960',targetId:'2025'};
 const state={contentId:'population-compare',regionId:'kr',comparison};
 const url=new URL(buildShareUrl('https://example.org/INDEX_WORLD/?utm_source=other&baseline=bad&period=1990#map',state));
 assert.equal(url.searchParams.get('baseline'),'1960');assert.equal(url.searchParams.get('target'),'2025');assert.equal(url.searchParams.get('compare'),'period');assert.equal(url.searchParams.has('period'),false);assert.equal(url.searchParams.has('utm_source'),false);
 assert.deepEqual(createShareEvent(state,'clipboard').comparison,comparison);
 const other=new URL(buildShareUrl(url.toString(),{contentId:'population-timeseries',regionId:'kr',referencePeriod:'2024'}));
 assert.equal(other.searchParams.has('baseline'),false);assert.equal(other.searchParams.has('target'),false);assert.equal(other.searchParams.has('compare'),false);
 const options=[{id:'1960'},{id:'2025'}];assert.deepEqual(resolveComparisonIds(options,'1960','2025'),{baselineId:'1960',targetId:'2025'});
 assert.equal(resolveComparisonIds(options,'1900','2025'),null);assert.equal(resolveComparisonIds(options,null,'2025'),null);
});
test('all 13 dictionaries explicitly translate every Compare key',async()=>{
 const en=await readFile(new URL('../lib/i18n/dictionaries/en.ts',import.meta.url),'utf8');
 const keys=[...en.matchAll(/"(compare\.[^"]+)"\s*:/g)].map(m=>m[1]);assert.equal(keys.length,32);
 for(const locale of ['en','ko','ja','es','pt','de','fr','zh-CN','zh-TW','hi','id','it','vi']){
  const dictionary=await readFile(new URL(`../lib/i18n/dictionaries/${locale}.ts`,import.meta.url),'utf8');
  for(const key of keys)assert.ok(dictionary.includes(JSON.stringify(key)+':'),`${locale}: ${key}`);
 }
});

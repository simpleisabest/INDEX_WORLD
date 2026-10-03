import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {validateExport,exportTable,exportPrintHtml,attributedCsv} from '../lib/export.ts';
import {buildShareUrl} from '../lib/share.ts';
const data=JSON.parse(await readFile(new URL('../data/population/korea-total.json',import.meta.url),'utf8'));
const artifact={title:'Population <script>',subtitle:'2024 → 2025',headers:['Year','People'],rows:data.series.slice(-2),points:data.series.slice(-2).map(([year,value])=>({label:String(year),value,display:String(value)})),chart:'bars',citation:`World Bank ${data.source.source_id} ${data.source.source_url}`,source:'World Bank',sourceUrl:data.source.source_url,license:data.source.license,licenseUrl:data.source.license_url,metadata:data.version,quality:'VERIFIED',csv:'"year","value"\r\n"2025","51684564"\r\n',filename:'population'};
test('export blocks unverified or invalid values and missing attribution',()=>{
 validateExport(artifact);
 for(const quality of ['BLOCKED','PENDING','STALE','PROVISIONAL'])assert.throws(()=>validateExport({...artifact,quality}));
 assert.throws(()=>validateExport({...artifact,points:[{value:NaN}]}));
 assert.throws(()=>validateExport({...artifact,sourceUrl:''}));
});
test('copy and print contain actual values and attribution; print escapes markup',()=>{
 const text=exportTable(artifact,'https://example.org/?baseline=2024&target=2025');assert.ok(text.includes('51684564'));assert.ok(text.includes('INDEX WORLD'));assert.ok(text.includes(data.source.source_url));
 const html=exportPrintHtml(artifact,'https://example.org/?a=1&b=2','data:image/png;base64,AA==','ko');assert.ok(html.includes('lang="ko"'));assert.ok(html.includes('51684564'));assert.ok(html.includes('&lt;script&gt;'));assert.ok(!html.includes('<script>'));assert.ok(html.includes(data.source.license_url));assert.ok(html.includes('a=1&amp;b=2'));
});
test('CSV keeps quoted fields/newlines and attaches INDEX WORLD plus exact selection URL',()=>{
 const csv=attributedCsv('"name","value"\r\n"A, ""B""\nC","1"\r\n','https://example.org/?start=2024&end=2025');
 assert.ok(csv.includes('"A, ""B""\nC","1","INDEX WORLD"'));assert.ok(csv.includes('"exported_by","index_world_url"'));assert.ok(csv.includes('start=2024&end=2025'));
});
test('time-series export links retain range and selected year; other blocks clear range',()=>{
 const url=buildShareUrl('https://example.org/',{contentId:'population-timeseries',regionId:'kr',referencePeriod:'2024',timeRange:{start:2020,end:2025}});
 const parsed=new URL(url);assert.equal(parsed.searchParams.get('start'),'2020');assert.equal(parsed.searchParams.get('end'),'2025');assert.equal(parsed.searchParams.get('period'),'2024');
 const other=new URL(buildShareUrl(url,{contentId:'population-compare',regionId:'kr',comparison:{dimension:'period',baselineId:'2024',targetId:'2025'}}));assert.equal(other.searchParams.has('start'),false);assert.equal(other.searchParams.has('end'),false);
});
test('export controls have explicit copy in all 13 dictionaries',async()=>{
 for(const locale of ['en','ko','ja','es','pt','de','fr','zh-CN','zh-TW','hi','id','it','vi']){
  const text=await readFile(new URL(`../lib/i18n/dictionaries/${locale}.ts`,import.meta.url),'utf8');
  for(const key of ['menu','png','print','table','citation','csv','card','done','failed','axis'])assert.ok(text.includes(`"export.${key}":`),`${locale}/${key}`);
 }
});

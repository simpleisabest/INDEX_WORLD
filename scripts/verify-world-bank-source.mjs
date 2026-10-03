import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const dataset = JSON.parse(await readFile(new URL("../data/population/korea-total.json", import.meta.url), "utf8"));
const response = await fetch(dataset.source.api_url, { headers: { Accept: "application/json" } });
assert.ok(response.ok, `Source failure: World Bank API returned ${response.status}`);
const payload = await response.json();
assert.ok(Array.isArray(payload) && Array.isArray(payload[1]), "Source failure: unexpected API response");
const official = new Map(payload[1].filter((row) => row.value !== null).map((row) => [Number(row.date), Number(row.value)]));
for (const [period, value] of dataset.series) {
  assert.equal(official.get(period), value, `Official source mismatch: ${period}`);
}
const latest = dataset.series.at(-1)[0];
assert.equal(Math.max(...official.keys()), latest, `Static dataset is stale: official latest is ${Math.max(...official.keys())}`);
console.log(`World Bank source verification PASS: KOR/SP.POP.TOTL through ${latest}`);

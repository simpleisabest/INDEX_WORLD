import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const dataset = JSON.parse(await readFile(new URL("../data/population/korea-total.json", import.meta.url), "utf8"));
const required = ["country_id", "region_id", "indicator_id", "unit", "source", "ingested_at", "version", "quality_status", "series"];
for (const field of required) assert.ok(dataset[field] !== undefined && dataset[field] !== null, `NULL: ${field}`);
assert.equal(dataset.country_id, "kr", "Invalid country");
assert.equal(dataset.region_id, "kr", "Invalid region");
assert.equal(dataset.indicator_id, "population_total", "Invalid indicator");
assert.equal(dataset.unit, "person", "Unit mismatch");
assert.ok(["VERIFIED", "PROVISIONAL", "STALE", "REVIEW_REQUIRED", "SOURCE_ERROR"].includes(dataset.quality_status), "Invalid quality");

const periods = new Set();
let previous;
for (const [period, value] of dataset.series) {
  assert.ok(Number.isInteger(period) && period >= 1900 && period <= 2100, `Invalid period: ${period}`);
  assert.ok(!periods.has(period), `Duplicate period: ${period}`);
  periods.add(period);
  assert.ok(Number.isFinite(value), `Invalid number: ${period}`);
  assert.ok(value >= 0, `Negative population: ${period}`);
  if (previous) {
    const change = Math.abs(value - previous.value) / previous.value;
    assert.ok(change < 0.2, `Abnormal change: ${previous.period}-${period}`);
    assert.equal(period, previous.period + 1, `Missing period after ${previous.period}`);
  }
  previous = { period, value };
}
assert.ok(dataset.series.length >= 50, "Time coverage is too short");
assert.equal(dataset.quality_status, "VERIFIED", "Dataset is not publishable");
console.log(`Population validation PASS: ${dataset.series.length} observations (${dataset.series[0][0]}-${dataset.series.at(-1)[0]})`);

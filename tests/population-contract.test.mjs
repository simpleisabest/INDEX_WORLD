import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const dataset = JSON.parse(await readFile(new URL("../data/population/korea-total.json", import.meta.url), "utf8"));

test("population connector contract has stable identities and provenance", () => {
  assert.equal(dataset.country_id, "kr");
  assert.equal(dataset.region_id, "kr");
  assert.equal(dataset.indicator_id, "population_total");
  assert.equal(dataset.unit, "person");
  for (const key of ["source_org", "dataset_name", "source_id", "source_url", "license", "update_frequency"]) assert.ok(dataset.source[key]);
});

test("population series is unique, annual, numeric, and non-negative", () => {
  const periods = dataset.series.map(([period]) => period);
  assert.equal(new Set(periods).size, periods.length);
  dataset.series.forEach(([period, value], index) => {
    assert.ok(Number.isInteger(period));
    assert.ok(Number.isFinite(value) && value >= 0);
    if (index) assert.equal(period, dataset.series[index - 1][0] + 1);
  });
});

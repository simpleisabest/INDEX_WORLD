import Papa from "papaparse";

// One reviewed CSV parser for source validation and browser export attribution.
// Keep strings (including leading zeros), duplicate headers and interior blank
// rows intact. No URL downloads, workers, header objects or dynamic typing.
export function parseCsv(csv: string): string[][] {
  if (!csv) return [];
  const result = Papa.parse<string[]>(csv, {
    delimiter: ",", header: false, dynamicTyping: false, skipEmptyLines: false,
    download: false, worker: false, comments: false,
  });
  if (result.errors.length) throw new Error(`Invalid CSV: ${result.errors.map(error => error.code).join(", ")}`);
  const rows = result.data;
  // Match the existing RFC 4180 file contract: a final record separator does
  // not add a new observation. A quoted empty final record is preserved.
  if (/[\r\n]$/.test(csv) && rows.at(-1)?.length === 1 && rows.at(-1)![0] === "") rows.pop();
  return rows;
}

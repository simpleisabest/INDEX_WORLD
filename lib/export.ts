import { parseCsv } from "./csv.ts";

export type ExportArtifact = {
  title: string;
  subtitle: string;
  headers: string[];
  rows: (string | number)[][];
  points: { label: string; value: number; display: string; position?: number }[];
  chart: "line" | "bars";
  citation: string;
  source: string;
  sourceUrl: string;
  license: string;
  licenseUrl: string;
  metadata: string;
  quality: string;
  csv: string;
  filename: string;
  allowNegative?: boolean;
};

export function validateExport(artifact: ExportArtifact) {
  if (artifact.quality !== "VERIFIED" || !artifact.points.length || artifact.points.some(p => !Number.isFinite(p.value) || (!artifact.allowNegative && p.value < 0))) throw new Error("Export requires verified data");
  if (![artifact.source, artifact.sourceUrl, artifact.license, artifact.licenseUrl, artifact.citation].every(Boolean)) throw new Error("Export requires provenance");
  if (artifact.points.some(point => point.position !== undefined && (!Number.isFinite(point.position) || point.position < 0 || point.position > 1))) throw new Error("Invalid chart position");
}

export function escapeHtml(value: string | number) {
  return String(value).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

export function exportTable(artifact: ExportArtifact, url: string) {
  validateExport(artifact);
  return [artifact.title, artifact.subtitle, artifact.headers.join("\t"), ...artifact.rows.map(row => row.join("\t")), artifact.metadata, artifact.citation, `INDEX WORLD · ${url}`].join("\n");
}

export function exportPrintHtml(artifact: ExportArtifact, url: string, chartUrl: string, language: string) {
  validateExport(artifact);
  const e = escapeHtml;
  return `<!doctype html><html lang="${e(language)}"><head><meta charset="utf-8"><title>${e(artifact.title)}</title><style>body{font:14px system-ui,sans-serif;color:#152019;margin:24px}h1{font-size:24px}img{width:100%;max-height:400px;object-fit:contain}table{width:100%;border-collapse:collapse}th,td{padding:8px;border-bottom:1px solid #ccc;text-align:left}thead{display:table-header-group}tr{break-inside:avoid}footer,p{overflow-wrap:anywhere;line-height:1.6}footer{font-size:11px;margin-top:24px}@page{margin:15mm}</style></head><body><strong>INDEX WORLD</strong><h1>${e(artifact.title)}</h1><p>${e(artifact.subtitle)}</p><img src="${e(chartUrl)}" alt="${e(artifact.title)}"><table><thead><tr>${artifact.headers.map(h => `<th scope="col">${e(h)}</th>`).join("")}</tr></thead><tbody>${artifact.rows.map(row => `<tr>${row.map(v => `<td>${e(v)}</td>`).join("")}</tr>`).join("")}</tbody></table><footer><p>${e(artifact.metadata)}</p><p>${e(artifact.citation)}</p><p>INDEX WORLD · <a href="${e(url)}">${e(url)}</a></p><p><a href="${e(artifact.sourceUrl)}">${e(artifact.source)}</a> · <a href="${e(artifact.licenseUrl)}">${e(artifact.license)}</a></p></footer></body></html>`;
}

// Parse generated RFC 4180 CSV so quoted commas and embedded newlines stay intact.
export function attributedCsv(csv: string, url: string) {
  const rows = parseCsv(csv);
  return rows.map((r, index) => [...r, ...(index ? ["INDEX WORLD", url] : ["exported_by", "index_world_url"])].map(v => `"${v.replaceAll('"', '""')}"`).join(",")).join("\r\n") + "\r\n";
}

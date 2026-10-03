import { validateExport, type ExportArtifact } from "./export";

export async function copyExportText(text: string) {
  if (navigator.clipboard?.writeText) { await navigator.clipboard.writeText(text); return; }
  const input = document.createElement("textarea"); input.value = text; input.style.position = "fixed"; input.style.opacity = "0";
  const focused = document.activeElement as HTMLElement | null;
  document.body.append(input); input.select();
  try { if (!document.execCommand("copy")) throw new Error("Clipboard unavailable"); } finally { input.remove(); focused?.focus(); }
}

export function saveExport(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob); const link = document.createElement("a"); link.href = url; link.download = filename;
  document.body.append(link); link.click(); link.remove(); window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function exportCanvas(artifact: ExportArtifact, url: string, card: boolean, locale: string) {
  validateExport(artifact); await document.fonts.ready;
  const canvas = document.createElement("canvas"); canvas.width = 1200; canvas.height = 1200;
  const ctx = canvas.getContext("2d"); if (!ctx) throw new Error("Canvas unavailable");
  ctx.fillStyle = "#f4f3ee"; ctx.fillRect(0, 0, canvas.width, canvas.height);
  const text = (value: string, x: number, y: number, size = 24, color = "#152019") => { ctx.font = `${size}px system-ui,sans-serif`; ctx.fillStyle = color; ctx.fillText(value, x, y); };
  const wrap = (value: string, y: number, size = 20, width = 1088) => {
    ctx.font = `${size}px system-ui,sans-serif`; let line = "";
    for (const { segment } of new Intl.Segmenter(locale, { granularity: "word" }).segment(value.replaceAll("\n", " "))) {
      if (ctx.measureText(line + segment).width > width && line.trim()) { text(line.trimEnd(), 56, y, size); y += size + 9; line = ""; }
      if (ctx.measureText(segment).width > width) {
        for (const { segment: character } of new Intl.Segmenter(locale, { granularity: "grapheme" }).segment(segment)) {
          if (ctx.measureText(line + character).width > width) { text(line, 56, y, size); y += size + 9; line = ""; }
          line += character;
        }
      } else line += segment;
    }
    text(line, 56, y, size); return y + size + 12;
  };
  text("INDEX WORLD", 56, 68, 28); let y = wrap(artifact.title, 132, 36); y = wrap(artifact.subtitle, y + 4, 22);
  const plotTop = y + 30, plotBottom = plotTop + (card ? 380 : 300), left = 160, right = 1120;
  const values = artifact.points.map(p => p.value); const max = Math.max(...values); const min = artifact.chart === "bars" ? 0 : Math.min(...values); const spread = Math.max(max - min, 1);
  ctx.strokeStyle = "#c9cec6"; ctx.lineWidth = 1;
  for (const step of [0, .5, 1]) { const axisY = plotTop + step * (plotBottom - plotTop); ctx.beginPath();ctx.moveTo(left, axisY);ctx.lineTo(right, axisY);ctx.stroke(); text(new Intl.NumberFormat(locale).format(Math.round(max - spread * step)), 56, axisY + 6, 16); }
  if (artifact.chart === "line") {
    ctx.strokeStyle = "#152019"; ctx.lineWidth = 4; ctx.beginPath();
    artifact.points.forEach((p, index) => { const x = left + index / Math.max(values.length - 1, 1) * (right - left), py = plotTop + (max - p.value) / spread * (plotBottom - plotTop); if (index) ctx.lineTo(x, py); else ctx.moveTo(x, py); }); ctx.stroke();
    artifact.points.forEach((p, index) => { const x = left + index / Math.max(values.length - 1, 1) * (right - left), py = plotTop + (max - p.value) / spread * (plotBottom - plotTop); ctx.fillStyle = "#152019";ctx.beginPath();ctx.arc(x,py,4,0,Math.PI*2);ctx.fill(); });
    text(artifact.points[0].label, left, plotBottom + 30, 18); text(artifact.points.at(-1)!.label, right - 65, plotBottom + 30, 18);
  } else {
    artifact.points.forEach((p, index) => { const x = left + 160 + index * 390, barHeight = max ? p.value / max * (plotBottom - plotTop) : 0; ctx.fillStyle = index ? "#c9f343" : "#152019";ctx.fillRect(x,plotBottom - barHeight,170,barHeight);text(p.label,x,plotBottom + 30,22);text(p.display,x - 25,plotBottom - barHeight - 18,20); });
  }
  y = wrap(artifact.metadata, plotBottom + 80, 19);
  y = wrap(`${artifact.source} · ${artifact.license}`, y, 18);
  y = wrap(artifact.sourceUrl, y, 16);
  y = wrap(artifact.licenseUrl, y, 16);
  wrap(`INDEX WORLD · ${url}`, y + 10, 16);
  return canvas;
}

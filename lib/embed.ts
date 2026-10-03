import { escapeHtml } from "./export.ts";

export function embedCode(originalUrl: string, title: string, source: string, sourceUrl: string) {
  const url = new URL(originalUrl); url.hash = ""; url.pathname = url.pathname.replace(/\/?$/, "/") + "embed/";
  return `<iframe src="${escapeHtml(url.toString())}" title="${escapeHtml(title)}" width="100%" height="900" loading="lazy" referrerpolicy="no-referrer" sandbox="allow-scripts allow-same-origin" style="border:0"></iframe>\n<p>INDEX WORLD · <a href="${escapeHtml(originalUrl)}">${escapeHtml(title)}</a> · <a href="${escapeHtml(sourceUrl)}">${escapeHtml(source)}</a></p>`;
}

export function validatedEmbedSelection(params: URLSearchParams, years: string[]) {
  if(params.get("region")!=="kr")return null;
  if(params.get("content")==="population-compare"&&params.get("compare")==="period"&&years.includes(params.get("baseline")??"")&&years.includes(params.get("target")??"")) return "compare";
  const period=params.get("period"),start=params.get("start"),end=params.get("end");
  if(params.get("content")==="population-timeseries"&&period&&start&&end&&years.includes(period)&&years.includes(start)&&years.includes(end)&&Number(start)<=Number(period)&&Number(period)<=Number(end))return "series";
  return null;
}

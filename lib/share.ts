export function originalResultUrl(baseUrl: string, origin = process.env.NEXT_PUBLIC_SITE_ORIGIN) {
  const url = new URL(baseUrl);
  if (origin) {
    const canonical = new URL(origin);
    url.protocol = canonical.protocol;
    url.hostname = canonical.hostname;
    url.port = canonical.port;
    url.pathname = "/";
  } else url.pathname = url.pathname.replace(/embed\/?$/, "");
  url.hash = "";
  return url;
}

export type ShareChannel = "web-share" | "clipboard" | "unknown";

export type ShareState = {
  contentId: string;
  regionId?: string;
  referencePeriod?: string;
  timeRange?: { start: number; end: number };
  comparison?: { dimension: "period" | "region" | "country" | "indicator"; baselineId: string; targetId: string };
};

export type ShareEventContract = {
  share_id: string;
  content_id: string;
  channel: ShareChannel;
  created_at: string;
  region_id?: string;
  reference_period?: string;
  comparison?: ShareState["comparison"];
};

const trackingKeys = ["share_id", "ref", "utm_source", "utm_medium", "utm_campaign"];

export function buildShareUrl(baseUrl: string, state: ShareState) {
  const url = originalResultUrl(baseUrl);
  trackingKeys.forEach((key) => url.searchParams.delete(key));
  url.hash = "";
  url.pathname = url.pathname.replace(/embed\/?$/, "");
  url.searchParams.set("content", state.contentId);
  if (state.regionId) url.searchParams.set("region", state.regionId);
  else url.searchParams.delete("region");
  if (state.referencePeriod) url.searchParams.set("period", state.referencePeriod);
  else url.searchParams.delete("period");
  for (const key of ["compare", "baseline", "target", "start", "end"]) url.searchParams.delete(key);
  if (state.comparison) {
    url.searchParams.set("compare", state.comparison.dimension);
    url.searchParams.set("baseline", state.comparison.baselineId);
    url.searchParams.set("target", state.comparison.targetId);
  }
  if (state.timeRange) { url.searchParams.set("start", String(state.timeRange.start)); url.searchParams.set("end", String(state.timeRange.end)); }
  return url.toString();
}

export function createShareEvent(state: ShareState, channel: ShareChannel): ShareEventContract {
  return {
    share_id: globalThis.crypto?.randomUUID?.() ?? `share-${Date.now()}`,
    content_id: state.contentId,
    channel,
    created_at: new Date().toISOString(),
    ...(state.regionId ? { region_id: state.regionId } : {}),
    ...(state.referencePeriod ? { reference_period: state.referencePeriod } : {}),
    ...(state.comparison ? { comparison: state.comparison } : {}),
  };
}

export type ShareChannel = "web-share" | "clipboard" | "unknown";

export type ShareState = {
  contentId: string;
  regionId?: string;
  referencePeriod?: string;
};

export type ShareEventContract = {
  share_id: string;
  content_id: string;
  channel: ShareChannel;
  created_at: string;
  region_id?: string;
  reference_period?: string;
};

const trackingKeys = ["share_id", "ref", "utm_source", "utm_medium", "utm_campaign"];

export function buildShareUrl(baseUrl: string, state: ShareState) {
  const url = new URL(baseUrl);
  trackingKeys.forEach((key) => url.searchParams.delete(key));
  url.hash = "";
  url.searchParams.set("content", state.contentId);
  if (state.regionId) url.searchParams.set("region", state.regionId);
  else url.searchParams.delete("region");
  if (state.referencePeriod) url.searchParams.set("period", state.referencePeriod);
  else url.searchParams.delete("period");
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
  };
}

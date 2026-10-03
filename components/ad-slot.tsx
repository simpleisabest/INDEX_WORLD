export type AdPlacement = "after-search" | "after-map" | "before-related-data";
export type AdFormat = "leaderboard" | "responsive" | "adaptive-banner";

export type AdSlotProps = {
  id: string;
  placement: AdPlacement;
  format: AdFormat;
  responsive?: boolean;
  minHeight?: number;
  enabled?: boolean;
  collapseWhenEmpty?: boolean;
};

export function AdSlot({
  id,
  placement,
  format,
  responsive = true,
  minHeight = 0,
  enabled = false,
  collapseWhenEmpty = true,
}: AdSlotProps) {
  const isPreview = process.env.INDEX_PREVIEW === "true";
  const showDevelopmentMarker = isPreview && !enabled;

  if (!enabled && collapseWhenEmpty && !showDevelopmentMarker) {
    return null;
  }

  return (
    <aside
      className="ad-slot shell"
      data-ad-slot={id}
      data-placement={placement}
      data-format={format}
      data-responsive={responsive}
      style={minHeight > 0 ? { minHeight } : undefined}
      aria-label="향후 광고 배치 영역"
    >
      {showDevelopmentMarker && (
        <div>
          <span>AD SLOT {id}</span>
          <p>Future Ad Placement · Preview only</p>
        </div>
      )}
    </aside>
  );
}

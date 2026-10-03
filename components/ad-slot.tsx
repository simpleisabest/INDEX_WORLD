"use client";

import { useLocale } from "@/components/locale-provider";

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
  const { t } = useLocale();
  const isPreview = Boolean(process.env.NEXT_PUBLIC_BASE_PATH);
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
      aria-label={t("ad.aria")}
    >
      {showDevelopmentMarker && (
        <div>
          <span>AD SLOT {id}</span>
          <p>{t("ad.label")}</p>
        </div>
      )}
    </aside>
  );
}

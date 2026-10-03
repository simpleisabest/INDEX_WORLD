import {
  DataCategoryBlock,
  HeaderBlock,
  HeroBlock,
  PopularDataBlock,
  ShareBlock,
} from "@/components/blocks";
import { SearchBlock } from "@/components/search-block";
import { KPIBlock } from "@/components/kpi-block";
import { MapBlock } from "@/components/map-block";
import { AdSlot } from "@/components/ad-slot";
import { PopulationTimeSeriesBlock } from "@/components/population-timeseries-block";
import { CompareBlock } from "@/components/compare-block";

import { ContentAnchor } from "@/components/content-anchor";
import { DiscoveryBlock } from "@/components/discovery-block";

export default function Home() {
  return (
    <main>
      <ContentAnchor />
      <HeaderBlock />
      <HeroBlock />
      <SearchBlock />
      <AdSlot id="A" placement="after-search" format="responsive" />
      <DataCategoryBlock />
      <KPIBlock />
      <PopulationTimeSeriesBlock />
      <CompareBlock />
      <MapBlock />
      <AdSlot id="B" placement="after-map" format="responsive" />
      <PopularDataBlock />
      <AdSlot id="C" placement="before-related-data" format="adaptive-banner" />
      <DiscoveryBlock />
      <ShareBlock />
    </main>
  );
}

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

export default function Home() {
  return (
    <main>
      <HeaderBlock />
      <HeroBlock />
      <SearchBlock />
      <AdSlot id="A" placement="after-search" format="responsive" />
      <DataCategoryBlock />
      <KPIBlock />
      <MapBlock />
      <AdSlot id="B" placement="after-map" format="responsive" />
      <PopularDataBlock />
      <AdSlot id="C" placement="before-related-data" format="adaptive-banner" />
      <ShareBlock />
    </main>
  );
}

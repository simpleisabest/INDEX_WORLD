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

export default function Home() {
  return (
    <main>
      <HeaderBlock />
      <HeroBlock />
      <SearchBlock />
      <DataCategoryBlock />
      <KPIBlock />
      <MapBlock />
      <PopularDataBlock />
      <ShareBlock />
    </main>
  );
}

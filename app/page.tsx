import {
  DataCategoryBlock,
  HeaderBlock,
  HeroBlock,
  MapBlock,
  PopularDataBlock,
  ShareBlock,
} from "@/components/blocks";
import { SearchBlock } from "@/components/search-block";

export default function Home() {
  return (
    <main>
      <HeaderBlock />
      <HeroBlock />
      <SearchBlock />
      <DataCategoryBlock />
      <MapBlock />
      <PopularDataBlock />
      <ShareBlock />
    </main>
  );
}

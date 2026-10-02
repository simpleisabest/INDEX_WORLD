import {
  DataCategoryBlock,
  HeaderBlock,
  HeroBlock,
  MapBlock,
  PopularDataBlock,
  SearchBlock,
  ShareBlock,
} from "@/components/blocks";

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

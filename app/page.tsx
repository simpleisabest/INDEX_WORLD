import {
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
import { QuestionDeck } from "@/components/question-deck";
import { CategoryCatalog } from "@/components/category-catalog";
import { DataSnapshot } from "@/components/data-snapshot";
import { RankingFoundation } from "@/components/ranking-foundation";
import { latestPopulationObservation, populationObservations, populationSource } from "@/lib/data/population";

const structuredData = [
  { "@context":"https://schema.org", "@type":"WebSite", name:"INDEX WORLD", url:"https://indexworld.app/", description:"공식 데이터를 검색하고 비교하고 발견하는 글로벌 데이터 플랫폼", inLanguage:["ko","en","ja","es","pt","de","fr","zh-CN","zh-TW","hi","id","it","vi"] },
  { "@context":"https://schema.org", "@type":"Dataset", name:"Korea total population time series", description:"Annual total population of the Republic of Korea from World Development Indicators.", url:"https://indexworld.app/#population-timeseries", sameAs:populationSource.source_url, creator:{"@type":"Organization",name:populationSource.source_org}, license:populationSource.license_url, temporalCoverage:`${populationObservations[0].reference_period}/${latestPopulationObservation.reference_period}`, spatialCoverage:{"@type":"Place",name:"Korea, Rep."}, variableMeasured:"Total population (SP.POP.TOTL)" },
];

export default function Home() {
  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(structuredData).replace(/</g,"\\u003c")}} />
      <ContentAnchor />
      <HeaderBlock />
      <HeroBlock />
      <SearchBlock />
      <CategoryCatalog />
      <AdSlot id="A" placement="after-search" format="responsive" />
      <DataSnapshot />
      <QuestionDeck />
      <KPIBlock />
      <RankingFoundation />
      <CompareBlock />
      <PopulationTimeSeriesBlock />
      <MapBlock />
      <AdSlot id="B" placement="after-map" format="responsive" />
      <PopularDataBlock />
      <AdSlot id="C" placement="before-related-data" format="adaptive-banner" />
      <DiscoveryBlock />
      <ShareBlock />
    </main>
  );
}

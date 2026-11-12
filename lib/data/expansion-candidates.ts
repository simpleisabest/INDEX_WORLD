import type { CategoryId, IndicatorDefinition } from "./catalog.ts";
import { reviewedSprintSeries, verifiedDataRecords } from "./verified-records.ts";

// Research targets remain blocked unless an explicitly reviewed, frozen adapter exists.
type Candidate = [string, string, string, string, string, string];
const groups: [CategoryId, string, string, Candidate[]][] = [
  ["real-estate-housing", "Ministry of Land, Infrastructure and Transport", "https://www.data.go.kr/", [
    ["housing_permits", "Housing permits", "주택 인허가", "dwelling", "monthly", "region"],
  ]],
  ["economy-income", "World Bank WDI", "https://data.worldbank.org/", [
    ["gdp_per_capita_usd", "GDP per capita (current US$)", "1인당 GDP (당해년 US$)", "current USD/person", "annual", "country"],
    ["consumer_price_inflation_wdi", "Consumer price inflation (annual %)", "소비자물가 상승률 (연간 %)", "percent", "annual", "country"],
  ]],
  ["jobs-employment", "World Bank WDI / ILO", "https://data.worldbank.org/indicator/SL.UEM.TOTL.ZS", [
    ["unemployment_ilo_modelled", "Unemployment (modelled ILO estimate)", "실업률 (ILO 모형 추정치)", "percent", "annual", "country"],
  ]],
  ["business-startup", "Statistics Korea (KOSIS)", "https://kosis.kr/", [
    ["business_death_rate", "Enterprise death rate", "기업 소멸률", "percent", "annual", "mixed"],
  ]],
  ["finance-assets", "Bank of Korea ECOS", "https://ecos.bok.or.kr/", [
    ["base_interest_rate", "Base interest rate", "기준금리", "percent", "decision date", "country"],
    ["household_credit", "Household credit", "가계신용", "KRW", "quarterly", "country"],
    ["household_net_assets", "Household net assets", "가구 순자산", "KRW/household", "annual", "country"],
  ]],
  ["education", "Ministry of Education / Statistics Korea", "https://kosis.kr/", [
    ["student_total", "Students", "학생수", "person", "annual", "region"],
    ["school_total", "Schools", "학교수", "school", "annual", "region"],
    ["tertiary_attainment", "Tertiary educational attainment", "고등교육 이수율", "percent", "annual", "country"],
  ]],
  ["health-medical", "Ministry of Health and Welfare / KDCA / Statistics Korea", "https://kosis.kr/", [
    ["life_expectancy", "Life expectancy at birth", "출생시 기대수명", "year", "annual", "mixed"],
    ["physician_total", "Physicians", "의사수", "person", "annual", "region"],
    ["hospital_beds", "Hospital beds", "병상수", "bed", "annual", "region"],
  ]],
  ["society-life", "Korean National Police Agency / Statistics Korea", "https://www.data.go.kr/", [
    ["reported_crime_total", "Reported crimes", "신고·인지 범죄 건수", "case", "annual", "region"],
    ["marriage_total", "Marriages", "혼인 건수", "case", "monthly/annual", "region"],
    ["divorce_total", "Divorces", "이혼 건수", "case", "monthly/annual", "region"],
  ]],
  ["transport-vehicles", "MOLIT / Korea Transportation Safety Authority", "https://www.data.go.kr/", [
    ["registered_vehicles", "Registered vehicles", "자동차 등록대수", "vehicle", "monthly", "region"],
    ["road_accident_total", "Road traffic accidents", "교통사고 건수", "case", "annual", "region"],
    ["public_transport_trips", "Public transport passenger trips", "대중교통 이용 건수", "trip", "monthly/annual", "region"],
  ]],
  ["environment-energy", "Ministry of Environment / Korea Meteorological Administration", "https://www.data.go.kr/", [
    ["pm25_annual_mean", "Annual mean PM2.5", "초미세먼지 연평균 농도", "µg/m³", "annual", "region"],
    ["electricity_consumption", "Electricity consumption", "전력 소비량", "kWh", "monthly/annual", "region"],
    ["annual_temperature", "Annual mean temperature", "연평균 기온", "°C", "annual", "region"],
  ]],
  ["country-world", "World Bank / OECD / United Nations", "https://data.worldbank.org/", [
    ["world_population", "Country population comparison", "국가별 인구 비교", "person", "annual", "country"],
    ["world_gdp_ppp", "GDP per capita, PPP", "구매력평가 1인당 GDP", "international dollar/person", "annual", "country"],
    ["world_life_expectancy", "Country life expectancy comparison", "국가별 기대수명 비교", "year", "annual", "country"],
  ]],
];

const researchCandidates: IndicatorDefinition[] = groups.flatMap(([categoryId, sourceOrg, sourceUrl, rows]) => rows.map(([id, en, ko, unit, cadence, geography]) => ({
  id, categoryId, title: { en, ko }, unit, cadence,
  geography: geography as IndicatorDefinition["geography"],
  sourceOrg: id === "household_net_assets" ? "Statistics Korea (KOSIS), Survey of Household Finances and Living Conditions" : sourceOrg,
  sourceUrl: id === "household_net_assets" ? "https://kosis.kr/" : sourceUrl,
  status: "BLOCKED", access: "Official API/download discovery pending",
  license: "UNVERIFIED — dataset-specific terms required", automation: "LOW",
  capabilities: [],
  blockReason: "Official access, dataset ID, definitions, reuse terms and geography have not passed verification",
})));

export const expansionCandidates: IndicatorDefinition[] = researchCandidates.map(candidate => {
  const record = verifiedDataRecords.find(item => item.id === candidate.id);
  if (!record) return candidate;
  const points = reviewedSprintSeries(candidate.id);
  if (!points.length) return candidate;
  return { ...candidate, status: "CONNECTED", unit: record.unit, geography: "country", cadence: record.cadence,
    sourceOrg: record.source_org, sourceUrl: record.source_url, license: record.license,
    access: "reviewed versioned official snapshot", automation: record.source_org === "World Bank WDI" ? "HIGH" : "MEDIUM", blockReason: undefined,
    capabilities: ["kpi", "timeseries", "compare", "share", "export", "citation"] };
});

// A candidate code is not a verified dataset ID. Do not publish values from it.
export const candidateSourceCodes: Record<string, string> = {
  gdp_per_capita_usd: "NY.GDP.PCAP.CD",
  consumer_price_inflation_wdi: "FP.CPI.TOTL.ZG",
  unemployment_ilo_modelled: "SL.UEM.TOTL.ZS",
  world_population: "SP.POP.TOTL",
  world_gdp_ppp: "NY.GDP.PCAP.PP.CD",
  world_life_expectancy: "SP.DYN.LE00.IN",
};

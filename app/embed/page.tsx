"use client";
import {useEffect,useState} from "react";
import {CompareBlock} from "@/components/compare-block";
import {PopulationTimeSeriesBlock} from "@/components/population-timeseries-block";
import {populationObservations,populationSource} from "@/lib/data/population";
import {validatedEmbedSelection} from "@/lib/embed";
import {useLocale} from "@/components/locale-provider";

export default function EmbedPage(){
 const {t}=useLocale();const [selection,setSelection]=useState<"compare"|"series"|null>(null);const [original,setOriginal]=useState("");
 useEffect(()=>{const id=window.setTimeout(()=>{const url=new URL(window.location.href);const selected=validatedEmbedSelection(url.searchParams,populationObservations.map(p=>p.reference_period));if(populationObservations.every(p=>p.quality_status==="VERIFIED")){setSelection(selected);url.pathname=url.pathname.replace(/embed\/?$/,"");setOriginal(url.toString());}},0);return()=>clearTimeout(id);},[]);
 return <main className="embed-root"><header className="shell"><a href={original||`${process.env.NEXT_PUBLIC_BASE_PATH??""}/`} target="_blank" rel="noreferrer">INDEX WORLD ↗</a></header>{selection==="compare"?<CompareBlock/>:selection==="series"?<PopulationTimeSeriesBlock/>:<p className="shell">{t("discovery.embedUnavailable")}</p>}<footer className="shell">INDEX WORLD · <a href={populationSource.source_url} target="_blank" rel="noreferrer">World Bank · {populationSource.source_id}</a> · <a href={original} target="_blank" rel="noreferrer">{t("discovery.original")}</a></footer></main>;
}

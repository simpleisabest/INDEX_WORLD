"use client";
import {useEffect} from "react";
export function ContentAnchor(){useEffect(()=>{const content=new URLSearchParams(window.location.search).get("content");if(content&&["population-kpi","popular-data","related-data","korea-map"].includes(content)){const id=window.setTimeout(()=>document.getElementById(content==="korea-map"?"map":content)?.scrollIntoView(),0);return()=>clearTimeout(id);}},[]);return null;}

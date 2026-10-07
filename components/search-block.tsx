"use client";

import { FormEvent, KeyboardEvent, useId, useState } from "react";
import { searchDemandContract, discoveryHref, type DiscoveryTarget } from "@/lib/discovery";
import {populationObservations} from "@/lib/data/population";
import { useLocale } from "@/components/locale-provider";
import { categoryRegistry } from "@/lib/data/catalog";

type SearchIntent = "REGION" | "INDICATOR" | "RANKING" | "COMPARE" | "QUESTION";

type SearchSuggestion = {
  label: string;
  intent: SearchIntent;
  contentId: DiscoveryTarget;
};

export function SearchBlock() {
  const { t, locale } = useLocale();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [submittedQuery, setSubmittedQuery] = useState("");
  const statusId = useId();
  const suggestions: SearchSuggestion[] = [
    { label: t("discovery.latest"), intent: "INDICATOR", contentId: "population-kpi" },
    { label: t("discovery.history"), intent: "INDICATOR", contentId: "population-timeseries" },
    { label: t("discovery.compare"), intent: "COMPARE", contentId: "population-compare" },
  ];

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedQuery = query.trim();
    if (!normalizedQuery) {
      setIsOpen(true);
      return;
    }
    setSubmittedQuery(normalizedQuery);
    const matches = suggestions.filter(item=>item.label.toLocaleLowerCase(locale)===normalizedQuery.toLocaleLowerCase(locale)).map(item=>item.contentId);
    window.dispatchEvent(new CustomEvent("index-world:search-demand",{detail:searchDemandContract(normalizedQuery,locale,matches)}));
    setIsOpen(false);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      setIsOpen(false);
      setSubmittedQuery("");
      event.currentTarget.blur();
    }
  };

  const chooseSuggestion = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.label);
    setSubmittedQuery(suggestion.label);
    setIsOpen(false);
  };

  return (
    <section className="search-wrap shell" id="global-search" aria-labelledby="search-heading">
      <div className="search-panel">
        <div className="search-heading-row">
          <h2 id="search-heading">{t("search.heading")}</h2>
          <span>SEARCH · MAP · DATA · COMPARE</span>
        </div>
        <div className="search-trust">
          <strong>{t("search.free")}</strong>
          <span>{t("search.support")}</span>
        </div>
        <form className="search-form" role="search" onSubmit={submitSearch}>
          <span className="search-icon" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setSubmittedQuery("");
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder={t("discovery.searchPlaceholder")}
            aria-label="지역 또는 데이터 검색"
            role="combobox"
            aria-autocomplete="list"
            aria-controls="search-suggestions"
            aria-describedby={statusId}
            aria-expanded={isOpen}
            autoComplete="off"
          />
          <button type="submit" aria-label="검색">→</button>
        </form>

        <nav className="search-intents" aria-label={t("search.recommended")}>
          {suggestions.map((suggestion, index) => (
            <a key={suggestion.contentId} href={discoveryHref(suggestion.contentId,populationObservations[0].reference_period,populationObservations.at(-1)!.reference_period,populationObservations.at(-2)!.reference_period)}>
              <span>0{index + 1} · {suggestion.intent}</span>
              <strong>{suggestion.label}</strong>
              <b aria-hidden="true">↗</b>
            </a>
          ))}
        </nav>
        <div className="search-topics" aria-label="Data topics">
          {categoryRegistry.slice(0,5).map((category,index)=><a key={category.id} href={index===0?"#population-kpi":"#data-catalog"} className={`tone-${category.color}`}><span>{t(category.labelKey)}</span><small>{index===0?"LIVE":"SOURCE REVIEW"}</small></a>)}
          <a href="#data-catalog" className="tone-orange"><span>{locale==="ko"?"물가":"Prices"}</span><small>SOURCE REVIEW</small></a>
        </div>

        {isOpen && (
          <div className="search-suggestions" id="search-suggestions">
            <p>{t("search.recommended")}</p>
            <div>
              {suggestions.map((suggestion) => (
                <button type="button" key={suggestion.label} onClick={() => chooseSuggestion(suggestion)}>
                  <span>{suggestion.intent}</span>
                  {suggestion.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="search-status" id={statusId} aria-live="polite">
          {submittedQuery && suggestions.some(item=>item.label.toLocaleLowerCase(locale)===submittedQuery.toLocaleLowerCase(locale)) ? <p>{suggestions.filter(item=>item.label.toLocaleLowerCase(locale)===submittedQuery.toLocaleLowerCase(locale)).map(item=><a key={item.contentId} href={discoveryHref(item.contentId,populationObservations[0].reference_period,populationObservations.at(-1)!.reference_period,populationObservations.at(-2)!.reference_period)}>{item.label} ↗</a>)}</p> : submittedQuery ? (
            <p><span>{t("search.pending")}</span> {t("search.pendingText", { query: submittedQuery })}</p>
          ) : (
            <p><span>{t("search.contract")}</span> {t("search.contractText")}</p>
          )}
        </div>
      </div>
    </section>
  );
}

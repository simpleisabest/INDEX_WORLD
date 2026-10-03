"use client";

import { FormEvent, KeyboardEvent, useId, useState } from "react";
import { useLocale } from "@/components/locale-provider";

type SearchIntent = "REGION" | "INDICATOR" | "RANKING" | "COMPARE" | "QUESTION";

type SearchSuggestion = {
  label: string;
  intent: SearchIntent;
};

export function SearchBlock() {
  const { t } = useLocale();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [submittedQuery, setSubmittedQuery] = useState("");
  const statusId = useId();
  const suggestions: SearchSuggestion[] = [
    { label: t("search.s1"), intent: "REGION" },
    { label: t("search.s2"), intent: "INDICATOR" },
    { label: t("search.s3"), intent: "INDICATOR" },
    { label: t("search.s4"), intent: "COMPARE" },
  ];

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedQuery = query.trim();
    if (!normalizedQuery) {
      setIsOpen(true);
      return;
    }
    setSubmittedQuery(normalizedQuery);
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
    setSubmittedQuery("");
    setIsOpen(false);
  };

  return (
    <section className="search-wrap shell" aria-labelledby="search-heading">
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
            placeholder={t("search.placeholder")}
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
          {submittedQuery ? (
            <p><span>{t("search.pending")}</span> {t("search.pendingText", { query: submittedQuery })}</p>
          ) : (
            <p><span>{t("search.contract")}</span> {t("search.contractText")}</p>
          )}
        </div>
      </div>
    </section>
  );
}

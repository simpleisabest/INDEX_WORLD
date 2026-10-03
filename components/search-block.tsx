"use client";

import { FormEvent, KeyboardEvent, useId, useState } from "react";

type SearchIntent = "REGION" | "INDICATOR" | "RANKING" | "COMPARE" | "QUESTION";

type SearchSuggestion = {
  label: string;
  intent: SearchIntent;
};

const suggestions: SearchSuggestion[] = [
  { label: "서울 인구", intent: "REGION" },
  { label: "인천 1인가구", intent: "INDICATOR" },
  { label: "부산 주택", intent: "INDICATOR" },
  { label: "서울 vs 부산", intent: "COMPARE" },
];

export function SearchBlock() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [submittedQuery, setSubmittedQuery] = useState("");
  const statusId = useId();

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
          <h2 id="search-heading">무엇을 알고 싶나요?</h2>
          <span>SEARCH · MAP · DATA · COMPARE</span>
        </div>
        <div className="search-trust">
          <strong>100% 무료 · 회원가입 없음 · 바로 사용</strong>
          <span>찾고, 비교하고, 시각화하고, 공유하세요.</span>
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
            placeholder="서울 인구, 인천 1인가구, 서울 vs 부산..."
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
            <p>추천 검색</p>
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
            <p><span>DATA CONNECTION PENDING</span> “{submittedQuery}” 검색 데이터 연결 준비 중입니다.</p>
          ) : (
            <p><span>SEARCH CONTRACT V0.2</span> 지역 · 지표 · 랭킹 · 비교 · 질문 검색을 준비하고 있습니다.</p>
          )}
        </div>
      </div>
    </section>
  );
}

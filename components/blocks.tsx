const languages = [
  ["ko", "한국어"], ["en", "English"], ["ja", "日本語"], ["es", "Español"],
  ["pt", "Português"], ["de", "Deutsch"], ["fr", "Français"], ["zh-CN", "简体中文"],
  ["zh-TW", "繁體中文"], ["hi", "हिन्दी"], ["id", "Bahasa Indonesia"], ["it", "Italiano"],
  ["vi", "Tiếng Việt"],
] as const;

const categories = [
  { number: "01", en: "Population", ko: "인구", note: "사람과 지역의 변화를 봅니다.", icon: "◎" },
  { number: "02", en: "Household", ko: "가구", note: "삶의 단위와 흐름을 읽습니다.", icon: "◇" },
  { number: "03", en: "Housing", ko: "주택", note: "공간과 거주의 모습을 찾습니다.", icon: "□" },
] as const;

const popularItems = [
  { label: "TREND", title: "인구가 증가한 지역", meta: "Population · Korea" },
  { label: "RANK", title: "1인가구 비율이 높은 지역", meta: "Household · Korea" },
  { label: "CHANGE", title: "최근 인구 변화", meta: "Population · Time series" },
  { label: "COMPARE", title: "서울 vs 부산", meta: "City comparison" },
] as const;

export function HeaderBlock() {
  return (
    <header className="site-header shell">
      <a className="brand" href="#top" aria-label="INDEX WORLD 홈">
        <span className="brand-mark" aria-hidden="true">IW</span>
        <span>INDEX WORLD<sup>™</sup></span>
      </a>
      <nav className="header-nav" aria-label="주요 메뉴">
        <a className="korea-link" href="#map">INDEX KOREA</a>
        <label className="language">
          <span className="sr-only">언어 선택</span>
          <span aria-hidden="true">○</span>
          <select defaultValue="ko" aria-label="언어 선택">
            {languages.map(([code, name]) => <option key={code} value={code}>{name}</option>)}
          </select>
        </label>
      </nav>
    </header>
  );
}

export function HeroBlock() {
  return (
    <section className="hero shell" id="top">
      <div className="eyebrow"><span /> THE WORLD, INDEXED.</div>
      <h1>세상을<br /><em>숫자</em>로 보다.</h1>
      <p>세계 각국의 데이터를 검색하고, 비교하고, 발견하세요.<br className="desktop-break" /> 복잡한 세상을 이해하기 쉬운 인덱스로 만듭니다.</p>
      <div className="free-promise" aria-label="무료, 회원가입 없이 바로 사용하는 데이터 플랫폼">
        <strong>100% FREE · NO SIGN-UP · JUST DATA</strong>
        <span>Explore. Compare. Visualize. Share.</span>
      </div>
      <div className="hero-index" aria-hidden="true">01 <span>/</span> WORLD DATA</div>
    </section>
  );
}

export function SearchBlock() {
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
        <form className="search-form" role="search">
          <span className="search-icon" aria-hidden="true" />
          <input type="search" placeholder="서울 인구, 인천 1인가구, 서울 vs 부산..." aria-label="지역 또는 데이터 검색" />
          <button type="submit" aria-label="검색">→</button>
        </form>
        <p className="search-note"><span>DATA CONNECTION PENDING</span> 검색 기능은 다음 데이터 연결 단계에서 활성화됩니다.</p>
      </div>
    </section>
  );
}

export function DataCategoryBlock() {
  return (
    <section className="section shell" aria-labelledby="category-heading">
      <SectionTitle kicker="EXPLORE BY CATEGORY" title="데이터로 세상을 탐색하세요" id="category-heading" />
      <div className="category-grid">
        {categories.map((item) => (
          <article className="category-card" key={item.en}>
            <div className="card-top"><span>{item.number}</span><b aria-hidden="true">{item.icon}</b></div>
            <p>{item.en}</p>
            <h3>{item.ko}</h3>
            <div className="card-bottom"><span>{item.note}</span><b aria-hidden="true">↗</b></div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function MapBlock() {
  return (
    <section className="map-section" id="map" aria-labelledby="map-heading">
      <div className="shell map-grid">
        <div className="map-copy">
          <div className="eyebrow light"><span /> INDEX KOREA</div>
          <h2 id="map-heading">지도로 발견하는<br />대한민국의 오늘</h2>
          <p>지역을 선택하고, 서로 다른 데이터의 흐름을 한눈에 비교하는 경험을 준비하고 있습니다.</p>
          <div className="pending-badge"><i /> MAP DATA COMING NEXT</div>
        </div>
        <div className="map-visual" aria-label="대한민국 지도 개발용 플레이스홀더">
          <div className="map-coordinates">37.5665° N<br />126.9780° E</div>
          <svg viewBox="0 0 320 420" role="img" aria-label="대한민국 지도 실루엣 플레이스홀더">
            <path d="M165 25c19 18 14 43 30 62 16 19 45 29 46 56 1 25-22 36-18 61 5 28 26 38 16 71-8 27-40 33-51 59-8 19 3 44-17 59-18 13-34-9-49-21-16-13-39-17-44-40-6-25 17-40 23-61 7-25-7-46 0-68 8-25 40-33 53-54 14-22 3-54 20-73 12-14 24-3 37-21Z" />
            <path className="island" d="M91 373c13-8 36-5 42 7 6 13-9 25-28 24-19-1-28-20-14-31Z" />
          </svg>
          <span className="city city-seoul">SEOUL<i /></span>
          <span className="city city-busan">BUSAN<i /></span>
          <div className="map-watermark">KOREA</div>
        </div>
      </div>
    </section>
  );
}

export function PopularDataBlock() {
  return (
    <section className="section shell" aria-labelledby="popular-heading">
      <SectionTitle kicker="POPULAR DATA" title="사람들이 찾는 데이터" id="popular-heading" side="데이터 연결 후 실시간 콘텐츠가 표시됩니다." />
      <div className="popular-list">
        {popularItems.map((item, index) => (
          <article className="popular-row" key={item.title}>
            <span className="popular-number">0{index + 1}</span>
            <span className="popular-label">{item.label}</span>
            <div><h3>{item.title}</h3><p>{item.meta}</p></div>
            <span className="demo-chip">COMING NEXT</span>
            <span className="row-arrow" aria-hidden="true">↗</span>
          </article>
        ))}
      </div>
    </section>
  );
}

export function ShareBlock() {
  return (
    <section className="share-section">
      <div className="shell share-grid">
        <div>
          <div className="eyebrow"><span /> DATA, MADE SHAREABLE.</div>
          <h2>발견한 데이터를<br /><em>더 멀리.</em></h2>
        </div>
        <div className="share-copy">
          <p>모든 데이터는 쉽게 공유하고, 비교하고, 새로운 관점으로 재구성할 수 있도록 설계됩니다.</p>
          <div className="share-actions" aria-label="공유 기능 미리보기">
            <button disabled><span>↗</span> SHARE</button>
            <button disabled><span>⌘</span> REMIX</button>
            <button disabled><span>+</span> EMBED</button>
          </div>
          <small>SHARING TOOLS · COMING NEXT</small>
        </div>
      </div>
      <footer className="shell footer">
        <span>INDEX WORLD<sup>™</sup></span>
        <p>Make the world understandable.</p>
        <span>V0.1 · FRONTEND SHELL</span>
      </footer>
    </section>
  );
}

function SectionTitle({ kicker, title, id, side }: { kicker: string; title: string; id: string; side?: string }) {
  return (
    <div className="section-title">
      <div><p>{kicker}</p><h2 id={id}>{title}</h2></div>
      {side && <span>{side}</span>}
    </div>
  );
}

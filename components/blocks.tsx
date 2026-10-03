"use client";

import Image from "next/image";
import { useLocale } from "@/components/locale-provider";
import { localeNames, locales, type Locale } from "@/lib/i18n/config";
import type { TranslationKey } from "@/lib/i18n/dictionaries/en";

const iconBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const categories = [
  { number: "01", id: "population", title: "category.population", note: "category.populationNote", icon: "◎" },
  { number: "02", id: "household", title: "category.household", note: "category.householdNote", icon: "◇" },
  { number: "03", id: "housing", title: "category.housing", note: "category.housingNote", icon: "□" },
] as const;

const popularItems = [
  { label: "TREND", title: "popular.p1", meta: "Population · Korea" },
  { label: "RANK", title: "popular.p2", meta: "Household · Korea" },
  { label: "CHANGE", title: "popular.p3", meta: "Population · Time series" },
  { label: "COMPARE", title: "popular.p4", meta: "City comparison" },
] as const;

export function HeaderBlock() {
  const { locale, setLocale, isLoading, t } = useLocale();
  return (
    <header className="site-header shell">
      <a className="brand" href={`${iconBasePath}/`} aria-label="INDEX WORLD Home">
        <Image
          className="brand-logo"
          src={`${iconBasePath}/brand/index-world-logo.webp`}
          alt=""
          width={2172}
          height={724}
          sizes="(max-width: 360px) 140px, (max-width: 760px) 165px, 220px"
          priority
        />
      </a>
      <nav className="header-nav" aria-label="주요 메뉴">
        <a className="korea-link" href="#map">{t("nav.korea")}</a>
        <label className="language">
          <span className="sr-only">Language</span>
          <span aria-hidden="true">○</span>
          <select value={locale} onChange={(event) => setLocale(event.target.value as Locale)} aria-label="Language" disabled={isLoading}>
            {locales.map((code) => <option key={code} value={code}>{localeNames[code]}</option>)}
          </select>
        </label>
      </nav>
    </header>
  );
}

export function HeroBlock() {
  const { t } = useLocale();
  return (
    <section className="hero shell" id="top">
      <div className="eyebrow"><span /> {t("hero.eyebrow")}</div>
      <h1>{t("hero.line1")}<br /><em>{t("hero.line2")}</em></h1>
      <p>{t("hero.description")}</p>
      <div className="free-promise" aria-label="무료, 회원가입 없이 바로 사용하는 데이터 플랫폼">
        <strong>{t("hero.free")}</strong>
        <span>{t("hero.support")}</span>
      </div>
      <div className="hero-index" aria-hidden="true">01 <span>/</span> WORLD DATA</div>
    </section>
  );
}

export function DataCategoryBlock() {
  const { t } = useLocale();
  return (
    <section className="section shell" aria-labelledby="category-heading">
      <SectionTitle kicker={t("category.kicker")} title={t("category.heading")} id="category-heading" />
      <div className="category-grid">
        {categories.map((item) => (
          <article className="category-card" key={item.id}>
            <div className="card-top"><span>{item.number}</span><b aria-hidden="true">{item.icon}</b></div>
            <p>{item.id.toUpperCase()}</p>
            <h3>{t(item.title as TranslationKey)}</h3>
            <div className="card-bottom"><span>{t(item.note as TranslationKey)}</span><b aria-hidden="true">↗</b></div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function PopularDataBlock() {
  const { t } = useLocale();
  return (
    <section className="section shell" aria-labelledby="popular-heading">
      <SectionTitle kicker={t("popular.kicker")} title={t("popular.heading")} id="popular-heading" side={t("popular.side")} />
      <div className="popular-list">
        {popularItems.map((item, index) => (
          <article className="popular-row" key={item.title}>
            <span className="popular-number">0{index + 1}</span>
            <span className="popular-label">{item.label}</span>
            <div><h3>{t(item.title as TranslationKey)}</h3><p>{item.meta}</p></div>
            <span className="demo-chip">{t("common.coming")}</span>
            <span className="row-arrow" aria-hidden="true">↗</span>
          </article>
        ))}
      </div>
    </section>
  );
}

export function ShareBlock() {
  const { t } = useLocale();
  return (
    <section className="share-section">
      <div className="shell share-grid">
        <div>
          <div className="eyebrow"><span /> {t("share.eyebrow")}</div>
          <h2>{t("share.line1")}<br /><em>{t("share.line2")}</em></h2>
        </div>
        <div className="share-copy">
          <p>{t("share.description")}</p>
          <div className="share-actions" aria-label="공유 기능 미리보기">
            <button disabled><span>↗</span> SHARE</button>
            <button disabled><span>⌘</span> REMIX</button>
            <button disabled><span>+</span> EMBED</button>
          </div>
          <small>{t("share.pending")}</small>
        </div>
      </div>
      <footer className="shell footer">
        <span>INDEX WORLD<sup>™</sup></span>
        <div className="footer-center">
          <p>{t("footer.statement")}</p>
          <nav aria-label="Footer"><a href="mailto:simpleisabest@gmail.com">{t("footer.advertising")} · simpleisabest@gmail.com</a></nav>
        </div>
        <span>V0.5 · OFFICIAL POPULATION</span>
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

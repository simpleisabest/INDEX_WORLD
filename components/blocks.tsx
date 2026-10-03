"use client";

import Image from "next/image";
import { useLocale } from "@/components/locale-provider";
import { localeNames, locales, type Locale } from "@/lib/i18n/config";
import type { TranslationKey } from "@/lib/i18n/dictionaries/en";
import { DiscoveryBlock } from "@/components/discovery-block";
import type { ReactNode } from "react";

const iconBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

function BrandLogo({ footer = false }: { footer?: boolean }) {
  return (
    <Image
      className={footer ? "footer-brand-logo" : "brand-logo"}
      src={`${iconBasePath}/brand/index-world-logo.webp`}
      alt=""
      width={2172}
      height={724}
      sizes={footer ? "(max-width: 360px) 135px, 180px" : "(max-width: 360px) 140px, (max-width: 760px) 165px, 220px"}
      priority={!footer}
    />
  );
}

const categories = [
  { number: "01", id: "population", title: "category.population", note: "category.populationNote", icon: "◎" },
  { number: "02", id: "household", title: "category.household", note: "category.householdNote", icon: "◇" },
  { number: "03", id: "housing", title: "category.housing", note: "category.housingNote", icon: "□" },
] as const;

export function HeaderBlock() {
  const { locale, setLocale, isLoading, t } = useLocale();
  return (
    <header className="site-header shell">
      <a className="brand" href={`${iconBasePath}/`} aria-label="INDEX WORLD Home">
        <BrandLogo />
      </a>
      <nav className="header-nav" aria-label="주요 메뉴">
        <a className="korea-link" href="#population-kpi">{t("nav.korea")}</a>
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

export function PopularDataBlock() { return <DiscoveryBlock popular />; }

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
          <a className="export-jump" href="#population-timeseries">{t("export.menu")} ↗</a>
        </div>
      </div>
      <footer className="shell footer">
        <a className="footer-logo-link" href={`${iconBasePath}/`} aria-label="INDEX WORLD Home"><BrandLogo footer /></a>
        <div className="footer-center">
          <p>{t("footer.statement")}</p>
          <nav aria-label="Footer"><a href="mailto:simpleisabest@gmail.com">{t("footer.advertising")} · simpleisabest@gmail.com</a></nav>
        </div>
        <span>V1.0 · VERIFIED DATA SPRINT</span>
      </footer>
    </section>
  );
}

function SectionTitle({ kicker, title, id, side, action }: { kicker: string; title: string; id: string; side?: string; action?: ReactNode }) {
  return (
    <div className="section-title">
      <div><p>{kicker}</p><h2 id={id}>{title}</h2></div>
      {(side || action) && <div className="section-title-side">{side && <span>{side}</span>}{action}</div>}
    </div>
  );
}

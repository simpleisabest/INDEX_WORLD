export const locales = ["en", "ko", "ja", "es", "pt", "de", "fr", "zh-CN", "zh-TW", "hi", "id", "it", "vi"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "ko";
export const localeStorageKey = "index-world-locale";

export const localeNames: Record<Locale, string> = {
  en: "English", ko: "한국어", ja: "日本語", es: "Español", pt: "Português",
  de: "Deutsch", fr: "Français", "zh-CN": "简体中文", "zh-TW": "繁體中文",
  hi: "हिन्दी", id: "Bahasa Indonesia", it: "Italiano", vi: "Tiếng Việt",
};

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

function normalizeLanguageTag(value: string) {
  return value.trim().replaceAll("_", "-").toLowerCase();
}

export function matchSupportedLocale(preferredLanguages: readonly string[]): Locale {
  for (const language of preferredLanguages) {
    const normalized = normalizeLanguageTag(language);

    const exactLocale = locales.find((locale) => normalizeLanguageTag(locale) === normalized);
    if (exactLocale) return exactLocale;

    const [baseLanguage, ...subtags] = normalized.split("-");
    if (baseLanguage === "zh") {
      const prefersTraditional = subtags.some((tag) => ["hant", "tw", "hk", "mo"].includes(tag));
      return prefersTraditional ? "zh-TW" : "zh-CN";
    }

    const baseLocale = locales.find((locale) => locale === baseLanguage);
    if (baseLocale) return baseLocale;
  }

  return "en";
}

export function getFutureLocalePath(locale: Locale, path = "korea/") {
  return `/${locale}/${path.replace(/^\//, "")}`;
}

export function getHreflangFoundation(path = "korea/") {
  return [
    ...locales.map((locale) => ({ hrefLang: locale, href: getFutureLocalePath(locale, path) })),
    { hrefLang: "x-default", href: getFutureLocalePath("en", path) },
  ];
}

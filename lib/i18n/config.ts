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

export function getFutureLocalePath(locale: Locale, path = "korea/") {
  return `/${locale}/${path.replace(/^\//, "")}`;
}

export function getHreflangFoundation(path = "korea/") {
  return [
    ...locales.map((locale) => ({ hrefLang: locale, href: getFutureLocalePath(locale, path) })),
    { hrefLang: "x-default", href: getFutureLocalePath("en", path) },
  ];
}

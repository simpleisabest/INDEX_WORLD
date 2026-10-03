import type { Locale } from "./config";
import en, { type TranslationKey } from "./dictionaries/en";

type DictionaryOverrides = Partial<Record<TranslationKey, string>>;
export type Dictionary = Record<TranslationKey, string>;

const loaders: Record<Locale, () => Promise<{ default: DictionaryOverrides }>> = {
  en: async () => ({ default: {} }),
  ko: () => import("./dictionaries/ko"),
  ja: () => import("./dictionaries/ja"),
  es: () => import("./dictionaries/es"),
  pt: () => import("./dictionaries/pt"),
  de: () => import("./dictionaries/de"),
  fr: () => import("./dictionaries/fr"),
  "zh-CN": () => import("./dictionaries/zh-CN"),
  "zh-TW": () => import("./dictionaries/zh-TW"),
  hi: () => import("./dictionaries/hi"),
  id: () => import("./dictionaries/id"),
  it: () => import("./dictionaries/it"),
  vi: () => import("./dictionaries/vi"),
};

export async function loadDictionary(locale: Locale): Promise<Dictionary> {
  const localized = await loaders[locale]();
  return { ...en, ...localized.default };
}

export const englishDictionary: Dictionary = en;

"use client";

import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { defaultLocale, isLocale, localeStorageKey, matchSupportedLocale, type Locale } from "@/lib/i18n/config";
import { createLocaleFormatters } from "@/lib/i18n/formatters";
import { englishDictionary, loadDictionary, type Dictionary } from "@/lib/i18n/load-dictionary";
import type { TranslationKey } from "@/lib/i18n/dictionaries/en";
import ko from "@/lib/i18n/dictionaries/ko";

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey, variables?: Record<string, string>) => string;
  format: ReturnType<typeof createLocaleFormatters>;
  isLoading: boolean;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);
const initialDictionary: Dictionary = { ...englishDictionary, ...ko };

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);
  const [dictionary, setDictionary] = useState<Dictionary>(initialDictionary);
  const [isLoading, setIsLoading] = useState(false);

  const applyLocale = useCallback(async (nextLocale: Locale, persist = true) => {
    setIsLoading(true);
    const nextDictionary = await loadDictionary(nextLocale);
    setDictionary(nextDictionary);
    setLocaleState(nextLocale);
    document.documentElement.lang = nextLocale;
    if (persist) window.localStorage.setItem(localeStorageKey, nextLocale);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const storedLocale = window.localStorage.getItem(localeStorageKey);
    const detectedLocale = matchSupportedLocale(window.navigator.languages ?? [window.navigator.language]);
    const timeoutId = window.setTimeout(() => {
      void applyLocale(storedLocale && isLocale(storedLocale) ? storedLocale : detectedLocale, false);
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, [applyLocale]);

  const t = useCallback((key: TranslationKey, variables?: Record<string, string>) => {
    let value = dictionary[key] ?? englishDictionary[key];
    for (const [name, replacement] of Object.entries(variables ?? {})) {
      value = value.replaceAll(`{${name}}`, replacement);
    }
    return value;
  }, [dictionary]);

  const setLocale = useCallback((nextLocale: Locale) => {
    void applyLocale(nextLocale, true);
  }, [applyLocale]);

  const value = useMemo(() => ({ locale, setLocale, t, format: createLocaleFormatters(locale), isLoading }), [locale, setLocale, t, isLoading]);
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) throw new Error("useLocale must be used within LocaleProvider");
  return context;
}

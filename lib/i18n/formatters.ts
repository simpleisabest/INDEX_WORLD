import type { Locale } from "./config";

export function createLocaleFormatters(locale: Locale) {
  return {
    number: (value: number, options?: Intl.NumberFormatOptions) => new Intl.NumberFormat(locale, options).format(value),
    percent: (value: number, options?: Intl.NumberFormatOptions) => new Intl.NumberFormat(locale, { style: "percent", ...options }).format(value),
    date: (value: Date | string | number, options?: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat(locale, options).format(new Date(value)),
    unit: (value: number, unit: Intl.NumberFormatOptions["unit"], options?: Intl.NumberFormatOptions) => new Intl.NumberFormat(locale, { style: "unit", unit, ...options }).format(value),
  };
}

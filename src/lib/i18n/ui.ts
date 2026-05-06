import type { Locale } from './types';
export * from './types';
export * from './locales';

export function normalizeLocale(value: string | null | undefined): Locale {
  if (!value) return "en";
  const v = value.toLowerCase();
  if (v.startsWith("ja")) return "ja";
  if (v.startsWith("ar")) return "ar";
  if (v.startsWith("es")) return "es";
  if (v.startsWith("pt")) return "pt";
  if (v.startsWith("fr")) return "fr";
  if (v.startsWith("id")) return "id";
  if (v.startsWith("hi")) return "hi";
  if (v.startsWith("de")) return "de";
  if (v.startsWith("tr")) return "tr";
  return "en";
}

export function localeDir(locale: Locale): "ltr" | "rtl" {
  return locale === "ar" ? "rtl" : "ltr";
}

export const localeNativeLabels: Record<Locale, string> = {
  en: "English",
  ar: "العربية",
  ja: "日本語",
  es: "Español",
  pt: "Português",
  fr: "Français",
  id: "Bahasa Indonesia",
  hi: "हिंदी",
  de: "Deutsch",
  tr: "Türkçe",
};

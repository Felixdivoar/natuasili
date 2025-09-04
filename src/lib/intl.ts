import { useI18n } from "@/i18n/I18nProvider";

// Get locale string from language code
export function getLocale(lang: string): string {
  switch (lang) {
    case "fr": return "fr-FR";
    case "de": return "de-DE";
    case "es": return "es-ES";
    default: return "en-GB";
  }
}

// Hook for number formatting
export function useNumberFormat() {
  const { lang } = useI18n();
  const locale = getLocale(lang);
  
  return new Intl.NumberFormat(locale);
}

// Hook for date formatting
export function useDateFormat(options?: Intl.DateTimeFormatOptions) {
  const { lang } = useI18n();
  const locale = getLocale(lang);
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "2-digit",
    ...options
  };
  
  return new Intl.DateTimeFormat(locale, defaultOptions);
}
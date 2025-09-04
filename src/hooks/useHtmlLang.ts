import { useI18n } from "@/i18n/I18nProvider";
import { useEffect } from "react";

export function useHtmlLang() {
  const { lang } = useI18n();

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
}
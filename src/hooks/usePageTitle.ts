import { useI18n } from "@/i18n/I18nProvider";
import { useEffect } from "react";
import { DICT } from "@/i18n/dict";

type Dict = typeof DICT.en;

export function usePageTitle(key: keyof Dict) {
  const { t } = useI18n();
  
  useEffect(() => {
    document.title = `${t(key)} · NatuAsili`;
  }, [t, key]);
}

export function setMetaDescription(desc: string) {
  let tag = document.querySelector('meta[name="description"]');
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("name", "description");
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", desc);
}
import { createContext, useContext, useState, useMemo, ReactNode } from "react";
import { DICT } from "./dict";
import { translate } from "@/lib/ai";

type Lang = keyof typeof DICT;
type Dict = typeof DICT.en;

const I18nCtx = createContext<{
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (k: keyof Dict) => string;
  tDynamic: (text: string) => Promise<string>;
}>({} as any);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => 
    (localStorage.getItem("na_lang") as Lang) || "en"
  );

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("na_lang", l);
  };

  const t = (key: keyof Dict): string => {
    return DICT[lang][key] || DICT.en[key] || key;
  };

  // Auto-translate dynamic content with caching
  const tDynamic = async (text: string): Promise<string> => {
    if (lang === "en" || !text) return text;
    
    const cacheKey = `${lang}:${btoa(text).slice(0, 20)}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) return cached;
    
    try {
      const translated = await translate(text, lang);
      localStorage.setItem(cacheKey, translated);
      return translated;
    } catch {
      return text; // fallback to English
    }
  };

  const value = useMemo(() => ({ lang, setLang, t, tDynamic }), [lang]);

  return <I18nCtx.Provider value={value}>{children}</I18nCtx.Provider>;
}

export const useI18n = () => useContext(I18nCtx);
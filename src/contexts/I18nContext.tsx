import { createContext, useContext, useEffect, useState } from "react";
import { translate } from "@/lib/ai";

type Dict = Record<string, string>;
type Lang = "en" | "fr" | "de" | "es";

const I18nCtx = createContext<{
  lang: Lang; 
  setLang: (l: Lang) => void; 
  t: (k: string, fallback?: string) => string;
}>({
  lang: "en",
  setLang: () => {},
  t: (k: string, fallback?: string) => fallback || k
});

const DICTS: Record<Lang, Dict> = { 
  en: {}, 
  fr: {}, 
  de: {}, 
  es: {} 
}; // add any fixed strings here

export function I18nProvider({ children }: { children: any }) {
  const [lang, setLangState] = useState<Lang>(() => 
    (localStorage.getItem("na_lang") as Lang) || "en"
  );
  
  const setLang = (l: Lang) => { 
    setLangState(l); 
    localStorage.setItem("na_lang", l); 
  };

  function t(key: string, fallback?: string) {
    const cur = DICTS[lang]?.[key] ?? DICTS.en?.[key] ?? fallback ?? key;
    return cur;
  }

  useEffect(() => {}, [lang]);
  
  return (
    <I18nCtx.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nCtx.Provider>
  );
}

export function useI18n() { 
  return useContext(I18nCtx); 
}

// Optional helper: translate arbitrary dynamic text blocks
export async function tDynamic(text: string, targetLang: Lang) { 
  return targetLang === "en" ? text : translate(text, targetLang); 
}
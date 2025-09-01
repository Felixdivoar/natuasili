import { createContext, useContext, useMemo, useState } from "react";

type Lang = "en" | "fr" | "de" | "es";
type Dict = Record<string,string>;

const UI_EN: Dict = {
  nav_destinations:"Destinations", nav_themes:"Themes", nav_experiences:"Experiences", nav_stories:"Impact Stories",
  nav_partners:"Partners", nav_about:"About", nav_partner_with_us:"Partner with us", search_placeholder:"Where to? What impact?",
  hero_title:"Travel that funds conservation", hero_sub:"90% to partner initiatives, 10% to platform & operations",
  cta_explore:"Explore experiences", cta_see_partners:"See partners",
  section_explore_dest:"Explore by destination", section_explore_theme:"Explore by impact",
  section_featured:"Featured experiences", section_stories:"Impact stories", section_partners:"Conservation partners"
};

const UI_FR: Dict = {
  nav_destinations:"Destinations", nav_themes:"Thèmes", nav_experiences:"Expériences", nav_stories:"Histoires d'impact",
  nav_partners:"Partenaires", nav_about:"À propos", nav_partner_with_us:"Devenez partenaire", search_placeholder:"Où aller ? Quel impact ?",
  hero_title:"Voyager pour financer la conservation", hero_sub:"90 % aux initiatives, 10 % à la plateforme",
  cta_explore:"Découvrir les expériences", cta_see_partners:"Voir les partenaires",
  section_explore_dest:"Explorer par destination", section_explore_theme:"Explorer par impact",
  section_featured:"Expériences à la une", section_stories:"Histoires d'impact", section_partners:"Partenaires de conservation"
};

// (Add DE/ES when ready)
const DICTS: Record<Lang, Dict> = { en:UI_EN, fr:UI_FR, de:UI_EN, es:UI_EN };

const I18nCtx = createContext<{lang:Lang; setLang:(l:Lang)=>void; t:(k:keyof typeof UI_EN)=>string;}>({} as any);

export function I18nProvider({children}:{children: React.ReactNode}){
  const [lang, setLangState] = useState<Lang>(() => (localStorage.getItem("na_lang") as Lang) || "en");
  const setLang = (l:Lang) => { setLangState(l); localStorage.setItem("na_lang", l); };
  const t = (k: keyof typeof UI_EN) => DICTS[lang][k] ?? UI_EN[k] ?? k;
  const value = useMemo(()=>({lang,setLang,t}),[lang]);
  return <I18nCtx.Provider value={value}>{children}</I18nCtx.Provider>;
}
export const useI18n = ()=> useContext(I18nCtx);
import { translateDynamic } from "./translateDynamic";
import { useI18n } from "./I18nProvider";
import { useEffect, useState } from "react";

export function useTranslatedArray(items: string[]) {
  const { lang } = useI18n();
  const [out, setOut] = useState(items);
  
  useEffect(() => {
    let alive = true;
    (async () => {
      if (lang === "en") return setOut(items);
      const tx = await Promise.all(items.map(i => translateDynamic(i, lang as any)));
      if (alive) setOut(tx);
    })();
    return () => { alive = false; };
  }, [items, lang]);
  
  return out;
}
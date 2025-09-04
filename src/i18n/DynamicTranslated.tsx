import { useState, useEffect } from "react";
import { useI18n } from "./I18nProvider";

interface DynamicTranslatedProps {
  text: string;
  className?: string;
  children?: (translatedText: string) => React.ReactNode;
}

export default function DynamicTranslated({ text, className, children }: DynamicTranslatedProps) {
  const { lang, tDynamic } = useI18n();
  const [translatedText, setTranslatedText] = useState(text);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (lang === "en") {
      setTranslatedText(text);
      return;
    }

    setIsLoading(true);
    tDynamic(text)
      .then(translated => {
        setTranslatedText(translated);
      })
      .catch(() => {
        setTranslatedText(text); // fallback to English
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [text, lang, tDynamic]);

  if (isLoading) {
    return children ? <>{children(text)}</> : <span className={className}>{text}</span>;
  }

  return children ? <>{children(translatedText)}</> : <span className={className}>{translatedText}</span>;
}
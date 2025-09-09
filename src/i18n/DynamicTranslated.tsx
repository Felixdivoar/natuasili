import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useI18n } from "./I18nProvider";
import { getThemeSlug } from "@/utils/themeUtils";

interface DynamicTranslatedProps {
  text: string;
  className?: string;
  asThemeLink?: boolean;
  children?: (translatedText: string) => React.ReactNode;
}

export default function DynamicTranslated({ text, className, asThemeLink, children }: DynamicTranslatedProps) {
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
    if (children) return <>{children(text)}</>;
    if (asThemeLink) {
      return (
        <Link 
          to={`/marketplace?theme=${encodeURIComponent(getThemeSlug(text))}`}
          className={className}
          aria-label={`View ${text} experiences`}
        >
          {text}
        </Link>
      );
    }
    return <span className={className}>{text}</span>;
  }

  if (children) return <>{children(translatedText)}</>;
  
  if (asThemeLink) {
    return (
      <Link 
        to={`/marketplace?theme=${encodeURIComponent(getThemeSlug(translatedText))}`}
        className={className}
        aria-label={`View ${translatedText} experiences`}
      >
        {translatedText}
      </Link>
    );
  }

  return <span className={className}>{translatedText}</span>;
}
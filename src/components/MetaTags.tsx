import { useI18n } from "@/i18n/I18nProvider";
import { useEffect } from "react";

interface MetaTagsProps {
  title?: string;
  description?: string;
  keywords?: string;
}

export default function MetaTags({ title, description, keywords }: MetaTagsProps) {
  const { t, lang } = useI18n();

  useEffect(() => {
    // Update document title
    if (title) {
      document.title = `${t(title as any)} · NatuAsili`;
    }

    // Update meta description
    if (description) {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement("meta");
        metaDesc.setAttribute("name", "description");
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute("content", t(description as any));
    }

    // Update meta keywords  
    if (keywords) {
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement("meta");
        metaKeywords.setAttribute("name", "keywords");
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.setAttribute("content", t(keywords as any));
    }

    // Update Open Graph title
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle && title) {
      ogTitle.setAttribute("content", `${t(title as any)} · NatuAsili`);
    }

    // Update Open Graph description
    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc && description) {
      ogDesc.setAttribute("content", t(description as any));
    }

    // Update HTML lang attribute
    document.documentElement.lang = lang;
  }, [title, description, keywords, t, lang]);

  return null;
}
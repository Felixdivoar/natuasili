import { useI18n } from "@/i18n/I18nProvider";
import { useEffect } from "react";

interface StructuredDataProps {
  type: 'website' | 'organization' | 'product' | 'article' | 'breadcrumb' | 'faq';
  data: any;
}

export default function StructuredData({ type, data }: StructuredDataProps) {
  const { lang } = useI18n();

  useEffect(() => {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": getSchemaType(type),
      ...data,
      inLanguage: lang
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.innerHTML = JSON.stringify(structuredData);
    script.id = `structured-data-${type}`;
    
    // Remove existing structured data of the same type
    const existing = document.getElementById(`structured-data-${type}`);
    if (existing) {
      existing.remove();
    }
    
    document.head.appendChild(script);

    return () => {
      const scriptToRemove = document.getElementById(`structured-data-${type}`);
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [type, data, lang]);

  return null;
}

function getSchemaType(type: string): string {
  switch (type) {
    case 'website':
      return 'WebSite';
    case 'organization':
      return 'Organization';
    case 'product':
      return 'Product';
    case 'article':
      return 'Article';
    case 'breadcrumb':
      return 'BreadcrumbList';
    case 'faq':
      return 'FAQPage';
    default:
      return 'Thing';
  }
}

export function WebsiteStructuredData() {
  return (
    <StructuredData 
      type="website"
      data={{
        name: "NatuAsili",
        url: "https://natuasili.com",
        description: "Kenya's premier conservation tourism platform connecting conscious travelers with authentic wildlife experiences and community conservation projects.",
        potentialAction: {
          "@type": "SearchAction",
          target: "https://natuasili.com/search?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      }}
    />
  );
}

export function OrganizationStructuredData() {
  return (
    <StructuredData 
      type="organization"
      data={{
        name: "NatuAsili",
        url: "https://natuasili.com",
        logo: "https://natuasili.com/logo.png",
        description: "Kenya's premier conservation tourism platform connecting conscious travelers with authentic wildlife experiences and community conservation projects.",
        foundingDate: "2024",
        areaServed: "Kenya",
        serviceType: "Conservation Tourism",
        contactPoint: {
          "@type": "ContactPoint",
          telephone: "+254-700-000-000",
          contactType: "customer service",
          availableLanguage: ["English", "Swahili"]
        },
        sameAs: [
          "https://facebook.com/natuasili",
          "https://twitter.com/natuasili",
          "https://instagram.com/natuasili",
          "https://linkedin.com/company/natuasili"
        ]
      }}
    />
  );
}
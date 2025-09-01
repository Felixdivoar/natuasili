import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useI18n } from "@/contexts/I18nContext";

interface ContentStubProps {
  title: string;
  description?: string;
  relatedLinks?: Array<{
    title: string;
    href: string;
  }>;
}

const ContentStub = ({ 
  title, 
  description = "This page is being expanded with more detailed content. Check back soon for updates!",
  relatedLinks = [
    { title: "Browse Experiences", href: "/marketplace" },
    { title: "View Partners", href: "/partners" },
    { title: "Impact Ledger", href: "/impact-ledger" }
  ]
}: ContentStubProps) => {
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="hero-full py-16 bg-muted/30">
        <div className="hero-inner">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              {title}
            </h1>
            <p className="text-lg text-muted-foreground">
              {description}
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <Card>
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <ExternalLink className="h-8 w-8 text-primary" />
              </div>
              
              <h2 className="text-2xl font-bold text-foreground mb-4">
                {t("Content Coming Soon", "Content Coming Soon")}
              </h2>
              
              <p className="text-muted-foreground mb-8">
                {t("We're working on expanding this page with comprehensive information. In the meantime, explore these related sections:", "We're working on expanding this page with comprehensive information. In the meantime, explore these related sections:")}
              </p>

              <div className="space-y-3">
                {relatedLinks.map((link, index) => (
                  <Link key={index} to={link.href}>
                    <Button variant="outline" className="w-full">
                      {t(link.title, link.title)}
                    </Button>
                  </Link>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t">
                <Link to="/">
                  <Button variant="ghost" className="gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    {t("Back to Home", "Back to Home")}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ContentStub;
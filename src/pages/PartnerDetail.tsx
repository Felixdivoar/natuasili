import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, ExternalLink, ArrowLeft } from "lucide-react";
import { PARTNERS, type Theme } from "@/data/partners";
import { useI18n } from "@/i18n/I18nProvider";

export default function PartnerDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useI18n();
  
  const partner = PARTNERS.find(p => p.slug === slug);
  
  if (!partner) {
    return (
      <main className="max-w-7xl mx-auto px-4 py-10">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Partner not found</h1>
          <Button asChild>
            <Link to="/partners">Back to Partners</Link>
          </Button>
        </div>
      </main>
    );
  }

  const getThemeColor = (theme: string) => {
    // Map old theme values to new ones for backward compatibility
    const themeMap: Record<string, string> = {
      'wildlife': 'Wildlife conservation',
      'marine': 'Conservation education',
      'community': 'Community & cultural exploration',
      'culture': 'Community & cultural exploration'
    };
    const mappedTheme = themeMap[theme] || theme;
    
    switch (mappedTheme) {
      case 'Wildlife conservation':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'Conservation education':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Community & cultural exploration':
        return 'bg-accent/10 text-accent border-accent/20';
      default:
        return 'bg-muted text-muted-foreground border-muted/20';
    }
  };

  return (
    <>
      {/* Full-width hero */}
      <section className="hero-full bg-gradient-to-r from-foreground/90 to-foreground/70" style={{
        backgroundImage: `url(${partner.logo})`,
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}>
        <div className="hero-inner text-background">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="outline" size="sm" asChild className="bg-background/10 border-background/20 text-background hover:bg-background/20">
              <Link to="/partners">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Partners
              </Link>
            </Button>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{partner.name}</h1>
          <div className="flex items-center gap-2 text-xl text-background/90 mb-4">
            <MapPin className="h-5 w-5" />
            <span className="capitalize">{partner.location.replace(/-/g, ' ')}</span>
          </div>
          <p className="text-xl text-background/90 max-w-3xl">
            {partner.description}
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Partner Info */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>About {partner.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  {partner.description} Established in {partner.established}, this organization has been making a significant impact in conservation efforts across Kenya.
                </p>
                
                <div className="flex flex-wrap gap-2">
                  {partner.themes.map((theme) => (
                    <Badge key={theme} className={getThemeColor(theme)}>
                      {theme}
                    </Badge>
                  ))}
                </div>

                <div className="grid md:grid-cols-2 gap-4 pt-4">
                  <div>
                    <h4 className="font-medium mb-2">Focus Areas</h4>
                    <div className="flex flex-wrap gap-1">
                      {partner.activities.slice(0, 8).map((activity) => (
                        <Badge key={activity} variant="outline" className="text-xs capitalize">
                          {activity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Impact</h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{partner.experienceCount} active experiences</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button asChild className="w-full">
                  <Link to={`/experiences?partner=${partner.slug}`}>
                    View All Experiences
                  </Link>
                </Button>
                <div className="text-sm text-muted-foreground">
                  <p><strong>Established:</strong> {partner.established}</p>
                  <p><strong>Location:</strong> {partner.location.replace(/-/g, ' ')}</p>
                  <p><strong>Active Since:</strong> {new Date().getFullYear() - partner.established} years</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Experiences Carousel */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Available Experiences</h2>
            <Button variant="outline" asChild>
              <Link to={`/experiences?partner=${partner.slug}`}>
                View All <ExternalLink className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {partner.experiences.slice(0, 6).map((experience) => (
              <Card key={experience.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video relative overflow-hidden bg-muted">
                  <img 
                    src={experience.images[0]} 
                    alt={experience.title}
                    className="w-full h-full object-cover" 
                    onError={(e) => {
                      e.currentTarget.src = '/img/ph1.jpg';
                    }}
                  />
                </div>
                <CardHeader className="pb-3">
                  <div className="flex flex-wrap gap-1 mb-2">
                    {experience.themes.slice(0, 2).map((theme) => (
                      <Badge key={theme} className={`text-xs ${getThemeColor(theme)}`}>
                        {theme}
                      </Badge>
                    ))}
                  </div>
                  <CardTitle className="text-lg leading-tight">{experience.title}</CardTitle>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3 flex-shrink-0" />
                    <span className="truncate capitalize">{experience.destination.replace(/-/g, ' ')}</span>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex flex-wrap gap-1 mb-3">
                    {experience.activities.slice(0, 3).map((activity) => (
                      <Badge key={activity} variant="outline" className="text-xs capitalize">
                        {activity}
                      </Badge>
                    ))}
                  </div>
                  
                  <Button asChild size="sm" className="w-full">
                    <Link to={`/experience/${experience.slug}`}>
                      View Experience
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {partner.experiences.length > 6 && (
            <div className="text-center mt-8">
              <Button variant="outline" asChild>
                <Link to={`/experiences?partner=${partner.slug}`}>
                  View All {partner.experiences.length} Experiences
                </Link>
              </Button>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
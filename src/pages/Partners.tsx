import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { MapPin, Users, Calendar, Filter } from "lucide-react";
import { PARTNERS, EXPERIENCES, type Destination, type Theme } from "@/data/partners";
import { useI18n } from "@/i18n/I18nProvider";

const DESTINATIONS: { label: string; value: Destination }[] = [
  { label: "Nairobi", value: "nairobi" },
  { label: "Coastal Kenya", value: "coastal-kenya" },
  { label: "Samburu", value: "samburu" },
  { label: "Masai Mara", value: "masai-mara" },
  { label: "Laikipia", value: "laikipia" }
];

const THEMES: { label: string; value: Theme }[] = [
  { label: "Wildlife Conservation", value: "Wildlife conservation" },
  { label: "Conservation Education", value: "Conservation education" },
  { label: "Community & Cultural Exploration", value: "Community & cultural exploration" },
];

// Extract unique activities from experiences
const ALL_ACTIVITIES = [...new Set(EXPERIENCES.flatMap(exp => exp.activities))].sort();

export default function Partners() {
  const { t } = useI18n();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDestinations, setSelectedDestinations] = useState<Destination[]>([]);
  const [selectedThemes, setSelectedThemes] = useState<Theme[]>([]);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("relevance");
  const [showFilters, setShowFilters] = useState(false);

  // Hide any global booking overlay if it was left open
  useEffect(() => {
    document.querySelectorAll<HTMLElement>(".na-cta-bar,.na-btn-book-fab,.booking-modal").forEach(el => el.style.display = "");
  }, []);

  const getThemeColor = (theme: Theme) => {
    switch (theme) {
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

  const handleDestinationChange = (destination: Destination, checked: boolean) => {
    setSelectedDestinations(prev => 
      checked ? [...prev, destination] : prev.filter(d => d !== destination)
    );
  };

  const handleThemeChange = (theme: Theme, checked: boolean) => {
    setSelectedThemes(prev =>
      checked ? [...prev, theme] : prev.filter(t => t !== theme)
    );
  };

  const handleActivityChange = (activity: string, checked: boolean) => {
    setSelectedActivities(prev =>
      checked ? [...prev, activity] : prev.filter(a => a !== activity)
    );
  };

  const filteredPartners = PARTNERS.filter(partner => {
    const matchesSearch = partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         partner.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDestination = selectedDestinations.length === 0 || 
                              selectedDestinations.some(dest => 
                                partner.location.toLowerCase().includes(dest.replace("-", " "))
                              );
    
    const matchesTheme = selectedThemes.length === 0 ||
                        selectedThemes.some(theme =>
                          partner.themes.includes(theme)
                        );
    
    const matchesActivity = selectedActivities.length === 0 ||
                           selectedActivities.some(activity =>
                             partner.activities.includes(activity)
                           );
    
    return matchesSearch && matchesDestination && matchesTheme && matchesActivity;
  });

  const sortedPartners = [...filteredPartners].sort((a, b) => {
    switch (sortBy) {
      case "az":
        return a.name.localeCompare(b.name);
      case "experiences":
        return b.experienceCount - a.experienceCount;
      default:
        return 0;
    }
  });
  return (
    <main id="site-main">
      {/* Full-width hero */}
      <section className="hero-full bg-gradient-to-r from-foreground/90 to-foreground/70" style={{
        backgroundImage: "url(/src/assets/coastal-forest.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}>
        <div className="hero-inner text-background">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t("partners_title")}</h1>
          <p className="text-xl text-background/90 max-w-3xl">
            {t("partners_subtitle")}
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Search and filters header */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <Input
              placeholder={t("partners_search_placeholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="md:max-w-md"
            />
            <div className="flex items-center gap-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-border rounded-md bg-background"
              >
                <option value="relevance">{t("sort_relevance")}</option>
                <option value="az">{t("sort_az")}</option>
                <option value="experiences">{t("sort_experiences")}</option>
              </select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden"
              >
                <Filter className="h-4 w-4 mr-2" />
                {t("partners_filters")}
              </Button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filter sidebar */}
          <div className={`lg:col-span-1 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <Card className="p-4 sticky top-20">
              <div className="space-y-6">
                {/* Destination filter */}
                <div>
                  <h3 className="font-medium mb-3">{t("filter_destination")}</h3>
                  <div className="space-y-2">
                    {DESTINATIONS.map((dest) => (
                      <div key={dest.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={`dest-${dest.value}`}
                          checked={selectedDestinations.includes(dest.value)}
                          onCheckedChange={(checked) => 
                            handleDestinationChange(dest.value, !!checked)
                          }
                        />
                        <label
                          htmlFor={`dest-${dest.value}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {dest.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Theme filter */}
                <div>
                  <h3 className="font-medium mb-3">{t("filter_theme")}</h3>
                  <div className="space-y-2">
                    {THEMES.map((theme) => (
                      <div key={theme.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={`theme-${theme.value}`}
                          checked={selectedThemes.includes(theme.value)}
                          onCheckedChange={(checked) => 
                            handleThemeChange(theme.value, !!checked)
                          }
                        />
                        <label
                          htmlFor={`theme-${theme.value}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {theme.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Activities filter */}
                <div>
                  <h3 className="font-medium mb-3">{t("filter_activities")}</h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {ALL_ACTIVITIES.map((activity) => (
                      <div key={activity} className="flex items-center space-x-2">
                        <Checkbox
                          id={`activity-${activity}`}
                          checked={selectedActivities.includes(activity)}
                          onCheckedChange={(checked) => 
                            handleActivityChange(activity, !!checked)
                          }
                        />
                        <label
                          htmlFor={`activity-${activity}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 capitalize"
                        >
                          {activity}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            <div className="mb-4">
              <p className="text-sm text-muted-foreground">
                {sortedPartners.length} {t("partners_found")}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {sortedPartners.map(partner => (
                <Card key={partner.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video relative overflow-hidden bg-muted">
                    <img 
                      src={partner.logo} 
                      alt={`${partner.name} conservation work - ${partner.themes.join(', ')} initiatives`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" 
                      onError={(e) => {
                        const target = e.currentTarget;
                        target.src = '/img/ph1.jpg';
                        target.alt = `${partner.name} - Image not available`;
                        target.className = "w-full h-full object-contain p-4 bg-muted-foreground/10";
                      }}
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex flex-wrap gap-1">
                        {partner.themes.slice(0, 2).map((theme) => (
                          <Badge key={theme} className={`text-xs ${getThemeColor(theme)}`}>
                            {theme}
                          </Badge>
                        ))}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {t("partners_established")} {partner.established}
                      </div>
                    </div>
                    <CardTitle className="text-lg leading-tight">{partner.name}</CardTitle>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate capitalize">{partner.location.replace(/-/g, ' ')}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {partner.description}
                    </p>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{t("partners_experiences")}</span>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span className="font-medium">{partner.experienceCount}</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button asChild className="flex-1" size="sm">
                          <Link to={`/partners/${partner.slug}`}>
                            {t("view_partner")}
                          </Link>
                        </Button>
                        <Button variant="outline" asChild size="sm">
                          <Link to={`/experiences?partner=${partner.slug}`}>
                            {t("view_experiences")}
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center mt-16">
          <Card className="inline-block p-8 bg-muted/50">
            <CardContent className="p-0">
              <h2 className="text-2xl font-bold mb-3">{t("partners_become_partner")}</h2>
              <p className="text-muted-foreground mb-6 max-w-md">
                {t("partners_become_partner_desc")}
              </p>
              <Button size="lg">{t("nav_partner")}</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
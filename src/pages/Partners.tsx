import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { MapPin, Users, ExternalLink, Filter, SlidersHorizontal } from "lucide-react";
import { expandedPartnerProfiles } from "@/data/partnerProfiles";
import { useI18n } from "@/i18n/I18nProvider";
const DESTINATIONS = ["Nairobi", "Coastal Kenya", "Samburu", "Masai Mara", "Laikipia"];
const THEMES = ["Wildlife", "Marine", "Community", "Culture"];
const ACTIVITIES = ["Tracking", "Workshop", "Patrol", "Habitat", "Education", "Research"];

export default function Partners() {
  const { t } = useI18n();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDestinations, setSelectedDestinations] = useState<string[]>([]);
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("relevance");
  const [showFilters, setShowFilters] = useState(false);

  // Hide any global booking overlay if it was left open
  useEffect(() => {
    document.querySelectorAll<HTMLElement>(".na-cta-bar,.na-btn-book-fab,.booking-modal").forEach(el => el.style.display = "");
  }, []);

  const getThemeColor = (category: string) => {
    switch (category) {
      case 'Wildlife Conservation':
        return 'bg-wildlife/10 text-wildlife border-wildlife/20';
      case 'Habitat':
        return 'bg-habitat/10 text-habitat border-habitat/20';
      case 'Conservation Education':
        return 'bg-education/10 text-education border-education/20';
      case 'Livelihoods':
        return 'bg-livelihoods/10 text-livelihoods border-livelihoods/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const handleDestinationChange = (destination: string, checked: boolean) => {
    setSelectedDestinations(prev => 
      checked ? [...prev, destination] : prev.filter(d => d !== destination)
    );
  };

  const handleThemeChange = (theme: string, checked: boolean) => {
    setSelectedThemes(prev =>
      checked ? [...prev, theme] : prev.filter(t => t !== theme)
    );
  };

  const handleActivityChange = (activity: string, checked: boolean) => {
    setSelectedActivities(prev =>
      checked ? [...prev, activity] : prev.filter(a => a !== activity)
    );
  };

  const filteredPartners = expandedPartnerProfiles.filter(partner => {
    const matchesSearch = partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         partner.mission.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDestination = selectedDestinations.length === 0 || 
                              selectedDestinations.some(dest => 
                                partner.location.toLowerCase().includes(dest.toLowerCase())
                              );
    
    const matchesTheme = selectedThemes.length === 0 ||
                        selectedThemes.some(theme =>
                          partner.category.toLowerCase().includes(theme.toLowerCase())
                        );
    
    return matchesSearch && matchesDestination && matchesTheme;
  });

  const sortedPartners = [...filteredPartners].sort((a, b) => {
    switch (sortBy) {
      case "az":
        return a.name.localeCompare(b.name);
      case "experiences":
        return (b.communityImpact?.jobs || 0) - (a.communityImpact?.jobs || 0);
      default:
        return 0;
    }
  });
  return (
    <main id="site-main">
      {/* Full-width hero */}
      <section className="hero-full bg-gradient-to-r from-conservation/90 to-conservation/70" style={{
        backgroundImage: "url(/src/assets/coastal-forest.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}>
        <div className="hero-inner text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t("partners_title")}</h1>
          <p className="text-xl text-white/90 max-w-3xl">
            {t("partners_subtitle")}
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Search and filters header */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <Input
              placeholder="Search partners..."
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
                Filters
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
                      <div key={dest} className="flex items-center space-x-2">
                        <Checkbox
                          id={`dest-${dest}`}
                          checked={selectedDestinations.includes(dest)}
                          onCheckedChange={(checked) => 
                            handleDestinationChange(dest, !!checked)
                          }
                        />
                        <label
                          htmlFor={`dest-${dest}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {dest}
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
                      <div key={theme} className="flex items-center space-x-2">
                        <Checkbox
                          id={`theme-${theme}`}
                          checked={selectedThemes.includes(theme)}
                          onCheckedChange={(checked) => 
                            handleThemeChange(theme, !!checked)
                          }
                        />
                        <label
                          htmlFor={`theme-${theme}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {theme}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Activities filter */}
                <div>
                  <h3 className="font-medium mb-3">{t("filter_activities")}</h3>
                  <div className="space-y-2">
                    {ACTIVITIES.map((activity) => (
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
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
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
                {sortedPartners.length} partners found
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {sortedPartners.map(partner => (
                <Card key={partner.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video relative overflow-hidden">
                    <img src={partner.gallery[0]} alt={partner.name} className="w-full h-full object-cover" />
                  </div>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <Badge className={`text-xs ${getThemeColor(partner.category)}`}>
                        {partner.category}
                      </Badge>
                      <div className="text-xs text-muted-foreground">
                        Est. {partner.established}
                      </div>
                    </div>
                    <CardTitle className="text-lg leading-tight">{partner.name}</CardTitle>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">{partner.location}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                      {partner.mission}
                    </p>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{t("jobs_created")}</span>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          <span className="font-medium">{partner.communityImpact.jobs}</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button asChild className="flex-1" size="sm">
                          <Link to={`/partner/${partner.slug}`}>
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
              <h2 className="text-2xl font-bold mb-3">Become a partner</h2>
              <p className="text-muted-foreground mb-6 max-w-md">
                Join our network of conservation partners and connect your organization with travelers who want to make a difference.
              </p>
              <Button size="lg">Partner with us</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
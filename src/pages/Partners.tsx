import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { MapPin, Users, Calendar, Filter, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/i18n/I18nProvider";
import Hero from "@/components/Hero";

interface Partner {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  short_bio: string;
  location_text: string;
  logo_image_url: string;
  created_at: string;
  experience_count?: number;
}

interface Experience {
  id: string;
  partner_id: string;
  themes: string[] | null;
  activities: string[] | null;
}

const DESTINATIONS = [
  { label: "Nairobi", value: "nairobi" },
  { label: "Coastal Kenya", value: "coastal-kenya" },
  { label: "Samburu", value: "samburu" },
  { label: "Masai Mara", value: "masai-mara" },
  { label: "Laikipia", value: "laikipia" }
];

const THEMES = [
  { label: "Wildlife Conservation", value: "Wildlife Conservation" },
  { label: "Conservation Education", value: "Conservation Education" },
  { label: "Community & Cultural Exploration", value: "Community & Cultural Exploration" },
];

export default function Partners() {
  const { t } = useI18n();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDestinations, setSelectedDestinations] = useState<string[]>([]);
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("relevance");
  const [showFilters, setShowFilters] = useState(false);
  const [allActivities, setAllActivities] = useState<string[]>([]);

  useEffect(() => {
    loadPartnersData();
  }, []);

  const loadPartnersData = async () => {
    try {
      setLoading(true);
      
      // Load partners with approved profiles only
      const { data: partnersData, error: partnersError } = await supabase
        .from('partners')
        .select(`
          id,
          slug, 
          name,
          tagline,
          short_bio,
          location_text,
          logo_image_url,
          created_at
        `)
        .order('name');

      if (partnersError) {
        console.error('Partners error:', partnersError);
        setError('Failed to load partners');
        return;
      }

      // Load experiences to get themes and activities, and count per partner
      const { data: experiencesData, error: experiencesError } = await supabase
        .from('experiences')
        .select('id, partner_id, themes, activities')
        .eq('visible_on_marketplace', true);

      if (!experiencesError && experiencesData) {
        // Cast and set experiences data properly
        const typedExperiences: Experience[] = experiencesData.map(exp => ({
          id: exp.id,
          partner_id: exp.partner_id,
          themes: Array.isArray(exp.themes) ? exp.themes as string[] : null,
          activities: Array.isArray(exp.activities) ? exp.activities as string[] : null
        }));
        
        setExperiences(typedExperiences);
        
        // Extract unique activities from all experiences
        const activities = new Set<string>();
        typedExperiences.forEach(exp => {
          if (exp.activities && Array.isArray(exp.activities)) {
            exp.activities.forEach(activity => {
              if (typeof activity === 'string') {
                activities.add(activity);
              }
            });
          }
        });
        setAllActivities(Array.from(activities).sort());

        // Count experiences per partner
        const experienceCounts = typedExperiences.reduce((acc, exp) => {
          acc[exp.partner_id] = (acc[exp.partner_id] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        // Add experience counts to partners
        const partnersWithCounts = partnersData.map(partner => ({
          ...partner,
          experience_count: experienceCounts[partner.id] || 0
        }));
        
        setPartners(partnersWithCounts);
      } else {
        setPartners(partnersData || []);
      }

    } catch (err) {
      console.error('Error loading partners:', err);
      setError('Failed to load partners data');
    } finally {
      setLoading(false);
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

  const getPartnerExperiences = (partnerId: string) => {
    return experiences.filter(exp => exp.partner_id === partnerId);
  };

  const filteredPartners = partners.filter(partner => {
    const matchesSearch = partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (partner.short_bio && partner.short_bio.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesDestination = selectedDestinations.length === 0 || 
                              selectedDestinations.some(dest => 
                                partner.location_text && partner.location_text.toLowerCase().includes(dest.replace("-", " "))
                              );
    
    // Check themes from partner's experiences
    const partnerExperiences = getPartnerExperiences(partner.id);
    const partnerThemes = partnerExperiences.flatMap(exp => 
      exp.themes && Array.isArray(exp.themes) ? exp.themes : []
    );
    const matchesTheme = selectedThemes.length === 0 ||
                        selectedThemes.some(theme => partnerThemes.includes(theme));
    
    // Check activities from partner's experiences
    const partnerActivities = partnerExperiences.flatMap(exp => 
      exp.activities && Array.isArray(exp.activities) ? exp.activities : []
    );
    const matchesActivity = selectedActivities.length === 0 ||
                           selectedActivities.some(activity => partnerActivities.includes(activity));
    
    return matchesSearch && matchesDestination && matchesTheme && matchesActivity;
  });

  const sortedPartners = [...filteredPartners].sort((a, b) => {
    switch (sortBy) {
      case "az":
        return a.name.localeCompare(b.name);
      case "experiences":
        return (b.experience_count || 0) - (a.experience_count || 0);
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading partners...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Unable to load partners</h1>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Button onClick={loadPartnersData}>Try Again</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main id="site-main">
      {/* Use shared Hero component */}
      <Hero 
        title={t("partners_title")}
        subtitle={t("partners_subtitle")}
        backgroundImage="/lovable-uploads/6f27540c-f10d-45f9-ab14-bf5b08197366.png"
        showStats={false}
      />

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
                    {allActivities.map((activity) => (
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

            {sortedPartners.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-foreground mb-2">No partners found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search or filter criteria
                </p>
                <Button onClick={() => {
                  setSearchTerm("");
                  setSelectedDestinations([]);
                  setSelectedThemes([]);
                  setSelectedActivities([]);
                }}>
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {sortedPartners.map(partner => (
                  <Card key={partner.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-video relative overflow-hidden bg-muted">
                      <img 
                        src={partner.logo_image_url || '/img/ph1.jpg'} 
                        alt={`${partner.name} conservation work`}
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
                        <div className="text-xs text-muted-foreground">
                          Conservation Partner
                        </div>
                      </div>
                      <CardTitle className="text-lg leading-tight">{partner.name}</CardTitle>
                      {partner.tagline && (
                        <p className="text-sm text-muted-foreground">{partner.tagline}</p>
                      )}
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate">{partner.location_text || 'Kenya'}</span>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      {partner.short_bio && (
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {partner.short_bio}
                        </p>
                      )}
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{t("partners_experiences")}</span>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span className="font-medium">{partner.experience_count || 0}</span>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button asChild className="flex-1" size="sm">
                            <Link to={`/partner/${partner.slug}`}>
                              {t("view_partner")}
                            </Link>
                          </Button>
                          <Button variant="outline" asChild size="sm">
                            <Link to={`/browse?partner=${partner.slug}`}>
                              {t("view_experiences")}
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="text-center mt-16">
          <Card className="inline-block p-8 bg-muted/50">
            <CardContent className="p-0">
              <h2 className="text-2xl font-bold mb-3">{t("partners_become_partner")}</h2>
              <p className="text-muted-foreground mb-6 max-w-md">
                {t("partners_become_partner_desc")}
              </p>
              <Button size="lg" asChild>
                <Link to="/partner-with-us">{t("nav_partner")}</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
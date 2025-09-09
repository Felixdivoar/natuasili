import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { MapPin, Clock, Users, Search, Filter } from "lucide-react";
import { mockExperiences } from "@/data/newMockData";
import { Destination, Theme } from "@/data/partners";
import { useDestinationFiltering } from "@/hooks/useDestinationFiltering";
import DestinationFilter from "@/components/DestinationFilter";
import ExperienceRatingDisplay from "@/components/ExperienceRatingDisplay";
import { useCurrency } from "@/contexts/CurrencyContext";
import { Link } from "react-router-dom";

const getThemeColor = (theme: string) => {
  switch (theme) {
    case 'Wildlife Conservation':
      return 'bg-wildlife/10 text-wildlife border-wildlife/20';
    case 'Cultural Exploration':
      return 'bg-livelihoods/10 text-livelihoods border-livelihoods/20';
    case 'Conservation Education':
      return 'bg-education/10 text-education border-education/20';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

const ThemeFilter = ({ 
  themes, 
  selectedThemes, 
  onThemeChange 
}: {
  themes: Theme[];
  selectedThemes: Theme[];
  onThemeChange: (themes: Theme[]) => void;
}) => {
  const toggleTheme = (theme: Theme) => {
    if (selectedThemes.includes(theme)) {
      onThemeChange(selectedThemes.filter(t => t !== theme));
    } else {
      onThemeChange([...selectedThemes, theme]);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Themes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {themes.map(theme => (
            <div
              key={theme}
              className={`p-2 rounded cursor-pointer transition-colors ${
                selectedThemes.includes(theme)
                  ? 'bg-primary/10 border border-primary'
                  : 'bg-muted hover:bg-muted/80'
              }`}
              onClick={() => toggleTheme(theme)}
            >
              <span className="text-sm">{theme}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default function DestinationFilterDemo() {
  const { formatPrice } = useCurrency();
  
  const {
    selectedDestinations,
    selectedThemes,
    searchTerm,
    setSelectedDestinations,
    setSelectedThemes,
    setSearchTerm,
    filteredExperiences,
    availableThemes,
    stats,
    clearAllFilters
  } = useDestinationFiltering({ experiences: mockExperiences });

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Destination-Based Experience Filtering</h1>
          <p className="text-muted-foreground text-lg">
            Explore Kenya's conservation experiences organized by destination with consistent durations and capacities.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Search */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Search
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  placeholder="Search experiences..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </CardContent>
            </Card>

            {/* Destination Filter */}
            <DestinationFilter
              selectedDestinations={selectedDestinations}
              onDestinationChange={setSelectedDestinations}
            />

            {/* Theme Filter */}
            <ThemeFilter
              themes={availableThemes}
              selectedThemes={selectedThemes}
              onThemeChange={setSelectedThemes}
            />

            {/* Stats & Clear */}
            <Card>
              <CardHeader>
                <CardTitle>Filter Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">
                  <p>Total Experiences: <strong>{stats.totalExperiences}</strong></p>
                  <p>Filtered Results: <strong>{stats.filteredExperiences}</strong></p>
                  <p>Selected Destinations: <strong>{stats.selectedDestinationsCount}</strong></p>
                  <p>Selected Themes: <strong>{stats.selectedThemesCount}</strong></p>
                </div>
                
                {stats.hasActiveFilters && (
                  <>
                    <Separator />
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={clearAllFilters}
                    >
                      Clear All Filters
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-2">
                Experience Results ({stats.filteredExperiences})
              </h2>
              {stats.hasActiveFilters && (
                <div className="flex flex-wrap gap-2">
                  {selectedDestinations.map(dest => (
                    <Badge key={dest} variant="secondary">
                      {dest.charAt(0).toUpperCase() + dest.slice(1).replace('-', ' ')}
                    </Badge>
                  ))}
                  {selectedThemes.map(theme => (
                    <Badge key={theme} variant="outline">
                      {theme}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredExperiences.map(experience => (
                <Link key={experience.id} to={`/experience/${experience.slug}`}>
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="aspect-[4/3] overflow-hidden bg-muted">
                      <img 
                        src={experience.images[0]} 
                        alt={experience.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <Badge className={`text-xs ${getThemeColor(experience.theme)}`}>
                            {experience.theme}
                          </Badge>
                          <ExperienceRatingDisplay experienceId={experience.id} />
                        </div>

                        <h3 className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-2">
                          {experience.title}
                        </h3>

                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span className="truncate">{experience.location_text}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{experience.duration_hours}h</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            <span>Up to {experience.capacity}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-muted-foreground">From</span>
                            <span className="text-foreground text-base font-extrabold">
                              {formatPrice(experience.base_price)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            {filteredExperiences.length === 0 && (
              <Card className="p-8 text-center">
                <CardContent>
                  <p className="text-muted-foreground">
                    No experiences found matching your criteria. Try adjusting your filters.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
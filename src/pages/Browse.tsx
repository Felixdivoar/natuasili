import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users } from "lucide-react";
import { mockExperiences, mockProjects } from "@/data/mockData";
import { Link } from "react-router-dom";
import { useCurrency } from "@/contexts/CurrencyContext";
import PriceRangeFilter from "@/components/PriceRangeFilter";
import MoreFiltersDialog, { MoreFiltersState } from "@/components/MoreFiltersDialog";

const Browse = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
  
  // Get price bounds from data
  const prices = mockExperiences.map(exp => exp.base_price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  
  // Initialize filters from URL
  const [priceRange, setPriceRange] = useState<[number, number]>([
    parseInt(searchParams.get('price_min') || minPrice.toString()),
    parseInt(searchParams.get('price_max') || maxPrice.toString())
  ]);
  
  // Top-level filters for Browse page
  const [theme, setTheme] = useState(searchParams.get('theme') || 'all');
  const [destination, setDestination] = useState(searchParams.get('destination') || 'all');
  
  const [moreFilters, setMoreFilters] = useState<MoreFiltersState>({
    duration: searchParams.get('duration') || 'all',
    activityImpact: searchParams.get('activity_impact') || 'all',
    availability: searchParams.get('availability') || 'all',
    ageSuitability: searchParams.get('age_suitability') || 'all'
  });

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (priceRange[0] !== minPrice) params.set('price_min', priceRange[0].toString());
    if (priceRange[1] !== maxPrice) params.set('price_max', priceRange[1].toString());
    if (theme !== 'all') params.set('theme', theme);
    if (destination !== 'all') params.set('destination', destination);
    
    Object.entries(moreFilters).forEach(([key, value]) => {
      if (value !== 'all' && value !== '') {
        params.set(key === 'activityImpact' ? 'activity_impact' : key, value);
      }
    });
    
    setSearchParams(params, { replace: true });
  }, [priceRange, theme, destination, moreFilters, minPrice, maxPrice, setSearchParams]);

  const filteredExperiences = mockExperiences.filter(experience => {
    // Price filter
    const matchesPrice = experience.base_price >= priceRange[0] && experience.base_price <= priceRange[1];
    
    // Theme filter
    const matchesTheme = theme === "all" || experience.theme === theme;
    
    // Destination filter - map to regions
    const matchesDestination = destination === "all" || (() => {
      const location = experience.location_text.toLowerCase();
      switch (destination) {
        case 'nairobi': return location.includes('nairobi');
        case 'coast': return location.includes('coast') || location.includes('mombasa') || location.includes('malindi');
        case 'laikipia': return location.includes('laikipia') || location.includes('ol pejeta');
        case 'masai-mara': return location.includes('mara') || location.includes('masai');
        case 'samburu': return location.includes('samburu');
        default: return true;
      }
    })();
    
    // Duration filter
    const matchesDuration = moreFilters.duration === "all" || (() => {
      const hours = experience.duration_hours;
      switch (moreFilters.duration) {
        case '≤2h': return hours <= 2;
        case 'half-day': return hours >= 3 && hours <= 5;
        case 'full-day': return hours >= 6 && hours <= 8;
        case 'multi-day': return hours > 8;
        default: return true;
      }
    })();
    
    // Activity/Impact type filter
    const matchesActivityImpact = moreFilters.activityImpact === "all" || 
      experience.activity_type.toLowerCase().includes(moreFilters.activityImpact.toLowerCase());
    
    return matchesPrice && matchesTheme && matchesDestination && matchesDuration && 
           matchesActivityImpact;
  });

  const getThemeColor = (theme: string) => {
    switch (theme) {
      case 'Wildlife Conservation': return 'bg-conservation text-white';
      case 'Cultural Exploration': return 'bg-accent text-white';
      case 'Conservation Education': return 'bg-primary text-white';
      default: return 'bg-primary text-primary-foreground';
    }
  };
  
  const handleClearFilters = () => {
    setPriceRange([minPrice, maxPrice]);
    setTheme("all");
    setDestination("all");
    setMoreFilters({
      duration: "all", 
      activityImpact: "all",
      availability: "all",
      ageSuitability: "all"
    });
  };

  return (
    <div className="min-h-screen bg-background marketplace-page" data-page="marketplace">
      {/* Filters */}
      <section className="bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Discover conservation experiences
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Book authentic experiences that create lasting impact for wildlife, communities, and habitats across Kenya.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              {/* Price Range Filter */}
              <PriceRangeFilter
                min={minPrice}
                max={maxPrice}
                value={priceRange}
                onChange={setPriceRange}
                className="price-range"
              />
              
              {/* Destination Filter */}
              <Select value={destination} onValueChange={setDestination}>
                <SelectTrigger>
                  <SelectValue placeholder="All destinations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All destinations</SelectItem>
                  <SelectItem value="nairobi">Nairobi</SelectItem>
                  <SelectItem value="coast">Coast</SelectItem>
                  <SelectItem value="laikipia">Laikipia</SelectItem>
                  <SelectItem value="masai-mara">Masai Mara</SelectItem>
                  <SelectItem value="samburu">Samburu</SelectItem>
                </SelectContent>
              </Select>

              {/* Theme Filter */}
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger>
                  <SelectValue placeholder="All themes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All themes</SelectItem>
                  <SelectItem value="Wildlife Conservation">Wildlife conservation</SelectItem>
                  <SelectItem value="Cultural Exploration">Cultural exploration</SelectItem>
                  <SelectItem value="Conservation Education">Conservation education</SelectItem>
                </SelectContent>
              </Select>

              {/* More Filters */}
              <MoreFiltersDialog 
                filters={moreFilters}
                onFiltersChange={setMoreFilters}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <p className="text-muted-foreground">
              Showing {filteredExperiences.length} experiences
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExperiences.map((experience) => {
              const project = mockProjects.find(p => p.id === experience.project_id);
              
              // Determine destination for data attribute
              const getDestination = () => {
                const location = experience.location_text.toLowerCase();
                if (location.includes('nairobi')) return 'nairobi';
                if (location.includes('coast') || location.includes('mombasa') || location.includes('malindi')) return 'coast';
                if (location.includes('laikipia') || location.includes('ol pejeta')) return 'laikipia';
                if (location.includes('mara') || location.includes('masai')) return 'masai-mara';
                if (location.includes('samburu')) return 'samburu';
                return 'other';
              };
              
              return (
                <Card 
                  key={experience.id} 
                  className="overflow-hidden hover:shadow-lg transition-shadow experience-card"
                  data-destination={getDestination()}
                  data-theme={experience.theme.toLowerCase().replace(' ', '-')}
                  data-activity-impact={experience.activity_type.toLowerCase().replace(' ', '-')}
                >
                  <div className="aspect-[3/2] relative bg-muted">
                    {experience.images[0] && (
                      <img
                        src={experience.images[0]}
                        alt={experience.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                    <div className="absolute top-3 left-3 flex gap-2">
                      <Link
                        to={`/marketplace?theme=${encodeURIComponent(experience.theme.toLowerCase().replace(/\s+/g, '-'))}`}
                        className="theme-chip bg-black text-white px-3 py-1 rounded-full text-xs font-medium hover:opacity-90 transition-opacity"
                      >
                        {experience.theme}
                      </Link>
                    </div>
                    <div className="absolute bottom-3 right-3">
                      <div className="bg-primary text-primary-foreground rounded-lg px-2 py-1 shadow-lg price-wrap">
                        <div className="marketplace-price">
                          {formatPrice(experience.base_price)}
                        </div>
                        <div className="text-xs opacity-90">per person</div>
                      </div>
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-lg text-foreground hover:text-primary">
                        <Link to={`/experience/${experience.slug}`}>
                          {experience.title}
                        </Link>
                      </h3>
                    </div>
                    
                    <div className="flex items-center text-sm text-muted-foreground mb-3">
                      <MapPin className="h-4 w-4 mr-1" />
                      {experience.location_text}
                    </div>

                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {experience.description}
                    </p>

                    <div className="flex items-center justify-between mb-4">
                      <div className="text-sm text-foreground">
                        By <Link to={`/projects/${project?.id}`} className="hover:text-primary underline">
                          {project?.name}
                        </Link>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        {experience.capacity} max
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Link to={`/experience/${experience.slug}`} className="flex-1">
                        <Button size="sm" variant="outline" className="w-full">
                          View details
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredExperiences.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No experiences found matching your criteria.</p>
              <Button 
                variant="outline" 
                onClick={handleClearFilters}
                className="mt-4"
              >
                Clear filters
              </Button>
            </div>
          )}
        </div>
      </section>
      
      <div className="pb-12"></div>
    </div>
  );
};

export default Browse;
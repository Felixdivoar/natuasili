import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, MapPin, Users, DollarSign } from "lucide-react";
import { mockExperiences, mockProjects } from "@/data/mockData";
import { Link } from "react-router-dom";
import { useCurrency } from "@/contexts/CurrencyContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Browse = () => {
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTheme, setSelectedTheme] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const { formatPrice } = useCurrency();

  useEffect(() => {
    const themeParam = searchParams.get('theme');
    if (themeParam) {
      setSelectedTheme(themeParam);
    }
  }, [searchParams]);

  const filteredExperiences = mockExperiences.filter(experience => {
    const matchesSearch = experience.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         experience.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTheme = selectedTheme === "all" || experience.theme === selectedTheme;
    const matchesLocation = selectedLocation === "all" || experience.location_text.toLowerCase().includes(selectedLocation.toLowerCase());
    
    return matchesSearch && matchesTheme && matchesLocation;
  });

  const getThemeColor = (theme: string) => {
    switch (theme) {
      case 'Wildlife': return 'bg-wildlife/10 text-wildlife border-wildlife/20';
      case 'Livelihoods': return 'bg-livelihoods/10 text-livelihoods border-livelihoods/20';
      case 'Education': return 'bg-education/10 text-education border-education/20';
      case 'Habitat': return 'bg-habitat/10 text-habitat border-habitat/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      {/* Search and Filters */}
      <section className="bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Discover Conservation Experiences
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Book authentic experiences that create lasting impact for wildlife, communities, and habitats across Kenya.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search experiences..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={selectedTheme} onValueChange={setSelectedTheme}>
                <SelectTrigger>
                  <SelectValue placeholder="All Themes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Themes</SelectItem>
                  <SelectItem value="Wildlife">Wildlife</SelectItem>
                  <SelectItem value="Livelihoods">Livelihoods</SelectItem>
                  <SelectItem value="Education">Education</SelectItem>
                  <SelectItem value="Habitat">Habitat</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="All Locations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="maasai">Maasai Mara</SelectItem>
                  <SelectItem value="amboseli">Amboseli</SelectItem>
                  <SelectItem value="samburu">Samburu</SelectItem>
                  <SelectItem value="tsavo">Tsavo</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                More Filters
              </Button>
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
            <Select defaultValue="relevance">
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Most Relevant</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="newest">Newest First</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExperiences.map((experience) => {
              const project = mockProjects.find(p => p.id === experience.project_id);
              
              return (
                <Card key={experience.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-[3/2] relative bg-muted">
                    {experience.images[0] && (
                      <img
                        src={experience.images[0]}
                        alt={experience.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                    <div className="absolute top-3 left-3 flex gap-2">
                      <Badge className={getThemeColor(experience.theme)}>
                        {experience.theme}
                      </Badge>
                      <Badge variant="secondary" className="bg-background/90 text-foreground">
                        {formatPrice(experience.base_price)}
                      </Badge>
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
                      <div className="text-sm text-muted-foreground">
                        By <Link to={`/project/${project?.slug}`} className="hover:text-primary underline">
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
                          View Details
                        </Button>
                      </Link>
                      <Link to={`/checkout?experience=${experience.id}&quantity=1`} className="flex-1">
                        <Button size="sm" className="w-full bg-conservation hover:bg-conservation/90 text-white">
                          Book Now
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
                onClick={() => {
                  setSearchTerm("");
                  setSelectedTheme("all");
                  setSelectedLocation("all");
                }}
                className="mt-4"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Browse;
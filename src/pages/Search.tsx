import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search as SearchIcon, MapPin, Clock, Users, Calendar, User } from "lucide-react";
import { mockExperiences, mockProjects } from "@/data/mockData";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useI18n } from "@/contexts/I18nContext";

// Mock blog posts for search
const blogPosts = [
  {
    id: 1,
    title: "The Real Impact of Conservation Tourism in Kenya",
    excerpt: "How traveler contributions are transforming wildlife protection efforts across Kenya's most critical habitats.",
    category: "Impact Stories",
    author: "Dr. Sarah Kimani",
    date: "2024-01-15",
    slug: "real-impact-conservation-tourism-kenya",
    type: "blog"
  },
  {
    id: 2,
    title: "Partner Spotlight: Maasai Mara Wildlife Conservancy",
    excerpt: "Meet the team behind one of Kenya's most successful community-led conservation initiatives.",
    category: "Partner Spotlight",
    author: "James Mwangi",
    date: "2024-01-12",
    slug: "partner-spotlight-maasai-mara-conservancy",
    type: "blog"
  }
];

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const { formatPrice } = useCurrency();
  const { t } = useI18n();
  
  const query = searchParams.get('q') || '';

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setSearchParams({ q: searchTerm.trim() });
    }
  };

  // Simple keyword search across all content
  const searchResults = {
    experiences: mockExperiences.filter(exp => 
      exp.title.toLowerCase().includes(query.toLowerCase()) ||
      exp.description.toLowerCase().includes(query.toLowerCase()) ||
      exp.location_text.toLowerCase().includes(query.toLowerCase()) ||
      exp.theme.toLowerCase().includes(query.toLowerCase())
    ),
    partners: mockProjects.filter(project => 
      project.name.toLowerCase().includes(query.toLowerCase()) ||
      project.location_text.toLowerCase().includes(query.toLowerCase())
    ),
    destinations: [
      { name: "Samburu", location: "Northern Kenya", slug: "samburu" },
      { name: "Maasai Mara", location: "Southwestern Kenya", slug: "masai-mara" },
      { name: "Coast", location: "Coastal Kenya", slug: "coast" },
      { name: "Nairobi", location: "Central Kenya", slug: "nairobi" },
      { name: "Laikipia", location: "Central Kenya", slug: "laikipia" }
    ].filter(dest => 
      dest.name.toLowerCase().includes(query.toLowerCase()) ||
      dest.location.toLowerCase().includes(query.toLowerCase())
    ),
    blog: blogPosts.filter(post =>
      post.title.toLowerCase().includes(query.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(query.toLowerCase()) ||
      post.category.toLowerCase().includes(query.toLowerCase())
    )
  };

  const totalResults = searchResults.experiences.length + 
                      searchResults.partners.length + 
                      searchResults.destinations.length + 
                      searchResults.blog.length;

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
      {/* Hero Section */}
      <section className="hero-full py-16 bg-primary/5">
        <div className="hero-inner">
          <h1 className="text-4xl font-bold text-foreground mb-6">
            {t("Search Results", "Search Results")}
          </h1>
          
          {/* Search Form */}
          <form onSubmit={handleSearch} className="max-w-2xl">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t("Search experiences, partners, destinations...", "Search experiences, partners, destinations...")}
                className="pl-10"
              />
              <Button type="submit" className="absolute right-1 top-1 h-8">
                {t("Search", "Search")}
              </Button>
            </div>
          </form>

          {query && (
            <p className="text-muted-foreground mt-4">
              {totalResults} {t("results for", "results for")} "<strong>{query}</strong>"
            </p>
          )}
        </div>
      </section>

      {/* Results */}
      <div className="container mx-auto px-4 py-16">
        {query ? (
          <div className="space-y-12">
            {/* Experiences */}
            {searchResults.experiences.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  {t("Experiences", "Experiences")} ({searchResults.experiences.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {searchResults.experiences.map((experience) => (
                    <Card key={experience.id} className="group hover:shadow-lg transition-shadow overflow-hidden">
                      <div className="relative aspect-[16/10]">
                        <img
                          src={experience.images[0]}
                          alt={experience.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-4 left-4">
                          <Badge className={getThemeColor(experience.theme)}>
                            {experience.theme}
                          </Badge>
                        </div>
                      </div>
                      
                      <CardHeader>
                        <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-2">
                          {experience.title}
                        </CardTitle>
                      </CardHeader>
                      
                      <CardContent>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {experience.location_text}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {experience.duration_hours}h
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div className="text-lg font-bold">
                            {formatPrice(experience.base_price)}
                            <span className="text-sm font-normal text-muted-foreground">/person</span>
                          </div>
                          <Link to={`/experience/${experience.slug}`}>
                            <Button size="sm">
                              {t("View Details", "View Details")}
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {/* Partners */}
            {searchResults.partners.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  {t("Partners", "Partners")} ({searchResults.partners.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {searchResults.partners.map((partner) => (
                    <Card key={partner.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-xl">{partner.name}</CardTitle>
                          <Badge variant="outline">Conservation</Badge>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          {partner.location_text}
                        </div>
                      </CardHeader>
                      
                      <CardContent>
                        <p className="text-muted-foreground mb-4 line-clamp-3">
                          Conservation project in {partner.location_text} supporting local communities and wildlife protection.
                        </p>
                        <Link to={`/projects/${partner.id}`}>
                          <Button variant="outline" className="w-full">
                            {t("View Partner Details", "View Partner Details")}
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {/* Destinations */}
            {searchResults.destinations.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  {t("Destinations", "Destinations")} ({searchResults.destinations.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {searchResults.destinations.map((destination) => (
                    <Card key={destination.slug} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <h3 className="text-xl font-semibold mb-2">{destination.name}</h3>
                        <div className="flex items-center gap-1 text-muted-foreground mb-4">
                          <MapPin className="h-4 w-4" />
                          {destination.location}
                        </div>
                        <Link to={`/destinations/${destination.slug}`}>
                          <Button variant="outline" className="w-full">
                            {t("Explore Destination", "Explore Destination")}
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {/* Blog */}
            {searchResults.blog.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  {t("Stories & Insights", "Stories & Insights")} ({searchResults.blog.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {searchResults.blog.map((post) => (
                    <Card key={post.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex justify-between items-start mb-2">
                          <Badge variant="outline">{post.category}</Badge>
                        </div>
                        <CardTitle className="text-lg line-clamp-2">{post.title}</CardTitle>
                      </CardHeader>
                      
                      <CardContent>
                        <p className="text-muted-foreground mb-4 line-clamp-3">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {post.author}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(post.date).toLocaleDateString()}
                          </div>
                        </div>
                        <Link to={`/blog/${post.slug}`}>
                          <Button variant="outline" className="w-full">
                            {t("Read More", "Read More")}
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {totalResults === 0 && (
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  {t("No results found", "No results found")}
                </h2>
                <p className="text-muted-foreground mb-6">
                  {t("Try searching with different keywords or browse our categories", "Try searching with different keywords or browse our categories")}
                </p>
                <div className="flex gap-4 justify-center">
                  <Link to="/marketplace">
                    <Button variant="outline">{t("Browse Experiences", "Browse Experiences")}</Button>
                  </Link>
                  <Link to="/partners">
                    <Button variant="outline">{t("View Partners", "View Partners")}</Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              {t("Start searching", "Start searching")}
            </h2>
            <p className="text-muted-foreground">
              {t("Enter keywords to search across experiences, partners, destinations, and stories", "Enter keywords to search across experiences, partners, destinations, and stories")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
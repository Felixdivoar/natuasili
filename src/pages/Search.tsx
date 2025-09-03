import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Search as SearchIcon, Calendar } from "lucide-react";
import { PARTNERS, EXPERIENCES, type Theme } from "@/data/partners";
import { mockExperiences } from "@/data/mockData";
import { useI18n } from "@/i18n/I18nProvider";

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useI18n();
  const [query, setQuery] = useState(searchParams.get('q') || '');

  useEffect(() => {
    const urlQuery = searchParams.get('q');
    if (urlQuery) {
      setQuery(urlQuery);
    }
  }, [searchParams]);

  const getThemeColor = (theme: Theme) => {
    switch (theme) {
      case 'Wildlife conservation':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'Conservation education':
        return 'bg-secondary/10 text-secondary border-secondary/20';
      case 'Community and Cultural exploration':
        return 'bg-accent/10 text-accent border-accent/20';
      default:
        return 'bg-muted text-muted-foreground border-muted/20';
    }
  };

  // Simple search functionality
  const searchResults = {
    experiences: EXPERIENCES.filter(exp => 
      !query || 
      exp.title.toLowerCase().includes(query.toLowerCase()) ||
      exp.partner.toLowerCase().includes(query.toLowerCase()) ||
      exp.themes.some(theme => theme.toLowerCase().includes(query.toLowerCase())) ||
      exp.activities.some(activity => activity.toLowerCase().includes(query.toLowerCase()))
    ).slice(0, 12),
    
    partners: PARTNERS.filter(partner => 
      !query ||
      partner.name.toLowerCase().includes(query.toLowerCase()) ||
      partner.description.toLowerCase().includes(query.toLowerCase()) ||
      partner.themes.some(theme => theme.toLowerCase().includes(query.toLowerCase()))
    ).slice(0, 8),
    
    mockExperiences: mockExperiences.filter(exp =>
      !query ||
      exp.title.toLowerCase().includes(query.toLowerCase()) ||
      exp.theme.toLowerCase().includes(query.toLowerCase()) ||
      exp.description.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 6)
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) {
      params.set('q', query.trim());
    }
    setSearchParams(params);
  };

  const totalResults = searchResults.experiences.length + searchResults.partners.length + searchResults.mockExperiences.length;

  return (
    <>
      {/* Full-width hero */}
      <section className="hero-full bg-gradient-to-r from-foreground/90 to-foreground/70">
        <div className="hero-inner text-background">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Search Conservation Experiences</h1>
          <p className="text-xl text-background/90 max-w-3xl mb-8">
            Find experiences, partners, and stories that match your interests
          </p>
          
          <form onSubmit={handleSearch} className="max-w-md mx-auto">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Search experiences, partners, themes..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="bg-background/10 border-background/20 text-background placeholder:text-background/70"
              />
              <Button type="submit" variant="outline" className="bg-background/10 border-background/20 text-background hover:bg-background/20">
                <SearchIcon className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-10">
        {query && (
          <div className="mb-8">
            <p className="text-muted-foreground">
              {totalResults > 0 
                ? `Found ${totalResults} results for "${query}"`
                : `No results found for "${query}"`
              }
            </p>
          </div>
        )}

        <Tabs defaultValue="all" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 max-w-md">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="experiences">Experiences</TabsTrigger>
            <TabsTrigger value="partners">Partners</TabsTrigger>
            <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-12">
            {/* Partners Section */}
            {searchResults.partners.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Partners</h2>
                  <Button variant="outline" asChild>
                    <Link to="/partners">View All Partners</Link>
                  </Button>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {searchResults.partners.map(partner => (
                    <Card key={partner.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex flex-wrap gap-1 mb-2">
                          {partner.themes.slice(0, 2).map((theme) => (
                            <Badge key={theme} className={`text-xs ${getThemeColor(theme)}`}>
                              {theme}
                            </Badge>
                          ))}
                        </div>
                        <CardTitle className="text-lg">{partner.name}</CardTitle>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span className="capitalize">{partner.location.replace(/-/g, ' ')}</span>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {partner.description}
                        </p>
                        <div className="flex gap-2">
                          <Button asChild size="sm" className="flex-1">
                            <Link to={`/partners/${partner.slug}`}>View Partner</Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {/* New Partner Experiences Section */}
            {searchResults.experiences.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Conservation Experiences</h2>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {searchResults.experiences.map(experience => (
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
                          <Link to={`/experience/${experience.slug}`}>View Experience</Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {/* Marketplace Experiences */}
            {searchResults.mockExperiences.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Marketplace</h2>
                  <Button variant="outline" asChild>
                    <Link to="/experiences">View All Experiences</Link>
                  </Button>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {searchResults.mockExperiences.map(experience => (
                    <Card key={experience.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="aspect-video relative bg-muted">
                        {experience.images[0] && (
                          <img src={experience.images[0]} alt={experience.title} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <CardHeader className="pb-3">
                        <Badge className="w-fit mb-2 text-xs">
                          {experience.theme}
                        </Badge>
                        <CardTitle className="text-lg">{experience.title}</CardTitle>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span>{experience.location_text}</span>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {experience.description}
                        </p>
                        <Button asChild size="sm" className="w-full">
                          <Link to={`/experience/${experience.slug}`}>View Experience</Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}
          </TabsContent>

          <TabsContent value="experiences">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.experiences.map(experience => (
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
                      <Link to={`/experience/${experience.slug}`}>View Experience</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="partners">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.partners.map(partner => (
                <Card key={partner.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex flex-wrap gap-1 mb-2">
                      {partner.themes.slice(0, 2).map((theme) => (
                        <Badge key={theme} className={`text-xs ${getThemeColor(theme)}`}>
                          {theme}
                        </Badge>
                      ))}
                    </div>
                    <CardTitle className="text-lg">{partner.name}</CardTitle>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span className="capitalize">{partner.location.replace(/-/g, ' ')}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {partner.description}
                    </p>
                    <div className="flex gap-2">
                      <Button asChild size="sm" className="flex-1">
                        <Link to={`/partners/${partner.slug}`}>View Partner</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="marketplace">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.mockExperiences.map(experience => (
                <Card key={experience.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video relative bg-muted">
                    {experience.images[0] && (
                      <img src={experience.images[0]} alt={experience.title} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <CardHeader className="pb-3">
                    <Badge className="w-fit mb-2 text-xs">
                      {experience.theme}
                    </Badge>
                    <CardTitle className="text-lg">{experience.title}</CardTitle>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span>{experience.location_text}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {experience.description}
                    </p>
                    <Button asChild size="sm" className="w-full">
                      <Link to={`/experience/${experience.slug}`}>View Experience</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {!query && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Enter a search term to discover conservation experiences, partners, and stories.
            </p>
          </div>
        )}

        {query && totalResults === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No results found for "{query}". Try different keywords or browse our{" "}
              <Link to="/partners" className="underline">partners</Link> and{" "}
              <Link to="/experiences" className="underline">experiences</Link>.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
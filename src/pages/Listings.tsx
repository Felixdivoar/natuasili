import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Calendar, Clock } from "lucide-react";
import { EXPERIENCES } from "@/data/partners";

export default function Listings() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("relevance");

  // Hide any global booking overlay if it was left open
  useEffect(() => {
    document.querySelectorAll<HTMLElement>(".na-cta-bar,.na-btn-book-fab,.booking-modal").forEach(el => el.style.display = "");
  }, []);

  const filteredExperiences = EXPERIENCES.filter(experience => {
    const matchesSearch = experience.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         experience.partner.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         experience.activities.some(activity => activity.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesSearch;
  });

  const sortedExperiences = [...filteredExperiences].sort((a, b) => {
    switch (sortBy) {
      case "az":
        return a.title.localeCompare(b.title);
      case "partner":
        return a.partner.localeCompare(b.partner);
      default:
        return 0;
    }
  });

  const getThemeColor = (theme: string) => {
    switch (theme) {
      case 'wildlife':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'marine':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'community':
        return 'bg-secondary/10 text-secondary border-secondary/20';
      case 'culture':
        return 'bg-accent/10 text-accent border-accent/20';
      default:
        return 'bg-muted text-muted-foreground border-muted/20';
    }
  };

  return (
    <main id="site-main">
      {/* Full-width hero */}
      <section className="hero-full bg-gradient-to-r from-foreground/90 to-foreground/70" style={{
        backgroundImage: "url(/src/assets/hero-conservation.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}>
        <div className="hero-inner text-background">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Conservation Experiences</h1>
          <p className="text-xl text-background/90 max-w-3xl">
            Discover meaningful conservation experiences across Kenya's most pristine destinations
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Search and filters header */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <Input
              placeholder="Search experiences..."
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
                <option value="relevance">Sort by Relevance</option>
                <option value="az">Sort A-Z</option>
                <option value="partner">Sort by Partner</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            {sortedExperiences.length} experiences found
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedExperiences.map(experience => (
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
                <div className="text-sm text-muted-foreground">
                  by {experience.partner}
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
                
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>4-6 hours</span>
                  </div>
                  <div className="text-lg font-bold">
                    $120
                  </div>
                </div>
                
                <Button asChild size="sm" className="w-full">
                  <Link to={`/listings/${experience.slug}`}>
                    View Experience
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {sortedExperiences.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium mb-2">No experiences found</h3>
            <p className="text-muted-foreground">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </main>
  );
}
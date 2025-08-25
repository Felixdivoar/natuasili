import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Users, Star } from "lucide-react";
import { mockExperiences, mockProjects } from "@/data/mockData";
import { useCurrency } from "@/contexts/CurrencyContext";

interface RelatedExperiencesProps {
  currentExperienceId: number;
  theme: string;
  destination: string;
  maxResults?: number;
}

const RelatedExperiences: React.FC<RelatedExperiencesProps> = ({
  currentExperienceId,
  theme,
  destination,
  maxResults = 4
}) => {
  const { formatPrice } = useCurrency();
  
  // Filter related experiences with priority order
  const getRelatedExperiences = () => {
    let related = mockExperiences.filter(exp => Number(exp.id) !== Number(currentExperienceId));
    
    // Priority 1: Same theme
    const sameTheme = related.filter(exp => exp.theme === theme);
    
    // Priority 2: Same destination/region
    const sameDestination = related.filter(exp => 
      exp.location_text.toLowerCase().includes(destination.toLowerCase()) ||
      destination.toLowerCase().includes(exp.location_text.toLowerCase())
    );
    
    // Priority 3: Highest rated or most popular (simulate with random selection)
    const popular = related.sort((a, b) => b.base_price - a.base_price);
    
    // Combine with priority order, avoiding duplicates
    const combined: any[] = [];
    const addUnique = (experiences: typeof mockExperiences) => {
      experiences.forEach(exp => {
        if (!combined.find((c: any) => Number(c.id) === Number(exp.id)) && combined.length < maxResults) {
          combined.push(exp);
        }
      });
    };
    
    addUnique(sameTheme);
    addUnique(sameDestination);
    addUnique(popular);
    
    return combined.slice(0, maxResults);
  };

  const getThemeColor = (theme: string) => {
    switch (theme) {
      case 'Wildlife': return 'bg-wildlife/10 text-wildlife border-wildlife/20';
      case 'Livelihoods': return 'bg-livelihoods/10 text-livelihoods border-livelihoods/20';
      case 'Education': return 'bg-education/10 text-education border-education/20';
      case 'Habitat': return 'bg-habitat/10 text-habitat border-habitat/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const relatedExperiences = getRelatedExperiences();

  if (relatedExperiences.length === 0) {
    return null;
  }

  return (
    <section className="py-12">
      <h2 className="text-2xl font-bold text-foreground mb-6">
        You might also like…
      </h2>
      
      <div className="related-experiences relative" id="related-experiences">
        <div className="carousel-container overflow-hidden">
          <div className="track flex gap-4 transition-transform duration-300 ease-in-out overflow-x-auto">
            {relatedExperiences.slice(0, 5).map((experience: any, index: number) => {
              const project = mockProjects.find(p => p.id === experience.project_id);
              
              return (
                <Card key={experience.id} className="card flex-shrink-0 w-full md:w-[calc(50%-0.5rem)] min-w-[280px] overflow-hidden hover:shadow-lg transition-shadow group">
                  <div className="aspect-[4/3] relative">
                    <img
                      src={experience.images[0]}
                      alt={experience.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge className={getThemeColor(experience.theme)}>
                        {experience.theme}
                      </Badge>
                    </div>
                    <div className="absolute top-3 right-3">
                      <div className="bg-background/90 backdrop-blur-sm rounded-lg px-2 py-1">
                        <div className="text-sm font-bold text-foreground">
                          {formatPrice(experience.base_price)}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-base mb-2 line-clamp-2">
                      {experience.title}
                    </h3>
                    
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {experience.location_text}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {experience.capacity}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-4 text-xs">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-primary text-primary" />
                        <span>4.8</span>
                      </div>
                      {project && (
                        <span className="text-muted-foreground">
                          by {project.name}
                        </span>
                      )}
                    </div>

                    <Link to={`/experience/${experience.slug}`}>
                      <Button size="sm" variant="outline" className="w-full view-experience">
                        View Experience
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
        
        {relatedExperiences.length > 2 && (
          <div className="nav absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between items-center pointer-events-none px-2">
            <button 
              className="prev pointer-events-auto w-10 h-10 rounded-full border border-border bg-background shadow-md flex items-center justify-center hover:bg-muted transition-colors z-10"
              aria-label="Previous"
            >
              ‹
            </button>
            <button 
              className="next pointer-events-auto w-10 h-10 rounded-full border border-border bg-background shadow-md flex items-center justify-center hover:bg-muted transition-colors z-10"
              aria-label="Next"
            >
              ›
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default RelatedExperiences;
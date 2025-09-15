import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Sparkles, MapPin, Clock, Users, TrendingUp } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { EXPERIENCES } from '@/data/partners';
import { Link } from 'react-router-dom';

interface Recommendation {
  experience_id: string;
  title: string;
  description: string;
  location_text: string;
  price_kes_adult: number;
  duration_hours: number;
  categories: string[];
  hero_image?: string;
  confidence_score: number;
  recommendation_reason: string;
  slug?: string;
}

interface PopularExperience {
  id: string;
  title: string;
  description: string;
  locationText: string;
  priceKESAdult: number;
  durationHours: number;
  themes: string[];
  heroImage: string;
  slug: string;
}

const SmartRecommendations: React.FC = () => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [popularExperiences, setPopularExperiences] = useState<PopularExperience[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();

  // Get popular experiences for non-logged-in users
  const getPopularExperiences = () => {
    // Select 6 featured experiences from different destinations
    const featured = [
      EXPERIENCES.find(exp => exp.title.includes("Northern white rhinos")),
      EXPERIENCES.find(exp => exp.title.includes("Night game drive")),
      EXPERIENCES.find(exp => exp.title.includes("Sera Conservancy")),
      EXPERIENCES.find(exp => exp.title.includes("Giraffe Centre")),
      EXPERIENCES.find(exp => exp.title.includes("Koija Cultural Village")),
      EXPERIENCES.find(exp => exp.title.includes("Colobus Conservation"))
    ].filter(exp => exp !== undefined) as PopularExperience[];

    setPopularExperiences(featured.slice(0, 6));
  };

  const fetchRecommendations = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('experience-recommendations', {
        body: {
          userId: user.id,
          limit: 6
        }
      });

      if (error) throw error;

      setRecommendations(data.recommendations || []);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch personalized recommendations',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchRecommendations();
    } else {
      getPopularExperiences();
    }
  }, [user]);

  return (
    <Card className="w-full max-w-6xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {user ? (
            <>
              <Sparkles className="h-5 w-5 text-primary" />
              Smart Recommendations for You
            </>
          ) : (
            <>
              <TrendingUp className="h-5 w-5 text-primary" />
              Popular Conservation Experiences
            </>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="flex justify-between items-center">
          <p className="text-muted-foreground">
            {user 
              ? "AI-powered recommendations based on your preferences and conservation impact"
              : "Discover Kenya's most popular wildlife conservation experiences"
            }
          </p>
          {user && (
            <Button 
              onClick={fetchRecommendations}
              disabled={isLoading}
              variant="outline"
              size="sm"
            >
              {isLoading ? 'Loading...' : 'Refresh'}
            </Button>
          )}
        </div>

        {isLoading ? (
          <Carousel className="w-full">
            <CarouselContent className="-ml-2 md:-ml-4">
              {[...Array(6)].map((_, i) => (
                <CarouselItem key={i} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                  <div className="h-80 bg-muted animate-pulse rounded-lg" />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="-left-4" />
            <CarouselNext className="-right-4" />
          </Carousel>
        ) : user ? (
          // Personalized recommendations for logged-in users
          recommendations.length > 0 ? (
            <Carousel className="w-full">
              <CarouselContent className="-ml-2 md:-ml-4">
                {recommendations.map((rec, index) => (
                  <CarouselItem key={`${rec.experience_id}-${index}`} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                    <Card className="group hover:shadow-lg transition-shadow h-full">
                      <div className="aspect-video bg-muted rounded-t-lg flex items-center justify-center">
                        {rec.hero_image ? (
                          <img 
                            src={rec.hero_image} 
                            alt={rec.title}
                            className="w-full h-full object-cover rounded-t-lg"
                          />
                        ) : (
                          <MapPin className="h-8 w-8 text-muted-foreground" />
                        )}
                      </div>
                      
                      <CardContent className="p-4 space-y-3">
                        <div className="flex justify-between items-start">
                          <h3 className="font-semibold text-sm line-clamp-2">{rec.title}</h3>
                          <Badge variant="secondary" className="text-xs">
                            {Math.round(rec.confidence_score * 100)}%
                          </Badge>
                        </div>
                        
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {rec.description}
                        </p>
                        
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            <span className="line-clamp-1">{rec.location_text}</span>
                          </div>
                          
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{rec.duration_hours}h</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              <span>KES {rec.price_kes_adult.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-1">
                          {rec.categories.slice(0, 2).map((category, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {category}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="p-2 bg-muted/50 rounded text-xs">
                          <p className="text-muted-foreground">
                            <strong>Why:</strong> {rec.recommendation_reason}
                          </p>
                        </div>
                        
                        <Button className="w-full" size="sm" asChild>
                          <Link to={`/experience/${rec.slug || rec.experience_id}`}>
                            View Experience
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="-left-4" />
              <CarouselNext className="-right-4" />
            </Carousel>
          ) : (
            <div className="text-center py-8">
              <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Recommendations Yet</h3>
              <p className="text-muted-foreground">
                Complete your profile and book some experiences to get personalized recommendations!
              </p>
            </div>
          )
        ) : (
          // Popular experiences for non-logged-in users
          <Carousel className="w-full">
            <CarouselContent className="-ml-2 md:-ml-4">
              {popularExperiences.map((exp, index) => (
                <CarouselItem key={`${exp.id}-${index}`} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                  <Card className="group hover:shadow-lg transition-shadow h-full">
                    <div className="aspect-video bg-muted rounded-t-lg flex items-center justify-center">
                      <img 
                        src={exp.heroImage} 
                        alt={exp.title}
                        className="w-full h-full object-cover rounded-t-lg"
                      />
                    </div>
                    
                    <CardContent className="p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-sm line-clamp-2">{exp.title}</h3>
                        <Badge variant="secondary" className="text-xs">
                          Popular
                        </Badge>
                      </div>
                      
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {exp.description.split('\n')[0]}
                      </p>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span className="line-clamp-1">{exp.locationText}</span>
                        </div>
                        
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{exp.durationHours}h</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            <span>KES {exp.priceKESAdult.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {exp.themes.slice(0, 2).map((theme, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {theme}
                          </Badge>
                        ))}
                      </div>
                      
                      <Button className="w-full" size="sm" asChild>
                        <Link to={`/experience/${exp.slug}`}>
                          View Experience
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="-left-4" />
            <CarouselNext className="-right-4" />
          </Carousel>
        )}
      </CardContent>
    </Card>
  );
};

export default SmartRecommendations;
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { MapPin, Users, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { mockExperiences, mockProjects } from "@/data/mockData";
import { useCurrency } from "@/contexts/CurrencyContext";

const ExperienceCarousel = () => {
  const { formatPrice } = useCurrency();

  const getThemeColor = (theme: string) => {
    switch (theme) {
      case 'Wildlife': return 'bg-conservation/10 text-conservation border-conservation/20';
      case 'Livelihoods': return 'bg-primary/10 text-primary border-primary/20';
      case 'Education': return 'bg-accent/10 text-accent border-accent/20';
      case 'Habitat': return 'bg-conservation/10 text-conservation border-conservation/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Featured Conservation Experiences
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover authentic experiences that create lasting impact for wildlife, 
            communities, and habitats across Kenya.
          </p>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {mockExperiences.map((experience) => {
              const project = mockProjects.find(p => p.id === experience.project_id);
              
              return (
                <CarouselItem key={experience.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                  <Card className="group hover:shadow-lg transition-shadow overflow-hidden h-full">
                    <div className="relative aspect-[4/3]">
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
                    
                    <CardContent className="p-6 flex flex-col flex-grow">
                      <div className="flex-grow">
                        <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                          {experience.title}
                        </h3>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {experience.location_text}
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            Up to {experience.capacity}
                          </div>
                        </div>

                        <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                          {experience.description}
                        </p>

                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-primary text-primary" />
                            <span className="text-sm font-medium">4.8</span>
                          </div>
                          {project && (
                            <Link to={`/partner/${project.slug}`}>
                              <Badge variant="outline" className="hover:bg-muted text-xs">
                                by {project.name}
                              </Badge>
                            </Link>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="text-right">
                          <div className="text-2xl font-bold text-foreground">
                            {formatPrice(experience.base_price)}
                          </div>
                          <div className="text-sm text-muted-foreground">per person</div>
                        </div>
                        <Link to={`/experience/${experience.slug}`}>
                          <Button className="bg-conservation hover:bg-conservation/90 text-white">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex -left-4" />
          <CarouselNext className="hidden md:flex -right-4" />
        </Carousel>
      </div>
    </section>
  );
};

export default ExperienceCarousel;
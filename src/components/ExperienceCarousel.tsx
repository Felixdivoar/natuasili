import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, useCarousel } from "@/components/ui/carousel";
import { MapPin, Users, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { mockExperiences, mockProjects } from "@/data/mockData";
import { useCurrency } from "@/contexts/CurrencyContext";
const CarouselControls = () => {
  const {
    scrollPrev,
    scrollNext,
    canScrollPrev,
    canScrollNext
  } = useCarousel();
  return <div className="flex justify-center gap-2 mt-8">
      <Button variant="outline" size="icon" className="rounded-full w-10 h-10 border-2 border-primary/20 hover:bg-primary hover:text-primary-foreground" onClick={scrollPrev} disabled={!canScrollPrev}>
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon" className="rounded-full w-10 h-10 border-2 border-primary/20 hover:bg-primary hover:text-primary-foreground" onClick={scrollNext} disabled={!canScrollNext}>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>;
};
const ExperienceCarousel = () => {
  const {
    formatPrice
  } = useCurrency();
  const getThemeColor = (theme: string) => {
    switch (theme) {
      case 'Wildlife':
        return 'bg-conservation/10 text-conservation border-conservation/20';
      case 'Livelihoods':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'Education':
        return 'bg-accent/10 text-accent border-accent/20';
      case 'Habitat':
        return 'bg-conservation/10 text-conservation border-conservation/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };
  return <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <div className="text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-left">Featured conservation experiences</h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Discover authentic experiences that create lasting impact for wildlife, 
              communities, and habitats across Kenya.
            </p>
          </div>
          <Link to="/marketplace">
            <Button variant="outline" className="hidden md:block">View all experiences</Button>
          </Link>
        </div>

        <Carousel opts={{
        align: "start",
        loop: true
      }} className="w-full">
          <CarouselContent className="-ml-2 md:-ml-4">
            {mockExperiences.map(experience => {
            const project = mockProjects.find(p => p.id === experience.project_id);
            return <CarouselItem key={experience.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                  <Card className="group hover:shadow-lg transition-shadow overflow-hidden h-full">
                    <div className="relative aspect-[4/3]">
                      <img src={experience.images[0]} alt={experience.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
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
                          {project && <Link to={`/partner/${project.slug}`}>
                              <Badge variant="outline" className="hover:bg-muted text-xs">
                                by {project.name}
                              </Badge>
                            </Link>}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="text-left">
                          <div className="text-2xl font-bold text-foreground">
                            {formatPrice(experience.base_price)}
                          </div>
                          <div className="text-sm text-muted-foreground">per person</div>
                        </div>
                        <div className="flex gap-2">
                          <Link to={`/experience/${experience.slug}`}>
                            <Button variant="outline" size="sm">View details</Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>;
          })}
          </CarouselContent>
          <div className="hidden md:block">
            <CarouselPrevious className="-left-6 bg-background border-2 border-primary/20 hover:bg-primary hover:text-primary-foreground rounded-full w-12 h-12" />
            <CarouselNext className="-right-6 bg-background border-2 border-primary/20 hover:bg-primary hover:text-primary-foreground rounded-full w-12 h-12" />
          </div>
          <div className="md:hidden">
            <CarouselControls />
          </div>
        </Carousel>
      </div>
    </section>;
};
export default ExperienceCarousel;
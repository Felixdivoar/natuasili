import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, useCarousel } from "@/components/ui/carousel";
import { MapPin, Users, Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { mockProjects } from "@/data/mockData";
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
const ConservationPartnersCarousel = () => {
  const displayProjects = mockProjects.slice(0, 6);
  return <section id="projects" className="bg-muted/30 py-[20px]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-center">Conservation partners</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-center">
            Meet the dedicated organizations working tirelessly to protect Kenya's 
            natural heritage and support local communities.
          </p>
        </div>
        
        <Carousel opts={{
        align: "start",
        loop: true
      }} className="w-full">
          <CarouselContent className="-ml-2 md:-ml-4">
            {displayProjects.map(project => <CarouselItem key={project.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                <Card className="group hover:shadow-lg transition-shadow overflow-hidden h-full">
                  <div className="relative aspect-[4/3]">
                    <img src={project.hero_image} alt={`${project.name} conservation partner - ${project.category} work in ${project.location_text}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" onError={e => {
                  const target = e.currentTarget;
                  target.src = '/img/ph1.jpg';
                  target.alt = `${project.name} - Image not available`;
                  target.className = "w-full h-full object-contain p-4 bg-muted-foreground/10";
                }} loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-conservation text-white">
                        {project.category}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardHeader>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      {project.name}
                    </CardTitle>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {project.location_text}
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                      {project.bio}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-6 p-3 bg-muted/50 rounded-lg">
                      <div className="text-center">
                        <div className="text-lg font-bold text-conservation">{project.metrics_bookings_count}</div>
                        <div className="text-xs text-muted-foreground">Bookings</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-conservation">${project.metrics_funds_total.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">Funds Raised</div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Link to={`/partner/${project.slug}`}>
                        <Button className="w-full bg-conservation hover:bg-conservation/90 text-white">
                          <Heart className="w-4 h-4 mr-2" />
                          View Partner
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>)}
          </CarouselContent>
          <div className="hidden md:block">
            <CarouselPrevious className="-left-6 bg-background border-2 border-primary/20 hover:bg-primary hover:text-primary-foreground rounded-full w-12 h-12" />
            <CarouselNext className="-right-6 bg-background border-2 border-primary/20 hover:bg-primary hover:text-primary-foreground rounded-full w-12 h-12" />
          </div>
          <div className="md:hidden">
            <CarouselControls />
          </div>
        </Carousel>

        <div className="text-center mt-8">
          <Link to="/partners">
            <Button variant="outline" size="lg">
              View All Partners
            </Button>
          </Link>
        </div>
      </div>
    </section>;
};
export default ConservationPartnersCarousel;
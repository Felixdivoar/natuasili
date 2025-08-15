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
import { MapPin, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { mockProjects } from "@/data/mockData";

const ConservationPartnersCarousel = () => {
  const displayProjects = mockProjects.slice(0, 6);

  return (
    <section id="projects" className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Conservation Partners
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Meet the dedicated organizations working tirelessly to protect Kenya's 
            natural heritage and support local communities.
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
            {displayProjects.map((project) => (
              <CarouselItem key={project.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                <Card className="group hover:shadow-lg transition-shadow overflow-hidden h-full">
                  <div className="relative aspect-[4/3]">
                    <img
                      src={project.hero_image}
                      alt={project.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-conservation text-white">
                        {project.category}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardContent className="p-6 flex flex-col flex-grow">
                    <div className="flex-grow">
                      <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-conservation transition-colors">
                        {project.name}
                      </h3>
                      
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                        <MapPin className="h-4 w-4" />
                        {project.location_text}
                      </div>

                      <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                        {project.bio}
                      </p>

                      <div className="grid grid-cols-2 gap-4 mb-4 text-xs">
                        <div>
                          <div className="font-semibold text-foreground">500+</div>
                          <div className="text-muted-foreground">Wildlife Protected</div>
                        </div>
                        <div>
                          <div className="font-semibold text-foreground">2,000+</div>
                          <div className="text-muted-foreground">Community Members</div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t space-y-2">
                      <Link to={`/projects/${project.id}`}>
                        <Button className="w-full bg-conservation hover:bg-conservation/90 text-white">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View Partner
                        </Button>
                      </Link>
                      <Link to={`/marketplace?partner=${project.name.toLowerCase().replace(/\s+/g, '-')}`}>
                        <Button variant="outline" className="w-full">
                          View Experiences
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex -left-4" />
          <CarouselNext className="hidden md:flex -right-4" />
        </Carousel>

        <div className="text-center mt-8">
          <Link to="/partners">
            <Button variant="outline" size="lg">
              View All Partners
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ConservationPartnersCarousel;
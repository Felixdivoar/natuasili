import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { TreePine, Users, GraduationCap, Leaf, Heart, Shield } from "lucide-react";

const themes = [
  {
    id: 1,
    name: "Wildlife Conservation",
    description: "Protect endangered species and their habitats",
    icon: TreePine,
    color: "bg-conservation text-white",
    borderColor: "border-conservation/20"
  },
  {
    id: 2,
    name: "Community Livelihoods", 
    description: "Empower local communities through sustainable practices",
    icon: Users,
    color: "bg-primary text-white",
    borderColor: "border-primary/20"
  },
  {
    id: 3,
    name: "Environmental Education",
    description: "Build awareness and knowledge for conservation",
    icon: GraduationCap,
    color: "bg-accent text-white",
    borderColor: "border-accent/20"
  },
  {
    id: 4,
    name: "Habitat Restoration",
    description: "Restore degraded ecosystems and protect biodiversity",
    icon: Leaf,
    color: "bg-conservation text-white", 
    borderColor: "border-conservation/20"
  },
  {
    id: 5,
    name: "Cultural Heritage",
    description: "Preserve indigenous knowledge and traditions",
    icon: Heart,
    color: "bg-primary text-white",
    borderColor: "border-primary/20"
  },
  {
    id: 6,
    name: "Anti-Poaching",
    description: "Combat illegal wildlife trade and protect species",
    icon: Shield,
    color: "bg-accent text-white",
    borderColor: "border-accent/20"
  }
];

const ThemeCarousel = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Conservation Themes
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose experiences that align with your conservation interests and values.
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
            {themes.map((theme) => (
              <CarouselItem key={theme.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                <Card className={`group hover:shadow-lg transition-all duration-300 border-2 ${theme.borderColor}`}>
                  <CardContent className="p-6 text-center">
                    <div className={`w-16 h-16 rounded-full ${theme.color} mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <theme.icon className="h-8 w-8" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2">
                      {theme.name}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {theme.description}
                    </p>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>
      </div>
    </section>
  );
};

export default ThemeCarousel;
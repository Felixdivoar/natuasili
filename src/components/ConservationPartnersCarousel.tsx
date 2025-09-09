import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, useCarousel } from "@/components/ui/carousel";
import { MapPin, Users, Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { PARTNERS } from "@/data/partners";
import { useI18n } from "@/i18n/I18nProvider";
import T from "@/i18n/T";
import DynamicTranslated from "@/i18n/DynamicTranslated";
const CarouselControls = () => {
  const {
    scrollPrev,
    scrollNext,
    canScrollPrev,
    canScrollNext
  } = useCarousel();
  return <div className="flex justify-center gap-2 mt-8">
      <Button variant="outline" size="icon" className="rounded-full w-10 h-10 border-2 border-foreground/20 hover:bg-foreground hover:text-background" onClick={scrollPrev} disabled={!canScrollPrev}>
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon" className="rounded-full w-10 h-10 border-2 border-foreground/20 hover:bg-foreground hover:text-background" onClick={scrollNext} disabled={!canScrollNext}>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>;
};
const ConservationPartnersCarousel = () => {
  const { t } = useI18n();
  const displayPartners = PARTNERS.slice(0, 6);
  
  return (
    <section id="projects" className="bg-muted/30 py-[10px]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-center">
            <T k="conservation_partners_title" />
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-center">
            <T k="conservation_partners_subtitle" />
          </p>
        </div>
        
        <Carousel opts={{
          align: "start",
          loop: true
        }} className="w-full">
          <CarouselContent className="-ml-2 md:-ml-4">
            {displayPartners.map(partner => (
              <CarouselItem key={partner.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                <Card className="group hover:shadow-lg transition-shadow overflow-hidden h-full">
                  <div className="relative aspect-[4/3]">
                    <img 
                      src={partner.image} 
                      alt={`${partner.name} conservation partner - ${partner.themes.join(', ')} work in ${partner.location}`} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                      onError={(e) => {
                        const target = e.currentTarget;
                        target.src = '/img/ph1.jpg';
                        target.alt = `${partner.name} - Image not available`;
                        target.className = "w-full h-full object-contain p-4 bg-muted-foreground/10";
                      }} 
                      loading="lazy" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-foreground text-background">
                        <DynamicTranslated text={partner.themes[0]} />
                      </Badge>
                    </div>
                  </div>
                  
                  <CardHeader>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      {partner.name}
                    </CardTitle>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {partner.location}
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                      <DynamicTranslated text={partner.description} />
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-6 p-3 bg-muted/50 rounded-lg">
                      <div className="text-center">
                        <div className="text-lg font-bold text-conservation">{partner.experienceCount}</div>
                        <div className="text-xs text-muted-foreground"><T k="partners_bookings" /></div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-conservation">{partner.established}</div>
                        <div className="text-xs text-muted-foreground">Est.</div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Link to={`/partner/${partner.slug}`}>
                        <Button className="w-full bg-foreground hover:bg-foreground/90 text-background">
                          <Heart className="w-4 h-4 mr-2" />
                          <T k="btn_view_partner" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="hidden md:block">
            <CarouselPrevious className="-left-6 bg-background border-2 border-foreground/20 hover:bg-foreground hover:text-background rounded-full w-12 h-12" />
            <CarouselNext className="-right-6 bg-background border-2 border-foreground/20 hover:bg-foreground hover:text-background rounded-full w-12 h-12" />
          </div>
          <div className="md:hidden">
            <CarouselControls />
          </div>
        </Carousel>

        <div className="text-center mt-8">
          <Link to="/partners">
            <Button variant="outline" size="lg" className="border-foreground/20 hover:bg-foreground hover:text-background">
              <T k="btn_view_all_partners" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
export default ConservationPartnersCarousel;
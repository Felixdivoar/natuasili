import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, useCarousel } from "@/components/ui/carousel";
import { Calendar, User, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useI18n } from "@/i18n/I18nProvider";
import T from "@/i18n/T";
import DynamicTranslated from "@/i18n/DynamicTranslated";
import { impactStories } from "@/data/blogData";

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
const ImpactStories = () => {
  const { t } = useI18n();
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Wildlife Protection':
        return 'bg-conservation/10 text-conservation border-conservation/20';
      case 'Education':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'Restoration':
        return 'bg-accent/10 text-accent border-accent/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };
  return <section id="impact-stories" className="bg-muted/30 py-[20px]">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <div className="text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4"><T k="impact_stories_title" /></h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              <T k="impact_stories_subtitle" />
            </p>
          </div>
          <Link to="/blog">
            <Button variant="outline" className="hidden md:block">
              <T k="btn_view_all_stories" />
            </Button>
          </Link>
        </div>
        
        <Carousel opts={{
        align: "start",
        loop: true
      }} className="w-full">
          <CarouselContent className="-ml-2 md:-ml-4">
            {impactStories.map(story => <CarouselItem key={story.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden h-full">
                  <div className="relative aspect-[16/10]">
                    <img src={story.image} alt={story.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-black text-white border-black cursor-pointer">
                        <DynamicTranslated text={story.category} />
                      </Badge>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  
                  <CardHeader>
                    <CardTitle className="text-xl group-hover:text-conservation transition-colors line-clamp-2">
                      <DynamicTranslated text={story.title} />
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-muted-foreground mb-6 line-clamp-3">
                      <DynamicTranslated text={story.excerpt} />
                    </p>
                    
                    {/* Impact Metrics */}
                    <div className="grid grid-cols-3 gap-2 mb-6 p-3 bg-muted/50 rounded-lg">
                      {Object.entries(story.impact).map(([key, value]) => <div key={key} className="text-center">
                          <div className="text-lg font-bold text-conservation">{value}</div>
                          <div className="text-xs text-muted-foreground capitalize">{key}</div>
                        </div>)}
                    </div>
                    
                    
                    <Link to={`/blog/${story.slug}`}>
                      <Button variant="outline" className="w-full group-hover:bg-conservation group-hover:text-white group-hover:border-conservation transition-colors">
                        <T k="btn_read_full_story" />
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </CarouselItem>)}
          </CarouselContent>
          <div className="md:hidden">
            <CarouselControls />
          </div>
        </Carousel>
        
        {/* Mobile View All Button */}
        <div className="text-center mt-8 md:hidden">
          <Link to="/blog">
            <Button className="bg-conservation hover:bg-conservation/90 text-white">
              <T k="btn_view_all_impact_stories" />
            </Button>
          </Link>
        </div>
      </div>
    </section>;
};
export default ImpactStories;
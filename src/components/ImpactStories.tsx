import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, useCarousel } from "@/components/ui/carousel";
import { Calendar, User, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
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
import maasaiMaraProject from "@/assets/maasai-mara-project.jpg";
import sambururEducation from "@/assets/samburu-education.jpg";
import karuraForestPlanting from "@/assets/karura-forest-planting.jpg";
const impactStories = [{
  id: 1,
  title: "Protecting the Great Migration Corridor",
  excerpt: "How community conservancies are securing wildlife corridors critical for the annual wildebeest migration, ensuring this natural wonder continues for future generations.",
  content: `
      <p>The Great Migration is one of the world's most spectacular wildlife events, with over 2 million wildebeest, zebras, and gazelles crossing between Kenya and Tanzania. However, rapid human development threatens this ancient pathway.</p>
      
      <p>Through our partnership with local Maasai conservancies, we've helped establish protected corridors that allow wildlife to move freely between protected areas. These corridors are managed by communities who receive direct benefits from conservation tourism.</p>
      
      <h3>Key Achievements:</h3>
      <ul>
        <li>15,000 hectares of corridor land under community protection</li>
        <li>85% reduction in human-wildlife conflict incidents</li>
        <li>200 community members employed as conservancy rangers</li>
        <li>$400,000 annually in community conservation payments</li>
      </ul>
      
      <p>The success of this model demonstrates that conservation and community development can work hand in hand. Local families who once viewed wildlife as competition now see them as partners in their economic future.</p>
    `,
  category: "Wildlife Protection",
  author: "Dr. Sarah Kimani",
  date: "2024-01-15",
  image: maasaiMaraProject,
  impact: {
    hectares: "15,000",
    communities: "12",
    species: "45"
  }
}, {
  id: 2,
  title: "Empowering the Next Generation of Conservationists",
  excerpt: "Educational programs in Samburu County are inspiring young people to become conservation leaders, combining traditional knowledge with modern conservation science.",
  content: `
      <p>In Samburu County, a new generation of conservation leaders is emerging through innovative educational programs that blend traditional ecological knowledge with modern conservation science.</p>
      
      <p>Our Junior Conservationist Program works with local schools to provide hands-on environmental education. Students learn about wildlife tracking, habitat restoration, and sustainable resource management from both community elders and trained conservationists.</p>
      
      <h3>Program Impact:</h3>
      <ul>
        <li>500 students enrolled across 15 schools</li>
        <li>12 community-based learning centers established</li>
        <li>90% of graduates pursuing conservation-related careers</li>
        <li>Traditional ecological knowledge documented and preserved</li>
      </ul>
      
      <p>The program has also created employment opportunities for community members as environmental educators and mentors, ensuring that traditional knowledge is passed on while introducing modern conservation techniques.</p>
    `,
  category: "Education",
  author: "James Mwangi",
  date: "2024-01-10",
  image: sambururEducation,
  impact: {
    students: "500",
    schools: "15",
    mentors: "25"
  }
}, {
  id: 3,
  title: "Urban Forest Restoration: Karura's Renaissance",
  excerpt: "The transformation of Karura Forest from a degraded urban space to a thriving ecosystem showcases the power of community-led restoration efforts in Nairobi.",
  content: `
      <p>Karura Forest, once facing severe degradation from encroachment and pollution, has become a model for urban forest restoration through community engagement and sustainable tourism.</p>
      
      <p>Our restoration program combines scientific forest management with community participation. Volunteers from local schools, businesses, and visitor groups have planted over 50,000 indigenous trees while learning about forest ecology.</p>
      
      <h3>Restoration Results:</h3>
      <ul>
        <li>200 hectares of forest successfully restored</li>
        <li>50,000 indigenous trees planted</li>
        <li>35 bird species returned to the forest</li>
        <li>1,200 community volunteers trained</li>
      </ul>
      
      <p>The forest now serves as an outdoor classroom and recreation space for Nairobi residents while providing essential ecosystem services like air purification and watershed protection.</p>
    `,
  category: "Restoration",
  author: "Dr. Grace Wanjiru",
  date: "2024-01-05",
  image: karuraForestPlanting,
  impact: {
    trees: "50,000",
    hectares: "200",
    volunteers: "1,200"
  }
}];
const ImpactStories = () => {
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
  return <section id="impact-stories" className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <div className="text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Impact stories</h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Real stories of conservation success, community empowerment, and positive change 
              happening across Kenya through responsible tourism.
            </p>
          </div>
          <Link to="/blog">
            <Button variant="outline" className="hidden md:block">
              View All Stories
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
                      <Badge className={getCategoryColor(story.category)}>
                        {story.category}
                      </Badge>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  
                  <CardHeader>
                    <CardTitle className="text-xl group-hover:text-conservation transition-colors line-clamp-2">
                      {story.title}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-muted-foreground mb-6 line-clamp-3">
                      {story.excerpt}
                    </p>
                    
                    {/* Impact Metrics */}
                    <div className="grid grid-cols-3 gap-2 mb-6 p-3 bg-muted/50 rounded-lg">
                      {Object.entries(story.impact).map(([key, value]) => <div key={key} className="text-center">
                          <div className="text-lg font-bold text-conservation">{value}</div>
                          <div className="text-xs text-muted-foreground capitalize">{key}</div>
                        </div>)}
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {story.author}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(story.date).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <Button variant="outline" className="w-full group-hover:bg-conservation group-hover:text-white group-hover:border-conservation transition-colors">
                      Read Full Story
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
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
              View All Impact Stories
            </Button>
          </Link>
        </div>
      </div>
    </section>;
};
export default ImpactStories;
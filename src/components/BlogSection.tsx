import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  useCarousel,
} from "@/components/ui/carousel";
import { Calendar, User, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const CarouselControls = () => {
  const { scrollPrev, scrollNext, canScrollPrev, canScrollNext } = useCarousel();
  
  return (
    <div className="flex justify-center gap-2 mt-8">
      <Button
        variant="outline"
        size="icon"
        className="rounded-full w-10 h-10 bg-black text-white border-black"
        onClick={scrollPrev}
        disabled={!canScrollPrev}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="rounded-full w-10 h-10 bg-black text-white border-black"
        onClick={scrollNext}
        disabled={!canScrollNext}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

import { blogPosts } from "@/data/blogData";

const BlogSection = () => {
  const getCategoryColor = (category: string) => {
    // Black and white theme - all categories use same styling
    return 'bg-primary text-primary-foreground border-primary';
  };

  const slugify = (text: string) => {
    return text.toLowerCase()
      .replace(/&/g, 'and')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');
  };

  // Limit to 6 posts for mobile carousel
  const displayPosts = blogPosts.slice(0, 6);

  return (
    <section className="section-padding-lg bg-background-alt home-blog">
      <div className="content-max-width">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Conservation Stories & Insights
          </h2>
          <p className="text-base font-light text-muted-foreground max-w-2xl mx-auto">
            Discover the latest stories, insights, and updates from Kenya's conservation frontlines.
          </p>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full mb-8 blog-track"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {displayPosts.map((post) => (
              <CarouselItem key={post.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 blog-card">
                <Card className="group shadow-lg overflow-hidden h-full">
                  <Link to={`/blog/${post.slug}`} className="post-link block">
                    <div className="relative aspect-[16/10] thumb">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-300"
                      />
                        <div className="absolute top-4 left-4">
                          <Link
                            to={`/blog/category/${slugify(post.category)}`}
                            className="inline-block"
                          >
                            <Badge className="bg-black text-white border-black cursor-pointer">
                              {post.category}
                            </Badge>
                          </Link>
                        </div>
                    </div>
                  </Link>
                  
                   <CardHeader className="pb-2">
                    <Link to={`/blog/${post.slug}`} className="block">
                      <h3 className="blog-carousel-title post-title text-sm font-bold text-foreground line-clamp-2 leading-tight">
                        {post.title}
                      </h3>
                    </Link>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-3 post-excerpt">
                      {post.excerpt}
                    </p>
                    
                    
                    <Link to={`/blog/${post.slug}`} className="read-more">
                      <Button variant="outline" size="sm" className="group/btn w-full bg-black text-white border-black">
                        Read More
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="md:hidden">
            <CarouselControls />
          </div>
        </Carousel>

        <div className="text-center">
          <Link to="/blog" className="view-all-stories">
            <Button size="lg" className="bg-black text-white">
              View All Stories
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
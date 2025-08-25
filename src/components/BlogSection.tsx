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
        className="rounded-full w-10 h-10 border-2 border-primary/20 hover:bg-primary hover:text-primary-foreground"
        onClick={scrollPrev}
        disabled={!canScrollPrev}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="rounded-full w-10 h-10 border-2 border-primary/20 hover:bg-primary hover:text-primary-foreground"
        onClick={scrollNext}
        disabled={!canScrollNext}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

import impactMetricsBlog from "@/assets/blog/impact-metrics-blog.jpg";
import partnerSpotlightBlog from "@/assets/blog/partner-spotlight-blog.jpg";
import whyPartnerBlog from "@/assets/blog/why-partner-blog.jpg";
import sustainableTourismBlog from "@/assets/blog/sustainable-tourism-blog.jpg";
import communityImpactBlog from "@/assets/blog/community-impact-blog.jpg";
import conservationTechBlog from "@/assets/blog/conservation-tech-blog.jpg";

const blogPosts = [
  {
    id: 1,
    title: "The Real Impact of Conservation Tourism in Kenya",
    excerpt: "How traveler contributions are transforming wildlife protection efforts across Kenya's most critical habitats.",
    category: "Impact Stories",
    author: "Dr. Sarah Kimani",
    date: "2024-01-15",
    readTime: "5 min read",
    image: impactMetricsBlog,
    slug: "real-impact-conservation-tourism-kenya"
  },
  {
    id: 2,
    title: "Partner Spotlight: Maasai Mara Wildlife Conservancy",
    excerpt: "Meet the team behind one of Kenya's most successful community-led conservation initiatives.",
    category: "Partner Spotlight",
    author: "James Mwangi",
    date: "2024-01-12",
    readTime: "4 min read", 
    image: partnerSpotlightBlog,
    slug: "partner-spotlight-maasai-mara-conservancy"
  },
  {
    id: 3,
    title: "Why Partner with NatuAsili? A Conservation Organization's Guide",
    excerpt: "Everything you need to know about joining Kenya's premier conservation impact platform.",
    category: "Partnership Guide",
    author: "Alice Nyong'o",
    date: "2024-01-10",
    readTime: "6 min read",
    image: whyPartnerBlog, 
    slug: "why-partner-natuasili-guide"
  },
  {
    id: 4,
    title: "Building Sustainable Livelihoods Through Conservation",
    excerpt: "How authentic tourism experiences are creating economic opportunities for local communities.",
    category: "Community Impact",
    author: "Peter Njoroge",
    date: "2024-01-08",
    readTime: "7 min read",
    image: communityImpactBlog,
    slug: "sustainable-livelihoods-conservation"
  },
  {
    id: 5,
    title: "From Degraded Land to Thriving Habitat: Restoration Success Stories",
    excerpt: "Witness the transformation of Kenya's ecosystems through community-led restoration efforts.",
    category: "Restoration",
    author: "Dr. Grace Wanjiru", 
    date: "2024-01-05",
    readTime: "8 min read",
    image: sustainableTourismBlog,
    slug: "habitat-restoration-success-stories"
  },
  {
    id: 6,
    title: "The Future of Wildlife Protection: Technology Meets Tradition",
    excerpt: "How modern technology is enhancing traditional conservation methods in Kenya's protected areas.",
    category: "Innovation",
    author: "Michael Kipchoge",
    date: "2024-01-03", 
    readTime: "5 min read",
    image: conservationTechBlog,
    slug: "future-wildlife-protection-technology"
  }
];

const BlogSection = () => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Impact Stories': return 'bg-conservation/10 text-conservation border-conservation/20';
      case 'Partner Spotlight': return 'bg-primary/10 text-primary border-primary/20';
      case 'Partnership Guide': return 'bg-accent/10 text-accent border-accent/20';
      case 'Community Impact': return 'bg-conservation/10 text-conservation border-conservation/20';
      case 'Restoration': return 'bg-primary/10 text-primary border-primary/20';
      case 'Innovation': return 'bg-accent/10 text-accent border-accent/20';
      default: return 'bg-muted text-muted-foreground';
    }
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
    <section className="py-16 bg-muted/30 home-blog">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Conservation Stories & Insights
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
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
                <Card className="group hover:shadow-lg transition-shadow overflow-hidden h-full">
                  <Link to={`/blog/${post.slug}`} className="post-link block">
                    <div className="relative aspect-[16/10] thumb">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-4 left-4">
                        <Link
                          to={`/blog/category/${slugify(post.category)}`}
                          className={`post-category ${getCategoryColor(post.category)}`}
                          onClick={(e) => e.stopPropagation()}
                        >
                          {post.category}
                        </Link>
                      </div>
                    </div>
                  </Link>
                  
                   <CardHeader className="pb-2">
                    <Link to={`/blog/${post.slug}`} className="block">
                      <h3 className="blog-carousel-title post-title text-sm font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                        {post.title}
                      </h3>
                    </Link>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-3 post-excerpt">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {post.author}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(post.date).toLocaleDateString()}
                      </div>
                      <span>{post.readTime}</span>
                    </div>
                    
                    <Link to={`/blog/${post.slug}`} className="read-more">
                      <Button variant="outline" size="sm" className="group/btn w-full">
                        Read More
                        <ArrowRight className="h-3 w-3 ml-1 group-hover/btn:translate-x-1 transition-transform" />
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
            <Button size="lg" className="bg-conservation hover:bg-conservation/90 text-white">
              View All Stories
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
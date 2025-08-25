import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

import impactMetricsBlog from "@/assets/blog/impact-metrics-blog.jpg";
import partnerSpotlightBlog from "@/assets/blog/partner-spotlight-blog.jpg";
import whyPartnerBlog from "@/assets/blog/why-partner-blog.jpg";
import sustainableTourismBlog from "@/assets/blog/sustainable-tourism-blog.jpg";
import communityImpactBlog from "@/assets/blog/community-impact-blog.jpg";
import conservationTechBlog from "@/assets/blog/conservation-tech-blog.jpg";

const blogPosts = [
  {
    slug: "real-impact-conservation-tourism-kenya",
    title: "The Real Impact of Conservation Tourism in Kenya",
    excerpt: "How traveler contributions are transforming wildlife protection efforts across Kenya's most critical habitats.",
    category: "Impact Stories",
    author: "Dr. Sarah Kimani",
    date: "2024-01-15",
    readTime: "5 min read",
    image: impactMetricsBlog,
  },
  {
    slug: "partner-spotlight-maasai-mara-conservancy",
    title: "Partner Spotlight: Maasai Mara Wildlife Conservancy",
    excerpt: "Meet the team behind one of Kenya's most successful community-led conservation initiatives.",
    category: "Partner Spotlight",
    author: "James Mwangi",
    date: "2024-01-12",
    readTime: "4 min read",
    image: partnerSpotlightBlog,
  },
  {
    slug: "why-partner-natuasili-guide",
    title: "Why Partner with NatuAsili? A Conservation Organization's Guide",
    excerpt: "Everything you need to know about joining Kenya's premier conservation impact platform.",
    category: "Partnership Guide",
    author: "Alice Nyong'o",
    date: "2024-01-10",
    readTime: "6 min read",
    image: whyPartnerBlog,
  },
  {
    slug: "sustainable-livelihoods-conservation",
    title: "Building Sustainable Livelihoods Through Conservation",
    excerpt: "How authentic tourism experiences are creating economic opportunities for local communities.",
    category: "Community Impact",
    author: "Peter Njoroge",
    date: "2024-01-08",
    readTime: "7 min read",
    image: communityImpactBlog,
  },
  {
    slug: "habitat-restoration-success-stories",
    title: "From Degraded Land to Thriving Habitat: Restoration Success Stories",
    excerpt: "Witness the transformation of Kenya's ecosystems through community-led restoration efforts.",
    category: "Restoration",
    author: "Dr. Grace Wanjiru",
    date: "2024-01-05",
    readTime: "8 min read",
    image: sustainableTourismBlog,
  },
  {
    slug: "future-wildlife-protection-technology",
    title: "The Future of Wildlife Protection: Technology Meets Tradition",
    excerpt: "How modern technology is enhancing traditional conservation methods in Kenya's protected areas.",
    category: "Innovation",
    author: "Michael Kipchoge",
    date: "2024-01-03",
    readTime: "5 min read",
    image: conservationTechBlog,
  }
];

const BlogCategory = () => {
  const { category } = useParams();
  const categoryTitle = category?.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ') || '';

  const filteredPosts = blogPosts.filter(post => 
    post.category.toLowerCase().replace(/\s+/g, '-') === category
  );

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Impact Stories': return 'bg-accent/10 text-accent border-accent/20';
      case 'Partner Spotlight': return 'bg-primary/10 text-primary border-primary/20';
      case 'Partnership Guide': return 'bg-accent/10 text-accent border-accent/20';
      case 'Community Impact': return 'bg-accent/10 text-accent border-accent/20';
      case 'Restoration': return 'bg-primary/10 text-primary border-primary/20';
      case 'Innovation': return 'bg-accent/10 text-accent border-accent/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Link to="/blog" className="hover:text-primary transition-colors">Blog</Link>
            <span>/</span>
            <span className="text-foreground">{categoryTitle}</span>
          </div>
        </nav>

        <div className="mb-8">
          <Link to="/blog">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
          
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              {categoryTitle}
            </h1>
            <p className="text-xl text-muted-foreground mb-6">
              {filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''} in this category
            </p>
          </div>
        </div>
        
        {filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground mb-4">No articles found in this category.</p>
            <Link to="/blog">
              <Button>Browse All Articles</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <Link key={post.slug} to={`/blog/${post.slug}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <div className="aspect-[16/10] bg-muted relative overflow-hidden">
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  
                  <CardHeader className="pb-3">
                    <div className="mb-3">
                      <Badge className={getCategoryColor(post.category)}>
                        {post.category}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg font-semibold line-clamp-2 mb-2">
                      {post.title}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {post.excerpt}
                    </p>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{post.author}</span>
                      <span>{post.readTime}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default BlogCategory;
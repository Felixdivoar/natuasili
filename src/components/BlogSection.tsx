import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const blogPosts = [
  {
    id: 1,
    title: "The Real Impact of Conservation Tourism in Kenya",
    excerpt: "How traveler contributions are transforming wildlife protection efforts across Kenya's most critical habitats.",
    category: "Impact Stories",
    author: "Dr. Sarah Kimani",
    date: "2024-01-15",
    readTime: "5 min read",
    image: "/src/assets/maasai-mara-project.jpg",
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
    image: "/src/assets/big-five-tracking.jpg",
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
    image: "/src/assets/samburu-education.jpg", 
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
    image: "/src/assets/beadwork-workshop.jpg",
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
    image: "/src/assets/mangrove-restoration.jpg",
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
    image: "/src/assets/mara-elephant-tracking.jpg",
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

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Conservation Stories & Insights
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover the latest stories, insights, and updates from Kenya's conservation frontlines.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {blogPosts.map((post) => (
            <Card key={post.id} className="group hover:shadow-lg transition-shadow overflow-hidden">
              <div className="relative aspect-[16/10]">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <Badge className={getCategoryColor(post.category)}>
                    {post.category}
                  </Badge>
                </div>
              </div>
              
              <CardHeader className="pb-2">
                <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </h3>
              </CardHeader>
              
              <CardContent>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
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
                
                <Link to={`/blog/${post.slug}`}>
                  <Button variant="outline" size="sm" className="group/btn">
                    Read More
                    <ArrowRight className="h-3 w-3 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Link to="/blog">
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
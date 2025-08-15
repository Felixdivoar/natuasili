import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, User, Clock, Search } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const blogPosts = [
  {
    id: 1,
    title: "The Real Impact of Conservation Tourism in Kenya",
    excerpt: "How traveler contributions are transforming wildlife protection efforts across Kenya's most critical habitats. Discover the measurable changes happening on the ground.",
    category: "Impact Stories",
    author: "Dr. Sarah Kimani",
    date: "2024-01-15",
    readTime: "5 min read",
    image: "/src/assets/blog/impact-metrics-blog.jpg",
    slug: "real-impact-conservation-tourism-kenya",
    featured: true
  },
  {
    id: 2,
    title: "Partner Spotlight: Maasai Mara Wildlife Conservancy",
    excerpt: "Meet the team behind one of Kenya's most successful community-led conservation initiatives and learn how they're protecting the Big Five.",
    category: "Partner Spotlight",
    author: "James Mwangi",
    date: "2024-01-12",
    readTime: "4 min read", 
    image: "/src/assets/blog/partner-spotlight-blog.jpg",
    slug: "partner-spotlight-maasai-mara-conservancy",
    featured: true
  },
  {
    id: 3,
    title: "Why Partner with NatuAsili? A Conservation Organization's Guide",
    excerpt: "Everything you need to know about joining Kenya's premier conservation impact platform and building sustainable funding for your projects.",
    category: "Partnership Guide",
    author: "Alice Nyong'o",
    date: "2024-01-10",
    readTime: "6 min read",
    image: "/src/assets/blog/why-partner-blog.jpg", 
    slug: "why-partner-natuasili-guide",
    featured: false
  },
  {
    id: 4,
    title: "Building Sustainable Livelihoods Through Conservation",
    excerpt: "How authentic tourism experiences are creating economic opportunities for local communities while protecting Kenya's natural heritage.",
    category: "Community Impact",
    author: "Peter Njoroge",
    date: "2024-01-08",
    readTime: "7 min read",
    image: "/src/assets/blog/community-impact-blog.jpg",
    slug: "sustainable-livelihoods-conservation",
    featured: false
  },
  {
    id: 5,
    title: "From Degraded Land to Thriving Habitat: Restoration Success Stories",
    excerpt: "Witness the transformation of Kenya's ecosystems through community-led restoration efforts and learn how you can contribute.",
    category: "Restoration",
    author: "Dr. Grace Wanjiru", 
    date: "2024-01-05",
    readTime: "8 min read",
    image: "/src/assets/blog/sustainable-tourism-blog.jpg",
    slug: "habitat-restoration-success-stories",
    featured: false
  },
  {
    id: 6,
    title: "The Future of Wildlife Protection: Technology Meets Tradition",
    excerpt: "How modern technology is enhancing traditional conservation methods in Kenya's protected areas, from GPS tracking to camera traps.",
    category: "Innovation",
    author: "Michael Kipchoge",
    date: "2024-01-03", 
    readTime: "5 min read",
    image: "/src/assets/blog/conservation-tech-blog.jpg",
    slug: "future-wildlife-protection-technology",
    featured: false
  },
  {
    id: 7,
    title: "Community-Led Conservation: Empowering Local Guardians",
    excerpt: "Discover how local communities are becoming the frontline defenders of Kenya's wildlife and ecosystems through innovative partnerships.",
    category: "Community Impact",
    author: "Mary Chepkemoi",
    date: "2024-01-01",
    readTime: "6 min read",
    image: "/src/assets/blog/community-impact-blog.jpg",
    slug: "community-led-conservation-guardians",
    featured: false
  },
  {
    id: 8,
    title: "Measuring Conservation Success: Our Impact Framework",
    excerpt: "Learn about our transparent impact measurement system and how we track conservation outcomes from every traveler contribution.",
    category: "Impact Stories",
    author: "Dr. John Muriuki",
    date: "2023-12-28",
    readTime: "4 min read",
    image: "/src/assets/blog/impact-metrics-blog.jpg",
    slug: "measuring-conservation-success-framework",
    featured: false
  }
];

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    "Impact Stories",
    "Partner Spotlight", 
    "Partnership Guide",
    "Community Impact",
    "Restoration",
    "Innovation"
  ];

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.author.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "all" || post.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const featuredPosts = blogPosts.filter(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured);

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
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="py-16 bg-conservation/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Conservation Stories & Insights
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Discover the latest stories, insights, and updates from Kenya's conservation frontlines. 
              Learn from our partners and explore the impact of conservation tourism.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-foreground mb-8">Featured Stories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {featuredPosts.map((post) => (
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
                    <div className="absolute top-4 right-4">
                      <Badge variant="secondary" className="bg-conservation text-white">
                        Featured
                      </Badge>
                    </div>
                  </div>
                  
                  <CardHeader>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-muted-foreground mb-4 line-clamp-3">
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
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {post.readTime}
                      </div>
                    </div>
                    
                    <Link to={`/blog/${post.slug}`}>
                      <Button className="w-full bg-conservation hover:bg-conservation/90 text-white">
                        Read Full Story
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Filters */}
      <section className="py-8 border-t border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* All Posts */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-foreground">
              {selectedCategory === "all" ? "All Stories" : selectedCategory}
            </h2>
            <span className="text-muted-foreground">
              {filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''}
            </span>
          </div>

          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularPosts.map((post) => (
                <Card key={post.id} className="group hover:shadow-lg transition-shadow overflow-hidden h-full flex flex-col">
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
                  
                  <CardHeader className="flex-grow">
                    <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
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
                    </div>
                    
                    <Link to={`/blog/${post.slug}`}>
                      <Button variant="outline" className="w-full">
                        Read More
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg mb-4">
                No articles found matching your criteria.
              </p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Blog;
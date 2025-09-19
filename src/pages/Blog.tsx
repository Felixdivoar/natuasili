import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, User, Clock, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { blogPosts } from "@/data/blogData";

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  const categories = ["Host Resources", "Purposeful Travel", "Conservation and Community Engagement", "Travel Tips and Itineraries"];
  
  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         post.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });
  
  const featuredPosts = blogPosts.filter(post => 
    post.id === 1 || post.id === 2 // First two posts as featured
  );
  
  const regularPosts = filteredPosts.filter(post => 
    post.id !== 1 && post.id !== 2 // Exclude featured posts
  );
  
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Host Resources': return 'bg-conservation/10 text-conservation border-conservation/20';
      case 'Purposeful Travel': return 'bg-primary/10 text-primary border-primary/20';
      case 'Conservation and Community Engagement': return 'bg-accent/10 text-accent border-accent/20';
      case 'Travel Tips and Itineraries': return 'bg-secondary/10 text-secondary border-secondary/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };
  
  const slugify = (text: string) => {
    return text.toLowerCase()
      .replace(/&/g, 'and')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="hero-full section-padding-lg bg-background-alt">
        <div className="hero-inner">
          <div className="content-max-width text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Moments Inspiring Local Actions
            </h1>
            <p className="text-base text-muted-foreground font-light mb-8">
              At NatuAsili, we believe that conservation thrives through connection between people, places, wildlife, and the partners working to protect them. MILA (Moments Inspiring Local Actions) is where we share the experiences that inspire local action and global support.

Through stories from communities, conservation organizations, and travelers, we spotlight how nature-based experiences drive awareness, funding, and positive change. From the forests and savannahs to coastlines and cultures, MILA celebrates the collaborations that help protect Africa's wild places.
            </p>
            
            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto mb-8">
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
                <SelectTrigger className="w-full md:w-64">
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="mb-4">
              <span className="text-muted-foreground">
                {filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-12">
        <div className="content-max-width">
          {searchTerm === "" && selectedCategory === "all" && (
            <>
              {/* Featured Posts */}
              <div className="mb-16">
                <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
                  Featured Stories
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {featuredPosts.map((post) => (
                    <Link key={post.id} to={`/blog/${post.slug}`}>
                      <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 h-full">
                        <div className="aspect-[16/10] bg-muted relative overflow-hidden">
                          <img 
                            src={post.image} 
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
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
                        
                        <CardHeader className="pb-4">
                          <CardTitle className="text-lg font-normal line-clamp-2 group-hover:text-primary transition-colors">
                            {post.title}
                          </CardTitle>
                        </CardHeader>
                        
                        <CardContent>
                          <p className="text-base text-muted-foreground font-light mb-6 line-clamp-3">
                            {post.excerpt}
                          </p>
                          
                          <Link to={`/blog/${post.slug}`}>
                            <Button className="w-full bg-black text-white">
                              Read more
                            </Button>
                          </Link>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            </>
          )}
          
          {filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg mb-4">
                No articles found matching your criteria.
              </p>
              <Button 
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                }}
                variant="outline"
              >
                Clear filters
              </Button>
            </div>
          ) : (
            <>
              {/* Regular Posts Grid */}
              <div className="mb-8">
                {(searchTerm !== "" || selectedCategory !== "all") && (
                  <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
                    Search Results
                  </h2>
                )}
                {searchTerm === "" && selectedCategory === "all" && (
                  <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
                    Latest Stories
                  </h2>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {(searchTerm !== "" || selectedCategory !== "all" ? filteredPosts : regularPosts).map((post) => (
                    <Link key={post.id} to={`/blog/${post.slug}`}>
                      <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 h-full">
                        <div className="aspect-[16/10] bg-muted relative overflow-hidden">
                          <img 
                            src={post.image} 
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
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
                        
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                            {post.title}
                          </CardTitle>
                        </CardHeader>
                        
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                            {post.excerpt}
                          </p>
                          
                          <Link to={`/blog/${post.slug}`}>
                            <Button variant="outline" className="w-full">
                              Read more
                            </Button>
                          </Link>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Blog;
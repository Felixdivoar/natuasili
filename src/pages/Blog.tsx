import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, User, Clock, Search } from "lucide-react";
import { Link } from "react-router-dom";

// Import blog images
import partnerConservationImpact from "@/assets/blog/partner-conservation-impact.jpg";
import communityResilienceTourism from "@/assets/blog/community-resilience-tourism.webp";
import digitalConservationSolutions from "@/assets/blog/digital-conservation-solutions.png";
import sustainableLivelihoodsConservation from "@/assets/blog/sustainable-livelihoods-conservation.webp";
import humanWildlifeConflict from "@/assets/blog/human-wildlife-conflict.webp";
import partnerGrowImpact from "@/assets/blog/partner-grow-impact.jpg";
import beyondSafariPurpose from "@/assets/blog/beyond-safari-purpose.jpg";
import sustainableTourismBlog from "@/assets/blog/sustainable-tourism-blog.jpg";
import conservationTechBlog from "@/assets/blog/conservation-tech-blog.jpg";
import travelForGood from "@/assets/blog/travel-for-good.webp";
import hostConservationExpand from "@/assets/blog/host-conservation-expand.jpg";
import conservationCollaboration from "@/assets/blog/conservation-collaboration.webp";
import authenticKenyaExperiences from "@/assets/blog/authentic-kenya-experiences.webp";
import travelGivesBack from "@/assets/blog/travel-gives-back.jpg";
import tailoredConservationItineraries from "@/assets/blog/tailored-conservation-itineraries.webp";
import purposefulTravelExperiences from "@/assets/blog/purposeful-travel-experiences.jpg";

const blogPosts = [
  {
    id: 1,
    title: "Partner with Natuasili and support conservation impact",
    excerpt: "We see that a great part of organizations and host communities can contribute to conservation. Along with improving your profile, partnering with us directly supports conservation efforts.",
    category: "Host Resources",
    author: "NatuAsili Team",
    date: "2024-01-15",
    readTime: "5 min read",
    image: partnerConservationImpact,
    slug: "partner-natuasili-support-conservation-impact",
    featured: true
  }, {
    id: 2,
    title: "Community resilience through conservation tourism",
    excerpt: "Eco-tourism is a powerful tool for conservation, providing communities with sustainable livelihoods while protecting wildlife. This blog explores how tourism can reduce reliance on compensation payouts and build community resilience.",
    category: "Purposeful Travel",
    author: "Sarah Kimani",
    date: "2024-01-12",
    readTime: "6 min read",
    image: communityResilienceTourism,
    slug: "community-resilience-conservation-tourism",
    featured: true
  }, {
    id: 3,
    title: "Why does conservation need you? Travel with purpose",
    excerpt: "Conservation is no longer the sole responsibility of governments and ngos. It is a global call to action, one that requires the participation of individuals, communities, and travelers alike.",
    category: "Conservation and Community Engagement",
    author: "Dr. Sarah Kimani",
    date: "2024-01-14",
    readTime: "8 min read",
    image: conservationTechBlog,
    slug: "why-conservation-need-you-travel-purpose",
    featured: true
  }, {
    id: 4,
    title: "Digital conservation solutions; the future wildlife tech",
    excerpt: "Technology is revolutionizing the way we protect wildlife and manage human-wildlife conflict. The rollout of a new digital claims system is a game-changer for communities affected by wildlife damage.",
    category: "Conservation and Community Engagement",
    author: "James Mwangi",
    date: "2024-01-10",
    readTime: "5 min read",
    image: digitalConservationSolutions,
    slug: "digital-conservation-solutions-future-wildlife-tech",
    featured: false
  }, {
    id: 5,
    title: "Travel for good: conservation and community impact",
    excerpt: "In a world where travel has become more accessible than ever, an important question arises: How can we ensure that our adventures leave a positive impact?",
    category: "Purposeful Travel",
    author: "Alice Nyong'o",
    date: "2024-01-09",
    readTime: "7 min read",
    image: travelForGood,
    slug: "travel-for-good-conservation-community-impact",
    featured: false
  }, {
    id: 6,
    title: "Creating sustainable livelihoods through conservation tourism",
    excerpt: "For many communities living near wildlife, compensation payouts have been a critical safety net. However, these payouts alone are not enough to build long-term resilience.",
    category: "Conservation and Community Engagement",
    author: "Peter Njoroge",
    date: "2024-01-08",
    readTime: "7 min read",
    image: sustainableLivelihoodsConservation,
    slug: "creating-sustainable-livelihoods-conservation-tourism",
    featured: false
  }, {
    id: 7,
    title: "Reducing human–wildlife conflict: path to coexistence",
    excerpt: "Human-wildlife conflict is one of the most pressing challenges facing conservation efforts today. It not only threatens wildlife populations but also impacts the livelihoods of communities living near conservation areas.",
    category: "Conservation and Community Engagement",
    author: "Dr. Grace Wanjiru",
    date: "2024-01-05",
    readTime: "8 min read",
    image: humanWildlifeConflict,
    slug: "reducing-human-wildlife-conflict-path-coexistence",
    featured: false
  }, {
    id: 8,
    title: "Host conservation experiences and expand your mission",
    excerpt: "If you run a community-based business or conservation organization, you are familiar with creating unique experiences that capture your goal for visitors.",
    category: "Conservation and Community Engagement",
    author: "Michael Kipchoge",
    date: "2024-01-04",
    readTime: "6 min read",
    image: hostConservationExpand,
    slug: "host-conservation-experiences-expand-mission",
    featured: false
  }, {
    id: 9,
    title: "Partner with Natuasili and grow your impact",
    excerpt: "As a host, lodge owner, conservancy leader, or community initiative, your work is at the heart of Kenya's future. Whether you are protecting endangered wildlife, preserving cultural heritage, or uplifting local communities, your efforts are shaping the landscapes and lives that define this region.",
    category: "Host Resources",
    author: "Dr. John Muriuki",
    date: "2024-01-03",
    readTime: "9 min read",
    image: partnerGrowImpact,
    slug: "partner-natuasili-grow-your-impact",
    featured: false
  }, {
    id: 10,
    title: "Beyond the safari: adding purpose to your itinerary",
    excerpt: "Kenya's sweeping savannas, dramatic landscapes, and legendary safaris have long drawn travelers seeking encounters with the big five. But beyond the game drives and golden sunsets lies a deeper, more profound story.",
    category: "Travel Tips and Itineraries",
    author: "Mary Chepkemoi",
    date: "2024-01-01",
    readTime: "7 min read",
    image: beyondSafariPurpose,
    slug: "beyond-safari-adding-purpose-itinerary",
    featured: false
  }, {
    id: 11,
    title: "Conservation through collaboration with Natuasili",
    excerpt: "At Natuasili, we value the amazing effort conservationists and communities living around protected areas undertake to preserve the natural wonders of our earth.",
    category: "Conservation and Community Engagement",
    author: "Dr. James Olaka",
    date: "2023-12-30",
    readTime: "6 min read",
    image: conservationCollaboration,
    slug: "conservation-through-collaboration-natuasili",
    featured: false
  }, {
    id: 12,
    title: "Kenyan Coast where conservation meets culture",
    excerpt: "The Kenyan Coast is more than just a picturesque destination of white sandy beaches and turquoise waters. It is a place where history, heritage, and conservation intertwine.",
    category: "Conservation and Community Engagement",
    author: "Dr. John Muriuki",
    date: "2023-12-28",
    readTime: "6 min read",
    image: sustainableTourismBlog,
    slug: "kenyan-coast-conservation-meets-culture",
    featured: false
  }, {
    id: 13,
    title: "Hosted conservation and cultural experiences",
    excerpt: "Are you a community-based or conservation organization looking to enhance the hosting of the experiences you provide? Joining Natuasili means joining a dynamic community of driven travelers.",
    category: "Conservation and Community Engagement",
    author: "Peter Mwangi",
    date: "2023-12-27",
    readTime: "5 min read",
    image: partnerConservationImpact,
    slug: "hosted-conservation-cultural-experiences",
    featured: false
  }, {
    id: 14,
    title: "Embracing sustainability in every travel experience",
    excerpt: "The concept of sustainability is central to our work at Natuasili; it is more than simply a slogan; it is a fundamental commitment.",
    category: "Conservation and Community Engagement",
    author: "Grace Wanjiru",
    date: "2023-12-26",
    readTime: "6 min read",
    image: sustainableTourismBlog,
    slug: "embracing-sustainability-travel-experience",
    featured: false
  }, {
    id: 15,
    title: "Host with Natuasili and share your impact",
    excerpt: "Are you a community-based enterprise or conservation organization that is committed to positively making the world a better place through your activities?",
    category: "Host Resources",
    author: "Samuel Kiprotich",
    date: "2023-12-25",
    readTime: "7 min read",
    image: partnerGrowImpact,
    slug: "host-natuasili-share-your-impact",
    featured: false
  }, {
    id: 16,
    title: "Join Natuasili and make your travels count",
    excerpt: "One great approach to seeing the world, learning about other cultures, and making lifelong memories is travel. But suppose your travels could serve purposes beyond mere personal experience?",
    category: "Conservation and Community Engagement",
    author: "Mary Chepkemoi",
    date: "2023-12-24",
    readTime: "6 min read",
    image: beyondSafariPurpose,
    slug: "join-natuasili-make-travels-count",
    featured: false
  }, {
    id: 17,
    title: "Transforming tourism: The Natuasili approach",
    excerpt: "For decades, tourism has been a gateway to experiencing the wonders of the world, from breathtaking landscapes to diverse cultures and wildlife. But at Natuasili, we believe that travel should be more than just exploration.",
    category: "Purposeful Travel",
    author: "Alice Nyong'o",
    date: "2023-12-23",
    readTime: "5 min read",
    image: conservationTechBlog,
    slug: "transforming-tourism-natuasili-approach",
    featured: false
  }, {
    id: 18,
    title: "Authentic Kenya experiences with Natuasili",
    excerpt: "Natuasili is working to redefine what authenticity means in the travel industry in a world where the word is sometimes overused and under-delivered.",
    category: "Conservation and Community Engagement",
    author: "Dr. Sarah Kimani",
    date: "2023-12-22",
    readTime: "6 min read",
    image: authenticKenyaExperiences,
    slug: "authentic-kenya-experiences-natuasili",
  }, {
    id: 19,
    title: "Travel that gives back with Natuasili",
    excerpt: "Travel has an amazing ability to change our lives as well as the environment around us. We are eager to share with you the intangible potential of your travels since we believe your adventures should positively affect the places you visit.",
    category: "Purposeful Travel",
    author: "Dr. Sarah Kimani",
    date: "2024-01-16",
    readTime: "6 min read",
    image: travelGivesBack,
    slug: "travel-gives-back-natuasili",
    featured: false
  }, {
    id: 20,
    title: "Tailored Kenya conservation itineraries by Natuasili",
    excerpt: "Imagine a travel experience that's tailor-made just for you. A tour that not only takes you to breathtaking destinations but also aligns perfectly with your passions and interests.",
    category: "Purposeful Travel",
    author: "James Mwangi",
    date: "2024-01-17",
    readTime: "7 min read",
    image: tailoredConservationItineraries,
    slug: "tailored-kenya-conservation-itineraries",
    featured: false
  }, {
    id: 21,
    title: "Purposeful travel experiences with Natuasili",
    excerpt: "Are you looking for travel experiences that leave a lasting impact, not just on your memories but on the world around you? If yes, you're in the right place.",
    category: "Purposeful Travel",
    author: "Alice Nyong'o",
    date: "2024-01-18",
    readTime: "6 min read",
    image: purposefulTravelExperiences,
    slug: "purposeful-travel-experiences-natuasili",
    featured: false
  }
];

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
  
  const featuredPosts = blogPosts.filter(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured);
  
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
            <p className="text-xl text-muted-foreground mb-8">
              At NatuAsili, we believe that conservation thrives through connection between people, places, wildlife, and the partners working to protect them. MILA (Moments Inspiring Local Actions) is where we share the experiences that inspire local action and global support.

Through stories from communities, conservation organizations, and travelers, we spotlight how nature-based experiences drive awareness, funding, and positive change. From the forests and savannahs to coastlines and cultures, MILA celebrates the collaborations that help protect Africa's wild places.

Welcome to MILA — stories of people, places, wildlife, and the partners making a difference.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className="py-12">
          <div className="content-max-width">
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
                      <Link 
                        to={`/blog/category/${slugify(post.category)}`}
                        className="inline-block"
                      >
                        <Badge className="bg-black text-white border-black cursor-pointer">
                          {post.category}
                        </Badge>
                      </Link>
                    </div>
                    <div className="absolute top-4 right-4">
                      <Badge variant="secondary" className="bg-primary text-primary-foreground">
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
                    
                    <Link to={`/blog/${post.slug}`}>
                      <Button className="w-full">
                        Read more
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
        <div className="content-max-width">
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
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-12">
        <div className="content-max-width">
          <div className="flex items-center gap-4 mb-8">
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
                  
                  <CardHeader className="flex-grow">
                    <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    
                    <Link to={`/blog/${post.slug}`}>
                      <Button variant="outline" className="w-full">
                        Read more
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
    </div>
  );
};

export default Blog;

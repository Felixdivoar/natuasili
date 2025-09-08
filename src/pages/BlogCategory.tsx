import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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

const blogPosts = [
  {
    slug: "partner-natuasili-support-conservation-impact",
    title: "Partner with Natuasili and support conservation impact",
    excerpt: "We see that a great part of organizations and host communities can contribute to conservation. Along with improving your profile, partnering with us directly supports conservation efforts.",
    category: "Host Resources",
    author: "NatuAsili Team",
    date: "2024-01-15",
    readTime: "5 min read",
    image: partnerConservationImpact,
  },
  {
    slug: "community-resilience-conservation-tourism",
    title: "Community resilience through conservation tourism",
    excerpt: "Eco-tourism is a powerful tool for conservation, providing communities with sustainable livelihoods while protecting wildlife. This blog explores how tourism can reduce reliance on compensation payouts and build community resilience.",
    category: "Purposeful Travel",
    author: "Sarah Kimani",
    date: "2024-01-12",
    readTime: "6 min read",
    image: communityResilienceTourism,
  },
  {
    slug: "why-conservation-need-you-travel-purpose",
    title: "Why does conservation need you? Travel with purpose",
    excerpt: "Conservation is no longer the sole responsibility of governments and ngos. It is a global call to action, one that requires the participation of individuals, communities, and travelers alike.",
    category: "Conservation and Community Engagement",
    author: "Dr. Sarah Kimani",
    date: "2024-01-14",
    readTime: "8 min read",
    image: conservationTechBlog,
  },
  {
    slug: "travel-for-good-conservation-community-impact",
    title: "Travel for good: conservation and community impact",
    excerpt: "In a world where travel has become more accessible than ever, an important question arises: How can we ensure that our adventures leave a positive impact?",
    category: "Purposeful Travel",
    author: "Alice Nyong'o",
    date: "2024-01-09",
    readTime: "7 min read",
    image: travelForGood,
  },
  {
    slug: "digital-conservation-solutions-future-wildlife-tech",
    title: "Digital conservation solutions; the future wildlife tech",
    excerpt: "Technology is revolutionizing the way we protect wildlife and manage human-wildlife conflict. The rollout of a new digital claims system is a game-changer for communities affected by wildlife damage.",
    category: "Conservation and Community Engagement",
    author: "James Mwangi",
    date: "2024-01-10",
    readTime: "5 min read",
    image: digitalConservationSolutions,
  },
  {
    slug: "creating-sustainable-livelihoods-conservation-tourism",
    title: "Creating sustainable livelihoods through conservation tourism",
    excerpt: "For many communities living near wildlife, compensation payouts have been a critical safety net. However, these payouts alone are not enough to build long-term resilience.",
    category: "Conservation and Community Engagement",
    author: "Peter Njoroge",
    date: "2024-01-08",
    readTime: "7 min read",
    image: sustainableLivelihoodsConservation,
  },
  {
    slug: "reducing-human-wildlife-conflict-path-coexistence",
    title: "Reducing human–wildlife conflict: path to coexistence",
    excerpt: "Human-wildlife conflict is one of the most pressing challenges facing conservation efforts today. It not only threatens wildlife populations but also impacts the livelihoods of communities living near conservation areas.",
    category: "Conservation and Community Engagement",
    author: "Dr. Grace Wanjiru",
    date: "2024-01-05",
    readTime: "8 min read",
    image: humanWildlifeConflict,
  },
  {
    slug: "host-conservation-experiences-expand-mission",
    title: "Host conservation experiences and expand your mission",
    excerpt: "If you run a community-based business or conservation organization, you are familiar with creating unique experiences that capture your goal for visitors.",
    category: "Conservation and Community Engagement",
    author: "Michael Kipchoge",
    date: "2024-01-04",
    readTime: "6 min read",
    image: hostConservationExpand,
  },
  {
    slug: "partner-natuasili-grow-your-impact",
    title: "Partner with Natuasili and grow your impact",
    excerpt: "As a host, lodge owner, conservancy leader, or community initiative, your work is at the heart of Kenya's future. Whether you are protecting endangered wildlife, preserving cultural heritage, or uplifting local communities, your efforts are shaping the landscapes and lives that define this region.",
    category: "Host Resources",
    author: "Dr. John Muriuki",
    date: "2024-01-03",
    readTime: "9 min read",
    image: partnerGrowImpact,
  },
  {
    slug: "beyond-safari-adding-purpose-itinerary",
    title: "Beyond the safari: adding purpose to your itinerary",
    excerpt: "Kenya's sweeping savannas, dramatic landscapes, and legendary safaris have long drawn travelers seeking encounters with the big five. But beyond the game drives and golden sunsets lies a deeper, more profound story.",
    category: "Travel Tips and Itineraries",
    author: "Mary Chepkemoi",
    date: "2024-01-01",
    readTime: "7 min read",  
    image: beyondSafariPurpose,
  },
  {
    slug: "conservation-through-collaboration-natuasili",
    title: "Conservation through collaboration with Natuasili",
    excerpt: "At Natuasili, we value the amazing effort conservationists and communities living around protected areas undertake to preserve the natural wonders of our earth.",
    category: "Conservation and Community Engagement",
    author: "Dr. James Olaka",
    date: "2023-12-30",
    readTime: "6 min read",
    image: conservationCollaboration,
  },
  {
    slug: "kenyan-coast-conservation-meets-culture",
    title: "Kenyan Coast where conservation meets culture",
    excerpt: "The Kenyan Coast is more than just a picturesque destination of white sandy beaches and turquoise waters. It is a place where history, heritage, and conservation intertwine.",
    category: "Conservation and Community Engagement",
    author: "Dr. John Muriuki",
    date: "2023-12-28",
    readTime: "6 min read",
    image: sustainableTourismBlog,
  },
  {
    slug: "hosted-conservation-cultural-experiences",
    title: "Hosted conservation and cultural experiences",
    excerpt: "Are you a community-based or conservation organization looking to enhance the hosting of the experiences you provide? Joining Natuasili means joining a dynamic community of driven travelers.",
    category: "Conservation and Community Engagement",
    author: "Peter Mwangi",
    date: "2023-12-27",
    readTime: "5 min read",
    image: partnerConservationImpact,
  },
  {
    slug: "embracing-sustainability-travel-experience",
    title: "Embracing sustainability in every travel experience",
    excerpt: "The concept of sustainability is central to our work at Natuasili; it is more than simply a slogan; it is a fundamental commitment.",
    category: "Conservation and Community Engagement",
    author: "Grace Wanjiru",
    date: "2023-12-26",
    readTime: "6 min read",
    image: sustainableTourismBlog,
  },
  {
    slug: "host-natuasili-share-your-impact",
    title: "Host with Natuasili and share your impact",
    excerpt: "Are you a community-based enterprise or conservation organization that is committed to positively making the world a better place through your activities?",
    category: "Host Resources",
    author: "Samuel Kiprotich",
    date: "2023-12-25",
    readTime: "7 min read",
    image: partnerGrowImpact,
  },
  {
    slug: "join-natuasili-make-travels-count",
    title: "Join Natuasili and make your travels count",
    excerpt: "One great approach to seeing the world, learning about other cultures, and making lifelong memories is travel. But suppose your travels could serve purposes beyond mere personal experience?",
    category: "Conservation and Community Engagement",
    author: "Mary Chepkemoi",
    date: "2023-12-24",
    readTime: "6 min read",
    image: beyondSafariPurpose,
  },
  {
    slug: "transforming-tourism-natuasili-approach",
    title: "Transforming tourism: The Natuasili approach",
    excerpt: "For decades, tourism has been a gateway to experiencing the wonders of the world, from breathtaking landscapes to diverse cultures and wildlife. But at Natuasili, we believe that travel should be more than just exploration.",
    category: "Purposeful Travel",
    author: "Alice Nyong'o",
    date: "2023-12-23",
    readTime: "5 min read",
    image: conservationTechBlog,
  },
  {
    slug: "authentic-kenya-experiences-natuasili",
    title: "Authentic Kenya experiences with Natuasili",
    excerpt: "Natuasili is working to redefine what authenticity means in the travel industry in a world where the word is sometimes overused and under-delivered.",
    category: "Conservation and Community Engagement",
    author: "Dr. Sarah Kimani",
    date: "2023-12-22",
    readTime: "6 min read",
    image: authenticKenyaExperiences,
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
      case 'Host Resources': return 'bg-conservation/10 text-conservation border-conservation/20';
      case 'Purposeful Travel': return 'bg-primary/10 text-primary border-primary/20';
      case 'Conservation and Community Engagement': return 'bg-accent/10 text-accent border-accent/20';
      case 'Travel Tips and Itineraries': return 'bg-secondary/10 text-secondary border-secondary/20';
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
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Carousel from "@/components/Carousel";
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
import travelGivesBack from "@/assets/blog/travel-gives-back.jpg";
import tailoredConservationItineraries from "@/assets/blog/tailored-conservation-itineraries.webp";
import purposefulTravelExperiences from "@/assets/blog/purposeful-travel-experiences.jpg";
interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  image: string;
}
const allBlogPosts: BlogPost[] = [{
  slug: "partner-natuasili-support-conservation-impact",
  title: "Partner with Natuasili and support conservation impact",
  excerpt: "We see that a great part of organizations and host communities can contribute to conservation. Along with improving your profile, partnering with us directly supports conservation efforts.",
  category: "Host Resources",
  author: "NatuAsili Team",
  date: "2024-01-15",
  readTime: "5 min read",
  image: partnerConservationImpact
}, {
  slug: "community-resilience-conservation-tourism",
  title: "Community resilience through conservation tourism",
  excerpt: "Eco-tourism is a powerful tool for conservation, providing communities with sustainable livelihoods while protecting wildlife.",
  category: "Purposeful Travel",
  author: "Sarah Kimani",
  date: "2024-01-12",
  readTime: "6 min read",
  image: communityResilienceTourism
}, {
  slug: "why-conservation-need-you-travel-purpose",
  title: "Why does conservation need you? Travel with purpose",
  excerpt: "Conservation is no longer the sole responsibility of governments and ngos. It is a global call to action, one that requires the participation of individuals, communities, and travelers alike.",
  category: "Conservation and Community Engagement",
  author: "Dr. Sarah Kimani",
  date: "2024-01-14",
  readTime: "8 min read",
  image: conservationTechBlog
}, {
  slug: "travel-for-good-conservation-community-impact",
  title: "Travel for good: conservation and community impact",
  excerpt: "In a world where travel has become more accessible than ever, an important question arises: How can we ensure that our adventures leave a positive impact?",
  category: "Purposeful Travel",
  author: "Alice Nyong'o",
  date: "2024-01-09",
  readTime: "7 min read",
  image: travelForGood
}, {
  slug: "digital-conservation-solutions-future-wildlife-tech",
  title: "Digital conservation solutions; the future wildlife tech",
  excerpt: "Technology is revolutionizing the way we protect wildlife and manage human-wildlife conflict.",
  category: "Conservation and Community Engagement",
  author: "James Mwangi",
  date: "2024-01-10",
  readTime: "5 min read",
  image: digitalConservationSolutions
}, {
  slug: "creating-sustainable-livelihoods-conservation-tourism",
  title: "Creating sustainable livelihoods through conservation tourism",
  excerpt: "For many communities living near wildlife, compensation payouts have been a critical safety net. However, these payouts alone are not enough to build long-term resilience.",
  category: "Conservation and Community Engagement",
  author: "Peter Njoroge",
  date: "2024-01-08",
  readTime: "7 min read",
  image: sustainableLivelihoodsConservation
}, {
  slug: "reducing-human-wildlife-conflict-path-coexistence",
  title: "Reducing human–wildlife conflict: path to coexistence",
  excerpt: "Human-wildlife conflict is one of the most pressing challenges facing conservation efforts today.",
  category: "Conservation and Community Engagement",
  author: "Dr. Grace Wanjiru",
  date: "2024-01-05",
  readTime: "8 min read",
  image: humanWildlifeConflict
}, {
  slug: "host-conservation-experiences-expand-mission",
  title: "Host conservation experiences and expand your mission",
  excerpt: "If you run a community-based business or conservation organization, you are familiar with creating unique experiences that capture your goal for visitors.",
  category: "Conservation and Community Engagement",
  author: "Michael Kipchoge",
  date: "2024-01-04",
  readTime: "6 min read",
  image: hostConservationExpand
}, {
  slug: "beyond-safari-adding-purpose-itinerary",
  title: "Beyond the safari: adding purpose to your itinerary",
  excerpt: "Kenya's sweeping savannas, dramatic landscapes, and legendary safaris have long drawn travelers seeking encounters with the big five. But beyond the game drives and golden sunsets lies a deeper, more profound story.",
  category: "Travel Tips and Itineraries",
  author: "Mary Chepkemoi",
  date: "2024-01-01",
  readTime: "7 min read",
  image: beyondSafariPurpose
}, {
  slug: "travel-gives-back-natuasili",
  title: "Travel that gives back with Natuasili",
  excerpt: "Travel has an amazing ability to change our lives as well as the environment around us.",
  category: "Purposeful Travel",
  author: "Dr. Sarah Kimani",
  date: "2024-01-16",
  readTime: "6 min read",
  image: travelGivesBack
}, {
  slug: "tailored-kenya-conservation-itineraries",
  title: "Tailored Kenya conservation itineraries by Natuasili",
  excerpt: "Imagine a travel experience that's tailor-made just for you. A tour that not only takes you to breathtaking destinations but also aligns perfectly with your passions and interests.",
  category: "Purposeful Travel",
  author: "James Mwangi",
  date: "2024-01-17",
  readTime: "7 min read",
  image: tailoredConservationItineraries
}, {
  slug: "purposeful-travel-experiences-natuasili",
  title: "Purposeful travel experiences with Natuasili",
  excerpt: "Are you looking for travel experiences that leave a lasting impact, not just on your memories but on the world around you?",
  category: "Purposeful Travel",
  author: "Alice Nyong'o",
  date: "2024-01-18",
  readTime: "6 min read",
  image: purposefulTravelExperiences
}];
interface SimilarBlogsProps {
  currentSlug: string;
  currentCategory?: string;
}
const SimilarBlogs = ({
  currentSlug,
  currentCategory
}: SimilarBlogsProps) => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Host Resources':
        return 'bg-conservation/10 text-conservation border-conservation/20';
      case 'Purposeful Travel':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'Conservation and Community Engagement':
        return 'bg-accent/10 text-accent border-accent/20';
      case 'Travel Tips and Itineraries':
        return 'bg-secondary/10 text-secondary border-secondary/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  // Filter out current post and prioritize same category
  const filteredPosts = allBlogPosts.filter(post => post.slug !== currentSlug).sort((a, b) => {
    // If we have a category, prioritize posts from same category
    if (currentCategory) {
      if (a.category === currentCategory && b.category !== currentCategory) return -1;
      if (b.category === currentCategory && a.category !== currentCategory) return 1;
    }
    // Then sort by date (newest first)
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  }).slice(0, 6); // Get top 6 for carousel

  if (filteredPosts.length === 0) return null;
  return <section className="py-12 bg-muted/20">
      <div className="container mx-auto px-4 max-w-6xl">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Similar articles</h2>
        
        <Carousel showArrows className="mx-auto">
          {filteredPosts.map(post => <div key={post.slug} className="flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.333%] min-w-0 pr-4">
              <Link to={`/blog/${post.slug}`}>
                <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full">
                  <div className="aspect-[16/10] bg-muted relative overflow-hidden">
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  
                  <CardHeader className="pb-3">
                    <div className="mb-3">
                      <Badge className={getCategoryColor(post.category)}>
                        {post.category}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg font-semibold line-clamp-2 mb-2 hover:text-primary transition-colors">
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
            </div>)}
        </Carousel>
      </div>
    </section>;
};
export default SimilarBlogs;
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, User, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

import impactMetricsBlog from "@/assets/blog/impact-metrics-blog.jpg";
import partnerSpotlightBlog from "@/assets/blog/partner-spotlight-blog.jpg";
import whyPartnerBlog from "@/assets/blog/why-partner-blog.jpg";
import sustainableTourismBlog from "@/assets/blog/sustainable-tourism-blog.jpg";
import communityImpactBlog from "@/assets/blog/community-impact-blog.jpg";
import conservationTechBlog from "@/assets/blog/conservation-tech-blog.jpg";

const blogContent = {
  "real-impact-conservation-tourism-kenya": {
    title: "The Real Impact of Conservation Tourism in Kenya",
    excerpt: "How traveler contributions are transforming wildlife protection efforts across Kenya's most critical habitats.",
    category: "Impact Stories",
    author: "Dr. Sarah Kimani",
    date: "2024-01-15",
    readTime: "5 min read",
    image: impactMetricsBlog,
    content: `
      <p>Conservation tourism in Kenya has emerged as a powerful force for positive change, creating a sustainable model that benefits both wildlife and local communities. Over the past year, our platform has facilitated meaningful connections between conscious travelers and conservation initiatives across the country.</p>
      
      <h2>Measurable Conservation Outcomes</h2>
      <p>Through partnerships with organizations like the Maasai Mara Wildlife Conservancy and Ol Pejeta Conservancy, traveler contributions have directly funded:</p>
      <ul>
        <li>GPS collaring of 15 elephants for monitoring and protection</li>
        <li>Training of 50 community conservancy rangers</li>
        <li>Restoration of 200 hectares of degraded habitat</li>
        <li>Anti-poaching patrols covering 500,000 acres</li>
      </ul>
      
      <h2>Community Empowerment</h2>
      <p>Beyond wildlife protection, conservation tourism creates direct economic opportunities for local communities. Our partner projects have generated over $400,000 in community income, supporting traditional livelihoods while incentivizing conservation.</p>
      
      <h2>The Multiplier Effect</h2>
      <p>Each dollar spent on conservation experiences creates a ripple effect. Local guides, cultural practitioners, and conservation organizations all benefit, creating a sustainable ecosystem that makes conservation economically viable for communities.</p>
    `
  },
  "partner-spotlight-maasai-mara-conservancy": {
    title: "Partner Spotlight: Maasai Mara Wildlife Conservancy",
    excerpt: "Meet the team behind one of Kenya's most successful community-led conservation initiatives.",
    category: "Partner Spotlight",
    author: "James Mwangi",
    date: "2024-01-12",
    readTime: "4 min read", 
    image: partnerSpotlightBlog,
    content: `
      <p>The Maasai Mara Wildlife Conservancy stands as a shining example of community-led conservation in action. Founded in partnership with local Maasai communities, the conservancy protects over 1,500 square kilometers of critical wildlife habitat.</p>
      
      <h2>Community-Centered Approach</h2>
      <p>What sets this conservancy apart is its commitment to working with, not against, traditional land use practices. Maasai pastoralists continue to graze their cattle in designated areas, while wildlife corridors remain protected for the Great Migration.</p>
      
      <h2>Conservation Achievements</h2>
      <ul>
        <li>35% increase in wildlife populations since 2010</li>
        <li>Zero rhino poaching incidents in the past 3 years</li>
        <li>200+ community members employed as rangers and guides</li>
        <li>50 students supported through conservation scholarships</li>
      </ul>
      
      <h2>Visitor Impact</h2>
      <p>Through our platform, travelers contribute directly to ranger salaries, wildlife monitoring equipment, and community development projects. Every safari experience helps fund the conservancy's vital work.</p>
      
      <h2>Looking Forward</h2>
      <p>Plans for 2024 include expanding the junior ranger program, establishing a wildlife veterinary clinic, and launching a carbon offset program through grassland restoration.</p>
    `
  },
  "why-partner-natuasili-guide": {
    title: "Why Partner with NatuAsili? A Conservation Organization's Guide",
    excerpt: "Everything you need to know about joining Kenya's premier conservation impact platform.",
    category: "Partnership Guide",
    author: "Alice Nyong'o",
    date: "2024-01-10",
    readTime: "6 min read",
    image: whyPartnerBlog,
    content: `
      <p>For conservation organizations looking to expand their impact and reach new audiences, partnering with NatuAsili offers unprecedented opportunities for growth and sustainability.</p>
      
      <h2>Direct Access to Conservation-Minded Travelers</h2>
      <p>Our platform connects you with travelers specifically seeking authentic conservation experiences. These aren't casual tourists – they're conservation advocates ready to contribute meaningfully to your work.</p>
      
      <h2>Transparent Impact Tracking</h2>
      <p>Every booking through our platform generates detailed impact reports, showing exactly how traveler contributions support your conservation goals. This transparency builds trust and encourages repeat engagement.</p>
      
      <h2>Marketing and Promotion Support</h2>
      <p>Our team provides professional photography, storytelling support, and digital marketing to showcase your work to a global audience. We handle the marketing so you can focus on conservation.</p>
      
      <h2>Financial Benefits</h2>
      <ul>
        <li>90% of booking fees go directly to partner organizations</li>
        <li>No upfront costs or membership fees</li>
        <li>Streamlined payment processing in multiple currencies</li>
        <li>Detailed financial reporting and impact analytics</li>
      </ul>
      
      <h2>Getting Started</h2>
      <p>Joining our network is straightforward. We work with organizations of all sizes, from community groups to established conservancies. Our partnership team provides onboarding support and ongoing assistance.</p>
      
      <h2>Partner Requirements</h2>
      <p>We look for organizations with clear conservation goals, community engagement, and commitment to transparency in their operations and impact reporting.</p>
    `
  },
  "sustainable-livelihoods-conservation": {
    title: "Building Sustainable Livelihoods Through Conservation",
    excerpt: "How authentic tourism experiences are creating economic opportunities for local communities.",
    category: "Community Impact",
    author: "Peter Njoroge",
    date: "2024-01-08",
    readTime: "7 min read",
    image: communityImpactBlog,
    content: `
      <p>Conservation and community development are not competing interests – they are complementary forces that, when aligned, create powerful outcomes for both people and wildlife.</p>
      
      <h2>Traditional Knowledge as Economic Asset</h2>
      <p>Local communities possess invaluable traditional knowledge about wildlife behavior, medicinal plants, and sustainable land management. Our platform helps monetize this knowledge through authentic educational experiences.</p>
      
      <h2>Case Study: Samburu Cultural Experiences</h2>
      <p>In Samburu County, our partnership with local cultural groups has created new income streams for over 100 community members. Traditional beadwork workshops, storytelling sessions, and guided nature walks now provide consistent income.</p>
      
      <h2>Women's Empowerment</h2>
      <p>Many of our community-based experiences specifically support women's groups. Beadwork cooperatives, traditional cooking workshops, and craft demonstrations provide economic independence for rural women.</p>
      
      <h2>Youth Engagement</h2>
      <p>Conservation tourism creates opportunities for young people to stay in their communities while earning sustainable incomes. Junior guide programs and cultural ambassadors give youth pride in their heritage.</p>
      
      <h2>Measuring Impact</h2>
      <p>We track not just environmental outcomes but social and economic impacts. Our partners report increased school enrollment, improved healthcare access, and reduced human-wildlife conflict in areas with active conservation tourism.</p>
      
      <h2>The Path Forward</h2>
      <p>Sustainable livelihoods require long-term thinking and community ownership. Our approach ensures that tourism benefits are distributed equitably and that communities maintain control over their resources and experiences.</p>
    `
  },
  "habitat-restoration-success-stories": {
    title: "From Degraded Land to Thriving Habitat: Restoration Success Stories",
    excerpt: "Witness the transformation of Kenya's ecosystems through community-led restoration efforts.",
    category: "Restoration",
    author: "Dr. Grace Wanjiru", 
    date: "2024-01-05",
    readTime: "8 min read",
    image: sustainableTourismBlog,
    content: `
      <p>Habitat restoration in Kenya demonstrates the remarkable resilience of natural ecosystems when given the chance to recover. Through community-led initiatives and scientific guidance, degraded landscapes are returning to life.</p>
      
      <h2>Karura Forest: Urban Conservation Success</h2>
      <p>Once facing encroachment and degradation, Karura Forest now stands as a model of urban conservation. Through our platform, visitors participate in tree planting and learn about forest ecosystem restoration.</p>
      
      <h2>Coastal Mangrove Restoration</h2>
      <p>Along Kenya's coast, mangrove restoration projects are reversing decades of habitat loss. Community-led planting initiatives have restored over 50 hectares of mangrove forest, protecting coastlines and supporting fisheries.</p>
      
      <h2>Scientific Approach</h2>
      <p>Restoration efforts combine traditional knowledge with modern science:</p>
      <ul>
        <li>Soil analysis to determine optimal planting conditions</li>
        <li>Native species selection for maximum ecosystem benefit</li>
        <li>GPS tracking of planted trees for monitoring</li>
        <li>Biodiversity surveys to measure restoration success</li>
      </ul>
      
      <h2>Community Ownership</h2>
      <p>Successful restoration requires community buy-in. Local communities become forest guardians, protecting restored areas while benefiting from sustainable resource use and eco-tourism opportunities.</p>
      
      <h2>Wildlife Returns</h2>
      <p>As habitats recover, wildlife populations rebound. Bird species counts, small mammal populations, and insect diversity all show marked improvements in restored areas.</p>
      
      <h2>Visitor Participation</h2>
      <p>Through hands-on restoration experiences, visitors become part of the solution. Each tree planted represents a tangible contribution to Kenya's environmental future.</p>
    `
  },
  "future-wildlife-protection-technology": {
    title: "The Future of Wildlife Protection: Technology Meets Tradition",
    excerpt: "How modern technology is enhancing traditional conservation methods in Kenya's protected areas.",
    category: "Innovation",
    author: "Michael Kipchoge",
    date: "2024-01-03", 
    readTime: "5 min read",
    image: conservationTechBlog,
    content: `
      <p>The future of wildlife conservation lies in the seamless integration of cutting-edge technology with time-tested traditional knowledge. Kenya's conservancies are leading this technological revolution.</p>
      
      <h2>GPS Collaring and Tracking</h2>
      <p>Modern GPS collars provide real-time location data for elephants, rhinos, and other large mammals. This technology enables rapid response to human-wildlife conflict and poaching threats.</p>
      
      <h2>Camera Trap Networks</h2>
      <p>Motion-activated cameras create a digital surveillance network across vast landscapes. AI-powered image analysis automatically identifies species and alerts rangers to unusual activity.</p>
      
      <h2>Drone Surveillance</h2>
      <p>Unmanned aerial vehicles patrol remote areas, providing eyes in the sky for anti-poaching operations. Thermal imaging capabilities enable nighttime monitoring of wildlife movements.</p>
      
      <h2>Traditional Knowledge Integration</h2>
      <p>Technology amplifies rather than replaces traditional tracking skills. Local trackers use smartphone apps to record wildlife sign data, contributing to scientific databases while maintaining cultural practices.</p>
      
      <h2>Community Engagement</h2>
      <p>Mobile technology connects remote communities to conservation networks. Rangers use WhatsApp groups to coordinate patrols and report wildlife sightings in real-time.</p>
      
      <h2>Visitor Experience</h2>
      <p>Technology enhances visitor experiences without diminishing authenticity. QR codes provide additional information about wildlife sightings, while mobile apps help identify bird species and track trees.</p>
      
      <h2>Data-Driven Conservation</h2>
      <p>Big data analytics reveal patterns in wildlife movement, helping conservationists make informed decisions about habitat management and protection strategies.</p>
    `
  }
};

const BlogPost = () => {
  const { slug } = useParams();
  const post = slug ? blogContent[slug as keyof typeof blogContent] : null;

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Blog post not found</h1>
          <Link to="/blog">
            <Button>Return to Blog</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

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
      
      <article className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <Link to="/blog">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
          
          <div className="mb-6">
            <Link 
              to={`/blog/category/${post.category.toLowerCase().replace(/\s+/g, '-')}`}
              className="inline-block"
            >
              <Badge className={`${getCategoryColor(post.category)} post-category hover:opacity-80 transition-opacity cursor-pointer`}>
                {post.category}
              </Badge>
            </Link>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            {post.title}
          </h1>
          
          <p className="text-xl text-muted-foreground mb-6">
            {post.excerpt}
          </p>
          
          <div className="flex items-center gap-6 text-sm text-muted-foreground mb-8">
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              {post.author}
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {new Date(post.date).toLocaleDateString()}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {post.readTime}
            </div>
          </div>
        </div>
        
        <div className="mb-8">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-[400px] object-cover rounded-lg"
          />
        </div>
        
        <div 
          className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-foreground prose-li:text-foreground prose-strong:text-foreground"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
        
        <div className="mt-12 pt-8 border-t border-border">
          <div className="text-center">
            <h3 className="text-xl font-bold mb-4">Ready to Make an Impact?</h3>
            <p className="text-muted-foreground mb-6">
              Explore conservation experiences and start your journey with us.
            </p>
            <Link to="/browse">
              <Button size="lg" className="bg-accent hover:bg-accent/90">
                Browse Experiences
              </Button>
            </Link>
          </div>
        </div>
      </article>
      
      <Footer />
    </div>
  );
};

export default BlogPost;
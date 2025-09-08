import partnerConservationImpact from "@/assets/blog/partner-conservation-impact.jpg";
import communityResilienceTourism from "@/assets/blog/community-resilience-tourism.webp";
import digitalConservationSolutions from "@/assets/blog/digital-conservation-solutions.png";
import sustainableLivelihoodsConservation from "@/assets/blog/sustainable-livelihoods-conservation.webp";
import humanWildlifeConflict from "@/assets/blog/human-wildlife-conflict.webp";
import partnerGrowImpact from "@/assets/blog/partner-grow-impact.jpg";
import travelForGood from "@/assets/blog/travel-for-good.webp";
import hostConservationExpand from "@/assets/blog/host-conservation-expand.jpg";
import travelGivesBack from "@/assets/blog/travel-gives-back.jpg";

export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content?: string;
  category: string;
  author: string;
  date: string;
  readTime?: string;
  image: string;
  slug: string;
  impact?: {
    [key: string]: string;
  };
}

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "Partner with Natuasili and support conservation impact",
    excerpt: "We see that a great part of organizations and host communities can contribute to conservation. Along with improving your profile, partnering with us directly supports conservation efforts.",
    content: `
      <p>Conservation partnerships are at the heart of meaningful environmental change in Kenya. Through our platform, organizations and host communities become active participants in protecting wildlife and ecosystems while building sustainable livelihoods.</p>
      
      <p>Our partnership model creates direct benefits for local communities through conservation tourism revenue, employment opportunities, and capacity building programs. When you partner with NatuAsili, you're joining a network of change-makers committed to long-term conservation success.</p>
      
      <h3>Partnership Impact:</h3>
      <ul>
        <li>85% of tourism revenue goes directly to conservation partners</li>
        <li>300+ community members employed through our network</li>
        <li>15 community conservancies supported</li>
        <li>$2.5M+ in conservation funding distributed</li>
      </ul>
      
      <p>The future of conservation depends on collaborative efforts that empower communities while protecting precious ecosystems. Through strategic partnerships, we're proving that conservation and community development go hand in hand.</p>
    `,
    category: "Host Resources",
    author: "NatuAsili Team",
    date: "2024-01-15",
    readTime: "5 min read",
    image: partnerConservationImpact,
    slug: "partner-natuasili-support-conservation-impact",
    impact: {
      partners: "16",
      funding: "$2.5M",
      communities: "15"
    }
  },
  {
    id: 2,
    title: "Community resilience through conservation tourism",
    excerpt: "Eco-tourism is a powerful tool for conservation, providing communities with sustainable livelihoods while protecting wildlife.",
    content: `
      <p>Conservation tourism represents a transformative approach to wildlife protection that places local communities at the center of conservation efforts. In Kenya's diverse landscapes, this model has proven exceptionally effective in creating lasting change.</p>
      
      <p>Through carefully designed tourism experiences, communities gain direct economic benefits from wildlife conservation. This approach shifts the narrative from wildlife as a burden to wildlife as an asset, creating powerful incentives for protection.</p>
      
      <h3>Community Benefits:</h3>
      <ul>
        <li>Average 40% increase in household income</li>
        <li>200+ permanent jobs created in rural areas</li>
        <li>90% reduction in poaching incidents</li>
        <li>12 community-managed conservancies established</li>
      </ul>
      
      <p>The success of conservation tourism in Kenya demonstrates that environmental protection and economic development can thrive together when communities are empowered as conservation leaders.</p>
    `,
    category: "Purposeful Travel",
    author: "Dr. Sarah Kimani",
    date: "2024-01-12",
    readTime: "6 min read", 
    image: communityResilienceTourism,
    slug: "community-resilience-conservation-tourism",
    impact: {
      jobs: "200",
      conservancies: "12",
      incidents: "90%"
    }
  },
  {
    id: 3,
    title: "Digital conservation solutions: the future of wildlife tech",
    excerpt: "Technology is revolutionizing the way we protect wildlife and manage human-wildlife conflict through innovative digital solutions.",
    content: `
      <p>The integration of cutting-edge technology in wildlife conservation has opened new frontiers in protecting Kenya's precious biodiversity. From GPS tracking to AI-powered monitoring systems, digital solutions are transforming conservation effectiveness.</p>
      
      <p>Our technology partnerships enable real-time wildlife monitoring, early warning systems for human-wildlife conflict, and data-driven conservation decision making. These innovations are particularly crucial in managing large migration corridors and protecting endangered species.</p>
      
      <h3>Technology Impact:</h3>
      <ul>
        <li>24/7 real-time wildlife monitoring across 50,000 hectares</li>
        <li>75% reduction in human-wildlife conflict response time</li>
        <li>95% accuracy in species identification and tracking</li>
        <li>30+ conservation organizations using our tech platform</li>
      </ul>
      
      <p>As we look to the future, digital conservation solutions will play an increasingly vital role in scaling conservation efforts and ensuring the survival of Kenya's iconic wildlife for generations to come.</p>
    `,
    category: "Conservation and Community Engagement",
    author: "James Mwangi", 
    date: "2024-01-10",
    readTime: "5 min read",
    image: digitalConservationSolutions,
    slug: "digital-conservation-solutions-future-wildlife-tech",
    impact: {
      hectares: "50,000",
      accuracy: "95%",
      organizations: "30"
    }
  },
  {
    id: 4,
    title: "Travel for good: conservation and community impact",
    excerpt: "In a world where travel has become more accessible than ever, an important question arises: How can we ensure that our adventures leave a positive impact?",
    content: `
      <p>Responsible tourism has the power to transform destinations and communities while creating unforgettable experiences for travelers. In Kenya, purposeful travel initiatives are generating measurable conservation and social impact.</p>
      
      <p>Every journey with purpose contributes to wildlife protection, community empowerment, and cultural preservation. Our travelers become active participants in conservation, with each experience directly funding critical environmental projects.</p>
      
      <h3>Travel Impact:</h3>
      <ul>
        <li>5,000+ travelers engaged in conservation activities</li>
        <li>$800,000 in direct conservation funding generated</li>
        <li>25 community projects supported through tourism revenue</li>
        <li>98% traveler satisfaction with impact experiences</li>
      </ul>
      
      <p>The future of travel lies in creating meaningful connections between visitors and destinations, where every journey contributes to positive change and lasting conservation impact.</p>
    `,
    category: "Purposeful Travel",
    author: "Alice Nyong'o",
    date: "2024-01-09",
    readTime: "7 min read",
    image: travelForGood,
    slug: "travel-for-good-conservation-community-impact",
    impact: {
      travelers: "5,000",
      funding: "$800K",
      projects: "25"
    }
  },
  {
    id: 5,
    title: "Host conservation experiences and expand your mission",
    excerpt: "If you run a community-based business or conservation organization, you are familiar with creating unique experiences that capture your goal for visitors.",
    content: `
      <p>Conservation organizations and community groups across Kenya are discovering the transformative power of hosting immersive conservation experiences. These programs not only generate sustainable funding but also create deep connections between visitors and conservation work.</p>
      
      <p>By opening their doors to travelers, conservation hosts share their mission while generating critical revenue for ongoing projects. This model has proven particularly effective in remote areas where traditional funding sources may be limited.</p>
      
      <h3>Host Program Results:</h3>
      <ul>
        <li>45 conservation organizations participating as hosts</li>
        <li>Average 60% increase in funding for host organizations</li>
        <li>3,500+ visitors engaged in hands-on conservation work</li>
        <li>15 new conservation programs launched through tourism revenue</li>
      </ul>
      
      <p>The expansion of conservation hosting represents a sustainable model for scaling environmental protection while creating authentic, educational experiences for travelers seeking meaningful engagement with Kenya's wildlife and communities.</p>
    `,
    category: "Conservation and Community Engagement",
    author: "Michael Kipchoge",
    date: "2024-01-04", 
    readTime: "6 min read",
    image: hostConservationExpand,
    slug: "host-conservation-experiences-expand-mission",
    impact: {
      organizations: "45",
      visitors: "3,500",
      programs: "15"
    }
  },
  {
    id: 6,
    title: "Travel that gives back with Natuasili",
    excerpt: "Travel has an amazing ability to change our lives as well as the environment around us. We are eager to share with you the intangible potential of your travels.",
    content: `
      <p>At NatuAsili, we believe that travel should be a force for good – creating positive change for both travelers and destinations. Our platform connects conscious travelers with meaningful conservation experiences that generate lasting impact.</p>
      
      <p>Every booking through our platform contributes directly to wildlife protection, community development, and environmental restoration. We've designed our model to ensure maximum transparency and impact, with real-time tracking of how travel dollars translate into conservation outcomes.</p>
      
      <h3>Platform Impact:</h3>
      <ul>
        <li>90% of booking revenue goes directly to conservation and communities</li>
        <li>23 conservation experiences available across Kenya</li>
        <li>16 partner organizations supported</li>
        <li>100% transparency in fund allocation and impact reporting</li>
      </ul>
      
      <p>Through NatuAsili, your travels become a catalyst for positive change, creating ripple effects that extend far beyond your journey and contribute to the long-term conservation of Kenya's incredible natural heritage.</p>
    `,
    category: "Purposeful Travel",
    author: "Dr. Sarah Kimani",
    date: "2024-01-16", 
    readTime: "6 min read",
    image: travelGivesBack,
    slug: "travel-gives-back-natuasili",
    impact: {
      revenue: "90%",
      experiences: "23",
      transparency: "100%"
    }
  }
];

// Filter for impact-focused stories
export const impactStories = blogPosts
  .filter(post => post.impact && (
    post.category === "Conservation and Community Engagement" || 
    post.category === "Purposeful Travel"
  ))
  .slice(0, 3);
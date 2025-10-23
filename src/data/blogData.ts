import partnerConservationImpact from "@/assets/blog/partner-conservation-impact.jpg";
import communityResilienceTourism from "@/assets/blog/community-resilience-tourism.webp";
import digitalConservationSolutions from "@/assets/blog/digital-conservation-solutions.png";
import sustainableLivelihoodsConservation from "@/assets/blog/sustainable-livelihoods-conservation.webp";
import humanWildlifeConflict from "@/assets/blog/human-wildlife-conflict.webp";
import partnerGrowImpact from "@/assets/blog/partner-grow-impact.jpg";
import travelForGood from "@/assets/blog/travel-for-good.webp";
import hostConservationExpand from "@/assets/blog/host-conservation-expand.jpg";
import travelGivesBack from "@/assets/blog/travel-gives-back.jpg";
import rhinoConservationSuccess from "@/assets/blog/rhino-conservation-success.jpg";
import marineConservationKenya from "@/assets/blog/marine-conservation-kenya.webp";
import transparentImpactReporting from "@/assets/blog/transparent-impact-reporting.png";

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
    title: "Sustainable livelihoods through conservation",
    excerpt: "Discover how communities are building prosperous futures through conservation-based enterprises while protecting Kenya's natural heritage.",
    content: `
      <p>Conservation-based livelihoods represent a win-win solution for both wildlife protection and community prosperity. Across Kenya, innovative programs are demonstrating how environmental stewardship can generate sustainable income for local communities.</p>
      
      <p>From beekeeping to eco-tourism guiding, from artisan crafts to sustainable agriculture, communities are discovering diverse income streams that depend on healthy ecosystems. This creates powerful incentives for wildlife protection and habitat conservation.</p>
      
      <h3>Livelihood Impact:</h3>
      <ul>
        <li>150+ conservation-based businesses established</li>
        <li>65% increase in average community income</li>
        <li>25 different conservation livelihood models implemented</li>
        <li>8,000+ community members directly benefiting</li>
      </ul>
      
      <p>The transformation we're witnessing proves that conservation can be the foundation of thriving local economies, creating lasting prosperity while protecting Kenya's natural treasures.</p>
    `,
    category: "Conservation and Community Engagement",
    author: "Grace Wanjiru",
    date: "2024-01-18",
    readTime: "6 min read",
    image: sustainableLivelihoodsConservation,
    slug: "sustainable-livelihoods-conservation",
    impact: {
      businesses: "150",
      income: "65%",
      beneficiaries: "8,000"
    }
  },
  {
    id: 5,
    title: "Human-wildlife conflict: innovative solutions for coexistence",
    excerpt: "Addressing the challenges of human-wildlife conflict through community-led initiatives and innovative mitigation strategies.",
    content: `
      <p>Human-wildlife conflict remains one of the most pressing challenges in conservation. As human populations expand and wildlife habitats shrink, finding solutions that work for both communities and wildlife has become critical.</p>
      
      <p>Through innovative approaches including community rangers, early warning systems, and protective infrastructure, we're developing models for peaceful coexistence. These solutions not only protect crops and livestock but also save wildlife lives.</p>
      
      <h3>Conflict Mitigation Results:</h3>
      <ul>
        <li>70% reduction in crop damage incidents</li>
        <li>85% decrease in retaliatory wildlife killings</li>
        <li>50 community ranger teams deployed</li>
        <li>120km of wildlife-friendly fencing installed</li>
      </ul>
      
      <p>Success in managing human-wildlife conflict is essential for the long-term survival of Kenya's wildlife. Our community-led approaches are proving that coexistence is not only possible but beneficial for all.</p>
    `,
    category: "Conservation and Community Engagement",
    author: "Peter Otieno",
    date: "2024-01-20",
    readTime: "7 min read",
    image: humanWildlifeConflict,
    slug: "human-wildlife-conflict-innovative-solutions",
    impact: {
      reduction: "70%",
      teams: "50",
      fencing: "120km"
    }
  },
  {
    id: 6,
    title: "Partner growth: expanding your conservation impact",
    excerpt: "Learn how conservation organizations are scaling their impact through strategic partnerships and innovative funding models.",
    content: `
      <p>Growing a conservation organization requires more than passion—it demands strategic thinking, sustainable funding, and strong partnerships. Through our platform, conservation partners are discovering new pathways to expand their reach and impact.</p>
      
      <p>From capacity building workshops to marketing support, from financial management training to impact measurement tools, we provide partners with comprehensive resources to scale their operations while maintaining their conservation mission.</p>
      
      <h3>Partner Growth Metrics:</h3>
      <ul>
        <li>45% average increase in partner revenue</li>
        <li>80+ training sessions delivered to partners</li>
        <li>16 partners expanded to new conservation areas</li>
        <li>$1.2M in growth funding distributed</li>
      </ul>
      
      <p>The conservation challenges we face require organizations that can grow sustainably while staying true to their mission. Our partner support programs are designed to enable exactly that kind of growth.</p>
    `,
    category: "Host Resources",
    author: "Catherine Muthoni",
    date: "2024-01-22",
    readTime: "5 min read",
    image: partnerGrowImpact,
    slug: "partner-growth-expand-conservation-impact",
    impact: {
      revenue: "45%",
      training: "80",
      funding: "$1.2M"
    }
  },
  {
    id: 7,
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
    id: 8,
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
    id: 9,
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
  },
  {
    id: 10,
    title: "Rhino conservation: A success story in the making",
    excerpt: "Kenya's rhino populations are making a remarkable comeback thanks to community-led conservation efforts and innovative protection strategies.",
    content: `
      <p>Once on the brink of extinction, Kenya's rhino populations are experiencing a remarkable recovery. Through intensive protection efforts, community engagement, and cutting-edge monitoring technology, we're witnessing one of conservation's greatest success stories.</p>
      
      <p>The collaboration between conservancies, rangers, local communities, and technology partners has created a robust protection network. This multi-faceted approach addresses poaching, habitat loss, and human-wildlife conflict simultaneously.</p>
      
      <h3>Rhino Conservation Achievements:</h3>
      <ul>
        <li>35% increase in rhino populations over 5 years</li>
        <li>95% reduction in poaching incidents</li>
        <li>24/7 armed ranger patrols across 8 conservancies</li>
        <li>150+ community members employed as rhino monitors</li>
      </ul>
      
      <p>The success of rhino conservation demonstrates what's possible when communities, technology, and dedicated conservation efforts come together. This model offers hope for other endangered species across Africa.</p>
    `,
    category: "Conservation and Community Engagement",
    author: "Dr. John Kamau",
    date: "2024-01-25",
    readTime: "6 min read",
    image: rhinoConservationSuccess,
    slug: "rhino-conservation-success-story",
    impact: {
      increase: "35%",
      reduction: "95%",
      monitors: "150"
    }
  },
  {
    id: 11,
    title: "Marine conservation on Kenya's coast",
    excerpt: "Protecting Kenya's marine ecosystems through community-based conservation, sustainable fishing practices, and coastal restoration projects.",
    content: `
      <p>Kenya's coastal waters are home to vibrant coral reefs, endangered sea turtles, and diverse marine life. Community-based marine conservation efforts are proving essential to protecting these underwater treasures while supporting coastal livelihoods.</p>
      
      <p>Through marine protected areas, sustainable fishing cooperatives, and coral restoration programs, coastal communities are becoming guardians of ocean health. This approach balances conservation with the needs of fishing communities who depend on marine resources.</p>
      
      <h3>Marine Conservation Impact:</h3>
      <ul>
        <li>12 community-managed marine protected areas established</li>
        <li>45% increase in fish populations within protected zones</li>
        <li>2,000+ coral fragments planted in restoration sites</li>
        <li>25 fishing cooperatives practicing sustainable methods</li>
      </ul>
      
      <p>The health of Kenya's marine ecosystems is vital not only for biodiversity but also for the coastal communities who depend on these resources. Community-led conservation is proving to be the most effective path forward.</p>
    `,
    category: "Conservation and Community Engagement",
    author: "Amina Hassan",
    date: "2024-01-28",
    readTime: "7 min read",
    image: marineConservationKenya,
    slug: "marine-conservation-kenya-coast",
    impact: {
      areas: "12",
      increase: "45%",
      corals: "2,000"
    }
  },
  {
    id: 12,
    title: "Transparent impact reporting: building trust through data",
    excerpt: "How we use technology and rigorous measurement to provide complete transparency in conservation funding and impact outcomes.",
    content: `
      <p>Trust is the foundation of effective conservation funding. At NatuAsili, we've built our platform on complete transparency, using real-time data and rigorous impact measurement to show exactly how every dollar contributes to conservation outcomes.</p>
      
      <p>Our impact reporting system tracks metrics from wildlife population data to community income changes, from habitat restoration to educational programs. This data-driven approach ensures accountability and enables continuous improvement in conservation effectiveness.</p>
      
      <h3>Transparency Metrics:</h3>
      <ul>
        <li>100% of conservation funding tracked in real-time</li>
        <li>Quarterly impact reports for all stakeholders</li>
        <li>50+ measurable impact indicators monitored</li>
        <li>Third-party verification of all major conservation claims</li>
      </ul>
      
      <p>Transparent impact reporting is not just about accountability—it's about demonstrating that conservation works, building trust with supporters, and creating models that can be replicated across the conservation sector.</p>
    `,
    category: "Host Resources",
    author: "David Ochieng",
    date: "2024-02-01",
    readTime: "5 min read",
    image: transparentImpactReporting,
    slug: "transparent-impact-reporting-conservation",
    impact: {
      tracking: "100%",
      indicators: "50",
      verification: "Third-party"
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

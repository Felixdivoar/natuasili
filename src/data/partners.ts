export type Destination = "nairobi" | "coastal-kenya" | "samburu" | "masai-mara" | "laikipia";
export type Theme = "wildlife" | "marine" | "community" | "culture";

export type Experience = {
  id: string;
  title: string;
  slug: string;
  partner: string;
  destination: Destination;
  themes: Theme[];
  activities: string[];
  images: string[];
  sourceUrl?: string;
  heroImage: string;
  gallery: string[];
  description: string;
  priceKESAdult: number;
  childHalfPriceRule?: boolean;
  visibleOnMarketplace: boolean;
  locationText?: string;
  partnerSlug?: string;
};

export type Partner = {
  id: string;
  name: string;
  slug: string;
  destination: Destination;
  themes: Theme[];
  description: string;
  image: string;
  logo: string;
  location: string;
  established: number;
  activities: string[];
  experienceCount: number;
  experiences: Experience[];
};

const P = (title: string) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const DUMMY = [
  "/images/placeholder-1.jpg",
  "/images/placeholder-2.jpg",
  "/images/placeholder-3.jpg",
  "/images/placeholder-4.jpg",
  "/images/placeholder-5.jpg",
];

const GALLERY_IMAGES = [
  "/images/placeholder-1.jpg",
  "/images/placeholder-2.jpg",
  "/images/placeholder-3.jpg",
  "/images/placeholder-4.jpg",
  "/images/placeholder-5.jpg",
];

export const EXPERIENCES: Experience[] = [
  {
    title: "Koija Cultural Village",
    id: "exp-koija-cultural-village",
    slug: P("Koija Cultural Village"),
    partner: "Koija Community",
    destination: "samburu",
    themes: ["culture", "community"],
    activities: ["village", "culture", "community"],
    images: DUMMY,
    heroImage: "/images/placeholder-1.jpg",
    gallery: GALLERY_IMAGES,
    description: "Immerse yourself in the rich cultural heritage of the Samburu people at Koija Cultural Village. Experience traditional dances, learn about ancient customs, and witness the daily life of this proud community. This authentic cultural exchange supports local livelihoods while preserving important traditions for future generations.",
    priceKESAdult: 2000,
    childHalfPriceRule: false,
    visibleOnMarketplace: true,
    locationText: "Samburu County, Kenya",
    partnerSlug: "koija-community",
    sourceUrl: "https://natuasili.com/st_tour/koija-cultural-village/",
  },
  {
    title: "Sera On-Foot Rhino Tracking",
    id: "exp-sera-rhino-tracking",
    slug: P("Sera On-Foot Rhino Tracking"),
    partner: "Sera Conservancy",
    destination: "samburu",
    themes: ["wildlife"],
    activities: ["rhino", "tracking", "walking"],
    images: DUMMY,
    heroImage: "/images/placeholder-2.jpg",
    gallery: GALLERY_IMAGES,
    description: "Experience the thrill of tracking endangered black rhinos on foot in the Sera Conservancy. This unique conservation experience offers intimate wildlife encounters while supporting critical anti-poaching efforts and community-based conservation initiatives in Samburu.",
    priceKESAdult: 4000,
    childHalfPriceRule: false,
    visibleOnMarketplace: true,
    locationText: "Sera Conservancy, Samburu",
    partnerSlug: "sera-conservancy",
    sourceUrl: "https://natuasili.com/st_tour/sera-on-foot-rhino-tracking/",
  },
  {
    title: "Giraffe at Ruko Sanctuary",
    id: "exp-ruko-giraffe",
    slug: P("Giraffe at Ruko Sanctuary"),
    partner: "Ruko Community Conservancy",
    destination: "samburu",
    themes: ["wildlife", "community"],
    activities: ["giraffe", "sanctuary"],
    images: DUMMY,
    heroImage: "/images/placeholder-3.jpg",
    gallery: GALLERY_IMAGES,
    description: "Get up close with endangered Rothschild's giraffes at Ruko Community Conservancy. Learn about giraffe conservation efforts, feeding behaviors, and the community's role in protecting these magnificent creatures in their natural habitat.",
    priceKESAdult: 2000,
    childHalfPriceRule: false,
    visibleOnMarketplace: true,
    locationText: "Ruko Conservancy, Samburu",
    partnerSlug: "ruko-community-conservancy",
    sourceUrl: "https://natuasili.com/st_tour/giraffe-at-ruko-sanctuary/",
  },
  {
    title: "Colobus Conservation Guided Eco Tours",
    id: "exp-colobus-eco-tours",
    slug: P("Colobus Conservation Guided Eco Tours"),
    partner: "Colobus Conservation",
    destination: "coastal-kenya",
    themes: ["wildlife", "community"],
    activities: ["primates", "eco-tour"],
    images: DUMMY,
    heroImage: "/images/placeholder-4.jpg",
    gallery: GALLERY_IMAGES,
    description: "Discover the fascinating world of Colobus monkeys and other primates along Kenya's coast. This guided eco-tour showcases conservation efforts to protect endangered primates while supporting local communities through sustainable tourism.",
    priceKESAdult: 1500,
    childHalfPriceRule: false,
    visibleOnMarketplace: true,
    locationText: "Coastal Kenya",
    partnerSlug: "colobus-conservation",
    sourceUrl: "https://natuasili.com/st_tour/colobus-conservation-guided-eco-tours/",
  },
  {
    title: "Ocean Conservation Day – Watamu",
    id: "exp-ocean-day-watamu",
    slug: P("Ocean Conservation Day Watamu"),
    partner: "Local Ocean (Watamu)",
    destination: "coastal-kenya",
    themes: ["marine", "community"],
    activities: ["ocean", "workshop"],
    images: DUMMY,
    heroImage: "/images/placeholder-5.jpg",
    gallery: GALLERY_IMAGES,
    description: "Join a hands-on ocean conservation workshop in Watamu. Learn about marine ecosystems, participate in beach cleanups, and discover how local communities are protecting coral reefs and marine life along Kenya's coast.",
    priceKESAdult: 1000,
    childHalfPriceRule: false,
    visibleOnMarketplace: true,
    locationText: "Watamu, Coastal Kenya",
    partnerSlug: "local-ocean-watamu",
    sourceUrl: "https://natuasili.com/st_tour/ocean-conservation-day-watamu/",
  },
  {
    title: "Tree Walk – Kenya Forest Heritage",
    id: "exp-tree-walk-heritage",
    slug: P("Tree Walk Kenya Forest Heritage"),
    partner: "Kenya Forest Heritage",
    destination: "nairobi",
    themes: ["community", "culture"],
    activities: ["forest", "walk", "trees"],
    images: DUMMY,
    heroImage: "/images/placeholder-1.jpg",
    gallery: GALLERY_IMAGES,
    description: "Explore Kenya's indigenous forest heritage through guided tree walks. Learn about native species, traditional uses of forest resources, and ongoing conservation efforts to preserve these vital ecosystems for future generations.",
    priceKESAdult: 500,
    childHalfPriceRule: false,
    visibleOnMarketplace: true,
    locationText: "Nairobi and surroundings",
    partnerSlug: "kenya-forest-heritage",
    sourceUrl: "https://natuasili.com/st_tour/tree-walk-kenya-forest-heritage/",
  },
  {
    title: "Dudu Walk – Insect Exploration",
    id: "exp-dudu-walk",
    slug: P("Dudu Walk Insect Exploration"),
    partner: "Nature Kenya",
    destination: "nairobi",
    themes: ["community", "culture"],
    activities: ["insects", "education"],
    images: DUMMY,
    heroImage: "/images/placeholder-2.jpg",
    gallery: GALLERY_IMAGES,
    description: "Discover the incredible world of insects and their crucial role in ecosystems. This educational walk explores Kenya's diverse insect life and teaches about their importance in conservation and sustainable living.",
    priceKESAdult: 500,
    childHalfPriceRule: false,
    visibleOnMarketplace: true,
    locationText: "Nairobi",
    partnerSlug: "nature-kenya",
    sourceUrl: "https://natuasili.com/st_tour/dudu-walk-insect-exploration/",
  },
  {
    title: "Nairobi Giraffe Centre (AFEW)",
    id: "exp-giraffe-centre",
    slug: P("Nairobi Giraffe Centre AFEW"),
    partner: "Giraffe Centre (AFEW)",
    destination: "nairobi",
    themes: ["wildlife", "community"],
    activities: ["giraffe", "education"],
    images: DUMMY,
    heroImage: "/images/placeholder-3.jpg",
    gallery: GALLERY_IMAGES,
    description: "Visit the famous Giraffe Centre and get up close with endangered Rothschild's giraffes. Learn about conservation efforts, feed the giraffes, and support AFEW's mission to protect Kenya's wildlife through education and conservation programs.",
    priceKESAdult: 1500,
    childHalfPriceRule: true,
    visibleOnMarketplace: true,
    locationText: "Nairobi",
    partnerSlug: "afew-giraffe-centre",
    sourceUrl: "https://natuasili.com/st_tour/nairobi-giraffe-centre-afew/",
  },
  {
    title: "Reteti Community Elephant Experience",
    id: "exp-reteti-elephant",
    slug: P("Reteti Community Elephant Experience"),
    partner: "Reteti Elephant Sanctuary",
    destination: "masai-mara",
    themes: ["wildlife", "community"],
    activities: ["elephant", "sanctuary"],
    images: DUMMY,
    heroImage: "/images/placeholder-4.jpg",
    gallery: GALLERY_IMAGES,
    description: "Experience the heartwarming work of Reteti Elephant Sanctuary, Kenya's first community-owned elephant sanctuary. Meet orphaned elephants, learn about their rescue and rehabilitation, and discover how local communities are leading conservation efforts.",
    priceKESAdult: 400,
    childHalfPriceRule: false,
    visibleOnMarketplace: true,
    locationText: "Northern Kenya",
    partnerSlug: "reteti-elephant-sanctuary",
    sourceUrl: "https://natuasili.com/st_tour/reteti-community-elephant-experience/",
  },
  {
    title: "Ol Pejeta – Bush Bird Walks",
    id: "exp-olp-bird-walks",
    slug: P("Ol Pejeta Bush Bird Walks"),
    partner: "Ol Pejeta Conservancy",
    destination: "laikipia",
    themes: ["wildlife"],
    activities: ["birds", "walk"],
    images: DUMMY,
    heroImage: "/images/placeholder-5.jpg",
    gallery: GALLERY_IMAGES,
    description: "Explore the diverse birdlife of Ol Pejeta Conservancy on guided bush walks. Spot endemic species, learn about bird behavior and habitats, and discover how conservation efforts protect avian biodiversity in this renowned wildlife sanctuary.",
    priceKESAdult: 9075,
    childHalfPriceRule: true,
    visibleOnMarketplace: true,
    locationText: "Ol Pejeta Conservancy, Laikipia",
    partnerSlug: "ol-pejeta-conservancy",
    sourceUrl: "https://natuasili.com/st_tour/ol-pejeta-bush-bird-walks/",
  },
  {
    title: "Night Game Drive – Ol Pejeta",
    id: "exp-olp-night-drive",
    slug: P("Night Game Drive Ol Pejeta"),
    partner: "Ol Pejeta Conservancy",
    destination: "laikipia",
    themes: ["wildlife"],
    activities: ["game drive", "night"],
    images: DUMMY,
    heroImage: "/images/placeholder-1.jpg",
    gallery: GALLERY_IMAGES,
    description: "Experience the thrill of a night game drive in Ol Pejeta Conservancy. Discover nocturnal wildlife behavior, spot elusive predators, and learn about the unique challenges and opportunities of nighttime conservation work.",
    priceKESAdult: 9075,
    childHalfPriceRule: true,
    visibleOnMarketplace: true,
    locationText: "Ol Pejeta Conservancy, Laikipia",
    partnerSlug: "ol-pejeta-conservancy",
    sourceUrl: "https://natuasili.com/st_tour/night-game-drive-ol-pejeta/",
  },
  {
    title: "Northern White Rhinos – Ol Pejeta",
    id: "exp-olp-white-rhinos",
    slug: P("Northern White Rhinos Ol Pejeta"),
    partner: "Ol Pejeta Conservancy",
    destination: "laikipia",
    themes: ["wildlife"],
    activities: ["rhino", "sanctuary"],
    images: DUMMY,
    heroImage: "/images/placeholder-2.jpg",
    gallery: GALLERY_IMAGES,
    description: "Visit the last two northern white rhinos on Earth at Ol Pejeta Conservancy. Learn about groundbreaking conservation science, assisted reproduction efforts, and the race to save this species from extinction through innovative technology.",
    priceKESAdult: 9075,
    childHalfPriceRule: true,
    visibleOnMarketplace: true,
    locationText: "Ol Pejeta Conservancy, Laikipia",
    partnerSlug: "ol-pejeta-conservancy",
    sourceUrl: "https://natuasili.com/st_tour/northern-white-rhinos-ol-pejeta/",
  },
  {
    title: "Sweetwaters Chimpanzee Conservation Tour",
    id: "exp-olp-chimps",
    slug: P("Sweetwaters Chimpanzee Conservation Tour"),
    partner: "Ol Pejeta Conservancy",
    destination: "laikipia",
    themes: ["wildlife"],
    activities: ["chimpanzee", "tour"],
    images: DUMMY,
    heroImage: "/images/placeholder-3.jpg",
    gallery: GALLERY_IMAGES,
    description: "Visit the only chimpanzee sanctuary in Kenya at Sweetwaters in Ol Pejeta Conservancy. Meet rescued chimpanzees, learn about their rehabilitation, and discover the important role of sanctuaries in primate conservation.",
    priceKESAdult: 9075,
    childHalfPriceRule: true,
    visibleOnMarketplace: true,
    locationText: "Sweetwaters, Ol Pejeta Conservancy",
    partnerSlug: "ol-pejeta-conservancy",
    sourceUrl: "https://natuasili.com/st_tour/sweetwaters-chimpanzee-conservation-tour/",
  },
  {
    title: "Ol Pejeta Lion Tracking Tour",
    id: "exp-olp-lion-tracking",
    slug: P("Ol Pejeta Lion Tracking Tour"),
    partner: "Ol Pejeta Conservancy",
    destination: "laikipia",
    themes: ["wildlife"],
    activities: ["lion", "tracking"],
    images: DUMMY,
    heroImage: "/images/placeholder-4.jpg",
    gallery: GALLERY_IMAGES,
    description: "Track lions with expert guides and researchers at Ol Pejeta Conservancy. Learn about lion behavior, conservation challenges, and the latest tracking technology used to protect these apex predators in their natural habitat.",
    priceKESAdult: 9075,
    childHalfPriceRule: true,
    visibleOnMarketplace: true,
    locationText: "Ol Pejeta Conservancy, Laikipia",
    partnerSlug: "ol-pejeta-conservancy",
    sourceUrl: "https://natuasili.com/st_tour/ol-pejeta-lion-tracking-tour/",
  },
  {
    title: "K9 Handler Day – Ol Pejeta",
    id: "exp-olp-k9",
    slug: P("K9 Handler Day Ol Pejeta"),
    partner: "Ol Pejeta Conservancy",
    destination: "laikipia",
    themes: ["wildlife", "community"],
    activities: ["k9", "ranger"],
    images: DUMMY,
    heroImage: "/images/placeholder-5.jpg",
    gallery: GALLERY_IMAGES,
    description: "Spend a day with K9 anti-poaching units at Ol Pejeta Conservancy. Learn about the crucial role of detection dogs in wildlife protection, meet the handlers, and discover how these teams work to combat poaching and wildlife crime.",
    priceKESAdult: 9075,
    childHalfPriceRule: true,
    visibleOnMarketplace: true,
    locationText: "Ol Pejeta Conservancy, Laikipia",
    partnerSlug: "ol-pejeta-conservancy",
    sourceUrl: "https://natuasili.com/st_tour/k9-handler-day-ol-pejeta/",
  },
  {
    title: "Dive into Coral Conservation (Reefolution)",
    id: "exp-reef-coral",
    slug: P("Dive into Coral Conservation Reefolution"),
    partner: "Reefolution",
    destination: "coastal-kenya",
    themes: ["marine"],
    activities: ["coral", "diving"],
    images: DUMMY,
    heroImage: "/images/placeholder-1.jpg",
    gallery: GALLERY_IMAGES,
    description: "Dive into marine conservation with Reefolution's coral restoration program. Participate in coral planting, learn about reef ecosystems, and contribute to groundbreaking efforts to restore Kenya's threatened coral reefs through innovative techniques.",
    priceKESAdult: 10000,
    childHalfPriceRule: false,
    visibleOnMarketplace: true,
    locationText: "Coastal Kenya",
    partnerSlug: "reefolution",
    sourceUrl: "https://natuasili.com/st_tour/dive-into-coral-conservation-with-reefolution/",
  },
  {
    title: "Drone Conservation – Mara Elephant",
    id: "exp-drone-mara",
    slug: P("Drone Conservation Mara Elephant"),
    partner: "Mara Elephant Project",
    destination: "masai-mara",
    themes: ["wildlife", "community"],
    activities: ["drone", "elephant"],
    images: DUMMY,
    heroImage: "/images/placeholder-2.jpg",
    gallery: GALLERY_IMAGES,
    description: "Experience cutting-edge conservation technology with the Mara Elephant Project's drone program. Learn how aerial surveillance protects elephants, prevents human-wildlife conflict, and supports community-based conservation efforts in the Maasai Mara ecosystem.",
    priceKESAdult: 10000,
    childHalfPriceRule: false,
    visibleOnMarketplace: true,
    locationText: "Maasai Mara, Kenya",
    partnerSlug: "mara-elephant-project",
    sourceUrl: "https://natuasili.com/st_tour/drone-conservation-mara-elephant/",
  },
  {
    title: "Elephant Researcher – Mara Elephant Project",
    id: "exp-researcher-mep",
    slug: P("Elephant Researcher with Mara Elephant Project"),
    partner: "Mara Elephant Project",
    destination: "masai-mara",
    themes: ["wildlife"],
    activities: ["research", "elephant"],
    images: DUMMY,
    heroImage: "/images/placeholder-3.jpg",
    gallery: GALLERY_IMAGES,
    description: "Join researchers from the Mara Elephant Project for a day of elephant research and monitoring. Participate in data collection, learn about elephant behavior and social structures, and contribute to long-term conservation science in the Maasai Mara.",
    priceKESAdult: 10000,
    childHalfPriceRule: false,
    visibleOnMarketplace: true,
    locationText: "Maasai Mara, Kenya",
    partnerSlug: "mara-elephant-project",
    sourceUrl: "https://natuasili.com/st_tour/elephant-researcher-with-mara-elephant-project/",
  },
  {
    title: "Sustainable Farm Experience – Karen",
    id: "exp-karen-farm",
    slug: P("Sustainable Farm Experience Karen"),
    partner: "Karen Community",
    destination: "nairobi",
    themes: ["community", "culture"],
    activities: ["farm", "sustainability"],
    images: DUMMY,
    heroImage: "/images/placeholder-4.jpg",
    gallery: GALLERY_IMAGES,
    description: "Explore sustainable farming practices in Karen, Nairobi. Learn about organic agriculture, permaculture techniques, and how local communities are implementing environmentally friendly farming methods to support food security and conservation.",
    priceKESAdult: 5000,
    childHalfPriceRule: false,
    visibleOnMarketplace: true,
    locationText: "Karen, Nairobi",
    partnerSlug: "karen-community",
    sourceUrl: "https://natuasili.com/st_tour/sustainable-farm-experience-karen/",
  },
  {
    title: "Morning Bird Walk – Nature Kenya",
    id: "exp-morning-bird-walk",
    slug: P("Morning Bird Walk Nature Kenya"),
    partner: "Nature Kenya",
    destination: "nairobi",
    themes: ["wildlife"],
    activities: ["birds", "walk"],
    images: DUMMY,
    heroImage: "/images/placeholder-5.jpg",
    gallery: GALLERY_IMAGES,
    description: "Start your day with Nature Kenya's morning bird walk. Discover the incredible diversity of birds in Nairobi's urban and peri-urban areas, learn identification techniques, and understand the importance of bird conservation in Kenya.",
    priceKESAdult: 300,
    childHalfPriceRule: false,
    visibleOnMarketplace: true,
    locationText: "Nairobi",
    partnerSlug: "nature-kenya",
    sourceUrl: "https://natuasili.com/st_tour/morning-bird-walk-nature-kenya/",
  },
  {
    title: "Citizen Scientist – Nairobi Park",
    id: "exp-citizen-scientist-np",
    slug: P("Citizen Scientist Nairobi Park"),
    partner: "Nairobi National Park",
    destination: "nairobi",
    themes: ["wildlife", "community"],
    activities: ["citizen science"],
    images: DUMMY,
    heroImage: "/images/placeholder-1.jpg",
    gallery: GALLERY_IMAGES,
    description: "Become a citizen scientist for a day in Nairobi National Park. Participate in wildlife monitoring, data collection, and research activities that contribute to park management and conservation efforts in Kenya's only urban national park.",
    priceKESAdult: 1500,
    childHalfPriceRule: false,
    visibleOnMarketplace: true,
    locationText: "Nairobi National Park",
    partnerSlug: "nairobi-national-park",
    sourceUrl: "https://natuasili.com/st_tour/citizen-scientist-nairobi-park/",
  },
  {
    title: "Karura Forest Specialized Eco Tours",
    id: "exp-karura-eco",
    slug: P("Karura Forest Specialized Eco Tours"),
    partner: "Friends of Karura",
    destination: "nairobi",
    themes: ["community", "culture"],
    activities: ["forest", "eco-tour"],
    images: DUMMY,
    heroImage: "/images/placeholder-2.jpg",
    gallery: GALLERY_IMAGES,
    description: "Explore Karura Forest on specialized eco-tours with Friends of Karura. Discover indigenous trees, learn about forest restoration efforts, and understand the vital role of urban forests in environmental conservation and community wellbeing.",
    priceKESAdult: 1000,
    childHalfPriceRule: false,
    visibleOnMarketplace: true,
    locationText: "Karura Forest, Nairobi",
    partnerSlug: "friends-of-karura",
    sourceUrl: "https://natuasili.com/st_tour/karura-forest-specialized-eco-tours/",
  },
  {
    title: "Opportunity Factory – Eco Innovation Tour",
    id: "exp-opportunity-factory",
    slug: P("Opportunity Factory Eco Innovation Tour"),
    partner: "Opportunity Factory",
    destination: "nairobi",
    themes: ["community", "culture"],
    activities: ["innovation", "workshop"],
    images: DUMMY,
    heroImage: "/images/placeholder-3.jpg",
    gallery: GALLERY_IMAGES,
    description: "Discover eco-innovation at the Opportunity Factory. Learn about sustainable technology solutions, participate in innovation workshops, and see how local entrepreneurs are developing environmentally friendly products and services.",
    priceKESAdult: 2000,
    childHalfPriceRule: false,
    visibleOnMarketplace: true,
    locationText: "Nairobi",
    partnerSlug: "opportunity-factory",
    sourceUrl: "https://natuasili.com/st_tour/opportunity-factory-eco-innovation/",
  },
];

// Generate partners lazily to avoid temporal dead zone
let _partners: Partner[] | null = null;

function generatePartners(): Partner[] {
  if (_partners !== null) {
    return _partners;
  }

  _partners = [
    ...new Set(EXPERIENCES.map(exp => exp.partner))
  ].map((partnerName, index) => {
    const partnerExps = EXPERIENCES.filter(exp => exp.partner === partnerName);
    const allThemes = [...new Set(partnerExps.flatMap(exp => exp.themes))];
    const allActivities = [...new Set(partnerExps.flatMap(exp => exp.activities))];
    
    return {
      id: (index + 1).toString(),
      name: partnerName,
      slug: partnerName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      destination: partnerExps[0].destination,
      themes: allThemes,
      description: `Conservation partner working on ${allThemes.join(', ')} initiatives in Kenya.`,
      image: DUMMY[0],
      logo: DUMMY[0],
      location: partnerExps[0].destination.replace(/-/g, ' '),
      established: 2010 + index,
      activities: allActivities,
      experienceCount: partnerExps.length,
      experiences: partnerExps
    };
  });

  return _partners;
}

// Export partners as a getter to avoid initialization issues
export const PARTNERS: Partner[] = new Proxy([], {
  get(target, prop, receiver) {
    const partners = generatePartners();
    return Reflect.get(partners, prop, receiver);
  },
  has(target, prop) {
    const partners = generatePartners();
    return Reflect.has(partners, prop);
  },
  ownKeys(target) {
    const partners = generatePartners();
    return Reflect.ownKeys(partners);
  },
  getOwnPropertyDescriptor(target, prop) {
    const partners = generatePartners();
    return Reflect.getOwnPropertyDescriptor(partners, prop);
  }
});
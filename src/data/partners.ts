import koijaCommunityImg from "@/assets/partner-koija-community.jpg";
import seraConservancyImg from "@/assets/partner-sera-conservancy.jpg";
import rukoConservancyImg from "@/assets/partner-ruko-conservancy.jpg";
import colobusConservationImg from "@/assets/partner-colobus-conservation.jpg";
import localOceanImg from "@/assets/partner-local-ocean.jpg";
import forestHeritageImg from "@/assets/partner-forest-heritage.jpg";
import natureKenyaImg from "@/assets/partner-nature-kenya.jpg";
import afewGiraffeImg from "@/assets/partner-afew-giraffe.jpg";
import retetiSanctuaryImg from "@/assets/partner-reteti-sanctuary.jpg";
import olPejetaImg from "@/assets/partner-ol-pejeta.jpg";
import reefolutionImg from "@/assets/partner-reefolution.jpg";
import maraElephantImg from "@/assets/partner-mara-elephant.jpg";

// Reteti specific images
import retetiMainImg from "/lovable-uploads/d42dcb33-a2f6-4418-8d2a-921127f8d45a.png";
import retetiFeedingImg from "/lovable-uploads/12a93a46-de0f-4be8-a867-015fd5d9daa3.png";
import retetiCareOutdoorImg from "/lovable-uploads/b5d1c970-74f7-4351-acce-42ab7f85a2f8.png";
import retetiCareFacilityImg from "/lovable-uploads/89f29078-42d9-498b-91e8-de9387a64250.png";
import retetiHerdImg from "/lovable-uploads/4792e461-d848-4287-965d-d24aace650e6.png";
import retetiBottleFeedingImg from "/lovable-uploads/742fd269-1c53-4671-b608-aa22d7e09e4e.png";

// Additional experience-specific images
import giraffeCentre from "@/assets/giraffe-centre.jpg";
import olPejeteRhino from "@/assets/ol-pejeta-rhino.jpg";
import colobusConservation from "@/assets/colobus-conservation.jpg";
import localOceanConservation from "@/assets/local-ocean-conservation.jpg";
import karuraForestPlanting from "@/assets/karura-forest-planting.jpg";
import natureKenyaBirdwatching from "@/assets/nature-kenya-birdwatching.jpg";
import maraElephantTracking from "@/assets/mara-elephant-tracking.jpg";
import bigFiveTracking from "@/assets/big-five-tracking.jpg";
import northernWhiteRhinos from "@/assets/northern-white-rhinos.jpg";
import chimpanzeeSanctuary from "@/assets/chimpanzee-sanctuary.jpg";
import lionTracking from "@/assets/lion-tracking.jpg";
import k9HandlerTraining from "@/assets/k9-handler-training.jpg";
import mangroveRestoration from "@/assets/mangrove-restoration.jpg";
import nightGameDrive from "@/assets/night-game-drive.jpg";
import beadworkWorkshop from "@/assets/beadwork-workshop.jpg";

export type Destination = "nairobi" | "coastal-kenya" | "samburu" | "masai-mara" | "laikipia";
export type Theme = "Wildlife conservation" | "Conservation education" | "Community & cultural exploration";

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

// Partner image mapping for unique, high-quality conservation images
const PARTNER_IMAGES: Record<string, string> = {
  "Koija Community": koijaCommunityImg,
  "Sera Conservancy": seraConservancyImg,
  "Ruko Community Conservancy": rukoConservancyImg,
  "Colobus Conservation": colobusConservationImg,
  "Local Ocean (Watamu)": localOceanImg,
  "Kenya Forest Heritage": forestHeritageImg,
  "Nature Kenya": natureKenyaImg,
  "Giraffe Centre (AFEW)": afewGiraffeImg,
  "Reteti Elephant Sanctuary": retetiSanctuaryImg,
  "Ol Pejeta Conservancy": olPejetaImg,
  "Reefolution": reefolutionImg,
  "Mara Elephant Project": maraElephantImg,
  // Fallback for any partners not explicitly mapped
};

const P = (title: string) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

// Function to get relevant images based on experience title and activities
const getExperienceImages = (title: string, activities: string[]): string[] => {
  const titleLower = title.toLowerCase();
  
  // Map experience titles/activities to appropriate images
  if (titleLower.includes("cultural village") || titleLower.includes("koija")) {
    return [beadworkWorkshop, koijaCommunityImg, "/images/placeholder-1.jpg"];
  }
  if (titleLower.includes("rhino") && titleLower.includes("tracking")) {
    return [olPejeteRhino, northernWhiteRhinos, seraConservancyImg];
  }
  if (titleLower.includes("giraffe") && titleLower.includes("ruko")) {
    return [giraffeCentre, afewGiraffeImg, rukoConservancyImg];
  }
  if (titleLower.includes("colobus") || activities.includes("primates")) {
    return [colobusConservation, colobusConservationImg, "/images/placeholder-2.jpg"];
  }
  if (titleLower.includes("ocean") || titleLower.includes("watamu")) {
    return [localOceanConservation, mangroveRestoration, localOceanImg];
  }
  if (titleLower.includes("tree walk") || titleLower.includes("forest")) {
    return [karuraForestPlanting, forestHeritageImg, "/images/placeholder-3.jpg"];
  }
  if (titleLower.includes("dudu") || titleLower.includes("insect") || activities.includes("education")) {
    return [natureKenyaBirdwatching, natureKenyaImg, "/images/placeholder-4.jpg"];
  }
  if (titleLower.includes("giraffe centre") || titleLower.includes("afew")) {
    return [giraffeCentre, afewGiraffeImg, "/images/placeholder-1.jpg"];
  }
  if (titleLower.includes("elephant") && titleLower.includes("reteti")) {
    return [maraElephantTracking, retetiSanctuaryImg, "/images/placeholder-2.jpg"];
  }
  if (titleLower.includes("night game drive")) {
    return [nightGameDrive, bigFiveTracking, olPejetaImg];
  }
  if (titleLower.includes("northern white rhinos")) {
    return [northernWhiteRhinos, olPejeteRhino, olPejetaImg];
  }
  if (titleLower.includes("chimpanzee")) {
    return [chimpanzeeSanctuary, olPejetaImg, "/images/placeholder-3.jpg"];
  }
  if (titleLower.includes("lion tracking")) {
    return [lionTracking, bigFiveTracking, olPejetaImg];
  }
  if (titleLower.includes("k9") || titleLower.includes("handler")) {
    return [k9HandlerTraining, olPejetaImg, "/images/placeholder-4.jpg"];
  }
  if (titleLower.includes("coral") || titleLower.includes("reef")) {
    return [localOceanConservation, reefolutionImg, "/images/placeholder-1.jpg"];
  }
  if (titleLower.includes("drone") || titleLower.includes("mara elephant")) {
    return [maraElephantTracking, maraElephantImg, "/images/placeholder-2.jpg"];
  }
  
  // Default fallback based on theme/activities
  if (activities.includes("wildlife") || activities.includes("tracking")) {
    return [bigFiveTracking, "/images/placeholder-3.jpg", "/images/placeholder-4.jpg"];
  }
  if (activities.includes("community") || activities.includes("culture")) {
    return [beadworkWorkshop, "/images/placeholder-1.jpg", "/images/placeholder-2.jpg"];
  }
  if (activities.includes("ocean") || activities.includes("marine")) {
    return [localOceanConservation, "/images/placeholder-3.jpg", "/images/placeholder-4.jpg"];
  }
  
  // Final fallback
  return ["/images/placeholder-1.jpg", "/images/placeholder-2.jpg", "/images/placeholder-3.jpg"];
};

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
    themes: ["Community & cultural exploration"],
    activities: ["village", "culture", "community"],
    images: getExperienceImages("Koija Cultural Village", ["village", "culture", "community"]),
    heroImage: beadworkWorkshop,
    gallery: [beadworkWorkshop, koijaCommunityImg, "/images/placeholder-1.jpg"],
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
    themes: ["Wildlife conservation"],
    activities: ["rhino", "tracking", "walking"],
    images: getExperienceImages("Sera On-Foot Rhino Tracking", ["rhino", "tracking", "walking"]),
    heroImage: olPejeteRhino,
    gallery: [olPejeteRhino, northernWhiteRhinos, seraConservancyImg],
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
    themes: ["Wildlife conservation"],
    activities: ["giraffe", "sanctuary"],
    images: getExperienceImages("Giraffe at Ruko Sanctuary", ["giraffe", "sanctuary"]),
    heroImage: giraffeCentre,
    gallery: [giraffeCentre, afewGiraffeImg, rukoConservancyImg],
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
    themes: ["Wildlife conservation"],
    activities: ["primates", "eco-tour"],
    images: getExperienceImages("Colobus Conservation Guided Eco Tours", ["primates", "eco-tour"]),
    heroImage: colobusConservation,
    gallery: [colobusConservation, colobusConservationImg, "/images/placeholder-2.jpg"],
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
    themes: ["Conservation education"],
    activities: ["ocean", "workshop"],
    images: getExperienceImages("Ocean Conservation Day – Watamu", ["ocean", "workshop"]),
    heroImage: localOceanConservation,
    gallery: [localOceanConservation, mangroveRestoration, localOceanImg],
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
    themes: ["Conservation education"],
    activities: ["forest", "walk", "trees"],
    images: getExperienceImages("Tree Walk – Kenya Forest Heritage", ["forest", "walk", "trees"]),
    heroImage: karuraForestPlanting,
    gallery: [karuraForestPlanting, forestHeritageImg, "/images/placeholder-3.jpg"],
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
    themes: ["Conservation education"],
    activities: ["insects", "education"],
    images: getExperienceImages("Dudu Walk – Insect Exploration", ["insects", "education"]),
    heroImage: natureKenyaBirdwatching,
    gallery: [natureKenyaBirdwatching, natureKenyaImg, "/images/placeholder-4.jpg"],
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
    themes: ["Wildlife conservation"],
    activities: ["giraffe", "education"],
    images: getExperienceImages("Nairobi Giraffe Centre (AFEW)", ["giraffe", "education"]),
    heroImage: giraffeCentre,
    gallery: [giraffeCentre, afewGiraffeImg, "/images/placeholder-1.jpg"],
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
    destination: "samburu",
    themes: ["Wildlife conservation"],
    activities: ["elephant", "sanctuary"],
    images: [retetiMainImg, retetiFeedingImg, retetiCareOutdoorImg, retetiCareFacilityImg, retetiHerdImg, retetiBottleFeedingImg],
    heroImage: retetiMainImg,
    gallery: [retetiMainImg, retetiFeedingImg, retetiCareOutdoorImg, retetiCareFacilityImg, retetiHerdImg, retetiBottleFeedingImg],
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
    themes: ["Wildlife conservation"],
    activities: ["birds", "walk"],
    images: getExperienceImages("Ol Pejeta – Bush Bird Walks", ["birds", "walk"]),
    heroImage: natureKenyaBirdwatching,
    gallery: [natureKenyaBirdwatching, olPejetaImg, "/images/placeholder-5.jpg"],
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
    themes: ["Wildlife conservation"],
    activities: ["game drive", "night"],
    images: getExperienceImages("Night Game Drive – Ol Pejeta", ["game drive", "night"]),
    heroImage: nightGameDrive,
    gallery: [nightGameDrive, bigFiveTracking, olPejetaImg],
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
    themes: ["Wildlife conservation"],
    activities: ["rhino", "sanctuary"],
    images: getExperienceImages("Northern White Rhinos – Ol Pejeta", ["rhino", "sanctuary"]),
    heroImage: northernWhiteRhinos,
    gallery: [northernWhiteRhinos, olPejeteRhino, olPejetaImg],
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
    themes: ["Wildlife conservation"],
    activities: ["chimpanzee", "tour"],
    images: getExperienceImages("Sweetwaters Chimpanzee Conservation Tour", ["chimpanzee", "tour"]),
    heroImage: chimpanzeeSanctuary,
    gallery: [chimpanzeeSanctuary, olPejetaImg, "/images/placeholder-3.jpg"],
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
    themes: ["Wildlife conservation"],
    activities: ["lion", "tracking"],
    images: getExperienceImages("Ol Pejeta Lion Tracking Tour", ["lion", "tracking"]),
    heroImage: lionTracking,
    gallery: [lionTracking, bigFiveTracking, olPejetaImg],
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
    themes: ["Wildlife conservation"],
    activities: ["k9", "ranger"],
    images: getExperienceImages("K9 Handler Day – Ol Pejeta", ["k9", "ranger"]),
    heroImage: k9HandlerTraining,
    gallery: [k9HandlerTraining, olPejetaImg, "/images/placeholder-4.jpg"],
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
    themes: ["Conservation education"],
    activities: ["coral", "diving"],
    images: getExperienceImages("Dive into Coral Conservation (Reefolution)", ["coral", "diving"]),
    heroImage: localOceanConservation,
    gallery: [localOceanConservation, reefolutionImg, "/images/placeholder-1.jpg"],
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
    themes: ["Wildlife conservation"],
    activities: ["drone", "elephant"],
    images: getExperienceImages("Drone Conservation – Mara Elephant", ["drone", "elephant"]),
    heroImage: maraElephantTracking,
    gallery: [maraElephantTracking, maraElephantImg, "/images/placeholder-2.jpg"],
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
    themes: ["Wildlife conservation"],
    activities: ["research", "elephant"],
    images: getExperienceImages("Elephant Researcher – Mara Elephant Project", ["research", "elephant"]),
    heroImage: maraElephantTracking,
    gallery: [maraElephantTracking, maraElephantImg, "/images/placeholder-3.jpg"],
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
    themes: ["Community & cultural exploration"],
    activities: ["farm", "sustainability"],
    images: getExperienceImages("Sustainable Farm Experience – Karen", ["farm", "sustainability"]),
    heroImage: beadworkWorkshop,
    gallery: [beadworkWorkshop, "/images/placeholder-1.jpg", "/images/placeholder-4.jpg"],
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
    themes: ["Wildlife conservation"],
    activities: ["birds", "walk"],
    images: getExperienceImages("Morning Bird Walk – Nature Kenya", ["birds", "walk"]),
    heroImage: natureKenyaBirdwatching,
    gallery: [natureKenyaBirdwatching, natureKenyaImg, "/images/placeholder-5.jpg"],
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
    themes: ["Conservation education"],
    activities: ["citizen science"],
    images: getExperienceImages("Citizen Scientist – Nairobi Park", ["citizen science"]),
    heroImage: natureKenyaBirdwatching,
    gallery: [natureKenyaBirdwatching, "/images/placeholder-1.jpg", "/images/placeholder-2.jpg"],
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
    themes: ["Conservation education"],
    activities: ["forest", "eco-tour"],
    images: getExperienceImages("Karura Forest Specialized Eco Tours", ["forest", "eco-tour"]),
    heroImage: karuraForestPlanting,
    gallery: [karuraForestPlanting, "/images/placeholder-2.jpg", "/images/placeholder-3.jpg"],
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
    themes: ["Community & cultural exploration"],
    activities: ["innovation", "workshop"],
    images: getExperienceImages("Opportunity Factory – Eco Innovation Tour", ["innovation", "workshop"]),
    heroImage: beadworkWorkshop,
    gallery: [beadworkWorkshop, "/images/placeholder-3.jpg", "/images/placeholder-1.jpg"],
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
    
    // Get unique partner image or fallback to themed placeholder
    const partnerImage = PARTNER_IMAGES[partnerName] || getExperienceImages(partnerName, allActivities)[0];
    
    return {
      id: (index + 1).toString(),
      name: partnerName,
      slug: partnerName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      destination: partnerExps[0].destination,
      themes: allThemes,
      description: `Conservation partner working on ${allThemes.join(', ')} initiatives in Kenya.`,
      image: partnerImage,
      logo: partnerImage, // Use same high-quality image for logo display
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
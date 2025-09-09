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
  googleMapsUrl?: string;
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
  "Koija Community": "/lovable-uploads/08763604-1a22-4da5-a8a1-4daf65cb4b32.png",
  "Sera Conservancy": "/lovable-uploads/73526904-0f02-4d36-9590-456e0dd5628a.png",
  "Ruko Community Conservancy": "/lovable-uploads/21799448-fabe-49a5-b8b2-3fd811cc804c.png",
  "Colobus Conservation": colobusConservationImg,
  "Local Ocean (Watamu)": localOceanImg,
  "Kenya Forest Heritage": "/lovable-uploads/f0dcab56-c695-41ac-bf57-3a9e350158f0.png",
  "Nature Kenya": natureKenyaImg,
  "Giraffe Centre (AFEW)": afewGiraffeImg,
  "Reteti Elephant Sanctuary": retetiSanctuaryImg,
  "Ol Pejeta Conservancy": olPejetaImg,
  "Reefolution": "/lovable-uploads/d4888a5b-c6ad-4983-8c53-e2364f663bd4.png",
  "Mara Elephant Project": "/lovable-uploads/a9fc8078-1eb7-433f-8ea8-cc504ca5b048.png",
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
    return ["/lovable-uploads/08763604-1a22-4da5-a8a1-4daf65cb4b32.png", "/lovable-uploads/3a4d487a-fe3a-40ce-aa28-18adf4191e69.png", "/lovable-uploads/396bdd72-dc8d-4727-8fd8-e73dba015ec2.png"];
  }
  if (titleLower.includes("rhino") && titleLower.includes("tracking")) {
    return ["/lovable-uploads/73526904-0f02-4d36-9590-456e0dd5628a.png", "/lovable-uploads/dc2fa3f6-3095-4f03-9f50-d78d7cceba81.png", "/lovable-uploads/ffc54bd4-ba6d-45be-8795-340f600c6ba3.png"];
  }
  if (titleLower.includes("giraffe") && titleLower.includes("ruko")) {
    return ["/lovable-uploads/21799448-fabe-49a5-b8b2-3fd811cc804c.png", "/lovable-uploads/235266ed-14bb-4381-9304-a9f8e2934776.png", "/lovable-uploads/34b44d9c-3c11-44ee-9f21-bbf1e8c51a5c.png", "/lovable-uploads/d41fd5bc-a9e9-44de-a975-dc5ae1f2eb29.png"];
  }
  if (titleLower.includes("colobus") || activities.includes("primates")) {
    return [colobusConservation, colobusConservationImg, "/images/placeholder-2.jpg"];
  }
  if (titleLower.includes("ocean") || titleLower.includes("watamu")) {
    return [localOceanConservation, mangroveRestoration, localOceanImg];
  }
  if (titleLower.includes("tree walk") || titleLower.includes("forest")) {
    return ["/lovable-uploads/f0dcab56-c695-41ac-bf57-3a9e350158f0.png", "/lovable-uploads/7ecd7176-f5b7-48b1-ae30-b697e0501c03.png", "/lovable-uploads/caa3fd6e-7c09-4774-91b1-9f5c0d61c57f.png", "/lovable-uploads/5dff9e8b-0607-44a7-88c3-525c96ba6fd4.png", "/lovable-uploads/4125d657-63a3-40bd-9a41-21d7bd0c3129.png"];
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
    return ["/lovable-uploads/d4888a5b-c6ad-4983-8c53-e2364f663bd4.png", "/lovable-uploads/8236db6a-4c2e-4c06-864a-bfcdd270ad52.png", "/lovable-uploads/f39fee39-a385-4e10-a818-084c4d1811fd.png", "/lovable-uploads/3247620c-45d9-4bf0-ad1c-677d2a49f122.png", "/lovable-uploads/55949b1a-fc87-4134-896a-da6c9c730a99.png"];
  }
  if (titleLower.includes("drone") || titleLower.includes("mara elephant")) {
    return ["/lovable-uploads/a9fc8078-1eb7-433f-8ea8-cc504ca5b048.png", "/lovable-uploads/bd06defe-f511-409f-88b1-decacb2392df.png", "/lovable-uploads/388b370f-647e-471b-92c2-addc918cb81b.png", "/lovable-uploads/2e0b1e5d-9156-4ef6-9b42-0927ce47af9a.png"];
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
    images: ["/lovable-uploads/08763604-1a22-4da5-a8a1-4daf65cb4b32.png", "/lovable-uploads/3a4d487a-fe3a-40ce-aa28-18adf4191e69.png", "/lovable-uploads/396bdd72-dc8d-4727-8fd8-e73dba015ec2.png", "/lovable-uploads/cc847573-d3b5-4aa6-8d5c-26b81ce2b693.png", "/lovable-uploads/a4b8d107-90cf-4f50-9401-95350c393f65.png", "/lovable-uploads/c6c43dc7-52c0-4f45-baf7-4093fc59cf98.png"],
    heroImage: "/lovable-uploads/08763604-1a22-4da5-a8a1-4daf65cb4b32.png",
    gallery: ["/lovable-uploads/08763604-1a22-4da5-a8a1-4daf65cb4b32.png", "/lovable-uploads/3a4d487a-fe3a-40ce-aa28-18adf4191e69.png", "/lovable-uploads/396bdd72-dc8d-4727-8fd8-e73dba015ec2.png", "/lovable-uploads/cc847573-d3b5-4aa6-8d5c-26b81ce2b693.png", "/lovable-uploads/a4b8d107-90cf-4f50-9401-95350c393f65.png", "/lovable-uploads/c6c43dc7-52c0-4f45-baf7-4093fc59cf98.png"],
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
    images: ["/lovable-uploads/73526904-0f02-4d36-9590-456e0dd5628a.png", "/lovable-uploads/dc2fa3f6-3095-4f03-9f50-d78d7cceba81.png", "/lovable-uploads/ffc54bd4-ba6d-45be-8795-340f600c6ba3.png"],
    heroImage: "/lovable-uploads/73526904-0f02-4d36-9590-456e0dd5628a.png",
    gallery: ["/lovable-uploads/73526904-0f02-4d36-9590-456e0dd5628a.png", "/lovable-uploads/dc2fa3f6-3095-4f03-9f50-d78d7cceba81.png", "/lovable-uploads/ffc54bd4-ba6d-45be-8795-340f600c6ba3.png"],
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
    images: ["/lovable-uploads/21799448-fabe-49a5-b8b2-3fd811cc804c.png", "/lovable-uploads/235266ed-14bb-4381-9304-a9f8e2934776.png", "/lovable-uploads/34b44d9c-3c11-44ee-9f21-bbf1e8c51a5c.png", "/lovable-uploads/d41fd5bc-a9e9-44de-a975-dc5ae1f2eb29.png"],
    heroImage: "/lovable-uploads/21799448-fabe-49a5-b8b2-3fd811cc804c.png",
    gallery: ["/lovable-uploads/21799448-fabe-49a5-b8b2-3fd811cc804c.png", "/lovable-uploads/235266ed-14bb-4381-9304-a9f8e2934776.png", "/lovable-uploads/34b44d9c-3c11-44ee-9f21-bbf1e8c51a5c.png", "/lovable-uploads/d41fd5bc-a9e9-44de-a975-dc5ae1f2eb29.png"],
    description: "Get up close with endangered Rothschild's giraffes at Ruko Community Conservancy. Learn about giraffe conservation efforts, feeding behaviors, and the community's role in protecting these magnificent creatures in their natural habitat.",
    priceKESAdult: 2000,
    childHalfPriceRule: false,
    visibleOnMarketplace: true,
    locationText: "Ruko Conservancy, Samburu",
    partnerSlug: "ruko-community-conservancy",
    sourceUrl: "https://natuasili.com/st_tour/giraffe-at-ruko-sanctuary/",
  },
  {
    title: "Colobus monkey eco-tour in Diani, Kenya",
    id: "exp-colobus-eco-tours",
    slug: P("Colobus Conservation Guided Eco Tours"),
    partner: "Colobus Conservation",
    destination: "coastal-kenya",
    themes: ["Wildlife conservation"],
    activities: ["primates", "eco-tour"],
    images: ["/lovable-uploads/1cbd1d3d-c30b-45be-a09e-8c9cc6f1f87b.png", "/lovable-uploads/1cbd3f9c-ed73-43d0-97e2-61830c34802f.png", "/lovable-uploads/a3c50985-66b9-4e12-a7dd-bb047e06a3e7.png", "/lovable-uploads/cb06fcce-173f-46a9-a2bc-f4a80c8711d0.png", "/lovable-uploads/0a4207e5-714a-4879-bbac-a99a5d456692.png", "/lovable-uploads/518cb7cf-9bba-4b26-bd79-971ce97b7291.png", "/lovable-uploads/14b36cde-b5f2-4f18-a1de-85d5fa95baa7.png"],
    heroImage: "/lovable-uploads/1cbd1d3d-c30b-45be-a09e-8c9cc6f1f87b.png",
    gallery: ["/lovable-uploads/1cbd1d3d-c30b-45be-a09e-8c9cc6f1f87b.png", "/lovable-uploads/1cbd3f9c-ed73-43d0-97e2-61830c34802f.png", "/lovable-uploads/a3c50985-66b9-4e12-a7dd-bb047e06a3e7.png", "/lovable-uploads/cb06fcce-173f-46a9-a2bc-f4a80c8711d0.png", "/lovable-uploads/0a4207e5-714a-4879-bbac-a99a5d456692.png", "/lovable-uploads/518cb7cf-9bba-4b26-bd79-971ce97b7291.png", "/lovable-uploads/14b36cde-b5f2-4f18-a1de-85d5fa95baa7.png"],
    description: "Overview\nFounded in Diani, Kenya, Colobus Conservation is a non-profit committed to the protection of primates, especially the threatened Angolan black and white colobus monkeys. Through habitat protection, educational campaigns, rescue, and rehabilitation projects, it seeks to safeguard primates.\nThe only primate eco-tour in the nation, it presents a special chance to see a colonized troop of colobus monkeys in their natural environment.\n\nHighlights\n• Guided nature walk through a scenic trail\n• Depending on sightings, encounter variety of colobus monkeys, vervet monkeys, Sykes's monkeys, and baboons among other primates.\n• Discover the critical contribution Colobus Conservation makes to primate research and protection.\n\nIncluded/Excluded\n• A friendly professional guide\n• Personal expenses\n• Insurance\n• Drinks and meals\n• Additional Services not mentioned\n\nWhat to expect\nEncountering colobus monkeys and other primates\no Arrive at Colobus Conservation and meet your guide and embark on a guided walk along the trail.\no Observe a habituated troop of colobus monkeys and other primates.\no Attend a talk at the information center to learn about Colobus Conservation's activities.\n\nCancellation policy\no You can cancel up to 24 hours before the experience starts for a full refund.\n\nDurations\n0 - 2 hours\n\nLanguages\nEnglish\n\nFrequently asked questions\nWhat primates can I expect to see?\nYou are most likely to see colobus monkeys, but vervet monkeys, Sykes' monkeys, and baboons are also frequent visitors to the area.\n\nWhat are the opening hours?\nGuided eco-tours are offered Monday to Saturday from 8:30 AM to 4:00 PM. The center is closed for eco-tours on Sundays.\n\nIs this a good tour for children?\nYes, this tour is perfect for families with children who are interested in learning about monkeys.\n\nWhere you'll be\nMH47+6WQ",
    priceKESAdult: 1500,
    childHalfPriceRule: false,
    visibleOnMarketplace: true,
    locationText: "Coastal Kenya",
    partnerSlug: "colobus-conservation",
    sourceUrl: "https://natuasili.com/st_tour/colobus-conservation-guided-eco-tours/",
  },
  {
    title: "Ocean Wonders: Learn & conserve with Local Ocean Conservation Kenya",
    id: "exp-ocean-day-watamu",
    slug: P("Ocean Conservation Day Watamu"),
    partner: "Local Ocean (Watamu)",
    destination: "coastal-kenya",
    themes: ["Conservation education"],
    activities: ["ocean", "workshop"],
    images: ["/lovable-uploads/a6c0b2b9-fd77-4472-a600-d2f163add078.png", "/lovable-uploads/145c30f9-65a9-4b28-87ad-97dac17376b7.png", "/lovable-uploads/33d3848b-2807-4161-b7b0-b1748f7e09b7.png", "/lovable-uploads/f93e78f2-5726-41ad-9f61-9a2f4ee5b1c4.png", "/lovable-uploads/c4575d2e-e1f6-4292-990c-760879abf32a.png", "/lovable-uploads/40debeaf-566e-4f53-9fd0-6b1103b26c65.png"],
    heroImage: "/lovable-uploads/a6c0b2b9-fd77-4472-a600-d2f163add078.png",
    gallery: ["/lovable-uploads/a6c0b2b9-fd77-4472-a600-d2f163add078.png", "/lovable-uploads/145c30f9-65a9-4b28-87ad-97dac17376b7.png", "/lovable-uploads/33d3848b-2807-4161-b7b0-b1748f7e09b7.png", "/lovable-uploads/f93e78f2-5726-41ad-9f61-9a2f4ee5b1c4.png", "/lovable-uploads/c4575d2e-e1f6-4292-990c-760879abf32a.png", "/lovable-uploads/40debeaf-566e-4f53-9fd0-6b1103b26c65.png"],
    description: "Overview\nWith an eye toward sea turtles, Local Ocean Conservation is a non-profit committed to safeguarding Kenya's marine habitat. They provide an interesting day trip meant to educate visitors about the ocean and motivate behavior in favor of conservation. Families, outdoor enthusiasts, and everyone else interested in the marine environment will find ideal use for this informative day trip.\n\nHighlights\n• Learn about the various sea turtle species, their life cycle, and the threats that they encounter.\n• See LOC's work toward sea turtle protection and rehabilitation.\n• Learn the value of the marine ecosystem and the need of its preservation.\n\nIncluded/Excluded\n• A friendly professional guide\n• Personal expenses\n• Insurance\n• Drinks and meals\n• Additional Services not mentioned\n\nWhat to expect\nLOC: Protecting the Ocean Through Action\no Arrive at the Local Ocean Conservation center.\no Join a guided tour about sea turtles, their life cycle, and the challenges they face.\no Learn about the marine ecosystem and the importance of its conservation.\no Consider making a donation to further support LOC's vital work (optional).\n\nCancellation policy\no You can cancel up to 48 hours before the experience starts for a full refund.\n\nDurations\n0 - 2 hours\n\nLanguages\nEnglish\n\nFrequently asked questions\nWhat can I expect on the tour?\nThe tour includes guided talks about sea turtles and the marine ecosystem, showcasing LOC's conservation efforts.\n\nIs this tour suitable for children?\nYes, this educational day trip is perfect for families!\n\nWhat can I do to contribute further?\nConsider making a donation or spreading awareness about ocean conservation after your visit.\n\nImportant information\no The goal is to get healthy sea turtles back into the ocean as soon as possible, so you might not always see them here during your visit.\no Tours are offered hourly for your convenience. The specific details may vary slightly depending on the tour guide and available resources.\no Please note that LOC is closed on Saturday afternoon, Sundays and all Public Holidays.\n\nWhere you'll be\nJXFP+M4 Watamu",
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
    images: ["/lovable-uploads/f0dcab56-c695-41ac-bf57-3a9e350158f0.png", "/lovable-uploads/7ecd7176-f5b7-48b1-ae30-b697e0501c03.png", "/lovable-uploads/caa3fd6e-7c09-4774-91b1-9f5c0d61c57f.png", "/lovable-uploads/5dff9e8b-0607-44a7-88c3-525c96ba6fd4.png", "/lovable-uploads/4125d657-63a3-40bd-9a41-21d7bd0c3129.png"],
    heroImage: "/lovable-uploads/f0dcab56-c695-41ac-bf57-3a9e350158f0.png",
    gallery: ["/lovable-uploads/f0dcab56-c695-41ac-bf57-3a9e350158f0.png", "/lovable-uploads/7ecd7176-f5b7-48b1-ae30-b697e0501c03.png", "/lovable-uploads/caa3fd6e-7c09-4774-91b1-9f5c0d61c57f.png", "/lovable-uploads/5dff9e8b-0607-44a7-88c3-525c96ba6fd4.png", "/lovable-uploads/4125d657-63a3-40bd-9a41-21d7bd0c3129.png"],
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
    images: ["/lovable-uploads/755bb09b-50ae-4b81-8ee4-ed16c5874e40.png", "/lovable-uploads/b8fd9d98-7dde-4ace-93a4-7f45b5858549.png", "/lovable-uploads/466be868-0698-4cd5-a6b8-0cee85fb22cf.png", "/lovable-uploads/536eb7bc-8b3e-4790-8bcc-86223f5a585f.png"],
    heroImage: "/lovable-uploads/755bb09b-50ae-4b81-8ee4-ed16c5874e40.png",
    gallery: ["/lovable-uploads/755bb09b-50ae-4b81-8ee4-ed16c5874e40.png", "/lovable-uploads/b8fd9d98-7dde-4ace-93a4-7f45b5858549.png", "/lovable-uploads/466be868-0698-4cd5-a6b8-0cee85fb22cf.png", "/lovable-uploads/536eb7bc-8b3e-4790-8bcc-86223f5a585f.png"],
    description: "Discover the incredible world of insects and their crucial role in ecosystems. This educational walk explores Kenya's diverse insect life and teaches about their importance in conservation and sustainable living.",
    priceKESAdult: 500,
    childHalfPriceRule: false,
    visibleOnMarketplace: true,
    locationText: "Nairobi",
    partnerSlug: "nature-kenya",
    sourceUrl: "https://natuasili.com/st_tour/dudu-walk-insect-exploration/",
  },
  {
    title: "Meet Rothschild Giraffes at Giraffe Nairobi Centre with AFEW",
    id: "exp-giraffe-centre",
    slug: P("Meet Rothschild Giraffes at Giraffe Nairobi Centre with AFEW"),
    partner: "Giraffe Centre (AFEW)",
    destination: "nairobi",
    themes: ["Wildlife conservation"],
    activities: ["giraffe", "education"],
    googleMapsUrl: "https://share.google/bpCzrKmIhe9lWEXoR",
    images: ["/lovable-uploads/68c0cf79-0a97-4ec1-82b4-1f5f443b3d20.png", "/lovable-uploads/2998745d-d343-4471-b0b6-6a66d49fce09.png", "/lovable-uploads/b9271c14-14e1-4d4e-956a-65b84bc47384.png", "/lovable-uploads/dc7c3a6d-f388-459c-bebf-84538882e02a.png", "/lovable-uploads/f8177d2e-f86e-4cac-b403-4c5257ea45f7.png", "/lovable-uploads/f70c6376-9514-4edb-aebd-e2a4fea9aa97.png", "/lovable-uploads/ff1b4417-ca70-4004-bf82-d19fcb1c5cec.png", "/lovable-uploads/d198406f-4a55-437a-a6bf-b5181cd64707.png"],
    heroImage: "/lovable-uploads/68c0cf79-0a97-4ec1-82b4-1f5f443b3d20.png",
    gallery: ["/lovable-uploads/68c0cf79-0a97-4ec1-82b4-1f5f443b3d20.png", "/lovable-uploads/2998745d-d343-4471-b0b6-6a66d49fce09.png", "/lovable-uploads/b9271c14-14e1-4d4e-956a-65b84bc47384.png", "/lovable-uploads/dc7c3a6d-f388-459c-bebf-84538882e02a.png", "/lovable-uploads/f8177d2e-f86e-4cac-b403-4c5257ea45f7.png", "/lovable-uploads/f70c6376-9514-4edb-aebd-e2a4fea9aa97.png", "/lovable-uploads/ff1b4417-ca70-4004-bf82-d19fcb1c5cec.png", "/lovable-uploads/d198406f-4a55-437a-a6bf-b5181cd64707.png"],
    description: "Overview: The African Fund for Endangered Wildlife (AFEW) is a non-profit dedicated to the breeding and preservation of the threatened Rothschild giraffe; it is situated just outside Nairobi National Park. It presents the Giraffe Center experience, which is the main tourist attraction. Here, you will learn about these amazing animals by visiting on a guided tour or self-guided walk; you can even hand-feed them from a raised platform!\n\nHighlights:\n• Learn about the East African native vulnerable species called the Rothschild giraffe.\n• From a dedicated viewing deck, observe giraffes up close and even feed them.\n• Learn about AFEW's giraffe breeding program and efforts at conservation.\n\nIncluded/Excluded:\n• A friendly professional guide\n• Personal expenses\n• Insurance\n• Drinks and meals\n• Additional Services not mentioned\n\nWhat to expect - Meet the giraffes:\n• Arrive at the Giraffe Centre and proceed to the giraffe feeding platform.\n• Observe and interact with the Rothschild giraffes, learning about their unique characteristics and ecological importance.\n• Take photos while feeding the giraffes pellets from a raised platform.\n• Browse the gift shop for educational souvenirs (optional).\n\nCancellation policy: Cancel up to 24 hours in advance to receive a full refund. Cancellations made less than 24 hours before the tour start are non-refundable.\n\nDuration: 0 - 2 hours\nLanguages: English\nLocation: Giraffe Centre, Duma Road, Nairobi, Kenya\n\nThe centre is open from 9:00 AM to 5:00 PM every day including weekends and all public holidays. 90 percent of funds collected from the entrance fees and sales in our gift shop and Tea House go towards conservation work. By visiting and/or making a purchase from the souvenir shop and the Teahouse, you contribute towards educating school children and teachers across Kenya.",
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
    title: "Guided bush and bird walks at Ol Pejeta Conservancy",
    id: "exp-olp-bird-walks",
    slug: P("Ol Pejeta Bush Bird Walks"),
    partner: "Ol Pejeta Conservancy",
    destination: "laikipia",
    themes: ["Wildlife conservation"],
    activities: ["birds", "walk"],
    images: ["/lovable-uploads/4fcd9e54-4c77-4a54-88fe-56c8ddc0b495.png", "/lovable-uploads/6b43509e-3f29-49fc-9ca7-51d7eb537cc4.png", "/lovable-uploads/2b49cd5c-bbc6-4855-9d59-e470f0a468c3.png", "/lovable-uploads/7a00b231-76f0-474c-be46-287be6fabd2f.png", "/lovable-uploads/0780b556-7c56-434b-a8f3-4ce4736e1f6e.png", "/lovable-uploads/a78c368c-5b4a-4f2c-ad1e-5b0b6574dc59.png"],
    heroImage: "/lovable-uploads/4fcd9e54-4c77-4a54-88fe-56c8ddc0b495.png",
    gallery: ["/lovable-uploads/4fcd9e54-4c77-4a54-88fe-56c8ddc0b495.png", "/lovable-uploads/6b43509e-3f29-49fc-9ca7-51d7eb537cc4.png", "/lovable-uploads/2b49cd5c-bbc6-4855-9d59-e470f0a468c3.png", "/lovable-uploads/7a00b231-76f0-474c-be46-287be6fabd2f.png", "/lovable-uploads/0780b556-7c56-434b-a8f3-4ce4736e1f6e.png", "/lovable-uploads/a78c368c-5b4a-4f2c-ad1e-5b0b6574dc59.png"],
    description: "Overview\nVisitors to the unique protected area of Ol Pejeta Conservancy can directly help preserve wildlife. Apart from the last two northern white rhinos and the Big Five, it helps communities nearby with health and education initiatives.\n\nThis informative walk brings you up close and personal with the sights, smells, and sounds of the African bush accompanied by one of the seasoned armed rangers. There is no better way to start the day! Beginning at the Morani Information Center at 6:30 am, this walk provides guests with an opportunity to learn about game routes, spoor identification, and Ol Pejeta's insects, birds, and smaller mammals. Although the walk is not difficult, given you will be walking for roughly 3 hours, a reasonable degree of fitness is needed. Visitors must make their way to the starting point.\n\nYour safari at Ol Pejeta offers an opportunity to help wildlife, rather than just a tour. Here, you will be involved in actual conservation efforts and help to create lasting change even after you depart.\n\nHighlights\n• Explore the African bush under a professional guide's direction.\n• View wildlife in their natural surroundings and learn their behaviors.\n• Let the sights, sounds, and smells of the African wilderness sink in.\n\nIncluded/Excluded\n• A friendly professional guide\n• Conservancy entry fees\n• Personal expenses\n• Insurance\n• Donations towards supporting the organization\n\nWhat to expect\nWildlife Encounters Up Close\no Arrive at Ol Pejeta Conservancy between 6:30 AM - 8:30 AM or 3:30 PM - 5:30 PM depending on your chosen time slot.\no Meet your experienced ranger guide.\no Embark on a guided walking tour through the African bush.\no Immerse yourself in the sights, sounds, and smells of the African wilderness.\n\nCancellation policy\no You can cancel up to 48 hours before the experience starts for a full refund.\n\nDurations\n0 - 2 hours\n\nLanguages\nEnglish\n\nFrequently asked questions\nWhat can I expect on the walk?\nYou'll be guided by experienced rangers who will share their knowledge of the wildlife, plants, and ecosystem. Expect to see various animals in their natural habitat and learn about their behaviors.\n\nHow difficult is the walk?\nThe terrain can vary, but the walks are generally designed to be accessible for most fitness levels.\n\nWhat should I wear?\nComfortable clothing and shoes suitable for walking on uneven terrain are recommended. Carry sun cream and a hat.\n\nImportant information\no This activity is not suitable for children under the age of 12.\no If you don't have transport to the starting point, the conservancy can arrange for you to be picked up (within the conservancy) for an extra fee.\n\nWhere you'll be\n2VC5+X9 Nanyuki",
    priceKESAdult: 9075,
    childHalfPriceRule: true,
    visibleOnMarketplace: true,
    locationText: "Ol Pejeta Conservancy, Laikipia",
    partnerSlug: "ol-pejeta-conservancy",
    sourceUrl: "https://natuasili.com/st_tour/ol-pejeta-bush-bird-walks/",
  },
  {
    title: "Night game drive at Ol Pejeta Conservancy",
    id: "exp-olp-night-drive",
    slug: P("Night Game Drive Ol Pejeta"),
    partner: "Ol Pejeta Conservancy",
    destination: "laikipia",
    themes: ["Wildlife conservation"],
    activities: ["game drive", "night"],
    images: ["/lovable-uploads/fe11b3d0-bbb8-421a-a54a-c2343a14ec50.png", "/lovable-uploads/184835e0-a9f6-4d05-b918-916122306cde.png", "/lovable-uploads/de01b48a-1d89-4361-965c-8a19635529fb.png", "/lovable-uploads/0085ecb3-5101-4f26-a7e8-17cc6132e939.png"],
    heroImage: "/lovable-uploads/fe11b3d0-bbb8-421a-a54a-c2343a14ec50.png",
    gallery: ["/lovable-uploads/fe11b3d0-bbb8-421a-a54a-c2343a14ec50.png", "/lovable-uploads/184835e0-a9f6-4d05-b918-916122306cde.png", "/lovable-uploads/de01b48a-1d89-4361-965c-8a19635529fb.png", "/lovable-uploads/0085ecb3-5101-4f26-a7e8-17cc6132e939.png"],
    description: "Overview\nVisitors to the unique protected area of Ol Pejeta Conservancy can directly help preserve wildlife. In addition to the last two northern white rhinos and the Big Five, it helps communities nearby with health and education initiatives.\n\nBeing private, Ol Pejeta Conservancy permits night game drives—a rare activity in most Kenyan parks and reserves. These drives let visitors explore the conservancy past dark. Under a spotlight, you might find nocturnal creatures including bat-eared foxes, white-tailed mongooses, zorillas, and aardvarks. Usually daytime sleepers, lions are active at night, and you might even find a leopard. Dress for these drives in warm clothing.\n\nGuests staying in the conservancy pay for night game drives; pick-up from their camp or lodge comes from a shared vehicle. You'll have to remain in the car at all times; the drive takes two hours. Your safari at Ol Pejeta offers an opportunity to help wildlife, rather than just a tour. Here, you will be involved in actual conservation efforts and help to create lasting change even after you depart.\n\nHighlights\n• Discover the conservancy under the Kenyan night sky starry.\n• Search for unusual animals including aardvark, zorillas, bat-eared foxes, and maybe leopards or lions.\n• With a knowledgeable guide, explore the nocturnal side of the African wilderness.\n\nIncluded/Excluded\n• A friendly professional guide\n• Conservancy entry fees\n• Personal expenses\n• Insurance\n• Donations towards supporting the organization\n\nWhat to expect\nUnveiling Ol Pejeta after dark\no Arrive at Ol Pejeta Conservancy in the late afternoon (depending on your chosen departure time).\no Dress warmly in neutral-colored clothing.\no Meet your expert guide and embark on a night game drive through the conservancy.\no While sightings are not guaranteed, enjoy the thrill of exploring the African wilderness at night.\n\nCancellation policy\no You can cancel up to 48 hours before the experience starts for a full refund.\n\nDurations\n0 - 2 hours\n\nLanguages\nEnglish\n\nFrequently asked questions\nWhat animals can I expect to see?\nYou might encounter aardvark, zorillas, bat-eared foxes, leopards, or even lions hunting.\n\nHow many people can participate?\nThe minimum is two people, and the vehicle can seat up to 6 people (not exclusive use).\n\nWhen are the night game drives offered?\nDaily between 7:00 PM - 9:00 PM EAT or 9:00 PM - 11:00 PM EAT.\n\nImportant information\no A minimum of 2 people is required. Single travelers will be charged the price for 2 people.\no If you don't have transport to the starting point, the conservancy can arrange for you to be picked up (within the conservancy) for an extra fee.\n\nWhere you'll be\n2VC5+X9 Nanyuki",
    priceKESAdult: 9075,
    childHalfPriceRule: true,
    visibleOnMarketplace: true,
    locationText: "Ol Pejeta Conservancy, Laikipia",
    partnerSlug: "ol-pejeta-conservancy",
    sourceUrl: "https://natuasili.com/st_tour/night-game-drive-ol-pejeta/",
  },
  {
    title: "Meet the last northern white rhinos at Ol Pejeta Conservancy",
    id: "exp-olp-white-rhinos",
    slug: P("Northern White Rhinos Ol Pejeta"),
    partner: "Ol Pejeta Conservancy",
    destination: "laikipia",
    themes: ["Wildlife conservation"],
    activities: ["rhino", "sanctuary"],
    images: ["/lovable-uploads/ddffabed-5ad6-4675-9022-54618ae8d95c.png", "/lovable-uploads/e0c2d6be-e7b9-46ff-8698-69f4c3ac5482.png", "/lovable-uploads/23ba4555-4d41-4d60-8860-0473d504a374.png", "/lovable-uploads/2e44a99c-8c2a-4fec-bbac-16bd1b583a7c.png", "/lovable-uploads/f1cab140-4967-4cb8-b969-bc6cb5f7e5a2.png", "/lovable-uploads/7a7f3e4d-7620-47da-9471-f4c8e8d23021.png", "/lovable-uploads/b9acb433-0891-4a7b-993c-8faaedea607e.png", "/lovable-uploads/44794adc-45a9-4e30-b44a-39acc76a92ef.png"],
    heroImage: "/lovable-uploads/ddffabed-5ad6-4675-9022-54618ae8d95c.png",
    gallery: ["/lovable-uploads/ddffabed-5ad6-4675-9022-54618ae8d95c.png", "/lovable-uploads/e0c2d6be-e7b9-46ff-8698-69f4c3ac5482.png", "/lovable-uploads/23ba4555-4d41-4d60-8860-0473d504a374.png", "/lovable-uploads/2e44a99c-8c2a-4fec-bbac-16bd1b583a7c.png", "/lovable-uploads/f1cab140-4967-4cb8-b969-bc6cb5f7e5a2.png", "/lovable-uploads/7a7f3e4d-7620-47da-9471-f4c8e8d23021.png", "/lovable-uploads/b9acb433-0891-4a7b-993c-8faaedea607e.png", "/lovable-uploads/44794adc-45a9-4e30-b44a-39acc76a92ef.png"],
    description: "Overview\nVisitors to the unique protected area of Ol Pejeta Conservancy can directly help preserve wildlife. Apart from the last two northern white rhinos and the Big Five, it helps communities nearby with health and education initiatives.\n\nGet a rare opportunity to meet Najin and Fatu, the last two northern white rhinos, from the Czech Republic, and learn how they got to Kenya. This encounter with these majestic creatures is more than just a tour; it's a close-up view to value their beauty and understand their background. It's an invitation to join the fight for years to come for a world rich in wildlife.\n\nYour safari at Ol Pejeta offers an opportunity to help wildlife, rather than just a tour. Here, you will be involved in actual conservation efforts and help to create lasting change even after you depart.\n\nHighlights\n• Observe the critically endangered northern white rhinos up close in a once-in-a-lifetime opportunity.\n• Learn about the incredible creatures from the committed keepers who care for them.\n• Contribute to conservation efforts with proceeds from the experience funding rhino preservation.\n\nIncluded/Excluded\n• A friendly professional guide\n• Conservancy entry fees\n• Personal expenses\n• Insurance\n• Donations towards supporting the organization\n\nWhat to expect\nMeet the Last Two Northern White Rhinos\no Arrive at the Ol Pejeta Conservancy's Morani Information Centre.\no Join a guided tour (offered daily at specific times) to meet Najin and Fatu.\no Observe the northern white rhinos in their enclosure and learn about their story from the keepers.\n\nCancellation policy\no You can cancel up to 48 hours before the experience starts for a full refund.\n\nDurations\n0 - 2 hours\n\nLanguages\nEnglish\n\nFrequently asked questions\nHow rare are these rhinos?\nThe northern white rhino subspecies is classified as critically endangered, with only Najin and Fatu remaining worldwide.\n\nWhat is included in the experience?\nThe experience includes meeting the rhinos, hearing their story from the keepers, and contributing to conservation efforts.\n\nWhat should I wear?\nWear closed shoes, sun protection, a hat, and neutral-colored clothing.\n\nIs this a rare opportunity?\nAbsolutely! This is a chance to see the very last of their kind.\n\nWhat will I learn?\nDedicated keepers will share their knowledge about the northern white rhinos and the fight for their survival.\n\nImportant information\no If you don't have transport to the starting point, we can pick you up within the conservancy for an extra fee.\n\nWhere you'll be\n2VC5+X9 Nanyuki",
    priceKESAdult: 9075,
    childHalfPriceRule: true,
    visibleOnMarketplace: true,
    locationText: "Ol Pejeta Conservancy, Laikipia",
    partnerSlug: "ol-pejeta-conservancy",
    sourceUrl: "https://natuasili.com/st_tour/northern-white-rhinos-ol-pejeta/",
  },
  {
    title: "Behind the scenes – Ol Pejeta Sweetwaters Chimpanzee",
    id: "exp-olp-chimps",
    slug: P("Sweetwaters Chimpanzee Conservation Tour"),
    partner: "Ol Pejeta Conservancy",
    destination: "laikipia",
    themes: ["Wildlife conservation"],
    activities: ["chimpanzee", "tour"],
    images: ["/lovable-uploads/e28a2b5d-1600-4e1d-8326-9d5d2bb9ce2a.png", "/lovable-uploads/dab51ea2-808e-4595-b1eb-a8c642771ee8.png", "/lovable-uploads/f7624043-059b-4465-b4eb-7c3889b13836.png", "/lovable-uploads/ba99b4d7-3625-469d-94d3-1f5fc368a7f4.png", "/lovable-uploads/4a267b87-b505-436d-998f-209ea2f328cd.png", "/lovable-uploads/78998175-ed38-4681-b7f8-ed4c03a3a517.png"],
    heroImage: "/lovable-uploads/e28a2b5d-1600-4e1d-8326-9d5d2bb9ce2a.png",
    gallery: ["/lovable-uploads/e28a2b5d-1600-4e1d-8326-9d5d2bb9ce2a.png", "/lovable-uploads/dab51ea2-808e-4595-b1eb-a8c642771ee8.png", "/lovable-uploads/f7624043-059b-4465-b4eb-7c3889b13836.png", "/lovable-uploads/ba99b4d7-3625-469d-94d3-1f5fc368a7f4.png", "/lovable-uploads/4a267b87-b505-436d-998f-209ea2f328cd.png", "/lovable-uploads/78998175-ed38-4681-b7f8-ed4c03a3a517.png"],
    description: "Overview\nVisitors to the unique protected area of Ol Pejeta Conservancy can directly help preserve wildlife. Apart from the last two northern white rhinos and the Big Five, it helps communities nearby with health and education initiatives.\n\nAt Ol Pejeta, find a rare chance to view chimpanzees behind the scenes and learn about their everyday care. Though not native to Kenya, chimpanzees face significant threats in the wild, mostly from habitat loss and commercial hunting for bushmeat. This encounter provides an exclusive glimpse into the efforts toward protection and care for these incredible animals.\n\nYour safari at Ol Pejeta offers an opportunity to help wildlife, rather than just a tour. Here, you will be involved in actual conservation efforts and help to create lasting change even after you depart.\n\nHighlights\n• Observe chimpanzees in their habitat and learn more about their daily lives.\n• Learn about the difficulties wild chimpanzees experience, including habitat loss and poaching.\n• See the commitment of those who take necessary care for the chimpanzees.\n\nIncluded/Excluded\n• A friendly professional guide\n• Conservancy entry fees\n• Personal expenses\n• Insurance\n• Donations towards supporting the organization\n\nWhat to expect\nA Unique Look at Chimpanzee Life\no Arrive at the Sweetwaters Chimpanzee Sanctuary (transportation not included).\no Check-in and participate in a brief orientation with a sanctuary staff member. Learn about the sanctuary's mission, the chimpanzees' history, and important safety protocols. Pass through a footbath to disinfect your shoes as a biosecurity measure.\no Enter the designated viewing area for a unique behind-the-scenes look at the chimpanzees in their enclosures. Observe their social interactions, playful behaviors, and feeding time (conducted by caregivers only).\no Depart from the chimpanzee sanctuary with a newfound appreciation for these remarkable primates.\n(Optional):\no Explore the wider Ol Pejeta Conservancy on a game drive (not included in the behind-the-scenes tour) and see a variety of wildlife, including rhinos, lions, and zebras.\no Visit the Equator marker located within the conservancy and snap a photo straddling two hemispheres!\n\nCancellation policy\no You can cancel up to 48 hours before the experience starts for a full refund.\n\nDurations\n0 - 2 hours\n\nLanguages\nEnglish\n\nFrequently asked questions\nWhat role do sanctuaries play in protecting chimpanzee populations?\nProtecting threatened chimpanzee populations depends critically on sanctuaries such as Ol Pejeta. While they raise public awareness and education about conservation, they offer a safe refuge from threats including habitat destruction and illegal wildlife trade.\n\nHow does this tour contribute to chimpanzee conservation?\nBy taking part in this tour, you directly help the sanctuary to care for chimpanzees and increase awareness about the threats they endure.\n\nHow can I get involved in chimpanzee conservation beyond this tour?\nYou can donate to sanctuaries like the one at Ol Pejeta Conservancy or support groups striving to safeguard wild chimpanzees.\n\nImportant information\no Group Size: Limited to a minimum of 2 and a maximum of 8 people, subject to the welfare of the animals at the time of your visit.\no No Physical Contact: Absolutely no physical contact is allowed between visitors and chimpanzees.\no Feeding Restrictions: Visitors are not allowed to feed the chimpanzees; feeding is done exclusively by caregivers.\no Health Requirements: If you are sick with a cold, flu, or any other contagious illness, a behind-the-scenes visit to the Chimpanzee Sanctuary will not be possible.\no Photography: Photography is only allowed outside the chimps' houses.\n\nWhere you'll be\n2VC5+X9 Nanyuki",
    priceKESAdult: 9075,
    childHalfPriceRule: true,
    visibleOnMarketplace: true,
    locationText: "Sweetwaters, Ol Pejeta Conservancy",
    partnerSlug: "ol-pejeta-conservancy",
    sourceUrl: "https://natuasili.com/st_tour/sweetwaters-chimpanzee-conservation-tour/",
  },
  {
    title: "Track lions and aid conservation at Ol Pejeta Conservancy",
    id: "exp-olp-lion-tracking",
    slug: P("Ol Pejeta Lion Tracking Tour"),
    partner: "Ol Pejeta Conservancy",
    destination: "laikipia",
    themes: ["Wildlife conservation"],
    activities: ["lion", "tracking"],
    images: ["/lovable-uploads/467b343a-afeb-4589-b353-0cf3d27770a0.png", "/lovable-uploads/c007cec4-d0cc-4fb1-b485-3eeb6775a94c.png", "/lovable-uploads/70b7eda0-d99e-446c-8578-c9319f4a51dd.png", "/lovable-uploads/3dd9320f-34e0-4c8d-b544-4f37f422baed.png", "/lovable-uploads/47ac3560-325a-4ada-938e-9bd3fe01a740.png", "/lovable-uploads/c0fcad11-f3bd-46d5-824d-c9a22bf3dddf.png", "/lovable-uploads/31864571-d540-4db2-9138-efd52294f908.png"],
    heroImage: "/lovable-uploads/467b343a-afeb-4589-b353-0cf3d27770a0.png",
    gallery: ["/lovable-uploads/467b343a-afeb-4589-b353-0cf3d27770a0.png", "/lovable-uploads/c007cec4-d0cc-4fb1-b485-3eeb6775a94c.png", "/lovable-uploads/70b7eda0-d99e-446c-8578-c9319f4a51dd.png", "/lovable-uploads/3dd9320f-34e0-4c8d-b544-4f37f422baed.png", "/lovable-uploads/47ac3560-325a-4ada-938e-9bd3fe01a740.png", "/lovable-uploads/c0fcad11-f3bd-46d5-824d-c9a22bf3dddf.png", "/lovable-uploads/31864571-d540-4db2-9138-efd52294f908.png"],
    description: "Overview\nVisitors to the unique protected area of Ol Pejeta Conservancy can directly help preserve wildlife. Apart from the last two northern white rhinos and the Big Five, it helps communities nearby with health and education initiatives.\n\nVisit the conservancy for a unique experience, where visitors may actively help gather important research data by tracking collared lions. Should the collared lions go missing, you will record sightings of other lions, noting unique traits including nose spots, ear tears, and whisker spots. This practical knowledge is a great chance to learn about lions and provide the Ol Pejeta Ecological Monitoring Department with useful information. Have a wonderful experience while supporting the research and protection of these magnificent creatures.\n\nGuests are picked up in a shared conservancy vehicle either in morning tracking at 6:30 am or in afternoon tracking at 3:30 pm. Tracking ends at 5:30 pm and 8:30 am, respectively. You have to remain in the vehicle. You will be provided pens, lion ID sheets, and drinking water. We suggest packing binoculars and cameras.\n\nYour safari at Ol Pejeta offers an opportunity to help wildlife, rather than being only a tour. Here, you will be involved in actual conservation efforts and help to create lasting change even long after you depart.\n\nHighlights\n• Track lions with seasoned guides using radio collars.\n• To support conservation research, compile useful information on lion prides.\n• Find out about the challenges that Laikipia's lion population faces.\n\nIncluded/Excluded\n• A friendly professional guide\n• Conservancy entry fees\n• Personal expenses\n• Insurance\n• Donations towards supporting the organization\n\nWhat to expect\nTrack and observe lions in their habitat\no Arrive at Ol Pejeta Conservancy between 6:30 AM - 8:30 AM or 3:30 PM - 5:30 PM (tour times).\no Meet your experienced guide and receive a briefing on the activity.\no Participate in lion tracking using radio collars to locate prides.\no Learn about lion conservation efforts at Ol Pejeta Conservancy.\no Meet your guide and receive a briefing on safety procedures and data collection.\no Participate in lion tracking using a receiver to locate collared lions.\no Observe lion behavior and contribute data on the pride's activities.\no Learn about lion conservation efforts at Ol Pejeta from your expert guide.\no Enjoy this unique opportunity to be a part of lion conservation.\n\nCancellation policy\no You can cancel up to 48 hours before the experience starts for a full refund.\n\nDurations\n0 - 2 hours\n\nLanguages\nEnglish\n\nFrequently asked questions\nDo I get to see lions up close?\nWhile sightings are not guaranteed, tracking collared lions increases your chances of encountering them. You'll observe from the vehicle for safety reasons.\n\nHow does my participation help conservation?\nThe data you collect aids research on lion behavior and helps find solutions to conservation challenges.\n\nDo I need to be an experienced tracker?\nNo, prior experience is not required. Guides will assist with tracking.\n\nCan I get out of the vehicle?\nNo, guests must remain in the vehicle for safety reasons.\n\nImportant information\no A minimum of 2 people is required. Single travelers will be charged the price for 2 people.\no If you don't have transport to the starting point, we can pick you up within the conservancy for an extra fee.\n\nWhere you'll be\n2VC5+X9 Nanyuki",
    priceKESAdult: 9075,
    childHalfPriceRule: true,
    visibleOnMarketplace: true,
    locationText: "Ol Pejeta Conservancy, Laikipia",
    partnerSlug: "ol-pejeta-conservancy",
    sourceUrl: "https://natuasili.com/st_tour/ol-pejeta-lion-tracking-tour/",
  },
  {
    title: "Become a K-9 handler for a day at Ol Pejeta Conservancy",
    id: "exp-olp-k9",
    slug: P("K9 Handler Day Ol Pejeta"),
    partner: "Ol Pejeta Conservancy",
    destination: "laikipia",
    themes: ["Wildlife conservation"],
    activities: ["k9", "ranger"],
    images: ["/lovable-uploads/ba1c2e8e-98b4-4179-b5ef-87c52a8e2a4b.png", "/lovable-uploads/c74fc7f6-c650-4d6c-9b2c-7123506ef925.png", "/lovable-uploads/2770739e-51a9-4f26-9767-5be84bd9f971.png", "/lovable-uploads/9d7593b5-9eb0-4389-9d50-61779f55049b.png", "/lovable-uploads/a09a6ee9-42d5-4ce0-afe3-0e327f0bd89f.png", "/lovable-uploads/96953002-003d-4d4b-99dc-ef18a544f01f.png"],
    heroImage: "/lovable-uploads/ba1c2e8e-98b4-4179-b5ef-87c52a8e2a4b.png",
    gallery: ["/lovable-uploads/ba1c2e8e-98b4-4179-b5ef-87c52a8e2a4b.png", "/lovable-uploads/c74fc7f6-c650-4d6c-9b2c-7123506ef925.png", "/lovable-uploads/2770739e-51a9-4f26-9767-5be84bd9f971.png", "/lovable-uploads/9d7593b5-9eb0-4389-9d50-61779f55049b.png", "/lovable-uploads/a09a6ee9-42d5-4ce0-afe3-0e327f0bd89f.png", "/lovable-uploads/96953002-003d-4d4b-99dc-ef18a544f01f.png"],
    description: "Overview\nVisitors to the unique protected area of Ol Pejeta Conservancy can directly help conserve wildlife. Apart from the last two northern white rhinos and the Big Five, it supports communities nearby with education and health programs.\n\nSee Ol Pejeta's anti-poaching dog squad. Talk to the dog keepers to find out how to look after our specially trained canine team. Try to hide from the sniffer dogs during the kennel tour. To see whether the bloodhounds can locate you, run, jump, twist, turn, and hide within the Morani Information Center area. This is not only a lot of fun, but it also gives the dogs great training.\n\nYour safari at Ol Pejeta offers an opportunity to assist wildlife. Here, you will be involved in actual conservation efforts and help to create lasting change even after you depart.\n\nHighlights\n• Discover why the K-9 unit is so important for anti-poaching campaigns.\n• See other dog specialties including suspect apprehension, scent tracking, and ammunition detection.\n• Join a bloodhound in an interactive dog-tracking exercise. Watch it track a modeled poacher's scent or run and hide for the dog to find.\n\nIncluded/Excluded\n• A friendly professional guide\n• Conservancy entry fees\n• Personal expenses\n• Insurance\n• Donations towards supporting the organization\n\nWhat to expect\nMeet Ol Pejeta's K9 Heroes\no Arrive at the Morani Information Centre at 8:30 AM (the designated starting point).\no Meet the Ol Pejeta rangers and receive a briefing about the K9 unit's role in conservation.\no Learn about the different specializations of the K9 dogs.\no Gain valuable insights into anti-poaching efforts and the importance of K9 units.\n\nCancellation policy\no You can cancel up to 48 hours before the experience starts for a full refund.\n\nDurations\n0 - 2 hours\n\nLanguages\nEnglish\n\nFrequently asked questions\nWhat can I expect during the activity?\nYou'll learn about the K-9 unit, participate in a tracking exercise with a bloodhound (both hiding and observing), and gain insights into their training.\n\nIs this activity safe?\nYes, the activity is conducted in a controlled environment with experienced handlers.\n\nWhat should I wear?\nClosed shoes, sunscreen, and a hat are recommended. Opt for neutral-colored clothing.\n\nCan I bring children?\nThis activity is not recommended for children under 12 years old.\n\nImportant information\no Physical interaction with the dogs will be relatively restricted.\no This activity is not suitable for children under the age of 12.\no If you don't have transport to the starting point, the conservancy can arrange for you to be picked up (within the conservancy) for an extra fee.\n\nWhere you'll be\n2VC5+X9 Nanyuki",
    priceKESAdult: 9075,
    childHalfPriceRule: true,
    visibleOnMarketplace: true,
    locationText: "Ol Pejeta Conservancy, Laikipia",
    partnerSlug: "ol-pejeta-conservancy",
    sourceUrl: "https://natuasili.com/st_tour/k9-handler-day-ol-pejeta/",
  },
  {
    title: "Coral conservation experience with REEFolution",
    id: "exp-reef-coral",
    slug: P("Dive into Coral Conservation Reefolution"),
    partner: "Reefolution",
    destination: "coastal-kenya",
    themes: ["Conservation education"],
    activities: ["coral", "diving"],
    images: ["/lovable-uploads/d4888a5b-c6ad-4983-8c53-e2364f663bd4.png", "/lovable-uploads/8236db6a-4c2e-4c06-864a-bfcdd270ad52.png", "/lovable-uploads/f39fee39-a385-4e10-a818-084c4d1811fd.png", "/lovable-uploads/3247620c-45d9-4bf0-ad1c-677d2a49f122.png", "/lovable-uploads/55949b1a-fc87-4134-896a-da6c9c730a99.png", "/lovable-uploads/34e27ffd-1e7e-4e27-b73c-8c4a32dfaf96.png", "/lovable-uploads/e6f4a974-f663-48e0-8aa7-dcecd15fb88a.png", "/lovable-uploads/22d0e577-d64d-4381-a819-432a4c010611.png", "/lovable-uploads/6116148a-eaef-4942-b31a-feacddf7129c.png", "/lovable-uploads/75c0a6d6-4ca2-43a5-adcc-0734f2ac5e95.png"],
    heroImage: "/lovable-uploads/d4888a5b-c6ad-4983-8c53-e2364f663bd4.png",
    gallery: ["/lovable-uploads/d4888a5b-c6ad-4983-8c53-e2364f663bd4.png", "/lovable-uploads/8236db6a-4c2e-4c06-864a-bfcdd270ad52.png", "/lovable-uploads/f39fee39-a385-4e10-a818-084c4d1811fd.png", "/lovable-uploads/3247620c-45d9-4bf0-ad1c-677d2a49f122.png", "/lovable-uploads/55949b1a-fc87-4134-896a-da6c9c730a99.png", "/lovable-uploads/34e27ffd-1e7e-4e27-b73c-8c4a32dfaf96.png", "/lovable-uploads/e6f4a974-f663-48e0-8aa7-dcecd15fb88a.png", "/lovable-uploads/22d0e577-d64d-4381-a819-432a4c010611.png", "/lovable-uploads/6116148a-eaef-4942-b31a-feacddf7129c.png", "/lovable-uploads/75c0a6d6-4ca2-43a5-adcc-0734f2ac5e95.png"],
    description: "Overview\nAs the leading coral restoration project in Africa, REEFolution is focused on safeguarding Kenyan coral reefs. To equip people to be champions of coral preservation, they provide a range of events combining education, scientific inquiry, and practical activities.\n\nHighlights\n• Discover the inspirational path REEFolution is on and how it will impact the restoration of coral reefs.\n• Attend an interactive workshop to learn about the value of coral reefs and their challenges.\n• Discover the creative coral restoration methods developed by REEFolution, ranging from outplanting to underwater nurseries.\n\nIncluded/Excluded\n• A friendly professional guide\n• Personal expenses\n• Insurance\n• Drinks and meals\n• Additional Services not mentioned\n\nWhat to expect\nDive into REEFolution!\no Arrive at the REEFolution center.\no Participate in an interactive workshop led by REEFolution scientists.\no Learn about REEFolution's story, coral reef science, and restoration techniques.\no Leave empowered to become an advocate for coral reef conservation.\n\nCancellation policy\no You can cancel up to 48 hours before the experience starts for a full refund.\n\nDurations\n2 - 3 hours\n\nLanguages\nEnglish\n\nFrequently asked questions\nWhat are the different program options?\no Land-based program: Ideal for families and those who prefer to stay dry.\no Snorkel and Learn: Combines a workshop with a guided snorkeling tour.\no Dive and restore: Designed for certified divers who want to participate in coral planting actively; includes a workshop and guided dive.\n\nHow long are the programs?\nLand-based is half-day, snorkel & learn and dive & restore are full-day.\n\nWhat will I learn in the workshop?\nYou'll learn about the vital role coral reefs play in the ecosystem, the threats they face, and REEFolution's restoration techniques.\n\nCan I contribute to coral restoration?\nDepending on the program, you might have the opportunity to plant coral fragments and directly aid in reef restoration.\n\nHow can I contribute?\nAll programs raise awareness and support REEFolution's efforts. You are welcome to donate to restore more reefs, intensify our research, train new rangers and activate more locals.\n\nWhere you'll be\nPH6P+RRR, Ukunda, Diani Beach Road, Diani Beach",
    priceKESAdult: 10000,
    childHalfPriceRule: false,
    visibleOnMarketplace: true,
    locationText: "Coastal Kenya",
    partnerSlug: "reefolution",
    sourceUrl: "https://natuasili.com/st_tour/dive-into-coral-conservation-with-reefolution/",
  },
  {
    title: "Drones for conservation with Mara Elephant Project",
    id: "exp-drone-mara",
    slug: P("Drone Conservation Mara Elephant"),
    partner: "Mara Elephant Project",
    destination: "masai-mara",
    themes: ["Wildlife conservation"],
    activities: ["drone", "elephant"],
    images: ["/lovable-uploads/a9fc8078-1eb7-433f-8ea8-cc504ca5b048.png", "/lovable-uploads/bd06defe-f511-409f-88b1-decacb2392df.png", "/lovable-uploads/388b370f-647e-471b-92c2-addc918cb81b.png", "/lovable-uploads/2e0b1e5d-9156-4ef6-9b42-0927ce47af9a.png"],
    heroImage: "/lovable-uploads/a9fc8078-1eb7-433f-8ea8-cc504ca5b048.png",
    gallery: ["/lovable-uploads/a9fc8078-1eb7-433f-8ea8-cc504ca5b048.png", "/lovable-uploads/bd06defe-f511-409f-88b1-decacb2392df.png", "/lovable-uploads/388b370f-647e-471b-92c2-addc918cb81b.png", "/lovable-uploads/2e0b1e5d-9156-4ef6-9b42-0927ce47af9a.png"],
    description: "Overview\nThe Mara Elephant Project (MEP) is a conservation organization to protect elephants in the Mara-Serengeti ecosystem. This two-hour expedition is to discover the new world of drone conservation! MEP has pioneered the use of drones to transform its approach to elephant protection since in 2011. Experience personally the difference this innovative technology is bringing about.\n\nHighlights\n• Discover MEP's creative drone initiative, which comprises nine Mavic drones with thermal imaging capacity.\n• Meet and engage with the 18 rangers and researchers on the skilled team flying the drones.\n• Learn how different conservation projects—conflict avoidance, elephant monitoring, and reconnaissance among other things—use drones.\n\nIncluded/Excluded\n• Refreshments; drinking water, coffee or juice.\n• Personal expenses\n• Insurance\n• Meals\n\nWhat to expect\nExploring Drone Conservation with MEP\no Arrive at the designated meeting point (transportation likely not included).\no Receive a briefing from a knowledgeable MEP staff member on the importance of elephant conservation and the groundbreaking use of drones in their efforts.\no Witness a live demonstration of the various drones used by MEP. Learn about their specific features and functionalities for diverse conservation applications.\no Engage in a Q&A session with the MEP staff member, addressing any questions you may have about drone conservation and MEP's overall efforts.\n\nCancellation policy\no You can cancel and get a full refund if you do it at least 7 days before the experience starts. If you book more than 48 hours before the start time, you can also cancel within 24 hours of booking for a full refund.\n\nDurations\n0 - 2 hours\n\nLanguages\nEnglish\n\nFrequently asked questions\nWhat can I expect to do on this program?\nYou'll gain exclusive insights into MEP's drone program through presentations, demonstrations, and potentially observing live drone operations (weather dependent).\n\nIs there an age restriction?\nThis program might be more suitable for older children and adults due to the technical nature of the content.\n\nCan I participate in flying the drones?\nPiloting the drones is done by trained MEP personnel.\n\nImportant information\no The $500 all - inclusive donation paid to MEP\no Mara Elephant Project has an educational mandate, which aligns with our core mission that allows for guests to visit our headquarters to see MEP's presentation and meet MEP staff. These experiences will be available at 10 a.m. on a weekday and no minimum donation is required.\no Mara Elephant Project can provide bespoke experiences for interested donors. This can include a visit to camp for tea and coffee and a presentation from a key MEP staff member, which would give guests private access to learn more about our work. We would ask for a minimum donation of $1,000 per group for this experience.\n\nWhere you'll be\n6GCQR5P4+24",
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
    images: ["/lovable-uploads/78e36614-c646-4ca7-ab21-547fa3e9d6e0.png", "/lovable-uploads/a368337f-e909-4d2e-8491-b3ed256f39df.png", "/lovable-uploads/62a2abcd-dd83-465a-952f-e869c7e07d9a.png", "/lovable-uploads/5bb8501d-5c7d-4527-848c-ca3703785236.png"],
    heroImage: "/lovable-uploads/78e36614-c646-4ca7-ab21-547fa3e9d6e0.png",
    gallery: ["/lovable-uploads/78e36614-c646-4ca7-ab21-547fa3e9d6e0.png", "/lovable-uploads/a368337f-e909-4d2e-8491-b3ed256f39df.png", "/lovable-uploads/62a2abcd-dd83-465a-952f-e869c7e07d9a.png", "/lovable-uploads/5bb8501d-5c7d-4527-848c-ca3703785236.png"],
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
    images: ["/lovable-uploads/45948e9d-ba26-45b3-b308-f8a6a38f39d6.png", "/lovable-uploads/b9079424-d55c-4a37-abc9-8320a15ffcee.png", "/lovable-uploads/684a6746-644d-4b80-ab2d-a6c5cd2614e7.png", "/lovable-uploads/88b9500b-125c-4cd9-9417-b120378f291b.png", "/lovable-uploads/85b3e8f2-94f1-49a0-ad29-159761c3e901.png", "/lovable-uploads/ec2f7ae3-2e2f-46eb-a626-471984816dbe.png", "/lovable-uploads/adaa56d0-0915-4399-beef-44e13e7715ac.png"],
    heroImage: "/lovable-uploads/45948e9d-ba26-45b3-b308-f8a6a38f39d6.png",
    gallery: ["/lovable-uploads/45948e9d-ba26-45b3-b308-f8a6a38f39d6.png", "/lovable-uploads/b9079424-d55c-4a37-abc9-8320a15ffcee.png", "/lovable-uploads/684a6746-644d-4b80-ab2d-a6c5cd2614e7.png", "/lovable-uploads/88b9500b-125c-4cd9-9417-b120378f291b.png", "/lovable-uploads/85b3e8f2-94f1-49a0-ad29-159761c3e901.png", "/lovable-uploads/ec2f7ae3-2e2f-46eb-a626-471984816dbe.png", "/lovable-uploads/adaa56d0-0915-4399-beef-44e13e7715ac.png"],
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
    images: ["/lovable-uploads/6a25f8a9-96fd-4721-afde-ac10a66b7d0e.png", "/lovable-uploads/53fee6db-8c18-449f-9b8a-0940ef5dd985.png", "/lovable-uploads/44094c06-c8ea-4b2c-871b-b2bef575682b.png", "/lovable-uploads/b873c5ad-126d-4a9d-bba9-32edcad2bce5.png", "/lovable-uploads/eda92abd-e1b2-4b8d-97b4-f0f968b6edd1.png"],
    heroImage: "/lovable-uploads/6a25f8a9-96fd-4721-afde-ac10a66b7d0e.png",
    gallery: ["/lovable-uploads/6a25f8a9-96fd-4721-afde-ac10a66b7d0e.png", "/lovable-uploads/53fee6db-8c18-449f-9b8a-0940ef5dd985.png", "/lovable-uploads/44094c06-c8ea-4b2c-871b-b2bef575682b.png", "/lovable-uploads/b873c5ad-126d-4a9d-bba9-32edcad2bce5.png", "/lovable-uploads/eda92abd-e1b2-4b8d-97b4-f0f968b6edd1.png"],
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
    googleMapsUrl: "https://share.google/anCALLiWy42IfyTp7",
    images: ["/lovable-uploads/2e803ede-092c-4c9f-ab95-2dbda73dadbe.png", "/lovable-uploads/12f78b3b-4c70-4ca5-baab-42b4cc16aac3.png", "/lovable-uploads/ec33572a-f2cb-4977-94fe-3f2b3904e893.png", "/lovable-uploads/47746d17-ae01-4f6c-8466-af9250b9be6b.png", "/lovable-uploads/d927ebb0-9058-4e4e-b664-2d7801f54e19.png"],
    heroImage: "/lovable-uploads/2e803ede-092c-4c9f-ab95-2dbda73dadbe.png",
    gallery: ["/lovable-uploads/2e803ede-092c-4c9f-ab95-2dbda73dadbe.png", "/lovable-uploads/12f78b3b-4c70-4ca5-baab-42b4cc16aac3.png", "/lovable-uploads/ec33572a-f2cb-4977-94fe-3f2b3904e893.png", "/lovable-uploads/47746d17-ae01-4f6c-8466-af9250b9be6b.png", "/lovable-uploads/d927ebb0-9058-4e4e-b664-2d7801f54e19.png"],
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
    googleMapsUrl: "https://maps.app.goo.gl/bDdP2AwLKi4MgfHF7",
    images: ["/lovable-uploads/7e07f04b-82b6-432c-9064-326ef04a1844.png", "/lovable-uploads/5247eabe-c5d5-44a7-ae67-cfa37f3aa62f.png", "/lovable-uploads/00e92f2f-4b8c-498a-a8c6-7b0ee78c1594.png", "/lovable-uploads/6865f1ee-887a-4b31-a1d1-12b7c3bcc646.png", "/lovable-uploads/06fc22ae-5161-4e52-9d11-5a49e5c06ebc.png", "/lovable-uploads/d08b85ed-f51e-4592-ad65-0a280d4f2869.png", "/lovable-uploads/31b1949f-2cd7-459e-8774-60616e5e685a.png"],
    heroImage: "/lovable-uploads/7e07f04b-82b6-432c-9064-326ef04a1844.png",
    gallery: ["/lovable-uploads/7e07f04b-82b6-432c-9064-326ef04a1844.png", "/lovable-uploads/5247eabe-c5d5-44a7-ae67-cfa37f3aa62f.png", "/lovable-uploads/00e92f2f-4b8c-498a-a8c6-7b0ee78c1594.png", "/lovable-uploads/6865f1ee-887a-4b31-a1d1-12b7c3bcc646.png", "/lovable-uploads/06fc22ae-5161-4e52-9d11-5a49e5c06ebc.png", "/lovable-uploads/d08b85ed-f51e-4592-ad65-0a280d4f2869.png", "/lovable-uploads/31b1949f-2cd7-459e-8774-60616e5e685a.png"],
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
    images: ["/lovable-uploads/e3017527-f111-4ba7-b356-1c8119ddb3ee.png", "/lovable-uploads/782df8a2-d1fb-4943-abc8-b1327cd041b7.png"],
    heroImage: "/lovable-uploads/e3017527-f111-4ba7-b356-1c8119ddb3ee.png",
    gallery: ["/lovable-uploads/e3017527-f111-4ba7-b356-1c8119ddb3ee.png", "/lovable-uploads/782df8a2-d1fb-4943-abc8-b1327cd041b7.png"],
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
    
    // Get the first image from the partner's first experience with uploaded images
    const experienceWithImages = partnerExps.find(exp => exp.images && exp.images.length > 0 && exp.images[0].startsWith('/lovable-uploads/'));
    const partnerImage = experienceWithImages?.images?.[0] || PARTNER_IMAGES[partnerName] || getExperienceImages(partnerName, allActivities)[0];
    
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

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
    title: "Colobus Conservation Guided Eco Tours",
    id: "exp-colobus-eco-tours",
    slug: P("Colobus Conservation Guided Eco Tours"),
    partner: "Colobus Conservation",
    destination: "coastal-kenya",
    themes: ["Wildlife conservation"],
    activities: ["primates", "eco-tour"],
    images: ["/lovable-uploads/1cbd1d3d-c30b-45be-a09e-8c9cc6f1f87b.png", "/lovable-uploads/1cbd3f9c-ed73-43d0-97e2-61830c34802f.png", "/lovable-uploads/a3c50985-66b9-4e12-a7dd-bb047e06a3e7.png", "/lovable-uploads/cb06fcce-173f-46a9-a2bc-f4a80c8711d0.png", "/lovable-uploads/0a4207e5-714a-4879-bbac-a99a5d456692.png", "/lovable-uploads/518cb7cf-9bba-4b26-bd79-971ce97b7291.png", "/lovable-uploads/14b36cde-b5f2-4f18-a1de-85d5fa95baa7.png"],
    heroImage: "/lovable-uploads/1cbd1d3d-c30b-45be-a09e-8c9cc6f1f87b.png",
    gallery: ["/lovable-uploads/1cbd1d3d-c30b-45be-a09e-8c9cc6f1f87b.png", "/lovable-uploads/1cbd3f9c-ed73-43d0-97e2-61830c34802f.png", "/lovable-uploads/a3c50985-66b9-4e12-a7dd-bb047e06a3e7.png", "/lovable-uploads/cb06fcce-173f-46a9-a2bc-f4a80c8711d0.png", "/lovable-uploads/0a4207e5-714a-4879-bbac-a99a5d456692.png", "/lovable-uploads/518cb7cf-9bba-4b26-bd79-971ce97b7291.png", "/lovable-uploads/14b36cde-b5f2-4f18-a1de-85d5fa95baa7.png"],
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
    images: ["/lovable-uploads/a6c0b2b9-fd77-4472-a600-d2f163add078.png", "/lovable-uploads/145c30f9-65a9-4b28-87ad-97dac17376b7.png", "/lovable-uploads/33d3848b-2807-4161-b7b0-b1748f7e09b7.png", "/lovable-uploads/f93e78f2-5726-41ad-9f61-9a2f4ee5b1c4.png", "/lovable-uploads/c4575d2e-e1f6-4292-990c-760879abf32a.png", "/lovable-uploads/40debeaf-566e-4f53-9fd0-6b1103b26c65.png"],
    heroImage: "/lovable-uploads/a6c0b2b9-fd77-4472-a600-d2f163add078.png",
    gallery: ["/lovable-uploads/a6c0b2b9-fd77-4472-a600-d2f163add078.png", "/lovable-uploads/145c30f9-65a9-4b28-87ad-97dac17376b7.png", "/lovable-uploads/33d3848b-2807-4161-b7b0-b1748f7e09b7.png", "/lovable-uploads/f93e78f2-5726-41ad-9f61-9a2f4ee5b1c4.png", "/lovable-uploads/c4575d2e-e1f6-4292-990c-760879abf32a.png", "/lovable-uploads/40debeaf-566e-4f53-9fd0-6b1103b26c65.png"],
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
    images: ["/lovable-uploads/68c0cf79-0a97-4ec1-82b4-1f5f443b3d20.png", "/lovable-uploads/2998745d-d343-4471-b0b6-6a66d49fce09.png", "/lovable-uploads/b9271c14-14e1-4d4e-956a-65b84bc47384.png", "/lovable-uploads/dc7c3a6d-f388-459c-bebf-84538882e02a.png", "/lovable-uploads/f8177d2e-f86e-4cac-b403-4c5257ea45f7.png", "/lovable-uploads/f70c6376-9514-4edb-aebd-e2a4fea9aa97.png", "/lovable-uploads/ff1b4417-ca70-4004-bf82-d19fcb1c5cec.png", "/lovable-uploads/d198406f-4a55-437a-a6bf-b5181cd64707.png"],
    heroImage: "/lovable-uploads/68c0cf79-0a97-4ec1-82b4-1f5f443b3d20.png",
    gallery: ["/lovable-uploads/68c0cf79-0a97-4ec1-82b4-1f5f443b3d20.png", "/lovable-uploads/2998745d-d343-4471-b0b6-6a66d49fce09.png", "/lovable-uploads/b9271c14-14e1-4d4e-956a-65b84bc47384.png", "/lovable-uploads/dc7c3a6d-f388-459c-bebf-84538882e02a.png", "/lovable-uploads/f8177d2e-f86e-4cac-b403-4c5257ea45f7.png", "/lovable-uploads/f70c6376-9514-4edb-aebd-e2a4fea9aa97.png", "/lovable-uploads/ff1b4417-ca70-4004-bf82-d19fcb1c5cec.png", "/lovable-uploads/d198406f-4a55-437a-a6bf-b5181cd64707.png"],
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
    images: ["/lovable-uploads/4fcd9e54-4c77-4a54-88fe-56c8ddc0b495.png", "/lovable-uploads/6b43509e-3f29-49fc-9ca7-51d7eb537cc4.png", "/lovable-uploads/2b49cd5c-bbc6-4855-9d59-e470f0a468c3.png", "/lovable-uploads/7a00b231-76f0-474c-be46-287be6fabd2f.png", "/lovable-uploads/0780b556-7c56-434b-a8f3-4ce4736e1f6e.png", "/lovable-uploads/a78c368c-5b4a-4f2c-ad1e-5b0b6574dc59.png"],
    heroImage: "/lovable-uploads/4fcd9e54-4c77-4a54-88fe-56c8ddc0b495.png",
    gallery: ["/lovable-uploads/4fcd9e54-4c77-4a54-88fe-56c8ddc0b495.png", "/lovable-uploads/6b43509e-3f29-49fc-9ca7-51d7eb537cc4.png", "/lovable-uploads/2b49cd5c-bbc6-4855-9d59-e470f0a468c3.png", "/lovable-uploads/7a00b231-76f0-474c-be46-287be6fabd2f.png", "/lovable-uploads/0780b556-7c56-434b-a8f3-4ce4736e1f6e.png", "/lovable-uploads/a78c368c-5b4a-4f2c-ad1e-5b0b6574dc59.png"],
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
    images: ["/lovable-uploads/fe11b3d0-bbb8-421a-a54a-c2343a14ec50.png", "/lovable-uploads/184835e0-a9f6-4d05-b918-916122306cde.png", "/lovable-uploads/de01b48a-1d89-4361-965c-8a19635529fb.png", "/lovable-uploads/0085ecb3-5101-4f26-a7e8-17cc6132e939.png"],
    heroImage: "/lovable-uploads/fe11b3d0-bbb8-421a-a54a-c2343a14ec50.png",
    gallery: ["/lovable-uploads/fe11b3d0-bbb8-421a-a54a-c2343a14ec50.png", "/lovable-uploads/184835e0-a9f6-4d05-b918-916122306cde.png", "/lovable-uploads/de01b48a-1d89-4361-965c-8a19635529fb.png", "/lovable-uploads/0085ecb3-5101-4f26-a7e8-17cc6132e939.png"],
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
    images: ["/lovable-uploads/ddffabed-5ad6-4675-9022-54618ae8d95c.png", "/lovable-uploads/e0c2d6be-e7b9-46ff-8698-69f4c3ac5482.png", "/lovable-uploads/23ba4555-4d41-4d60-8860-0473d504a374.png", "/lovable-uploads/2e44a99c-8c2a-4fec-bbac-16bd1b583a7c.png", "/lovable-uploads/f1cab140-4967-4cb8-b969-bc6cb5f7e5a2.png", "/lovable-uploads/7a7f3e4d-7620-47da-9471-f4c8e8d23021.png", "/lovable-uploads/b9acb433-0891-4a7b-993c-8faaedea607e.png", "/lovable-uploads/44794adc-45a9-4e30-b44a-39acc76a92ef.png"],
    heroImage: "/lovable-uploads/ddffabed-5ad6-4675-9022-54618ae8d95c.png",
    gallery: ["/lovable-uploads/ddffabed-5ad6-4675-9022-54618ae8d95c.png", "/lovable-uploads/e0c2d6be-e7b9-46ff-8698-69f4c3ac5482.png", "/lovable-uploads/23ba4555-4d41-4d60-8860-0473d504a374.png", "/lovable-uploads/2e44a99c-8c2a-4fec-bbac-16bd1b583a7c.png", "/lovable-uploads/f1cab140-4967-4cb8-b969-bc6cb5f7e5a2.png", "/lovable-uploads/7a7f3e4d-7620-47da-9471-f4c8e8d23021.png", "/lovable-uploads/b9acb433-0891-4a7b-993c-8faaedea607e.png", "/lovable-uploads/44794adc-45a9-4e30-b44a-39acc76a92ef.png"],
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
    images: ["/lovable-uploads/e28a2b5d-1600-4e1d-8326-9d5d2bb9ce2a.png", "/lovable-uploads/dab51ea2-808e-4595-b1eb-a8c642771ee8.png", "/lovable-uploads/f7624043-059b-4465-b4eb-7c3889b13836.png", "/lovable-uploads/ba99b4d7-3625-469d-94d3-1f5fc368a7f4.png", "/lovable-uploads/4a267b87-b505-436d-998f-209ea2f328cd.png", "/lovable-uploads/78998175-ed38-4681-b7f8-ed4c03a3a517.png"],
    heroImage: "/lovable-uploads/e28a2b5d-1600-4e1d-8326-9d5d2bb9ce2a.png",
    gallery: ["/lovable-uploads/e28a2b5d-1600-4e1d-8326-9d5d2bb9ce2a.png", "/lovable-uploads/dab51ea2-808e-4595-b1eb-a8c642771ee8.png", "/lovable-uploads/f7624043-059b-4465-b4eb-7c3889b13836.png", "/lovable-uploads/ba99b4d7-3625-469d-94d3-1f5fc368a7f4.png", "/lovable-uploads/4a267b87-b505-436d-998f-209ea2f328cd.png", "/lovable-uploads/78998175-ed38-4681-b7f8-ed4c03a3a517.png"],
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
    images: ["/lovable-uploads/467b343a-afeb-4589-b353-0cf3d27770a0.png", "/lovable-uploads/c007cec4-d0cc-4fb1-b485-3eeb6775a94c.png", "/lovable-uploads/70b7eda0-d99e-446c-8578-c9319f4a51dd.png", "/lovable-uploads/3dd9320f-34e0-4c8d-b544-4f37f422baed.png", "/lovable-uploads/47ac3560-325a-4ada-938e-9bd3fe01a740.png", "/lovable-uploads/c0fcad11-f3bd-46d5-824d-c9a22bf3dddf.png", "/lovable-uploads/31864571-d540-4db2-9138-efd52294f908.png"],
    heroImage: "/lovable-uploads/467b343a-afeb-4589-b353-0cf3d27770a0.png",
    gallery: ["/lovable-uploads/467b343a-afeb-4589-b353-0cf3d27770a0.png", "/lovable-uploads/c007cec4-d0cc-4fb1-b485-3eeb6775a94c.png", "/lovable-uploads/70b7eda0-d99e-446c-8578-c9319f4a51dd.png", "/lovable-uploads/3dd9320f-34e0-4c8d-b544-4f37f422baed.png", "/lovable-uploads/47ac3560-325a-4ada-938e-9bd3fe01a740.png", "/lovable-uploads/c0fcad11-f3bd-46d5-824d-c9a22bf3dddf.png", "/lovable-uploads/31864571-d540-4db2-9138-efd52294f908.png"],
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
    images: ["/lovable-uploads/ba1c2e8e-98b4-4179-b5ef-87c52a8e2a4b.png", "/lovable-uploads/c74fc7f6-c650-4d6c-9b2c-7123506ef925.png", "/lovable-uploads/2770739e-51a9-4f26-9767-5be84bd9f971.png", "/lovable-uploads/9d7593b5-9eb0-4389-9d50-61779f55049b.png", "/lovable-uploads/a09a6ee9-42d5-4ce0-afe3-0e327f0bd89f.png", "/lovable-uploads/96953002-003d-4d4b-99dc-ef18a544f01f.png"],
    heroImage: "/lovable-uploads/ba1c2e8e-98b4-4179-b5ef-87c52a8e2a4b.png",
    gallery: ["/lovable-uploads/ba1c2e8e-98b4-4179-b5ef-87c52a8e2a4b.png", "/lovable-uploads/c74fc7f6-c650-4d6c-9b2c-7123506ef925.png", "/lovable-uploads/2770739e-51a9-4f26-9767-5be84bd9f971.png", "/lovable-uploads/9d7593b5-9eb0-4389-9d50-61779f55049b.png", "/lovable-uploads/a09a6ee9-42d5-4ce0-afe3-0e327f0bd89f.png", "/lovable-uploads/96953002-003d-4d4b-99dc-ef18a544f01f.png"],
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
    images: ["/lovable-uploads/d4888a5b-c6ad-4983-8c53-e2364f663bd4.png", "/lovable-uploads/8236db6a-4c2e-4c06-864a-bfcdd270ad52.png", "/lovable-uploads/f39fee39-a385-4e10-a818-084c4d1811fd.png", "/lovable-uploads/3247620c-45d9-4bf0-ad1c-677d2a49f122.png", "/lovable-uploads/55949b1a-fc87-4134-896a-da6c9c730a99.png", "/lovable-uploads/34e27ffd-1e7e-4e27-b73c-8c4a32dfaf96.png", "/lovable-uploads/e6f4a974-f663-48e0-8aa7-dcecd15fb88a.png", "/lovable-uploads/22d0e577-d64d-4381-a819-432a4c010611.png", "/lovable-uploads/6116148a-eaef-4942-b31a-feacddf7129c.png", "/lovable-uploads/75c0a6d6-4ca2-43a5-adcc-0734f2ac5e95.png"],
    heroImage: "/lovable-uploads/d4888a5b-c6ad-4983-8c53-e2364f663bd4.png",
    gallery: ["/lovable-uploads/d4888a5b-c6ad-4983-8c53-e2364f663bd4.png", "/lovable-uploads/8236db6a-4c2e-4c06-864a-bfcdd270ad52.png", "/lovable-uploads/f39fee39-a385-4e10-a818-084c4d1811fd.png", "/lovable-uploads/3247620c-45d9-4bf0-ad1c-677d2a49f122.png", "/lovable-uploads/55949b1a-fc87-4134-896a-da6c9c730a99.png", "/lovable-uploads/34e27ffd-1e7e-4e27-b73c-8c4a32dfaf96.png", "/lovable-uploads/e6f4a974-f663-48e0-8aa7-dcecd15fb88a.png", "/lovable-uploads/22d0e577-d64d-4381-a819-432a4c010611.png", "/lovable-uploads/6116148a-eaef-4942-b31a-feacddf7129c.png", "/lovable-uploads/75c0a6d6-4ca2-43a5-adcc-0734f2ac5e95.png"],
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
    images: ["/lovable-uploads/a9fc8078-1eb7-433f-8ea8-cc504ca5b048.png", "/lovable-uploads/bd06defe-f511-409f-88b1-decacb2392df.png", "/lovable-uploads/388b370f-647e-471b-92c2-addc918cb81b.png", "/lovable-uploads/2e0b1e5d-9156-4ef6-9b42-0927ce47af9a.png"],
    heroImage: "/lovable-uploads/a9fc8078-1eb7-433f-8ea8-cc504ca5b048.png",
    gallery: ["/lovable-uploads/a9fc8078-1eb7-433f-8ea8-cc504ca5b048.png", "/lovable-uploads/bd06defe-f511-409f-88b1-decacb2392df.png", "/lovable-uploads/388b370f-647e-471b-92c2-addc918cb81b.png", "/lovable-uploads/2e0b1e5d-9156-4ef6-9b42-0927ce47af9a.png"],
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
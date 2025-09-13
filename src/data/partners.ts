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
  priceKESChild?: number;
  childHalfPriceRule?: boolean;
  isGroupPricing?: boolean;
  minCapacity?: number;
  capacity?: number;
  durationHours: number;
  visibleOnMarketplace: boolean;
  locationText?: string;
  partnerSlug?: string;
  googleMapsUrl?: string;
  timings?: string[];
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
  "Adventure Farm Karen": "/lovable-uploads/518cb7cf-9bba-4b26-bd79-971ce97b7291.png",
  "Friends of Nairobi National Park": "/lovable-uploads/ba1c2e8e-98b4-4179-b5ef-87c52a8e2a4b.png",
  "Friends of Karura Forest": "/lovable-uploads/f0dcab56-c695-41ac-bf57-3a9e350158f0.png",
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
    title: "Koija Cultural Village, traditions of Northern Kenya",
    id: "exp-koija-cultural-village",
    slug: P("Koija Cultural Village"),
    partner: "Koija Community",
    destination: "samburu",
    themes: ["Community & cultural exploration"],
    activities: ["village", "culture", "community"],
    images: ["/lovable-uploads/08763604-1a22-4da5-a8a1-4daf65cb4b32.png", "/lovable-uploads/3a4d487a-fe3a-40ce-aa28-18adf4191e69.png", "/lovable-uploads/396bdd72-dc8d-4727-8fd8-e73dba015ec2.png", "/lovable-uploads/cc847573-d3b5-4aa6-8d5c-26b81ce2b693.png", "/lovable-uploads/a4b8d107-90cf-4f50-9401-95350c393f65.png", "/lovable-uploads/c6c43dc7-52c0-4f45-baf7-4093fc59cf98.png"],
    heroImage: "/lovable-uploads/08763604-1a22-4da5-a8a1-4daf65cb4b32.png",
    gallery: ["/lovable-uploads/08763604-1a22-4da5-a8a1-4daf65cb4b32.png", "/lovable-uploads/3a4d487a-fe3a-40ce-aa28-18adf4191e69.png", "/lovable-uploads/396bdd72-dc8d-4727-8fd8-e73dba015ec2.png", "/lovable-uploads/cc847573-d3b5-4aa6-8d5c-26b81ce2b693.png", "/lovable-uploads/a4b8d107-90cf-4f50-9401-95350c393f65.png", "/lovable-uploads/c6c43dc7-52c0-4f45-baf7-4093fc59cf98.png"],
    description: `Overview
Immerse yourself in community-led cultural experiences—hands-on activities, storytelling, and festivals that sustain heritage and support livelihoods.

Highlights
• Authentic cultural exchange
• Community-run stays and local guides
• Educational tours on history and stewardship

Included/Excluded
• Included: A friendly, professional guide
• Excluded: Personal expenses; insurance; drinks and meals; additional services not mentioned

What to Expect (Itinerary & Cancellation)
• Village Visits: Daily life, customs, traditions
• Festivals: Join events like Tobong'u Lore (if dates align)
• Learning: Indigenous history and environmental practices
• Cancellation: Use listing policy

Duration
2 hours (fallback)

Language
English

Frequently Asked Questions
• Family-friendly? Yes.
• Community benefit? Proceeds support local development and preservation.

Where You'll Be
https://maps.app.goo.gl/VzMtfuRWv9rbpWt76`,
    priceKESAdult: 2000,
    childHalfPriceRule: false,
    durationHours: 2,
    visibleOnMarketplace: true,
    locationText: "Samburu County, Kenya",
    partnerSlug: "koija-community",
    sourceUrl: "https://natuasili.com/st_tour/koija-cultural-village/",
    googleMapsUrl: "https://maps.app.goo.gl/VzMtfuRWv9rbpWt76",
  },
  {
    title: "On-foot rhino experience at Sera Conservancy",
    id: "exp-sera-rhino-tracking",
    slug: P("Sera On-Foot Rhino Tracking"),
    partner: "Sera Conservancy",
    destination: "samburu",
    themes: ["Wildlife conservation"],
    activities: ["rhino", "tracking", "walking"],
    images: ["/lovable-uploads/73526904-0f02-4d36-9590-456e0dd5628a.png", "/lovable-uploads/dc2fa3f6-3095-4f03-9f50-d78d7cceba81.png", "/lovable-uploads/ffc54bd4-ba6d-45be-8795-340f600c6ba3.png"],
    heroImage: "/lovable-uploads/73526904-0f02-4d36-9590-456e0dd5628a.png",
    gallery: ["/lovable-uploads/73526904-0f02-4d36-9590-456e0dd5628a.png", "/lovable-uploads/dc2fa3f6-3095-4f03-9f50-d78d7cceba81.png", "/lovable-uploads/ffc54bd4-ba6d-45be-8795-340f600c6ba3.png"],
    description: `Overview
Embark on a unique, community-led adventure at the Sera Rhino Sanctuary in Samburu, the first and only community-managed black rhino sanctuary in East Africa—and the only place in Northern Kenya where visitors can track both black and white rhinos on foot. Established in 2015 after a 30-year absence caused by poaching, Sera reintroduced black rhinos and, in 2024, expanded conservation efforts by introducing southern white rhinos. Guided by expert Samburu trackers and armed rangers, explore 26,000 acres of wilderness—home to the "Samburu Special Five": reticulated giraffe, Grevy's zebra, Beisa oryx, Somali ostrich, and gerenuk—and engage meaningfully with local communities safeguarding wildlife.

Highlights
• Track rhinos on foot with Samburu guides and armed rangers using traditional methods.
• Learn how community stewardship drives wildlife protection and sustainable livelihoods.
• Spot iconic species including reticulated giraffe, Grevy's zebra, Somali ostrich, Beisa oryx, and gerenuk.

Included/Excluded
• Included: A friendly, professional guide
• Excluded: Personal expenses; insurance; drinks and meals; additional services not mentioned

What to Expect (Itinerary & Cancellation)
• Briefing: Safety protocols, sanctuary history, and conservation impact
• Tracking: Follow signs to locate rhinos; observe from a safe, intimate distance
• Wildlife: Optional game viewing; chance to see Grevy's zebra, reticulated giraffe, Beisa oryx
• Cancellation: Full refund up to 48 hours before start (use listing policy if present)

Duration
2 hours (fallback)

Language
English

Frequently Asked Questions
• Do I need prior experience? No—experienced trackers and rangers guide the entire walk.
• How does my visit help? Revenue supports rhino protection, ranger patrols, and community programs.
• Is it safe? Yes—walks are led by trained, armed rangers under strict protocols.

Where You'll Be
https://www.google.com/maps/search/?api=1&query=95W5%2BQGR%2C%20Dol%20Dol%2C%20Kenya`,
    priceKESAdult: 4000,
    childHalfPriceRule: false,
    durationHours: 2,
    visibleOnMarketplace: true,
    locationText: "Sera Conservancy, Samburu",
    partnerSlug: "sera-conservancy",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=95W5%2BQGR%2C%20Dol%20Dol%2C%20Kenya",
  },
  {
    title: "Ruko giraffe encounter; rare Rothschild's in the wild",
    id: "exp-ruko-giraffe",
    slug: P("Giraffe at Ruko Sanctuary"),
    partner: "Ruko Community Conservancy",
    destination: "samburu",
    themes: ["Wildlife conservation"],
    activities: ["giraffe", "sanctuary"],
    images: ["/lovable-uploads/21799448-fabe-49a5-b8b2-3fd811cc804c.png", "/lovable-uploads/235266ed-14bb-4381-9304-a9f8e2934776.png", "/lovable-uploads/34b44d9c-3c11-44ee-9f21-bbf1e8c51a5c.png", "/lovable-uploads/d41fd5bc-a9e9-44de-a975-dc5ae1f2eb29.png"],
    heroImage: "/lovable-uploads/21799448-fabe-49a5-b8b2-3fd811cc804c.png",
    gallery: ["/lovable-uploads/21799448-fabe-49a5-b8b2-3fd811cc804c.png", "/lovable-uploads/235266ed-14bb-4381-9304-a9f8e2934776.png", "/lovable-uploads/34b44d9c-3c11-44ee-9f21-bbf1e8c51a5c.png", "/lovable-uploads/d41fd5bc-a9e9-44de-a975-dc5ae1f2eb29.png"],
    description: `Overview
On Lake Baringo's eastern shores, the Ruko Giraffe Sanctuary unites the Il Chamus and Pokot communities in a powerful conservation effort. In 2020, nine stranded Rothschild's giraffes were rescued from a flooded island via a custom-built barge and relocated to the mainland sanctuary. The population has since flourished, with successful breeding and future reintroduction plans.

Highlights
• Guided sanctuary tour with insights into behavior, conservation, and history
• Potential sightings of other regional wildlife
• Community engagement and cultural learning

Included/Excluded
• Included: A friendly, professional guide
• Excluded: Personal expenses; insurance; drinks and meals; additional services not mentioned

What to Expect (Itinerary & Cancellation)
• Orientation: Sanctuary history and conservation briefing
• Nature Walk: Observe Rothschild's giraffes; learn about rescue and rewilding
• Community Interaction: Engage with local representatives
• Cancellation: Full refund up to 48 hours before start (use listing policy if present)

Duration
2 hours (fallback)

Language
English

Frequently Asked Questions
• How do I visit? Book via a local operator or the sanctuary; confirm access in rainy seasons.
• How does my visit help? Tourism revenue funds operations and community projects.

Where You'll Be
https://www.google.com/maps/search/?api=1&query=J4RF%2BP9M%2C%20Nosuguro%2C%20Kenya`,
    priceKESAdult: 2000,
    childHalfPriceRule: false,
    durationHours: 2,
    visibleOnMarketplace: true,
    locationText: "Ruko Conservancy, Samburu",
    partnerSlug: "ruko-community-conservancy",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=J4RF%2BP9M%2C%20Nosuguro%2C%20Kenya",
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
    description: `Overview
Colobus Conservation protects primates through habitat protection, education, rescue, and rehabilitation. This guided eco-tour offers Kenya's only habituated-troop primate experience.

Highlights
• Guided nature walk
• Possible sightings: colobus, vervet, Sykes', baboons
• Learn about research and protection work

Included/Excluded
• Included: A friendly, professional guide
• Excluded: Personal expenses; insurance; drinks and meals; additional services not mentioned

What to Expect (Itinerary & Cancellation)
• Trail Walk: With a guide; observe a habituated troop
• Info Session: Centre talk on programs and impact
• Cancellation: Full refund up to 24 hours before start (use listing policy if present)

Duration
1 hour (fallback)

Language
English

Frequently Asked Questions
• Hours: Monday–Saturday, 8:30 AM–4:00 PM (closed Sundays).
• For children? Yes—great for families.

Where You'll Be
https://www.google.com/maps/search/?api=1&query=MH47%2B6WQ%2C%20Diani%20Beach%2C%20Kenya`,
    priceKESAdult: 1500,
    childHalfPriceRule: false,
    durationHours: 1,
    visibleOnMarketplace: true,
    locationText: "Coastal Kenya",
    partnerSlug: "colobus-conservation",
    sourceUrl: "https://natuasili.com/st_tour/colobus-conservation-guided-eco-tours/",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=MH47%2B6WQ%2C%20Diani%20Beach%2C%20Kenya",
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
    description: `Overview
LOC focuses on sea turtles and marine habitat protection. This educational day trip inspires ocean stewardship.

Highlights
• Sea turtle biology and threats
• Rehabilitation and protection work
• Marine ecosystem education

Included/Excluded
• Included: A friendly, professional guide
• Excluded: Personal expenses; insurance; drinks and meals; additional services not mentioned

What to Expect (Itinerary & Cancellation)
• Tour: Guided talks on turtles and the marine ecosystem
• Support: Optional donations welcome
• Cancellation: Full refund up to 48 hours before start (use listing policy if present)

Duration
~2 hours; tours hourly (fallback)

Language
English

Frequently Asked Questions
• For children? Yes—great for families.
• Will I see turtles? Not guaranteed; rehabilitation aims for quick release.

Important Information
Closed Saturday afternoon, Sundays, and Public Holidays.

Where You'll Be
https://www.google.com/maps/search/?api=1&query=JXFP%2BM4%2C%20Watamu%2C%20Kenya`,
    priceKESAdult: 1000,
    childHalfPriceRule: false,
    durationHours: 2,
    timings: ["Mon 14:00-15:00", "Mon 15:00-16:00", "Tue-Fri 09:00-10:00", "Tue-Fri 10:00-11:00", "Tue-Fri 11:00-12:00", "Tue-Fri 14:00-15:00", "Tue-Fri 15:00-16:00", "Sat 09:00-10:00", "Sat 10:00-11:00", "Sat 11:00-12:00"],
    visibleOnMarketplace: true,
    locationText: "Watamu, Coastal Kenya",
    partnerSlug: "local-ocean-watamu",
    sourceUrl: "https://natuasili.com/st_tour/ocean-conservation-day-watamu/",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=JXFP%2BM4%2C%20Watamu%2C%20Kenya",
  },
  {
    title: "Dive into coral conservation with REEFolution",
    id: "exp-reefolution-coral",
    slug: P("Dive into coral conservation with REEFolution"),
    partner: "Reefolution",
    destination: "coastal-kenya",
    themes: ["Wildlife conservation"],
    activities: ["diving", "coral", "conservation"],
    images: ["/lovable-uploads/d4888a5b-c6ad-4983-8c53-e2364f663bd4.png", "/lovable-uploads/8236db6a-4c2e-4c06-864a-bfcdd270ad52.png", "/lovable-uploads/f39fee39-a385-4e10-a818-084c4d1811fd.png", "/lovable-uploads/3247620c-45d9-4bf0-ad1c-677d2a49f122.png", "/lovable-uploads/55949b1a-fc87-4134-896a-da6c9c730a99.png"],
    heroImage: "/lovable-uploads/d4888a5b-c6ad-4983-8c53-e2364f663bd4.png",
    gallery: ["/lovable-uploads/d4888a5b-c6ad-4983-8c53-e2364f663bd4.png", "/lovable-uploads/8236db6a-4c2e-4c06-864a-bfcdd270ad52.png", "/lovable-uploads/f39fee39-a385-4e10-a818-084c4d1811fd.png", "/lovable-uploads/3247620c-45d9-4bf0-ad1c-677d2a49f122.png", "/lovable-uploads/55949b1a-fc87-4134-896a-da6c9c730a99.png"],
    description: `Overview
Africa's leading coral restoration project offers education, science, and hands-on activities to empower ocean stewards.

Highlights
• REEFolution's story and impact
• Interactive workshop
• Restoration techniques (nurseries, out-planting)

Included/Excluded
• Included: A friendly, professional guide
• Excluded: Personal expenses; insurance; drinks and meals; additional services not mentioned

What to Expect (Itinerary & Cancellation)
• Centre Visit: Workshop with scientists
• Learn: Coral ecology, threats, restoration methods
• Cancellation: Full refund up to 48 hours before start (use listing policy if present)

Duration
Half- or full-day (fallback by program)

Language
English

Frequently Asked Questions
• Programs: Land-based; Snorkel & Learn; Dive & Restore (certified divers).
• Contribute? Donations and, in some programs, coral planting.

Where You'll Be
https://www.google.com/maps/search/?api=1&query=PH6P%2BRRR%2C%20Ukunda%2C%20Diani%20Beach%20Road%2C%20Diani%20Beach%2C%20Kenya`,
    priceKESAdult: 4500,
    childHalfPriceRule: true,
    durationHours: 2,
    visibleOnMarketplace: true,
    locationText: "Coastal Kenya, Diani Beach",
    partnerSlug: "reefolution",
    sourceUrl: "https://natuasili.com/st_tour/dive-into-coral-conservation-with-reefolution/",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=PH6P%2BRRR%2C%20Ukunda%2C%20Diani%20Beach%20Road%2C%20Diani%20Beach%2C%20Kenya",
  },
  {
    title: "Tree Walk: Discover Kenya's forest heritage",
    id: "exp-tree-walk-heritage",
    slug: P("Tree Walk Kenya Forest Heritage"),
    partner: "Kenya Forest Heritage",
    destination: "nairobi",
    themes: ["Conservation education"],
    activities: ["forest", "walk", "trees"],
    images: ["/lovable-uploads/f0dcab56-c695-41ac-bf57-3a9e350158f0.png", "/lovable-uploads/7ecd7176-f5b7-48b1-ae30-b697e0501c03.png", "/lovable-uploads/caa3fd6e-7c09-4774-91b1-9f5c0d61c57f.png", "/lovable-uploads/5dff9e8b-0607-44a7-88c3-525c96ba6fd4.png", "/lovable-uploads/4125d657-63a3-40bd-9a41-21d7bd0c3129.png"],
    heroImage: "/lovable-uploads/f0dcab56-c695-41ac-bf57-3a9e350158f0.png",
    gallery: ["/lovable-uploads/f0dcab56-c695-41ac-bf57-3a9e350158f0.png", "/lovable-uploads/7ecd7176-f5b7-48b1-ae30-b697e0501c03.png", "/lovable-uploads/caa3fd6e-7c09-4774-91b1-9f5c0d61c57f.png", "/lovable-uploads/5dff9e8b-0607-44a7-88c3-525c96ba6fd4.png", "/lovable-uploads/4125d657-63a3-40bd-9a41-21d7bd0c3129.png"],
    description: `Overview
Join Nature Kenya's Plant Committee for guided walks through forests, gardens, and urban green spaces. Learn to identify indigenous and exotic species and understand trees' role in conservation and climate resilience.

Highlights
• Discover Kenya's tree heritage
• Learn about reforestation and sustainable land use
• Expert-led nature immersion

Included/Excluded
• Included: A friendly, professional guide
• Excluded: Personal expenses; insurance; drinks and meals; additional services not mentioned

What to Expect (Itinerary & Cancellation)
• Start: 8:30 AM welcome and briefing
• Walk: Identification, ecology, and conservation themes
• Interactive: Practical insights into planting and care
• Cancellation: Full refund up to 48 hours before start (use listing policy if present)

Duration
2 hours (fallback)

Language
English

Frequently Asked Questions
• What to bring? Walking shoes, hat, sunscreen, water; optional notebook/field guide.
• How often? Monthly, at rotating locations.

Where You'll Be
https://www.google.com/maps/search/?api=1&query=PRG7%2BCQ%2C%20Nairobi%2C%20Kenya`,
    priceKESAdult: 500,
    childHalfPriceRule: false,
    durationHours: 2,
    visibleOnMarketplace: true,
    locationText: "Nairobi and surroundings",
    partnerSlug: "kenya-forest-heritage",
    sourceUrl: "https://natuasili.com/st_tour/tree-walk-kenya-forest-heritage/",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=PRG7%2BCQ%2C%20Nairobi%2C%20Kenya",
  },
  {
    title: "Dudu walk: Explore the world of insects with Nature Kenya",
    id: "exp-dudu-walk",
    slug: P("Dudu Walk Insect Exploration"),
    partner: "Nature Kenya",
    destination: "nairobi",
    themes: ["Conservation education"],
    activities: ["insects", "education"],
    images: ["/lovable-uploads/755bb09b-50ae-4b81-8ee4-ed16c5874e40.png", "/lovable-uploads/b8fd9d98-7dde-4ace-93a4-7f45b5858549.png", "/lovable-uploads/466be868-0698-4cd5-a6b8-0cee85fb22cf.png", "/lovable-uploads/536eb7bc-8b3e-4790-8bcc-86223f5a585f.png"],
    heroImage: "/lovable-uploads/755bb09b-50ae-4b81-8ee4-ed16c5874e40.png",
    gallery: ["/lovable-uploads/755bb09b-50ae-4b81-8ee4-ed16c5874e40.png", "/lovable-uploads/b8fd9d98-7dde-4ace-93a4-7f45b5858549.png", "/lovable-uploads/466be868-0698-4cd5-a6b8-0cee85fb22cf.png", "/lovable-uploads/536eb7bc-8b3e-4790-8bcc-86223f5a585f.png"],
    description: `Overview
A hands-on exploration of insects' roles in pollination, decomposition, and biodiversity—ideal for beginners and families.

Highlights
• Field identification and observation
• Interactive tools (nets, magnifiers)
• Conservation discussions

Included/Excluded
• Included: A friendly, professional guide
• Excluded: Personal expenses; insurance; drinks and meals; additional services not mentioned

What to Expect (Itinerary & Cancellation)
• Intro: Safety and overview
• Walk: Observe butterflies, dragonflies, beetles, ants, and more
• Learn: Insects' ecological roles and minimal-disturbance ethics
• Cancellation: Full refund up to 48 hours before start (use listing policy if present)

Duration
2 hours (fallback)

Language
English

Frequently Asked Questions
• Beginner-friendly? Yes.
• For children? Yes—great for all ages.

Where You'll Be
https://www.google.com/maps/search/?api=1&query=PRG7%2BCQ%2C%20Nairobi%2C%20Kenya`,
    priceKESAdult: 500,
    childHalfPriceRule: false,
    durationHours: 2,
    visibleOnMarketplace: true,
    locationText: "Nairobi",
    partnerSlug: "nature-kenya",
    sourceUrl: "https://natuasili.com/st_tour/dudu-walk-insect-exploration/",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=PRG7%2BCQ%2C%20Nairobi%2C%20Kenya",
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
    description: `Overview: The African Fund for Endangered Wildlife (AFEW) is a non-profit dedicated to the breeding and preservation of the threatened Rothschild giraffe; it is situated just outside Nairobi National Park. It presents the Giraffe Center experience, which is the main tourist attraction. Here, you will learn about these amazing animals by visiting on a guided tour or self-guided walk; you can even hand-feed them from a raised platform!

Highlights:
• Learn about the East African native vulnerable species called the Rothschild giraffe.
• From a dedicated viewing deck, observe giraffes up close and even feed them.
• Learn about AFEW's giraffe breeding program and efforts at conservation.

Included/Excluded:
• A friendly professional guide
• Personal expenses
• Insurance
• Drinks and meals
• Additional Services not mentioned

What to expect - Meet the giraffes:
• Arrive at the Giraffe Centre and proceed to the giraffe feeding platform.
• Observe and interact with the Rothschild giraffes, learning about their unique characteristics and ecological importance.
• Take photos while feeding the giraffes pellets from a raised platform.
• Browse the gift shop for educational souvenirs (optional).

Cancellation policy: Cancel up to 24 hours in advance to receive a full refund. Cancellations made less than 24 hours before the tour start are non-refundable.

Duration: 0 - 2 hours
Languages: English
Location: Giraffe Centre, Duma Road, Nairobi, Kenya

The centre is open from 9:00 AM to 5:00 PM every day including weekends and all public holidays. 90 percent of funds collected from the entrance fees and sales in our gift shop and Tea House go towards conservation work. By visiting and/or making a purchase from the souvenir shop and the Teahouse, you contribute towards educating school children and teachers across Kenya.

Where you'll be
JPFV+FP Nairobi`,
    priceKESAdult: 1500,
    childHalfPriceRule: true,
    durationHours: 1,
    visibleOnMarketplace: true,
    locationText: "Nairobi",
    partnerSlug: "afew-giraffe-centre",
    sourceUrl: "https://natuasili.com/st_tour/nairobi-giraffe-centre-afew/",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=JPFV%2BFP%2C%20Nairobi%2C%20Kenya",
  },
  {
    title: "Community-led elephant experience at Reteti",
    id: "exp-reteti-elephant",
    slug: P("Reteti Community Elephant Experience"),
    partner: "Reteti Elephant Sanctuary",
    destination: "samburu",
    themes: ["Wildlife conservation"],
    activities: ["elephant", "rehabilitation"],
    images: [retetiMainImg, retetiFeedingImg, retetiCareOutdoorImg, retetiCareFacilityImg, retetiHerdImg, retetiBottleFeedingImg],
    heroImage: retetiMainImg,
    gallery: [retetiMainImg, retetiFeedingImg, retetiCareOutdoorImg, retetiCareFacilityImg, retetiHerdImg, retetiBottleFeedingImg],
    description: `Overview
The Reteti Elephant Sanctuary is a groundbreaking elephant sanctuary situated in the Namunyak Wildlife Conservancy in Northern Kenya. Particularly, it is the first community-owned and run elephant sanctuary in Africa, totally committed to rescuing abandoned and orphaned elephant calves. Their aim is to rehabilitate and reintroduce these young elephants back into wild herds close by Reteti. Through educational tours supporting the goal of the sanctuary, visitors can learn more about the challenges that elephants face and help to further their mission.

Highlights
• Participate in an educational tour guided by informed keepers of Reteti and discover their vital efforts in elephant protection.
• Learn about the challenges that elephants experience as well as the dangers to their population.
• From a dedicated viewing platform, observe the rescued elephants' feeding schedule and mud hole playfulness.

Included/Excluded
• A friendly professional guide
• Personal expenses
• Insurance
• Drinks and meals
• Additional Services not mentioned

What to expect
Go Behind the Scenes: Elephant Care Unveiled
o Arrive at the Reteti Elephant Sanctuary and join an educational tour led by Reteti's keepers, where you'll learn about their elephant rescue and rehabilitation mission.
o Observe the rescued elephants from a dedicated viewing platform, where you can witness feeding time and mud hole playtime.
o Take part in a behind-the-scenes tour of the sanctuary to gain a deeper understanding of Reteti's exceptional elephant care.

Cancellation policy
o You can cancel and get a full refund if you do it at least 7 days before the experience starts. If you book more than 72 hours before the start time, you can also cancel within 48 hours of booking for a full refund.

Durations
0 - 2 hours

Languages
English

Frequently asked questions
What can I expect on a typical visit?
Tours typically include an educational talk, observation time at the viewing platform, and a behind-the-scenes look at the sanctuary's operations. 

Is it possible to touch and interact with the elephants?
No, for the well-being of the elephants, visitors are not allowed to interact with them directly. However, you will get to observe them from a safe distance. Reteti's mission is to rescue, rewild and release the elephants, and to prepare them for their release. The keepers are the ones only allowed to interact with the elephants in order to minimise human interaction.

Is this a good activity for children?
Absolutely! Learning about elephants and witnessing their heartwarming behaviors is a great experience for all ages.

How can I help Reteti's conservation efforts?
In addition to booking a tour, consider making a donation to the sanctuary or purchasing handmade crafts from their gift shop, which directly supports the sanctuary and the local community.

What should I wear?
Please wear dark green if possible, otherwise shades of brown or khaki. 

Important information
The duration of the experience can vary, but tours typically last around 1.5 hours. Reteti has 4 time slots for visits that coincide with the elephants' feeding times.
The Sunrise Feed
Sarara & Reteti House guests only
5.30 am - 7.00 am (feeding is at 6.00 am)
The Morning Feed
Exclusive Group only
8.30 am - 10.00 am (feeding is at 9.00 am)
Other visitors are welcome when no exclusive group booked.
The Midday Feed
Public viewing
11.30 am - 13.00 pm (feeding is at 12.00 pm)
No more than 3 groups. Max 15 - 20 people.
The Evening Feed
Sarara & Reteti House guests only
17.30 pm - 19.00 pm (feeding is at 18.00 pm)

Where you'll be
4F76+V3 Sereolipi`,
    priceKESAdult: 3000,
    childHalfPriceRule: false,
    durationHours: 2,
    timings: ["5:30-7:00 AM (Sunrise)", "8:30-10:00 AM (Morning)", "11:30-13:00 PM (Midday)", "17:30-19:00 PM (Evening)"],
    visibleOnMarketplace: true,
    locationText: "Samburu County, Kenya",
    partnerSlug: "reteti-elephant-sanctuary",
    sourceUrl: "https://natuasili.com/st_tour/reteti-community-elephant-experience/",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=4F76%2BV3%2C%20Sereolipi%2C%20Kenya",
  },
  {
    title: "Meet the last northern white rhinos at Ol Pejeta Conservancy",
    id: "exp-northern-white-rhinos-ol-pejeta",
    slug: P("Meet Northern White Rhinos Ol Pejeta"),
    partner: "Ol Pejeta Conservancy", 
    destination: "laikipia",
    themes: ["Wildlife conservation"],
    activities: ["rhino", "wildlife", "conservation"],
    images: [northernWhiteRhinos, olPejeteRhino, olPejetaImg],
    heroImage: northernWhiteRhinos,
    gallery: [northernWhiteRhinos, olPejeteRhino, olPejetaImg],
    description: `Overview
At Ol Pejeta Conservancy, witness one of conservation's most critical moments by meeting the last two northern white rhinos on Earth - Najin and Fatu, both female. This experience offers an intimate look at cutting-edge conservation science as researchers work tirelessly to save this subspecies through advanced reproductive technology.

Your visit directly supports the revolutionary conservation efforts using IVF, genetic rescue, and surrogate motherhood programs. Learn about the challenges facing these magnificent creatures and the groundbreaking science being used to prevent their extinction.

Highlights
• Meet Najin and Fatu, the last two northern white rhinos in the world
• Learn about innovative reproductive technologies being used for species recovery
• Understand the broader conservation challenges facing rhino populations
• Support critical research and protection efforts through your visit

Included/Excluded
• Conservancy entry fees
• Professional wildlife guide
• Educational materials
• Personal expenses
• Insurance
• Transport to conservancy

What to expect
A Unique Conservation Experience
o Arrive at Ol Pejeta Conservancy's northern white rhino enclosure
o Meet the dedicated veterinary and conservation team
o Observe Najin and Fatu in their protected environment
o Learn about the advanced reproductive technologies being employed
o Understand the global significance of this conservation effort

Cancellation policy
o You can cancel up to 48 hours before the experience starts for a full refund.

Duration
2-3 hours

Languages
English

Where you'll be
Ol Pejeta Conservancy, Laikipia County`,
    priceKESAdult: 9075,
    priceKESChild: 4538,
    childHalfPriceRule: false,
    visibleOnMarketplace: true,
    locationText: "Ol Pejeta Conservancy, Laikipia",
    partnerSlug: "ol-pejeta-conservancy",
    sourceUrl: "https://natuasili.com/st_tour/northern-white-rhinos-ol-pejeta/",
  },
  {
    title: "Night game drive at Ol Pejeta Conservancy",
    id: "exp-night-game-drive-ol-pejeta",
    slug: P("Night Game Drive Ol Pejeta"),
    partner: "Ol Pejeta Conservancy", 
    destination: "laikipia",
    themes: ["Wildlife conservation"],
    activities: ["night safari", "wildlife", "nocturnal"],
    images: [nightGameDrive, bigFiveTracking, olPejetaImg],
    heroImage: nightGameDrive,
    gallery: [nightGameDrive, bigFiveTracking, olPejetaImg, "/lovable-uploads/6f27540c-f10d-45f9-ab14-bf5b08197366.png"],
    description: `Overview
Experience the African wilderness after dark on this thrilling night game drive at Ol Pejeta Conservancy. As the sun sets over the Laikipia plateau, a different world awakens. Nocturnal animals emerge from their daytime hiding places, offering visitors a unique perspective on wildlife behavior and ecosystem dynamics.

Using specialized spotlights and expert guidance, you'll search for elusive nocturnal species including leopards, serval cats, genets, bush babies, and hyenas. The conservancy's diverse habitats support an incredible variety of nighttime wildlife, making every drive a unique adventure.

Highlights
• Search for elusive nocturnal predators like leopards and serval cats
• Observe the unique behaviors of animals active after dark
• Experience the sounds and atmosphere of the African night
• Learn about nocturnal ecosystem dynamics from expert guides

Included/Excluded
• Professional night guide with spotlight equipment
• Conservancy night drive permits
• Safety briefing and equipment
• Personal expenses
• Insurance
• Transport to conservancy

What to expect
Into the African Night
o Depart from the conservancy at sunset for optimal wildlife viewing
o Use spotlights to locate nocturnal animals and observe their behaviors
o Listen to the symphony of night sounds across the savanna
o Learn about predator-prey relationships and nocturnal adaptations
o Return under the starlit African sky

Cancellation policy
o You can cancel up to 48 hours before the experience starts for a full refund.

Duration
3-4 hours

Languages
English

Important Notes
o Warm clothing recommended as temperatures drop after sunset
o Flash photography not permitted to avoid disturbing wildlife

Where you'll be
Ol Pejeta Conservancy, Laikipia County`,
    priceKESAdult: 9075,
    priceKESChild: 4538,
    childHalfPriceRule: false,
    visibleOnMarketplace: true,
    locationText: "Ol Pejeta Conservancy, Laikipia",
    partnerSlug: "ol-pejeta-conservancy",
    sourceUrl: "https://natuasili.com/st_tour/night-game-drive-ol-pejeta/",
  },
  {
    title: "Guided bush and bird walks at Ol Pejeta Conservancy",
    id: "exp-bush-bird-walks-ol-pejeta",
    slug: P("Bush Bird Walks Ol Pejeta"),
    partner: "Ol Pejeta Conservancy", 
    destination: "laikipia",
    themes: ["Conservation education"],
    activities: ["walking", "birds", "nature"],
    images: ["/lovable-uploads/6f27540c-f10d-45f9-ab14-bf5b08197366.png", natureKenyaBirdwatching, olPejetaImg],
    heroImage: "/lovable-uploads/6f27540c-f10d-45f9-ab14-bf5b08197366.png",
    gallery: ["/lovable-uploads/6f27540c-f10d-45f9-ab14-bf5b08197366.png", natureKenyaBirdwatching, olPejetaImg],
    description: `Overview
Explore Ol Pejeta Conservancy on foot with expert guides who will introduce you to the intricate ecosystems of the Laikipia plateau. These walking safaris offer an intimate connection with nature, allowing you to experience wildlife and landscapes from a completely different perspective than traditional game drives.

The conservancy's diverse habitats - from riverine forests to open grasslands - support over 300 bird species and countless smaller wildlife often missed from vehicles. Your experienced guide will help you identify tracks, interpret animal behavior, and understand the complex relationships that make this ecosystem thrive.

Highlights
• Experience wildlife on foot with expert naturalist guides
• Identify diverse bird species across different habitats
• Learn to read animal tracks and signs in the wild
• Gain intimate knowledge of ecosystem relationships and plant life

Included/Excluded
• Expert walking guide and naturalist
• Bird identification materials
• Safety briefing and radio communication
• Personal expenses
• Insurance
• Transport to conservancy

What to expect
Walking Safari Adventure
o Begin with a comprehensive safety briefing about walking in wildlife areas
o Set out on guided walks through diverse conservancy habitats
o Learn to identify bird calls, animal tracks, and botanical specimens
o Discover the smaller details of the ecosystem often missed on game drives
o End with discussions about conservation challenges and successes

Cancellation policy
o You can cancel up to 48 hours before the experience starts for a full refund.

Duration
2-3 hours

Languages
English

Important Notes
o Comfortable walking shoes and sun protection essential
o Walks adapted to participant fitness levels
o Minimum age 12 years for safety reasons

Where you'll be
Ol Pejeta Conservancy, Laikipia County`,
    priceKESAdult: 9075,
    priceKESChild: 4538,
    childHalfPriceRule: false,
    visibleOnMarketplace: true,
    locationText: "Ol Pejeta Conservancy, Laikipia",
    partnerSlug: "ol-pejeta-conservancy",
    sourceUrl: "https://natuasili.com/st_tour/bush-bird-walks-ol-pejeta/",
  },
  {
    title: "Behind the scenes – Ol Pejeta Sweetwaters Chimpanzee Sanctuary",
    id: "exp-chimpanzee-sanctuary-ol-pejeta",
    slug: P("Chimpanzee Sanctuary Ol Pejeta"),
    partner: "Ol Pejeta Conservancy", 
    destination: "laikipia",
    themes: ["Wildlife conservation"],
    activities: ["chimpanzee", "sanctuary", "primates"],
    images: [chimpanzeeSanctuary, olPejetaImg, "/lovable-uploads/6f27540c-f10d-45f9-ab14-bf5b08197366.png"],
    heroImage: chimpanzeeSanctuary,
    gallery: [chimpanzeeSanctuary, olPejetaImg, "/lovable-uploads/6f27540c-f10d-45f9-ab14-bf5b08197366.png"],
    description: `Overview
Visit the Sweetwaters Chimpanzee Sanctuary, the only chimpanzee sanctuary in Kenya and a haven for rescued and orphaned chimpanzees. This unique facility within Ol Pejeta Conservancy provides a safe home for chimpanzees that cannot be returned to the wild, while offering visitors insights into primate behavior, conservation, and the challenges facing our closest living relatives.

The sanctuary houses chimpanzees rescued from the bushmeat and pet trades, along with those orphaned by habitat destruction. Through this behind-the-scenes experience, you'll learn about chimpanzee intelligence, social structures, and the dedicated care required to maintain their wellbeing in a protected environment.

Highlights
• Observe rescued chimpanzees in naturalistic island habitats
• Learn about chimpanzee intelligence, behavior, and social dynamics
• Understand the challenges facing wild chimpanzee populations
• Meet the dedicated caregivers and veterinary team
• Support vital primate conservation and rescue efforts

Included/Excluded
• Sanctuary entry and guided tour
• Educational materials about chimpanzee conservation
• Access to viewing platforms and observation areas
• Personal expenses
• Insurance
• Transport to conservancy

What to expect
Chimpanzee Conservation Up Close
o Arrive at the Sweetwaters Chimpanzee Sanctuary within Ol Pejeta
o Meet sanctuary staff and learn about the facility's history and mission
o Observe chimpanzees from designated viewing areas and platforms
o Learn about individual chimpanzee stories and rehabilitation journeys
o Understand broader conservation challenges facing wild populations

Cancellation policy
o You can cancel up to 48 hours before the experience starts for a full refund.

Duration
1.5-2 hours

Languages
English

Important Notes
o No direct contact with chimpanzees for safety and health reasons
o Photography allowed from designated viewing areas only
o Educational focus on conservation and animal welfare

Where you'll be
Sweetwaters Chimpanzee Sanctuary, Ol Pejeta Conservancy`,
    priceKESAdult: 9075,
    priceKESChild: 4538,
    childHalfPriceRule: false,
    visibleOnMarketplace: true,
    locationText: "Ol Pejeta Conservancy, Laikipia",
    partnerSlug: "ol-pejeta-conservancy",
    sourceUrl: "https://natuasili.com/st_tour/chimpanzee-sanctuary-ol-pejeta/",
  },
  {
    title: "Track lions and aid conservation at Ol Pejeta Conservancy",
    id: "exp-lion-tracking-ol-pejeta",
    slug: P("Lion Tracking Conservation Ol Pejeta"),
    partner: "Ol Pejeta Conservancy", 
    destination: "laikipia",
    themes: ["Wildlife conservation"],
    activities: ["lions", "tracking", "research"],
    images: [lionTracking, bigFiveTracking, olPejetaImg],
    heroImage: lionTracking,
    gallery: [lionTracking, bigFiveTracking, olPejetaImg, "/lovable-uploads/6f27540c-f10d-45f9-ab14-bf5b08197366.png"],
    description: `Overview
Join Ol Pejeta's lion research team in active conservation work by participating in lion tracking and monitoring activities. This hands-on experience puts you at the forefront of predator conservation, using radio telemetry and field observation techniques to collect vital data about the conservancy's lion population.

Ol Pejeta is home to one of Kenya's most important lion populations, and your participation directly contributes to ongoing research on lion behavior, territory usage, and human-wildlife conflict mitigation. This is real conservation work that makes a tangible difference to lion survival in East Africa.

Highlights
• Use professional radio telemetry equipment to track collared lions
• Learn field research techniques from experienced wildlife biologists
• Contribute to vital data collection for lion conservation science
• Understand human-wildlife conflict and mitigation strategies
• Experience hands-on conservation work with measurable impact

Included/Excluded
• Professional research guide and equipment
• Radio telemetry training and usage
• Data collection materials and protocols
• Research vehicle and fuel
• Personal expenses
• Insurance
• Transport to conservancy

What to expect
Active Conservation Research
o Begin with briefing on lion ecology and research methodology
o Learn to use radio telemetry equipment to locate collared lions
o Track lions using GPS coordinates and behavioral observation
o Record data on lion movement, behavior, and pride dynamics
o Contribute findings to ongoing conservation database

Cancellation policy
o You can cancel up to 48 hours before the experience starts for a full refund.

Duration
4-5 hours

Languages
English

Important Notes
o Physical fitness required for field work conditions
o Weather-dependent activity - may be rescheduled for safety
o Minimum age 16 years due to research protocol requirements

Where you'll be
Ol Pejeta Conservancy, Laikipia County`,
    priceKESAdult: 9075,
    priceKESChild: 4538,
    childHalfPriceRule: false,
    visibleOnMarketplace: true,
    locationText: "Ol Pejeta Conservancy, Laikipia",
    partnerSlug: "ol-pejeta-conservancy",
    sourceUrl: "https://natuasili.com/st_tour/lion-tracking-ol-pejeta/",
  },
  {
    title: "Become a K-9 handler for a day at Ol Pejeta Conservancy",
    id: "exp-k9-handler-ol-pejeta",
    slug: P("K9 Handler Day Ol Pejeta"),
    partner: "Ol Pejeta Conservancy", 
    destination: "laikipia",
    themes: ["Wildlife conservation"],
    activities: ["k9", "anti-poaching", "dogs"],
    images: [k9HandlerTraining, olPejetaImg, "/images/placeholder-4.jpg"],
    heroImage: k9HandlerTraining,
    gallery: [k9HandlerTraining, olPejetaImg, "/images/placeholder-4.jpg"],
    description: `Overview
Visitors to the unique protected area of Ol Pejeta Conservancy can directly help conserve wildlife. Apart from the last two northern white rhinos and the Big Five, it supports communities nearby with education and health programs.
See Ol Pejeta's anti-poaching dog squad. Talk to the dog keepers to find out how to look after our specially trained canine team. Try to hide from the sniffer dogs during the kennel tour. To see whether the bloodhounds can locate you, run, jump, twist, turn, and hide within the Morani Information Center area. This is not only a lot of fun, but it also gives the dogs great training.
Your safari at Ol Pejeta offers an opportunity to assist wildlife. Here, you will be involved in actual conservation efforts and help to create lasting change even after you depart.

Highlights
• Discover why the K-9 unit is so important for anti-poaching campaigns.
• See other dog specialties including suspect apprehension, scent tracking, and ammunition detection.
• Join a bloodhound in an interactive dog-tracking exercise. Watch it track a modeled poacher's scent or run and hide for the dog to find.

Included/Excluded
• A friendly professional guide
• Conservancy entry fees
• Personal expenses
• Insurance
• Donations towards supporting the organization

What to expect
Meet Ol Pejeta's K9 Heroes
o Arrive at the Morani Information Centre at 8:30 AM (the designated starting point).
o Meet the Ol Pejeta rangers and receive a briefing about the K9 unit's role in conservation.
o Learn about the different specializations of the K9 dogs.
o Gain valuable insights into anti-poaching efforts and the importance of K9 units.

Cancellation policy
o You can cancel up to 48 hours before the experience starts for a full refund.

Durations
0 - 2 hours

Languages
English

Frequently asked questions
What can I expect during the activity?
You'll learn about the K-9 unit, participate in a tracking exercise with a bloodhound (both hiding and observing), and gain insights into their training.

Is this activity safe?
Yes, the activity is conducted in a controlled environment with experienced handlers.

What should I wear?
Closed shoes, sunscreen, and a hat are recommended. Opt for neutral-colored clothing.

Can I bring children?
This activity is not recommended for children under 12 years old.

Important information
o Physical interaction with the dogs will be relatively restricted.
o This activity is not suitable for children under the age of 12.
o If you don't have transport to the starting point, the conservancy can arrange for you to be picked up (within the conservancy) for an extra fee.

Where you'll be
2VC5+X9 Nanyuki`,
    priceKESAdult: 9075,
    priceKESChild: 4538,
    childHalfPriceRule: false,
    visibleOnMarketplace: true,
    locationText: "Ol Pejeta Conservancy, Laikipia",
    partnerSlug: "ol-pejeta-conservancy",
    sourceUrl: "https://natuasili.com/st_tour/k9-handler-day-ol-pejeta/",
  },
  {
    title: "Drones for conservation with Mara Elephant Project",
    id: "exp-drone-conservation-mep",
    slug: P("Drone Conservation Mara Elephant"),
    partner: "Mara Elephant Project",
    destination: "masai-mara",
    themes: ["Wildlife conservation"],
    activities: ["drone", "technology", "elephant"],
    images: ["/lovable-uploads/a9fc8078-1eb7-433f-8ea8-cc504ca5b048.png", "/lovable-uploads/bd06defe-f511-409f-88b1-decacb2392df.png", "/lovable-uploads/388b370f-647e-471b-92c2-addc918cb81b.png", "/lovable-uploads/2e0b1e5d-9156-4ef6-9b42-0927ce47af9a.png"],
    heroImage: "/lovable-uploads/a9fc8078-1eb7-433f-8ea8-cc504ca5b048.png",
    gallery: ["/lovable-uploads/a9fc8078-1eb7-433f-8ea8-cc504ca5b048.png", "/lovable-uploads/bd06defe-f511-409f-88b1-decacb2392df.png", "/lovable-uploads/388b370f-647e-471b-92c2-addc918cb81b.png", "/lovable-uploads/2e0b1e5d-9156-4ef6-9b42-0927ce47af9a.png"],
    description: `Overview
The Mara Elephant Project (MEP) is a conservation organization to protect elephants in the Mara-Serengeti ecosystem. This two-hour expedition is to discover the new world of drone conservation! MEP has pioneered the use of drones to transform its approach to elephant protection since in 2011. Experience personally the difference this innovative technology is bringing about.

Highlights
• Discover MEP's creative drone initiative, which comprises nine Mavic drones with thermal imaging capacity.
• Meet and engage with the 18 rangers and researchers on the skilled team flying the drones.
• Learn how different conservation projects—conflict avoidance, elephant monitoring, and reconnaissance among other things—use drones.

Included/Excluded
• Refreshments; drinking water, coffee or juice.
• Personal expenses
• Insurance
• Meals

What to expect
Exploring Drone Conservation with MEP
o Arrive at the designated meeting point (transportation likely not included).
o Receive a briefing from a knowledgeable MEP staff member on the importance of elephant conservation and the groundbreaking use of drones in their efforts.
o Witness a live demonstration of the various drones used by MEP. Learn about their specific features and functionalities for diverse conservation applications.
o Engage in a Q&A session with the MEP staff member, addressing any questions you may have about drone conservation and MEP's overall efforts.

Cancellation policy
o You can cancel and get a full refund if you do it at least 7 days before the experience starts. If you book more than 48 hours before the start time, you can also cancel within 24 hours of booking for a full refund.

Durations
0 - 2 hours

Languages
English

Frequently asked questions
What can I expect to do on this program?
You'll gain exclusive insights into MEP's drone program through presentations, demonstrations, and potentially observing live drone operations (weather dependent).

Is there an age restriction?
This program might be more suitable for older children and adults due to the technical nature of the content.

Can I participate in flying the drones?
Piloting the drones is done by trained MEP personnel.

Important information
o KES 66,000 per group (minimum 2 people) - all-inclusive donation paid to MEP
o Mara Elephant Project has an educational mandate, which aligns with our core mission that allows for guests to visit our
headquarters to see MEP's presentation and meet MEP staff. These experiences will be available at 10 a.m. on a weekday and
no minimum donation is required.
o Mara Elephant Project can provide bespoke experiences for interested donors. This can include a visit to camp for tea and
coffee and a presentation from a key MEP staff member, which would give guests private access to learn more about our
work. We would ask for a minimum donation of $1,000 per group for this experience.

Where you'll be
6GCQR5P4+24`,
    priceKESAdult: 66000,
    childHalfPriceRule: false,
    isGroupPricing: true,
    minCapacity: 2,
    capacity: 8,
    visibleOnMarketplace: true,
    locationText: "Masai Mara",
    partnerSlug: "mara-elephant-project",
    sourceUrl: "https://natuasili.com/st_tour/drone-conservation-mara-elephant/",
  },
  {
    title: "Elephant researcher experience with Mara Elephant Project", 
    id: "exp-elephant-researcher-mep",
    slug: P("Elephant Researcher Mara Elephant Project"),
    partner: "Mara Elephant Project",
    destination: "masai-mara",
    themes: ["Wildlife conservation"],
    activities: ["elephant", "research", "data"],
    images: [maraElephantTracking, "/lovable-uploads/a9fc8078-1eb7-433f-8ea8-cc504ca5b048.png", "/lovable-uploads/bd06defe-f511-409f-88b1-decacb2392df.png"],
    heroImage: maraElephantTracking,
    gallery: [maraElephantTracking, "/lovable-uploads/a9fc8078-1eb7-433f-8ea8-cc504ca5b048.png", "/lovable-uploads/bd06defe-f511-409f-88b1-decacb2392df.png"],
    description: `Overview
The Mara Elephant Project (MEP) is a conservation organization established to protect the elephants in the Mara-Serengeti ecosystem.
Along with MEP's Long-Term Monitoring (LTM) team, the 3-hour program Elephant Researcher invites you to engage in actual elephant data collection.
Start a thrilling adventure—a behind-the-scenes view of elephant research conducted with MEP. This special 3-hour experience provides a rare chance to join MEP's Long-Term Monitoring (LTM) team in gathering important information on the magnificent Maasai Mara elephants.

Highlights
• Engage in real elephant research with MEP's Long-Term Monitoring team
• Learn about elephant behavior and conservation challenges
• Contribute to valuable data collection for elephant protection
• Gain insider knowledge from experienced researchers and field guides
• Experience the behind-the-scenes world of elephant conservation

Included/Excluded
• Refreshments and drinking water
• Research materials and equipment
• Expert guidance from MEP team
• Personal expenses
• Insurance
• Transportation to/from the meeting point

What to expect
A Research Expedition with the Mara Elephant Project
o Meet at the designated location (transportation arrangements may vary)
o Receive comprehensive briefing on elephant research methodologies and conservation challenges
o Join the MEP Long-Term Monitoring team in active data collection activities
o Learn to identify individual elephants and observe behavioral patterns
o Participate in photographic documentation and data recording
o Engage in discussions about elephant conservation strategies and challenges

Duration
3 hours

Languages
English

Frequently asked questions
What type of research will I be involved in?
You'll participate in active elephant monitoring, including identification, behavior observation, and data collection alongside MEP's research team.

What kind of data collection will I be involved in?
You might assist with tasks like elephant identification, behavior observation, and photographic documentation.

Is any prior experience required?
No prior experience is necessary. However, a passion for elephants and an interest in conservation are essential.

Can I participate if I have no prior research experience?
Absolutely! This program is designed for anyone passionate about elephants and conservation, regardless of scientific background. The MEP team will provide all necessary training and guidance throughout the experience.

Important information
o KES 66,000 per group (minimum 2 people) - all-inclusive donation paid to MEP
o Mara Elephant Project has an educational mandate, which aligns with our core mission that allows for guests to visit our
headquarters to see MEP's presentation and meet MEP staff. These experiences will be available at 10 a.m. on a weekday and
no minimum donation is required.
o Mara Elephant Project can provide bespoke experiences for interested donors. This can include a visit to camp for tea and
coffee and a presentation from a key MEP staff member, which would give guests private access to learn more about our
work. We would ask for a minimum donation of $1,000 per group for this experience.

Where you'll be
6GCQR5P4+24`,
    priceKESAdult: 66000,
    childHalfPriceRule: false,
    isGroupPricing: true,
    minCapacity: 2,
    capacity: 8,
    visibleOnMarketplace: true,
    locationText: "Masai Mara",
    partnerSlug: "mara-elephant-project",  
    sourceUrl: "https://natuasili.com/st_tour/elephant-researcher-mara-elephant-project/",
  },
  {
    title: "A sustainable farm experience at Adventure Farm Karen",
    id: "exp-sustainable-farm-karen",
    slug: P("Sustainable Farm Experience Karen"),
    partner: "Adventure Farm Karen",
    destination: "nairobi",
    themes: ["Conservation education"],
    activities: ["farm", "sustainability", "food"],
    images: ["/lovable-uploads/518cb7cf-9bba-4b26-bd79-971ce97b7291.png", "/images/placeholder-2.jpg", "/images/placeholder-3.jpg"],
    heroImage: "/lovable-uploads/518cb7cf-9bba-4b26-bd79-971ce97b7291.png",
    gallery: ["/lovable-uploads/518cb7cf-9bba-4b26-bd79-971ce97b7291.png", "/images/placeholder-2.jpg", "/images/placeholder-3.jpg"],
    description: `Overview
Adventure Farm Karen offers a unique opportunity to connect with nature, learn about sustainable practices, and create lasting memories!
A day at Adventure Farm Karen starts with a tour of their sustainable practices and interacting with farm animals. This is followed by a delicious farm-to-fork meal and homemade gelato. You can then get hands-on with activities like pizza making, cheese making, cow milking, and salad making using the farm's fresh produce. The day concludes with a chance to plant a tree and contribute to a greener future.

Highlights
• Scenic farm tour with knowledgeable guides
• Learn about eco-friendly farming practices
• Interact with farm animals and discover their diets
• Create your own pizza with farm-fresh toppings
• Contribute to a greener future through tree planting
• Suitable for all ages!

Included/Excluded
• A friendly professional guide
• Personal expenses
• Insurance
• Drinks and meals
• Additional Services not mentioned

What to expect
Adventure farm fun & learning
o Arrive at Adventure Farm Karen and embark on a guided farm tour, learning about sustainable practices and interacting with farm animals.
o After lunch, enjoy a delicious farm-to-fork meal with refreshing beverages and homemade gelato.
o In the afternoon, participate in a pizza-making session using farm-fresh toppings. Learn the secrets of cheese making and try your hand at making mozzarella. Feeling adventurous? Test your skills at milking a cow!

Cancellation policy
o You can cancel up to 48 hours before the experience starts for a full refund.

Durations
2 - 3 hours
Full day (+5hours)

Languages
English

Frequently asked questions
What's included in the all-inclusive package?
The all-inclusive package covers your entire day at Adventure Farm Karen, including:
o Guided farm tour
o Delicious farm-to-fork meal with refreshments
o Pizza-making and cheese-making workshops (participation optional)
o Tree-planting initiative

What will I learn on the farm tour?
The knowledgeable guides will lead you on a scenic exploration, highlighting Adventure Farm's commitment to sustainable practices. You'll learn about organic farming techniques, interact with various farm animals, and gain insights into the farm's interconnected ecosystem.

Is this a good activity for children?
Absolutely! Adventure Farm Karen offers a fun and educational experience perfect for families with children of all ages.

Are there any dietary restrictions catered to?
When booking, please inform us in advance about any dietary restrictions you may have when making your reservation. Adventure Farm will do their best to accommodate your needs.

What should I wear?
This is a full-day experience with outdoor activities. We recommend comfortable shoes and clothing suitable for walking, bending, and potentially getting a little messy during the workshops.

Where you'll be
PM2P+HR Nairobi`,
    priceKESAdult: 2500,
    childHalfPriceRule: true,
    visibleOnMarketplace: true,
    locationText: "Karen, Nairobi",
    partnerSlug: "adventure-farm-karen",
    sourceUrl: "https://natuasili.com/st_tour/sustainable-farm-experience-karen/",
  },
  {
    title: "Morning bird walk with Nature Kenya",
    id: "exp-morning-bird-walk",
    slug: P("Morning Bird Walk Nature Kenya"),
    partner: "Nature Kenya",
    destination: "nairobi",
    themes: ["Conservation education"],
    activities: ["birds", "walk", "education"],
    images: [natureKenyaBirdwatching, natureKenyaImg, "/images/placeholder-4.jpg"],
    heroImage: natureKenyaBirdwatching,
    gallery: [natureKenyaBirdwatching, natureKenyaImg, "/images/placeholder-4.jpg"],
    description: `Overview
The East Africa Natural History Society, better known as Nature Kenya, is a non-profit committed to promoting East African environmental research and conservation. It offers weekly guided bird walks across diverse ecosystems in Nairobi, Malindi, and the 3rd Saturday of every month in Mombasa.
Explore Nairobi's varied birdlife every Wednesday morning and start an adventure of discovery. In Malindi and Mombasa, experience coastal birding, where unique shorebirds and migratory species thrive. With an expert guide leading the way, you'll uncover hidden birding hotspots and spot an incredible variety of feathered friends.
Learning to recognize birds by sight and sound, using their calls and distinctive features, will help you develop your birding techniques. Gain insights into their behavior, habitat preferences, and their critical role in Kenya's diverse ecosystems.

Highlights
• Explore Nairobi's secret birding hotspots.
• Pick tips from seasoned birding guides to improve your own.
• By sight and sound, list several bird species.

Included/Excluded
• A friendly professional guide
• Personal expenses
• Insurance
• Drinks and meals
• Additional Services not mentioned

What to expect
Connect with fellow bird enthusiasts
o Every Wednesday morning, meet at the designated location (check the Nature Kenya website for details) at 8:00 AM.
o Join a guided walk through different Nairobi birding hotspots each week.
o Learn about Nairobi's diverse birdlife with experienced guides.

Cancellation policy
o You can cancel up to 48 hours before the experience starts for a full refund.

Durations
2 - 3 hours

Languages
English

Frequently asked questions
Is this walk for beginners?
Yes, this walk is perfect for both seasoned birders and curious newcomers interested in exploring Nairobi's birdlife.

Do I need to be a member?
Membership is preferred but not mandatory. Temporary day memberships are available for those interested in trying it out. Visit the Nature Kenya website or contact them for details.

When and where does the tour meet?
The walk will take place every Wednesday at 8:30 AM at a designated location, which will be communicated prior to every walk.

What should I wear and bring?
Comfortable walking shoes, binoculars (if possible), a reusable water bottle, and sun protection are recommended.

Where you'll be
PRG7+CQ Nairobi`,
    priceKESAdult: 500,
    childHalfPriceRule: false,
    visibleOnMarketplace: true,
    locationText: "Nairobi",
    partnerSlug: "nature-kenya",
    sourceUrl: "https://natuasili.com/st_tour/morning-bird-walk-nature-kenya/",
  },
  {
    title: "Citizen scientist experience at Nairobi Park",
    id: "exp-citizen-scientist-nairobi",
    slug: P("Citizen Scientist Nairobi Park"),
    partner: "Friends of Nairobi National Park",
    destination: "nairobi",
    themes: ["Wildlife conservation"],
    activities: ["citizen science", "wildlife", "data"],
    images: ["/lovable-uploads/ba1c2e8e-98b4-4179-b5ef-87c52a8e2a4b.png", "/images/placeholder-2.jpg", "/images/placeholder-3.jpg"],
    heroImage: "/lovable-uploads/ba1c2e8e-98b4-4179-b5ef-87c52a8e2a4b.png",
    gallery: ["/lovable-uploads/ba1c2e8e-98b4-4179-b5ef-87c52a8e2a4b.png", "/images/placeholder-2.jpg", "/images/placeholder-3.jpg"],
    description: `Overview
Established in 1995, Friends of Nairobi National Park (FoNNaP) has been committed to assisting Kenya Wildlife Service (KWS) in conserving and improving the biodiversity inside Nairobi National Park and its larger surroundings.
All nature lovers and supporters of conservation should join FoNNaP's special citizen science program. This program allows participants to be citizen scientists and combines social activities with wildlife preservation, so providing unique insights. Through bi-monthly game counts, volunteers assist in tracking wildlife numbers and trend monitoring, so contributing important information for study and conservation.
Apart from that, frequent clean-up events try to eliminate plastic waste and other trash, so preserving the biodiversity of the park and providing a safer surrounding for its species. Join FONNAP to help with important conservation initiatives and directly help Nairobi National Park to be preserved.

Highlights
• Support Kenya Wildlife Service (KWS) and FoNNaP in bi-monthly game counts.
• Through animal identification and data collection, you can provide valuable information for the conservation of wildlife.
• See professionals for instruction to improve your citizen science abilities.

Included/Excluded
• A friendly professional guide
• Personal expenses
• Insurance
• Drinks and meals
• Additional services are not mentioned

What to expect
Join FoNNaP's Citizen Science Initiative!
o Register for a bi-monthly game count or clean-up activity on the FoNNaP website. Attend a briefing by FoNNaP on data collection or clean-up procedures (if applicable). Participate in the citizen science activity alongside FoNNaP and KWS staff. Contribute to wildlife research and conservation efforts. Enjoy a day in the park surrounded by nature (may vary depending on the program).
o Note: This is a citizen science program with recurring activities happening bi-monthly. The specific itinerary will vary depending on whether you participate in a game count or a clean-up activity.

Cancellation policy
o You can cancel and get a full refund if you do it at least 7 days before the experience starts.

Durations
2 - 3 hours

Languages
English

Frequently asked questions
Do I need prior experience?
No prior experience is necessary! The program is open to anyone passionate about conservation.

What will I be doing?
You'll participate in game counts to track wildlife and assist with clean-up activities to remove litter. FoNNaP will train you on wildlife identification and data collection techniques.

Who can participate?
The program is open to anyone passionate about conservation.

Where you'll be
JV96+2C Nairobi`,
    priceKESAdult: 1000,
    childHalfPriceRule: false,
    visibleOnMarketplace: true,
    locationText: "Nairobi National Park",
    partnerSlug: "friends-of-nairobi-national-park",
    sourceUrl: "https://natuasili.com/st_tour/citizen-scientist-nairobi-park/",
  },
  {
    title: "Karura Forest specialized eco‑tours",
    id: "exp-karura-forest-tours",
    slug: P("Karura Forest Specialized Eco Tours"),
    partner: "Friends of Karura Forest",
    destination: "nairobi",
    themes: ["Conservation education"],
    activities: ["forest", "eco-tour", "nature"],
    images: [karuraForestPlanting, "/lovable-uploads/f0dcab56-c695-41ac-bf57-3a9e350158f0.png", "/images/placeholder-3.jpg"],
    heroImage: karuraForestPlanting,
    gallery: [karuraForestPlanting, "/lovable-uploads/f0dcab56-c695-41ac-bf57-3a9e350158f0.png", "/images/placeholder-3.jpg"],
    description: `Overview
Friends of Karura Forest is a non-profit dedicated to the preservation and administration of Karura Forest Reserve, a crucial green area in Nairobi. Friends of Karura Forest caters to your particular interests by providing a range of guided tours headed by enthusiastic and informed guides. Whether your interests are in the rich history and ecology of the forest, you are a budding botanist, a passionate birder, or just curious about Karura Forest. There is a tour meant to inspire you.

Highlights
• Explore Karura Forest Reserve, Nairobi's essential green lung, alongside a passionate and informed guide.
• Choose a theme that interests you from the rich history and cultural relevance of the forest to its ecology and amazing animals.
• Discover the unique flora and fauna of Karura Forest, including varied birdlife, primates, and other flora. Depending on your theme, you might incorporate bird watching and primate tracking.
• Spend time in the natural surroundings to help you to value the need for preservation.

Included/Excluded
• A friendly professional guide
• Personal expenses
• Insurance
• Drinks and meals
• Additional Services not mentioned

What to expect
Exploring Karura with an expert guide
o Arrive at the designated meeting point at the Friends of Karura Forest visitor center
o Meet your guide and discuss your chosen tour theme (ecology, birdwatching, primates, history & culture, etc.).
o Embark on your guided forest exploration. Depending on your chosen focus, your guide will tailor the experience to your interests, highlighting:
o Spotting various bird species (birdwatching tour)
o Learning about plant identification and ecological processes (ecology tour)
o Tracking primates like colobus monkeys (primate tracking tour)
o Wrap up your tour at the Visitors Center. Learn more about Friends of Karura Forest's ongoing conservation efforts and how you can get involved.
o Enjoy some leisure time exploring the forest further on your own (be sure to stay on designated trails).

Cancellation policy
o You can cancel up to 24 hours before the experience starts for a full refund.

Durations
0 - 2 hours

Languages
English

Frequently asked questions
What should I wear on the tour?
Comfortable walking clothes and sturdy shoes are essential. Long pants and sleeves are recommended for sun protection and to avoid insect bites. Dress according to the weather conditions; a hat and rain jacket are good options to bring along.

What is the difficulty level of the walks?
The terrain in Karura Forest can vary from flat paths to gentle slopes. Friends of Karura Forest will work with you to choose a tour that suits your fitness level.

Are there any restrictions in the forest?
Yes, for the protection of the forest and wildlife, there are some restrictions. Smoking, littering, and loud noises are not permitted. You should also stay on designated trails and avoid going off-road.

What should I bring on the tour?
o A refillable water bottle to stay hydrated.
o Sunscreen and insect repellent.
o A camera to capture your forest adventure (optional).
Most importantly, bring your spirit of nature and adventure!

What can I expect on a Friends of Karura Forest tour?
The tours are designed to be immersive experiences tailored to your interests. You can expect to explore the diverse plant and animal life of Karura Forest, led by a knowledgeable guide who will share fascinating insights about the forest's ecology, history, and cultural significance.
Friends of Karura Forest offers a variety of tours tailored to suit different interests. Whether you like studying plants, watching birds, learning history, or just exploring the forest, there is a tour for you. When booking your tour, kindly share your interests to create a personalized experience.

Where you'll be
QR38+3V Nairobi`,
    priceKESAdult: 1500,
    childHalfPriceRule: false,
    visibleOnMarketplace: true,
    locationText: "Karura Forest, Nairobi",
    partnerSlug: "friends-of-karura-forest",
    sourceUrl: "https://natuasili.com/st_tour/karura-forest-specialized-eco-tours/",
  },
  // Additional experiences would continue here with their full details...
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

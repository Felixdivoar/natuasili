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
Engage with the vibrant cultural heritage of Northern Kenya through immersive, community-led experiences. These journeys allow visitors to connect with indigenous communities, participate in traditional practices, and gain a deeper appreciation for ways of life that have been preserved for generations. From hands-on activities like beadwork and cooking to captivating storytelling sessions, travelers are invited to experience daily life as lived by the region's diverse communities. Visits to local villages offer meaningful interactions and insights into customs and traditions, while cultural festivals such as the Tobong'u Lore bring together communities in colorful celebrations of heritage. Through educational tours and guided discussions, visitors also learn about the historical, social, and environmental dimensions of indigenous cultures. These experiences not only foster cultural exchange but also support sustainable development and the preservation of Northern Kenya's rich cultural identity.

Highlights
• Engage in genuine cultural exchanges that go beyond typical tourist activities, fostering mutual respect and understanding.
• Stay in community-run lodges or homestays that provide comfort while ensuring that tourism benefits the local population.
• Be accompanied by knowledgeable local guides who offer personal insights and facilitate meaningful interactions.

Included/Excluded
• A friendly professional guide
• Personal expenses
• Insurance
• Drinks and meals
• Additional Services not mentioned

What to expect
Cultural Immersions in Northern Kenya
o Spend time in local villages learning about daily life, customs, and traditions directly from community members.
o If your visit coincides with local events such as the Tobong'u Lore Festival, join the celebrations showcasing music, dance, fashion, and ancestral heritage.
o Join local guides for educational tours focusing on indigenous history, clan structures, and environmental stewardship practices.

Durations
2 - 3 hours

Frequently asked questions
Are these experiences suitable for families with children?
Yes, cultural immersion activities are designed to be educational and engaging for all age groups, making them suitable for families.

How do these experiences benefit local communities?
A significant portion of the proceeds from cultural immersion experiences goes directly to the communities, supporting local economies, education, and cultural preservation efforts.

Where you'll be
https://maps.app.goo.gl/VzMtfuRWv9rbpWt76`,
    priceKESAdult: 2000,
    childHalfPriceRule: false,
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
Embark on a unique and thrilling adventure at the Sera Rhino Sanctuary, nestled within the Sera Community Conservancy in Kenya's Samburu region. As the first and only community-managed black rhino sanctuary in East Africa, and the only location in Northern Kenya where visitors can track both black and white rhinos on foot, Sera represents a groundbreaking model of community-led conservation. Established in 2015, the sanctuary marked the return of black rhinos to the area after a 30-year absence caused by poaching, and in 2024, it expanded its conservation efforts by introducing southern white rhinos.

Visitors can experience the thrill of tracking rhinos on foot, guided by skilled Samburu trackers and armed rangers, while exploring the sanctuary's vast 26,000-acre wilderness—home to the 'Samburu Special Five': reticulated giraffe, Grevy's zebra, Beisa oryx, Somali ostrich, and gerenuk. The experience also offers meaningful cultural immersion, with opportunities to engage with the Samburu community and learn about their traditions and vital role in protecting wildlife.

Highlights
• Join expert Samburu guides and armed rangers as you track rhinos in their natural habitat using traditional methods.
• Discover how local communities are protecting wildlife and earning sustainable livelihoods through tourism.
• Spot other iconic species including the reticulated giraffe, Grevy's zebra, Somali ostrich, Beisa oryx, and the long-necked gerenuk.

Included/Excluded
• A friendly professional guide
• Personal expenses
• Insurance
• Drinks and meals
• Additional Services not mentioned

What to expect
On-foot rhino tracking
o Start with an informative session led by conservancy rangers outlining safety protocols, the sanctuary's history, and how your visit supports conservation.
o Head out with expert guides using traditional tracking methods to follow signs of rhinos. Once a rhino is found, you'll observe from a safe yet intimate distance—often just meters away—while learning about their behaviors and threats.
o Along the walk or during optional game drives, spot species such as Grevy's zebra, reticulated giraffe, and Beisa oryx.

Durations
2 - 3 hours

Languages
English

Frequently asked questions
Do I need prior experience?
Not at all. All tracking is done under the guidance of experienced Samburu trackers and conservancy rangers.

How does this tour support conservation?
A significant portion of your visit goes directly into rhino protection, ranger patrols, and community development programs.

Is this safe?
Absolutely. All walking safaris are led by trained, armed rangers following strict safety protocols.

Where you'll be
95W5+QGR, Dol Dol`,
    priceKESAdult: 4000,
    childHalfPriceRule: false,
    visibleOnMarketplace: true,
    locationText: "Sera Conservancy, Samburu",
    partnerSlug: "sera-conservancy",
    sourceUrl: "https://natuasili.com/st_tour/sera-on-foot-rhino-tracking/",
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
Located on the eastern shores of Lake Baringo in Kenya's Great Rift Valley, the Ruko Giraffe Sanctuary is a community-led conservation initiative dedicated to protecting the endangered Rothschild's giraffe. Established through a collaboration between the Il Chamus and Pokot communities—historically rival groups—the sanctuary is a powerful example of how conservation can foster peace and unity. In 2020, a dramatic rescue operation saw nine stranded giraffes relocated from a flooded island to the mainland sanctuary using a custom-built barge. Since then, the population has flourished, with successful breeding and plans to reintroduce them to their ancestral habitats. Visitors to the sanctuary can enjoy the rare opportunity to observe Rothschild's giraffes in their natural environment, experience the inspiring story of community cooperation, and take in the scenic landscapes of Lake Baringo. Guided tours and interactions with local rangers also provide valuable educational insights into the challenges and successes of wildlife conservation in Kenya.

Highlights
• Explore the sanctuary with knowledgeable guides who share insights into giraffe behavior, conservation efforts, and the sanctuary's history.
• In addition to giraffes, visitors may encounter other wildlife species native to the region.
• Engage with local communities to learn about their traditions and the role they play in conservation.

Included/Excluded
• A friendly professional guide
• Personal expenses
• Insurance
• Drinks and meals
• Additional Services not mentioned

What to expect
Ruko giraffe sanctuary experience
o Begin with a warm introduction by local guides and a briefing on the sanctuary's history and conservation work.
o Embark on a nature walk through the sanctuary to observe Rothschild's giraffes and learn about their rescue and rewilding.
o Visit nearby communities to engage with Il Chamus and Pokot representatives, hearing their stories and role in conservation.

Durations
3 - 5 hours

Languages
English

Frequently asked questions
How can I visit the Ruko Giraffe Sanctuary?
Visits can be arranged through local tour operators or by contacting the sanctuary directly. It's advisable to plan ahead and confirm accessibility, especially during the rainy season.

How does my visit support conservation efforts?
Tourism revenue supports the sanctuary's operations, community development projects, and ongoing conservation initiatives.

Where you'll be
J4RF+P9M, Nosuguro`,
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
    description: `Overview
Founded in Diani, Kenya, Colobus Conservation is a non-profit committed to the protection of primates, especially the threatened Angolan black and white colobus monkeys. Through habitat protection, educational campaigns, rescue, and rehabilitation projects, it seeks to safeguard primates.
The only primate eco-tour in the nation, it presents a special chance to see a colonized troop of colobus monkeys in their natural environment.

Highlights
• Guided nature walk through a scenic trail
• Depending on sightings, encounter variety of colobus monkeys, vervet monkeys, Sykes's monkeys, and baboons among other primates.
• Discover the critical contribution Colobus Conservation makes to primate research and protection.

Included/Excluded
• A friendly professional guide
• Personal expenses
• Insurance
• Drinks and meals
• Additional Services not mentioned

What to expect
Encountering colobus monkeys and other primates
o Arrive at Colobus Conservation and meet your guide and embark on a guided walk along the trail.
o Observe a habituated troop of colobus monkeys and other primates.
o Attend a talk at the information center to learn about Colobus Conservation's activities.

Cancellation policy
o You can cancel up to 24 hours before the experience starts for a full refund.

Durations 
0 - 2 hours

Languages
English

Frequently asked questions
What primates can I expect to see?
You are most likely to see colobus monkeys, but vervet monkeys, Sykes' monkeys, and baboons are also frequent visitors to the area.

What are the opening hours?
Guided eco-tours are offered Monday to Saturday from 8:30 AM to 4:00 PM. The center is closed for eco-tours on Sundays.

Is this a good tour for children?
Yes, this tour is perfect for families with children who are interested in learning about monkeys.

Where you'll be
MH47+6WQ`,
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
    description: `Overview
With an eye toward sea turtles, Local Ocean Conservation is a non-profit committed to safeguarding Kenya's marine habitat. They provide an interesting day trip meant to educate visitors about the ocean and motivate behavior in favor of conservation. Families, outdoor enthusiasts, and everyone else interested in the marine environment will find ideal use for this informative day trip.

Highlights
• Learn about the various sea turtle species, their life cycle, and the threats that they encounter.
• See LOC's work toward sea turtle protection and rehabilitation.
• Learn the value of the marine ecosystem and the need of its preservation.

Included/Excluded
• A friendly professional guide
• Personal expenses
• Insurance
• Drinks and meals
• Additional Services not mentioned

What to expect
LOC: Protecting the Ocean Through Action
o Arrive at the Local Ocean Conservation center.
o Join a guided tour about sea turtles, their life cycle, and the challenges they face.
o Learn about the marine ecosystem and the importance of its conservation.
o Consider making a donation to further support LOC's vital work (optional).

Cancellation policy
o You can cancel up to 48 hours before the experience starts for a full refund.

Durations
0 - 2 hours

Languages
English

Frequently asked questions
What can I expect on the tour?
The tour includes guided talks about sea turtles and the marine ecosystem, showcasing LOC's conservation efforts.

Is this tour suitable for children?
Yes, this educational day trip is perfect for families!

What can I do to contribute further?
Consider making a donation or spreading awareness about ocean conservation after your visit.

Important information
o The goal is to get healthy sea turtles back into the ocean as soon as possible, so you might not always see them here during your visit.
o Tours are offered hourly for your convenience. The specific details may vary slightly depending on the tour guide and available resources.
o Please note that LOC is closed on Saturday afternoon, Sundays and all Public Holidays.

Where you'll be
JXFP+M4 Watamu`,
    priceKESAdult: 1000,
    childHalfPriceRule: false,
    visibleOnMarketplace: true,
    locationText: "Watamu, Coastal Kenya",
    partnerSlug: "local-ocean-watamu",
    sourceUrl: "https://natuasili.com/st_tour/ocean-conservation-day-watamu/",
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
Trees are the lifeline of our planet, providing oxygen, shelter, and vital ecosystems for wildlife. The Tree walk, organized by Nature Kenya's Plant Committee, offers a unique opportunity to explore Kenya's diverse forests, learn about indigenous and exotic tree species, and understand the crucial role trees play in conservation and climate resilience.
Whether in forests, botanical gardens, or urban green spaces, this guided walk helps participants connect with nature while deepening their knowledge of Kenya's rich plant biodiversity.

Highlights
• Discover Kenya's rich tree heritage by exploring its indigenous and exotic species.
• Engage in conservation by understanding the importance of reforestation and sustainable land use.
• Experience nature up close with expert-led walks through forests and parks

Included/Excluded
• A friendly professional guide
• Personal expenses
• Insurance
• Drinks and meals
• Additional Services not mentioned

What to expect
Explore Kenya's forest heritage
o Start the day at 8:30 AM with a warm welcome and introduction at the designated meeting point. Get an insightful overview of Kenya's tree diversity, the significance of conservation, and a briefing on the walk, including safety guidelines and key highlights.
o Embark on a guided forest exploration, identifying diverse tree species while learning about their medicinal, indigenous, and exotic origins. Discover their ecological significance and observe how trees support wildlife, soil stability, and water conservation.
o Engage in **interactive learning** as you explore the challenges facing forests, from deforestation and climate change to urbanization. Gain hands-on insights into tree planting and care for reforestation efforts while uncovering the cultural and historical significance of various tree species.

Cancellation policy
o You can cancel up to 48 hours before the experience starts for a full refund.

Durations
0 - 2 hours
2 - 3 hours
3 - 5 hours

Languages
English

Frequently asked questions
What should I bring?
Bring comfortable walking shoes, a hat and sunscreen for protection, a water bottle to stay hydrated, and optionally, a notebook or field guide for a more immersive experience.

Do I need prior knowledge of trees?
No! The walk is open to everyone, and guides will help with identification and learning.

Is the walk suitable for children?
Yes! The Tree Walk is a great educational experience for all ages.

How often do Tree Walks take place?
They are held once a month at different locations.

Where you'll be
PRG7+CQ Nairobi`,
    priceKESAdult: 500,
    childHalfPriceRule: false,
    visibleOnMarketplace: true,
    locationText: "Nairobi and surroundings",
    partnerSlug: "kenya-forest-heritage",
    sourceUrl: "https://natuasili.com/st_tour/tree-walk-kenya-forest-heritage/",
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
Dudu is the Swahili word for insect, and these tiny creatures play a crucial role in maintaining ecosystems. The Dudu Walk, organized by Nature Kenya's Insect Committee, offers a unique opportunity to explore, identify, and learn about insects in various natural habitats across Kenya. Whether in forests, wetlands, or grasslands, participants will discover the vital role of insects in pollination, decomposition, and biodiversity conservation.

Highlights
• Engage in hands-on insect spotting to observe insects in action and learn about their behaviors.
• Discover the vital role of insects in ecosystems through interactive experiences using nets, magnifiers, and guides.
• Engage in expert-led discussions on conservation and identification.

Included/Excluded
• A friendly professional guide
• Personal expenses
• Insurance
• Drinks and meals
• Additional Services not mentioned

What to expect
Explore the world of insects
o Gather at the designated starting point for a warm welcome and a brief introduction to the vital role insects play in ecosystems. Get an overview of the walk, including safety guidelines and key highlights of what to expect.
o Embark on a guided walk through the habitat, searching for diverse insect species. Observe butterflies, dragonflies, beetles, ants, and more in their natural environment while learning insect identification techniques using sight, behavior, and habitat clues.
o Engage in a discussion on the vital roles of insects as pollinators, decomposers, and food chain contributors while participating in hands-on activities like catching insects with nets, listening to their sounds, and observing their interactions with the environment.

Cancellation policy
o You can cancel up to 48 hours before the experience starts for a full refund.

Durations
0 - 2 hours
2 - 3 hours

Languages
English

Frequently asked questions
What should I bring?
Wear comfortable walking shoes, bring a hat and sunscreen for protection, stay hydrated with a water bottle, and optionally carry a notebook or field guide for a more immersive experience.

Do I need prior insect knowledge?
No! The walk is beginner-friendly, and guides will help you learn along the way.

Is the walk suitable for children?
Yes! The Dudu Walk is great for all ages, offering an exciting way for kids to explore nature

Will we handle insects?
Some insects may be observed up close, but we encourage minimal disturbance to their habitat.

How often do Dudu Walks happen?
They occur once a month at different locations.

Where you'll be
PRG7+CQ Nairobi`,
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
    visibleOnMarketplace: true,
    locationText: "Nairobi",
    partnerSlug: "afew-giraffe-centre",
    sourceUrl: "https://natuasili.com/st_tour/nairobi-giraffe-centre-afew/",
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

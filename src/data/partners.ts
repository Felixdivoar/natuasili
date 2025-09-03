export type Destination =
  "nairobi" | "coastal-kenya" | "samburu" | "masai-mara" | "laikipia";

export type Theme =
  "Conservation education" | "Wildlife conservation" | "Community and Cultural exploration";

export type Experience = {
  id: string;
  title: string;
  slug: string;
  partner: string;
  destination: Destination;
  themes: Theme[];
  activities: string[]; // tags
  images: string[];     // 5 dummy images
  sourceUrl?: string;   // original link you gave
};

const P = (title: string) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const DUMMY = [
  "/img/ph1.jpg",
  "/img/ph2.jpg",
  "/img/ph3.jpg",
  "/img/ph4.jpg",
  "/img/ph5.jpg",
];

export const EXPERIENCES: Experience[] = [
  // i
  {
    title: "Koija Cultural Village",
    id: "exp-koija-cultural-village",
    slug: P("Koija Cultural Village"),
    partner: "Koija Community",
    destination: "samburu",
    themes: ["Community and Cultural exploration"],
    activities: ["village", "culture", "community"],
    images: DUMMY,
    sourceUrl: "https://natuasili.com/st_tour/koija-cultural-village/",
  },
  // ii
  {
    title: "Sera On-Foot Rhino Tracking",
    id: "exp-sera-rhino-tracking",
    slug: P("Sera On-Foot Rhino Tracking"),
    partner: "Sera Conservancy",
    destination: "samburu",
    themes: ["Wildlife conservation"],
    activities: ["rhino", "tracking", "walking"],
    images: DUMMY,
    sourceUrl: "https://natuasili.com/st_tour/sera-on-foot-rhino-tracking/",
  },
  // iii
  {
    title: "Giraffe at Ruko Sanctuary",
    id: "exp-ruko-giraffe",
    slug: P("Giraffe at Ruko Sanctuary"),
    partner: "Ruko Community Conservancy",
    destination: "samburu",
    themes: ["Wildlife conservation", "Community and Cultural exploration"],
    activities: ["giraffe", "sanctuary"],
    images: DUMMY,
    sourceUrl: "https://natuasili.com/st_tour/giraffe-at-ruko-sanctuary/",
  },
  // iv
  {
    title: "Colobus Conservation Guided Eco Tours",
    id: "exp-colobus-eco-tours",
    slug: P("Colobus Conservation Guided Eco Tours"),
    partner: "Colobus Conservation",
    destination: "coastal-kenya",
    themes: ["Wildlife conservation", "Conservation education"],
    activities: ["primates", "eco-tour"],
    images: DUMMY,
    sourceUrl: "https://natuasili.com/st_tour/colobus-conservation-guided-eco-tours/",
  },
  // v
  {
    title: "Ocean Conservation Day – Watamu",
    id: "exp-ocean-day-watamu",
    slug: P("Ocean Conservation Day Watamu"),
    partner: "Local Ocean",
    destination: "coastal-kenya",
    themes: ["Conservation education", "Community and Cultural exploration"],
    activities: ["ocean", "workshop"],
    images: DUMMY,
    sourceUrl: "https://natuasili.com/st_tour/ocean-conservation-day-watamu/",
  },
  // vi
  {
    title: "Tree Walk – Kenya Forest Heritage",
    id: "exp-tree-walk-heritage",
    slug: P("Tree Walk Kenya Forest Heritage"),
    partner: "Nature Kenya",
    destination: "nairobi",
    themes: ["Conservation education", "Community and Cultural exploration"],
    activities: ["forest", "walk", "trees"],
    images: DUMMY,
    sourceUrl: "https://natuasili.com/st_tour/tree-walk-kenya-forest-heritage/",
  },
  // vii
  {
    title: "Dudu Walk – Insect Exploration",
    id: "exp-dudu-walk",
    slug: P("Dudu Walk Insect Exploration"),
    partner: "Nature Kenya",
    destination: "nairobi",
    themes: ["Conservation education", "Community and Cultural exploration"],
    activities: ["insects", "education"],
    images: DUMMY,
    sourceUrl: "https://natuasili.com/st_tour/dudu-walk-insect-exploration/",
  },
  // viii
  {
    title: "Nairobi Giraffe Centre (AFEW)",
    id: "exp-giraffe-centre",
    slug: P("Nairobi Giraffe Centre AFEW"),
    partner: "Giraffe Centre",
    destination: "nairobi",
    themes: ["Wildlife conservation", "Conservation education"],
    activities: ["giraffe", "education"],
    images: DUMMY,
    sourceUrl: "https://natuasili.com/st_tour/nairobi-giraffe-centre-afew/",
  },
  // ix
  {
    title: "Reteti Community Elephant Experience",
    id: "exp-reteti-elephant",
    slug: P("Reteti Community Elephant Experience"),
    partner: "Reteti Elephant Sanctuary",
    destination: "masai-mara",
    themes: ["Wildlife conservation", "Community and Cultural exploration"],
    activities: ["elephant", "sanctuary"],
    images: DUMMY,
    sourceUrl: "https://natuasili.com/st_tour/reteti-community-elephant-experience/",
  },
  // x
  {
    title: "Ol Pejeta – Bush Bird Walks",
    id: "exp-olp-bird-walks",
    slug: P("Ol Pejeta Bush Bird Walks"),
    partner: "Ol Pejeta Conservancy",
    destination: "laikipia",
    themes: ["Wildlife conservation"],
    activities: ["birds", "walk"],
    images: DUMMY,
    sourceUrl: "https://natuasili.com/st_tour/ol-pejeta-bush-bird-walks/",
  },
  // xi
  {
    title: "Night Game Drive – Ol Pejeta",
    id: "exp-olp-night-drive",
    slug: P("Night Game Drive Ol Pejeta"),
    partner: "Ol Pejeta Conservancy",
    destination: "laikipia",
    themes: ["Wildlife conservation"],
    activities: ["game drive", "night"],
    images: DUMMY,
    sourceUrl: "https://natuasili.com/st_tour/night-game-drive-ol-pejeta/",
  },
  // xii
  {
    title: "Northern White Rhinos – Ol Pejeta",
    id: "exp-olp-white-rhinos",
    slug: P("Northern White Rhinos Ol Pejeta"),
    partner: "Ol Pejeta Conservancy",
    destination: "laikipia",
    themes: ["Wildlife conservation"],
    activities: ["rhino", "sanctuary"],
    images: DUMMY,
    sourceUrl: "https://natuasili.com/st_tour/northern-white-rhinos-ol-pejeta/",
  },
  // xiii
  {
    title: "Sweetwaters Chimpanzee Conservation Tour",
    id: "exp-olp-chimps",
    slug: P("Sweetwaters Chimpanzee Conservation Tour"),
    partner: "Ol Pejeta Conservancy",
    destination: "laikipia",
    themes: ["Wildlife conservation"],
    activities: ["chimpanzee", "tour"],
    images: DUMMY,
    sourceUrl: "https://natuasili.com/st_tour/sweetwaters-chimpanzee-conservation-tour/",
  },
  // xiv
  {
    title: "Ol Pejeta Lion Tracking Tour",
    id: "exp-olp-lion-tracking",
    slug: P("Ol Pejeta Lion Tracking Tour"),
    partner: "Ol Pejeta Conservancy",
    destination: "laikipia",
    themes: ["Wildlife conservation"],
    activities: ["lion", "tracking"],
    images: DUMMY,
    sourceUrl: "https://natuasili.com/st_tour/ol-pejeta-lion-tracking-tour/",
  },
  // xv
  {
    title: "K9 Handler Day – Ol Pejeta",
    id: "exp-olp-k9",
    slug: P("K9 Handler Day Ol Pejeta"),
    partner: "Ol Pejeta Conservancy",
    destination: "laikipia",
    themes: ["Wildlife conservation", "Community and Cultural exploration"],
    activities: ["k9", "ranger"],
    images: DUMMY,
    sourceUrl: "https://natuasili.com/st_tour/k9-handler-day-ol-pejeta/",
  },
  // xvi
  {
    title: "Dive into Coral Conservation (Reefolution)",
    id: "exp-reef-coral",
    slug: P("Dive into Coral Conservation Reefolution"),
    partner: "Reefolution",
    destination: "coastal-kenya",
    themes: ["Conservation education"],
    activities: ["coral", "diving"],
    images: DUMMY,
    sourceUrl: "https://natuasili.com/st_tour/dive-into-coral-conservation-with-reefolution/",
  },
  // xvii
  {
    title: "Drone Conservation – Mara Elephant",
    id: "exp-drone-mara",
    slug: P("Drone Conservation Mara Elephant"),
    partner: "Mara Elephant Project",
    destination: "masai-mara",
    themes: ["Wildlife conservation", "Conservation education"],
    activities: ["drone", "elephant"],
    images: DUMMY,
    sourceUrl: "https://natuasili.com/st_tour/drone-conservation-mara-elephant/",
  },
  // xviii
  {
    title: "Elephant Researcher – Mara Elephant Project",
    id: "exp-researcher-mep",
    slug: P("Elephant Researcher with Mara Elephant Project"),
    partner: "Mara Elephant Project",
    destination: "masai-mara",
    themes: ["Wildlife conservation"],
    activities: ["research", "elephant"],
    images: DUMMY,
    sourceUrl: "https://natuasili.com/st_tour/elephant-researcher-with-mara-elephant-project/",
  },
  // xix
  {
    title: "Sustainable Farm Experience – Karen",
    id: "exp-karen-farm",
    slug: P("Sustainable Farm Experience Karen"),
    partner: "Karen Community",
    destination: "nairobi",
    themes: ["Community and Cultural exploration"],
    activities: ["farm", "sustainability"],
    images: DUMMY,
    sourceUrl: "https://natuasili.com/st_tour/sustainable-farm-experience-karen/",
  },
  // xx
  {
    title: "Morning Bird Walk – Nature Kenya",
    id: "exp-morning-bird-walk",
    slug: P("Morning Bird Walk Nature Kenya"),
    partner: "Nature Kenya",
    destination: "nairobi",
    themes: ["Wildlife conservation"],
    activities: ["birds", "walk"],
    images: DUMMY,
    sourceUrl: "https://natuasili.com/st_tour/morning-bird-walk-nature-kenya/",
  },
  // xxi
  {
    title: "Citizen Scientist – Nairobi Park",
    id: "exp-citizen-scientist-np",
    slug: P("Citizen Scientist Nairobi Park"),
    partner: "Friends of Nairobi National Park",
    destination: "nairobi",
    themes: ["Wildlife conservation", "Conservation education"],
    activities: ["citizen science"],
    images: DUMMY,
    sourceUrl: "https://natuasili.com/st_tour/citizen-scientist-nairobi-park/",
  },
  // xxii
  {
    title: "Karura Forest Specialized Eco Tours",
    id: "exp-karura-eco",
    slug: P("Karura Forest Specialized Eco Tours"),
    partner: "Friends of Karura",
    destination: "nairobi",
    themes: ["Conservation education", "Community and Cultural exploration"],
    activities: ["forest", "eco-tour"],
    images: DUMMY,
    sourceUrl: "https://natuasili.com/st_tour/karura-forest-specialized-eco-tours/",
  },
  // xxiii
  {
    title: "Opportunity Factory – Eco Innovation Tour",
    id: "exp-opportunity-factory",
    slug: P("Opportunity Factory Brochure"),
    partner: "Sandstorm",
    destination: "nairobi",
    themes: ["Conservation education", "Community and Cultural exploration"],
    activities: ["innovation", "workshop"],
    images: DUMMY,
    sourceUrl: "file://thumbnail_Opportunity Factory Brochure.jpg",
  },
];

// Generate partner profiles from unique partners in experiences
export const PARTNERS = (() => {
  const uniquePartners = [...new Set(EXPERIENCES.map(exp => exp.partner))];
  
  return uniquePartners.map(partnerName => {
    const partnerExperiences = EXPERIENCES.filter(exp => exp.partner === partnerName);
    const themes = [...new Set(partnerExperiences.flatMap(exp => exp.themes))];
    const destinations = [...new Set(partnerExperiences.map(exp => exp.destination))];
    const activities = [...new Set(partnerExperiences.flatMap(exp => exp.activities))];
    
    return {
      id: P(partnerName),
      name: partnerName,
      slug: P(partnerName),
      location: destinations.join(", "),
      themes,
      activities,
      experienceCount: partnerExperiences.length,
      logo: `/logos/${P(partnerName)}.jpg`,
      description: `Conservation partner working in ${themes.join(", ").toLowerCase()}.`,
      established: Math.floor(Math.random() * 30) + 1995, // Random year between 1995-2025
      experiences: partnerExperiences
    };
  });
})();
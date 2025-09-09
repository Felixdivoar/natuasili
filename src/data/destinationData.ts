import { Destination, Experience, Theme } from './partners';

// Experience duration and capacity mapping for consistency across the site
export const EXPERIENCE_SPECS: Record<string, { duration_hours: number; capacity: number }> = {
  // Nairobi experiences
  "morning-bird-walk-with-nature-kenya": { duration_hours: 3, capacity: 12 },
  "tree-walk-kenya-forest-heritage": { duration_hours: 2, capacity: 15 },
  "dudu-walk-explore-the-world-of-insects": { duration_hours: 2, capacity: 10 },
  "specialized-eco-tours-at-karura-forest": { duration_hours: 4, capacity: 20 },
  "citizen-scientist-experience-at-nairobi-national-park": { duration_hours: 5, capacity: 8 },
  "meet-rothschild-giraffes-at-giraffe-nairobi-centre-with-afew": { duration_hours: 2, capacity: 25 },
  "sustainable-farm-experience-at-adventure-farm-karen": { duration_hours: 6, capacity: 15 },

  // Laikipia experiences  
  "meet-the-last-northern-white-rhinos-at-ol-pejeta": { duration_hours: 3, capacity: 12 },
  "night-game-drive-at-ol-pejeta-conservancy": { duration_hours: 4, capacity: 8 },
  "become-a-k-9-handler-for-a-day-at-ol-pejeta": { duration_hours: 6, capacity: 6 },
  "guided-bush-and-bird-walks-at-ol-pejeta": { duration_hours: 3, capacity: 10 },
  "behind-the-scenes-ol-pejeta-chimpanzee-sanctuary": { duration_hours: 2, capacity: 15 },
  "track-lions-and-aid-conservation-at-ol-pejeta": { duration_hours: 5, capacity: 8 },

  // Samburu/Northern Kenya experiences
  "sera-on-foot-rhino-tracking": { duration_hours: 3, capacity: 8 },
  "community-led-elephant-experience-at-reteti": { duration_hours: 4, capacity: 12 },
  "koija-cultural-village": { duration_hours: 3, capacity: 20 },

  // Maasai Mara experiences
  "drones-for-conservation-with-mara-elephant-project": { duration_hours: 4, capacity: 6 },
  "elephant-researcher-experience-with-mara-elephant-project": { duration_hours: 6, capacity: 8 },

  // Baringo experiences
  "giraffe-at-ruko-sanctuary": { duration_hours: 2, capacity: 15 },

  // Kenyan Coast experiences
  "dive-into-coral-conservation-with-reefolution": { duration_hours: 4, capacity: 10 },
  "colobus-conservation-guided-primate-eco-tours": { duration_hours: 3, capacity: 12 },
  "ocean-wonders-learn-conserve-with-local-ocean-conservation-kenya": { duration_hours: 5, capacity: 15 },
};

// Destination-based experience groupings
export const DESTINATION_EXPERIENCES: Record<Destination, string[]> = {
  "nairobi": [
    "A morning bird walk with Nature Kenya",
    "Tree walk: explore Kenya's forest heritage (Nature Kenya)", 
    "Dudu walk – explore the world of insects (Nature Kenya)",
    "Specialized eco-tours at Karura Forest",
    "Citizen scientist experience at Nairobi National Park (Friends of NNP)",
    "Meet endangered giraffes at Nairobi's Giraffe Centre with AFEW",
    "A sustainable farm experience at Adventure Farm Karen"
  ],
  "laikipia": [
    "Meet the last northern white rhinos at Ol Pejeta Conservancy",
    "Night game drive at Ol Pejeta Conservancy",
    "Become a K-9 handler for a day at Ol Pejeta Conservancy", 
    "Guided bush and bird walks at Ol Pejeta Conservancy",
    "Behind the scenes – Ol Pejeta Sweetwaters Chimpanzee",
    "Track lions and aid conservation at Ol Pejeta Conservancy"
  ],
  "samburu": [
    "On-foot rhino experience at Sera Conservancy",
    "A community-led elephant experience at Reteti Elephant Sanctuary",
    "Koija Cultural Village – join the people, traditions and festivals of Northern Kenya"
  ],
  "masai-mara": [
    "Drones for conservation with Mara Elephant Project",
    "Elephant researcher experience with Mara Elephant Project"
  ],
  "coastal-kenya": [
    "Dive into coral conservation with REEFolution",
    "Colobus Conservation: guided primate eco-tours",
    "Ocean Wonders: Learn & conserve with Local Ocean Conservation Kenya"
  ]
};

// Partner-destination mapping
export const DESTINATION_PARTNERS: Record<Destination, string[]> = {
  "nairobi": [
    "Nature Kenya",
    "Kenya Forest Heritage", 
    "Friends of Nairobi National Park",
    "Giraffe Centre (AFEW)",
    "Adventure Farm Karen"
  ],
  "laikipia": [
    "Ol Pejeta Conservancy"
  ],
  "samburu": [
    "Sera Conservancy",
    "Reteti Elephant Sanctuary", 
    "Koija Community",
    "Ruko Community Conservancy"
  ],
  "masai-mara": [
    "Mara Elephant Project"
  ],
  "coastal-kenya": [
    "Reefolution",
    "Colobus Conservation",
    "Local Ocean (Watamu)"
  ]
};

// Destination metadata
export interface DestinationInfo {
  id: Destination;
  name: string;
  description: string;
  experienceCount: number;
  partnerCount: number;
  themes: Theme[];
  heroImage: string;
  coordinates: [number, number];
}

export const DESTINATIONS_INFO: Record<Destination, DestinationInfo> = {
  "nairobi": {
    id: "nairobi",
    name: "Nairobi",
    description: "Kenya's vibrant capital offers unique urban wildlife experiences, from bird walks to giraffe encounters.",
    experienceCount: 7,
    partnerCount: 5,
    themes: ["Wildlife conservation", "Conservation education", "Community & cultural exploration"],
    heroImage: "/assets/destinations/nairobi-destination.jpg",
    coordinates: [-1.2921, 36.8219]
  },
  "laikipia": {
    id: "laikipia",
    name: "Laikipia",
    description: "Home to Kenya's largest population of black rhinos and innovative conservation programs.",
    experienceCount: 6,
    partnerCount: 1,
    themes: ["Wildlife conservation", "Conservation education"],
    heroImage: "/assets/destinations/laikipia-destination.jpg", 
    coordinates: [0.0755, 36.9070]
  },
  "samburu": {
    id: "samburu",
    name: "Samburu / Northern Kenya",
    description: "Experience authentic Samburu culture while supporting community-led conservation initiatives.",
    experienceCount: 3,
    partnerCount: 4,
    themes: ["Wildlife conservation", "Community & cultural exploration"],
    heroImage: "/assets/destinations/samburu-destination.jpg",
    coordinates: [1.4472, 37.0942]
  },
  "masai-mara": {
    id: "masai-mara", 
    name: "Maasai Mara",
    description: "Join cutting-edge research and conservation efforts in Kenya's most famous wildlife reserve.",
    experienceCount: 2,
    partnerCount: 1,
    themes: ["Wildlife conservation", "Conservation education"],
    heroImage: "/assets/destinations/masai-mara-destination.jpg",
    coordinates: [-1.2917, 35.1437]
  },
  "coastal-kenya": {
    id: "coastal-kenya",
    name: "Kenyan Coast", 
    description: "Protect marine ecosystems and discover coastal forest conservation along Kenya's Indian Ocean coastline.",
    experienceCount: 3,
    partnerCount: 3,
    themes: ["Wildlife conservation", "Conservation education"],
    heroImage: "/assets/destinations/coast-destination.jpg",
    coordinates: [-4.2331, 39.5792]
  }
};

// Experience theme mapping for consistent categorization
export const EXPERIENCE_THEMES: Record<string, Theme[]> = {
  // Nairobi
  "morning-bird-walk-with-nature-kenya": ["Conservation education"],
  "tree-walk-kenya-forest-heritage": ["Conservation education"],
  "dudu-walk-explore-the-world-of-insects": ["Conservation education"],
  "specialized-eco-tours-at-karura-forest": ["Conservation education"],
  "citizen-scientist-experience-at-nairobi-national-park": ["Wildlife conservation"],
  "meet-rothschild-giraffes-at-giraffe-nairobi-centre-with-afew": ["Wildlife conservation"],
  "sustainable-farm-experience-at-adventure-farm-karen": ["Community & cultural exploration"],

  // Laikipia
  "meet-the-last-northern-white-rhinos-at-ol-pejeta": ["Wildlife conservation"],
  "night-game-drive-at-ol-pejeta-conservancy": ["Wildlife conservation"],
  "become-a-k-9-handler-for-a-day-at-ol-pejeta": ["Conservation education"],
  "guided-bush-and-bird-walks-at-ol-pejeta": ["Conservation education"],
  "behind-the-scenes-ol-pejeta-chimpanzee-sanctuary": ["Wildlife conservation"], 
  "track-lions-and-aid-conservation-at-ol-pejeta": ["Wildlife conservation"],

  // Samburu
  "sera-on-foot-rhino-tracking": ["Wildlife conservation"],
  "community-led-elephant-experience-at-reteti": ["Wildlife conservation"],
  "koija-cultural-village": ["Community & cultural exploration"],

  // Maasai Mara
  "drones-for-conservation-with-mara-elephant-project": ["Wildlife conservation"],
  "elephant-researcher-experience-with-mara-elephant-project": ["Wildlife conservation"],

  // Coast
  "dive-into-coral-conservation-with-reefolution": ["Wildlife conservation"],
  "colobus-conservation-guided-primate-eco-tours": ["Wildlife conservation"],
  "ocean-wonders-learn-conserve-with-local-ocean-conservation-kenya": ["Conservation education"],
};
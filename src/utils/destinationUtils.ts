import { Experience } from '@/types';
import { Destination, Theme } from '@/data/partners';
import { DESTINATION_EXPERIENCES, DESTINATION_PARTNERS, DESTINATIONS_INFO, EXPERIENCE_SPECS } from '@/data/destinationData';

// Convert location text to destination
const getDestinationFromLocation = (locationText: string): Destination => {
  if (locationText.includes('Nairobi')) return 'nairobi';
  if (locationText.includes('Coast') || locationText.includes('Coastal')) return 'coastal-kenya';
  if (locationText.includes('Samburu')) return 'samburu';
  if (locationText.includes('Maasai Mara') || locationText.includes('Mara')) return 'masai-mara';
  if (locationText.includes('Laikipia')) return 'laikipia';
  return 'nairobi'; // default
};

// Convert Experience theme to Theme for filtering
const convertThemeToPartnerTheme = (theme: string): Theme => {
  switch (theme) {
    case 'Wildlife Conservation': return 'Wildlife conservation';
    case 'Conservation Education': return 'Conservation education';
    case 'Cultural Exploration': return 'Community & cultural exploration';
    default: return 'Wildlife conservation';
  }
};

// Filter experiences by destination
export const filterExperiencesByDestination = (experiences: Experience[], destination: Destination): Experience[] => {
  return experiences.filter(exp => {
    const expDestination = getDestinationFromLocation(exp.location_text);
    return expDestination === destination;
  });
};

// Filter experiences by multiple destinations
export const filterExperiencesByDestinations = (experiences: Experience[], destinations: Destination[]): Experience[] => {
  return experiences.filter(exp => {
    const expDestination = getDestinationFromLocation(exp.location_text);
    return destinations.includes(expDestination);
  });
};

// Get partners for a specific destination
export const getPartnersForDestination = (destination: Destination): string[] => {
  return DESTINATION_PARTNERS[destination] || [];
};

// Get experiences for a specific destination (by title)
export const getExperiencesForDestination = (destination: Destination): string[] => {
  return DESTINATION_EXPERIENCES[destination] || [];
};

// Get destination info
export const getDestinationInfo = (destination: Destination) => {
  return DESTINATIONS_INFO[destination];
};

// Get all destinations
export const getAllDestinations = () => {
  return Object.values(DESTINATIONS_INFO);
};

// Get duration and capacity for an experience by slug
export const getExperienceSpecs = (slug: string): { duration_hours: number; capacity: number | null } => {
  const specs = EXPERIENCE_SPECS[slug];
  if (specs) {
    return specs;
  }
  
  // Fallback to default values if not found
  return {
    duration_hours: 3,
    capacity: null
  };
};

// Filter experiences by theme within a destination
export const filterExperiencesByThemeAndDestination = (
  experiences: Experience[], 
  destination: Destination, 
  theme: Theme
): Experience[] => {
  return experiences.filter(exp => {
    const expDestination = getDestinationFromLocation(exp.location_text);
    const expTheme = convertThemeToPartnerTheme(exp.theme);
    return expDestination === destination && expTheme === theme;
  });
};

// Get unique themes for a destination
export const getThemesForDestination = (experiences: Experience[], destination: Destination): Theme[] => {
  const destinationExperiences = filterExperiencesByDestination(experiences, destination);
  const themes = new Set<Theme>();
  
  destinationExperiences.forEach(exp => {
    const expTheme = convertThemeToPartnerTheme(exp.theme);
    themes.add(expTheme);
  });
  
  return Array.from(themes);
};

// Get experience count for destination
export const getExperienceCountForDestination = (experiences: Experience[], destination: Destination): number => {
  return filterExperiencesByDestination(experiences, destination).length;
};

// Get partner count for destination  
export const getPartnerCountForDestination = (destination: Destination): number => {
  return getPartnersForDestination(destination).length;
};

// Search experiences within a destination
export const searchExperiencesInDestination = (
  experiences: Experience[], 
  destination: Destination, 
  searchTerm: string
): Experience[] => {
  const destinationExperiences = filterExperiencesByDestination(experiences, destination);
  const term = searchTerm.toLowerCase();
  
  return destinationExperiences.filter(exp =>
    exp.title.toLowerCase().includes(term) ||
    exp.description.toLowerCase().includes(term) ||
    exp.search_text.toLowerCase().includes(term)
  );
};

// Get destination from coordinates (reverse lookup)
export const getDestinationFromCoordinates = (lat: number, lng: number): Destination | null => {
  const destinations = Object.values(DESTINATIONS_INFO);
  let closestDestination: Destination | null = null;
  let minDistance = Infinity;
  
  destinations.forEach(dest => {
    const [destLat, destLng] = dest.coordinates;
    const distance = Math.sqrt(
      Math.pow(lat - destLat, 2) + Math.pow(lng - destLng, 2)
    );
    
    if (distance < minDistance) {
      minDistance = distance;
      closestDestination = dest.id;
    }
  });
  
  return closestDestination;
};

// Format destination name for display
export const formatDestinationName = (destination: Destination): string => {
  return DESTINATIONS_INFO[destination]?.name || destination;
};

// Get destination URL path
export const getDestinationPath = (destination: Destination): string => {
  const pathMapping: Record<Destination, string> = {
    "nairobi": "nairobi",
    "coastal-kenya": "coast", 
    "samburu": "samburu",
    "masai-mara": "masai-mara",
    "laikipia": "laikipia"
  };
  
  return pathMapping[destination] || destination;
};
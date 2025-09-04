// New mock data based on partners.ts experiences
import { Project, Experience, User, Booking, ImpactProof, ProjectCategory, ActivityType } from '@/types';
import { EXPERIENCES, Destination, Theme } from './partners';
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

// Convert partner theme to Experience theme (ProjectCategory)
const convertTheme = (partnerThemes: Theme[]): ProjectCategory => {
  if (partnerThemes.includes('Wildlife conservation')) return 'Wildlife Conservation';
  if (partnerThemes.includes('Conservation education')) return 'Conservation Education'; 
  if (partnerThemes.includes('Community & cultural exploration')) return 'Cultural Exploration';
  return 'Wildlife Conservation'; // default
};

// Convert activities to ActivityType
const convertActivityType = (activities: string[]): ActivityType => {
  if (activities.includes('tracking')) return 'Tracking';
  if (activities.includes('workshop')) return 'Workshop';
  if (activities.includes('education')) return 'Education';
  return 'Community';
};

// Convert partner destination to location text
const getLocationText = (destination: Destination): string => {
  switch (destination) {
    case 'nairobi': return 'Nairobi, Kenya';
    case 'coastal-kenya': return 'Coast Province, Kenya';
    case 'samburu': return 'Samburu County, Kenya';
    case 'masai-mara': return 'Maasai Mara, Kenya';
    case 'laikipia': return 'Laikipia County, Kenya';
    default: return 'Kenya';
  }
};

// Partner image mapping for conservation carousel
const PARTNER_CAROUSEL_IMAGES: Record<string, string> = {
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
};

// Generate projects from unique partners
const uniquePartners = [...new Set(EXPERIENCES.map(exp => exp.partner))];
export const mockProjects: Project[] = uniquePartners.map((partner, index) => {
  const partnerExperience = EXPERIENCES.find(exp => exp.partner === partner);
  const heroImage = PARTNER_CAROUSEL_IMAGES[partner] || '/img/ph1.jpg';
  
  return {
    id: (index + 1).toString(),
    name: partner,
    slug: partner.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    status: 'active' as const,
    category: convertTheme(partnerExperience?.themes || ['Wildlife conservation']),
    contact_email: `contact@${partner.toLowerCase().replace(/[^a-z0-9]+/g, '')}.org`,
    phone: `+254-70${index + 1}-123456`,
    location_text: getLocationText(partnerExperience?.destination || 'nairobi'),
    hero_image: heroImage,
    bio: `Supporting conservation and community development through sustainable tourism and education programs in Kenya.`,
    metrics_bookings_count: Math.floor(Math.random() * 50) + 10,
    metrics_funds_total: Math.floor(Math.random() * 100000) + 25000,
    created_at: '2023-04-01T10:00:00Z'
  };
});

// Convert partner experiences to mock experiences
export const mockExperiences: Experience[] = EXPERIENCES.map((partnerExp, index) => {
  const project = mockProjects.find(p => p.name === partnerExp.partner);
  
  return {
    id: (index + 1).toString(),
    project_id: project?.id || '1',
    title: partnerExp.title,
    slug: partnerExp.slug,
    description: partnerExp.description,
    images: partnerExp.images,
    location_text: getLocationText(partnerExp.destination),
    theme: convertTheme(partnerExp.themes),
    activity_type: convertActivityType(partnerExp.activities),
    duration_hours: Math.floor(Math.random() * 6) + 2, // 2-8 hours
    base_price: partnerExp.priceKESAdult, // Use correct KES pricing
    currency: 'KES',
    allocation_pct_project: 90,
    allocation_pct_platform: 10,
    capacity: Math.floor(Math.random() * 15) + 5, // 5-20 people
    visible_on_marketplace: partnerExp.visibleOnMarketplace,
    search_text: `${partnerExp.title.toLowerCase()} ${partnerExp.activities.join(' ')} ${partnerExp.destination} ${partnerExp.themes.join(' ')}`,
    created_at: '2023-04-01T10:00:00Z'
  };
});

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Safari',
    email: 'john@example.com',
    photo: '/img/ph1.jpg',
    role: 'traveler',
    created_at: '2023-04-01T10:00:00Z'
  },
  {
    id: '2',
    name: 'Conservation Partner',
    email: 'partner@conservation.org',
    role: 'partner',
    partner_ref: 'PARTNER001',
    created_at: '2023-04-01T10:00:00Z'
  }
];

export const mockBookings: Booking[] = [
  {
    id: '1',
    experience_id: '1',
    project_id: '1',
    user_id: '1',
    qty: 2,
    total_amount: 700,
    currency: 'USD',
    traveler_name: 'John Safari',
    traveler_email: 'john@example.com',
    status: 'paid',
    channel: 'Marketplace',
    created_at: '2023-04-01T10:00:00Z'
  }
];

export const mockImpactProofs: ImpactProof[] = [
  {
    id: '1',
    booking_id: '1',
    project_id: '1',
    due_date: '2023-05-01',
    submitted_at: '2023-04-28T10:00:00Z',
    media: ['/img/ph1.jpg'],
    short_text: 'Successful wildlife tracking session with 2 participants',
    status: 'approved',
    created_at: '2023-04-28T10:00:00Z'
  }
];
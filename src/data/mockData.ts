// Mock data for NatuAsili platform
import { Project, Experience, User, Booking, ImpactProof } from '@/types';

// Import real images
import bigFiveTracking from '@/assets/big-five-tracking.jpg';
import beadworkWorkshop from '@/assets/beadwork-workshop.jpg';
import mangroveRestoration from '@/assets/mangrove-restoration.jpg';
import maasaiMaraProject from '@/assets/maasai-mara-project.jpg';
import samburuEducation from '@/assets/samburu-education.jpg';
import coastalForest from '@/assets/coastal-forest.jpg';
import natureKenyaBirdwatching from '@/assets/nature-kenya-birdwatching.jpg';
import nairobiParkCleanup from '@/assets/nairobi-park-cleanup.jpg';
import karuraForestPlanting from '@/assets/karura-forest-planting.jpg';
import maraElephantTracking from '@/assets/mara-elephant-tracking.jpg';
import olPejeteRhino from '@/assets/ol-pejeta-rhino.jpg';
import retetiElephantOrphanage from '@/assets/reteti-elephant-orphanage.jpg';
import colobusConservation from '@/assets/colobus-conservation.jpg';
import localOceanConservation from '@/assets/local-ocean-conservation.jpg';
import giraffeCentre from '@/assets/giraffe-centre.jpg';
import northernWhiteRhinos from '@/assets/northern-white-rhinos.jpg';
import nightGameDrive from '@/assets/night-game-drive.jpg';
import chimpanzeeSanctuary from '@/assets/chimpanzee-sanctuary.jpg';
import k9HandlerTraining from '@/assets/k9-handler-training.jpg';
import lionTracking from '@/assets/lion-tracking.jpg';

export const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Maasai Mara Wildlife Conservancy',
    slug: 'maasai-mara-wildlife',
    status: 'active',
    category: 'Wildlife',
    contact_email: 'contact@maasaimara.org',
    phone: '+254-701-234567',
    location_text: 'Maasai Mara, Narok County, Kenya',
    hero_image: maasaiMaraProject,
    bio: 'Protecting the iconic Maasai Mara ecosystem and supporting local Maasai communities through sustainable conservation practices and wildlife protection initiatives.',
    metrics_bookings_count: 45,
    metrics_funds_total: 125000,
    created_at: '2023-01-15T10:00:00Z'
  },
  {
    id: '2',
    name: 'Samburu Education Initiative',
    slug: 'samburu-education',
    status: 'active',
    category: 'Education',
    contact_email: 'learn@samburu.edu',
    phone: '+254-702-345678',
    location_text: 'Samburu County, Kenya',
    hero_image: samburuEducation,
    bio: 'Empowering Samburu children through quality education while preserving traditional knowledge and culture.',
    metrics_bookings_count: 28,
    metrics_funds_total: 78000,
    created_at: '2023-02-20T10:00:00Z'
  },
  {
    id: '3',
    name: 'Coastal Forest Restoration',
    slug: 'coastal-forest-restoration',
    status: 'active',
    category: 'Habitat',
    contact_email: 'restore@coastal.org',
    phone: '+254-703-456789',
    location_text: 'Kilifi County, Kenya',
    hero_image: coastalForest,
    bio: 'Restoring degraded coastal forests and mangrove ecosystems while supporting local fishing communities.',
    metrics_bookings_count: 32,
    metrics_funds_total: 95000,
    created_at: '2023-03-10T10:00:00Z'
  },
  {
    id: '4',
    name: 'Nature Kenya',
    slug: 'nature-kenya',
    status: 'active',
    category: 'Wildlife',
    contact_email: 'info@naturekenya.org',
    phone: '+254-704-567890',
    location_text: 'Nairobi, Kenya',
    hero_image: natureKenyaBirdwatching,
    bio: 'Kenya\'s premier bird conservation organization working to protect bird species and their habitats through research, education, and community engagement.',
    metrics_bookings_count: 18,
    metrics_funds_total: 42000,
    created_at: '2023-04-05T10:00:00Z'
  },
  {
    id: '5',
    name: 'Friends of Nairobi National Park',
    slug: 'friends-nairobi-park',
    status: 'active',
    category: 'Habitat',
    contact_email: 'friends@nairobinationalpark.org',
    phone: '+254-705-678901',
    location_text: 'Nairobi National Park, Kenya',
    hero_image: nairobiParkCleanup,
    bio: 'Dedicated to protecting Nairobi National Park through community involvement, conservation education, and environmental cleanup initiatives.',
    metrics_bookings_count: 25,
    metrics_funds_total: 68000,
    created_at: '2023-04-12T10:00:00Z'
  },
  {
    id: '6',
    name: 'Friends of Karura Forest',
    slug: 'friends-karura-forest',
    status: 'active',
    category: 'Habitat',
    contact_email: 'info@karuraforest.org',
    phone: '+254-706-789012',
    location_text: 'Karura Forest, Nairobi, Kenya',
    hero_image: karuraForestPlanting,
    bio: 'Protecting and restoring Karura Forest through tree planting, trail maintenance, and environmental education programs.',
    metrics_bookings_count: 22,
    metrics_funds_total: 58000,
    created_at: '2023-04-18T10:00:00Z'
  },
  {
    id: '7',
    name: 'Mara Elephant Project',
    slug: 'mara-elephant-project',
    status: 'active',
    category: 'Wildlife',
    contact_email: 'contact@maraelephantproject.org',
    phone: '+254-707-890123',
    location_text: 'Maasai Mara Ecosystem, Kenya',
    hero_image: maraElephantTracking,
    bio: 'Dedicated to elephant conservation in the Maasai Mara through research, monitoring, and community-based conservation programs.',
    metrics_bookings_count: 35,
    metrics_funds_total: 98000,
    created_at: '2023-04-25T10:00:00Z'
  },
  {
    id: '8',
    name: 'Ol Pejeta Conservancy',
    slug: 'ol-pejeta-conservancy',
    status: 'active',
    category: 'Wildlife',
    contact_email: 'info@olpejetaconservancy.org',
    phone: '+254-708-901234',
    location_text: 'Laikipia County, Kenya',
    hero_image: olPejeteRhino,
    bio: 'Leading wildlife conservancy in East Africa, home to the last two northern white rhinos and pioneering conservation technologies.',
    metrics_bookings_count: 41,
    metrics_funds_total: 156000,
    created_at: '2023-05-02T10:00:00Z'
  }
];

export const mockExperiences: Experience[] = [
  {
    id: '1',
    project_id: '1',
    title: 'Big Five Wildlife Tracking Experience',
    slug: 'big-five-tracking',
    description: 'Join our expert guides for an unforgettable wildlife tracking experience in the heart of Maasai Mara. Learn traditional tracking techniques while contributing to wildlife conservation research.',
    images: [bigFiveTracking, maasaiMaraProject],
    location_text: 'Maasai Mara National Reserve',
    theme: 'Wildlife',
    activity_type: 'Tracking',
    duration_hours: 3,
    base_price: 350,
    currency: 'USD',
    allocation_pct_project: 90,
    allocation_pct_platform: 10,
    capacity: 8,
    visible_on_marketplace: true,
    search_text: 'big five wildlife tracking maasai mara safari conservation',
    created_at: '2023-04-01T10:00:00Z'
  },
  {
    id: '2',
    project_id: '2',
    title: 'Traditional Beadwork Workshop',
    slug: 'beadwork-workshop',
    description: 'Learn the ancient art of Samburu beadwork from master craftswomen while supporting local artisan communities and preserving cultural heritage.',
    images: [beadworkWorkshop, samburuEducation],
    location_text: 'Samburu Cultural Center',
    theme: 'Education',
    activity_type: 'Workshop',
    duration_hours: 2,
    base_price: 120,
    currency: 'USD',
    allocation_pct_project: 90,
    allocation_pct_platform: 10,
    capacity: 12,
    visible_on_marketplace: true,
    search_text: 'samburu beadwork workshop culture traditional education',
    created_at: '2023-04-15T10:00:00Z'
  },
  {
    id: '3',
    project_id: '3',
    title: 'Mangrove Restoration Volunteer Day',
    slug: 'mangrove-restoration',
    description: 'Get your hands dirty planting mangrove seedlings and learning about coastal ecosystem restoration from marine biologists.',
    images: [mangroveRestoration, coastalForest],
    location_text: 'Kilifi Creek, Kenya Coast',
    theme: 'Habitat',
    activity_type: 'Community',
    duration_hours: 2.5,
    base_price: 85,
    currency: 'USD',
    allocation_pct_project: 90,
    allocation_pct_platform: 10,
    capacity: 15,
    visible_on_marketplace: true,
    search_text: 'mangrove restoration coastal habitat volunteer conservation',
    created_at: '2023-05-01T10:00:00Z'
  },
  {
    id: '4',
    project_id: '4',
    title: 'Urban Bird Watching Safari',
    slug: 'urban-bird-watching',
    description: 'Discover the incredible diversity of bird species in urban environments with Nature Kenya experts. Learn bird identification and contribute to citizen science.',
    images: [natureKenyaBirdwatching],
    location_text: 'Nairobi Arboretum',
    theme: 'Wildlife',
    activity_type: 'Tracking',
    duration_hours: 3,
    base_price: 75,
    currency: 'USD',
    allocation_pct_project: 90,
    allocation_pct_platform: 10,
    capacity: 10,
    visible_on_marketplace: true,
    search_text: 'bird watching urban safari nairobi nature conservation',
    created_at: '2023-05-10T10:00:00Z'
  },
  {
    id: '5',
    project_id: '5',
    title: 'National Park Cleanup & Wildlife Walk',
    slug: 'park-cleanup-wildlife-walk',
    description: 'Join us for a morning cleanup of Nairobi National Park followed by a guided wildlife walk. Help protect Kenya\'s first national park.',
    images: [nairobiParkCleanup],
    location_text: 'Nairobi National Park',
    theme: 'Habitat',
    activity_type: 'Community',
    duration_hours: 4,
    base_price: 95,
    currency: 'USD',
    allocation_pct_project: 90,
    allocation_pct_platform: 10,
    capacity: 20,
    visible_on_marketplace: true,
    search_text: 'cleanup national park wildlife nairobi conservation volunteer',
    created_at: '2023-05-15T10:00:00Z'
  },
  {
    id: '6',
    project_id: '6',
    title: 'Forest Conservation Tree Planting',
    slug: 'forest-tree-planting',
    description: 'Plant indigenous trees in Karura Forest and learn about forest ecosystem conservation. Each participant plants 5 trees with GPS tracking.',
    images: [karuraForestPlanting],
    location_text: 'Karura Forest Reserve',
    theme: 'Habitat',
    activity_type: 'Community',
    duration_hours: 3,
    base_price: 65,
    currency: 'USD',
    allocation_pct_project: 90,
    allocation_pct_platform: 10,
    capacity: 25,
    visible_on_marketplace: true,
    search_text: 'tree planting forest conservation karura habitat restoration',
    created_at: '2023-05-20T10:00:00Z'
  },
  {
    id: '7',
    project_id: '7',
    title: 'Elephant Tracking & Research Experience',
    slug: 'elephant-tracking-research',
    description: 'Join researchers from Mara Elephant Project for an immersive elephant tracking experience. Learn about elephant behavior and conservation.',
    images: [maraElephantTracking],
    location_text: 'Maasai Mara Greater Ecosystem',
    theme: 'Wildlife',
    activity_type: 'Tracking',
    duration_hours: 6,
    base_price: 280,
    currency: 'USD',
    allocation_pct_project: 90,
    allocation_pct_platform: 10,
    capacity: 6,
    visible_on_marketplace: true,
    search_text: 'elephant tracking research mara wildlife conservation',
    created_at: '2023-05-25T10:00:00Z'
  },
  {
    id: '8',
    project_id: '8',
    title: 'Rhino Conservation & Technology Tour',
    slug: 'rhino-conservation-tech',
    description: 'Experience cutting-edge conservation technology at Ol Pejeta. Meet the last northern white rhinos and learn about conservation innovation.',
    images: [olPejeteRhino],
    location_text: 'Ol Pejeta Conservancy',
    theme: 'Wildlife',
    activity_type: 'Education',
    duration_hours: 5,
    base_price: 320,
    currency: 'USD',
    allocation_pct_project: 90,
    allocation_pct_platform: 10,
    capacity: 8,
    visible_on_marketplace: true,
    search_text: 'rhino conservation technology ol pejeta wildlife innovation',
    created_at: '2023-05-30T10:00:00Z'
  }
];

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    role: 'traveler',
    phone: '+1-555-123-4567',
    created_at: '2023-01-01T10:00:00Z'
  },
  {
    id: '2',
    name: 'David Kimani',
    email: 'david@maasaimara.org',
    role: 'partner',
    partner_ref: '1',
    phone: '+254-701-234567',
    created_at: '2023-01-15T10:00:00Z'
  },
  {
    id: '3',
    name: 'Admin User',
    email: 'admin@natuasili.com',
    role: 'admin',
    created_at: '2022-12-01T10:00:00Z'
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
    traveler_name: 'Sarah Johnson',
    traveler_email: 'sarah@example.com',
    status: 'paid',
    channel: 'Marketplace',
    receipt_url: 'https://receipts.natuasili.com/receipt-1',
    created_at: '2023-06-01T10:00:00Z'
  }
];

export const mockImpactProofs: ImpactProof[] = [
  {
    id: '1',
    booking_id: '1',
    project_id: '1',
    due_date: '2023-08-01',
    submitted_at: '2023-07-28T14:30:00Z',
    media: [bigFiveTracking],
    short_text: 'Successfully tracked and documented 3 lion prides, contributing valuable data to our conservation research.',
    status: 'approved',
    created_at: '2023-06-01T10:00:00Z'
  }
];
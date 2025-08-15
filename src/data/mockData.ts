// Mock data for NatuAsili platform
import { Project, Experience, User, Booking, ImpactProof } from '@/types';

// Import real images
import bigFiveTracking from '@/assets/big-five-tracking.jpg';
import beadworkWorkshop from '@/assets/beadwork-workshop.jpg';
import mangroveRestoration from '@/assets/mangrove-restoration.jpg';
import maasaiMaraProject from '@/assets/maasai-mara-project.jpg';
import samburuEducation from '@/assets/samburu-education.jpg';
import coastalForest from '@/assets/coastal-forest.jpg';

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
    allocation_pct_project: 75,
    allocation_pct_platform: 25,
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
    allocation_pct_project: 80,
    allocation_pct_platform: 20,
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
    allocation_pct_project: 70,
    allocation_pct_platform: 30,
    capacity: 15,
    visible_on_marketplace: true,
    search_text: 'mangrove restoration coastal habitat volunteer conservation',
    created_at: '2023-05-01T10:00:00Z'
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
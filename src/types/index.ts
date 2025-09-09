// NatuAsili Data Types

export type UserRole = 'traveler' | 'partner' | 'admin';
export type ProjectStatus = 'pending' | 'active' | 'suspended';
export type ProjectCategory = 'Wildlife Conservation' | 'Cultural Exploration' | 'Conservation Education' | 'Habitat';
export type ActivityType = 'Tracking' | 'Community' | 'Workshop' | 'Education';
export type BookingStatus = 'pending' | 'paid' | 'cancelled' | 'refunded';
export type PaymentStatus = 'pending' | 'succeeded' | 'failed' | 'refunded';
export type Channel = 'Marketplace' | 'Widget';
export type EntryType = 'allocation' | 'payout' | 'refund' | 'reversal';
export type ToType = 'project' | 'platform';
export type ImpactStatus = 'pending' | 'approved' | 'revision';
export type DisbursementStatus = 'scheduled' | 'sent' | 'failed';

export interface User {
  id: string;
  name: string;
  email: string;
  photo?: string;
  role: UserRole;
  partner_ref?: string;
  phone?: string;
  created_at: string;
}

export interface Project {
  id: string;
  name: string;
  slug: string;
  status: ProjectStatus;
  category: ProjectCategory;
  contact_email: string;
  phone?: string;
  location_text: string;
  hero_image?: string;
  bio: string;
  metrics_bookings_count: number;
  metrics_funds_total: number;
  created_at: string;
}

export interface Experience {
  id: string;
  project_id: string;
  project?: Project;
  title: string;
  slug: string;
  description: string;
  images: string[];
  location_text: string;
  theme: ProjectCategory;
  activity_type: ActivityType;
  duration_hours: number;
  base_price: number;
  currency: string;
  allocation_pct_project: number;
  allocation_pct_platform: number;
  capacity: number;
  visible_on_marketplace: boolean;
  search_text: string;
  created_at: string;
}

export interface Booking {
  id: string;
  experience_id: string;
  experience?: Experience;
  project_id: string;
  project?: Project;
  user_id: string;
  user?: User;
  qty: number;
  total_amount: number;
  currency: string;
  traveler_name: string;
  traveler_email: string;
  status: BookingStatus;
  channel: Channel;
  receipt_url?: string;
  created_at: string;
}

export interface Payment {
  id: string;
  booking_id: string;
  booking?: Booking;
  status: PaymentStatus;
  amount: number;
  currency: string;
  tx_ref?: string;
  verified: boolean;
  split_snapshot_json?: string;
  created_at: string;
}

export interface ImpactProof {
  id: string;
  booking_id: string;
  booking?: Booking;
  project_id: string;
  project?: Project;
  due_date: string;
  submitted_at?: string;
  media: string[];
  short_text?: string;
  status: ImpactStatus;
  created_at: string;
}

export interface ImpactLedgerEntry {
  id: string;
  booking_id: string;
  booking?: Booking;
  project_id: string;
  project?: Project;
  entry_type: EntryType;
  to_type: ToType;
  amount: number;
  currency: string;
  timestamp: string;
  meta?: string;
}

export interface Disbursement {
  id: string;
  project_id: string;
  project?: Project;
  booking_id?: string;
  booking?: Booking;
  amount: number;
  currency: string;
  status: DisbursementStatus;
  external_ref?: string;
  created_at: string;
}
import { supabase } from "@/integrations/supabase/client";
import type { Database } from '@/integrations/supabase/types';

// Custom Profile type that includes all the fields from our migration
export interface Profile {
  id: string;
  email: string;
  role: 'traveler' | 'partner' | 'admin';
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  preferences: any;
  created_at: string | null;
  updated_at: string | null;
}

export async function fetchProfile(userId: string): Promise<Profile | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
    
    return data as Profile;
  } catch (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
}

export async function createProfile(userId: string, email: string, role: 'traveler' | 'partner' = 'traveler'): Promise<Profile | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        email,
        role
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating profile:', error);
      return null;
    }
    
    return data as Profile;
  } catch (error) {
    console.error('Error creating profile:', error);
    return null;
  }
}

export async function updateProfile(userId: string, updates: Partial<Pick<Profile, 'first_name' | 'last_name' | 'avatar_url'>>): Promise<Profile | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating profile:', error);
      return null;
    }
    
    return data as Profile;
  } catch (error) {
    console.error('Error updating profile:', error);
    return null;
  }
}

export function getAvatarFallback(profile: Profile | null): string {
  if (!profile) return 'U';
  
  const fullName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim();
  if (fullName) {
    const names = fullName.split(' ');
    return names.length >= 2 
      ? `${names[0][0]}${names[1][0]}`.toUpperCase()
      : names[0][0].toUpperCase();
  }
  
  return profile.email?.[0]?.toUpperCase() || 'U';
}

export function getDashboardPath(role: string): string {
  switch (role) {
    case 'admin':
      return '/dashboard/admin';
    case 'partner':
      return '/dashboard/partner';
    case 'traveler':
    default:
      return '/dashboard/traveler';
  }
}
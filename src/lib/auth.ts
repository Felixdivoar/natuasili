import { supabase } from "@/integrations/supabase/client";
import type { Database } from '@/integrations/supabase/types';

export type Profile = Database['public']['Tables']['profiles']['Row'];

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
    
    return data;
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
    
    return data;
  } catch (error) {
    console.error('Error creating profile:', error);
    return null;
  }
}

export async function updateProfile(userId: string, updates: Partial<Pick<Profile, 'full_name' | 'avatar_url'>>): Promise<Profile | null> {
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
    
    return data;
  } catch (error) {
    console.error('Error updating profile:', error);
    return null;
  }
}

export function getAvatarFallback(profile: Profile | null): string {
  if (!profile) return 'U';
  
  if (profile.full_name) {
    const names = profile.full_name.split(' ');
    return names.length >= 2 
      ? `${names[0][0]}${names[1][0]}`.toUpperCase()
      : names[0][0].toUpperCase();
  }
  
  return profile.email[0].toUpperCase();
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
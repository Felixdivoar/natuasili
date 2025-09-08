import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthUser {
  id: string;
  email: string;
  fullName?: string;
  role: 'admin' | 'partner' | 'user';
  avatarUrl?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function SimpleAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Convert Supabase user to our AuthUser format
  const mapUser = async (supabaseUser: User): Promise<AuthUser> => {
    console.log('🔐 Mapping user:', supabaseUser.id);
    
    // Return user immediately with default role to prevent hanging
    const defaultUser: AuthUser = {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      fullName: supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.name,
      role: 'user',
      avatarUrl: supabaseUser.user_metadata?.avatar_url
    };

    try {
      // Fetch user role from database with timeout
      const { data: roleData, error } = await Promise.race([
        supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', supabaseUser.id)
          .maybeSingle(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Role fetch timeout')), 3000)
        )
      ]) as any;

      if (roleData?.role) {
        console.log('🔐 Found user role:', roleData.role);
        return { ...defaultUser, role: roleData.role };
      }

      console.log('🔐 No role found, using default');
      return defaultUser;
    } catch (error) {
      console.error('🔐 Error fetching user role, using default:', error);
      return defaultUser;
    }
  };

  useEffect(() => {
    console.log('🔐 SimpleAuth: Initializing');

    // Check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      console.log('🔐 Initial session check:', !!session);
      if (session?.user) {
        console.log('🔐 SimpleAuth: Found existing session');
        try {
          const authUser = await mapUser(session.user);
          setUser(authUser);
        } catch (error) {
          console.error('🔐 Error mapping existing user:', error);
        }
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔐 SimpleAuth: Auth state changed', { event, hasSession: !!session });
      
      if (session?.user) {
        try {
          const authUser = await mapUser(session.user);
          setUser(authUser);
          console.log('🔐 User set successfully:', authUser.email);
        } catch (error) {
          console.error('🔐 Error mapping user on auth change:', error);
        }
      } else {
        setUser(null);
        console.log('🔐 User cleared');
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName?: string) => {
    console.log('🔐 Starting signup process');
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: fullName ? { full_name: fullName } : undefined
        }
      });
      
      console.log('🔐 Signup result:', { data: !!data, error: !!error });
      return { error };
    } catch (err) {
      console.error('🔐 Signup error:', err);
      return { error: err };
    }
  };

  const signIn = async (email: string, password: string) => {
    console.log('🔐 Starting signin process');
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      console.log('🔐 Signin result:', { data: !!data, error: !!error });
      return { error };
    } catch (err) {
      console.error('🔐 Signin error:', err);
      return { error: err };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signUp,
      signIn,
      signOut,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useSimpleAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useSimpleAuth must be used within SimpleAuthProvider');
  }
  return context;
};
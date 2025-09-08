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
    try {
      // Fetch user role from database
      const { data: roleData, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', supabaseUser.id)
        .single();

      // If no role exists, create a default 'user' role
      if (error && error.code === 'PGRST116') {
        console.log('🔐 No role found, creating default user role');
        await supabase
          .from('user_roles')
          .insert({ user_id: supabaseUser.id, role: 'user' });
      }

      return {
        id: supabaseUser.id,
        email: supabaseUser.email || '',
        fullName: supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.name,
        role: roleData?.role || 'user',
        avatarUrl: supabaseUser.user_metadata?.avatar_url
      };
    } catch (error) {
      console.error('Error fetching user role:', error);
      return {
        id: supabaseUser.id,
        email: supabaseUser.email || '',
        fullName: supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.name,
        role: 'user',
        avatarUrl: supabaseUser.user_metadata?.avatar_url
      };
    }
  };

  useEffect(() => {
    console.log('🔐 SimpleAuth: Initializing');

    // Check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        console.log('🔐 SimpleAuth: Found existing session');
        const authUser = await mapUser(session.user);
        setUser(authUser);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔐 SimpleAuth: Auth state changed', { event, hasSession: !!session });
      
      if (session?.user) {
        const authUser = await mapUser(session.user);
        setUser(authUser);
      } else {
        setUser(null);
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
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

// Simplified user type for the app
export type AppUser = {
  id: string;
  email: string;
  fullName?: string;
  role?: 'admin' | 'partner' | 'user';
  avatarUrl?: string;
};

interface AuthContextType {
  user: AppUser | null;
  session: Session | null;
  userRole: 'admin' | 'partner' | 'user' | null;
  loading: boolean;
  signUp: (email: string, password: string, metadata?: any) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Transform Supabase user to simplified app user
function mapUser(session: Session | null): AppUser | null {
  if (!session?.user) return null;
  
  return {
    id: session.user.id,
    email: session.user.email || '',
    fullName: session.user.user_metadata?.full_name || session.user.user_metadata?.name,
    avatarUrl: session.user.user_metadata?.avatar_url,
  };
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<'admin' | 'partner' | 'user' | null>(null);
  const [loading, setLoading] = useState(true);

  // Helper function to update user with role
  const updateUserWithRole = async (session: Session | null) => {
    if (!session?.user) {
      setUser(null);
      setUserRole(null);
      setLoading(false);
      return;
    }

    const appUser = mapUser(session);
    console.log("🔐 Auth: Processing user session", { userId: session.user.id, email: session.user.email });
    
    try {
      const { data: roles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id)
        .single();
      
      const role = roles?.role || 'user';
      console.log("🔐 Auth: Role fetched", { role });
      
      setUserRole(role);
      if (appUser) {
        const userWithRole = { ...appUser, role };
        setUser(userWithRole);
        console.log("🔐 Auth: User state updated", userWithRole);
      }
    } catch (error) {
      console.error('🔐 Auth: Error fetching user role, defaulting to user', error);
      setUserRole('user');
      if (appUser) {
        const userWithRole = { ...appUser, role: 'user' as const };
        setUser(userWithRole);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    console.log("🔐 Auth: Initializing auth context");
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("🔐 Auth: State change event", { event, hasSession: !!session });
        setSession(session);
        // Don't use setTimeout here - update immediately
        updateUserWithRole(session);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("🔐 Auth: Initial session check", { hasSession: !!session });
      setSession(session);
      updateUserWithRole(session);
    });

    return () => {
      console.log("🔐 Auth: Cleanup subscription");
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, metadata?: any) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: metadata
      }
    });
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setUserRole(null);
    return { error };
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      userRole,
      loading,
      signUp,
      signIn,
      signOut,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
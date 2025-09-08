import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'partner' | 'user';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { user, loading } = useSimpleAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Redirect to auth page with return URL
        navigate(`/auth?returnUrl=${encodeURIComponent(location.pathname)}`);
        return;
      }

      if (requiredRole && user?.role !== requiredRole && user?.role !== 'admin') {
        // User doesn't have required role
        navigate('/');
        return;
      }
    }
  }, [user, user?.role, loading, navigate, location, requiredRole]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || (requiredRole && user.role !== requiredRole && user.role !== 'admin')) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
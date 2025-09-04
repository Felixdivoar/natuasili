import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'partner' | 'user';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { user, userRole, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Redirect to auth page with return URL
        navigate(`/auth?returnUrl=${encodeURIComponent(location.pathname)}`);
        return;
      }

      if (requiredRole && userRole !== requiredRole && userRole !== 'admin') {
        // User doesn't have required role
        navigate('/');
        return;
      }
    }
  }, [user, userRole, loading, navigate, location, requiredRole]);

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

  if (!user || (requiredRole && userRole !== requiredRole && userRole !== 'admin')) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
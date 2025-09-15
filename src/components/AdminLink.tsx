import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings, Shield } from 'lucide-react';
import { useAdmin } from '@/hooks/useAdmin';
import { useAuth } from '@/contexts/AuthContext';

const AdminLink = () => {
  const { user } = useAuth();
  const { isAdmin, loading } = useAdmin();

  // Don't show anything while loading or if user is not admin
  if (loading || !user || !isAdmin) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Link to="/admin">
        <Button 
          className="bg-red-600 hover:bg-red-700 text-white shadow-lg"
          size="sm"
        >
          <Shield className="h-4 w-4 mr-2" />
          Admin Panel
          <Badge className="ml-2 bg-red-700 text-white">
            Admin
          </Badge>
        </Button>
      </Link>
    </div>
  );
};

export default AdminLink;
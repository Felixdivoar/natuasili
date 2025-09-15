import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { Eye, Edit, Trash2, Search, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PartnerProfile {
  id: string;
  user_id: string;
  org_name: string;
  slug: string;
  bio: string | null;
  location: string | null;
  logo: string | null;
  kyc_status: string;
  created_at: string;
  updated_at: string;
}

const AdminPartners = () => {
  const [partners, setPartners] = useState<PartnerProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      const { data, error } = await supabase
        .from('partner_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPartners(data || []);
    } catch (error) {
      console.error('Error fetching partners:', error);
      toast({
        title: "Error",
        description: "Failed to fetch partners",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updatePartnerStatus = async (partnerId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('partner_profiles')
        .update({ kyc_status: newStatus })
        .eq('id', partnerId);

      if (error) throw error;
      
      await fetchPartners();
      toast({
        title: "Success",
        description: `Partner status updated to ${newStatus}`,
      });
    } catch (error) {
      console.error('Error updating partner status:', error);
      toast({
        title: "Error", 
        description: "Failed to update partner status",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const filteredPartners = partners.filter(partner =>
    partner.org_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    partner.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (partner.location && partner.location.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading Partners...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-muted animate-pulse rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Partner Management</CardTitle>
              <CardDescription>
                Manage partner profiles, approval status, and details
              </CardDescription>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Partner
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search partners..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="text-sm text-muted-foreground">
              {filteredPartners.length} partner{filteredPartners.length !== 1 ? 's' : ''}
            </div>
          </div>

          <div className="space-y-4">
            {filteredPartners.map((partner) => (
              <Card key={partner.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 bg-muted rounded-full flex items-center justify-center">
                        {partner.logo ? (
                          <img 
                            src={partner.logo} 
                            alt={partner.org_name}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-lg font-semibold text-muted-foreground">
                            {partner.org_name.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-foreground">
                            {partner.org_name}
                          </h3>
                          {getStatusBadge(partner.kyc_status)}
                        </div>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p>Slug: /{partner.slug}</p>
                          {partner.location && <p>Location: {partner.location}</p>}
                          <p>Joined: {new Date(partner.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {partner.kyc_status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => updatePartnerStatus(partner.id, 'approved')}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => updatePartnerStatus(partner.id, 'rejected')}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                      {partner.kyc_status === 'approved' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updatePartnerStatus(partner.id, 'pending')}
                        >
                          Set Pending
                        </Button>
                      )}
                      {partner.kyc_status === 'rejected' && (
                        <Button
                          size="sm"
                          onClick={() => updatePartnerStatus(partner.id, 'approved')}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Approve
                        </Button>
                      )}
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {partner.bio && (
                    <div className="mt-3 pt-3 border-t">
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {partner.bio}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredPartners.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No partners found matching your search.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPartners;
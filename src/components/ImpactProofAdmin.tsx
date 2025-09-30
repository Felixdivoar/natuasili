import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, XCircle, Eye, Clock, MessageSquare, Loader2, Image } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface ImpactProof {
  id: string;
  booking_id: string;
  url: string;
  caption: string | null;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  reviewed_by: string | null;
  reviewed_at: string | null;
  admin_notes: string | null;
  booking?: {
    customer_name: string;
    booking_date: string;
    experience: {
      title: string;
      partner_profiles: {
        org_name: string;
      };
    };
  };
}

const ImpactProofAdmin: React.FC = () => {
  const { user, profile } = useAuth();
  const [proofs, setProofs] = useState<ImpactProof[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProof, setSelectedProof] = useState<ImpactProof | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('pending');

  // Check if user is admin
  if (!user || profile?.role !== 'admin') {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">Access denied. Admin privileges required.</p>
        </CardContent>
      </Card>
    );
  }

  useEffect(() => {
    fetchImpactProofs();
    
    // Set up real-time subscription
    const channel = supabase
      .channel('impact-proofs-admin')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'impact_proofs'
        },
        (payload) => {
          console.log('Impact proof change detected:', payload);
          fetchImpactProofs();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchImpactProofs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('impact_proofs')
        .select(`
          *,
          bookings (
            customer_name,
            booking_date,
            experiences (
              title,
              partner_profiles (
                org_name
              )
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProofs((data || []) as ImpactProof[]);
    } catch (error) {
      console.error('Error fetching impact proofs:', error);
      toast.error('Failed to load impact proofs');
    } finally {
      setLoading(false);
    }
  };

  const handleProofAction = async (proofId: string, action: 'approved' | 'rejected') => {
    if (!user) return;

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('impact_proofs')
        .update({
          status: action,
          reviewed_by: user.id,
          reviewed_at: new Date().toISOString(),
          admin_notes: adminNotes.trim() || null
        })
        .eq('id', proofId);

      if (error) throw error;

      toast.success(`Impact proof ${action} successfully`);
      setSelectedProof(null);
      setAdminNotes('');
      fetchImpactProofs();
    } catch (error) {
      console.error(`Error ${action} impact proof:`, error);
      toast.error(`Failed to ${action.slice(0, -1)} impact proof`);
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-foreground text-background"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-foreground text-background"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge className="bg-foreground text-background"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
    }
  };

  const filteredProofs = proofs.filter(proof => {
    if (activeTab === 'all') return true;
    return proof.status === activeTab;
  });

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            Loading impact proofs...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Impact Proof Management</CardTitle>
          <p className="text-muted-foreground">
            Review and approve impact stories and verification media from conservation partners
          </p>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="overflow-x-auto pb-2 -mx-2 px-2 sm:mx-0 sm:px-0 scrollbar-hide">
              <TabsList className="inline-flex min-w-full sm:min-w-0 gap-1">
                <TabsTrigger value="pending" className="flex-shrink-0 whitespace-nowrap px-4 py-2">
                  Pending ({proofs.filter(p => p.status === 'pending').length})
                </TabsTrigger>
                <TabsTrigger value="approved" className="flex-shrink-0 whitespace-nowrap px-4 py-2">
                  Approved ({proofs.filter(p => p.status === 'approved').length})
                </TabsTrigger>
                <TabsTrigger value="rejected" className="flex-shrink-0 whitespace-nowrap px-4 py-2">
                  Rejected ({proofs.filter(p => p.status === 'rejected').length})
                </TabsTrigger>
                <TabsTrigger value="all" className="flex-shrink-0 whitespace-nowrap px-4 py-2">
                  All ({proofs.length})
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value={activeTab} className="mt-6">
              {filteredProofs.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Image className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No impact proofs in this category</p>
                  <p className="text-sm">Approved proofs will automatically appear in the Impact Ledger</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {filteredProofs.map((proof) => (
                    <Card key={proof.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              {getStatusBadge(proof.status)}
                              <span className="text-sm text-muted-foreground">
                                {new Date(proof.created_at).toLocaleDateString()}
                              </span>
                            </div>
                            
                            <h4 className="font-semibold mb-1">
                              {(proof as any).bookings?.experiences?.title || 'Unknown Experience'}
                            </h4>
                            <p className="text-sm text-muted-foreground mb-2">
                              Partner: {(proof as any).bookings?.experiences?.partner_profiles?.org_name || 'Unknown Partner'}
                            </p>
                            <p className="text-sm text-muted-foreground mb-2">
                              Traveler: {(proof as any).bookings?.customer_name || 'Unknown'} • 
                              Date: {new Date((proof as any).bookings?.booking_date || proof.created_at).toLocaleDateString()}
                            </p>
                            
                            {proof.caption && (
                              <p className="text-sm mb-3 bg-muted/50 p-2 rounded">
                                "{proof.caption}"
                              </p>
                            )}
                            
                            {proof.admin_notes && (
                                <div className="mt-2 p-2 bg-muted rounded">
                                  <p className="text-xs font-medium text-foreground mb-1">Admin Notes:</p>
                                  <p className="text-sm text-muted-foreground">{proof.admin_notes}</p>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex gap-2 ml-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedProof(proof)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Review Dialog */}
      <Dialog open={!!selectedProof} onOpenChange={() => setSelectedProof(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Review Impact Proof</DialogTitle>
          </DialogHeader>
          
          {selectedProof && (
            <div className="space-y-4">
              {/* Image Display */}
              <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                <img
                  src={selectedProof.url}
                  alt="Impact proof"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder.svg';
                  }}
                />
              </div>
              
              {/* Details */}
              <div className="space-y-2">
                <h4 className="font-semibold">
                  {(selectedProof as any).bookings?.experiences?.title || 'Unknown Experience'}
                </h4>
                <p className="text-sm text-muted-foreground">
                  Partner: {(selectedProof as any).bookings?.experiences?.partner_profiles?.org_name || 'Unknown'}
                </p>
                <p className="text-sm text-muted-foreground">
                  Submitted: {new Date(selectedProof.created_at).toLocaleString()}
                </p>
                {selectedProof.caption && (
                  <div>
                    <p className="text-sm font-medium mb-1">Caption:</p>
                    <p className="text-sm bg-muted/50 p-2 rounded">{selectedProof.caption}</p>
                  </div>
                )}
              </div>

              {/* Admin Notes */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Admin Notes (Optional)
                </label>
                <Textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add notes about this review decision..."
                  rows={3}
                />
              </div>

              {/* Action Buttons */}
              {selectedProof.status === 'pending' && (
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => handleProofAction(selectedProof.id, 'rejected')}
                    disabled={submitting}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                  <Button
                    onClick={() => handleProofAction(selectedProof.id, 'approved')}
                    disabled={submitting}
                  >
                    {submitting ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <CheckCircle className="h-4 w-4 mr-2" />
                    )}
                    Approve
                  </Button>
                </div>
              )}
              
              {selectedProof.status !== 'pending' && (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground">
                    This proof has been {selectedProof.status} and will {selectedProof.status === 'approved' ? 'appear in' : 'not appear in'} the Impact Ledger.
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ImpactProofAdmin;
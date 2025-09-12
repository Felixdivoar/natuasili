import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CheckCircle2, XCircle, Clock, DollarSign, User, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useCurrency } from "@/contexts/CurrencyContext";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface WithdrawalRequest {
  id: string;
  amount_kes: number;
  requested_at: string;
  status: 'pending' | 'approved' | 'rejected';
  admin_notes: string | null;
  processed_at: string | null;
  partner_profiles: {
    org_name: string;
    user_id: string;
  };
}

const AdminWithdrawalsTab = () => {
  const { formatPrice } = useCurrency();
  const [withdrawalRequests, setWithdrawalRequests] = useState<WithdrawalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<WithdrawalRequest | null>(null);

  useEffect(() => {
    fetchWithdrawalRequests();

    // Set up real-time subscription
    const channel = supabase
      .channel('admin-withdrawals')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'withdrawal_requests'
        },
        () => {
          fetchWithdrawalRequests();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchWithdrawalRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('withdrawal_requests')
        .select(`
          *,
          partner_profiles!inner(
            org_name,
            user_id
          )
        `)
        .order('requested_at', { ascending: false });

      if (error) throw error;
      setWithdrawalRequests((data || []) as WithdrawalRequest[]);
    } catch (error) {
      console.error('Error fetching withdrawal requests:', error);
      toast.error('Failed to load withdrawal requests');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: 'approved' | 'rejected', notes?: string) => {
    setProcessingId(id);
    try {
      const { error } = await supabase
        .from('withdrawal_requests')
        .update({
          status,
          admin_notes: notes || null,
          processed_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      toast.success(`Withdrawal request ${status} successfully`);
      setSelectedRequest(null);
      setAdminNotes('');
      fetchWithdrawalRequests();
    } catch (error) {
      console.error('Error updating withdrawal request:', error);
      toast.error('Failed to update withdrawal request');
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'approved':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'rejected':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const pendingRequests = withdrawalRequests.filter(req => req.status === 'pending');
  const processedRequests = withdrawalRequests.filter(req => req.status !== 'pending');

  if (loading) {
    return <div className="animate-pulse">Loading withdrawal requests...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Withdrawal Management</h2>
        <Badge variant="outline" className="text-sm">
          {pendingRequests.length} pending
        </Badge>
      </div>

      {/* Pending Requests */}
      {pendingRequests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              Pending Requests ({pendingRequests.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingRequests.map((request) => (
                <div key={request.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span className="font-medium">{request.partner_profiles.org_name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        <span className="font-bold text-lg">{formatPrice(request.amount_kes)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span className="text-sm">
                          {new Date(request.requested_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800">
                      <Clock className="h-3 w-3 mr-1" />
                      Pending
                    </Badge>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleUpdateStatus(request.id, 'approved')}
                      disabled={processingId === request.id}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle2 className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => setSelectedRequest(request)}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Reject Withdrawal Request</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="p-4 bg-muted rounded-lg">
                            <div className="flex justify-between items-center">
                              <span>Partner: {selectedRequest?.partner_profiles.org_name}</span>
                              <span className="font-bold">{selectedRequest && formatPrice(selectedRequest.amount_kes)}</span>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="rejection-notes">Reason for rejection</Label>
                            <Textarea
                              id="rejection-notes"
                              value={adminNotes}
                              onChange={(e) => setAdminNotes(e.target.value)}
                              placeholder="Provide a reason for rejecting this withdrawal request..."
                              className="min-h-[100px]"
                            />
                          </div>

                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              onClick={() => {
                                setSelectedRequest(null);
                                setAdminNotes('');
                              }}
                              className="flex-1"
                            >
                              Cancel
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={() => selectedRequest && handleUpdateStatus(selectedRequest.id, 'rejected', adminNotes)}
                              disabled={processingId === selectedRequest?.id || !adminNotes.trim()}
                              className="flex-1"
                            >
                              Reject Request
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Requests History */}
      <Card>
        <CardHeader>
          <CardTitle>Withdrawal History</CardTitle>
        </CardHeader>
        <CardContent>
          {withdrawalRequests.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">No withdrawal requests yet</p>
              <p className="text-sm">Partner withdrawal requests will appear here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {withdrawalRequests.map((request) => (
                <div key={request.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-1">
                      <span className="font-medium">{request.partner_profiles.org_name}</span>
                      <span className="font-bold">{formatPrice(request.amount_kes)}</span>
                      <Badge className={getStatusColor(request.status)}>
                        {getStatusIcon(request.status)}
                        <span className="ml-1 capitalize">{request.status}</span>
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Requested: {new Date(request.requested_at).toLocaleDateString()}</span>
                      {request.processed_at && (
                        <span>Processed: {new Date(request.processed_at).toLocaleDateString()}</span>
                      )}
                    </div>
                    {request.admin_notes && (
                      <p className="text-sm mt-2 p-2 bg-muted rounded">
                        <strong>Admin Note:</strong> {request.admin_notes}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminWithdrawalsTab;
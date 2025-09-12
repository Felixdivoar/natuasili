import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, DollarSign, Clock, CheckCircle2, XCircle, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
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
}

const WithdrawalsTab = () => {
  const { user } = useAuth();
  const { formatPrice } = useCurrency();
  const [withdrawalRequests, setWithdrawalRequests] = useState<WithdrawalRequest[]>([]);
  const [availableBalance, setAvailableBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showRequestDialog, setShowRequestDialog] = useState(false);
  const [requestAmount, setRequestAmount] = useState('');

  useEffect(() => {
    if (!user) return;
    
    fetchWithdrawals();
    calculateAvailableBalance();

    // Set up real-time subscription for withdrawal requests
    const channel = supabase
      .channel('partner-withdrawals')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'withdrawal_requests'
        },
        () => {
          fetchWithdrawals();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const fetchWithdrawals = async () => {
    try {
      // Get partner profile first
      const { data: partnerProfile } = await supabase
        .from('partner_profiles')
        .select('id')
        .eq('user_id', user?.id)
        .single();

      if (!partnerProfile) return;

      const { data, error } = await supabase
        .from('withdrawal_requests')
        .select('*')
        .eq('partner_id', partnerProfile.id)
        .order('requested_at', { ascending: false });

      if (error) throw error;
      setWithdrawalRequests((data || []) as WithdrawalRequest[]);
    } catch (error) {
      console.error('Error fetching withdrawals:', error);
      toast.error('Failed to load withdrawal requests');
    } finally {
      setLoading(false);
    }
  };

  const calculateAvailableBalance = async () => {
    try {
      // Get partner profile
      const { data: partnerProfile } = await supabase
        .from('partner_profiles')
        .select('id')
        .eq('user_id', user?.id)
        .single();

      if (!partnerProfile) return;

      // Get partner's experiences
      const { data: experiences } = await supabase
        .from('experiences')
        .select('id')
        .eq('partner_id', partnerProfile.id);

      if (!experiences?.length) return;

      const experienceIds = experiences.map(exp => exp.id);

      // Calculate total earnings from confirmed/completed bookings
      const { data: bookings } = await supabase
        .from('bookings')
        .select('total_kes, donation_kes')
        .in('experience_id', experienceIds)
        .in('status', ['confirmed', 'completed']);

      const totalEarnings = bookings?.reduce((sum, booking) => 
        sum + (booking.total_kes - booking.donation_kes), 0) || 0;

      // Calculate platform fee (10%) and processing fees (3%)
      const netEarnings = totalEarnings * 0.87; // 13% total fees

      // Get total approved payouts
      const { data: payouts } = await supabase
        .from('payouts')
        .select('amount_kes')
        .eq('partner_id', partnerProfile.id)
        .eq('status', 'completed');

      const totalPayouts = payouts?.reduce((sum, payout) => sum + payout.amount_kes, 0) || 0;

      setAvailableBalance(Math.max(0, netEarnings - totalPayouts));
    } catch (error) {
      console.error('Error calculating balance:', error);
    }
  };

  const handleWithdrawalRequest = async () => {
    if (!user || !requestAmount) return;

    const amount = parseInt(requestAmount);
    if (amount < 2000) {
      toast.error('Minimum withdrawal amount is KES 2,000');
      return;
    }

    if (amount > availableBalance) {
      toast.error('Insufficient balance');
      return;
    }

    setIsSubmitting(true);
    try {
      // Get partner profile
      const { data: partnerProfile } = await supabase
        .from('partner_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!partnerProfile) throw new Error('Partner profile not found');

      const { error } = await supabase
        .from('withdrawal_requests')
        .insert({
          partner_id: partnerProfile.id,
          amount_kes: amount
        });

      if (error) throw error;

      toast.success('Withdrawal request submitted successfully');
      setShowRequestDialog(false);
      setRequestAmount('');
      fetchWithdrawals();
      calculateAvailableBalance();
    } catch (error) {
      console.error('Error submitting withdrawal:', error);
      toast.error('Failed to submit withdrawal request');
    } finally {
      setIsSubmitting(false);
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

  if (loading) {
    return <div className="animate-pulse">Loading withdrawals...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Withdrawals</h2>
        <Dialog open={showRequestDialog} onOpenChange={setShowRequestDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Request Withdrawal
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Request Withdrawal</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-4 w-4" />
                  <span className="font-medium">Available Balance</span>
                </div>
                <div className="text-2xl font-bold">{formatPrice(availableBalance)}</div>
                <p className="text-sm text-muted-foreground mt-1">
                  Balance after platform fees (13% total)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Withdrawal Amount (KES)</Label>
                <Input
                  id="amount"
                  type="number"
                  min="2000"
                  max={availableBalance}
                  value={requestAmount}
                  onChange={(e) => setRequestAmount(e.target.value)}
                  placeholder="Enter amount (minimum 2,000)"
                />
                <p className="text-xs text-muted-foreground">
                  Minimum withdrawal: KES 2,000
                </p>
              </div>

              <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <p className="text-sm text-blue-800">
                  Withdrawal requests are reviewed by our admin team and typically processed within 3-5 business days.
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowRequestDialog(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleWithdrawalRequest}
                  disabled={isSubmitting || !requestAmount || parseInt(requestAmount) < 2000}
                  className="flex-1"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Request'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Balance Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Account Balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold mb-2">{formatPrice(availableBalance)}</div>
          <p className="text-sm text-muted-foreground">
            Available for withdrawal (after 13% platform and processing fees)
          </p>
        </CardContent>
      </Card>

      {/* Withdrawal Requests */}
      <Card>
        <CardHeader>
          <CardTitle>Withdrawal History</CardTitle>
        </CardHeader>
        <CardContent>
          {withdrawalRequests.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">No withdrawal requests yet</p>
              <p className="text-sm">Your withdrawal requests will appear here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {withdrawalRequests.map((request) => (
                <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold">{formatPrice(request.amount_kes)}</span>
                      <Badge className={getStatusColor(request.status)}>
                        {getStatusIcon(request.status)}
                        <span className="ml-1 capitalize">{request.status}</span>
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Requested: {new Date(request.requested_at).toLocaleDateString()}
                    </p>
                    {request.processed_at && (
                      <p className="text-sm text-muted-foreground">
                        Processed: {new Date(request.processed_at).toLocaleDateString()}
                      </p>
                    )}
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

export default WithdrawalsTab;
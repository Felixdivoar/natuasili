import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { FileUpload } from '@/components/ui/file-upload';
import { Upload, Image, CheckCircle, Clock, XCircle, Eye, Camera, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { uploadFile, validateFile } from '@/lib/fileUpload';
import { toast } from 'sonner';

interface Booking {
  id: string;
  booking_date: string;
  customer_name: string;
  adults: number;
  children: number;
  total_kes: number;
  experiences: {
    title: string;
    location_text: string;
  };
}

interface ImpactProof {
  id: string;
  booking_id: string;
  url: string;
  caption: string | null;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

const PartnerImpactProofSubmission: React.FC = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [proofs, setProofs] = useState<ImpactProof[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);
  const [showSubmissionDialog, setShowSubmissionDialog] = useState(false);

  useEffect(() => {
    if (user) {
      fetchPartnerBookings();
      fetchImpactProofs();
      
      // Set up real-time subscription for impact proofs
      const channel = supabase
        .channel('partner-impact-proofs')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'impact_proofs'
          },
          () => {
            fetchImpactProofs();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  const fetchPartnerBookings = async () => {
    if (!user) return;

    try {
      // Get partner profile first
      const { data: partnerProfile } = await supabase
        .from('partner_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!partnerProfile) return;

      // Get bookings for partner's experiences
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          id,
          booking_date,
          customer_name,
          adults,
          children,
          total_kes,
          experiences!inner (
            title,
            location_text,
            partner_id
          )
        `)
        .eq('experiences.partner_id', partnerProfile.id)
        .in('status', ['confirmed', 'completed'])
        .order('booking_date', { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error('Error fetching partner bookings:', error);
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const fetchImpactProofs = async () => {
    if (!user) return;

    try {
      const { data: partnerProfile } = await supabase
        .from('partner_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!partnerProfile) return;

      const { data, error } = await supabase
        .from('impact_proofs')
        .select(`
          id,
          booking_id,
          url,
          caption,
          status,
          created_at
        `)
        .in('booking_id', bookings.map(b => b.id));

      if (error) throw error;
      setProofs((data || []) as ImpactProof[]);
    } catch (error) {
      console.error('Error fetching impact proofs:', error);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!user || !selectedBooking) return;

    const validation = validateFile(file, 10);
    if (validation) {
      toast.error(validation);
      return;
    }

    setUploading(true);
    try {
      const result = await uploadFile(file, 'partner-images', 'impact-proof', user.id);
      
      if (result.error) {
        toast.error(result.error);
        return;
      }

      if (result.url) {
        // Save impact proof to database
        const { error } = await supabase
          .from('impact_proofs')
          .insert({
            booking_id: selectedBooking.id,
            url: result.url,
            caption: caption.trim() || null,
            status: 'pending'
          });

        if (error) throw error;

        toast.success('Impact proof submitted successfully! Awaiting admin review.');
        setSelectedBooking(null);
        setCaption('');
        setShowSubmissionDialog(false);
        fetchImpactProofs();
      }
    } catch (error) {
      console.error('Error submitting impact proof:', error);
      toast.error('Failed to submit impact proof');
    } finally {
      setUploading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-foreground text-background"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-foreground text-background"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge className="bg-foreground text-background"><Clock className="h-3 w-3 mr-1" />Pending Review</Badge>;
    }
  };

  const getBookingProof = (bookingId: string) => {
    return proofs.find(proof => proof.booking_id === bookingId);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            Loading bookings...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Impact Proof Submission</CardTitle>
          <p className="text-muted-foreground">
            Submit photos and stories showing the conservation impact of completed experiences
          </p>
        </CardHeader>
        <CardContent>
          {bookings.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Camera className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No completed bookings available</p>
              <p className="text-sm">Impact proof submissions will appear here once you have confirmed bookings</p>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => {
                const existingProof = getBookingProof(booking.id);
                
                return (
                  <Card key={booking.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold mb-1">{booking.experiences.title}</h4>
                          <p className="text-sm text-muted-foreground mb-2">
                            {booking.experiences.location_text}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>Date: {new Date(booking.booking_date).toLocaleDateString()}</span>
                            <span>Guests: {booking.adults + booking.children}</span>
                            <span>Traveler: {booking.customer_name}</span>
                          </div>
                          
                          {existingProof && (
                            <div className="mt-3 flex items-center gap-2">
                              {getStatusBadge(existingProof.status)}
                              <span className="text-xs text-muted-foreground">
                                Submitted: {new Date(existingProof.created_at).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex gap-2 ml-4">
                          {existingProof ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(existingProof.url, '_blank')}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => {
                                setSelectedBooking(booking);
                                setShowSubmissionDialog(true);
                              }}
                            >
                              <Upload className="h-4 w-4 mr-1" />
                              Submit Proof
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Submission Dialog */}
      <Dialog open={showSubmissionDialog} onOpenChange={setShowSubmissionDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Submit Impact Proof</DialogTitle>
            <p className="text-muted-foreground">
              Share photos and stories showing the conservation impact of this experience
            </p>
          </DialogHeader>
          
          {selectedBooking && (
            <div className="space-y-4">
              <div className="bg-muted/50 p-3 rounded">
                <h4 className="font-medium">{selectedBooking.experiences.title}</h4>
                <p className="text-sm text-muted-foreground">
                  {new Date(selectedBooking.booking_date).toLocaleDateString()} • 
                  {selectedBooking.adults + selectedBooking.children} guests
                </p>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Caption (Optional)
                </label>
                <Textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Describe the conservation impact shown in your photo..."
                  rows={3}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Upload Impact Photo
                </label>
                <FileUpload
                  accept="image/*"
                  onFileSelect={handleFileUpload}
                  maxSizeMB={10}
                  disabled={uploading}
                />
                {uploading && (
                  <div className="flex items-center justify-center mt-4 p-4">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                    Uploading and submitting proof...
                  </div>
                )}
              </div>

               <div className="bg-info/10 p-3 rounded">
                 <p className="text-sm text-info-foreground">
                  <strong>Note:</strong> Your submission will be reviewed by our admin team. 
                  Once approved, it will automatically appear in the public Impact Ledger 
                  to showcase your conservation work.
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PartnerImpactProofSubmission;
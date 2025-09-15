import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, MapPin } from "lucide-react";
import { useMultiCart } from "@/contexts/MultiCartContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const CartCheckout = () => {
  const navigate = useNavigate();
  const { items, clear } = useMultiCart();
  const { formatPrice } = useCurrency();
  const { user, profile, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");

  // Auto-fill contact information from user profile
  useEffect(() => {
    if (profile) {
      setFullName(`${profile.first_name || ''} ${profile.last_name || ''}`.trim() || fullName);
      setEmail(profile.email || email);
      setPhone(profile.phone || phone);
    } else if (user?.email) {
      setEmail(user.email);
    }
  }, [user, profile]);

  // Check authentication and redirect if needed
  useEffect(() => {
    if (!authLoading && !user) {
      // Save current cart state in session storage before redirect
      sessionStorage.setItem('checkoutRedirect', 'true');
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (items.length === 0 && user) {
      navigate("/browse");
    }
  }, [items, navigate, user]);

  const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  const contactErrors = {
    fullName: fullName.trim().length < 2 ? "Please enter your full name." : "",
    email: !isEmail(email) ? "Enter a valid email address." : "",
  };

  const contactValid = !contactErrors.fullName && !contactErrors.email;
  const [donations, setDonations] = useState<Record<string, number>>({});
  
  const total = items.reduce((sum, item) => sum + item.subtotal + (donations[item.id] || 0), 0);
  const canProceed = contactValid && items.length > 0;

  const getThemeColor = (theme: string) => {
    switch (theme) {
      case 'Wildlife conservation':
        return 'bg-wildlife/10 text-wildlife border-wildlife/20';
      case 'Community & cultural exploration':
        return 'bg-livelihoods/10 text-livelihoods border-livelihoods/20';
      case 'Conservation education':
        return 'bg-education/10 text-education border-education/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const handlePlaceOrder = async () => {
    if (!canProceed || !user) return;
    
    setLoading(true);
    try {
      // Process each item through proper payment flow
      for (const item of items) {
        // Get the experience to get partner info
        const { data: experience } = await supabase
          .from('experiences')
          .select('id, partner_id, title')
          .eq('slug', item.experienceSlug)
          .single();

        if (!experience) {
          throw new Error(`Experience not found: ${item.experienceSlug}`);
        }

        const donationAmount = donations[item.id] || 0;
        const totalAmount = item.subtotal + donationAmount;
        
        // Create booking first
        const { data: booking, error: bookingError } = await supabase
          .from('bookings')
          .insert({
            experience_id: experience.id,
            user_id: user.id,
            booking_date: item.date,
            adults: item.adults,
            children: item.children,
            total_kes: Math.round(totalAmount),
            unit_price_kes: item.unitPrice,
            subtotal_kes: item.subtotal,
            donation_kes: donationAmount,
            customer_name: fullName,
            customer_email: email,
            customer_phone: phone,
            special_requests: notes,
            option_id: item.optionId,
            status: 'pending', // Will be updated on payment success
            payment_status: 'pending'
          })
          .select()
          .single();

        if (bookingError) throw bookingError;

        // Create payment order through Pesapal
        const callbackUrl = `${window.location.origin}/pesapal-callback`;
        const { data: paymentResponse, error: paymentError } = await supabase.functions.invoke('pesapal-create-order', {
          body: {
            booking_id: booking.id,
            amount: totalAmount,
            currency: item.currency,
            description: `Booking for ${experience.title} - ${item.adults + item.children} people on ${item.date}${donationAmount ? ` + KES ${donationAmount} donation` : ''}`,
            reference: `booking_${booking.id}_${Date.now()}`,
            callback_url: callbackUrl,
            customer: {
              email: email,
              first_name: fullName.split(' ')[0] || fullName,
              last_name: fullName.split(' ').slice(1).join(' ') || '',
              phone_number: phone || '',
            },
          },
        });

        if (paymentError) {
          console.error('Payment error:', paymentError);
          throw new Error(`Payment setup failed: ${paymentError.message}`);
        }

        if (!paymentResponse?.success || !paymentResponse?.redirect_url) {
          throw new Error('Failed to create payment session');
        }

        // For multi-item bookings, process first item payment and redirect
        // In a real implementation, you'd want to handle multiple payments differently
        if (items.length === 1) {
          // Single item - redirect to payment
          window.location.href = paymentResponse.redirect_url;
          return;
        }
      }

      // For multi-item bookings, show success and redirect to dashboard
      // In production, implement batch payment processing
      clear();
      toast.success(`Successfully created ${items.length} bookings!`);
      navigate('/user-dashboard');
      
    } catch (error) {
      console.error('Error creating bookings:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create bookings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || !user) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to cart
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left: Forms */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">Full name *</Label>
                    <Input 
                      id="fullName" 
                      value={fullName} 
                      onChange={(e) => setFullName(e.target.value)} 
                      placeholder="Your name" 
                      required 
                    />
                    {contactErrors.fullName && (
                      <div className="text-destructive text-sm mt-1">{contactErrors.fullName}</div>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      placeholder="you@example.com" 
                      required 
                    />
                    {contactErrors.email && (
                      <div className="text-destructive text-sm mt-1">{contactErrors.email}</div>
                    )}
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input 
                      id="phone"
                      type="tel" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+254 7XX XXX XXX" 
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="notes">Special requests (optional)</Label>
                    <Input 
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Anything we should know?" 
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Payment</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button 
                    size="lg" 
                    className="w-full" 
                    disabled={!canProceed || loading} 
                    onClick={handlePlaceOrder}
                  >
                    {loading ? "Processing..." : `Book ${items.length} Experiences`}
                  </Button>
                  {!canProceed && (
                    <div className="text-sm text-muted-foreground mt-2">
                      Please fill in all required fields to proceed.
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right: Order Summary */}
            <div>
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Booking Summary ({items.length} experiences)</CardTitle>
                </CardHeader>
                 <CardContent className="space-y-6">
                   {items.map((item) => (
                     <div key={item.id} className="border-b pb-4 last:border-b-0 space-y-3">
                       <div className="flex gap-3">
                         {item.image && (
                           <img 
                             src={item.image} 
                             alt={item.title} 
                             className="w-16 h-16 object-cover rounded" 
                           />
                         )}
                         <div className="flex-1 min-w-0">
                           <h3 className="font-medium text-sm leading-tight">{item.title}</h3>
                           <div className="text-xs text-muted-foreground mt-1">
                             {item.date} • {item.adults + item.children} people
                             {item.isGroupPricing ? ' (group)' : ''}
                           </div>
                           <div className="font-semibold text-sm mt-1">
                             {formatPrice(item.subtotal)}
                           </div>
                         </div>
                       </div>
                       
                       {/* Optional Donation Section */}
                       <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                         <div className="flex items-center justify-between mb-2">
                           <h4 className="font-medium text-green-800 text-sm">Add donation (optional)</h4>
                         </div>
                         <p className="text-xs text-green-600 mb-3">
                           100% of your donation supports conservation initiatives directly.
                         </p>
                         <div className="flex items-center gap-2">
                           <Label htmlFor={`donation-${item.id}`} className="text-sm font-medium text-green-800">KES</Label>
                           <Input
                             id={`donation-${item.id}`}
                             type="number"
                             min="0"
                             step="100"
                             className="flex-1"
                             value={donations[item.id] || ''}
                             onChange={(e) => setDonations(prev => ({
                               ...prev,
                               [item.id]: parseInt(e.target.value) || 0
                             }))}
                             placeholder="0"
                           />
                         </div>
                         {(donations[item.id] && donations[item.id] > 0) && (
                           <div className="text-xs text-green-600 mt-2">
                             Donation: {formatPrice(donations[item.id])}
                           </div>
                         )}
                       </div>
                     </div>
                   ))}

                   <div className="border-t pt-4 space-y-2">
                     <div className="flex justify-between text-sm">
                       <span>Experiences subtotal</span>
                       <span>{formatPrice(items.reduce((sum, item) => sum + item.subtotal, 0))}</span>
                     </div>
                     {Object.values(donations).some(d => d > 0) && (
                       <div className="flex justify-between text-sm text-green-600">
                         <span>Total donations</span>
                         <span>{formatPrice(Object.values(donations).reduce((sum, d) => sum + d, 0))}</span>
                       </div>
                     )}
                     <div className="flex justify-between font-semibold text-lg border-t pt-2">
                       <span>Total</span>
                       <span>{formatPrice(total)}</span>
                     </div>
                     <div className="text-xs text-muted-foreground">
                       Partner initiatives (90% + donations) • Platform operations (10%)
                     </div>
                   </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartCheckout;
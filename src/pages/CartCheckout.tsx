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
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (items.length === 0) {
      navigate("/browse");
    }
  }, [items, navigate]);

  const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  const contactErrors = {
    fullName: fullName.trim().length < 2 ? "Please enter your full name." : "",
    email: !isEmail(email) ? "Enter a valid email address." : "",
  };

  const contactValid = !contactErrors.fullName && !contactErrors.email;
  const total = items.reduce((sum, item) => sum + item.subtotal, 0);
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
      // Create bookings for each item
      const bookingPromises = items.map(async (item) => {
        // First get the experience to get partner info
        const { data: experience } = await supabase
          .from('experiences')
          .select('id, partner_id')
          .eq('slug', item.experienceSlug)
          .single();

        if (!experience) {
          throw new Error(`Experience not found: ${item.experienceSlug}`);
        }

        // Create booking
        const { data: booking, error } = await supabase
          .from('bookings')
          .insert({
            experience_id: experience.id,
            user_id: user.id,
            booking_date: item.date,
            adults: item.adults,
            children: item.children,
            total_kes: Math.round(item.subtotal),
            unit_price_kes: item.unitPrice,
            subtotal_kes: item.subtotal,
            customer_name: fullName,
            customer_email: email,
            customer_phone: phone,
            special_requests: notes,
            option_id: item.optionId,
            status: 'confirmed',
            payment_status: 'pending'
          })
          .select()
          .single();

        if (error) throw error;
        return booking;
      });

      const bookings = await Promise.all(bookingPromises);
      
      // Clear cart after successful bookings
      clear();
      
      toast.success(`Successfully created ${bookings.length} bookings!`);
      navigate('/user-dashboard');
      
    } catch (error) {
      console.error('Error creating bookings:', error);
      toast.error('Failed to create bookings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) return null;

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
                    <div key={item.id} className="border-b pb-4 last:border-b-0">
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
                    </div>
                  ))}

                  <div className="border-t pt-4">
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">
                      Includes partner initiatives (90%) and platform operations (10%)
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
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ArrowLeft } from "lucide-react";
import { useMultiCart } from "@/contexts/MultiCartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useBookingTimer } from "@/hooks/useBookingTimer";
import BookingTimer from "./BookingTimer";

interface UnifiedBookingFlowProps {
  experience: any;
  initialItem?: {
    date: string;
    adults: number;
    children: number;
    optionId: string;
  };
  onClose?: () => void;
}

const UnifiedBookingFlow: React.FC<UnifiedBookingFlowProps> = ({ 
  experience, 
  initialItem, 
  onClose 
}) => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { formatPrice } = useCurrency();
  const { items, addItem, removeItem } = useMultiCart();
  
  // Booking timer
  const bookingTimer = useBookingTimer(() => {
    // Clear booking data on timer expire
    setFormData({
      name: '',
      email: '',
      phone: '',
      specialRequests: '',
      donation: 0,
      agreeTerms: false
    });
    setBookingStarted(false);
    toast.error("Booking session expired. Please restart your booking.");
  });

  const [bookingStarted, setBookingStarted] = useState(false);
  
  // Check if experience is already in cart
  const isInCart = items.some(item => 
    item.experienceSlug === experience.slug &&
    item.date === initialItem?.date &&
    item.adults === initialItem?.adults &&
    item.children === initialItem?.children
  );

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    specialRequests: '',
    donation: 0,
    agreeTerms: false
  });

  const [loading, setLoading] = useState(false);

  // Auto-fill user data
  useEffect(() => {
    if (user && profile) {
      const fullName = profile.first_name && profile.last_name 
        ? `${profile.first_name} ${profile.last_name}`.trim()
        : profile.first_name || profile.last_name || '';
      
      setFormData(prev => ({
        ...prev,
        name: fullName || prev.name,
        email: profile.email || prev.email,
        phone: profile.phone || prev.phone,
      }));
    }
  }, [user, profile]);

  const validateForm = () => {
    return formData.name && formData.email && formData.agreeTerms;
  };

  const handleAddToCart = () => {
    if (!initialItem) return;

    const basePrice = experience.priceKESAdult || experience.base_price || 350;
    const isGroupPricing = experience.isGroupPricing || false;
    
    // Start booking timer when adding to cart
    if (!bookingTimer.isActive) {
      bookingTimer.startTimer();
      setBookingStarted(true);
    }
    
    addItem({
      experienceSlug: experience.slug,
      title: experience.title,
      image: experience.heroImage,
      date: initialItem.date,
      adults: initialItem.adults,
      children: initialItem.children,
      optionId: initialItem.optionId as "standard",
      unitPrice: basePrice,
      isGroupPricing,
    });

    toast.success("Added to cart!");
  };

  const handleDirectBooking = async () => {
    if (!validateForm() || !initialItem) return;
    
    // Start booking timer if not already started
    if (!bookingTimer.isActive && !bookingStarted) {
      bookingTimer.startTimer();
      setBookingStarted(true);
    }

    setLoading(true);
    try {
      // Get experience from database
      const { data: dbExperience } = await supabase
        .from('experiences')
        .select('id, title')
        .eq('slug', experience.slug)
        .single();

      if (!dbExperience) {
        throw new Error('Experience not found in database');
      }

      const basePrice = experience.priceKESAdult || experience.base_price || 350;
      const isGroupPricing = experience.isGroupPricing || false;
      const subtotal = isGroupPricing ? basePrice : (basePrice * initialItem.adults + basePrice * initialItem.children);
      const totalAmount = subtotal + formData.donation;

      // Create booking (support guest bookings)
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert({
          experience_id: dbExperience.id,
          user_id: user?.id || null, // Allow null for guest bookings
          booking_date: initialItem.date,
          adults: initialItem.adults,
          children: initialItem.children,
          total_kes: Math.round(totalAmount),
          unit_price_kes: basePrice,
          subtotal_kes: subtotal,
          donation_kes: formData.donation,
          customer_name: formData.name,
          customer_email: formData.email,
          customer_phone: formData.phone,
          special_requests: formData.specialRequests,
          option_id: initialItem.optionId,
          status: 'pending',
          payment_status: 'pending'
        })
        .select()
        .single();

      if (bookingError) throw bookingError;

      // Create payment order
      const callbackUrl = `${window.location.origin}/pesapal-callback`;
      const { data: paymentResponse, error: paymentError } = await supabase.functions.invoke('pesapal-create-order', {
        body: {
          booking_id: booking.id,
          amount: totalAmount,
          currency: 'KES',
          description: `Booking for ${experience.title} - ${initialItem.adults + initialItem.children} people on ${initialItem.date}`,
          reference: `booking_${booking.id}_${Date.now()}`,
          callback_url: callbackUrl,
          customer: {
            email: formData.email,
            first_name: formData.name.split(' ')[0] || formData.name,
            last_name: formData.name.split(' ').slice(1).join(' ') || '',
            phone_number: formData.phone || '',
          },
        },
      });

      if (paymentError) {
        throw new Error(`Payment setup failed: ${paymentError.message}`);
      }

      if (!paymentResponse?.success || !paymentResponse?.redirect_url) {
        throw new Error('Failed to create payment session');
      }

      // Stop timer on successful payment redirect
      bookingTimer.stopTimer();
      
      // Redirect to payment
      window.location.href = paymentResponse.redirect_url;

    } catch (error) {
      console.error('Booking error:', error);
      toast.error(error instanceof Error ? error.message : 'Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!initialItem) {
    return (
      <div className="text-center py-8">
        <p>Please select your booking details first.</p>
        <Button onClick={onClose} className="mt-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to selection
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Booking Timer */}
      {bookingStarted && (
        <BookingTimer 
          timeRemaining={bookingTimer.timeRemaining}
          formatTime={bookingTimer.formatTime}
          isActive={bookingTimer.isActive}
        />
      )}
      
      {/* Booking Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Booking Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div>Experience: {experience.title}</div>
            <div>Date: {initialItem.date}</div>
            <div>Participants: {initialItem.adults + initialItem.children} people</div>
            <Badge variant="secondary">Standard Experience</Badge>
          </div>
        </CardContent>
      </Card>

      {isInCart ? (
        /* Experience is in cart - show cart options */
        <Card>
          <CardHeader>
            <CardTitle>This experience is in your cart</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              This experience with these details is already in your cart. Please complete checkout or remove it from cart to book directly.
            </p>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => navigate('/cart/checkout')}
                className="flex-1"
              >
                Go to Checkout
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => {
                  const cartItem = items.find(item => 
                    item.experienceSlug === experience.slug &&
                    item.date === initialItem?.date &&
                    item.adults === initialItem?.adults &&
                    item.children === initialItem?.children
                  );
                  if (cartItem) removeItem(cartItem.id);
                }}
              >
                Remove from Cart
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        /* Experience not in cart - show booking form and options */
        <>
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+254 700 000 000"
                  />
                </div>
                <div>
                  <Label htmlFor="requests">Special Requests</Label>
                  <Input
                    id="requests"
                    value={formData.specialRequests}
                    onChange={(e) => setFormData(prev => ({ ...prev, specialRequests: e.target.value }))}
                    placeholder="Any special requirements..."
                  />
                </div>
              </div>

              {/* Optional Donation */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="space-y-3">
                  <h4 className="font-medium text-green-800">Add donation (optional)</h4>
                  <p className="text-xs text-green-700">
                    100% goes directly to conservation initiatives.
                  </p>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="donation" className="text-sm font-medium text-green-800">KES</Label>
                    <Input
                      id="donation"
                      type="number"
                      min="0"
                      step="50"
                      value={formData.donation || ''}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        donation: parseInt(e.target.value) || 0 
                      }))}
                      placeholder="0"
                      className="w-24 border-green-200"
                    />
                  </div>
                </div>
              </div>

              {/* Terms Agreement */}
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="terms"
                  checked={formData.agreeTerms}
                  onChange={(e) => setFormData(prev => ({ ...prev, agreeTerms: e.target.checked }))}
                  className="mt-1"
                />
                <Label htmlFor="terms" className="text-sm">
                  I agree to the terms and conditions *
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              onClick={handleAddToCart}
              variant="outline"
              className="flex-1"
            >
              Add to Cart
            </Button>
            <Button
              onClick={handleDirectBooking}
              disabled={!validateForm() || loading || bookingTimer.isExpired}
              className="flex-1"
            >
              {loading ? "Processing..." : bookingTimer.isExpired ? "Session Expired" : "Book Now"}
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default UnifiedBookingFlow;
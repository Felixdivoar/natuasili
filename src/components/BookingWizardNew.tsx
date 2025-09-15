import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, MapPin, Users, Calendar, Mail, Phone, User, ArrowLeft } from "lucide-react";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useCart } from "@/contexts/CartContext";
import { useI18n } from "@/contexts/I18nContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { isValidBookingDate, validateBookingDate } from "@/utils/time";
import { saveReceipt } from "@/lib/receipt";
import { makeImpactSummary } from "@/lib/impactSummary";
import { supabase } from "@/integrations/supabase/client";

interface BookingWizardNewProps {
  isOpen: boolean;
  onClose: () => void;
  experience: any;
}

const BookingWizardNew: React.FC<BookingWizardNewProps> = ({ isOpen, onClose, experience }) => {
  const { formatPrice } = useCurrency();
  const { cart, updateCart } = useCart();
  const { t } = useI18n();
  const { toast } = useToast();
  const { user, profile } = useAuth();
  
  const [currentStep, setCurrentStep] = useState(2); // Start at Step 2 (Contact)
  const [formData, setFormData] = useState({
    name: '', // Will be auto-filled from auth 
    email: '', // Will be auto-filled from auth
    phone: '',
    mobility: '',
    specialRequests: '',
    donation: 0, // Optional donation amount
    agreeTerms: false,
    marketingOptIn: false
  });

  // Auto-fill user profile data on modal open
  useEffect(() => {
    if (isOpen && user && profile) {
      console.log('🔄 Auto-filling user data:', { user: !!user, profile: !!profile });
      
      // Extract full name from profile
      const fullName = profile.first_name && profile.last_name 
        ? `${profile.first_name} ${profile.last_name}`.trim()
        : profile.first_name || profile.last_name || '';
      
      setFormData(prev => ({
        ...prev,
        name: fullName || prev.name,
        email: profile.email || prev.email,
        phone: profile.phone || prev.phone,
      }));
      
      console.log('🔄 Form data updated with:', { 
        name: fullName, 
        email: profile.email, 
        phone: profile.phone 
      });
    }
  }, [isOpen, user, profile]);

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateStep2 = () => {
    return formData.name && formData.email && formData.phone;
  };

  const validateStep3 = () => {
    return formData.agreeTerms;
  };

  const validateBookingData = () => {
    if (!cart?.date) {
      return { isValid: false, error: "Please select a booking date before continuing." };
    }
    
    const dateValidation = validateBookingDate(cart.date);
    if (!dateValidation.isValid) {
      return { isValid: false, error: dateValidation.error };
    }
    
    if (!cart.adults || cart.adults < 1) {
      return { isValid: false, error: "Please select at least one adult participant." };
    }
    
    return { isValid: true };
  };

  const handleNextStep = () => {
    if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
    }
  };

  const handleEditDetails = () => {
    onClose();
    // Scroll to availability section
    setTimeout(() => {
      document.getElementById('availability')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const handleConfirmBooking = async () => {
    if (!validateStep3() || !cart || isProcessingPayment) return;

    // Comprehensive validation before proceeding
    const validation = validateBookingData();
    if (!validation.isValid) {
      toast({
        title: "Booking Error",
        description: validation.error,
        variant: "destructive",
      });
      // If it's a date issue, go back to step 1 to fix it
      if (validation.error?.includes("date") || validation.error?.includes("11:00")) {
        handleEditDetails();
      }
      return;
    }

    setIsProcessingPayment(true);

    try {
      // Find existing experience in Supabase (don't create new ones)
      let experienceId: string;
      
      const { data: existingExperience } = await supabase
        .from('experiences')
        .select('id')
        .eq('slug', experience.slug)
        .single();
        
      if (existingExperience?.id) {
        experienceId = existingExperience.id;
      } else {
        // For demo purposes, use a fixed UUID when experience doesn't exist in DB
        // In production, all experiences should exist in the database
        experienceId = '00000000-0000-0000-0000-000000000001';
      }

      // Create the booking in the database with new fields
      const totalAmount = cart.subtotal + (formData.donation || 0);
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert({
          experience_id: experienceId,
          user_id: user?.id,
          customer_name: formData.name,
          customer_email: formData.email,
          customer_phone: formData.phone,
          booking_date: cart.date,
          adults: cart.adults,
          children: cart.children,
          total_kes: totalAmount,
          donation_kes: formData.donation || 0,
          option_id: cart.optionId || 'standard',
          unit_price_kes: cart.unitPrice,
          subtotal_kes: cart.subtotal,
          status: 'pending',
          payment_status: 'pending',
          special_requests: formData.specialRequests,
        })
        .select()
        .single();

      if (bookingError) {
        console.error('Booking error:', bookingError);
        throw new Error(`Failed to create booking: ${bookingError.message}`);
      }

      // Create Pesapal payment order using new edge function
      const callbackUrl = `${window.location.origin}/pesapal-callback`;
      const { data: paymentResponse, error: paymentError } = await supabase.functions.invoke('pesapal-create-order', {
        body: {
          booking_id: booking.id,
          amount: totalAmount,
          currency: cart.currency,
          description: `Booking for ${experience.title} - ${cart.adults + cart.children} people on ${cart.date}${formData.donation ? ` + KES ${formData.donation} donation` : ''}`,
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
        console.error('Payment error:', paymentError);
        throw new Error(`Payment setup failed. Edge Function returned: ${paymentError.message}`);
      }

      if (!paymentResponse || !paymentResponse.success) {
        const errorMsg = paymentResponse?.error || 'Unknown error occurred';
        throw new Error(`Payment initialization failed: ${errorMsg}`);
      }

      if (!paymentResponse.redirect_url) {
        throw new Error('No payment redirect URL received from Pesapal');
      }

      // Save receipt data for later reference
      const donationAmount = formData.donation || 0;
      const receipt = {
        slug: experience.slug,
        date: cart.date,
        people: cart.adults + cart.children,
        optionId: cart.optionId,
        unitPrice: cart.unitPrice,
        subtotal: cart.subtotal,
        donation: donationAmount,
        partner: cart.split.partner90 + donationAmount, // 90% of booking + 100% of donation
        platform: cart.split.platform10, // 10% of booking only
        currency: cart.currency,
      };
      saveReceipt(receipt);

      // Redirect to Pesapal payment page
      window.location.href = paymentResponse.redirect_url;

    } catch (error) {
      console.error('Error processing booking:', error);
      toast({
        title: 'Booking Failed',
        description: error instanceof Error ? error.message : 'There was an error processing your booking. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const impactSummary = cart ? makeImpactSummary({
    title: experience.title,
    location: experience.locationText,
    date: cart.date,
    people: cart.adults + cart.children,
    unitPriceKES: cart.unitPrice,
    donationKES: formData.donation || 0,
    currency: cart.currency
  }) : null;

  const steps = [
    { number: 1, title: t('details', 'Details'), completed: true },
    { number: 2, title: t('contact', 'Contact'), completed: currentStep > 2 },
    { number: 3, title: t('confirm', 'Confirm'), completed: currentStep > 3 },
    { number: 4, title: t('success', 'Success'), completed: currentStep === 4 }
  ];

  if (!cart) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full mx-4 max-h-[95vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0 pb-4">
          <DialogTitle className="text-xl font-bold">
            {t('bookYourExperience', 'Book Your Experience')}
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left side - Steps */}
            <div className="lg:col-span-2 space-y-6">
              {/* Progress Steps */}
              <div className="flex items-center justify-center gap-2 sm:gap-4 mb-6 flex-wrap">
                {steps.map((step, index) => (
                  <React.Fragment key={step.number}>
                    <div className="flex items-center gap-2 min-w-0">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 ${
                        step.completed || currentStep === step.number
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {step.completed ? <CheckCircle className="h-4 w-4" /> : step.number}
                      </div>
                      <span className={`text-sm font-medium truncate ${
                        step.completed || currentStep === step.number 
                          ? 'text-foreground' 
                          : 'text-muted-foreground'
                      }`}>
                        {step.title}
                      </span>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`h-px w-4 sm:w-8 flex-shrink-0 ${
                        step.completed ? 'bg-primary' : 'bg-muted'
                      }`} />
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* Step 2: Contact */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold">{t('contactInformation', 'Contact Information')}</h3>
                    <p className="text-sm text-muted-foreground">We'll use this to send your booking confirmation and updates.</p>
                  </div>
                  
                  {/* Selected details summary with edit option */}
                  <Card className="bg-muted/50">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium">Selected details</h4>
                        <Button variant="outline" size="sm" onClick={handleEditDetails}>
                          <ArrowLeft className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{cart.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{cart.adults + cart.children} people</span>
                        </div>
                        <div className="col-span-2">
                          <Badge variant="secondary">Standard Experience</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label htmlFor="name">{t('fullName', 'Full Name')} *</Label>
                      <Input 
                        id="name"
                        value={formData.name}
                        onChange={(e) => updateFormData('name', e.target.value)}
                        required
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="email">{t('email', 'Email')} *</Label>
                      <Input 
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => updateFormData('email', e.target.value)}
                        required
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone">{t('phone', 'Phone Number')} *</Label>
                      <Input 
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => updateFormData('phone', e.target.value)}
                        required
                        className="mt-1"
                        placeholder="+254 700 000 000"
                      />
                    </div>

                    <div>
                      <Label htmlFor="mobility">{t('mobilityAssistance', 'Mobility Assistance')}</Label>
                      <Select value={formData.mobility} onValueChange={(value) => updateFormData('mobility', value)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder={t('selectOption', 'Select option')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">{t('noAssistance', 'No assistance needed')}</SelectItem>
                          <SelectItem value="walking">{t('walkingAid', 'Walking aid')}</SelectItem>
                          <SelectItem value="wheelchair">{t('wheelchair', 'Wheelchair')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="requests">{t('specialRequests', 'Special Requests')}</Label>
                    <Textarea 
                      id="requests"
                      value={formData.specialRequests}
                      onChange={(e) => updateFormData('specialRequests', e.target.value)}
                      placeholder={t('specialRequestsPlaceholder', 'Any special requirements or requests...')}
                      rows={3}
                      className="mt-1"
                    />
                  </div>

                  {/* Optional Donation Section */}
                  <Card className="bg-gradient-to-r from-green-50/50 to-emerald-50/50 border-green-200/50">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">+</span>
                          </div>
                          <h4 className="font-medium text-green-800">{t('addDonation', 'Add a donation (optional)')}</h4>
                        </div>
                        <p className="text-xs text-green-700">
                          {t('donationDescription', '100% of your donation goes directly to conservation initiatives (minus transfer charges).')}
                        </p>
                        <div className="flex items-center gap-2">
                          <Label htmlFor="donation" className="text-sm font-medium text-green-800">KES</Label>
                          <Input
                            id="donation"
                            type="number"
                            min="0"
                            step="50"
                            value={formData.donation || ''}
                            onChange={(e) => updateFormData('donation', parseInt(e.target.value) || 0)}
                            placeholder="0"
                            className="w-24 border-green-200 focus:border-green-400"
                          />
                          <span className="text-xs text-green-600">Optional</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="flex justify-end">
                    <Button onClick={handleNextStep} disabled={!validateStep2()}>
                      {t('continue', 'Continue')}
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Confirm */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold">{t('confirmBooking', 'Confirm your booking')}</h3>
                  
                  {/* Terms and Conditions */}
                  <Card>
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          id="terms"
                          checked={formData.agreeTerms}
                          onCheckedChange={(checked) => updateFormData('agreeTerms', checked)}
                        />
                        <Label htmlFor="terms" className="text-sm leading-relaxed">
                          I agree to the{' '}
                          <a href="/terms" target="_blank" className="text-primary hover:underline">
                            terms and conditions
                          </a>{' '}
                          and{' '}
                          <a href="/privacy-policy" target="_blank" className="text-primary hover:underline">
                            privacy policy
                          </a>
                        </Label>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          id="marketing"
                          checked={formData.marketingOptIn}
                          onCheckedChange={(checked) => updateFormData('marketingOptIn', checked)}
                        />
                        <Label htmlFor="marketing" className="text-sm leading-relaxed">
                          {t('marketingOptIn', 'I would like to receive updates about conservation impact and future experiences (optional)')}
                        </Label>
                      </div>
                    </CardContent>
                  </Card>

                  {impactSummary && (
                    <Card className="bg-gradient-to-r from-green-50/50 to-emerald-50/50 border-green-200/50">
                      <CardContent className="p-6">
                        <h4 className="font-semibold text-green-800 mb-3">{t('yourImpact', 'Your conservation impact')}</h4>
                        <div className="space-y-2 text-sm text-green-700">
                          <div className="flex justify-between">
                            <span>Partner initiatives (90% + donations)</span>
                            <span className="font-medium">{formatPrice(impactSummary.numbers.partner)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Platform & operations (10%)</span>
                            <span className="font-medium">{formatPrice(impactSummary.numbers.platform)}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <div className="flex justify-end gap-3">
                    <Button 
                      variant="outline" 
                      onClick={() => setCurrentStep(2)}
                      disabled={isProcessingPayment}
                    >
                      {t('back', 'Back')}
                    </Button>
                    <Button 
                      onClick={handleConfirmBooking} 
                      disabled={!validateStep3() || isProcessingPayment}
                      className="min-w-[120px]"
                    >
                      {isProcessingPayment ? t('processing', 'Processing...') : t('confirmAndPay', 'Confirm & Pay')}
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Right side - Summary */}
            <Card className="lg:col-span-1 h-fit sticky top-0">
              <CardContent className="p-4 space-y-4">
                <h4 className="font-medium text-lg">{t('pricingSummary', 'Your booking')}</h4>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>{cart.adults + cart.children} people × {cart.date}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Experience fee</span>
                    <span>{formatPrice(cart.subtotal)}</span>
                  </div>
                  
                  {(formData.donation && formData.donation > 0) && (
                    <div className="flex justify-between text-green-600">
                      <span>Optional donation</span>
                      <span>{formatPrice(formData.donation)}</span>
                    </div>
                  )}
                  
                  <div className="border-t pt-2 space-y-1 text-xs text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Partner initiatives (90% + donations)</span>
                      <span>{formatPrice(cart.split.partner90 + (formData.donation || 0))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Platform & operations (10%)</span>
                      <span>{formatPrice(cart.split.platform10)}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between font-semibold pt-2 border-t">
                    <span>Total</span>
                    <span>{formatPrice(cart.subtotal + (formData.donation || 0))}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingWizardNew;
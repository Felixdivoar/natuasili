import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    
    const dateValidation = validateBookingDate(cart.date, experience?.slug, experience?.project?.name);
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
      <DialogContent className="max-w-5xl w-full mx-4 max-h-[96vh] overflow-hidden p-0 gap-0 bg-gradient-to-br from-background via-background to-muted/10">
        {/* Modern Header */}
        <div className="border-b bg-card/50 backdrop-blur-sm px-8 py-6">
          <DialogTitle className="text-2xl font-semibold tracking-tight text-center">
            {t('bookYourExperience', 'Complete Your Booking')}
          </DialogTitle>
          
          {/* Modern Progress Steps */}
          <div className="flex items-center justify-center mt-6">
            <div className="flex items-center gap-1 bg-muted/30 rounded-full p-1.5 backdrop-blur-sm border">
              {steps.map((step, index) => (
                <React.Fragment key={step.number}>
                  <div className={`flex items-center gap-3 px-4 py-2.5 rounded-full transition-all duration-200 ${
                    step.completed || currentStep === step.number
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                      step.completed || currentStep === step.number
                        ? 'bg-primary-foreground/20'
                        : 'bg-muted'
                    }`}>
                      {step.completed ? <CheckCircle className="h-3.5 w-3.5" /> : step.number}
                    </div>
                    <span className="text-sm font-medium whitespace-nowrap">
                      {step.title}
                    </span>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto px-8 py-6">
          <div className="grid lg:grid-cols-5 gap-8 max-w-6xl mx-auto">
            {/* Left side - Steps */}
            <div className="lg:col-span-3 space-y-8">

              {/* Step 2: Contact */}
              {currentStep === 2 && (
                <div className="space-y-8">
                  {/* Section Header */}
                  <div className="text-center space-y-2">
                    <h3 className="text-xl font-semibold tracking-tight">{t('contactInformation', 'Your Details')}</h3>
                    <p className="text-muted-foreground">We'll send your confirmation and updates here</p>
                  </div>
                  
                  {/* Selected details summary with modern design */}
                  <Card className="bg-gradient-to-br from-primary/5 via-primary/5 to-primary/10 border-primary/10 shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium text-primary">Your Selection</h4>
                        <Button variant="ghost" size="sm" onClick={handleEditDetails} className="text-primary hover:bg-primary/10">
                          <ArrowLeft className="h-4 w-4 mr-2" />
                          Edit Details
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 bg-background/50 rounded-lg p-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <Calendar className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground">Date</div>
                            <div className="font-medium">{cart.date}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 bg-background/50 rounded-lg p-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <Users className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground">Guests</div>
                            <div className="font-medium">{cart.adults + cart.children} people</div>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-primary/10">
                        <Badge variant="secondary" className="bg-primary/5 text-primary border-primary/20">
                          Standard Experience
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Modern Form Layout */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <Card className="border-0 bg-card/30 backdrop-blur-sm shadow-sm">
                      <CardContent className="p-6 space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-sm font-medium flex items-center gap-2">
                            <User className="h-4 w-4 text-primary" />
                            {t('fullName', 'Full Name')} *
                          </Label>
                          <Input 
                            id="name"
                            value={formData.name}
                            onChange={(e) => updateFormData('name', e.target.value)}
                            required
                            className="h-11 border-0 bg-background/70 shadow-sm focus:shadow-md transition-shadow"
                            placeholder="Enter your full name"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                            <Mail className="h-4 w-4 text-primary" />
                            {t('email', 'Email Address')} *
                          </Label>
                          <Input 
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => updateFormData('email', e.target.value)}
                            required
                            className="h-11 border-0 bg-background/70 shadow-sm focus:shadow-md transition-shadow"
                            placeholder="your@email.com"
                          />
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-0 bg-card/30 backdrop-blur-sm shadow-sm">
                      <CardContent className="p-6 space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="phone" className="text-sm font-medium flex items-center gap-2">
                            <Phone className="h-4 w-4 text-primary" />
                            {t('phone', 'Phone Number')} *
                          </Label>
                          <Input 
                            id="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => updateFormData('phone', e.target.value)}
                            required
                            className="h-11 border-0 bg-background/70 shadow-sm focus:shadow-md transition-shadow"
                            placeholder="+254 700 000 000"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="mobility" className="text-sm font-medium">
                            {t('mobilityAssistance', 'Accessibility Needs')}
                          </Label>
                          <Select value={formData.mobility} onValueChange={(value) => updateFormData('mobility', value)}>
                            <SelectTrigger className="h-11 border-0 bg-background/70 shadow-sm focus:shadow-md transition-shadow">
                              <SelectValue placeholder={t('selectOption', 'None required')} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">{t('noAssistance', 'No assistance needed')}</SelectItem>
                              <SelectItem value="walking">{t('walkingAid', 'Walking assistance')}</SelectItem>
                              <SelectItem value="wheelchair">{t('wheelchair', 'Wheelchair accessible')}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Special Requests */}
                  <Card className="border-0 bg-card/30 backdrop-blur-sm shadow-sm">
                    <CardContent className="p-6">
                      <Label htmlFor="requests" className="text-sm font-medium mb-3 block">
                        {t('specialRequests', 'Special Requests')} 
                        <span className="text-xs text-muted-foreground ml-1">(Optional)</span>
                      </Label>
                      <Textarea 
                        id="requests"
                        value={formData.specialRequests}
                        onChange={(e) => updateFormData('specialRequests', e.target.value)}
                        placeholder={t('specialRequestsPlaceholder', 'Any dietary restrictions, special occasions, or other requests...')}
                        rows={3}
                        className="border-0 bg-background/70 shadow-sm focus:shadow-md transition-shadow resize-none"
                      />
                    </CardContent>
                  </Card>

                  {/* Optional Donation Section - Modern Design */}
                  <Card className="bg-gradient-to-br from-emerald-50/50 via-green-50/30 to-emerald-50/20 border-emerald-200/30 shadow-sm">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-sm">
                            <span className="text-white text-sm font-bold">🌱</span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-emerald-800">{t('addDonation', 'Support Conservation')}</h4>
                            <p className="text-xs text-emerald-700/80">
                              {t('donationDescription', '100% goes directly to conservation initiatives')}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 bg-background/40 rounded-lg p-3">
                          <Label htmlFor="donation" className="text-sm font-medium text-emerald-800 whitespace-nowrap">
                            Add KES
                          </Label>
                          <Input
                            id="donation"
                            type="number"
                            min="0"
                            step="50"
                            value={formData.donation || ''}
                            onChange={(e) => updateFormData('donation', parseInt(e.target.value) || 0)}
                            placeholder="0"
                            className="border-0 bg-background/70 shadow-sm focus:shadow-md transition-shadow"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Modern Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep(1)}
                      className="flex-1 h-11 border-0 bg-background/50 hover:bg-background shadow-sm hover:shadow-md transition-all"
                      disabled={isProcessingPayment}
                    >
                      ← Previous
                    </Button>
                    <Button
                      onClick={handleNextStep}
                      disabled={!validateStep2() || isProcessingPayment}
                      className="flex-1 h-11 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-sm hover:shadow-md transition-all"
                    >
                      Continue to Review →
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

            {/* Right side - Modern Summary */}
            <div className="lg:col-span-2">
              <Card className="sticky top-6 border-0 bg-gradient-to-br from-card via-card to-muted/5 backdrop-blur-sm shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-primary" />
                    </div>
                    Booking Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Experience Info - Enhanced */}
                  <div className="space-y-4">
                    <div className="flex gap-4 p-4 bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl border border-primary/10">
                      <div className="relative">
                        <img 
                          src={experience.heroImage || experience.images?.[0]}
                          alt={experience.title}
                          className="w-20 h-20 rounded-xl object-cover shadow-md"
                        />
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                          <CheckCircle className="h-3 w-3 text-primary-foreground" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-base line-clamp-2">{experience.title}</h4>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                          <MapPin className="h-4 w-4 text-primary" />
                          <span className="truncate">{experience.locationText}</span>
                        </div>
                        <Badge variant="secondary" className="mt-2 bg-primary/10 text-primary border-primary/20">
                          Conservation Experience
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Booking Details - Modern Layout */}
                  <div className="space-y-4">
                    <h5 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Trip Details</h5>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-background/30 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-primary" />
                          <span className="text-sm text-muted-foreground">Date</span>
                        </div>
                        <span className="font-medium">{cart.date}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-background/30 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-primary" />
                          <span className="text-sm text-muted-foreground">Guests</span>
                        </div>
                        <span className="font-medium">{cart.adults + cart.children} people</span>
                      </div>
                    </div>
                  </div>

                  {/* Pricing - Enhanced Design */}
                  {impactSummary && (
                    <div className="space-y-4">
                      <h5 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Price Breakdown</h5>
                      <div className="space-y-3 p-4 bg-gradient-to-br from-background/50 to-background/30 rounded-xl border">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-muted-foreground">Experience cost × {cart.adults + cart.children}</span>
                          <span className="font-medium">{formatPrice(cart.subtotal)}</span>
                        </div>
                        {formData.donation > 0 && (
                          <div className="flex justify-between items-center text-sm">
                            <div className="flex items-center gap-2">
                              <span className="text-emerald-700">🌱 Conservation donation</span>
                            </div>
                            <span className="font-medium text-emerald-700">+{formatPrice(formData.donation)}</span>
                          </div>
                        )}
                        <div className="border-t pt-3 mt-3">
                          <div className="flex justify-between items-center">
                            <span className="font-semibold">Total Amount</span>
                            <div className="text-right">
                              <div className="text-xl font-bold text-primary">
                                {formatPrice(cart.subtotal + (formData.donation || 0))}
                              </div>
                              <div className="text-xs text-muted-foreground">Secure payment</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingWizardNew;
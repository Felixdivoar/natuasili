import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle, MapPin, Users, Calendar, Mail, Phone, User, ArrowLeft } from "lucide-react";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useCart } from "@/contexts/CartContext";
import { useI18n } from "@/contexts/I18nContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { validateBookingDate } from "@/utils/time";
import { saveReceipt } from "@/lib/receipt";
import { makeImpactSummary } from "@/lib/impactSummary";
import { supabase } from "@/integrations/supabase/client";
import { useBookingTimer } from "@/hooks/useBookingTimer";
import BookingTimer from "./BookingTimer";

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
    name: '',
    email: '',
    phone: '',
    specialRequests: '',
    donation: 0,
    agreeTerms: false,
    marketingOptIn: false,
    createAccount: false
  });

  // Booking timer
  const bookingTimer = useBookingTimer(() => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      specialRequests: '',
      donation: 0,
      agreeTerms: false,
      marketingOptIn: false,
      createAccount: false
    });
    onClose();
    toast({
      title: "Booking Session Expired",
      description: "Please start your booking again.",
      variant: "destructive",
    });
  });

  // Start timer when modal opens
  useEffect(() => {
    if (isOpen && !bookingTimer.isActive) {
      bookingTimer.startTimer();
    }
  }, [isOpen]);

  // Auto-fill user profile data on modal open
  useEffect(() => {
    if (isOpen && user && profile) {
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
    setTimeout(() => {
      document.getElementById('availability')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const handleConfirmBooking = async () => {
    if (!validateStep3() || !cart || isProcessingPayment) return;

    const validation = validateBookingData();
    if (!validation.isValid) {
      toast({
        title: "Booking Error",
        description: validation.error,
        variant: "destructive",
      });
      if (validation.error?.includes("date") || validation.error?.includes("11:00")) {
        handleEditDetails();
      }
      return;
    }

    setIsProcessingPayment(true);

    try {
      let bookingUserId = user?.id;

      // Create account if user opted for it and is not logged in
      if (!user && formData.createAccount) {
        try {
          const tempPassword = Math.random().toString(36).slice(-12) + 'A1!';
          
          const { data: authData, error: authError } = await supabase.auth.signUp({
            email: formData.email,
            password: tempPassword,
            options: {
              data: {
                first_name: formData.name.split(' ')[0] || formData.name,
                last_name: formData.name.split(' ').slice(1).join(' ') || '',
                role: 'traveler'
              },
              emailRedirectTo: `${window.location.origin}/auth/callback`
            }
          });

          if (authError) {
            console.warn('Account creation failed, proceeding as guest:', authError.message);
            bookingUserId = null;
          } else if (authData.user) {
            bookingUserId = authData.user.id;
            toast({
              title: "Account Created!",
              description: "Check your email to set your password and access your dashboard.",
              variant: "default",
            });
          }
        } catch (error) {
          console.warn('Account creation error, proceeding as guest:', error);
          bookingUserId = null;
        }
      }

      // Find existing experience in Supabase
      let experienceId: string;
      
      const { data: existingExperience } = await supabase
        .from('experiences')
        .select('id')
        .eq('slug', experience.slug)
        .single();
        
      if (existingExperience?.id) {
        experienceId = existingExperience.id;
      } else {
        experienceId = '00000000-0000-0000-0000-000000000001';
      }

      // Create the booking in the database
      const totalAmount = cart.subtotal + (formData.donation || 0);
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert({
          experience_id: experienceId,
          user_id: bookingUserId,
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

      // Create Pesapal payment order
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

      // Save receipt data
      const donationAmount = formData.donation || 0;
      const receipt = {
        slug: experience.slug,
        date: cart.date,
        people: cart.adults + cart.children,
        optionId: cart.optionId,
        unitPrice: cart.unitPrice,
        subtotal: cart.subtotal,
        donation: donationAmount,
        partner: cart.split.partner90 + donationAmount,
        platform: cart.split.platform10,
        currency: cart.currency,
      };
      saveReceipt(receipt);

      bookingTimer.stopTimer();
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
      <DialogContent className="max-w-4xl w-full mx-2 sm:mx-4 max-h-[95vh] sm:max-h-[90vh] flex flex-col p-0 gap-0 bg-gradient-to-br from-background via-background to-muted/10 overflow-hidden">
        {/* Compact Header */}
        <div className="border-b bg-card/50 backdrop-blur-sm px-3 sm:px-4 md:px-6 py-3 sm:py-4 flex-shrink-0">
          <DialogTitle className="text-lg sm:text-xl md:text-2xl font-semibold tracking-tight text-center">
            {t('bookYourExperience', 'Complete Your Booking')}
          </DialogTitle>
          
          {/* Compact Progress Steps */}
          <div className="flex items-center justify-center mt-3 sm:mt-4">
            <div className="flex items-center gap-1 bg-muted/30 rounded-full p-1 backdrop-blur-sm border">
              {steps.map((step, index) => (
                <React.Fragment key={step.number}>
                  <div className={`flex items-center gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-full transition-all duration-200 ${
                    step.completed || currentStep === step.number
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}>
                    <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center text-xs font-medium ${
                      step.completed || currentStep === step.number
                        ? 'bg-primary-foreground/20'
                        : 'bg-muted'
                    }`}>
                      {step.completed ? <CheckCircle className="h-2.5 w-2.5 sm:h-3 sm:w-3" /> : step.number}
                    </div>
                    <span className="text-xs sm:text-sm font-medium whitespace-nowrap hidden sm:inline">
                      {step.title}
                    </span>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
            {/* Booking Timer */}
            <BookingTimer 
              timeRemaining={bookingTimer.timeRemaining}
              formatTime={bookingTimer.formatTime}
              isActive={bookingTimer.isActive}
              className="mb-3 sm:mb-4"
            />
            
            <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
              {/* Left side - Steps */}
              <div className="lg:col-span-2 space-y-4 sm:space-y-6">

                {/* Step 2: Contact */}
                {currentStep === 2 && (
                  <div className="space-y-4 sm:space-y-6">
                    {/* Section Header */}
                    <div className="text-center space-y-2">
                      <h3 className="text-lg sm:text-xl font-semibold tracking-tight">{t('contactInformation', 'Your Details')}</h3>
                      <p className="text-sm text-muted-foreground">We'll send your confirmation and updates here</p>
                    </div>
                    
                    {/* Selected details summary */}
                    <Card className="bg-gradient-to-br from-primary/5 via-primary/5 to-primary/10 border-primary/10 shadow-sm">
                      <CardContent className="p-3 sm:p-4 md:p-6">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium text-primary text-sm">Your Selection</h4>
                          <Button variant="ghost" size="sm" onClick={handleEditDetails} className="text-primary hover:bg-primary/10 text-xs">
                            <ArrowLeft className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-2 sm:gap-3">
                          <div className="flex items-center gap-2 bg-background/50 rounded-lg p-2">
                            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-primary/10 flex items-center justify-center">
                              <Calendar className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-primary" />
                            </div>
                            <div>
                              <div className="text-xs text-muted-foreground">Date</div>
                              <div className="font-medium text-xs sm:text-sm">{cart.date}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 bg-background/50 rounded-lg p-2">
                            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-primary/10 flex items-center justify-center">
                              <Users className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-primary" />
                            </div>
                            <div>
                              <div className="text-xs text-muted-foreground">Guests</div>
                              <div className="font-medium text-xs sm:text-sm">{cart.adults + cart.children} people</div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    {/* Form Layout */}
                    <div className="space-y-4">
                      <Card className="border-0 bg-card/30 backdrop-blur-sm shadow-sm">
                        <CardContent className="p-4 space-y-4">
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
                              className="h-10 border-0 bg-background/70 shadow-sm focus:shadow-md transition-shadow"
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
                              className="h-10 border-0 bg-background/70 shadow-sm focus:shadow-md transition-shadow"
                              placeholder="your@email.com"
                            />
                          </div>

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
                              className="h-10 border-0 bg-background/70 shadow-sm focus:shadow-md transition-shadow"
                              placeholder="+254 700 000 000"
                            />
                          </div>

                          {/* Account Creation Option for guests */}
                          {!user && (
                            <div className="space-y-2 pt-2 border-t border-muted/30 block">
                              <div className="flex items-start space-x-2 w-full">
                                 <Checkbox
                                   id="createAccount"
                                   checked={formData.createAccount}
                                   onCheckedChange={(checked) => updateFormData('createAccount', checked)}
                                   className="h-2.5 w-2.5 mt-0.5 flex-shrink-0"
                                 />
                                <Label htmlFor="createAccount" className="text-sm leading-relaxed cursor-pointer flex-1">
                                  <span className="font-medium text-primary">Create an account to manage all my bookings</span>
                                  <br />
                                  <span className="text-xs text-muted-foreground">We'll send you a secure link to set your password</span>
                                </Label>
                              </div>
                            </div>
                          )}
                         </CardContent>
                       </Card>
                       
                       {/* Optional Fields */}
                       <Card className="border-0 bg-card/30 backdrop-blur-sm shadow-sm">
                         <CardContent className="p-4">
                           <div className="space-y-2">
                             <Label htmlFor="specialRequests" className="text-sm font-medium">
                               {t('specialRequests', 'Special Requests')} <span className="text-muted-foreground">(Optional)</span>
                             </Label>
                             <Textarea
                               id="specialRequests"
                               value={formData.specialRequests}
                               onChange={(e) => updateFormData('specialRequests', e.target.value)}
                               placeholder="Any dietary requirements, accessibility needs, or special requests..."
                               className="min-h-[80px] border-0 bg-background/70 shadow-sm focus:shadow-md transition-shadow resize-none"
                               maxLength={500}
                             />
                             <div className="text-xs text-muted-foreground text-right">
                               {formData.specialRequests.length}/500
                             </div>
                           </div>
                         </CardContent>
                       </Card>
                     </div>

                     {/* Navigation buttons */}
                     <div className="flex flex-col sm:flex-row gap-3 pt-4">
                       <Button
                         type="button"
                         onClick={handleNextStep}
                         disabled={!validateStep2() || bookingTimer.isExpired}
                         className="w-full sm:ml-auto sm:w-auto h-11"
                         size="lg"
                       >
                         {bookingTimer.isExpired ? "Session Expired" : "Continue to Review"}
                       </Button>
                     </div>
                   </div>
                 )}

                 {/* Step 3: Confirm */}
                 {currentStep === 3 && (
                   <div className="space-y-4 sm:space-y-6">
                     {/* Section Header */}
                     <div className="text-center space-y-2">
                       <h3 className="text-lg sm:text-xl font-semibold tracking-tight">{t('reviewAndConfirm', 'Review & Confirm')}</h3>
                       <p className="text-sm text-muted-foreground">Please review your booking details</p>
                     </div>

                     {/* Contact Summary */}
                     <Card className="bg-gradient-to-br from-primary/5 via-primary/5 to-primary/10 border-primary/10 shadow-sm">
                       <CardContent className="p-4">
                         <div className="flex items-center justify-between mb-3">
                           <h4 className="font-medium text-primary text-sm">Contact Information</h4>
                           <Button variant="ghost" size="sm" onClick={() => setCurrentStep(2)} className="text-primary hover:bg-primary/10 text-xs">
                             <ArrowLeft className="h-3 w-3 mr-1" />
                             Edit
                           </Button>
                         </div>
                         <div className="space-y-2 text-sm">
                           <div>
                             <span className="text-muted-foreground">Name:</span> {formData.name}
                           </div>
                           <div>
                             <span className="text-muted-foreground">Email:</span> {formData.email}
                           </div>
                           <div>
                             <span className="text-muted-foreground">Phone:</span> {formData.phone}
                           </div>
                           {formData.specialRequests && (
                             <div>
                               <span className="text-muted-foreground">Special Requests:</span> {formData.specialRequests}
                             </div>
                           )}
                         </div>
                       </CardContent>
                     </Card>

                     {/* Terms and Marketing */}
                     <Card className="border-0 bg-card/30 backdrop-blur-sm shadow-sm">
                       <CardContent className="p-4 space-y-4">
                         <div className="flex items-start space-x-3">
                           <Checkbox
                             id="agreeTerms"
                             checked={formData.agreeTerms}
                             onCheckedChange={(checked) => updateFormData('agreeTerms', checked)}
                             required
                             className="h-4 w-4"
                           />
                           <Label htmlFor="agreeTerms" className="text-sm leading-relaxed cursor-pointer">
                             I agree to the{' '}
                             <button type="button" className="text-primary hover:underline">
                               Terms and Conditions
                             </button>{' '}
                             and{' '}
                             <button type="button" className="text-primary hover:underline">
                               Privacy Policy
                             </button>
                             <span className="text-destructive ml-1">*</span>
                           </Label>
                         </div>
                         
                         <div className="flex items-start space-x-3">
                           <Checkbox
                             id="marketingOptIn"
                             checked={formData.marketingOptIn}
                             onCheckedChange={(checked) => updateFormData('marketingOptIn', checked)}
                             className="h-4 w-4"
                           />
                           <Label htmlFor="marketingOptIn" className="text-sm leading-relaxed cursor-pointer">
                             I'd like to receive updates about conservation impact and similar experiences
                           </Label>
                         </div>
                       </CardContent>
                     </Card>

                     {/* Navigation buttons */}
                     <div className="flex flex-col sm:flex-row gap-3 pt-4">
                       <Button
                         type="button"
                         variant="outline"
                         onClick={() => setCurrentStep(2)}
                         className="sm:w-auto"
                       >
                         Back
                       </Button>
                       <Button
                         type="button"
                         onClick={handleConfirmBooking}
                         disabled={!validateStep3() || isProcessingPayment || bookingTimer.isExpired}
                         className="w-full sm:ml-auto sm:w-auto h-11"
                         size="lg"
                       >
                         {isProcessingPayment ? "Processing..." : bookingTimer.isExpired ? "Session Expired" : `Pay ${formatPrice(cart.subtotal + (formData.donation || 0))}`}
                       </Button>
                     </div>
                   </div>
                 )}

              </div>

              {/* Right side - Summary */}
              <div className="lg:col-span-1">
                <div className="lg:sticky lg:top-4">
                  <Card className="bg-gradient-to-br from-muted/30 via-muted/10 to-background border-muted/20 shadow-lg backdrop-blur-sm">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base sm:text-lg font-semibold flex items-center gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        {t('bookingSummary', 'Your Booking')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm">
                      {/* Experience Details */}
                      <div className="space-y-3 pb-3 border-b border-muted/30">
                        <div className="flex items-start gap-3">
                          <div className="w-12 sm:w-16 h-12 sm:h-16 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                            <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-foreground text-sm sm:text-base line-clamp-2">
                              {experience.title}
                            </h4>
                            <p className="text-xs text-muted-foreground">
                              {experience.locationText}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Booking Details */}
                      <div className="space-y-3">
                        <h5 className="font-medium text-xs text-muted-foreground uppercase tracking-wide">Details</h5>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center p-2 bg-background/30 rounded-lg">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3 text-primary" />
                              <span className="text-xs text-muted-foreground">Date</span>
                            </div>
                            <span className="font-medium text-sm">{cart.date}</span>
                          </div>
                          <div className="flex justify-between items-center p-2 bg-background/30 rounded-lg">
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3 text-primary" />
                              <span className="text-xs text-muted-foreground">Guests</span>
                            </div>
                            <span className="font-medium text-sm">{cart.adults + cart.children} people</span>
                          </div>
                        </div>
                      </div>

                      {/* Pricing */}
                      {impactSummary && (
                        <div className="space-y-3">
                          <h5 className="font-medium text-xs text-muted-foreground uppercase tracking-wide">Total</h5>
                          <div className="space-y-2 p-3 bg-gradient-to-br from-background/50 to-background/30 rounded-lg border">
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-muted-foreground">Experience × {cart.adults + cart.children}</span>
                              <span className="font-medium">{formatPrice(cart.subtotal)}</span>
                            </div>
                            {formData.donation > 0 && (
                              <div className="flex justify-between items-center text-sm">
                                <span className="text-emerald-700">🌱 Donation</span>
                                <span className="font-medium text-emerald-700">+{formatPrice(formData.donation)}</span>
                              </div>
                            )}
                            <div className="border-t pt-2 mt-2">
                              <div className="flex justify-between items-center">
                                <span className="font-semibold text-sm">Total</span>
                                <div className="text-right">
                                  <div className="text-lg font-bold text-primary">
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
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingWizardNew;
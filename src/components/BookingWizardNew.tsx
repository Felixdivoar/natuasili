import React, { useState } from 'react';
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
  const { user } = useAuth();
  
  const [currentStep, setCurrentStep] = useState(2); // Start at Step 2 (Contact)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    mobility: '',
    specialRequests: '',
    agreeTerms: false,
    marketingOptIn: false
  });

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateStep2 = () => {
    return formData.name && formData.email && formData.phone;
  };

  const validateStep3 = () => {
    return formData.agreeTerms;
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
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert({
          experience_id: experienceId,
          user_id: user?.id,
          customer_name: formData.name,
          customer_email: formData.email,
          customer_phone: formData.phone,
          booking_date: cart.date,
          adults: cart.people,
          children: 0,
          total_kes: cart.subtotal,
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
      const { data: paymentResponse, error: paymentError } = await supabase.functions.invoke('create-pesapal-order', {
        body: {
          booking_id: booking.id,
          amount: cart.subtotal,
          currency: cart.currency,
          description: `Booking for ${experience.title} - ${cart.people} people on ${cart.date}`,
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
        throw new Error(`Payment setup failed: ${paymentError.message}`);
      }

      if (!paymentResponse.success || !paymentResponse.redirect_url) {
        throw new Error('Failed to create payment session');
      }

      // Save receipt data for later reference
      const receipt = {
        slug: experience.slug,
        date: cart.date,
        people: cart.people,
        optionId: cart.optionId,
        unitPrice: cart.unitPrice,
        subtotal: cart.subtotal,
        partner: cart.split.partner90,
        platform: cart.split.platform10,
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
    people: cart.people,
    unitPriceKES: cart.unitPrice,
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
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {t('bookYourExperience', 'Book Your Experience')}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid lg:grid-cols-3 gap-6 overflow-y-auto">
          {/* Left side - Steps */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Steps */}
            <div className="flex items-center justify-center gap-4 mb-6">
              {steps.map((step, index) => (
                <React.Fragment key={step.number}>
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step.completed || currentStep === step.number
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {step.completed ? <CheckCircle className="h-4 w-4" /> : step.number}
                    </div>
                    <span className={`text-sm font-medium ${
                      step.completed || currentStep === step.number 
                        ? 'text-foreground' 
                        : 'text-muted-foreground'
                    }`}>
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`h-px w-8 ${
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
                        <span>{cart.people} people</span>
                      </div>
                      <div className="col-span-2">
                        <Badge variant="secondary">{cart.optionId === 'premium' ? 'Premium Experience' : 'Standard Experience'}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">{t('fullName', 'Full Name')} *</Label>
                    <Input 
                      id="name"
                      value={formData.name}
                      onChange={(e) => updateFormData('name', e.target.value)}
                      required
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
                    />
                  </div>

                  <div>
                    <Label htmlFor="mobility">{t('mobilityAssistance', 'Mobility Assistance')}</Label>
                    <Select value={formData.mobility} onValueChange={(value) => updateFormData('mobility', value)}>
                      <SelectTrigger>
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
                  />
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleNextStep} disabled={!validateStep2()}>
                    {t('continue', 'Continue')}
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Confirm (inline confirmation) */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">{t('confirmBooking', 'Confirm your booking')}</h3>
                
                {/* Booking Summary */}
                <Card>
                  <CardContent className="p-6 space-y-4">
                    <h4 className="font-medium text-lg">{t('bookingSummary', 'Booking Summary')}</h4>
                    
                    <div className="space-y-4">
                      <div>
                        <h5 className="font-medium text-base">{experience.title}</h5>
                        <div className="grid grid-cols-2 gap-4 text-sm mt-2">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>{cart.date}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span>{cart.people} people</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span>{formData.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span>{formData.email}</span>
                          </div>
                        </div>
                        <div className="mt-2">
                          <Badge variant="secondary">
                            {cart.optionId === 'premium' ? 'Premium Experience' : 'Standard Experience'}
                          </Badge>
                        </div>
                      </div>

                      {/* Price Summary */}
                      <div className="border-t pt-4 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{formatPrice(cart.unitPrice)} × {cart.people} people</span>
                          <span>{formatPrice(cart.subtotal)}</span>
                        </div>
                        <div className="space-y-1 text-xs text-muted-foreground">
                          <div className="flex justify-between">
                            <span>Partner initiatives (90%)</span>
                            <span>{formatPrice(cart.split.partner90)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Platform & operations (10%)</span>
                            <span>{formatPrice(cart.split.platform10)}</span>
                          </div>
                        </div>
                        <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                          <span>Total</span>
                          <span>{formatPrice(cart.subtotal)}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="terms"
                      checked={formData.agreeTerms}
                      onCheckedChange={(checked) => updateFormData('agreeTerms', checked)}
                    />
                    <Label htmlFor="terms" className="text-sm">
                      {t('agreeTerms', 'I agree to the')}{' '}
                      <a href="/terms" className="text-primary hover:underline">
                        {t('termsConditions', 'Terms & Conditions')}
                      </a>{' '}
                      {t('and', 'and')}{' '}
                      <a href="/privacy-policy" className="text-primary hover:underline">
                        {t('privacyPolicy', 'Privacy Policy')}
                      </a>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="marketing"
                      checked={formData.marketingOptIn}
                      onCheckedChange={(checked) => updateFormData('marketingOptIn', checked)}
                    />
                    <Label htmlFor="marketing" className="text-sm text-muted-foreground">
                      {t('marketingOptIn', 'I would like to receive updates and special offers')}
                    </Label>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setCurrentStep(2)}>
                    {t('back', 'Back')}
                  </Button>
                  <Button onClick={handleConfirmBooking} disabled={!validateStep3() || isProcessingPayment}>
                    {isProcessingPayment ? 'Processing...' : t('payWithPesapal', 'Pay with Pesapal')}
                  </Button>
                </div>
              </div>
            )}

            {/* Step 4: Success (inline) */}
            {currentStep === 4 && (
              <div className="space-y-6 text-center">
                <div className="space-y-4">
                  <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
                  <h3 className="text-2xl font-bold text-green-600">
                    {t('bookingConfirmed', 'Booking Confirmed!')}
                  </h3>
                </div>

                <Card>
                  <CardContent className="p-6 space-y-4">
                    <h4 className="font-medium text-lg">What you booked</h4>
                    <div className="text-left space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Experience:</span>
                        <span className="font-medium">{experience.title}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Date:</span>
                        <span>{cart.date}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>People:</span>
                        <span>{cart.people}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Option:</span>
                        <span>{cart.optionId === 'premium' ? 'Premium' : 'Standard'}</span>
                      </div>
                      <div className="flex justify-between border-t pt-2 font-semibold">
                        <span>Total paid:</span>
                        <span>{formatPrice(cart.subtotal)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-left">
                  <h4 className="font-medium mb-2">What to expect next:</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• You'll receive a confirmation email with your booking details, meeting point/pickup info, and contact numbers.</li>
                    <li>• A second email will include your impact receipt after the experience.</li>
                    <li>• Our partner will contact you 24 hours before your experience with final details.</li>
                  </ul>
                </div>

                {impactSummary && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-left">
                    <h4 className="font-medium mb-2">Your impact:</h4>
                    <div className="text-sm text-muted-foreground space-y-1">
                      {impactSummary.lines.map((line, index) => (
                        <p key={index}>{line}</p>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-3 justify-center">
                  <Button variant="outline" onClick={onClose}>
                    Close
                  </Button>
                  <Button onClick={() => window.location.href = '/traveler-dashboard'}>
                    View Booking
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Right side - Price Summary & Experience Card */}
          <div className="space-y-4">
            {/* Experience Card */}
            <Card>
              <CardContent className="p-4">
                <div className="aspect-video bg-muted rounded-lg mb-3 overflow-hidden">
                  <img 
                    src={experience.hero_image || '/images/placeholder-1.jpg'} 
                    alt={experience.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h4 className="font-semibold text-sm">{experience.title}</h4>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                  <MapPin className="h-3 w-3" />
                  <span>{experience.location || 'Kenya'}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Badge variant="outline" className="text-xs mt-2">
                    {experience.theme || 'Conservation'}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Price Summary */}
            <Card>
              <CardContent className="p-4 space-y-3">
                <h4 className="font-semibold">Price Summary</h4>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>{formatPrice(cart.unitPrice)} × {cart.people}</span>
                    <span>{formatPrice(cart.subtotal)}</span>
                  </div>
                  
                  <div className="border-t pt-2 space-y-1 text-xs text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Partner initiatives (90%)</span>
                      <span>{formatPrice(cart.split.partner90)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Platform & operations (10%)</span>
                      <span>{formatPrice(cart.split.platform10)}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between font-semibold pt-2 border-t">
                    <span>Total</span>
                    <span>{formatPrice(cart.subtotal)}</span>
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
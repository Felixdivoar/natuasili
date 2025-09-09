import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, CreditCard, Shield } from "lucide-react";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useToast } from "@/hooks/use-toast";

interface BookingStepperProps {
  experience: any;
  project: any;
}

const BookingStepper = ({ experience, project }: BookingStepperProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
  const { toast } = useToast();
  
  const currentStep = parseInt(searchParams.get('step') || '1');
  const stepRefs = useRef<(HTMLElement | null)[]>([]);
  
  const [formData, setFormData] = useState({
    date: '',
    people: 1,
    name: '',
    email: '',
    phone: '',
    agreeTerms: false,
    agreeMarketing: false,
  });

  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');

  // Initialize booking utilities on mount
  useEffect(() => {
    // Import and initialize booking utilities
    import('@/utils/bookingUtils').then((module) => {
      if (module.initializeBookingForm) {
        module.initializeBookingForm();
      }
    });
  }, []);

  // Manual navigation validation
  const isStep1Valid = () => {
    const peopleValid = formData.people >= 1 && formData.people <= experience.capacity;
    const dateValid = !!formData.date;
    return peopleValid && dateValid;
  };

  const isStep2Valid = () => {
    return !!formData.name && !!formData.email && /\S+@\S+\.\S+/.test(formData.email);
  };

  const isStep3Valid = () => {
    return formData.agreeTerms;
  };

  const showStep = (step: number, announce = true) => {
    const params = new URLSearchParams(searchParams);
    params.set('step', step.toString());
    setSearchParams(params);
    
    // Focus management for accessibility
    setTimeout(() => {
      const stepElement = stepRefs.current[step - 1];
      const heading = stepElement?.querySelector('h2');
      if (heading) {
        heading.setAttribute('tabindex', '-1');
        heading.focus();
        
        if (announce) {
          const announcement = `Step ${step} of 5: ${heading.textContent}`;
          const announcer = document.getElementById('step-announcer');
          if (announcer) {
            announcer.textContent = announcement;
          }
        }
      }
    }, 100);
  };

  const handleStep1Change = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleStep2Change = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleStep3Change = (checked: boolean) => {
    setFormData(prev => ({ ...prev, agreeTerms: checked }));
  };

  const initPayment = async () => {
    if (!isStep3Valid()) return;
    
    showStep(4);
    setPaymentStatus('processing');
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate payment success
      setPaymentStatus('success');
      showStep(5);
      
      // Show success message
      setTimeout(() => {
        toast({
          title: "Booking Confirmed!",
          description: "You'll receive a confirmation email shortly.",
        });
      }, 500);
      
    } catch (error) {
      setPaymentStatus('error');
      showStep(3);
      toast({
        title: "Payment failed",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    }
  };

  const total = experience.base_price * formData.people;
  const partnerAmount = Math.round(total * (experience.allocation_pct_project / 100));
  const platformAmount = total - partnerAmount;

  const peopleExceedsLimit = formData.people > experience.capacity;

  return (
    <form id="booking-form" 
          data-unit-price={experience.base_price} 
          data-currency={formatPrice(0).split(' ')[0]}
          className="booking-stepper" 
          aria-live="polite">
      {/* Hidden announcer for screen readers */}
      <div id="step-announcer" aria-live="assertive" className="sr-only" />
      
      {/* Hidden mirrors for checkout */}
      <input type="hidden" name="unit_price" id="bf-unit" value={experience.base_price} />
      <input type="hidden" name="currency" id="bf-curr" value={formatPrice(0).split(' ')[0]} />
      <input type="hidden" name="total_price" id="bf-total" value={total} />
      <input type="hidden" name="partner_amount" id="bf-partner" value={partnerAmount} />
      <input type="hidden" name="platform_amount" id="bf-platform" value={platformAmount} />
      
      {/* Progress indicator */}
      <div className="flex items-center justify-between mb-6 text-sm">
        {[1, 2, 3, 4, 5].map((step) => (
          <div
            key={step}
            className={`flex-1 text-center ${
              step === currentStep
                ? 'text-primary font-semibold'
                : step < currentStep
                ? 'text-muted-foreground'
                : 'text-muted-foreground/50'
            }`}
          >
            <div className={`w-8 h-8 rounded-full mx-auto mb-1 flex items-center justify-center text-xs ${
              step === currentStep
                ? 'bg-primary text-primary-foreground'
                : step < currentStep
                ? 'bg-primary/20 text-primary'
                : 'bg-muted text-muted-foreground'
            }`}>
              {step}
            </div>
            <div className="text-xs">
              {step === 1 && 'Details'}
              {step === 2 && 'Contact'}
              {step === 3 && 'Review'}
              {step === 4 && 'Payment'}
              {step === 5 && 'Confirmed'}
            </div>
          </div>
        ))}
      </div>

      {/* Step 1: Booking Details */}
      {currentStep === 1 && (
        <Card ref={(el) => stepRefs.current[0] = el}>
          <CardHeader>
            <CardTitle id="step1-title">
              <h2>Booking Details</h2>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleStep1Change('date', e.target.value)}
                onBlur={(e) => handleStep1Change('date', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bf-people">Number of people *</Label>
              <div className="people-input" data-max={experience.capacity}>
                <Button
                  type="button"
                  className="btn-step px-3 py-2 border border-border bg-muted hover:bg-muted/80 rounded-lg"
                  onClick={() => handleStep1Change('people', Math.max(1, formData.people - 1))}
                  aria-label="Decrease"
                >
                  −
                </Button>
                <Input
                  id="bf-people"
                  name="people"
                  type="number"
                  min="1"
                  max={experience.capacity}
                  value={formData.people}
                  onChange={(e) => handleStep1Change('people', parseInt(e.target.value) || 1)}
                  onBlur={(e) => handleStep1Change('people', parseInt(e.target.value) || 1)}
                  className="w-20 text-center"
                  inputMode="numeric"
                  required
                />
                <Button
                  type="button"
                  className="btn-step px-3 py-2 border border-border bg-muted hover:bg-muted/80 rounded-lg"
                  onClick={() => handleStep1Change('people', Math.min(experience.capacity, formData.people + 1))}
                  aria-label="Increase"
                >
                  +
                </Button>
              </div>
              {peopleExceedsLimit && (
                <p className="people-error text-sm font-bold" role="alert" aria-live="polite">
                  Booking limit reached.
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Maximum {experience.capacity} people
              </p>
            </div>

            <div className="flex gap-2">
              <Button 
                type="button" 
                onClick={() => showStep(2)}
                disabled={!isStep1Valid()}
                className="flex-1"
              >
                Next
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Contact Details */}
      {currentStep === 2 && (
        <Card ref={(el) => stepRefs.current[1] = el}>
          <CardHeader>
            <CardTitle>
              <h2>Your Details</h2>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={(e) => handleStep2Change('name', e.target.value)}
                onBlur={(e) => handleStep2Change('name', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleStep2Change('email', e.target.value)}
                onBlur={(e) => handleStep2Change('email', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleStep2Change('phone', e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => showStep(1)}
                className="flex-1"
              >
                Back
              </Button>
              <Button 
                type="button" 
                onClick={() => showStep(3)}
                disabled={!isStep2Valid()}
                className="flex-1"
              >
                Next
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Review & Terms */}
      {currentStep === 3 && (
        <Card ref={(el) => stepRefs.current[2] = el}>
          <CardHeader>
            <CardTitle>
              <h2>Review & Confirm</h2>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Booking Summary */}
            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <h3 className="font-semibold">{experience.title}</h3>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span>Date:</span>
                  <span>{formData.date}</span>
                </div>
                <div className="flex justify-between">
                  <span>Contact:</span>
                  <span>{formData.name}</span>
                </div>
              </div>
            </div>

            {/* Price Breakdown */}
            <div id="price-review" className="price-review border border-border rounded-lg p-4">
              <div className="row flex justify-between py-1">
                <span>Experience cost</span>
                <span>{formatPrice(experience.base_price)}</span>
              </div>
              <div className="row flex justify-between py-1">
                <span>People</span>
                <span>{formData.people}</span>
              </div>
              <div className="row flex justify-between py-1">
                <span>Subtotal (cost × people)</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="row flex justify-between py-1">
                <span>Partner share (90%)</span>
                <span>{formatPrice(partnerAmount)}</span>
              </div>
              <div className="row flex justify-between py-1">
                <span>Platform & operations (10%)</span>
                <span>{formatPrice(platformAmount)}</span>
              </div>
              <div className="row total flex justify-between py-1 border-t border-border mt-2 pt-2 font-bold">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="note text-sm text-muted-foreground mt-2">
                Your booking funds conservation impact: 90% goes directly to the partner.
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={formData.agreeTerms}
                  onCheckedChange={handleStep3Change}
                />
                <Label htmlFor="terms" className="text-sm leading-relaxed">
                  I agree to the terms and conditions *
                </Label>
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="marketing"
                  checked={formData.agreeMarketing}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, agreeMarketing: checked as boolean }))
                  }
                />
                <Label htmlFor="marketing" className="text-sm leading-relaxed">
                  I'd like to receive conservation impact updates
                </Label>
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => showStep(2)}
                className="flex-1"
              >
                Back
              </Button>
              <Button 
                type="button" 
                onClick={() => initPayment()}
                disabled={!isStep3Valid()}
                className="flex-1"
              >
                Continue to Payment
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Payment Processing */}
      {currentStep === 4 && (
        <Card ref={(el) => stepRefs.current[3] = el}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              <h2>Payment</h2>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center py-8">
              {paymentStatus === 'processing' && (
                <div className="space-y-4">
                  <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto" />
                  <p>Processing payment...</p>
                </div>
              )}
              {paymentStatus === 'error' && (
                <div className="text-destructive">
                  <p>Payment failed. Please try again.</p>
                </div>
              )}
            </div>

            {paymentStatus === 'error' && (
              <div className="flex gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => showStep(3)}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button 
                  type="button" 
                  onClick={() => initPayment()}
                  className="flex-1"
                >
                  Retry Payment
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Step 5: Confirmation */}
      {currentStep === 5 && (
        <Card ref={(el) => stepRefs.current[4] = el}>
          <CardHeader>
            <CardTitle>
              <h2>Booking Confirmed!</h2>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Payment Successful!</h3>
              <p className="text-muted-foreground">
                You'll receive a confirmation email shortly at {formData.email}
              </p>
            </div>

            <div className="bg-muted/50 rounded-lg p-4">
              <h4 className="font-semibold mb-2">Booking Details</h4>
              <div className="text-sm space-y-1">
                <div>Experience: {experience.title}</div>
                <div>Date: {formData.date}</div>
                <div>People: {formData.people}</div>
                <div>Total: {formatPrice(total)}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </form>
  );
};

export default BookingStepper;
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CalendarIcon, Users, Clock, MapPin, Shield, CheckCircle } from "lucide-react";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useSimpleAuth } from "@/contexts/SimpleAuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useSearchParams } from "react-router-dom";
import { validateBookingDate } from "@/utils/time";

interface ResponsiveBookingFormProps {
  experience: any;
  project: any;
}

const ResponsiveBookingForm: React.FC<ResponsiveBookingFormProps> = ({ experience, project }) => {
  const { formatPrice } = useCurrency();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useSimpleAuth();
  
  // Form state with auth autofill - Initialize from URL params
  const [formData, setFormData] = useState(() => {
    const dateParam = searchParams.get('date') || '';
    const adultsParam = parseInt(searchParams.get('adults') || '0');
    const childrenParam = parseInt(searchParams.get('children') || '0');
    const peopleParam = parseInt(searchParams.get('people') || '1');
    
    // Use adults + children if available, otherwise use people
    const totalPeople = (adultsParam + childrenParam) > 0 ? (adultsParam + childrenParam) : peopleParam;
    
    return {
      date: dateParam,
      people: totalPeople,
      name: '',
      email: '',
      phone: '',
      dietary: '',
      mobility: '',
      requests: '',
      terms: false,
      marketing: false
    };
  });
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Auto-fill form from authenticated user
  useEffect(() => {
    if (user && (!formData.name || !formData.email)) {
      setFormData(prev => ({
        ...prev,
        name: prev.name || user.fullName || '',
        email: prev.email || user.email || ''
      }));
    }
  }, [user]);

  // Sync with URL changes (e.g., from listing card before opening modal)
  useEffect(() => {
    const dateParam = searchParams.get('date') || '';
    const adultsParam = parseInt(searchParams.get('adults') || '0');
    const childrenParam = parseInt(searchParams.get('children') || '0');
    const peopleParamRaw = searchParams.get('people');
    const peopleParam = peopleParamRaw ? parseInt(peopleParamRaw) : 0;
    
    // Use adults + children if available, otherwise use people
    const totalPeople = (adultsParam + childrenParam) > 0 ? (adultsParam + childrenParam) : (peopleParam || 1);

    setFormData(prev => ({
      ...prev,
      date: dateParam || prev.date,
      people: totalPeople,
    }));
  }, [searchParams]);




  // Price calculations
  const adultPrice = experience.priceKESAdult || experience.base_price || 350;
  const isGroupPricing = experience.isGroupPricing || false;
  const subtotal = isGroupPricing ? adultPrice : (adultPrice * formData.people);
  const partnerAmount = (subtotal * (experience.allocation_pct_project || 90)) / 100;
  const platformAmount = (subtotal * (experience.allocation_pct_platform || 10)) / 100;

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        if (!formData.date || !formData.people) return false;
        // Add experience-specific date validation
        const dateValidation = validateBookingDate(formData.date, experience?.slug, project?.name);
        return dateValidation.isValid && formData.people >= 1;
      case 2:
        return formData.name && formData.email && formData.phone;
      case 3:
        return formData.terms;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(3)) {
      toast({
        title: "Please complete all required fields",
        description: "Make sure you've agreed to the terms and conditions.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate booking process
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      setCurrentStep(4);
      
      toast({
        title: "Booking confirmed!",
        description: "You'll receive a confirmation email shortly.",
      });
      
      // Navigate to success page after delay
      setTimeout(() => {
        navigate(`/booking-success?experience=${experience.id}&ref=${Date.now()}`);
      }, 2000);
    }, 2000);
  };

  // Step indicators
  const steps = [
    { number: 1, title: "Details", icon: CalendarIcon },
    { number: 2, title: "Contact", icon: Users },
    { number: 3, title: "Confirm", icon: CheckCircle },
    { number: 4, title: "Success", icon: Shield }
  ];

  const StepIndicator = () => (
    <div className="flex justify-center mb-8">
      <div className="flex items-center space-x-2 md:space-x-4">
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            <div className={`flex flex-col items-center ${currentStep >= step.number ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full border-2 flex items-center justify-center text-xs md:text-sm font-medium transition-colors ${
                currentStep >= step.number 
                  ? 'bg-primary text-primary-foreground border-primary' 
                  : 'border-muted-foreground'
              }`}>
                {currentStep > step.number ? <CheckCircle className="w-4 h-4" /> : step.number}
              </div>
              <span className="text-xs mt-1 hidden md:block">{step.title}</span>
            </div>
            {index < steps.length - 1 && (
              <div className={`w-8 md:w-16 h-0.5 ${currentStep > step.number ? 'bg-primary' : 'bg-muted'}`} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );

  if (showSuccess && currentStep === 4) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-success" />
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-2">Booking Confirmed!</h3>
          <p className="text-muted-foreground mb-6">
            Your conservation experience has been booked successfully. You'll receive a confirmation email shortly.
          </p>
          <div className="bg-muted p-4 rounded-lg mb-6">
            <div className="font-semibold">{experience.title}</div>
            <div className="text-sm text-muted-foreground">{formData.date} • {formData.people} people</div>
            <div className="text-lg font-bold text-primary mt-2">{formatPrice(subtotal)}</div>
          </div>
          <Button onClick={() => navigate('/traveler-dashboard')} className="w-full">
            View My Bookings
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="responsive-booking-form max-w-4xl mx-auto">
      <StepIndicator />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Section */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {steps[currentStep - 1]?.title} Information
                <Badge variant="outline" className="ml-auto">
                  Step {currentStep} of 3
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Step 1: Date & People */}
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="date" className="text-sm font-medium">
                          Experience Date *
                        </Label>
                        <Input
                          id="date"
                          type="date"
                          value={formData.date}
                          onChange={(e) => handleInputChange('date', e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                          className="mt-1"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="people" className="text-sm font-medium">
                          Number of People *
                        </Label>
                        <div className="flex items-center gap-2 mt-1">
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => handleInputChange('people', Math.max(1, formData.people - 1))}
                            disabled={formData.people <= 1}
                          >
                            -
                          </Button>
                          <Input
                            id="people"
                            type="number"
                            min="1"
                            max={experience.capacity || undefined}
                            value={formData.people}
                            onChange={(e) => handleInputChange('people', parseInt(e.target.value) || 1)}
                            className="text-center"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => handleInputChange('people', experience.capacity ? Math.min(experience.capacity, formData.people + 1) : formData.people + 1)}
                            disabled={experience.capacity && formData.people >= experience.capacity}
                          >
                            +
                          </Button>
                        </div>
                        {experience.capacity ? (
                          <p className="text-xs text-muted-foreground mt-1">
                            Maximum {experience.capacity} people
                          </p>
                        ) : (
                          <p className="text-xs text-muted-foreground mt-1">
                            No group size limit - all welcome!
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Contact Info */}
                {currentStep === 2 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name" className="text-sm font-medium">
                          Full Name *
                        </Label>
                        <Input
                          id="name"
                          type="text"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className="mt-1"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone" className="text-sm font-medium">
                          Phone Number *
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className="mt-1"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-sm font-medium">
                        Email Address *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="mt-1"
                        required
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-4">
                      <h4 className="font-medium">Additional Information (Optional)</h4>
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <Label htmlFor="mobility">Mobility Assistance</Label>
                          <Select value={formData.mobility} onValueChange={(value) => handleInputChange('mobility', value)}>
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select if needed" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">None needed</SelectItem>
                              <SelectItem value="wheelchair">Wheelchair access</SelectItem>
                              <SelectItem value="limited">Limited mobility</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="requests">Special Requests</Label>
                        <Textarea
                          id="requests"
                          value={formData.requests}
                          onChange={(e) => handleInputChange('requests', e.target.value)}
                          placeholder="Any special requests or requirements..."
                          className="mt-1 min-h-[80px]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Review & Confirm */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h4 className="font-medium mb-3">Booking Summary</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Experience:</span>
                          <span className="font-medium">{experience.title}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Date:</span>
                          <span>{formData.date}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>People:</span>
                          <span>{formData.people}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Contact:</span>
                          <span>{formData.name} ({formData.email})</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-start space-x-2">
                        <Checkbox
                          id="terms"
                          checked={formData.terms}
                          onCheckedChange={(checked) => handleInputChange('terms', checked)}
                          required
                        />
                        <Label htmlFor="terms" className="text-sm leading-5">
                          I agree to the{' '}
                          <button type="button" className="text-primary hover:underline">
                            Terms and Conditions
                          </button>{' '}
                          and{' '}
                          <button type="button" className="text-primary hover:underline">
                            Privacy Policy
                          </button>
                          *
                        </Label>
                      </div>
                      
                      <div className="flex items-start space-x-2">
                        <Checkbox
                          id="marketing"
                          checked={formData.marketing}
                          onCheckedChange={(checked) => handleInputChange('marketing', checked)}
                        />
                        <Label htmlFor="marketing" className="text-sm leading-5">
                          I'd like to receive updates about conservation impact and similar experiences
                        </Label>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-6">
                  {currentStep > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      className="sm:w-auto"
                    >
                      Previous
                    </Button>
                  )}
                  
                  {currentStep < 3 ? (
                    <Button
                      type="button"
                      onClick={nextStep}
                      disabled={!validateStep(currentStep)}
                      className="sm:ml-auto sm:w-auto"
                    >
                      Continue
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={!validateStep(currentStep) || isSubmitting}
                      className="sm:ml-auto sm:w-auto bg-conservation hover:bg-conservation/90"
                    >
                      {isSubmitting ? 'Processing...' : 'Confirm Booking'}
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Booking Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-4 space-y-4">
            {/* Experience Summary */}
            <Card>
              <CardContent className="p-4">
                <div className="aspect-[4/3] bg-muted rounded-lg overflow-hidden mb-4">
                  <img
                    src={experience.heroImage || experience.images?.[0] || experience.gallery?.[0] || "/images/placeholder-1.jpg"}
                    alt={experience.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-semibold text-lg mb-2">{experience.title}</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {experience.location_text}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {experience.duration_hours} hours
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Up to {experience.capacity} people
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Price Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Price Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>{formatPrice(experience.base_price)} × {formData.people} people</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                
                <Separator />
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Goes to {project.name}</span>
                    <span>{formatPrice(partnerAmount)} ({experience.allocation_pct_project}%)</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Platform & Operations</span>
                    <span>{formatPrice(platformAmount)} ({experience.allocation_pct_platform}%)</span>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-conservation">{formatPrice(subtotal)}</span>
                </div>
                
                <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2">
                  <Shield className="w-4 h-4" />
                  <span>Secure payment • Instant confirmation</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResponsiveBookingForm;
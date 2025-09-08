import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, MapPin, Users, Calendar, Mail, Phone, User } from "lucide-react";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useI18n } from "@/contexts/I18nContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { saveReceipt } from "@/lib/receipt";
import { makeImpactSummary } from "@/lib/impactSummary";

interface BookingWizardProps {
  isOpen: boolean;
  onClose: () => void;
  experience: any;
}

const BookingWizard: React.FC<BookingWizardProps> = ({ isOpen, onClose, experience }) => {
  const { formatPrice } = useCurrency();
  const { t } = useI18n();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    date: '',
    adults: 1,
    children: 0,
    option: 'standard' as 'standard' | 'premium',
    name: '',
    email: '',
    phone: '',
    mobility: '',
    specialRequests: '',
    agreeTerms: false,
    marketingOptIn: false
  });

  const adultPrice = experience.priceKESAdult;
  const childPrice = experience.childHalfPriceRule ? Math.round(adultPrice / 2) : adultPrice;
  const optionMultiplier = formData.option === 'premium' ? 1.3 : 1;
  const unitPrice = Math.round(adultPrice * optionMultiplier);
  const childUnitPrice = Math.round(childPrice * optionMultiplier);
  
  const subtotal = (formData.adults * unitPrice) + (formData.children * childUnitPrice);
  const partnerAmount = Math.round(subtotal * 0.9);
  const platformAmount = subtotal - partnerAmount;
  const totalPeople = formData.adults + formData.children;

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateStep1 = () => {
    return formData.date && totalPeople > 0 && totalPeople <= 15;
  };

  const validateStep2 = () => {
    return formData.name && formData.email && formData.phone;
  };

  const validateStep3 = () => {
    return formData.agreeTerms;
  };

  const handleNextStep = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleConfirmBooking = () => {
    if (validateStep3()) {
      // Save receipt data
      const receipt = {
        slug: experience.slug,
        date: formData.date,
        people: totalPeople,
        optionId: formData.option,
        unitPrice,
        subtotal,
        donation: 0, // Will be updated when donation feature is added
        partner: partnerAmount,
        platform: platformAmount,
        currency: 'KES'
      };
      saveReceipt(receipt);

      // Show success step
      setCurrentStep(4);

      // Navigate to confirmation after a delay
      setTimeout(() => {
        onClose();
        navigate('/confirmation');
      }, 3000);

      toast({
        title: t('bookingConfirmed', 'Booking Confirmed!'),
        description: t('bookingConfirmedDesc', 'You will receive a confirmation email shortly.'),
      });
    }
  };

  const steps = [
    { number: 1, title: t('details', 'Details'), completed: currentStep > 1 },
    { number: 2, title: t('contact', 'Contact'), completed: currentStep > 2 },
    { number: 3, title: t('confirm', 'Confirm'), completed: currentStep > 3 },
    { number: 4, title: t('success', 'Success'), completed: currentStep === 4 }
  ];

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

            {/* Step 1: Details */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">{t('selectDateParticipants', 'Select date and participants')}</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="date">{t('date', 'Date')}</Label>
                    <Input 
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => updateFormData('date', e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>{t('adults', 'Adults')}</Label>
                      <div className="flex items-center border rounded-md mt-1">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => updateFormData('adults', Math.max(1, formData.adults - 1))}
                        >
                          -
                        </Button>
                        <span className="px-3 py-1 min-w-[40px] text-center">{formData.adults}</span>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => updateFormData('adults', formData.adults + 1)}
                        >
                          +
                        </Button>
                      </div>
                    </div>

                    {experience.childHalfPriceRule && (
                      <div>
                        <Label>{t('children', 'Children')}</Label>
                        <div className="flex items-center border rounded-md mt-1">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => updateFormData('children', Math.max(0, formData.children - 1))}
                          >
                            -
                          </Button>
                          <span className="px-3 py-1 min-w-[40px] text-center">{formData.children}</span>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => updateFormData('children', formData.children + 1)}
                          >
                            +
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label>{t('experienceOption', 'Experience Option')}</Label>
                    <div className="grid gap-3 mt-2">
                      <Card 
                        className={`cursor-pointer ${formData.option === 'standard' ? 'ring-2 ring-primary' : ''}`}
                        onClick={() => updateFormData('option', 'standard')}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">{t('standard', 'Standard')}</h4>
                              <p className="text-sm text-muted-foreground">{t('standardDesc', 'Full experience')}</p>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold">{formatPrice(adultPrice)}</div>
                              <div className="text-xs text-muted-foreground">{t('perPerson', 'per person')}</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card 
                        className={`cursor-pointer ${formData.option === 'premium' ? 'ring-2 ring-primary' : ''}`}
                        onClick={() => updateFormData('option', 'premium')}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">{t('premium', 'Premium')}</h4>
                              <p className="text-sm text-muted-foreground">{t('premiumDesc', 'Enhanced experience')}</p>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold">{formatPrice(Math.round(adultPrice * 1.3))}</div>
                              <div className="text-xs text-muted-foreground">{t('perPerson', 'per person')}</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleNextStep} disabled={!validateStep1()}>
                    {t('continue', 'Continue')}
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Contact */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">{t('contactInformation', 'Contact Information')}</h3>
                
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

                <div className="flex justify-between">
                  <Button variant="outline" onClick={handlePrevStep}>
                    {t('back', 'Back')}
                  </Button>
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
                
                <Card>
                  <CardContent className="p-4 space-y-4">
                    <h4 className="font-medium">{t('bookingSummary', 'Booking Summary')}</h4>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{formData.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{formData.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{formData.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{totalPeople} {t('people', 'people')}</span>
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
                  <Button variant="outline" onClick={handlePrevStep}>
                    {t('back', 'Back')}
                  </Button>
                  <Button onClick={handleConfirmBooking} disabled={!validateStep3()}>
                    {t('confirmBooking', 'Confirm Booking')}
                  </Button>
                </div>
              </div>
            )}

            {/* Step 4: Success */}
            {currentStep === 4 && (
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-green-600 mb-2">
                    {t('bookingConfirmed', 'Booking Confirmed!')}
                  </h3>
                  <p className="text-muted-foreground">
                    {t('bookingSuccessMessage', 'Thank you for booking with us. You will receive a confirmation email shortly.')}
                  </p>
                </div>

                <Card>
                  <CardContent className="p-4 text-left">
                    <h4 className="font-medium mb-3">{t('impactSummary', 'Impact Summary')}</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        {t('yourContribution', 'Your contribution')}: <strong>{formatPrice(subtotal)}</strong>
                      </div>
                      <div className="text-muted-foreground">
                        • {formatPrice(partnerAmount)} {t('toPartnerInitiatives', 'to partner initiatives (90%)')}
                      </div>
                      <div className="text-muted-foreground">
                        • {formatPrice(platformAmount)} {t('toPlatformOperations', 'to platform operations (10%)')}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <p className="text-sm text-muted-foreground">
                  {t('redirectingMessage', 'Redirecting you to the confirmation page...')}
                </p>
              </div>
            )}
          </div>

          {/* Right side - Experience Card & Price Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-0">
              <CardContent className="p-4 space-y-4">
                {/* Experience Card */}
                <div className="flex gap-3">
                  <img 
                    src={experience.heroImage} 
                    alt={experience.title}
                    className="w-16 h-12 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-sm leading-tight">{experience.title}</h4>
                    <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <MapPin className="h-3 w-3" />
                      {experience.locationText}
                    </div>
                    <Badge variant="secondary" className="text-xs mt-1">
                      {experience.themes[0]}
                    </Badge>
                  </div>
                </div>

                <Separator />

                {/* Price Summary */}
                <div className="space-y-3">
                  <h4 className="font-medium">{t('priceSummary', 'Price Summary')}</h4>
                  
                  <div className="space-y-2 text-sm">
                    {formData.date && (
                      <div className="flex justify-between">
                        <span>{t('date', 'Date')}</span>
                        <span>{formData.date}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between">
                      <span>{t('participants', 'Participants')}</span>
                      <span>{totalPeople} {t('people', 'people')}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>{t('option', 'Option')}</span>
                      <span className="capitalize">{formData.option}</span>
                    </div>

                    <Separator />

                    {formData.adults > 0 && (
                      <div className="flex justify-between">
                        <span>{formData.adults} × {t('adults', 'Adults')}</span>
                        <span>{formatPrice(formData.adults * unitPrice)}</span>
                      </div>
                    )}
                    
                    {formData.children > 0 && experience.childHalfPriceRule && (
                      <div className="flex justify-between">
                        <span>{formData.children} × {t('children', 'Children')}</span>
                        <span>{formatPrice(formData.children * childUnitPrice)}</span>
                      </div>
                    )}

                    <Separator />

                    <div className="space-y-1 text-xs text-muted-foreground">
                      <div className="flex justify-between">
                        <span>{t('partnerInitiatives', 'Partner initiatives (90%)')}</span>
                        <span>{formatPrice(partnerAmount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t('platformOperations', 'Platform operations (10%)')}</span>
                        <span>{formatPrice(platformAmount)}</span>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex justify-between font-bold">
                      <span>{t('total', 'Total')}</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
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

export default BookingWizard;
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { CalendarIcon, Users, ArrowLeft, ArrowRight, CheckCircle, MapPin, Clock, Mail, Phone, User } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useCart } from "@/contexts/CartContext";
import { useI18n } from "@/contexts/I18nContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import OrderSummary from "./OrderSummary";
import { isValidBookingDate } from "@/utils/time";
import { saveReceipt } from "@/lib/receipt";
import { supabase } from "@/integrations/supabase/client";

interface WinalistBookingStepperProps {
  isOpen: boolean;
  onClose: () => void;
  experience: any;
}

const WinalistBookingStepper: React.FC<WinalistBookingStepperProps> = ({ isOpen, onClose, experience }) => {
  const { formatPrice } = useCurrency();
  const { cart, updateCart } = useCart();
  const { t } = useI18n();
  const { toast } = useToast();
  const { user, profile } = useAuth();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Booking selection state
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [selectedTime, setSelectedTime] = useState<string>('');
  
  // Contact form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    specialRequests: '',
    donation: 0,
    agreeTerms: false,
    marketingOptIn: false
  });

  // Auto-fill user profile data on modal open
  useEffect(() => {
    if (isOpen && user && profile) {
      setFormData(prev => ({
        ...prev,
        name: user.email?.split('@')[0] || '',
        email: user.email || ''
      }));
    }
  }, [isOpen, user, profile]);

  const steps = [
    { number: 1, title: t("step_select", "Select"), description: t("step_select_desc", "Choose date & guests") },
    { number: 2, title: t("step_details", "Details"), description: t("step_details_desc", "Your information") },
    { number: 3, title: t("step_pay", "Pay"), description: t("step_pay_desc", "Review & payment") }
  ];

  const totalGuests = adults + children;
  const basePrice = experience.base_price || 0;
  const subtotal = basePrice * totalGuests + formData.donation;
  const taxes = 0; // Keep existing tax logic
  const total = subtotal + taxes;

  // Validation functions
  const isStep1Valid = () => {
    return selectedDate && totalGuests > 0 && totalGuests <= (experience.capacity || 10);
  };

  const isStep2Valid = () => {
    return formData.name.trim() && formData.email.trim() && formData.phone.trim();
  };

  const isStep3Valid = () => {
    return formData.agreeTerms;
  };

  const canProceed = (step: number) => {
    switch (step) {
      case 1: return isStep1Valid();
      case 2: return isStep2Valid();
      case 3: return isStep3Valid();
      default: return false;
    }
  };

  const handleNextStep = () => {
    if (canProceed(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Handle booking confirmation and payment
  const handleConfirmBooking = async () => {
    if (!canProceed(3) || !user || !selectedDate) return;

    setIsProcessing(true);
    try {
      // Create booking in database (keeping existing logic)
      const bookingData = {
        user_id: user.id,
        experience_id: experience.id,
        project_id: experience.project_id,
        experience_slug: experience.slug,
        booking_date: selectedDate.toISOString().split('T')[0],
        adults: adults,
        children: children,
        total_kes: total,
        customer_name: formData.name,
        customer_email: formData.email,
        customer_phone: formData.phone,
        special_requests: formData.specialRequests,
        donation_kes: formData.donation,
        status: 'pending'
      };

      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert(bookingData)
        .select()
        .single();

      if (bookingError) throw bookingError;

      // Save receipt
      saveReceipt({
        slug: experience.slug,
        date: selectedDate.toISOString().split('T')[0],
        people: totalGuests,
        optionId: 'standard',
        unitPrice: basePrice,
        subtotal: subtotal,
        donation: formData.donation,
        partner: Math.round(total * 0.9),
        platform: Math.round(total * 0.1),
        currency: 'KES'
      });

      // Initialize payment (keeping existing Pesapal integration)
      const { data: paymentData, error: paymentError } = await supabase.functions.invoke('pesapal-create-order', {
        body: {
          bookingId: booking.id,
          amount: total,
          currency: 'KES',
          description: `Booking for ${experience.title}`,
          customer: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone
          },
          callbackUrl: `${window.location.origin}/booking-confirmation?booking=${booking.id}`
        }
      });

      if (paymentError) throw paymentError;

      if (paymentData?.redirectUrl) {
        window.location.href = paymentData.redirectUrl;
      }

      toast({
        title: t("booking_confirmed", "Booking confirmed!"),
        description: t("redirecting_payment", "Redirecting to payment..."),
      });

    } catch (error) {
      console.error('Booking error:', error);
      toast({
        title: t("booking_error", "Booking failed"),
        description: t("booking_error_desc", "Please try again"),
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Generate time slots (keeping existing logic)
  const timeSlots = ['09:00', '11:00', '14:00', '16:00'];

  const orderSummaryData = {
    title: experience.title,
    date: selectedDate,
    time: selectedTime,
    guests: { adults, children },
    lines: [
      { label: t("experience", "Experience"), amount: basePrice * totalGuests, quantity: totalGuests },
      ...(formData.donation > 0 ? [{ label: t("donation", "Donation"), amount: formData.donation }] : [])
    ],
    taxes: [],
    total: total,
    cancellationNote: t("free_cancellation_note", "Cancel up to 24 hours before for a full refund"),
    disclaimer: t("price_disclaimer", "Prices include all fees. Payment processed securely.")
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto p-0">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 min-h-[600px]">
          {/* Left Column - Steps Content */}
          <div className="lg:col-span-2 p-6">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-2xl font-bold">
                {t("book_experience", "Book Experience")}
              </DialogTitle>
              
              {/* Progress Steps */}
              <div className="flex items-center justify-between mt-4 max-w-md">
                {steps.map((step, index) => (
                  <div key={step.number} className="flex items-center">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border-2",
                      currentStep === step.number
                        ? "bg-primary text-primary-foreground border-primary"
                        : currentStep > step.number
                        ? "bg-green-500 text-white border-green-500"
                        : "bg-background text-muted-foreground border-muted-foreground"
                    )}>
                      {currentStep > step.number ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        step.number
                      )}
                    </div>
                    {index < steps.length - 1 && (
                      <div className={cn(
                        "w-8 h-0.5 mx-2",
                        currentStep > step.number ? "bg-green-500" : "bg-muted"
                      )} />
                    )}
                  </div>
                ))}
              </div>
              
              <div className="mt-2">
                <h3 className="font-semibold">{steps[currentStep - 1].title}</h3>
                <p className="text-sm text-muted-foreground">{steps[currentStep - 1].description}</p>
              </div>
            </DialogHeader>

            {/* Step Content */}
            <div className="space-y-6">
              {/* Step 1: Select Date & Guests */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  {/* Choose Date */}
                  <div>
                    <h4 className="font-semibold mb-3">{t("choose_date", "Choose date")}</h4>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full max-w-sm justify-start text-left font-normal h-12",
                            !selectedDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedDate ? 
                            format(selectedDate, "PPP") :
                            t("select_date", "Select a date")
                          }
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={selectedDate || undefined}
                          onSelect={(date) => setSelectedDate(date || null)}
                          disabled={(date) => date < new Date() || !isValidBookingDate(date.toISOString().split('T')[0])}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Guests */}
                  <div>
                    <h4 className="font-semibold mb-3">{t("guests", "Guests")}</h4>
                    <div className="grid grid-cols-2 gap-4 max-w-sm">
                      <div>
                        <Label htmlFor="adults">{t("adults", "Adults")}</Label>
                        <Select value={adults.toString()} onValueChange={(value) => setAdults(parseInt(value))}>
                          <SelectTrigger className="h-12">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                              <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="children">{t("children", "Children")}</Label>
                        <Select value={children.toString()} onValueChange={(value) => setChildren(parseInt(value))}>
                          <SelectTrigger className="h-12">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[0, 1, 2, 3, 4, 5, 6].map((num) => (
                              <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    {totalGuests > (experience.capacity || 10) && (
                      <p className="text-sm text-destructive mt-2">
                        {t("max_guests_error", `Maximum ${experience.capacity || 10} guests allowed`)}
                      </p>
                    )}
                  </div>

                  {/* Time Slots */}
                  {selectedDate && (
                    <div>
                      <h4 className="font-semibold mb-3">{t("time_slot", "Time slot")}</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-w-md">
                        {timeSlots.map((time) => (
                          <Button
                            key={time}
                            variant={selectedTime === time ? "default" : "outline"}
                            onClick={() => setSelectedTime(time)}
                            className="h-12"
                          >
                            {time}
                          </Button>
                        ))
                      }
                      </div>
                    </div>
                  )}

                  {/* Unavailable Warning */}
                  {selectedDate && totalGuests > 0 && (
                    <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                      <p className="text-sm text-yellow-800 dark:text-yellow-200">
                        {t("availability_note", "Availability will be confirmed after booking. If unavailable, you'll receive a full refund.")}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Step 2: Contact Details */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">{t("full_name", "Full name")} *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => updateFormData('name', e.target.value)}
                        placeholder={t("enter_full_name", "Enter your full name")}
                        className="h-12"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="email">{t("email", "Email")} *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => updateFormData('email', e.target.value)}
                        placeholder={t("enter_email", "Enter your email")}
                        className="h-12"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone">{t("phone", "Phone number")} *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => updateFormData('phone', e.target.value)}
                      placeholder={t("enter_phone", "Enter your phone number")}
                      className="h-12"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {t("phone_format", "Include country code (e.g., +254 for Kenya)")}
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="requests">{t("special_requests", "Special requests")} ({t("optional", "Optional")})</Label>
                    <Textarea
                      id="requests"
                      value={formData.specialRequests}
                      onChange={(e) => updateFormData('specialRequests', e.target.value)}
                      placeholder={t("special_requests_placeholder", "Any dietary requirements, mobility needs, or special requests...")}
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="donation">{t("optional_donation", "Optional donation")} ({t("optional", "Optional")})</Label>
                    <Input
                      id="donation"
                      type="number"
                      min="0"
                      step="100"
                      value={formData.donation}
                      onChange={(e) => updateFormData('donation', parseInt(e.target.value) || 0)}
                      placeholder="0"
                      className="h-12"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {t("donation_note", "100% of donations go directly to conservation efforts")}
                    </p>
                  </div>
                </div>
              )}

              {/* Step 3: Review & Pay */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  {/* Booking Review */}
                  <div>
                    <h4 className="font-semibold mb-4">{t("booking_summary", "Booking summary")}</h4>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          {experience.images?.[0] && (
                            <img 
                              src={experience.images[0]} 
                              alt={experience.title}
                              className="w-20 h-20 object-cover rounded-lg"
                            />
                          )}
                          <div className="flex-1">
                            <h5 className="font-semibold mb-2">{experience.title}</h5>
                            <div className="text-sm text-muted-foreground space-y-1">
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                {experience.location_text}
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                {selectedDate ? format(selectedDate, "PPP") : ''}
                                {selectedTime && ` • ${selectedTime}`}
                              </div>
                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                {adults} {adults === 1 ? t("adult", "Adult") : t("adults", "Adults")}
                                {children > 0 && `, ${children} ${children === 1 ? t("child", "Child") : t("children", "Children")}`}
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Terms Agreement */}
                  <div className="space-y-4">
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="terms"
                        checked={formData.agreeTerms}
                        onCheckedChange={(checked) => updateFormData('agreeTerms', checked)}
                      />
                      <div className="text-sm">
                        <Label htmlFor="terms" className="cursor-pointer">
                          {t("agree_terms", "I agree to the")} <a href="/terms" className="text-primary hover:underline">{t("terms_conditions", "Terms & Conditions")}</a> {t("and", "and")} <a href="/privacy" className="text-primary hover:underline">{t("privacy_policy", "Privacy Policy")}</a>
                        </Label>
                      </div>
                    </div>

                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="marketing"
                        checked={formData.marketingOptIn}
                        onCheckedChange={(checked) => updateFormData('marketingOptIn', checked)}
                      />
                      <Label htmlFor="marketing" className="text-sm cursor-pointer">
                        {t("marketing_consent", "I'd like to receive updates about conservation experiences and impact stories")}
                      </Label>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t">
              <Button
                variant="outline"
                onClick={handlePrevStep}
                disabled={currentStep === 1}
                className="h-12"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t("back", "Back")}
              </Button>

              {currentStep < 3 ? (
                <Button
                  onClick={handleNextStep}
                  disabled={!canProceed(currentStep)}
                  className="h-12"
                >
                  {t("continue", "Continue")}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleConfirmBooking}
                  disabled={!canProceed(3) || isProcessing}
                  className="h-12"
                >
                  {isProcessing ? 
                    t("processing", "Processing...") : 
                    t("confirm_pay", "Confirm & Pay")
                  }
                </Button>
              )}
            </div>
          </div>

          {/* Right Column - Order Summary (Desktop) */}
          <div className="hidden lg:block bg-muted/30 p-6">
            <OrderSummary {...orderSummaryData} sticky={false} />
          </div>

          {/* Mobile Order Summary Drawer */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t p-4 z-50">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-semibold">{formatPrice(total)}</div>
                <div className="text-sm text-muted-foreground">
                  {totalGuests} {totalGuests === 1 ? t("guest", "Guest") : t("guests", "Guests")}
                </div>
              </div>
              {currentStep < 3 ? (
                <Button
                  onClick={handleNextStep}
                  disabled={!canProceed(currentStep)}
                  size="lg"
                >
                  {t("continue", "Continue")}
                </Button>
              ) : (
                <Button
                  onClick={handleConfirmBooking}
                  disabled={!canProceed(3) || isProcessing}
                  size="lg"
                >
                  {isProcessing ? 
                    t("processing", "Processing...") : 
                    t("confirm_pay", "Confirm & Pay")
                  }
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WinalistBookingStepper;

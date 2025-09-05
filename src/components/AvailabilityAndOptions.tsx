import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, Clock, MapPin, Star, CheckCircle, Minus, Plus } from "lucide-react";
import { useCurrency } from "@/contexts/CurrencyContext";
import { saveCart } from "@/lib/cart";
import { isSameDayBookingCutoffPassed, isTodayInLocal } from "@/utils/time";

interface Experience {
  slug?: string;
  base_price?: number;
  priceKESAdult: number;
  childHalfPriceRule?: boolean;
  capacity: number;
  duration_hours?: number;
  partner?: string;
}

interface BookingParams {
  date: string;
  adults: number;
  children: number;
  option: 'standard' | 'premium';
}

interface AvailabilityAndOptionsProps {
  experience: Experience;
  onBookingStart?: () => void;
  onBookingModalOpen?: () => void;
  onUpdateParams?: (params: Partial<BookingParams>) => void;
  initialParams?: Partial<BookingParams>;
}

const AvailabilityAndOptions = ({
  experience,
  onBookingStart,
  onBookingModalOpen,
  onUpdateParams,
  initialParams
}: AvailabilityAndOptionsProps) => {
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
  
  // Initialize state from props or defaults
  const [selectedDate, setSelectedDate] = useState(initialParams?.date || "");
  const [selectedAdults, setSelectedAdults] = useState(initialParams?.adults || 1);
  const [selectedChildren, setSelectedChildren] = useState(initialParams?.children || 0);
  const [selectedOption, setSelectedOption] = useState<"standard" | "premium">(initialParams?.option || "standard");
  const [participantsError, setParticipantsError] = useState("");

  const basePrice = experience.base_price || experience.priceKESAdult || 350;
  const childPrice = experience.childHalfPriceRule ? Math.round(basePrice * 0.5) : basePrice;

  // Update parent component when selections change
  useEffect(() => {
    if (onUpdateParams) {
      onUpdateParams({
        date: selectedDate,
        adults: selectedAdults,
        children: selectedChildren,
        option: selectedOption
      });
    }
  }, [selectedDate, selectedAdults, selectedChildren, selectedOption, onUpdateParams]);

  // --- helpers ---
  const totalParticipants = selectedAdults + selectedChildren;
  
  const validateParticipants = (adults: number, children: number) => {
    const total = adults + children;
    if (total > experience.capacity) {
      setParticipantsError(`Maximum group size is ${experience.capacity}. Please reduce the number of people.`);
      return false;
    }
    if (adults < 1) {
      setParticipantsError("At least 1 adult is required.");
      return false;
    }
    setParticipantsError("");
    return true;
  };

  const handleAdultsChange = (value: number) => {
    const validValue = Math.max(1, value || 1);
    setSelectedAdults(validValue);
    validateParticipants(validValue, selectedChildren);
  };

  const handleChildrenChange = (value: number) => {
    const validValue = Math.max(0, value || 0);
    setSelectedChildren(validValue);
    validateParticipants(selectedAdults, validValue);
  };

  const roundMoney = (n: number) => Math.round(n * 100) / 100;
  
  const computeTotals = (optionId: string, adults: number, children: number) => {
    const options = getOptions();
    const option = options.find(opt => opt.id === optionId) || options[0];
    
    const adultTotal = option.adultPrice * adults;
    const childTotal = option.childPrice * children;
    const subtotal = roundMoney(adultTotal + childTotal);
    const partner = roundMoney(subtotal * 0.9);
    const platform = roundMoney(subtotal - partner);
    
    return {
      subtotal,
      partner,
      platform,
      adultSubtotal: adultTotal,
      childSubtotal: childTotal
    };
  };

  const getOptions = () => {
    const experienceBasePrice = experience.priceKESAdult || experience.base_price || 350;
    const standardAdultPrice = experienceBasePrice;
    const standardChildPrice = experience.childHalfPriceRule ? Math.round(experienceBasePrice * 0.5) : experienceBasePrice;
    const premiumAdultPrice = Math.round(experienceBasePrice * 1.3); // 30% premium
    const premiumChildPrice = experience.childHalfPriceRule ? Math.round(premiumAdultPrice * 0.5) : premiumAdultPrice;

    return [
      {
        id: "standard",
        name: "Standard Experience",
        description: "Join our regular conservation experience with expert guides.",
        duration: experience.duration_hours || 3,
        language: "English, Swahili",
        pickup: "Hotel pickup available",
        startTimes: ["9:00 AM", "2:00 PM"],
        adultPrice: standardAdultPrice,
        childPrice: standardChildPrice,
        cancellation: "Free cancellation up to 24 hours",
        payLater: "Reserve now, pay later"
      },
      {
        id: "premium",
        name: "Premium Experience",
        description: "Enhanced experience with extended time and exclusive access.",
        duration: (experience.duration_hours || 3) + 1,
        language: "English, Swahili",
        pickup: "Private pickup included",
        startTimes: ["9:00 AM", "1:00 PM"],
        adultPrice: premiumAdultPrice,
        childPrice: premiumChildPrice,
        cancellation: "Free cancellation up to 24 hours",
        payLater: "Reserve now, pay later"
      }
    ] as const;
  };

  // persist + navigate
  const handleContinue = () => {
    if (participantsError || !selectedDate) return;

    // Trigger booking start callback
    if (onBookingStart) {
      onBookingStart();
    }

    // Hide sticky CTA on all breakpoints
    document.querySelectorAll<HTMLElement>(".na-cta-bar, .na-btn-book-fab").forEach(el => el.style.display = "none");

    // Save cart to sessionStorage for checkout hydration
    saveCart({
      slug: experience.slug || '',
      date: selectedDate,
      people: totalParticipants,
      optionId: selectedOption
    });

    // If we have a booking modal callback, use that instead of navigation
    if (onBookingModalOpen) {
      onBookingModalOpen();
      return;
    }

    const params = new URLSearchParams({
      date: selectedDate,
      adults: String(selectedAdults),
      children: String(selectedChildren),
      option: selectedOption
    });
    navigate(`/checkout/${experience.slug}?${params.toString()}`);
  };

  useEffect(() => {
    validateParticipants(selectedAdults, selectedChildren);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [experience.capacity]);

  const options = getOptions();
  const selectedOptionData = options.find(opt => opt.id === selectedOption) || options[0];
  const totals = computeTotals(selectedOption, selectedAdults, selectedChildren);

  // Same-day booking cutoff logic
  const cutoffHit = selectedDate && isTodayInLocal(selectedDate) && isSameDayBookingCutoffPassed();
  const cutoffMessage = "Same-day bookings close at 11:00 EAT. Please select a different date.";
  const proceedDisabled = !selectedDate || !!participantsError || cutoffHit;

  return (
    <section id="availability" className="availability-section scroll-mt-24">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Availability and options</h2>
          <p className="text-muted-foreground">Select your preferred date and experience option</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Selection Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Date and People Selection */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="date" className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Select date
                    </Label>
                    <Input 
                      id="date" 
                      type="date" 
                      value={selectedDate} 
                      onChange={e => setSelectedDate(e.target.value)} 
                      min={new Date().toISOString().split("T")[0]} 
                      className={`w-full ${cutoffHit ? "border-red-500" : ""}`} 
                    />
                    {cutoffHit && (
                      <div className="text-red-600 text-sm mt-1" role="alert">
                        {cutoffMessage}
                      </div>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="adults" className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Adults
                      </Label>
                      <div className="flex items-center border rounded-md">
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleAdultsChange(selectedAdults - 1)} 
                          disabled={selectedAdults <= 1}
                          className="h-10 w-10 rounded-r-none"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Input 
                          id="adults"
                          type="number" 
                          min={1} 
                          max={experience.capacity} 
                          value={selectedAdults} 
                          onChange={e => handleAdultsChange(parseInt(e.target.value) || 1)} 
                          className="border-0 text-center rounded-none focus-visible:ring-0" 
                          inputMode="numeric" 
                        />
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleAdultsChange(selectedAdults + 1)} 
                          disabled={totalParticipants >= experience.capacity}
                          className="h-10 w-10 rounded-l-none"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Show children selector only for specific partners that have child pricing */}
                    {experience.childHalfPriceRule && (
                    <div className="space-y-2">
                      <Label htmlFor="children" className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Children {experience.childHalfPriceRule && <span className="text-xs text-muted-foreground">(50% off)</span>}
                      </Label>
                      <div className="flex items-center border rounded-md">
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleChildrenChange(selectedChildren - 1)} 
                          disabled={selectedChildren <= 0}
                          className="h-10 w-10 rounded-r-none"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Input 
                          id="children"
                          type="number" 
                          min={0} 
                          max={experience.capacity} 
                          value={selectedChildren} 
                          onChange={e => handleChildrenChange(parseInt(e.target.value) || 0)} 
                          className="border-0 text-center rounded-none focus-visible:ring-0" 
                          inputMode="numeric" 
                        />
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleChildrenChange(selectedChildren + 1)} 
                          disabled={totalParticipants >= experience.capacity}
                          className="h-10 w-10 rounded-l-none"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    )}

                  </div>

                  <div className="text-sm text-muted-foreground">
                    Total: {totalParticipants} participant{totalParticipants !== 1 ? 's' : ''} (max {experience.capacity})
                  </div>
                  
                  {participantsError && (
                    <div id="participants-error" role="alert" aria-live="assertive" className="text-red-600 text-sm">
                      {participantsError}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Options */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Available options</h3>
              {options.map(option => (
                <Card 
                  key={option.id} 
                  className={`cursor-pointer transition-colors ${selectedOption === option.id ? "ring-2 ring-primary" : ""}`} 
                  onClick={() => setSelectedOption(option.id as "standard" | "premium")}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <input 
                            type="radio" 
                            name="option" 
                            value={option.id} 
                            checked={selectedOption === option.id} 
                            onChange={() => setSelectedOption(option.id as "standard" | "premium")}
                            className="w-4 h-4" 
                            aria-label={option.name} 
                          />
                          <h4 className="font-semibold text-lg">{option.name}</h4>
                          {option.id === "premium" && <Badge variant="secondary">Most Popular</Badge>}
                        </div>

                        <p className="text-muted-foreground mb-3">{option.description}</p>

                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{option.duration} hours</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span role="img" aria-label="Languages">🗣️</span>
                            <span>{option.language}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span>{option.pickup}</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-3">
                          {option.startTimes.map(time => (
                            <Badge key={time} variant="outline" className="text-xs">
                              {time}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex gap-4 text-sm">
                          <div className="flex items-center gap-1 text-green-600">
                            <CheckCircle className="h-4 w-4" />
                            <span>{option.cancellation}</span>
                          </div>
                          <div className="flex items-center gap-1 text-blue-600">
                            <CheckCircle className="h-4 w-4" />
                            <span>{option.payLater}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right ml-4">
                        <div className="space-y-1">
                          {selectedAdults > 0 && (
                            <div className="text-sm">
                              <span className="text-muted-foreground">Adults:</span> {formatPrice(option.adultPrice)} × {selectedAdults}
                            </div>
                          )}
                          {selectedChildren > 0 && (
                            <div className="text-sm">
                              <span className="text-muted-foreground">Children:</span> {formatPrice(option.childPrice)} × {selectedChildren}
                            </div>
                          )}
                          <div className="text-2xl font-bold">
                            {formatPrice(option.adultPrice * selectedAdults + option.childPrice * selectedChildren)}
                          </div>
                          <div className="text-sm text-muted-foreground">total</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Order Summary (Desktop) */}
          <div className="hidden lg:block">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Date:</span>
                    <span>{selectedDate || "Select date"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Adults:</span>
                    <span>{selectedAdults}</span>
                  </div>
                  {selectedChildren > 0 && (
                    <div className="flex justify-between text-sm">
                      <span>Children:</span>
                      <span>{selectedChildren}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span>Option:</span>
                    <span>{selectedOptionData.name}</span>
                  </div>
                </div>

                {/* Pricing */}
                <div className="border-t pt-4 space-y-2">
                  {selectedAdults > 0 && (
                    <div className="flex justify-between text-sm">
                      <span>{formatPrice(selectedOptionData.adultPrice)} × {selectedAdults} adults</span>
                      <span>{formatPrice(totals.adultSubtotal)}</span>
                    </div>
                  )}
                  {selectedChildren > 0 && (
                    <div className="flex justify-between text-sm">
                      <span>{formatPrice(selectedOptionData.childPrice)} × {selectedChildren} children</span>
                      <span>{formatPrice(totals.childSubtotal)}</span>
                    </div>
                  )}

                  {/* 90/10 split once valid */}
                  {selectedDate && !participantsError && (
                    <div className="space-y-1 text-xs text-muted-foreground">
                      <div className="flex justify-between">
                        <span>Partner initiatives (90%)</span>
                        <span>{formatPrice(totals.partner)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Platform & operations (10%)</span>
                        <span>{formatPrice(totals.platform)}</span>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between font-semibold pt-2">
                    <span>Total:</span>
                    <span>{formatPrice(totals.subtotal)}</span>
                  </div>
                </div>

                <Button 
                  id="btn-continue" 
                  data-action="proceed" 
                  onClick={handleContinue} 
                  disabled={proceedDisabled} 
                  aria-disabled={proceedDisabled} 
                  className="w-full" 
                  size="lg"
                >
                  Continue
                </Button>

                <div className="text-xs text-muted-foreground text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span>Free cancellation</span>
                  </div>
                  <div>You won't be charged yet</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AvailabilityAndOptions;
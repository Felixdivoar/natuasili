import { useBooking } from "@/contexts/BookingContext";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Users, Clock, MapPin, Star, CheckCircle, Minus, Plus } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { saveCart } from "@/lib/cart";
import { isSameDayBookingCutoffPassed, isTodayInLocal, isValidBookingDate, validateBookingDate } from "@/utils/time";
import NewAuthModal from "@/components/NewAuthModal";
import { useMultiCart } from "@/contexts/MultiCartContext";
interface Experience {
  id?: string;
  slug?: string;
  base_price?: number;
  priceKESAdult: number;
  childHalfPriceRule?: boolean;
  isGroupPricing?: boolean;
  minCapacity?: number;
  capacity: number;
  duration_hours?: number;
  partner?: string;
  title?: string;
  heroImage?: string;
}
interface BookingParams {
  date: string;
  adults: number;
  children: number;
  option: 'standard';
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
  const {
    formatPrice
  } = useCurrency();
  const {
    updateCart
  } = useCart();
  const {
    user
  } = useAuth();
  const {
    bookingState,
    setBookingState,
    updateBookingState
  } = useBooking();
  const {
    addItem: addCartItem,
    setOpen: openCart,
    items
  } = useMultiCart();

  // Initialize state from props, booking context, or defaults
  const initializeFromBooking = bookingState?.experienceSlug === experience.slug;
  const [selectedDate, setSelectedDate] = useState(initialParams?.date || (initializeFromBooking ? bookingState.date || "" : ""));
  const [selectedDateObj, setSelectedDateObj] = useState<Date | undefined>();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedAdults, setSelectedAdults] = useState(initialParams?.adults || (initializeFromBooking ? bookingState.adults : 1));
  const [selectedChildren, setSelectedChildren] = useState(initialParams?.children || (initializeFromBooking ? bookingState.children : 0));
  const [selectedOption, setSelectedOption] = useState<"standard">(initialParams?.option || "standard");
  const [participantsError, setParticipantsError] = useState("");
  const basePrice = experience.base_price || experience.priceKESAdult || 350;
  const isGroupPricing = (experience as any).isGroupPricing || false;
  const childPrice = experience.childHalfPriceRule ? Math.round(basePrice * 0.5) : basePrice;

  // Update cart whenever selections change (debounced to prevent loops)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      updateCart({
        date: selectedDate,
        adults: selectedAdults,
        children: selectedChildren,
        optionId: selectedOption
      });
    }, 100); // Debounce to prevent infinite loops

    return () => clearTimeout(timeoutId);
  }, [selectedDate, selectedAdults, selectedChildren, selectedOption, updateCart]);

  // Update parent component when selections change
  useEffect(() => {
    if (onUpdateParams) {
      onUpdateParams({
        date: isValidBookingDate(selectedDate) ? selectedDate : '',
        adults: selectedAdults,
        children: selectedChildren,
        option: selectedOption
      });
    }
  }, [selectedDate, selectedAdults, selectedChildren, selectedOption, onUpdateParams]);

  // Update booking context whenever selections change (debounced)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const totalPrice = isGroupPricing ? basePrice : selectedAdults * basePrice + selectedChildren * childPrice;
      if (selectedDate && experience.slug) {
        setBookingState({
          experienceSlug: experience.slug,
          date: selectedDate,
          adults: selectedAdults,
          children: selectedChildren,
          selectedOption: selectedOption,
          totalPrice: totalPrice
        });
      }
    }, 100); // Debounce to prevent infinite loops

    return () => clearTimeout(timeoutId);
  }, [selectedDate, selectedAdults, selectedChildren, selectedOption, basePrice, childPrice, experience.slug, setBookingState]);

  // --- helpers ---
  const totalParticipants = selectedAdults + selectedChildren;
  const validateParticipants = (adults: number, children: number) => {
    const total = adults + children;
    const minCap = (experience as any).minCapacity || 1;
    const maxCap = experience.capacity;
    
    // Only check max capacity if it exists
    if (maxCap && total > maxCap) {
      setParticipantsError(`Maximum group size is ${maxCap}. Please reduce the number of people.`);
      return false;
    }
    if ((experience as any).isGroupPricing) {
      if (total < minCap) {
        setParticipantsError(`Minimum ${minCap} participants required for this group experience.`);
        return false;
      }
    } else if (adults < 1) {
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
    const adultTotal = isGroupPricing ? option.adultPrice : option.adultPrice * adults;
    const childTotal = isGroupPricing ? 0 : option.childPrice * children;
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
    const standardChildPrice = isGroupPricing ? 0 : experience.childHalfPriceRule ? Math.round(experienceBasePrice * 0.5) : experienceBasePrice;
    
    // Check experience type for specific timings
    const isRhinoExperience = experience.title?.toLowerCase().includes('northern white rhinos');
    const isNightDriveExperience = experience.title?.toLowerCase().includes('night game drive');
    const isGuidedWalkExperience = experience.title?.toLowerCase().includes('guided bush and bird walks');
    const isChimpanzeeExperience = experience.title?.toLowerCase().includes('chimpanzee sanctuary');
    const isK9HandlerExperience = experience.title?.toLowerCase().includes('k-9 handler');
    const isLionTrackingExperience = experience.title?.toLowerCase().includes('track lions');
    
    let experienceStartTimes = ["9:00 AM", "2:00 PM"]; // default
    if (isRhinoExperience) {
      experienceStartTimes = ["8:30 AM", "3:00 PM"];
    } else if (isNightDriveExperience) {
      experienceStartTimes = ["7:00 PM"];
    } else if (isGuidedWalkExperience) {
      experienceStartTimes = ["6:30 AM"];
    } else if (isChimpanzeeExperience) {
      experienceStartTimes = ["11:45 AM"];
    } else if (isK9HandlerExperience) {
      experienceStartTimes = ["8:30 AM"];
    } else if (isLionTrackingExperience) {
      experienceStartTimes = ["6:30 AM"];
    }
    
    return [{
      id: "standard",
      name: "Standard Experience",
      description: "Join our regular conservation experience with expert guides.",
      duration: experience.duration_hours || 3,
      language: "English",
      pickup: "Available on request",
      startTimes: experienceStartTimes,
      adultPrice: standardAdultPrice,
      childPrice: standardChildPrice,
      cancellation: "Free cancellation up to 24 hours",
      payLater: "Reserve now, pay later"
    }] as const;
  };

  // Check if this experience is already in cart with same details
  const isInCart = items.some(cartItem => cartItem.experienceSlug === experience.slug && cartItem.date === selectedDate && cartItem.adults === selectedAdults && cartItem.children === selectedChildren && cartItem.optionId === selectedOption);

  // persist + navigate
  const handleContinue = () => {
    if (participantsError || !selectedDate || !dateValidation.isValid) return;

    // Check if experience is already in cart
    if (isInCart) {
      // Experience is in cart, redirect to checkout
      openCart(true);
      return;
    }

    // Trigger booking start callback (guest booking is allowed)
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

    // For direct navigation, allow both authenticated and guest users
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

  // Comprehensive date validation with experience-specific rules
  const dateValidation = selectedDate ? validateBookingDate(selectedDate, experience.slug) : {
    isValid: false
  };
  const isDateValid = !selectedDate || dateValidation.isValid;
  const dateError = selectedDate && !dateValidation.isValid ? dateValidation.error : null;

  // Updated proceed condition to use comprehensive validation and cart state
  const proceedDisabled = !selectedDate || !dateValidation.isValid || !!participantsError;
  return <section id="availability" className="availability-section scroll-mt-24">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Availability and options</h2>
          <p className="text-muted-foreground font-light text-base">Select your preferred date and experience option</p>
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
                      <CalendarIcon className="h-4 w-4" />
                      Select date
                    </Label>
                    <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !selectedDateObj && "text-muted-foreground",
                            dateError && "border-destructive"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedDateObj ? format(selectedDateObj, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={selectedDateObj}
                          onSelect={(date) => {
                            setSelectedDateObj(date);
                            if (date) {
                              const dateString = date.toISOString().split("T")[0];
                              setSelectedDate(dateString);
                            } else {
                              setSelectedDate("");
                            }
                            setIsCalendarOpen(false);
                          }}
                          disabled={(date) => {
                            // Disable past dates
                            if (date <= new Date()) return true;
                            
                            // Disable weekends for specific experiences that don't operate on weekends
                            const weekendRestrictedExperiences = [
                              "exp-ocean-day-watamu", // Ocean Wonders: Learn & conserve
                              "exp-reefolution-coral", // Dive into coral conservation with REEFolution
                              "exp-colobus-eco-tours" // Colobus monkey eco-tour in Diani, Kenya
                            ];
                            
                            if (weekendRestrictedExperiences.includes(experience.id || "")) {
                              const dayOfWeek = date.getDay();
                              return dayOfWeek === 0 || dayOfWeek === 6; // Sunday = 0, Saturday = 6
                            }
                            
                            return false;
                          }}
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                    {dateError && <div className="text-destructive text-sm mt-1" role="alert">
                        {dateError}
                      </div>}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="adults" className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Adults
                      </Label>
                      <div className="flex items-center border rounded-md">
                        <Button type="button" variant="ghost" size="icon" onClick={() => handleAdultsChange(selectedAdults - 1)} disabled={selectedAdults <= 1} className="h-10 w-10 rounded-r-none">
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Input id="adults" type="number" min={1} max={experience.capacity || undefined} value={selectedAdults} onChange={e => handleAdultsChange(parseInt(e.target.value) || 1)} className="border-0 text-center rounded-none focus-visible:ring-0" inputMode="numeric" />
                        <Button type="button" variant="ghost" size="icon" onClick={() => handleAdultsChange(selectedAdults + 1)} disabled={experience.capacity ? totalParticipants >= experience.capacity : false} className="h-10 w-10 rounded-l-none">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Show children selector only for specific partners that have child pricing */}
                    {experience.childHalfPriceRule && <div className="space-y-2">
                      <Label htmlFor="children" className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Children {experience.childHalfPriceRule && <span className="text-xs text-muted-foreground">(50% off)</span>}
                      </Label>
                      <div className="flex items-center border rounded-md">
                        <Button type="button" variant="ghost" size="icon" onClick={() => handleChildrenChange(selectedChildren - 1)} disabled={selectedChildren <= 0} className="h-10 w-10 rounded-r-none">
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Input id="children" type="number" min={0} max={experience.capacity || undefined} value={selectedChildren} onChange={e => handleChildrenChange(parseInt(e.target.value) || 0)} className="border-0 text-center rounded-none focus-visible:ring-0" inputMode="numeric" />
                        <Button type="button" variant="ghost" size="icon" onClick={() => handleChildrenChange(selectedChildren + 1)} disabled={experience.capacity ? totalParticipants >= experience.capacity : false} className="h-10 w-10 rounded-l-none">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>}

                  </div>

                  <div className="text-sm text-muted-foreground">
                    Total: {totalParticipants} participant{totalParticipants !== 1 ? 's' : ''}
                    {(experience.minCapacity || experience.capacity) && (
                      <span>
                        {experience.minCapacity && experience.capacity 
                          ? ` (min ${experience.minCapacity}, max ${experience.capacity})`
                          : experience.minCapacity 
                            ? ` (min ${experience.minCapacity})`
                            : ` (max ${experience.capacity})`
                        }
                      </span>
                    )}
                  </div>
                  
                  {participantsError && <div id="participants-error" role="alert" aria-live="assertive" className="text-destructive text-sm">
                      {participantsError}
                    </div>}
                </div>
              </CardContent>
            </Card>

            {/* Options */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Available options</h3>
              {options.map(option => <Card key={option.id} className={`cursor-pointer transition-colors ${selectedOption === option.id ? "ring-2 ring-primary" : ""}`} onClick={() => setSelectedOption(option.id as "standard")}>
                  <CardContent className="p-4 sm:p-6">
                     <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                       <div className="flex-1 space-y-3">
                         <div className="flex flex-wrap gap-2">
                            {option.startTimes.map(time => <Badge key={time} variant="outline" className="text-xs">
                                {time}
                              </Badge>)}
                         </div>

                         <div className="flex flex-col sm:flex-row sm:gap-4 gap-2 text-sm">
                           <div className="flex items-center gap-1 text-success">
                             <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                             <span className="text-xs sm:text-sm">{option.cancellation}</span>
                           </div>
                           <div className="flex items-center gap-1 text-info">
                             <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                             <span className="text-xs sm:text-sm">{option.payLater}</span>
                           </div>
                         </div>
                       </div>

                      <div className="w-full lg:w-auto lg:text-right lg:ml-4 pt-3 lg:pt-0 border-t lg:border-t-0 border-border/20">
                        <div className="flex lg:flex-col justify-between lg:justify-start items-center lg:items-end space-y-0 lg:space-y-1">
                          <div className="text-sm order-2 lg:order-1">
                            {isGroupPricing ? <span className="text-muted-foreground">Group price</span> : <span className="text-muted-foreground">Adults:</span>}
                            {!isGroupPricing && ` ${formatPrice(option.adultPrice)} × ${selectedAdults}`}
                            {!isGroupPricing && selectedChildren > 0 && <div className="hidden lg:block text-sm">
                                <span className="text-muted-foreground">Children:</span> {formatPrice(option.childPrice)} × {selectedChildren}
                              </div>}
                          </div>
                          <div className="order-1 lg:order-2">
                            <div className="text-xl lg:text-2xl font-bold">
                              {formatPrice(option.adultPrice * (isGroupPricing ? 1 : selectedAdults) + (isGroupPricing ? 0 : option.childPrice * selectedChildren))}
                            </div>
                            <div className="text-xs lg:text-sm text-muted-foreground text-center lg:text-right">total</div>
                          </div>
                        </div>
                        {!isGroupPricing && selectedChildren > 0 && <div className="lg:hidden text-xs text-muted-foreground mt-1">
                            Includes {selectedChildren} children at {formatPrice(option.childPrice)} each
                          </div>}
                      </div>
                    </div>
                  </CardContent>
                </Card>)}
            </div>
          </div>

          {/* Order Summary (Desktop) */}
          <div className="hidden lg:block">
            <div className="sticky top-24 space-y-4">
              {/* Main Summary Card */}
              <Card className="border-0 bg-gradient-to-br from-card via-card to-card/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-200">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    
                    Booking Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Selection Details */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Your Selection</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-gradient-to-r from-background/50 to-background/30 rounded-xl">
                        <span className="text-sm text-muted-foreground">Date</span>
                        <span className="font-medium">{selectedDate || "Select date"}</span>
                      </div>
                      
                      <div className="flex justify-between items-center p-3 bg-gradient-to-r from-background/50 to-background/30 rounded-xl">
                        <span className="text-sm text-muted-foreground">Adults</span>
                        <span className="font-medium">{selectedAdults}</span>
                      </div>
                      
                      {selectedChildren > 0 && <div className="flex justify-between items-center p-3 bg-gradient-to-r from-background/50 to-background/30 rounded-xl">
                          <span className="text-sm text-muted-foreground">Children</span>
                          <span className="font-medium">{selectedChildren}</span>
                        </div>}
                      
                      <div className="flex justify-between items-center p-3 bg-gradient-to-r from-background/50 to-background/30 rounded-xl">
                        <span className="text-sm text-muted-foreground">Option</span>
                        <span className="font-medium">{selectedOptionData.name}</span>
                      </div>
                    </div>
                  </div>

                  {/* Pricing Breakdown */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Price Breakdown</h4>
                    <div className="space-y-3 p-4 bg-gradient-to-br from-background/50 to-background/30 rounded-xl border">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">
                          {isGroupPricing ? 'Group price' : `${formatPrice(selectedOptionData.adultPrice)} × ${selectedAdults} adults`}
                        </span>
                        <span className="font-medium">{formatPrice(totals.adultSubtotal)}</span>
                      </div>
                      
                      {!isGroupPricing && selectedChildren > 0 && <div className="flex justify-between items-center text-sm">
                          <span className="text-muted-foreground">{formatPrice(selectedOptionData.childPrice)} × {selectedChildren} children</span>
                          <span className="font-medium">{formatPrice(totals.childSubtotal)}</span>
                        </div>}

                      {/* Impact Split - Only show when valid */}
                      {selectedDate && !participantsError && <div className="space-y-2 pt-3 mt-3 border-t border-border/50">
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-emerald-700 flex items-center gap-1">
                                <div className="w-3 h-3 rounded-full bg-emerald-100 flex items-center justify-center">
                                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-600"></div>
                                </div>
                                Partner initiatives (90%)
                              </span>
                              <span className="font-medium text-emerald-700">{formatPrice(totals.partner)}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-muted-foreground">Platform & operations (10%)</span>
                              <span className="font-medium text-muted-foreground">{formatPrice(totals.platform)}</span>
                            </div>
                          </div>}

                      {/* Total */}
                      <div className="border-t pt-3 mt-3">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold">Total amount</span>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-primary">{formatPrice(totals.subtotal)}</div>
                            <div className="text-xs text-muted-foreground">All taxes included</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <Button id="btn-continue" data-action="proceed" onClick={handleContinue} disabled={proceedDisabled} aria-disabled={proceedDisabled} className="w-full h-12 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-md hover:shadow-lg transition-all duration-200 font-medium" size="lg" style={{
                    touchAction: 'manipulation'
                  }}>
                      {isInCart ? <>Go to Cart</> : <>Book Now</>}
                    </Button>
                    
                    <Button type="button" variant="outline" disabled={isInCart || !!participantsError || !selectedDate || !dateValidation.isValid} onClick={() => {
                    if (participantsError || !selectedDate || !dateValidation.isValid) return;
                    addCartItem({
                      experienceSlug: (experience as any).slug || '',
                      title: (experience as any).title || 'Experience',
                      image: (experience as any).heroImage,
                      date: selectedDate,
                      adults: selectedAdults,
                      children: selectedChildren,
                      optionId: selectedOption,
                      unitPrice: basePrice,
                      donation: 0,
                      isGroupPricing
                    });
                    openCart(true);
                  }} className="w-full h-10 border-2 hover:border-primary/50 hover:bg-primary/5 transition-all duration-200">
                      {isInCart ? "In Cart" : "Add to Cart"}
                    </Button>
                  </div>

                  {/* Trust Signals */}
                  <div className="pt-4 border-t border-border/30">
                    <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full bg-green-100 flex items-center justify-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-600"></div>
                        </div>
                        <span>Free cancellation</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full bg-gray-100 flex items-center justify-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-gray-600"></div>
                        </div>
                        <span>Secure payment</span>
                      </div>
                    </div>
                    <div className="text-center mt-2 text-xs text-muted-foreground/80">
                      You won't be charged until confirmation
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Mobile Sticky Order Summary */}
          <div className="lg:hidden">
            {selectedDate && isDateValid && !participantsError && <div className="fixed left-0 right-0 bottom-0 bg-background border-t p-4 z-50" style={{
            pointerEvents: 'auto',
            paddingBottom: 'calc(1rem + env(safe-area-inset-bottom, 0))'
          }}>
                <div className="flex items-center justify-between gap-4 mb-3">
                  <div className="text-sm space-y-1">
                    <div><span className="text-muted-foreground">Date:</span> {selectedDate}</div>
                    <div><span className="text-muted-foreground">Participants:</span> {totalParticipants}</div>
                    <div><span className="text-muted-foreground">Option:</span> {selectedOptionData.name}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold">{formatPrice(totals.subtotal)}</div>
                    <div className="text-sm text-muted-foreground">total</div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button onClick={handleContinue} disabled={proceedDisabled} className="flex-1 min-h-[48px] touch-manipulation pointer-events-auto relative" size="lg" style={{
                touchAction: 'manipulation'
              }}>
                    {isInCart ? "Go to Cart" : "Book now"}
                  </Button>
                  {!isInCart && <Button type="button" variant="outline" disabled={!!participantsError || !selectedDate || !dateValidation.isValid} onClick={() => {
                if (participantsError || !selectedDate || !dateValidation.isValid) return;
                addCartItem({
                  experienceSlug: (experience as any).slug || '',
                  title: (experience as any).title || 'Experience',
                  image: (experience as any).heroImage,
                  date: selectedDate,
                  adults: selectedAdults,
                  children: selectedChildren,
                  optionId: selectedOption,
                  unitPrice: basePrice,
                  donation: 0,
                  isGroupPricing
                });
                openCart(true);
              }} className="px-3 min-h-[48px]">
                      Add to Cart
                    </Button>}
                </div>

                <div className="text-xs text-muted-foreground text-center mt-2">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Star className="h-3 w-3 fill-foreground text-foreground" />
                    <span>Free cancellation</span>
                  </div>
                  <div>You won't be charged yet</div>
                </div>
              </div>}
          </div>

        </div>
      </div>

      {/* Authentication Modal - Removed as guest booking is now allowed */}
    </section>;
};
export default AvailabilityAndOptions;
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, Clock, MapPin, Star, CheckCircle } from "lucide-react";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useCart } from "@/contexts/CartContext";
import { isSameDayBookingCutoffPassed, isTodayInLocal } from "@/utils/time";

interface Experience {
  slug: string;
  base_price: number;
  capacity: number;
  duration_hours?: number;
}

interface AvailabilityAndOptionsProps {
  experience: Experience;
  onBookingStart?: () => void;
  onBookingModalOpen: () => void;
}

const AvailabilityAndOptions = ({ 
  experience, 
  onBookingStart,
  onBookingModalOpen 
}: AvailabilityAndOptionsProps) => {
  const { formatPrice } = useCurrency();
  const { cart, updateCart, isValid } = useCart();
  const [participantsError, setParticipantsError] = useState("");

  // Validate participants against capacity
  const validateParticipants = (value: number) => {
    if (value > experience.capacity) {
      setParticipantsError(`Maximum group size is ${experience.capacity}. Please reduce the number of people.`);
      return false;
    }
    setParticipantsError("");
    return true;
  };

  const handleParticipantsChange = (value: number) => {
    const validValue = Math.max(1, value || 1);
    updateCart({ people: validValue });
    validateParticipants(validValue);
  };

  const handleDateChange = (date: string) => {
    updateCart({ date });
  };

  const handleOptionChange = (optionId: 'standard' | 'premium') => {
    updateCart({ optionId });
  };

  const handleContinue = () => {
    if (participantsError || !cart?.date) return;
    
    onBookingStart?.();
    onBookingModalOpen();
  };

  useEffect(() => {
    if (cart) {
      validateParticipants(cart.people);
    }
  }, [experience.capacity, cart?.people]);

  const options = [
    {
      id: "standard" as const,
      name: "Standard Experience",
      description: "Join our regular conservation experience with expert guides.",
      duration: experience.duration_hours || 0,
      language: "English, Swahili",
      pickup: "Hotel pickup available",
      startTimes: ["9:00 AM", "2:00 PM"],
      price: experience.base_price,
      cancellation: "Free cancellation up to 24 hours",
      payLater: "Reserve now, pay later"
    },
    {
      id: "premium" as const,
      name: "Premium Experience",
      description: "Enhanced experience with extended time and exclusive access.",
      duration: (experience.duration_hours || 0) + 1,
      language: "English, Swahili",
      pickup: "Private pickup included",
      startTimes: ["9:00 AM", "1:00 PM"],
      price: Math.round((experience.base_price || 0) * 1.3),
      cancellation: "Free cancellation up to 24 hours",
      payLater: "Reserve now, pay later",
      extras: [
        "Private transportation with guide",
        "Extended 30-minute photo session",
        "Exclusive behind-the-scenes access",
        "Priority booking for follow-up visits",
        "Complimentary conservation toolkit",
        "Personal impact certificate"
      ]
    }
  ];

  const selectedOptionData = options.find(opt => opt.id === cart?.optionId) || options[0];

  // Same-day booking cutoff logic
  const cutoffHit = cart?.date && isTodayInLocal(cart.date) && isSameDayBookingCutoffPassed();
  const cutoffMessage = "Same-day bookings close at 11:00 EAT. Please select a different date.";
  const proceedDisabled = !isValid || !!participantsError || cutoffHit;

  if (!cart) return null;

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
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date" className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Select date
                    </Label>
                    <Input 
                      id="date" 
                      type="date" 
                      value={cart.date} 
                      onChange={(e) => handleDateChange(e.target.value)}
                      min={new Date().toISOString().split("T")[0]} 
                      className={`w-full ${cutoffHit ? "border-red-500" : ""}`} 
                    />
                    {cutoffHit && (
                      <div className="text-red-600 text-sm mt-1" role="alert">
                        {cutoffMessage}
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="people" className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Participants
                    </Label>
                    <div className="flex items-center gap-2">
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="icon" 
                        onClick={() => handleParticipantsChange(cart.people - 1)}
                        disabled={cart.people <= 1} 
                        aria-label="Decrease participants"
                      >
                        -
                      </Button>
                      <Input 
                        id="people" 
                        type="number" 
                        min={1} 
                        max={experience.capacity} 
                        value={cart.people} 
                        onChange={(e) => handleParticipantsChange(parseInt(e.target.value) || 1)}
                        className={`w-20 text-center ${participantsError ? "border-red-500" : ""}`} 
                        inputMode="numeric" 
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="icon" 
                        onClick={() => handleParticipantsChange(cart.people + 1)}
                        disabled={cart.people >= experience.capacity} 
                        aria-label="Increase participants"
                      >
                        +
                      </Button>
                      <span className="text-sm text-muted-foreground ml-2">(max {experience.capacity})</span>
                    </div>
                    {participantsError && (
                      <div id="participants-error" role="alert" aria-live="assertive" className="text-red-600 text-sm mt-2">
                        {participantsError}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Options */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Available options</h3>
              {options.map(option => (
                <Card 
                  key={option.id} 
                  className={`cursor-pointer transition-colors ${cart.optionId === option.id ? "ring-2 ring-primary" : ""}`} 
                  onClick={() => handleOptionChange(option.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <input 
                            type="radio" 
                            name="option" 
                            value={option.id} 
                            checked={cart.optionId === option.id} 
                            onChange={() => handleOptionChange(option.id)}
                            className="w-4 h-4" 
                            aria-label={option.name} 
                          />
                          <h4 className="font-semibold text-lg">{option.name}</h4>
                          {option.id === "premium" && <Badge variant="secondary">Most Popular</Badge>}
                        </div>

                        <p className="text-muted-foreground mb-3">{option.description}</p>

                        {/* Premium includes list */}
                        {option.id === "premium" && option.extras && (
                          <div className="mb-3">
                            <p className="text-sm font-medium text-foreground mb-2">Premium includes:</p>
                            <ul className="text-sm text-muted-foreground space-y-1">
                              {option.extras.map((extra, index) => (
                                <li key={index} className="flex items-center gap-2">
                                  <CheckCircle className="h-3 w-3 text-green-600 flex-shrink-0" />
                                  <span>{extra}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

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
                        <div className="text-2xl font-bold">{formatPrice(option.price)}</div>
                        <div className="text-sm text-muted-foreground">per person</div>
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
                    <span>{cart.date || "Select date"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Participants:</span>
                    <span>{cart.people}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Option:</span>
                    <span>{selectedOptionData.name}</span>
                  </div>
                </div>

                {/* Pricing */}
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>
                      {formatPrice(cart.unitPrice)} × {cart.people}
                    </span>
                    <span>{formatPrice(cart.subtotal)}</span>
                  </div>

                  {/* 90/10 split once valid */}
                  {isValid && !participantsError && (
                    <div className="space-y-1 text-xs text-muted-foreground">
                      <div className="flex justify-between">
                        <span>Partner initiatives (90%)</span>
                        <span>{formatPrice(cart.split.partner90)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Platform &amp; operations (10%)</span>
                        <span>{formatPrice(cart.split.platform10)}</span>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between font-semibold pt-2">
                    <span>Total:</span>
                    <span>{formatPrice(cart.subtotal)}</span>
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
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, Clock, MapPin, Star, CheckCircle } from "lucide-react";
import { useCurrency } from "@/contexts/CurrencyContext";
import { saveCart } from "@/lib/cart";
import { isSameDayBookingCutoffPassed, isTodayInLocal } from "@/utils/time";
interface Experience {
  slug: string;
  base_price: number;
  capacity: number;
  duration_hours?: number;
}
interface AvailabilitySelectorProps {
  experience: Experience;
  project?: any;
}
const AvailabilitySelector = ({
  experience
}: AvailabilitySelectorProps) => {
  const navigate = useNavigate();
  const {
    formatPrice
  } = useCurrency();
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedPeople, setSelectedPeople] = useState(1);
  const [selectedOption, setSelectedOption] = useState<"standard" | "premium">("standard");
  const [participantsError, setParticipantsError] = useState("");

  // --- helpers ---
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
    setSelectedPeople(validValue);
    validateParticipants(validValue);
  };
  const roundMoney = (n: number) => Math.round(n * 100) / 100;
  const computeTotals = (unit: number, people: number) => {
    const subtotal = roundMoney(unit * people);
    const partner = roundMoney(subtotal * 0.9);
    const platform = roundMoney(subtotal - partner);
    return {
      subtotal,
      partner,
      platform
    };
  };

  // persist + navigate
  const handleContinue = () => {
    if (participantsError || !selectedDate) return;

    // Hide sticky CTA on all breakpoints
    document.querySelectorAll<HTMLElement>(".na-cta-bar, .na-btn-book-fab").forEach(el => el.style.display = "none");

    // Save cart to sessionStorage for checkout hydration
    saveCart({
      slug: experience.slug,
      date: selectedDate,
      people: selectedPeople,
      optionId: selectedOption
    });
    const params = new URLSearchParams({
      date: selectedDate,
      people: String(selectedPeople),
      option: selectedOption
    });
    navigate(`/checkout/${experience.slug}?${params.toString()}`);
  };
  useEffect(() => {
    validateParticipants(selectedPeople);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [experience.capacity]);
  const options = [{
    id: "standard",
    name: "Standard Experience",
    description: "Join our regular conservation experience with expert guides.",
    duration: experience.duration_hours || 3,
    language: "English, Swahili",
    pickup: "Hotel pickup available",
    startTimes: ["9:00 AM", "2:00 PM"],
    price: 350, // Fixed KES 350 per person for Standard
    cancellation: "Free cancellation up to 24 hours",
    payLater: "Reserve now, pay later"
  }, {
    id: "premium",
    name: "Premium Experience",
    description: "Enhanced experience with extended time and exclusive access.",
    duration: (experience.duration_hours || 3) + 1,
    language: "English, Swahili",
    pickup: "Private pickup included",
    startTimes: ["9:00 AM", "1:00 PM"],
    price: 455, // Fixed KES 455 per person for Premium
    cancellation: "Free cancellation up to 24 hours",
    payLater: "Reserve now, pay later"
  }] as const;
  const selectedOptionData = options.find(opt => opt.id === selectedOption) || options[0];
  const totals = computeTotals(selectedOptionData.price, selectedPeople);

  // Same-day booking cutoff logic
  const cutoffHit = selectedDate && isTodayInLocal(selectedDate) && isSameDayBookingCutoffPassed();
  const cutoffMessage = "Same-day bookings close at 11:00 EAT. Please select a different date.";
  const proceedDisabled = !selectedDate || !!participantsError || cutoffHit;
  return <section id="availability" className="availability-section scroll-mt-24">
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
                    <Input id="date" type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} min={new Date().toISOString().split("T")[0]} className={`w-full ${cutoffHit ? "border-red-500" : ""}`} />
                    {cutoffHit && <div className="text-red-600 text-sm mt-1" role="alert">
                        {cutoffMessage}
                      </div>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="people" className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Participants
                    </Label>
                    <div className="flex items-center gap-2">
                      <Button type="button" variant="outline" size="icon" onClick={() => handleParticipantsChange(selectedPeople - 1)} disabled={selectedPeople <= 1} aria-label="Decrease participants">
                        -
                      </Button>
                      <Input id="people" type="number" min={1} max={experience.capacity} value={selectedPeople} onChange={e => handleParticipantsChange(parseInt(e.target.value) || 1)} className={`w-20 text-center ${participantsError ? "border-red-500" : ""}`} inputMode="numeric" />
                      <Button type="button" variant="outline" size="icon" onClick={() => handleParticipantsChange(selectedPeople + 1)} disabled={selectedPeople >= experience.capacity} aria-label="Increase participants">
                        +
                      </Button>
                      <span className="text-sm text-muted-foreground ml-2">(max {experience.capacity})</span>
                    </div>
                    {participantsError && <div id="participants-error" role="alert" aria-live="assertive" className="text-red-600 text-sm mt-2">
                        {participantsError}
                      </div>}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Options */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Available options</h3>
              {options.map(option => <Card key={option.id} className={`cursor-pointer transition-colors ${selectedOption === option.id ? "ring-2 ring-primary" : ""}`} onClick={() => setSelectedOption(option.id as "standard" | "premium")}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <input type="radio" name="option" value={option.id} checked={selectedOption === option.id} onChange={() => setSelectedOption(option.id as "standard" | "premium")} className="w-4 h-4" aria-label={option.name} />
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
                          {option.startTimes.map(time => <Badge key={time} variant="outline" className="text-xs">
                              {time}
                            </Badge>)}
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
                </Card>)}
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
                    <span>Participants:</span>
                    <span>{selectedPeople}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Option:</span>
                    <span>{options.find(o => o.id === selectedOption)?.name || "—"}</span>
                  </div>
                </div>

                {/* Pricing */}
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>
                      {formatPrice(selectedOptionData.price)} × {selectedPeople}
                    </span>
                    <span>{formatPrice(totals.subtotal)}</span>
                  </div>

                  {/* 90/10 split once valid */}
                  {selectedDate && !participantsError && <div className="space-y-1 text-xs text-muted-foreground">
                      <div className="flex justify-between">
                        <span>Partner initiatives (90%)</span>
                        <span>{formatPrice(totals.partner)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Platform &amp; operations (10%)</span>
                        <span>{formatPrice(totals.platform)}</span>
                      </div>
                    </div>}

                  <div className="flex justify-between font-semibold pt-2">
                    <span>Total:</span>
                    <span>{formatPrice(totals.subtotal)}</span>
                  </div>
                </div>

                <Button id="btn-continue" data-action="proceed" onClick={handleContinue} disabled={proceedDisabled} aria-disabled={proceedDisabled} className="w-full" size="lg">
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
    </section>;
};
export default AvailabilitySelector;
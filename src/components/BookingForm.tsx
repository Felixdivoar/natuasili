import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Plus, Minus } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Experience } from "@/data/partners";

interface BookingFormProps {
  experience: Experience;
  onBookingSubmit?: (bookingData: any) => void;
}

interface BookingData {
  adults: number;
  children: number;
  date: Date | undefined;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
}

export default function BookingForm({ experience, onBookingSubmit }: BookingFormProps) {
  const [bookingData, setBookingData] = useState<BookingData>({
    adults: 1,
    children: 0,
    date: undefined,
    contactName: "",
    contactEmail: "",
    contactPhone: "",
  });

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // Calculate pricing
  const isGroupPricing = experience.isGroupPricing || false;
  const adultPrice = experience.priceKESAdult;
  const childPrice = experience.childHalfPriceRule ? Math.round(adultPrice * 0.5) : adultPrice;
  
  // For group pricing, total stays constant regardless of participant count
  const subtotalAdults = isGroupPricing ? adultPrice : (bookingData.adults * adultPrice);
  const subtotalChildren = isGroupPricing ? 0 : (bookingData.children * childPrice);
  const totalPrice = subtotalAdults + subtotalChildren;

  // Format KES currency
  const formatKES = (amount: number) => {
    return `Kes ${amount.toLocaleString()}`;
  };

  const updateAdults = (change: number) => {
    const minParticipants = experience.minCapacity || 1;
    const maxParticipants = experience.capacity; // Allow null (unlimited)
    const currentTotal = bookingData.adults + bookingData.children;
    
    setBookingData(prev => {
      const newAdults = Math.max(0, prev.adults + change);
      const newTotal = newAdults + prev.children;
      
      // For group pricing experiences, enforce minimum participants
      if (experience.isGroupPricing && newTotal < minParticipants && change < 0) {
        return prev; // Don't allow reducing below minimum
      }
      
      // Don't exceed maximum capacity (if capacity exists)
      if (maxParticipants && newTotal > maxParticipants && change > 0) {
        return prev;
      }
      
      return {
        ...prev,
        adults: newAdults
      };
    });
  };

  const updateChildren = (change: number) => {
    const minParticipants = experience.minCapacity || 1;
    const maxParticipants = experience.capacity; // Allow null (unlimited)
    
    setBookingData(prev => {
      const newChildren = Math.max(0, prev.children + change);
      const newTotal = prev.adults + newChildren;
      
      // For group pricing experiences, enforce minimum participants
      if (experience.isGroupPricing && newTotal < minParticipants && change < 0) {
        return prev; // Don't allow reducing below minimum
      }
      
      // Don't exceed maximum capacity (if capacity exists)
      if (maxParticipants && newTotal > maxParticipants && change > 0) {
        return prev;
      }
      
      return {
        ...prev,
        children: newChildren
      };
    });
  };

  const isValid = 
    (bookingData.adults + bookingData.children >= (experience.minCapacity || 1)) && 
    bookingData.date && 
    bookingData.contactName.trim() && 
    bookingData.contactEmail.trim() && 
    bookingData.contactPhone.trim();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      const submissionData = {
        ...bookingData,
        experience: experience.title,
        experienceId: experience.id,
        pricing: {
          adultPrice,
          childPrice,
          subtotalAdults,
          subtotalChildren,
          totalPrice,
        }
      };
      onBookingSubmit?.(submissionData);
      console.log("Booking submitted:", submissionData);
    }
  };

  return (
    <Card className="w-full max-w-md sticky top-6">
      <CardHeader>
        <CardTitle className="text-lg">Book This Experience</CardTitle>
        <div className="text-2xl font-bold text-primary">
          {formatKES(adultPrice)}
          <span className="text-sm font-normal text-muted-foreground ml-1">
            {isGroupPricing ? 'per group' : 'per adult'}
          </span>
        </div>
        {isGroupPricing && (
          <div className="text-sm text-muted-foreground">
            {experience.capacity 
              ? `Group experience (min ${experience.minCapacity || 2}, max ${experience.capacity} participants)`
              : `Group experience (min ${experience.minCapacity || 2} participants)`
            }
          </div>
        )}
        {!isGroupPricing && experience.childHalfPriceRule && (
          <div className="text-sm text-muted-foreground">
            Children: {formatKES(childPrice)} (50% off)
          </div>
        )}
      </CardHeader>
      
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Traveler Counts */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Adults</Label>
                <div className="text-xs text-muted-foreground">{formatKES(adultPrice)} each</div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => updateAdults(-1)}
                  disabled={bookingData.adults <= 0}
                  className="h-8 w-8 p-0"
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="w-8 text-center text-sm font-medium">
                  {bookingData.adults}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => updateAdults(1)}
                  className="h-8 w-8 p-0"
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Children</Label>
                <div className="text-xs text-muted-foreground">{formatKES(childPrice)} each</div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => updateChildren(-1)}
                  disabled={bookingData.children <= 0}
                  className="h-8 w-8 p-0"
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="w-8 text-center text-sm font-medium">
                  {bookingData.children}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => updateChildren(1)}
                  className="h-8 w-8 p-0"
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>

          {/* Date Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Date</Label>
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !bookingData.date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {bookingData.date ? format(bookingData.date, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={bookingData.date}
                  onSelect={(date) => {
                    setBookingData(prev => ({ ...prev, date }));
                    setIsCalendarOpen(false);
                  }}
                  disabled={(date) => date <= new Date()}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Contact Information */}
          <div className="space-y-3">
            <div>
              <Label htmlFor="contactName" className="text-sm font-medium">Full Name</Label>
              <Input
                id="contactName"
                type="text"
                value={bookingData.contactName}
                onChange={(e) => setBookingData(prev => ({ ...prev, contactName: e.target.value }))}
                className="mt-1"
                required
              />
            </div>

            <div>
              <Label htmlFor="contactEmail" className="text-sm font-medium">Email</Label>
              <Input
                id="contactEmail"
                type="email"
                value={bookingData.contactEmail}
                onChange={(e) => setBookingData(prev => ({ ...prev, contactEmail: e.target.value }))}
                className="mt-1"
                required
              />
            </div>

            <div>
              <Label htmlFor="contactPhone" className="text-sm font-medium">Phone Number</Label>
              <Input
                id="contactPhone"
                type="tel"
                value={bookingData.contactPhone}
                onChange={(e) => setBookingData(prev => ({ ...prev, contactPhone: e.target.value }))}
                className="mt-1"
                required
              />
            </div>
          </div>

          {/* Pricing Summary */}
          {(bookingData.adults > 0 || bookingData.children > 0) && (
            <div className="space-y-2 pt-4 border-t">
              <div className="text-sm font-medium">Pricing Summary</div>
              
              {isGroupPricing ? (
                <div className="flex justify-between text-sm">
                  <span>Group Experience ({bookingData.adults + bookingData.children} participants)</span>
                  <span>{formatKES(totalPrice)}</span>
                </div>
              ) : (
                <>
                  {bookingData.adults > 0 && (
                    <div className="flex justify-between text-sm">
                      <span>{bookingData.adults} Adult{bookingData.adults > 1 ? 's' : ''}</span>
                      <span>{formatKES(subtotalAdults)}</span>
                    </div>
                  )}
                  
                  {bookingData.children > 0 && (
                    <div className="flex justify-between text-sm">
                      <span>{bookingData.children} Child{bookingData.children > 1 ? 'ren' : ''}</span>
                      <span>{formatKES(subtotalChildren)}</span>
                    </div>
                  )}
                </>
              )}
              
              <Separator />
              
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span className="text-primary">{formatKES(totalPrice)}</span>
              </div>
            </div>
          )}

          {/* Book Button */}
          <Button 
            type="submit" 
            className="w-full" 
            disabled={!isValid}
            size="lg"
          >
            {isValid ? `Book for ${formatKES(totalPrice)}` : 'Complete booking details'}
          </Button>
          
          {!isValid && (
            <div className="text-xs text-muted-foreground text-center">
              {(bookingData.adults + bookingData.children) < (experience.minCapacity || 1)
                ? `Minimum ${experience.minCapacity || 1} participants required${isGroupPricing ? ' for group experience' : ''}`
                : !bookingData.date 
                ? "Please select a date"
                : "Please fill in all contact details"
              }
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
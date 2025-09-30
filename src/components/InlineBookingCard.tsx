import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CalendarIcon, Users, Minus, Plus, Clock, MapPin } from "lucide-react";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useSearchParams } from "react-router-dom";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format, addDays, isAfter, isBefore } from "date-fns";
import { useCart } from "@/contexts/CartContext";

interface InlineBookingCardProps {
  experience: any;
  onBookingClick: () => void;
}

const InlineBookingCard: React.FC<InlineBookingCardProps> = ({ experience, onBookingClick }) => {
  const { formatPrice } = useCurrency();
  const [searchParams, setSearchParams] = useSearchParams();
  const { updateCart } = useCart();
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    searchParams.get('date') ? new Date(searchParams.get('date')!) : undefined
  );
  const [adults, setAdults] = useState(parseInt(searchParams.get('adults') || '1'));
  const [children, setChildren] = useState(parseInt(searchParams.get('children') || '0'));
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  // Price calculations
  const adultPrice = experience.priceKESAdult || experience.base_price || 350;
  const childPrice = experience.childHalfPriceRule ? Math.round(adultPrice / 2) : adultPrice;
  const isGroupPricing = experience.isGroupPricing || false;
  
  const subtotal = isGroupPricing 
    ? adultPrice 
    : (adults * adultPrice + children * childPrice);
  
  const partnerAmount = Math.round(subtotal * 0.90);
  const platformAmount = subtotal - partnerAmount;

  const isBookingValid = selectedDate && adults >= 1;
  const totalPeople = adults + children;

  // Update URL params when values change and sync CartContext
  useEffect(() => {
    const newParams = new URLSearchParams(searchParams);
    
    if (selectedDate) {
      newParams.set('date', format(selectedDate, 'yyyy-MM-dd'));
    }
    newParams.set('adults', adults.toString());
    newParams.set('people', totalPeople.toString()); // Add total people for booking form
    if (children > 0) {
      newParams.set('children', children.toString());
    } else {
      newParams.delete('children');
    }
    
    setSearchParams(newParams, { replace: true });

    // Also hydrate the Cart so Booking modal picks it instantly
    updateCart({
      date: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '',
      adults,
      children,
    });
  }, [selectedDate, adults, children, totalPeople, searchParams, setSearchParams]);

  const incrementAdults = () => {
    const maxCapacity = experience.capacity || 20;
    if (adults + children < maxCapacity) {
      setAdults(prev => prev + 1);
    }
  };

  const decrementAdults = () => {
    if (adults > 1) {
      setAdults(prev => prev - 1);
    }
  };

  const incrementChildren = () => {
    const maxCapacity = experience.capacity || 20;
    if (adults + children < maxCapacity) {
      setChildren(prev => prev + 1);
    }
  };

  const decrementChildren = () => {
    if (children > 0) {
      setChildren(prev => prev - 1);
    }
  };

  // Date constraints
  const minDate = new Date();
  const maxDate = addDays(new Date(), 365); // 1 year in advance

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold">{formatPrice(adultPrice)}</span>
              <span className="text-sm text-muted-foreground">per person</span>
            </div>
            {experience.childHalfPriceRule && (
              <p className="text-xs text-muted-foreground mt-1">
                Children pay {formatPrice(childPrice)} (50% off)
              </p>
            )}
          </div>
          <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-200">
            Available
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Quick Info */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          {experience.duration && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{experience.duration}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>{experience.capacity ? `Max ${experience.capacity}` : 'No limit'}</span>
          </div>
        </div>

        <Separator />

        {/* Date Selection */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Select Date</Label>
          <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !selectedDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  setSelectedDate(date);
                  setIsDatePickerOpen(false);
                }}
                disabled={(date) =>
                  isBefore(date, minDate) || isAfter(date, maxDate)
                }
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* People Selection */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Travelers</Label>
          
          <div className="space-y-3">
            {/* Adults */}
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-sm">Adults</div>
                <div className="text-xs text-muted-foreground">Age 13+</div>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={decrementAdults}
                  disabled={adults <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center text-sm font-medium">{adults}</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={incrementAdults}
                  disabled={experience.capacity && totalPeople >= experience.capacity}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Children */}
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-sm">Children</div>
                <div className="text-xs text-muted-foreground">Age 2-12</div>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={decrementChildren}
                  disabled={children <= 0}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center text-sm font-medium">{children}</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={incrementChildren}
                  disabled={experience.capacity && totalPeople >= experience.capacity}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Price Breakdown */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>{adults} Adult{adults !== 1 ? 's' : ''}</span>
            <span>{formatPrice(adults * adultPrice)}</span>
          </div>
          {children > 0 && (
            <div className="flex justify-between text-sm">
              <span>{children} Child{children !== 1 ? 'ren' : ''}</span>
              <span>{formatPrice(children * childPrice)}</span>
            </div>
          )}
          
          <Separator />
          
          <div className="flex justify-between font-medium">
            <span>Total</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          
          <div className="text-xs text-muted-foreground">
            <div className="flex justify-between">
              <span>To partner (90%)</span>
              <span>{formatPrice(partnerAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span>Platform fee (10%)</span>
              <span>{formatPrice(platformAmount)}</span>
            </div>
          </div>
        </div>

        {/* Booking Button */}
        <Button 
          className="w-full h-12 text-base font-medium"
          onClick={onBookingClick}
          disabled={!isBookingValid}
        >
          {isBookingValid ? 'Reserve Now' : 'Select Date to Continue'}
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          You won't be charged yet. Free cancellation up to 24 hours before.
        </p>
      </CardContent>
    </Card>
  );
};

export default InlineBookingCard;
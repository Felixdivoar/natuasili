import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, Users, Search } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useI18n } from "@/contexts/I18nContext";

interface AvailabilityFilterBarProps {
  onFiltersApply: (filters: {
    date: Date | null;
    adults: number;
    children: number;
  }) => void;
  className?: string;
}

const AvailabilityFilterBar: React.FC<AvailabilityFilterBarProps> = ({
  onFiltersApply,
  className
}) => {
  const { t } = useI18n();
  const [date, setDate] = useState<Date | null>(null);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);

  const handleApplyFilters = () => {
    onFiltersApply({ date, adults, children });
  };

  const handleClearFilters = () => {
    setDate(null);
    setAdults(1);
    setChildren(0);
    onFiltersApply({ date: null, adults: 1, children: 0 });
  };

  const totalGuests = adults + children;

  return (
    <Card className={cn("w-full", className)}>
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-end">
          {/* Date Picker */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium mb-2">
              {t("availability_date", "Select Date")}
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal h-12",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : t("availability_select_date", "Select a date")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date || undefined}
                  onSelect={(selectedDate) => setDate(selectedDate || null)}
                  disabled={(date) => date < new Date()}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Guests Selector */}
          <div className="flex-1 min-w-[180px]">
            <label className="block text-sm font-medium mb-2">
              {t("availability_guests", "Guests")}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <Select value={adults.toString()} onValueChange={(value) => setAdults(parseInt(value))}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder={t("adults", "Adults")} />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} {num === 1 ? t("adult", "Adult") : t("adults", "Adults")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={children.toString()} onValueChange={(value) => setChildren(parseInt(value))}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder={t("children", "Children")} />
                </SelectTrigger>
                <SelectContent>
                  {[0, 1, 2, 3, 4, 5, 6].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} {num === 1 ? t("child", "Child") : t("children", "Children")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Summary & Actions */}
          <div className="flex flex-col lg:flex-row gap-2 min-w-[200px]">
            <div className="flex items-center text-sm text-muted-foreground mb-2 lg:mb-0">
              <Users className="h-4 w-4 mr-1" />
              {totalGuests} {totalGuests === 1 ? t("guest", "Guest") : t("guests", "Guests")}
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={handleApplyFilters}
                className="flex-1 lg:flex-none bg-primary text-primary-foreground hover:bg-primary/90 h-12"
                disabled={!date}
              >
                <Search className="h-4 w-4 mr-2" />
                {t("apply_filters", "Apply Filters")}
              </Button>
              {(date || adults > 1 || children > 0) && (
                <Button 
                  variant="outline" 
                  onClick={handleClearFilters}
                  className="h-12"
                >
                  {t("clear", "Clear")}
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AvailabilityFilterBar;
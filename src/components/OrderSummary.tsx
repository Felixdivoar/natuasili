import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Shield, Clock, Users, Calendar } from "lucide-react";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useI18n } from "@/contexts/I18nContext";
import { format } from "date-fns";

interface OrderSummaryProps {
  title: string;
  date?: Date | string;
  time?: string;
  guests: {
    adults: number;
    children?: number;
  };
  lines: Array<{
    label: string;
    amount: number;
    quantity?: number;
  }>;
  taxes?: Array<{
    label: string;
    amount: number;
  }>;
  total: number;
  cancellationNote?: string;
  disclaimer?: string;
  className?: string;
  sticky?: boolean;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  title,
  date,
  time,
  guests,
  lines,
  taxes = [],
  total,
  cancellationNote,
  disclaimer,
  className = "",
  sticky = true
}) => {
  const { formatPrice } = useCurrency();
  const { t } = useI18n();

  const totalGuests = guests.adults + (guests.children || 0);

  const formatDate = (dateValue: Date | string) => {
    if (!dateValue) return '';
    const dateObj = typeof dateValue === 'string' ? new Date(dateValue) : dateValue;
    return format(dateObj, "PPP");
  };

  return (
    <Card className={`${sticky ? 'sticky top-6' : ''} ${className} bg-background border shadow-lg`}>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold line-clamp-2">
          {title}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Booking Details */}
        <div className="space-y-3">
          {date && (
            <div className="flex items-center text-sm">
              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{formatDate(date)}</span>
              {time && <span className="ml-2 text-muted-foreground">• {time}</span>}
            </div>
          )}
          
          <div className="flex items-center text-sm">
            <Users className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>
              {guests.adults} {guests.adults === 1 ? t("adult", "Adult") : t("adults", "Adults")}
              {guests.children && guests.children > 0 && (
                <>, {guests.children} {guests.children === 1 ? t("child", "Child") : t("children", "Children")}</>
              )}
            </span>
          </div>
        </div>

        <Separator />

        {/* Price Breakdown */}
        <div className="space-y-3">
          {lines.map((line, index) => (
            <div key={index} className="flex justify-between items-center">
              <div className="text-sm">
                <span>{line.label}</span>
                {line.quantity && line.quantity > 1 && (
                  <span className="text-muted-foreground ml-1">× {line.quantity}</span>
                )}
              </div>
              <span className="font-medium">{formatPrice(line.amount)}</span>
            </div>
          ))}

          {taxes.length > 0 && (
            <>
              <Separator />
              {taxes.map((tax, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">{tax.label}</span>
                  <span>{formatPrice(tax.amount)}</span>
                </div>
              ))}
            </>
          )}
        </div>

        <Separator />

        {/* Total */}
        <div className="flex justify-between items-center text-lg font-semibold">
          <span>{t("total", "Total")}</span>
          <span>{formatPrice(total)}</span>
        </div>

        {/* Free Cancellation */}
        {cancellationNote && (
          <div className="flex items-start gap-2 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
            <Shield className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-green-700 dark:text-green-300">
              <span className="font-medium">{t("free_cancellation", "Free cancellation")}</span>
              <p className="text-xs mt-1 opacity-90">{cancellationNote}</p>
            </div>
          </div>
        )}

        {/* Trust Icons */}
        <div className="flex items-center justify-center gap-4 pt-2">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Shield className="h-3 w-3" />
            <span>{t("secure_booking", "Secure")}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{t("instant_confirmation", "Instant confirmation")}</span>
          </div>
        </div>

        {/* Disclaimer */}
        {disclaimer && (
          <p className="text-xs text-muted-foreground mt-4 p-2 bg-muted/50 rounded">
            {disclaimer}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default OrderSummary;
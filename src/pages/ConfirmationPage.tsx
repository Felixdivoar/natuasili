import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCurrency } from "@/contexts/CurrencyContext";
import { getReceipt /*, clearReceipt*/ } from "@/lib/receipt";

export default function ConfirmationPage() {
  const { slug } = useParams();
  const { formatPrice } = useCurrency();

  // Primary source of truth
  const r = getReceipt();

  // Optional: if you want to clear the receipt AFTER render, do it on unmount instead
  // useEffect(() => () => clearReceipt(), []);

  // Guard: if no receipt or wrong slug, show a friendly message (or redirect)
  if (!r || (slug && r.slug !== slug)) {
    return (
      <div className="max-w-3xl mx-auto my-12">
        <Card>
          <CardHeader><CardTitle>Booking Confirmed</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              We couldn't load your booking details. Please check your email for the confirmation, or return to the experience page.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { date, people, optionId, unitPrice, subtotal, partner, platform } = r;

  return (
    <div className="max-w-3xl mx-auto my-12">
      <Card>
        <CardHeader>
          <CardTitle>Booking Confirmed ✅</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm"><span>Date</span><span>{date}</span></div>
            <div className="flex justify-between text-sm"><span>Participants</span><span>{people}</span></div>
            <div className="flex justify-between text-sm"><span>Option</span><span>{optionId === "premium" ? "Premium" : "Standard"}</span></div>
            <div className="flex justify-between text-sm"><span>Price per person</span><span>{formatPrice(unitPrice)}</span></div>
          </div>

          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>{formatPrice(unitPrice)} × {people}</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Partner initiatives (90%)</span>
              <span>{formatPrice(partner)}</span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Platform &amp; operations (10%)</span>
              <span>{formatPrice(platform)}</span>
            </div>
            <div className="flex justify-between font-semibold pt-2">
              <span>Total</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 p-4 rounded-md text-sm">
            🌍 Your impact: {formatPrice(partner)} goes directly to conservation partner initiatives.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
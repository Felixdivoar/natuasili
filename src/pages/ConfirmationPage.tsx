import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCurrency } from "@/contexts/CurrencyContext";
import { getCart, clearCart } from "@/lib/cart";

interface ConfirmationProps {
  experience?: {
    slug: string;
    title: string;
    base_price: number;
    capacity?: number;
  };
}

const ConfirmationPage = ({ experience: expProp }: ConfirmationProps) => {
  const { slug: slugParam } = useParams();
  const location = useLocation();
  const { formatPrice } = useCurrency();

  // parse query params
  const url = new URL(window.location.href);
  const qsDate = url.searchParams.get("date") || "";
  const qsPeople = Number(url.searchParams.get("people") || "0");
  const qsOption = (url.searchParams.get("option") || "standard") as "standard" | "premium";

  const cart = getCart();

  const slug = slugParam || cart?.slug || "";
  const date = qsDate || cart?.date || "";
  const people = qsPeople || cart?.people || 1;
  const optionId = qsOption || cart?.optionId || "standard";

  const experience = expProp || ({} as any);

  // --- compute pricing ---
  const unitPrice = optionId === "premium"
    ? Math.round((experience.base_price || 0) * 1.3)
    : experience.base_price || 0;

  const subtotal = unitPrice * people;
  const partner = Math.round(subtotal * 0.9 * 100) / 100;
  const platform = Math.round((subtotal - partner) * 100) / 100;

  useEffect(() => {
    // clear session cart so it doesn't leak into next booking
    clearCart();
  }, []);

  return (
    <div className="max-w-3xl mx-auto my-12">
      <Card>
        <CardHeader>
          <CardTitle>Booking Confirmed ✅</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold">
              {experience?.title || "Experience booked"}
            </h2>
            <p className="text-muted-foreground">
              Thank you for booking with NatuAsili.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Date</span>
              <span>{date}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Participants</span>
              <span>{people}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Option</span>
              <span>{optionId === "premium" ? "Premium" : "Standard"}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Price per person</span>
              <span>{formatPrice(unitPrice)}</span>
            </div>
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
            <p>
              🌍 Your impact: {formatPrice(partner)} goes directly to conservation partner initiatives.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConfirmationPage;
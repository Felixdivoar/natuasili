import { useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCurrency } from "@/contexts/CurrencyContext";
import { getCart, clearCart } from "@/lib/cart";

type OptionId = "standard" | "premium";

interface Experience {
  slug: string;
  title?: string;
  base_price: number;
}

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export default function ConfirmationPage({ experience }: { experience?: Experience }) {
  const { slug: slugParam } = useParams();
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
  const qs = useQuery();

  // 1) hydrate from URL first, then fallback to session
  const slug = slugParam || qs.get("slug") || getCart()?.slug || "";
  const date = qs.get("date") || getCart()?.date || "";
  const people = Number(qs.get("people") || getCart()?.people || 1);
  const optionId = (qs.get("option") as OptionId) || (getCart()?.optionId as OptionId) || "standard";

  // 2) we must know the price used at checkout (avoid drift)
  //    Either pass it via query (?unit=12345) or recompute from experience.
  const unitQuery = Number(qs.get("unit") || 0);
  const unitPrice =
    unitQuery > 0
      ? unitQuery
      : optionId === "premium"
      ? Math.round((experience?.base_price || 0) * 1.3)
      : experience?.base_price || 0;

  // 3) totals and split (round to 2dp)
  const round = (n: number) => Math.round(n * 100) / 100;
  const subtotal = round(unitPrice * people);
  const partner = round(subtotal * 0.9);
  const platform = round(subtotal - partner);

  // 4) guard: if something core is missing, send back to experience
  if (!slug || !date || !people || !unitPrice) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>We couldn't find your booking</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Please return to the experience page and try again.</p>
            <Button className="mt-4" onClick={() => navigate(`/experience/${slug}#availability`)}>Back to Availability</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 5) clear ephemeral cart now that we're confirmed
  clearCart();

  return (
    <div className="max-w-5xl mx-auto grid lg:grid-cols-3 gap-6">
      {/* Left: Confirmation summary */}
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Booking confirmed 🎉</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm text-muted-foreground">
              A confirmation email will be sent to you shortly.
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <div className="text-xs uppercase text-muted-foreground">Experience</div>
                <div className="font-medium">{experience?.title || "Selected experience"}</div>
              </div>
              <div>
                <div className="text-xs uppercase text-muted-foreground">Date</div>
                <div className="font-medium">{new Date(date).toLocaleDateString()}</div>
              </div>
              <div>
                <div className="text-xs uppercase text-muted-foreground">Travelers</div>
                <div className="font-medium">{people}</div>
              </div>
              <div>
                <div className="text-xs uppercase text-muted-foreground">Option</div>
                <div className="font-medium">{optionId === "premium" ? "Premium" : "Standard"}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Your Impact */}
        <Card>
          <CardHeader>
            <CardTitle>Your Impact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span>Partner initiatives (90%)</span>
              <span className="font-medium">{formatPrice(partner)}</span>
            </div>
            <div className="flex justify-between">
              <span>Platform &amp; operations (10%)</span>
              <span className="font-medium">{formatPrice(platform)}</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-semibold">
              <span>Total contributed</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="text-xs text-muted-foreground">
              Thank you. 90% of your booking supports conservation/community projects; 10% sustains the NatuAsili platform and operations.
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button variant="outline" onClick={() => navigate(`/experience/${slug}`)}>Back to Experience</Button>
          <Button onClick={() => navigate(`/`)}>Explore more experiences</Button>
        </div>
      </div>

      {/* Right: Receipt-style order */}
      <div>
        <Card className="sticky top-24">
          <CardHeader>
            <CardTitle>Receipt</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{formatPrice(unitPrice)} × {people}</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="space-y-1 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>Partner (90%)</span>
                <span>{formatPrice(partner)}</span>
              </div>
              <div className="flex justify-between">
                <span>Platform (10%)</span>
                <span>{formatPrice(platform)}</span>
              </div>
            </div>
            <div className="border-t pt-2 flex justify-between font-semibold">
              <span>Total</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
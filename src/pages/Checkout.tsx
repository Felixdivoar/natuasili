import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, MapPin } from "lucide-react";
import { mockExperiences } from "@/data/mockData";
import { useCurrency } from "@/contexts/CurrencyContext";
import { getCart, clearCart } from "@/lib/cart";
import { saveReceipt } from "@/lib/receipt";
import { isSameDayBookingCutoffPassed, isTodayInLocal } from "@/utils/time";

interface Experience {
  slug: string;
  base_price: number;
  capacity: number;
  duration_hours?: number;
  title?: string;
  hero_image?: string;
  theme?: string;
  images?: string[];
  location_text?: string;
}

const Checkout = () => {
  const { slug: slugParam } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { formatPrice } = useCurrency();
  const [holdTimer, setHoldTimer] = useState(29 * 60 + 59); // 29:59

  // --- hydrate selection from URL / session ---
  const url = new URL(window.location.href);
  const qsDate = url.searchParams.get("date") || "";
  const qsPeople = Number(url.searchParams.get("people") || "0");
  const qsOption = (url.searchParams.get("option") || "standard") as "standard" | "premium";

  const cart = getCart();
  const slug = slugParam || cart?.slug || "";
  const [date, setDate] = useState(qsDate || cart?.date || "");
  const [people, setPeople] = useState(qsPeople || cart?.people || 1);
  const [optionId, setOptionId] = useState<"standard" | "premium">(qsOption || cart?.optionId || "standard");

  // Get experience
  const experience = mockExperiences.find(exp => exp.slug === slug) as Experience | undefined;
  
  // --- guards ---
  useEffect(() => {
    // Hide sticky CTA on checkout
    document.querySelectorAll<HTMLElement>(".na-cta-bar, .na-btn-book-fab").forEach((el) => (el.style.display = "none"));
  }, []);

  // if critical info missing, send back to experience availability
  useEffect(() => {
    if (!slug || !date || !people || !optionId) {
      navigate(`/experience/${slug}#availability`, { replace: true });
    }
  }, [slug, date, people, optionId, navigate]);

  // --- validation: max participants ---
  const [paxError, setPaxError] = useState("");
  useEffect(() => {
    if (experience?.capacity && people > experience.capacity) {
      setPaxError(`Maximum group size is ${experience.capacity}. Please reduce the number of people.`);
    } else {
      setPaxError("");
    }
  }, [people, experience?.capacity]);

  // Hold timer countdown
  useEffect(() => {
    if (holdTimer > 0) {
      const timer = setTimeout(() => setHoldTimer(holdTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [holdTimer]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // --- pricing ---
  const unitPrice = useMemo(() => {
    if (!experience?.base_price) return 0;
    return optionId === "premium" ? Math.round(experience.base_price * 1.3) : experience.base_price;
  }, [experience?.base_price, optionId]);

  const roundMoney = (n: number) => Math.round(n * 100) / 100;
  const subtotal = roundMoney(unitPrice * people);
  const partner = roundMoney(subtotal * 0.9);
  const platform = roundMoney(subtotal - partner);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

  const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  const contactErrors = {
    fullName: fullName.trim().length < 2 ? "Please enter your full name." : "",
    email: !isEmail(email) ? "Enter a valid email address." : "",
  };

  // Same-day booking cutoff logic
  const cutoffHit = date && isTodayInLocal(date) && isSameDayBookingCutoffPassed();
  const cutoffMessage = "Same-day bookings close at 11:00 EAT. Please pick a later date.";

  const contactValid = !contactErrors.fullName && !contactErrors.email;
  const canPay = Boolean(date && people && !paxError && subtotal > 0 && contactValid && !cutoffHit);

  const handleChangeSelection = () => {
    navigate(`/experience/${slug}#availability`);
  };

  const handlePlaceOrder = () => {
    if (!canPay) return;
    
    // 1) Compute the EXACT numbers used for charging
    const finalUnitPrice = unitPrice;               // already resolved (std/premium)
    const finalSubtotal  = Number((finalUnitPrice * people).toFixed(2));
    const finalPartner   = Number((finalSubtotal * 0.90).toFixed(2));
    const finalPlatform  = Number((finalSubtotal - finalPartner).toFixed(2));

    // 2) Persist a receipt snapshot for Confirmation page
    saveReceipt({
      slug,
      date,
      people,
      optionId,
      unitPrice: finalUnitPrice,
      subtotal: finalSubtotal,
      partner: finalPartner,
      platform: finalPlatform,
    });

    // 3) (Optional) clear the cart so a new booking starts clean
    clearCart();

    // 4) Redirect with params too (nice for shareability, but Confirmation will trust receipt)
    navigate(`/confirmation/${slug}?date=${encodeURIComponent(date)}&people=${people}&option=${optionId}`, { replace: true });
  };
  
  const getThemeColor = (theme: string) => {
    switch (theme) {
      case 'Wildlife': return 'bg-wildlife/10 text-wildlife border-wildlife/20';
      case 'Livelihoods': return 'bg-livelihoods/10 text-livelihoods border-livelihoods/20';
      case 'Education': return 'bg-education/10 text-education border-education/20';
      case 'Habitat': return 'bg-habitat/10 text-habitat border-habitat/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  if (!experience) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Experience Not Found</h1>
            <p className="text-muted-foreground mb-6">The experience you're trying to book doesn't exist.</p>
            <Button onClick={() => navigate("/browse")}>Browse Experiences</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background checkout-page">
      
      {/* Header with timer */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to={`/experience/${slug}`} className="flex items-center gap-2 text-muted-foreground hover:text-primary">
              <ArrowLeft className="h-4 w-4" />
              Back to experience
            </Link>
            {holdTimer > 0 && (
              <div className="flex items-center gap-2 text-orange-600 font-medium">
                <Clock className="h-4 w-4" />
                <span>Hold expires in {formatTime(holdTimer)}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left: Stepper / Forms (simplified) */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>1. Activity details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">{experience?.title || "Selected experience"}</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(date).toLocaleDateString()} • {people} {people === 1 ? "person" : "people"} • {optionId === "premium" ? "Premium" : "Standard"}
                      </div>
                    </div>
                    <Button variant="link" onClick={handleChangeSelection} className="px-0">Change date or participants</Button>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-3">
                    <div>
                      <Label>Date</Label>
                      <Input 
                        value={date} 
                        onChange={(e) => setDate(e.target.value)} 
                        type="date" 
                        className={cutoffHit ? "border-red-500" : ""}
                      />
                      {cutoffHit && (
                        <div className="text-red-600 text-sm mt-1" role="alert">
                          {cutoffMessage}
                        </div>
                      )}
                    </div>
                    <div>
                      <Label>Participants</Label>
                      <Input
                        value={people}
                        onChange={(e) => setPeople(Math.max(1, parseInt(e.target.value) || 1))}
                        type="number"
                        min={1}
                        max={experience?.capacity || undefined}
                      />
                      {paxError && <div role="alert" className="text-red-600 text-sm mt-1">{paxError}</div>}
                    </div>
                    <div>
                      <Label>Option</Label>
                      <select
                        className="w-full border rounded h-10 px-3 text-sm"
                        value={optionId}
                        onChange={(e) => setOptionId((e.target.value as "standard" | "premium") || "standard")}
                      >
                        <option value="standard">Standard</option>
                        <option value="premium">Premium</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>2. Contact</CardTitle>
                </CardHeader>
                <CardContent className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">Full name</Label>
                    <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your name" required />
                    {contactErrors.fullName && <div role="alert" className="text-red-600 text-sm mt-1">{contactErrors.fullName}</div>}
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
                    {contactErrors.email && <div role="alert" className="text-red-600 text-sm mt-1">{contactErrors.email}</div>}
                  </div>
                  <div className="sm:col-span-2">
                    <Label>Phone</Label>
                    <Input type="tel" placeholder="+254 7XX XXX XXX" />
                  </div>
                  <div className="sm:col-span-2">
                    <Label>Notes (optional)</Label>
                    <Input placeholder="Anything we should know?" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>3. Payment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button size="lg" className="w-full" disabled={!canPay} aria-disabled={!canPay} onClick={handlePlaceOrder}>
                    Place order
                  </Button>
                  {!canPay && (
                    <div className="text-sm text-muted-foreground">
                      {cutoffHit ? cutoffMessage : "Select a valid date and participants within the capacity to proceed."}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right: Order Summary */}
            <div>
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Experience preview */}
                  <div className="flex gap-3">
                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <img 
                        src={experience.images?.[0] || experience.hero_image} 
                        alt={experience.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Badge className={`mb-1 ${getThemeColor(experience.theme || '')}`}>
                        {experience.theme}
                      </Badge>
                      <h3 className="font-medium text-sm leading-tight">{experience.title}</h3>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>{experience.location_text}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{experience.duration_hours}h</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Date</span>
                      <span>{date || "—"}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Participants</span>
                      <span>{people}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Option</span>
                      <span>{optionId === "premium" ? "Premium" : "Standard"}</span>
                    </div>
                  </div>

                  <div className="border-t pt-3 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{formatPrice(unitPrice)} × {people}</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>

                    {/* 90/10 split */}
                    {date && !paxError && (
                      <div className="space-y-1 text-xs text-muted-foreground">
                        <div className="flex justify-between">
                          <span>Partner initiatives (90%)</span>
                          <span>{formatPrice(partner)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Platform &amp; operations (10%)</span>
                          <span>{formatPrice(platform)}</span>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between font-semibold pt-1">
                      <span>Total</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    You won't be charged yet. Free cancellation policies may apply.
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Checkout;
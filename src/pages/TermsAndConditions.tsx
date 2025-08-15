import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CheckCircle, Share2, Calendar, MapPin, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Link to="/">
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Terms and Conditions</h1>
              <p className="text-muted-foreground">Last updated: January 2024</p>
            </div>
          </div>

          <div className="prose prose-lg max-w-none">
            <Card className="mb-8">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle className="h-6 w-6 text-primary" />
                  <h2 className="text-xl font-bold">Welcome to NatuAsili</h2>
                </div>
                <p className="text-muted-foreground">
                  These terms and conditions outline the rules and regulations for the use of NatuAsili's conservation tourism platform.
                </p>
              </CardContent>
            </Card>

            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
                <p className="text-muted-foreground mb-4">
                  By accessing and using the NatuAsili platform, you accept and agree to be bound by the terms and provision of this agreement.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">2. Booking and Payment</h2>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• All bookings are subject to availability and confirmation by conservation partners</li>
                  <li>• Payment is required to secure your booking</li>
                  <li>• 90% of booking fees go directly to conservation partners</li>
                  <li>• Cancellation policies vary by experience and partner</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">3. Conservation Impact</h2>
                <p className="text-muted-foreground mb-4">
                  NatuAsili is committed to transparency in conservation impact. All fund allocations are tracked and reported through our impact ledger.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">4. User Responsibilities</h2>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Follow all safety guidelines provided by conservation partners</li>
                  <li>• Respect local communities and wildlife</li>
                  <li>• Provide accurate information during booking</li>
                  <li>• Report any issues promptly to our support team</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">5. Limitation of Liability</h2>
                <p className="text-muted-foreground mb-4">
                  NatuAsili acts as a platform connecting travelers with conservation partners. While we carefully vet our partners, activities are conducted by independent organizations.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">6. Contact Information</h2>
                <p className="text-muted-foreground">
                  For questions about these terms, please contact us at <a href="mailto:legal@natuasili.com" className="text-primary hover:underline">legal@natuasili.com</a>
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default TermsAndConditions;
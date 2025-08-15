import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Shield, Lock, Eye, UserCheck } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const PrivacyPolicy = () => {
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
              <h1 className="text-3xl font-bold text-foreground">Privacy Policy</h1>
              <p className="text-muted-foreground">Last updated: January 2024</p>
            </div>
          </div>

          <div className="prose prose-lg max-w-none">
            <Card className="mb-8">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                  <h2 className="text-xl font-bold">Your Privacy Matters</h2>
                </div>
                <p className="text-muted-foreground">
                  NatuAsili is committed to protecting your privacy and ensuring the security of your personal information.
                </p>
              </CardContent>
            </Card>

            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Eye className="h-6 w-6" />
                  Information We Collect
                </h2>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Personal details for booking (name, email, phone)</li>
                  <li>• Payment information (processed securely by payment partners)</li>
                  <li>• Experience preferences and requirements</li>
                  <li>• Impact tracking and conservation activity participation</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <UserCheck className="h-6 w-6" />
                  How We Use Your Information
                </h2>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Processing bookings and facilitating conservation experiences</li>
                  <li>• Communicating with you about your bookings and impact</li>
                  <li>• Improving our platform and conservation partnerships</li>
                  <li>• Sending conservation impact updates (with your consent)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Lock className="h-6 w-6" />
                  Data Security
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <h3 className="font-semibold mb-2">Encryption</h3>
                      <p className="text-sm text-muted-foreground">All data transmitted is encrypted using industry-standard SSL/TLS protocols.</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <h3 className="font-semibold mb-2">Secure Storage</h3>
                      <p className="text-sm text-muted-foreground">Personal data is stored on secure servers with restricted access.</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <h3 className="font-semibold mb-2">Regular Audits</h3>
                      <p className="text-sm text-muted-foreground">We conduct regular security audits and assessments.</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <h3 className="font-semibold mb-2">Access Controls</h3>
                      <p className="text-sm text-muted-foreground">Strict access controls ensure only authorized personnel can access data.</p>
                    </CardContent>
                  </Card>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">Sharing with Partners</h2>
                <p className="text-muted-foreground mb-4">
                  We share necessary booking information with conservation partners to facilitate your experiences. Partners are required to maintain the same privacy standards.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">Your Rights</h2>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Access your personal data</li>
                  <li>• Request corrections to your information</li>
                  <li>• Delete your account and associated data</li>
                  <li>• Opt out of marketing communications</li>
                  <li>• Export your data in a portable format</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-muted-foreground mb-4">
                      For privacy-related questions or to exercise your rights, contact our Data Protection Officer:
                    </p>
                    <div className="space-y-2">
                      <p><strong>Email:</strong> <a href="mailto:privacy@natuasili.com" className="text-primary hover:underline">privacy@natuasili.com</a></p>
                      <p><strong>Address:</strong> NatuAsili Privacy Team, Nairobi, Kenya</p>
                    </div>
                  </CardContent>
                </Card>
              </section>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users, Heart, Award, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ReferPartner() {
  const [formData, setFormData] = useState({
    referrerName: '',
    referrerEmail: '',
    partnerName: '',
    partnerEmail: '',
    partnerOrganization: '',
    conservationWork: '',
    location: '',
    additionalInfo: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Referral Submitted Successfully!",
        description: "Thank you for referring a conservation partner. We'll review the information and reach out to them soon.",
      });
      
      // Reset form
      setFormData({
        referrerName: '',
        referrerEmail: '',
        partnerName: '',
        partnerEmail: '',
        partnerOrganization: '',
        conservationWork: '',
        location: '',
        additionalInfo: ''
      });
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your referral. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-primary/5 py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
            <Users className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">
            Refer a Conservation Partner
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Know someone doing amazing conservation work in Kenya? Help us connect with them 
            and expand our network of impactful conservation experiences.
          </p>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Heart className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Support Conservation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Help conservation organizations reach more travelers and increase their impact.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Expand Our Network</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Connect us with passionate conservationists doing incredible work across Kenya.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Award className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Recognition & Rewards</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Successful referrals may qualify for special recognition and travel credits.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Referral Form */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-2xl mx-auto px-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">Partner Referral Form</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Your Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Your Information</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="referrerName">Your Name *</Label>
                      <Input
                        id="referrerName"
                        name="referrerName"
                        value={formData.referrerName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="referrerEmail">Your Email *</Label>
                      <Input
                        id="referrerEmail"
                        name="referrerEmail"
                        type="email"
                        value={formData.referrerEmail}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Partner Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Partner Information</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="partnerName">Contact Name *</Label>
                      <Input
                        id="partnerName"
                        name="partnerName"
                        value={formData.partnerName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="partnerEmail">Contact Email *</Label>
                      <Input
                        id="partnerEmail"
                        name="partnerEmail"
                        type="email"
                        value={formData.partnerEmail}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="partnerOrganization">Organization Name *</Label>
                      <Input
                        id="partnerOrganization"
                        name="partnerOrganization"
                        value={formData.partnerOrganization}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">Location in Kenya *</Label>
                      <Input
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="e.g., Maasai Mara, Amboseli, Laikipia"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Conservation Work */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="conservationWork">Conservation Work Description *</Label>
                    <Textarea
                      id="conservationWork"
                      name="conservationWork"
                      value={formData.conservationWork}
                      onChange={handleChange}
                      placeholder="Describe their conservation work, projects, and impact..."
                      rows={4}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="additionalInfo">Additional Information</Label>
                    <Textarea
                      id="additionalInfo"
                      name="additionalInfo"
                      value={formData.additionalInfo}
                      onChange={handleChange}
                      placeholder="Any additional context, website links, or special notes..."
                      rows={3}
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    "Submitting..."
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Submit Referral
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Questions About Referrals?</h2>
          <p className="text-muted-foreground mb-6">
            We'd love to hear from you! Reach out if you have any questions about our partner program.
          </p>
          <Button variant="outline" asChild>
            <a href="mailto:partnerships@natuasili.com">
              Contact Partnership Team
            </a>
          </Button>
        </div>
      </section>
    </div>
  );
}
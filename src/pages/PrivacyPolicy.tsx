
const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <section className="hero-full py-16 bg-primary/5">
        <div className="hero-inner">
          <h1 className="text-4xl font-bold text-foreground mb-8">Privacy Policy</h1>
        </div>
      </section>
      <div className="container mx-auto px-4 py-16 section">
        <div className="max-w-4xl mx-auto">
          
          <div className="prose prose-lg max-w-none">
            <div className="space-y-6 text-muted-foreground leading-relaxed">
              <p>
                <strong>Privacy Policy – NatuAsili</strong>
              </p>
              
              <p>
                We collect information you provide (e.g., name, email, phone) when you create an account, make a booking, or contact us. We also collect usage data (cookies, device info) to improve our services.
              </p>
              
              <p>
                We use your data to process bookings, provide customer support, personalize content, and communicate important updates. We share data with service providers (e.g., payment, email, analytics) under contracts that protect your information.
              </p>
              
              <p>
                We do not sell your personal data. You can access, correct, or delete your data by contacting us. We retain data only as long as necessary for legal, accounting, or operational purposes.
              </p>
              
              <p>
                Security measures protect your data, but no method is 100% secure. By using NatuAsili, you consent to this Policy.
              </p>
              
              <p>
                For questions or requests, contact <a href="mailto:privacy@natuasili.com" className="text-primary hover:underline">privacy@natuasili.com</a>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const CookiePolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 section-padding-lg">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground mb-8">Cookie Policy</h1>
          
          <div className="prose prose-lg max-w-none">
            <div className="space-y-6 text-muted-foreground leading-relaxed">
              <p>
                We use cookies and similar technologies to operate our site, remember your preferences, measure performance, and personalize content.
              </p>
              
              <h2 className="text-2xl font-bold text-foreground">Types of Cookies</h2>
              
              <p>
                <strong>Essential cookies</strong> are required for core functionality (e.g., login, checkout). These cannot be disabled as they are necessary for the site to function properly.
              </p>
              
              <p>
                <strong>Performance cookies</strong> help us understand how visitors interact with our website by collecting and reporting information anonymously.
              </p>
              
              <p>
                <strong>Functional cookies</strong> remember your preferences and choices to provide enhanced, personalized features.
              </p>
              
              <h2 className="text-2xl font-bold text-foreground">Your Choices</h2>
              
              <p>
                You can control non-essential cookies via your browser settings. Most browsers allow you to refuse cookies or delete existing ones.
              </p>
              
              <p>
                By clicking Accept on our banner or continuing to use the site, you agree to our cookie use.
              </p>
              
              <p>
                For more information about managing cookies, visit <a href="https://www.allaboutcookies.org" className="text-primary hover:underline" target="_blank" rel="noopener">www.allaboutcookies.org</a>.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default CookiePolicy;
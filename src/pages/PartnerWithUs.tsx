import { Link } from "react-router-dom";

const heroImage = "/lovable-uploads/86a97e9c-06e8-4907-baf7-f6cfa229935f.png";

export default function PartnerWithUs(){
  return (
    <>
      <section className="hero-full bg-cover bg-center relative" style={{backgroundImage:`url(${heroImage})`}}>
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="hero-inner text-white relative z-10">
          <h1 className="text-3xl md:text-5xl font-bold">Earn from responsible travel. Fund your conservation work.</h1>
          <p className="mt-4 text-white/90 text-lg max-w-2xl">Transparent 90/10 model, direct payouts, analytics, and impact storytelling.</p>
          <div className="mt-6 flex gap-3">
            <Link to="/partner-signup" className="rounded-md bg-white px-6 py-3 text-sm font-semibold text-black hover:bg-white/90 transition-colors">Create partner account</Link>
            <Link to="/contact" className="rounded-md border border-white/70 px-6 py-3 text-sm font-semibold text-white/90 hover:bg-white/10 transition-colors">Talk to us</Link>
          </div>
        </div>
      </section>

      <main className="na-container">
        {/* Why NatuAsili */}
        <section className="section grid md:grid-cols-4 gap-6">
          {[
            {t:"Impact-minded travellers",d:"Reach guests who value wildlife and community outcomes."},
            {t:"Transparent funding (90/10)",d:"90% to your initiatives; 10% to platform & ops."},
            {t:"Analytics & payouts",d:"Bookings, revenue, monthly earnings, and fast settlement."},
            {t:"Storytelling & visibility",d:"Appear in impact stories, newsletters, and features."},
          ].map(x=>(
            <div key={x.t} className="rounded-xl border p-6 bg-white hover:shadow-lg transition-shadow">
              <div className="font-semibold text-lg mb-3">{x.t}</div>
              <p className="text-sm text-muted-foreground">{x.d}</p>
            </div>
          ))}
        </section>

        {/* How it works */}
        <section className="section">
          <h2 className="text-2xl font-bold mb-6">How it works</h2>
          <div className="mt-3 grid md:grid-cols-5 gap-6">
            {[
              {t:"Apply & verify",d:"Share your conservation standards, safety, and proof of impact."},
              {t:"List experiences",d:"Add pricing, capacity, dates, and impact highlights."},
              {t:"Go live",d:"We distribute and feature your listing to the right audience."},
              {t:"Get bookings & payouts",d:"Payments handled, payouts scheduled reliably."},
              {t:"Report impact",d:"Upload photos, receipts, and outcomes for your ledger."},
            ].map(x=>(
              <div key={x.t} className="rounded-xl border p-6 bg-white hover:shadow-lg transition-shadow">
                <div className="font-semibold text-lg mb-3">{x.t}</div>
                <p className="text-sm text-muted-foreground">{x.d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Economics */}
        <section className="section rounded-xl border p-6 bg-white">
          <h2 className="text-2xl font-bold mb-4">Economics</h2>
          <p className="text-muted-foreground mb-4">Example: a KES 100,000 booking → KES 90,000 to your initiative and KES 10,000 to platform & operations.</p>
          <div className="text-sm text-muted-foreground">FAQs: fees, taxes, currency, cancellations.</div>
        </section>

        {/* Success stories */}
        <section className="section">
          <h2 className="text-2xl font-bold mb-6">Success stories</h2>
          <div className="mt-3 grid md:grid-cols-3 gap-6">
            {[1,2,3].map(i=>(
              <div key={i} className="rounded-xl border p-6 bg-white hover:shadow-lg transition-shadow">
                <div className="font-semibold text-lg mb-3">Partner spotlight #{i}</div>
                <p className="text-sm text-muted-foreground">How bookings funded rangers, habitat, and community livelihoods.</p>
              </div>
            ))}
          </div>
        </section>

        {/* Get started */}
        <section className="section mb-10 rounded-xl border p-6 bg-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="font-semibold text-lg mb-2">Ready to join NatuAsili?</div>
            <p className="text-sm text-muted-foreground">Create your partner account or talk to our team.</p>
          </div>
          <div className="flex gap-3">
            <Link to="/partner-signup" className="rounded-md bg-accent px-6 py-3 text-sm font-semibold text-white hover:bg-accent/90 transition-colors">Create account</Link>
            <Link to="/login" className="rounded-md border px-6 py-3 text-sm font-semibold hover:bg-muted transition-colors">Sign in</Link>
          </div>
        </section>
      </main>
    </>
  );
}
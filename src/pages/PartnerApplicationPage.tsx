import React from 'react';
import PartnerApplication from '@/components/PartnerApplication';
import MetaTags from '@/components/MetaTags';

const PartnerApplicationPage = () => {
  return (
    <div className="min-h-screen bg-muted/30 py-8">
      <MetaTags 
        title="title_partner_application"
        description="meta_partner_application"
        keywords="conservation partner, Kenya wildlife partner, eco-tourism partner, sustainable tourism, conservation organization, wildlife sanctuary, community conservancy"
      />
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-foreground mb-4">
              Partner Application
            </h1>
            <p className="text-lg text-muted-foreground">
              Join Kenya's premier conservation platform and start sharing your conservation experiences with impact-minded travelers.
            </p>
          </div>
          
          {/* Render the PartnerApplication component as a full page */}
          <PartnerApplication asPage={true} />
        </div>
      </div>
    </div>
  );
};

export default PartnerApplicationPage;
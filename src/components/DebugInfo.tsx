import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";

const DebugInfo: React.FC = () => {
  const [debugInfo, setDebugInfo] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  const collectDebugInfo = () => {
    const info = {
      currentUrl: window.location.href,
      userAgent: navigator.userAgent,
      experienceCards: document.querySelectorAll('[data-experience]').length,
      reserveButtons: document.querySelectorAll('[data-action="reserve"], .btn-reserve').length,
      bookingDrawer: !!document.querySelector('#bk-drawer'),
      partnerCarousel: !!document.querySelector('#partner-stories'),
      partnerNavButtons: document.querySelectorAll('.ps-prev, .ps-next').length,
      reactVersion: React.version,
      timestamp: new Date().toISOString()
    };
    
    setDebugInfo(JSON.stringify(info, null, 2));
  };

  useEffect(() => {
    // Only show debug in development or if URL contains debug=1
    const shouldShow = process.env.NODE_ENV === 'development' || 
                      new URLSearchParams(window.location.search).get('debug') === '1';
    setIsVisible(shouldShow);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-background border border-border rounded-lg p-4 max-w-md">
      <div className="flex items-center gap-2 mb-2">
        <h3 className="text-sm font-semibold">Debug Info</h3>
        <Button size="sm" variant="outline" onClick={collectDebugInfo}>
          Collect
        </Button>
      </div>
      {debugInfo && (
        <pre className="text-xs bg-muted p-2 rounded overflow-auto max-h-40">
          {debugInfo}
        </pre>
      )}
    </div>
  );
};

export default DebugInfo;
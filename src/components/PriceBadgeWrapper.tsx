import React, { useEffect, useRef } from 'react';
import { useCurrency } from '@/contexts/CurrencyContext';

interface PriceBadgeWrapperProps {
  price: number;
  currency?: string;
  className?: string;
}

const PriceBadgeWrapper: React.FC<PriceBadgeWrapperProps> = ({ 
  price, 
  currency = 'USD',
  className = '' 
}) => {
  const { formatPrice } = useCurrency();
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Ensure price badge styling is applied
    const wrapper = wrapperRef.current;
    if (wrapper) {
      // Check if we're on landing/booking pages and wrap in price-badge
      const isLandingPrice = wrapper.closest('.landing-experiences, .home-experiences, .featured-experiences');
      const isBookingPrice = wrapper.closest('.experience-booking, .page-experience, .checkout-page');
      
      if ((isLandingPrice || isBookingPrice) && !wrapper.querySelector('.price-badge')) {
        const span = document.createElement('span');
        span.className = 'price-badge';
        // Move existing nodes into the badge
        while (wrapper.firstChild) {
          span.appendChild(wrapper.firstChild);
        }
        wrapper.appendChild(span);
      }
    }
  }, []);

  return (
    <div ref={wrapperRef} className={`price ${className}`}>
      {formatPrice(price)}
    </div>
  );
};

export default PriceBadgeWrapper;
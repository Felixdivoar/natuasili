import React from 'react';
import { Button } from '@/components/ui/button';

interface BookingButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Simple, reliable booking button that works on all devices
 */
export default function BookingButton({ 
  onClick, 
  children, 
  disabled = false,
  variant = 'primary',
  size = 'md',
  className = ''
}: BookingButtonProps) {
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!disabled) {
      console.log('🎯 Booking button clicked successfully');
      onClick();
    }
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm min-h-[40px]',
    md: 'px-6 py-3 text-base min-h-[44px]', 
    lg: 'px-8 py-4 text-lg min-h-[48px]'
  };

  const variantClasses = {
    primary: 'bg-primary hover:bg-primary/90 text-primary-foreground',
    secondary: 'bg-secondary hover:bg-secondary/80 text-secondary-foreground border'
  };

  return (
    <Button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className={`
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        font-semibold rounded-lg transition-colors
        disabled:opacity-50 disabled:cursor-not-allowed
        touch-manipulation select-none
        ${className}
      `}
      style={{
        touchAction: 'manipulation',
        WebkitTouchCallout: 'none',
        WebkitUserSelect: 'none',
        userSelect: 'none'
      }}
    >
      {children}
    </Button>
  );
}
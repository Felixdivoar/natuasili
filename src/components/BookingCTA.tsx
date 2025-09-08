import React, { useState, useEffect } from "react";

export interface BookingCTAProps {
  onProceed: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  className?: string;
  isLoading?: boolean;
  ariaLabel?: string;
}

/**
 * Unbreakably clickable booking CTA component with semantic controls,
 * stacking guards, and runtime protection
 */
export function BookingCTA({ 
  onProceed, 
  children, 
  disabled = false,
  variant = "primary",
  size = "md",
  className = "",
  isLoading = false,
  ariaLabel = "Continue to booking"
}: BookingCTAProps) {
  const [mounted, setMounted] = useState(false);

  // SSR/Hydration safety - gate client-side mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleClick = (e: React.MouseEvent | React.TouchEvent) => {
    console.log("🎯 BookingCTA handleClick triggered", {
      eventType: e.type,
      isMobile: window.innerWidth <= 991,
      disabled,
      isLoading
    });
    
    e.preventDefault();
    e.stopPropagation();
    
    if (!disabled && !isLoading) {
      console.log("✅ Calling onProceed");
      onProceed();
    } else {
      console.log("❌ Button disabled or loading", { disabled, isLoading });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === "Enter" || e.key === " ") && !disabled && !isLoading) {
      e.preventDefault();
      onProceed();
    }
  };

  // Don't render on server-side to prevent hydration issues
  if (!mounted) {
    return null;
  }

  const sizeClasses = {
    sm: "px-4 py-2 text-sm min-h-[36px]",
    md: "px-6 py-3 text-base min-h-[44px]",
    lg: "px-8 py-4 text-lg min-h-[52px]"
  };

  const variantClasses = {
    primary: "bg-primary hover:bg-primary-hover text-primary-foreground",
    secondary: "bg-secondary hover:bg-secondary/80 text-secondary-foreground border border-border"
  };

  const baseClasses = [
    "book-now-btn",
    "font-semibold rounded-lg transition-all duration-200",
    "pointer-events-auto touch-manipulation relative",
    "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2",
    "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
    "active:scale-[0.98] transform-gpu",
    sizeClasses[size],
    variantClasses[variant],
    className
  ].filter(Boolean).join(" ");

  return (
    <button
      id="bookNowBtn"
      type="button"
      className={baseClasses}
      onClick={handleClick}
      onTouchStart={handleClick}
      onKeyDown={handleKeyDown}
      disabled={disabled || isLoading}
      aria-label={ariaLabel}
      aria-disabled={disabled || isLoading}
      data-booking-cta="true"
      style={{ 
        touchAction: 'manipulation',
        pointerEvents: 'auto',
        zIndex: 1001,
        WebkitTouchCallout: 'none',
        WebkitUserSelect: 'none',
        WebkitTapHighlightColor: 'transparent'
      }}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span>Loading...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
}

export default BookingCTA;
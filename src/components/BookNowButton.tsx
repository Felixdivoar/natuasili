import React from "react";
import { Link } from "react-router-dom";

type Props = {
  href: string;                // absolute app route or external checkout url
  label?: string;              // default "Book now"
  onTap?: () => void;          // optional analytics
  newTab?: boolean;
  className?: string;
};

export default function BookNowButton({
  href,
  label = "Book now",
  onTap,
  newTab = false,
  className = "",
}: Props) {
  const handleClick = (e: React.MouseEvent) => {
    // Don't prevent default or stop propagation - let the navigation work naturally
    onTap?.();
    console.log('🎯 BookNowButton clicked successfully');
  };

  const handlePointerDown = () => {
    // Ensures pointer devices register the interaction
    console.log('👆 BookNowButton pointer down');
  };

  const common = {
    className: `
      book-now inline-flex items-center justify-center px-5 py-3 rounded-2xl text-base font-medium
      focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black
      min-h-[44px] min-w-[44px] 
      bg-primary hover:bg-primary/90 text-primary-foreground
      font-semibold transition-colors duration-200
      touch-manipulation select-none cursor-pointer
      active:scale-[0.98] active:brightness-90
      ${className}
    `,
    onClick: handleClick,
    onPointerDown: handlePointerDown,
    'aria-label': label,
    role: "button" as const,
    style: {
      touchAction: 'manipulation' as const,
      WebkitTouchCallout: 'none' as const,
      WebkitUserSelect: 'none' as const,
      userSelect: 'none' as const,
      position: 'relative' as const,
      zIndex: 50,
      pointerEvents: 'auto' as const,
    }
  };

  const rel = newTab ? "noopener noreferrer" : undefined;
  const target = newTab ? "_blank" : undefined;

  // Use Link for internal routes, <a> for external URLs
  const isExternal = href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel');
  
  if (isExternal) {
    return (
      <a
        href={href}
        rel={rel}
        target={target}
        {...common}
      >
        {label}
      </a>
    );
  }

  return (
    <Link
      to={href}
      {...common}
    >
      {label}
    </Link>
  );
}
import React from 'react';
import { Clock, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BookingTimerProps {
  timeRemaining: number;
  formatTime: string;
  isActive: boolean;
  className?: string;
}

const BookingTimer: React.FC<BookingTimerProps> = ({
  timeRemaining,
  formatTime,
  isActive,
  className
}) => {
  if (!isActive) return null;

  const isLowTime = timeRemaining <= 120; // 2 minutes or less
  const isCritical = timeRemaining <= 60; // 1 minute or less

  return (
    <div className={cn(
      "flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium",
      isCritical 
        ? "bg-destructive/10 text-destructive border-destructive/20" 
        : isLowTime 
        ? "bg-warning/10 text-warning border-warning/20"
        : "bg-primary/10 text-primary border-primary/20",
      className
    )}>
      {isCritical ? (
        <AlertTriangle className="h-4 w-4 animate-pulse" />
      ) : (
        <Clock className="h-4 w-4" />
      )}
      <span>
        Your booking will be held for{' '}
        <span className="font-semibold">{formatTime}</span>
      </span>
    </div>
  );
};

export default BookingTimer;
// utils/time.ts
export function isSameDayBookingCutoffPassed(eatNow?: Date): boolean {
  // Compute current time in EAT (UTC+3)
  const nowUtc = new Date();
  const nowMs = nowUtc.getTime();
  const offsetMs = 3 * 60 * 60 * 1000; // EAT = UTC+3
  const eatDate = eatNow ?? new Date(nowMs + offsetMs);

  const hours = eatDate.getUTCHours(); // after shifting, use UTC hours as local-EAT hours
  const mins = eatDate.getUTCMinutes();

  // After 11:00 EAT -> cutoff hit
  return hours > 11 || (hours === 11 && mins >= 0);
}

export function isTodayInLocal(selectedISO: string, tzOffsetMinutes = 0): boolean {
  // Compare selected date (YYYY-MM-DD) to today's date in same "local" basis (we use EAT)
  const today = new Date();
  const eatMs = today.getTime() + 3 * 60 * 60 * 1000; // shift to EAT
  const eat = new Date(eatMs);
  const y = eat.getUTCFullYear();
  const m = String(eat.getUTCMonth() + 1).padStart(2, "0");
  const d = String(eat.getUTCDate()).padStart(2, "0");
  const eatYYYYMMDD = `${y}-${m}-${d}`;
  return selectedISO === eatYYYYMMDD;
}

export function isValidBookingDate(dateString: string): boolean {
  if (!dateString) return false;
  
  // Check if it matches YYYY-MM-DD format
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateString)) return false;
  
  // Check if it's a valid date
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return false;
  
  // Check if the date string matches what we get back from toISOString
  const isoString = date.toISOString().split('T')[0];
  return isoString === dateString;
}

export function formatDateForBooking(dateString: string): string | null {
  if (!dateString) return null;
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return null;
    return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD format
  } catch {
    return null;
  }
}

// Experience-specific booking rules
interface BookingRuleConfig {
  experienceSlug?: string;
  partner?: string;
  ruleType: 'default' | 'daily_cutoff' | 'short_notice' | 'recurring_monthly' | 'recurring_weekly';
  advanceHours?: number;
  cutoffHour?: number; // Hour in EAT for daily cutoff
  cutoffMinute?: number;
  recurringDay?: 'saturday' | 'wednesday';
  recurringWeek?: 'last' | 'every';
}

const BOOKING_RULES: BookingRuleConfig[] = [
  // Daily bookings with 11:00 EAT cutoff (no 2-day notice)
  { 
    experienceSlug: "meet-rothschild-giraffes-at-giraffe-nairobi-centre-with-afew", 
    ruleType: 'daily_cutoff', 
    cutoffHour: 11, 
    cutoffMinute: 0 
  },
  { 
    experienceSlug: "karura-forest-specialized-eco-tours", 
    ruleType: 'daily_cutoff', 
    cutoffHour: 11, 
    cutoffMinute: 0 
  },
  { 
    experienceSlug: "ocean-conservation-day-watamu", 
    ruleType: 'daily_cutoff', 
    cutoffHour: 11, 
    cutoffMinute: 0 
  },
  { 
    experienceSlug: "colobus-conservation-guided-eco-tours", 
    ruleType: 'daily_cutoff', 
    cutoffHour: 11, 
    cutoffMinute: 0 
  },
  
  // Ol Pejeta experiences: 24-hour notice
  { 
    partner: "Ol Pejeta Conservancy", 
    ruleType: 'short_notice', 
    advanceHours: 24 
  },
  
  // Recurring schedules - Last Saturday of every month
  { 
    experienceSlug: "dudu-walk-insect-exploration", 
    ruleType: 'recurring_monthly', 
    recurringDay: 'saturday', 
    recurringWeek: 'last' 
  },
  { 
    experienceSlug: "citizen-scientist-nairobi-park", 
    ruleType: 'recurring_monthly', 
    recurringDay: 'saturday', 
    recurringWeek: 'last' 
  },
  { 
    experienceSlug: "tree-walk-kenya-forest-heritage", 
    ruleType: 'recurring_monthly', 
    recurringDay: 'saturday', 
    recurringWeek: 'last' 
  },
  
  // Every Wednesday morning
  { 
    experienceSlug: "morning-bird-walk-nature-kenya", 
    ruleType: 'recurring_weekly', 
    recurringDay: 'wednesday', 
    recurringWeek: 'every' 
  }
];

// Helper function to get the last Saturday of a given month/year
function getLastSaturdayOfMonth(year: number, month: number): Date {
  // Get the last day of the month
  const lastDay = new Date(year, month + 1, 0);
  const lastDayOfWeek = lastDay.getDay();
  
  // Calculate how many days to subtract to get to Saturday (6)
  const daysToSubtract = (lastDayOfWeek + 1) % 7;
  const lastSaturday = new Date(year, month, lastDay.getDate() - daysToSubtract);
  
  return lastSaturday;
}

// Helper function to check if a date is the last Saturday of its month
function isLastSaturdayOfMonth(date: Date): boolean {
  if (date.getDay() !== 6) return false; // Not a Saturday
  
  const lastSaturday = getLastSaturdayOfMonth(date.getFullYear(), date.getMonth());
  return date.getDate() === lastSaturday.getDate();
}

// Helper function to check if a date is a Wednesday
function isWednesday(date: Date): boolean {
  return date.getDay() === 3;
}

function findApplicableRule(experienceSlug?: string, partner?: string): BookingRuleConfig | null {
  // First try to match by exact experience slug
  if (experienceSlug) {
    const slugRule = BOOKING_RULES.find(rule => rule.experienceSlug === experienceSlug);
    if (slugRule) return slugRule;
  }
  
  // Then try to match by partner
  if (partner) {
    const partnerRule = BOOKING_RULES.find(rule => rule.partner === partner);
    if (partnerRule) return partnerRule;
  }
  
  return null;
}

export function validateBookingDate(
  dateString: string, 
  experienceSlug?: string, 
  partner?: string
): { isValid: boolean; error?: string } {
  if (!dateString) {
    return { isValid: false, error: "Please select a booking date." };
  }
  
  if (!isValidBookingDate(dateString)) {
    return { isValid: false, error: "Please select a valid booking date." };
  }
  
  // Get current time in East African Time (EAT = UTC+3)
  const nowUtc = new Date();
  const eatOffsetMs = 3 * 60 * 60 * 1000; // EAT is UTC+3
  const nowInEAT = new Date(nowUtc.getTime() + eatOffsetMs);
  
  // Convert selected date to EAT
  const selectedDate = new Date(dateString + 'T00:00:00.000Z');
  const selectedDateEAT = new Date(selectedDate.getTime() + eatOffsetMs);
  
  // Find applicable booking rule
  const rule = findApplicableRule(experienceSlug, partner);
  
  if (!rule) {
    // Default 48-hour rule for all other experiences
    const minimumBookingTimeEAT = new Date(nowInEAT.getTime() + (48 * 60 * 60 * 1000));
    
    if (selectedDateEAT < minimumBookingTimeEAT) {
      const daysFromNow = Math.ceil((minimumBookingTimeEAT.getTime() - nowInEAT.getTime()) / (24 * 60 * 60 * 1000));
      return { 
        isValid: false, 
        error: `Bookings require a minimum 48-hour advance notice in East African Time. Please select a date at least ${daysFromNow} days from now.` 
      };
    }
    return { isValid: true };
  }
  
  switch (rule.ruleType) {
    case 'daily_cutoff': {
      // For daily bookings with same-day cutoff at specified hour in EAT
      const todayInEAT = new Date(nowInEAT.getFullYear(), nowInEAT.getMonth(), nowInEAT.getDate());
      const cutoffTimeToday = new Date(todayInEAT.getTime());
      cutoffTimeToday.setHours(rule.cutoffHour || 11, rule.cutoffMinute || 0, 0, 0);
      
      // If requesting for today and past cutoff, must book for tomorrow or later
      if (selectedDateEAT.getTime() === todayInEAT.getTime() && nowInEAT >= cutoffTimeToday) {
        const tomorrowInEAT = new Date(todayInEAT.getTime() + (24 * 60 * 60 * 1000));
        return {
          isValid: false,
          error: `Daily booking cutoff at ${rule.cutoffHour}:${String(rule.cutoffMinute || 0).padStart(2, '0')} EAT has passed. Please select ${tomorrowInEAT.toISOString().split('T')[0]} or later.`
        };
      }
      
      // Can't book for past dates
      if (selectedDateEAT < todayInEAT) {
        return {
          isValid: false,
          error: "Cannot book for past dates. Please select today or a future date."
        };
      }
      
      return { isValid: true };
    }
    
    case 'short_notice': {
      // For experiences with shorter notice periods (e.g., 24 hours for Ol Pejeta)
      const minimumBookingTime = new Date(nowInEAT.getTime() + ((rule.advanceHours || 24) * 60 * 60 * 1000));
      
      if (selectedDateEAT < minimumBookingTime) {
        const hoursRequired = rule.advanceHours || 24;
        return {
          isValid: false,
          error: `This experience requires ${hoursRequired}-hour advance notice in East African Time. Please select a later date.`
        };
      }
      return { isValid: true };
    }
    
    case 'recurring_monthly': {
      // For experiences that happen only on the last Saturday of each month
      if (rule.recurringDay === 'saturday' && rule.recurringWeek === 'last') {
        if (!isLastSaturdayOfMonth(selectedDateEAT)) {
          return {
            isValid: false,
            error: "This experience is only available on the last Saturday of each month. Please select the last Saturday of your preferred month."
          };
        }
      }
      return { isValid: true };
    }
    
    case 'recurring_weekly': {
      // For experiences that happen every Wednesday morning
      if (rule.recurringDay === 'wednesday' && rule.recurringWeek === 'every') {
        if (!isWednesday(selectedDateEAT)) {
          return {
            isValid: false,
            error: "This experience is only available on Wednesday mornings. Please select a Wednesday."
          };
        }
      }
      return { isValid: true };
    }
    
    default:
      // Fallback to default 48-hour rule
      const minimumBookingTimeEAT = new Date(nowInEAT.getTime() + (48 * 60 * 60 * 1000));
      
      if (selectedDateEAT < minimumBookingTimeEAT) {
        const daysFromNow = Math.ceil((minimumBookingTimeEAT.getTime() - nowInEAT.getTime()) / (24 * 60 * 60 * 1000));
        return { 
          isValid: false, 
          error: `Bookings require a minimum 48-hour advance notice in East African Time. Please select a date at least ${daysFromNow} days from now.` 
        };
      }
      return { isValid: true };
  }
}
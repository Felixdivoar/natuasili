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
export type Booking = { 
  title: string; 
  location?: string; 
  date: string; 
  people: number; 
  unitPriceKES: number; 
  donationKES?: number;
  currency?: string; 
};

export function makeImpactSummary(b: Booking) {
  const bookingSubtotal = b.unitPriceKES * b.people;
  const donation = b.donationKES || 0;
  const totalContribution = bookingSubtotal + donation;
  const partner = +(bookingSubtotal * 0.9 + donation).toFixed(2); // 90% of booking + 100% of donation
  const platform = +(bookingSubtotal - (bookingSubtotal * 0.9)).toFixed(2); // 10% of booking only
  
  const lines = [
    `You booked "${b.title}"${b.location ? ` in ${b.location}` : ""} for ${b.people} ${b.people === 1 ? "person" : "people"} on ${b.date}.`,
    `Total contribution: KES ${totalContribution.toLocaleString()}${donation > 0 ? ` (includes KES ${donation.toLocaleString()} donation)` : ""}.`,
    `Impact allocation: KES ${partner.toLocaleString()} to partner initiatives${donation > 0 ? ` (100% of donation goes to partner)` : ""}; KES ${platform.toLocaleString()} for platform operations.`,
  ];
  
  return {
    lines,
    numbers: { subtotal: totalContribution, partner, platform, donation }
  };
}
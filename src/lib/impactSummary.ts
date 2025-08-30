export type Booking = { 
  title: string; 
  location?: string; 
  date: string; 
  people: number; 
  unitPriceKES: number; 
  currency?: string; 
};

export function makeImpactSummary(b: Booking) {
  const subtotal = b.unitPriceKES * b.people;
  const partner = +(subtotal * 0.9).toFixed(2);
  const platform = +(subtotal - partner).toFixed(2);
  
  return {
    lines: [
      `You booked "${b.title}"${b.location ? ` in ${b.location}` : ""} for ${b.people} ${b.people === 1 ? "person" : "people"} on ${b.date}.`,
      `Total contribution: KES ${subtotal.toLocaleString()}.`,
      `Impact allocation: 90% (KES ${partner.toLocaleString()}) to partner initiatives; 10% (KES ${platform.toLocaleString()}) for platform & operations.`,
    ],
    numbers: { subtotal, partner, platform }
  };
}
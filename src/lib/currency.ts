// Supported currencies, symbols, and default base the backend content uses
export const SUPPORTED = ["KES", "USD", "EUR", "GBP"] as const;
export type Currency = (typeof SUPPORTED)[number];

export const SYMBOL: Record<Currency, string> = {
  KES: "KES",
  USD: "$",
  EUR: "€",
  GBP: "£",
};

// Choose your site's canonical/base currency for stored prices.
// If your DB prices are in KES, set to "KES". If USD, set to "USD".
export const SITE_BASE_CURRENCY: Currency = "KES";
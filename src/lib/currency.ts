export const SUPPORTED = ["KES", "USD", "EUR", "GBP"] as const;
export type Currency = (typeof SUPPORTED)[number];

export const SYMBOL: Record<Currency, string> = {
  KES: "KES",
  USD: "$",
  EUR: "€",
  GBP: "£",
};

// Your site prices are stored in KES
export const SITE_BASE_CURRENCY: Currency = "KES";
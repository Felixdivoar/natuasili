// Persist the FINAL booking snapshot so Confirmation shows the exact numbers
export type Receipt = {
  slug: string;
  date: string;
  people: number;
  optionId: "standard" | "premium";
  unitPrice: number;          // resolved unit price used to charge
  subtotal: number;           // unitPrice * people at time of booking
  donation: number;           // optional donation amount
  partner: number;            // 90% of booking + 100% of donation
  platform: number;           // 10% of booking only
  currency?: string;          // optional, if you have it
};

const KEY = "na_receipt";

export function saveReceipt(r: Receipt) {
  try { sessionStorage.setItem(KEY, JSON.stringify(r)); } catch {}
}

export function getReceipt(): Receipt | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Receipt) : null;
  } catch { return null; }
}

export function clearReceipt() {
  try { sessionStorage.removeItem(KEY); } catch {}
}
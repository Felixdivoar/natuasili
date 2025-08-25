// /src/lib/cart.ts
type Cart = {
  slug: string;
  date: string;
  people: number;
  optionId: "standard" | "premium";
};

const KEY = "na_cart";

export function saveCart(c: Cart) {
  try { sessionStorage.setItem(KEY, JSON.stringify(c)); } catch {}
}

export function getCart(): Cart | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Cart) : null;
  } catch {
    return null;
  }
}

export function clearCart() {
  try { sessionStorage.removeItem(KEY); } catch {}
}
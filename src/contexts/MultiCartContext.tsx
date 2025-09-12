import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useAuth } from "@/contexts/AuthContext";

export type MultiCartItem = {
  id: string; // local id
  experienceSlug: string;
  title: string;
  image?: string;
  date: string;
  adults: number;
  children: number;
  optionId: "standard";
  unitPrice: number; // priceKESAdult or group price
  subtotal: number;  // computed at add time
  currency: string;
  isGroupPricing?: boolean;
};

interface MultiCartContextType {
  items: MultiCartItem[];
  itemCount: number;
  total: number;
  open: boolean;
  setOpen: (v: boolean) => void;
  addItem: (item: Omit<MultiCartItem, "id" | "subtotal" | "currency"> & { currency?: string }) => void;
  removeItem: (id: string) => void;
  clear: () => void;
  sync: () => Promise<void>;
}

const MultiCartContext = createContext<MultiCartContextType | undefined>(undefined);

const STORAGE_KEY = "na_multi_cart_items";

export const MultiCartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currency } = useCurrency();
  const { user } = useAuth();
  const [items, setItems] = useState<MultiCartItem[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as MultiCartItem[]) : [];
    } catch {
      return [];
    }
  });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch {}
  }, [items]);

  // Auto sync cart when user logs in
  useEffect(() => {
    if (user) {
      void sync();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const addItem: MultiCartContextType["addItem"] = (item) => {
    const unitPrice = item.unitPrice;
    const subtotal = item.isGroupPricing ? unitPrice : (unitPrice * item.adults) + (unitPrice * (item.children));
    const id = `${item.experienceSlug}_${item.date}_${Date.now()}`;
    setItems(prev => [...prev, {
      id,
      experienceSlug: item.experienceSlug,
      title: item.title,
      image: item.image,
      date: item.date,
      adults: item.adults,
      children: item.children,
      optionId: item.optionId,
      unitPrice,
      subtotal,
      currency: item.currency || currency,
      isGroupPricing: item.isGroupPricing
    }]);
    setOpen(true);
  };

  const removeItem = (id: string) => setItems(prev => prev.filter(i => i.id !== id));
  const clear = () => setItems([]);

  const itemCount = items.length;
  const total = useMemo(() => items.reduce((sum, i) => sum + i.subtotal, 0), [items]);

  // Ensure there is an active cart, then replace items on server with local snapshot
  const sync = useCallback(async () => {
    if (!user) return;

    // 1) Ensure active cart
    const { data: existing, error: selErr } = await supabase
      .from("carts")
      .select("id, status")
      .eq("user_id", user.id)
      .eq("status", "active")
      .maybeSingle();

    if (selErr) {
      console.warn("cart select error", selErr);
      return;
    }

    let cartId = existing?.id;
    if (!cartId) {
      const { data: created, error: insErr } = await supabase
        .from("carts")
        .insert({ user_id: user.id, status: "active", currency })
        .select("id")
        .single();
      if (insErr) {
        console.warn("cart insert error", insErr);
        return;
      }
      cartId = created.id;
    }

    if (!cartId) return;

    // 2) Replace items on server
    // Simplest approach: delete and re-insert snapshot
    const { error: delErr } = await supabase
      .from("cart_items")
      .delete()
      .eq("cart_id", cartId);
    if (delErr) {
      console.warn("cart items delete error", delErr);
      // continue anyway
    }

    if (items.length === 0) return;

    const payload = items.map(i => ({
      cart_id: cartId,
      experience_slug: i.experienceSlug,
      date: i.date || null,
      adults: i.adults,
      children: i.children,
      option_id: i.optionId,
      unit_price_kes: i.unitPrice,
      subtotal_kes: i.subtotal,
    }));

    const { error: insItemsErr } = await supabase
      .from("cart_items")
      .insert(payload);
    if (insItemsErr) {
      console.warn("cart items insert error", insItemsErr);
    }
  }, [user, items, currency]);

  const value: MultiCartContextType = {
    items,
    itemCount,
    total,
    open,
    setOpen,
    addItem,
    removeItem,
    clear,
    sync,
  };

  return (
    <MultiCartContext.Provider value={value}>
      {children}
    </MultiCartContext.Provider>
  );
};

export const useMultiCart = () => {
  const ctx = useContext(MultiCartContext);
  if (!ctx) throw new Error("useMultiCart must be used within MultiCartProvider");
  return ctx;
};

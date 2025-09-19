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
  donation: number;  // optional donation amount
  currency: string;
  isGroupPricing?: boolean;
  addedAt: number; // timestamp when item was added
};

interface MultiCartContextType {
  items: MultiCartItem[];
  itemCount: number;
  total: number;
  open: boolean;
  setOpen: (v: boolean) => void;
  addItem: (item: Omit<MultiCartItem, "id" | "subtotal" | "donation" | "currency" | "addedAt"> & { currency?: string, donation?: number }) => void;
  removeItem: (id: string) => void;
  clear: () => void;
  sync: () => Promise<void>;
  isSynced: boolean;
}

const MultiCartContext = createContext<MultiCartContextType | undefined>(undefined);

const STORAGE_KEY = "na_multi_cart_items";

export const MultiCartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currency } = useCurrency();
  const { user } = useAuth();
  
  // Get user-specific storage key
  const getUserStorageKey = () => {
    return user ? `${STORAGE_KEY}_${user.id}` : STORAGE_KEY;
  };
  
  const [items, setItems] = useState<MultiCartItem[]>(() => {
    try {
      const storageKey = user ? `${STORAGE_KEY}_${user.id}` : STORAGE_KEY;
      const raw = localStorage.getItem(storageKey);
      const parsed = raw ? (JSON.parse(raw) as MultiCartItem[]) : [];
      console.log('Loaded cart from localStorage:', parsed.length, 'items', parsed.map(i => ({ id: i.id, title: i.title })));
      return parsed;
    } catch (e) {
      console.error('Failed to load cart from localStorage:', e);
      return [];
    }
  });
  const [open, setOpen] = useState(false);
  const [isSynced, setIsSynced] = useState(false);

  useEffect(() => {
    try { 
      console.log('Saving cart to localStorage:', items.length, 'items');
      const storageKey = getUserStorageKey();
      localStorage.setItem(storageKey, JSON.stringify(items)); 
    } catch (e) {
      console.error('Failed to save cart to localStorage:', e);
    }
  }, [items, user]);

  // Handle user sign in/out - load user-specific cart
  useEffect(() => {
    if (user) {
      // User signed in - load their cart from localStorage first, then from database if empty
      const userStorageKey = getUserStorageKey();
      try {
        const raw = localStorage.getItem(userStorageKey);
        const userItems = raw ? (JSON.parse(raw) as MultiCartItem[]) : [];
        console.log('Loading user-specific cart:', userItems.length, 'items');
        setItems(userItems);
        
        // Load from database if local cart is empty
        if (userItems.length === 0) {
          loadCartFromDatabase();
        }
      } catch (e) {
        console.error('Failed to load user cart from localStorage:', e);
        setItems([]);
        loadCartFromDatabase();
      }
    } else {
      // User signed out - clear cart and load guest cart
      console.log('User signed out - clearing cart');
      setItems([]);
      setIsSynced(false);
      
      // Load guest cart from localStorage
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        const guestItems = raw ? (JSON.parse(raw) as MultiCartItem[]) : [];
        console.log('Loading guest cart:', guestItems.length, 'items');
        setItems(guestItems);
      } catch (e) {
        console.error('Failed to load guest cart:', e);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const loadCartFromDatabase = useCallback(async () => {
    if (!user) return;

    const { data: cart, error: cartErr } = await supabase
      .from("carts")
      .select(`
        id,
        cart_items (
          id,
          experience_slug,
          date,
          adults,
          children,
          option_id,
          unit_price_kes,
          subtotal_kes
        )
      `)
      .eq("user_id", user.id)
      .eq("status", "active")
      .maybeSingle();

    if (cartErr) {
      console.warn("Failed to load cart from database:", cartErr);
      return;
    }

    if (cart && cart.cart_items && cart.cart_items.length > 0) {
      // Convert database items to local format
      const dbItems: MultiCartItem[] = cart.cart_items.map((item: any) => ({
        id: `db_${item.id}`,
        experienceSlug: item.experience_slug,
        title: item.experience_slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), // Basic title from slug
        date: item.date || '',
        adults: item.adults,
        children: item.children,
        optionId: item.option_id as "standard",
        unitPrice: Number(item.unit_price_kes),
        subtotal: Number(item.subtotal_kes),
        donation: 0,
        currency: currency,
        isGroupPricing: false,
        addedAt: Date.now() // Use current time for existing items
      }));

      console.log('Loading cart from database:', dbItems.length, 'items');
      
      // Merge with local items (avoid duplicates)
      setItems(prev => {
        const combined = [...prev];
        dbItems.forEach(dbItem => {
          const exists = combined.some(localItem => 
            localItem.experienceSlug === dbItem.experienceSlug &&
            localItem.date === dbItem.date &&
            localItem.adults === dbItem.adults &&
            localItem.children === dbItem.children
          );
          if (!exists) {
            combined.push(dbItem);
          }
        });
        console.log('Cart after merge:', combined.length, 'items');
        return combined;
      });
      setIsSynced(true);
    }
  }, [user, currency]);

  const addItem: MultiCartContextType["addItem"] = (item) => {
    const unitPrice = item.unitPrice;
    const subtotal = item.isGroupPricing ? unitPrice : (unitPrice * item.adults) + (unitPrice * (item.children));
    const id = `${item.experienceSlug}_${item.date}_${Date.now()}`;
    const now = Date.now();
    
    console.log('Adding item to cart:', { id, title: item.title, experienceSlug: item.experienceSlug });
    
    setItems(prev => {
      const newItems = [...prev, {
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
        donation: item.donation || 0,
        currency: item.currency || currency,
        isGroupPricing: item.isGroupPricing,
        addedAt: now
      }];
      
      console.log('Cart items after adding:', newItems.length, newItems.map(i => ({ id: i.id, title: i.title })));
      return newItems;
    });
    setIsSynced(false);
    setOpen(true);
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
    setIsSynced(false);
  };
  const clear = () => {
    setItems([]);
    setIsSynced(false);
  };

  // Auto-clear individual cart items after 10 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const tenMinutesAgo = now - (10 * 60 * 1000); // 10 minutes in milliseconds
      
      setItems(prev => {
        const filteredItems = prev.filter(item => item.addedAt > tenMinutesAgo);
        if (filteredItems.length !== prev.length) {
          console.log(`Auto-cleared ${prev.length - filteredItems.length} expired cart items`);
          setIsSynced(false);
        }
        return filteredItems;
      });
    }, 60 * 1000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  const itemCount = items.length;
  const total = useMemo(() => items.reduce((sum, i) => sum + i.subtotal + i.donation, 0), [items]);

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
    // Only delete and re-insert if we have items to sync
    if (items.length > 0) {
      const { error: delErr } = await supabase
        .from("cart_items")
        .delete()
        .eq("cart_id", cartId);
      if (delErr) {
        console.warn("cart items delete error", delErr);
        // continue anyway
      }

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
      } else {
        setIsSynced(true);
      }
    } else {
      // Clear cart items if local cart is empty
      const { error: delErr } = await supabase
        .from("cart_items")
        .delete()
        .eq("cart_id", cartId);
      if (delErr) {
        console.warn("cart items delete error", delErr);
      } else {
        setIsSynced(true);
      }
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
    isSynced,
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

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface CartItem {
  id: string;
  cart_id: string;
  experience_slug: string;
  option_id: string;
  date: string;
  adults: number;
  children: number;
  unit_price_kes: number;
  subtotal_kes: number;
}

interface Cart {
  id: string;
  user_id?: string;
  session_id?: string;
  status: string;
  currency: string;
  expires_at: string;
  items: CartItem[];
}

// Generate or get session ID for anonymous users
function getSessionId(): string {
  const stored = localStorage.getItem('cart_session');
  if (stored) {
    return stored;
  }
  
  const newSession = crypto.randomUUID();
  localStorage.setItem('cart_session', newSession);
  return newSession;
}

export function useCart() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();

  // Initialize user state and cart
  useEffect(() => {
    const initializeCart = async () => {
      try {
        // Get current user
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        setUser(currentUser);

        // Check if user is partner/admin and should not have cart access
        if (currentUser) {
          const { data: roles } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', currentUser.id);

          const hasRestrictedRole = roles?.some(r => 
            r.role === 'partner' || r.role === 'admin'
          );

          if (hasRestrictedRole) {
            setLoading(false);
            return; // Partners/admins shouldn't have cart access
          }
        }

        // Load cart
        await refreshCart();
      } catch (error) {
        console.error('Error initializing cart:', error);
        setLoading(false);
      }
    };

    initializeCart();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const newUser = session?.user ?? null;
        setUser(newUser);
        
        if (event === 'SIGNED_IN' && newUser) {
          // User just signed in - merge any anonymous cart
          await mergeAnonymousCart(newUser.id);
        }
        
        await refreshCart();
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Refresh cart data
  const refreshCart = useCallback(async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('carts')
        .select(`
          id,
          user_id,
          session_id,
          status,
          currency,
          expires_at,
          cart_items (
            id,
            cart_id,
            experience_slug,
            option_id,
            date,
            adults,
            children,
            unit_price_kes,
            subtotal_kes
          )
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1);

      if (user) {
        query = query.eq('user_id', user.id);
      } else {
        const sessionId = getSessionId();
        query = query.eq('session_id', sessionId);
      }

      const { data: carts, error } = await query;

      if (error) {
        console.error('Error fetching cart:', error);
        setCart(null);
        return;
      }

      const activeCart = carts?.[0];
      if (activeCart) {
        setCart({
          ...activeCart,
          items: activeCart.cart_items || []
        });
      } else {
        setCart(null);
      }
    } catch (error) {
      console.error('Error refreshing cart:', error);
      setCart(null);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Create a new cart
  const createCart = useCallback(async (): Promise<string | null> => {
    try {
      const cartData: any = {
        status: 'active',
        currency: 'KES',
      };

      if (user) {
        cartData.user_id = user.id;
      } else {
        cartData.session_id = getSessionId();
      }

      const { data, error } = await supabase
        .from('carts')
        .insert(cartData)
        .select()
        .single();

      if (error) throw error;

      return data.id;
    } catch (error) {
      console.error('Error creating cart:', error);
      toast({
        title: "Error",
        description: "Failed to create cart",
        variant: "destructive",
      });
      return null;
    }
  }, [user, toast]);

  // Add item to cart
  const addToCart = useCallback(async (item: Omit<CartItem, 'id' | 'cart_id'>) => {
    try {
      let cartId = cart?.id;
      
      if (!cartId) {
        cartId = await createCart();
        if (!cartId) return false;
      }

      const { error } = await supabase
        .from('cart_items')
        .insert({
          cart_id: cartId,
          ...item
        });

      if (error) throw error;

      await refreshCart();
      
      toast({
        title: "Added to cart",
        description: "Item has been added to your cart",
      });

      return true;
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      });
      return false;
    }
  }, [cart, createCart, refreshCart, toast]);

  // Remove item from cart
  const removeFromCart = useCallback(async (itemId: string) => {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;

      await refreshCart();
      
      toast({
        title: "Removed from cart",
        description: "Item has been removed from your cart",
      });

      return true;
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast({
        title: "Error",
        description: "Failed to remove item from cart",
        variant: "destructive",
      });
      return false;
    }
  }, [refreshCart, toast]);

  // Update cart item
  const updateCartItem = useCallback(async (itemId: string, updates: Partial<CartItem>) => {
    try {
      const { error } = await supabase
        .from('cart_items')
        .update(updates)
        .eq('id', itemId);

      if (error) throw error;

      await refreshCart();
      return true;
    } catch (error) {
      console.error('Error updating cart item:', error);
      toast({
        title: "Error",
        description: "Failed to update cart item",
        variant: "destructive",
      });
      return false;
    }
  }, [refreshCart, toast]);

  // Clear cart
  const clearCart = useCallback(async () => {
    if (!cart) return true;

    try {
      const { error } = await supabase
        .from('carts')
        .delete()
        .eq('id', cart.id);

      if (error) throw error;

      setCart(null);
      
      toast({
        title: "Cart cleared",
        description: "Your cart has been cleared",
      });

      return true;
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast({
        title: "Error",
        description: "Failed to clear cart",
        variant: "destructive",
      });
      return false;
    }
  }, [cart, toast]);

  // Merge anonymous cart when user signs in
  const mergeAnonymousCart = useCallback(async (userId: string) => {
    try {
      const sessionId = localStorage.getItem('cart_session');
      if (!sessionId) return;

      // Find anonymous cart
      const { data: anonymousCart } = await supabase
        .from('carts')
        .select('id')
        .eq('session_id', sessionId)
        .eq('status', 'active')
        .single();

      if (anonymousCart) {
        // Update anonymous cart to be owned by user
        await supabase
          .from('carts')
          .update({ 
            user_id: userId, 
            session_id: null 
          })
          .eq('id', anonymousCart.id);
      }
    } catch (error) {
      console.error('Error merging anonymous cart:', error);
    }
  }, []);

  // Get cart total
  const cartTotal = cart?.items.reduce((total, item) => total + item.subtotal_kes, 0) ?? 0;
  const itemCount = cart?.items.length ?? 0;

  // Check if cart is accessible (not for partners/admins)
  const canUseCart = user ? !loading : true; // Allow anonymous users, check roles for authenticated users

  return {
    cart,
    loading,
    canUseCart,
    cartTotal,
    itemCount,
    addToCart,
    removeFromCart,
    updateCartItem,
    clearCart,
    refreshCart,
  };
}
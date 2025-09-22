import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/useCart";
import { useCartActivity } from "@/hooks/useCartActivity";
import { usePayment } from "@/hooks/usePayment";
import { Turtle, Clock, Trash2, CreditCard } from "lucide-react";
import { useCurrency } from "@/contexts/CurrencyContext";
import { Skeleton } from "@/components/ui/skeleton";

export function CartDemo() {
  const { 
    cart, 
    loading, 
    canUseCart, 
    cartTotal, 
    itemCount, 
    addToCart, 
    removeFromCart, 
    clearCart 
  } = useCart();
  
  const { triggerActivity, remainingTime } = useCartActivity(cart?.id);
  const { processBookingPayment, loading: paymentLoading } = usePayment();
  const { formatPrice } = useCurrency();

  // Don't show cart for partners/admins
  if (!canUseCart) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">Cart not available for your role</p>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  const handleAddSampleItem = async () => {
    const success = await addToCart({
      experience_slug: 'sample-wildlife-experience',
      option_id: 'standard',
      date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
      adults: 2,
      children: 0,
      unit_price_kes: 5000,
      subtotal_kes: 10000
    });
    
    if (success) {
      triggerActivity(); // Reset cart expiry timer
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    await removeFromCart(itemId);
    triggerActivity();
  };

  const handleClearCart = async () => {
    await clearCart();
  };

  const formatTimeRemaining = () => {
    const remaining = remainingTime();
    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Turtle className="h-5 w-5" />
            Conservation Cart
          </div>
          {itemCount > 0 && (
            <Badge variant="secondary">{itemCount} item{itemCount !== 1 ? 's' : ''}</Badge>
          )}
        </CardTitle>
        
        {cart && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            Expires in: {formatTimeRemaining()}
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {!cart || itemCount === 0 ? (
          <div className="text-center py-6">
            <Turtle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-4">Your cart is empty</p>
            <Button onClick={handleAddSampleItem} variant="outline">
              Add Sample Item
            </Button>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="space-y-3">
              {cart.items.map((item) => (
                <div 
                  key={item.id} 
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{item.experience_slug}</h4>
                    <p className="text-xs text-muted-foreground">
                      {item.date} • {item.adults} adult{item.adults !== 1 ? 's' : ''}
                      {item.children > 0 && `, ${item.children} child${item.children !== 1 ? 'ren' : ''}`}
                    </p>
                    <p className="text-sm font-semibold">
                      {formatPrice(item.subtotal_kes)}
                    </p>
                  </div>
                  
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleRemoveItem(item.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Cart Summary */}
            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-4">
                <span className="font-semibold">Total:</span>
                <span className="font-bold text-lg">
                  {formatPrice(cartTotal)}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <Button 
                  className="w-full" 
                  disabled={paymentLoading}
                  onClick={() => {
                    // Demo checkout process
                    console.log('Demo checkout with cart total:', cartTotal);
                  }}
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  {paymentLoading ? 'Processing...' : 'Proceed to Checkout'}
                </Button>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleAddSampleItem}
                    className="flex-1"
                  >
                    Add Item
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleClearCart}
                    className="flex-1"
                  >
                    Clear Cart
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Cart Info */}
        <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
          <p>• Cart expires after 5 minutes of inactivity</p>
          <p>• Works for both logged-in and anonymous users</p>
          <p>• Partners and admins cannot access cart functionality</p>
        </div>
      </CardContent>
    </Card>
  );
}
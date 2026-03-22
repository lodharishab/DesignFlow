
"use client";

import { useState, useEffect, Suspense, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import { CategoriesNavbar } from '@/components/layout/categories-navbar';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Trash2, ShoppingCart, IndianRupee, PackageSearch, CreditCard, Loader2, KeyRound, ArrowRight, UserPlus, LogIn } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useRouter } from 'next/navigation';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useUI } from '@/contexts/ui-context';
import { getCartByUser, removeFromCart } from '@/lib/cart-db';
import type { CartItem as DBCartItem } from '@/lib/types';

const TAX_RATE = 0.18; // 18% GST
const CURRENT_CLIENT_ID = 'client001'; // Will be replaced when auth is implemented

function CartPageContent() {
  const [cartItems, setCartItems] = useState<DBCartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const { isLoggedIn } = useUI();
  const [showOtpStep, setShowOtpStep] = useState(false);
  const [otp, setOtp] = useState('');

  const loadCart = useCallback(async () => {
    try {
      setIsLoading(true);
      const items = await getCartByUser(CURRENT_CLIENT_ID);
      setCartItems(items);
    } catch (error) {
      console.error('Failed to load cart:', error);
      toast({ title: "Error", description: "Failed to load your cart. Please try again.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const handleRemoveItem = async (itemId: string) => {
    const removedItem = cartItems.find(item => item.id === itemId);
    // Optimistic update
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
    
    const success = await removeFromCart(itemId);
    if (success && removedItem) {
      toast({
        title: "Item Removed",
        description: `"${removedItem.name}" has been removed from your cart.`,
        variant: "destructive",
        duration: 3000,
      });
    } else if (!success) {
      // Revert optimistic update
      await loadCart();
      toast({
        title: "Error",
        description: "Failed to remove item. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const taxes = subtotal * TAX_RATE;
  const totalAmount = subtotal + taxes;
  const totalAmountInPaise = Math.round(totalAmount * 100); 

  const handleSimulatedPayment = () => {
    setIsProcessing(true);
    toast({
      title: "Processing Payment...",
      description: "Please wait while we confirm your order.",
    });
    
    const simulatedOrderId = 'ORD7361P'; 
    const simulatedPaymentId = `pay_SIMULATED_${Date.now()}`;

    setTimeout(() => {
      toast({
        title: "Payment Successful (Simulated)",
        description: `Your order has been placed. Order ID: ${simulatedOrderId}`,
      });
      router.push(`/order-success?orderId=${simulatedOrderId}&paymentId=${simulatedPaymentId}`);
    }, 1500);
  };
  
  const handleProceedToCheckout = () => {
      setShowOtpStep(true);
      toast({
        title: "OTP Sent (Simulated)",
        description: "An OTP has been sent to your registered mobile number for verification.",
      });
  };

  const handleVerifyOtpAndPay = () => {
    if (otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a valid 6-digit OTP.",
        variant: "destructive",
      });
      return;
    }
    handleSimulatedPayment();
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <CategoriesNavbar />
      <main className="flex-grow container mx-auto py-12 px-5">
        <div className="flex items-center justify-between mb-8">
            <div className='flex items-center'>
                <ShoppingCart className="h-8 w-8 mr-3 text-primary" />
                <h1 className="text-3xl md:text-4xl font-bold font-headline">Your Shopping Cart</h1>
            </div>
        </div>
        
        {isLoading ? (
          <Card className="text-center py-16 shadow-lg">
            <CardContent className="space-y-4">
              <Loader2 className="mx-auto h-12 w-12 text-muted-foreground animate-spin" />
              <p className="text-muted-foreground">Loading your cart...</p>
            </CardContent>
          </Card>
        ) : cartItems.length === 0 ? (
          <Card className="text-center py-16 shadow-lg">
            <CardContent className="space-y-4">
              <PackageSearch className="mx-auto h-20 w-20 text-muted-foreground opacity-50" />
              <h2 className="text-2xl font-semibold font-headline">Your cart is empty!</h2>
              <p className="text-muted-foreground">Looks like you haven't added any services yet.</p>
              <Button asChild size="lg" className="mt-4">
                <Link href="/design-services">Browse Services</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8 md:gap-12 items-start">
            <div className="lg:col-span-2 space-y-6">
              {cartItems.map(item => (
                <Card key={item.id} className="shadow-md overflow-hidden">
                  <div className="flex flex-col sm:flex-row">
                    <div className="relative sm:w-40 h-40 sm:h-auto shrink-0">
                      <Image
                        src={item.imageUrl || 'https://placehold.co/600x400.png'}
                        alt={item.name}
                        fill
                        style={{ objectFit: 'cover' }}
                        data-ai-hint={item.imageHint || 'design service'}
                        className="sm:rounded-l-lg sm:rounded-tr-none rounded-t-lg"
                      />
                    </div>
                    <div className="flex flex-grow flex-col p-4 sm:p-5">
                      <div className="flex-grow">
                        <h3 className="text-lg font-semibold font-headline">{item.name}</h3>
                        {item.tierName && (
                          <p className="text-sm text-muted-foreground">Tier: {item.tierName}</p>
                        )}
                        <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                      </div>
                      <div className="flex items-center justify-between mt-3 sm:mt-auto">
                        <p className="text-xl font-semibold text-primary">
                          <IndianRupee className="inline-block h-5 w-5 relative -top-0.5" />
                          {item.price.toLocaleString('en-IN')}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-destructive hover:bg-destructive/10 hover:text-destructive -mr-2"
                          aria-label={`Remove ${item.name} from cart`}
                          disabled={isProcessing}
                        >
                          <Trash2 className="mr-1.5 h-4 w-4" /> Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="lg:col-span-1">
              <Card className="shadow-lg sticky top-24">
                <CardHeader>
                  <CardTitle className="text-xl font-headline">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span><IndianRupee className="inline-block h-4 w-4 relative -top-px" />{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Taxes (GST {TAX_RATE * 100}%)</span>
                    <span><IndianRupee className="inline-block h-4 w-4 relative -top-px" />{taxes.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <Separator className="my-3" />
                  <div className="flex justify-between font-bold text-xl">
                    <span>Total Amount</span>
                    <span><IndianRupee className="inline-block h-5 w-5 relative -top-0.5" />{totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-3 pt-4">
                  {isLoggedIn ? (
                    showOtpStep ? (
                      <div className="w-full space-y-4">
                        <div className="space-y-2 text-left">
                          <Label htmlFor="otp" className="font-semibold">Verify to Complete Payment</Label>
                          <div className="relative">
                            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input id="otp" type="tel" placeholder="Enter 6-digit OTP" className="pl-10 tracking-widest text-center" value={otp} onChange={(e) => setOtp(e.target.value)} maxLength={6} />
                          </div>
                        </div>
                        <Button
                          size="lg"
                          className="w-full"
                          onClick={handleVerifyOtpAndPay}
                          disabled={isProcessing || otp.length !== 6}
                        >
                          {isProcessing ? (<><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Verifying...</>) : ('Verify & Pay')}
                        </Button>
                        <Button variant="link" size="sm" onClick={() => setShowOtpStep(false)} disabled={isProcessing}>Back</Button>
                      </div>
                    ) : (
                      <Button
                        size="lg"
                        className="w-full"
                        onClick={handleProceedToCheckout}
                        disabled={isProcessing || totalAmountInPaise <= 0}
                      >
                        {isProcessing ? (<><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing...</>) : (<><CreditCard className="mr-2 h-5 w-5" /> Proceed to Checkout</>)}
                      </Button>
                    )
                  ) : (
                    <div className="w-full space-y-3">
                        <Button
                            size="lg"
                            className="w-full"
                            onClick={() => router.push('/signup?redirect=/cart')}
                        >
                            <UserPlus className="mr-2 h-4 w-4" /> Sign Up to Continue
                        </Button>
                        <div className="text-center text-xs text-muted-foreground">
                            Already have an account?{' '}
                            <Link href="/login?redirect=/cart" className="text-primary hover:underline font-semibold">
                               Log In
                            </Link>
                        </div>
                    </div>
                  )}
                  
                  {!(isLoggedIn && showOtpStep) && (
                     <Button variant="outline" className="w-full mt-2" asChild disabled={isProcessing}>
                       <Link href="/design-services">Continue Shopping</Link>
                     </Button>
                  )}
                </CardFooter>
              </Card>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

function CartLoadingSkeleton() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <CategoriesNavbar />
      <main className="flex-grow container mx-auto py-12 px-5">
        <div className="h-10 w-48 bg-muted rounded animate-pulse mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="w-20 h-20 bg-muted rounded animate-pulse flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-5 w-3/4 bg-muted rounded animate-pulse" />
                      <div className="h-4 w-1/2 bg-muted rounded animate-pulse" />
                      <div className="h-4 w-1/4 bg-muted rounded animate-pulse" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="h-6 w-32 bg-muted rounded animate-pulse" />
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <div className="h-4 w-20 bg-muted rounded animate-pulse" />
                    <div className="h-4 w-16 bg-muted rounded animate-pulse" />
                  </div>
                  <div className="flex justify-between">
                    <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                    <div className="h-4 w-16 bg-muted rounded animate-pulse" />
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <div className="h-5 w-16 bg-muted rounded animate-pulse" />
                    <div className="h-5 w-20 bg-muted rounded animate-pulse" />
                  </div>
                </div>
                <div className="h-10 w-full bg-muted rounded animate-pulse mt-4" />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function CartPage() {
  return (
    <Suspense fallback={<CartLoadingSkeleton />}>
      <CartPageContent />
    </Suspense>
  )
}

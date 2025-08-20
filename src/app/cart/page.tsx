
"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import { CategoriesNavbar } from '@/components/layout/categories-navbar';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Trash2, ShoppingCart, IndianRupee, PackageSearch, CreditCard, Smartphone, Loader2, LogIn, LogOut, AlertCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useRouter } from 'next/navigation';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface CartItem {
  id: string;
  name: string;
  tierName?: string;
  price: number;
  imageUrl: string;
  imageHint: string;
  quantity: number; 
}

const initialMockCartItems: CartItem[] = [
  {
    id: '1',
    name: 'Modern Logo Design',
    tierName: 'Standard',
    price: 9999,
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'startup logo',
    quantity: 1,
  },
  {
    id: '2',
    name: 'Social Media Pack', 
    tierName: 'Basic',
    price: 2499,
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'social media graphics',
    quantity: 1,
  },
  {
    id: '4',
    name: 'UI/UX Web Design Mockup', 
    price: 15999, 
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'website design',
    quantity: 1,
  }
];

const TAX_RATE = 0.18; // 18% GST

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { toast } = useToast();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Default to logged out

  useEffect(() => {
    setCartItems(initialMockCartItems);
  }, []);

  const handleRemoveItem = (itemId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
    const removedItem = cartItems.find(item => item.id === itemId);
    if (removedItem) {
        toast({
            title: "Item Removed",
            description: `"${removedItem.name}" has been removed from your cart.`,
            variant: "destructive",
            duration: 3000,
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
    
    // Use a valid, existing Order ID from mock data for invoice page to find
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
  
  const handleCheckoutAction = () => {
    if (!isLoggedIn) {
      toast({
        title: "Login Required",
        description: "Please log in to proceed with your order.",
        variant: "destructive",
      });
      // Redirect to login page with a parameter to return to cart
      router.push('/login?redirect=/cart');
      return;
    }
    
    handleSimulatedPayment();
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <CategoriesNavbar />
      <main className="flex-grow container mx-auto py-12 px-5">
        <div className="flex items-center mb-8">
          <ShoppingCart className="h-8 w-8 mr-3 text-primary" />
          <h1 className="text-3xl md:text-4xl font-bold font-headline">Your Shopping Cart</h1>
        </div>
        
        {cartItems.length === 0 ? (
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
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        style={{ objectFit: 'cover' }}
                        data-ai-hint={item.imageHint}
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
                  <Button 
                    size="lg" 
                    className="w-full" 
                    onClick={handleCheckoutAction}
                    disabled={isProcessing || totalAmountInPaise <= 0}
                  >
                    {isProcessing ? (
                      <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing...</>
                    ) : (
                      isLoggedIn ? (
                        <><CreditCard className="mr-2 h-5 w-5" /> Proceed to Checkout</>
                      ) : (
                        <><LogIn className="mr-2 h-5 w-5" /> Login to Continue</>
                      )
                    )}
                  </Button>
                  
                  <Button variant="outline" className="w-full mt-2" asChild disabled={isProcessing}>
                    <Link href="/design-services">Continue Shopping</Link>
                  </Button>
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

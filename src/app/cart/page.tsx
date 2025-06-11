
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
import { Trash2, ShoppingCart, IndianRupee, PackageSearch, CreditCard, Smartphone } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useRouter } from 'next/navigation';

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
    imageHint: 'indian startup logo',
    quantity: 1,
  },
  {
    id: '2',
    name: 'Social Media Pack (Festive)', // "Festive" is a good descriptor, not a generic "(India)"
    tierName: 'Basic',
    price: 2499,
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'diwali social media graphics',
    quantity: 1,
  },
  {
    id: '4',
    name: 'UI/UX Web Design (E-commerce)', // "E-commerce" is a good descriptor
    price: 15999, 
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'indian e-commerce website',
    quantity: 1,
  }
];

const TAX_RATE = 0.18; // 18% GST
const RAZORPAY_TEST_KEY_ID = "rzp_test_YOUR_KEY_ID"; 

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { toast } = useToast();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

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

  const handleRazorpayPayment = async () => {
    setIsProcessing(true);
    if (typeof window.Razorpay === "undefined") {
      toast({
        title: "Error",
        description: "Razorpay SDK not loaded. Please try again in a moment.",
        variant: "destructive",
      });
      setIsProcessing(false);
      return;
    }

    const simulatedOrderId = `ORD_DESIGNFLOW_${Date.now()}`;

    const options = {
      key: RAZORPAY_TEST_KEY_ID, 
      amount: totalAmountInPaise, 
      currency: "INR",
      name: "DesignFlow India",
      description: "Design Services Order",
      image: "https://placehold.co/100x100.png?text=DF", 
      order_id: "", 
      handler: function (response: any) {
        toast({
          title: "Payment Successful (Simulated)",
          description: `Payment ID: ${response.razorpay_payment_id}. Order ID: ${simulatedOrderId}`,
        });
        router.push(`/order-success?orderId=${simulatedOrderId}&paymentId=${response.razorpay_payment_id}`);
        setIsProcessing(false);
      },
      prefill: {
        name: "Test User India", 
        email: "test.user@example.in",
        contact: "9999988888"
      },
      notes: {
        address: "DesignFlow India Office, Bangalore"
      },
      theme: {
        color: "#2081F9" 
      },
      modal: {
        ondismiss: function() {
          toast({
            title: "Payment Cancelled",
            description: "You closed the payment window.",
            variant: "destructive",
          });
          router.push(`/order-failed?orderId=${simulatedOrderId}&reason=cancelled_by_user`); 
          setIsProcessing(false);
        }
      }
    };

    try {
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response: any){
        toast({
          title: "Payment Failed (Simulated)",
          description: `Error: ${response.error.description}`,
          variant: "destructive",
        });
        router.push(`/order-failed?orderId=${simulatedOrderId}&errorCode=${response.error.code}&errorDesc=${response.error.description}`);
        setIsProcessing(false);
      });
      rzp.open();
    } catch (error) {
      console.error("Razorpay error: ", error);
      toast({
        title: "Payment Error",
        description: "Could not initiate Razorpay payment. Please check console for errors.",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  const handlePhonePePayment = () => {
    toast({
      title: "PhonePe (Coming Soon)",
      description: "PhonePe integration is currently under development.",
      duration: 3000,
    });
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
                <Link href="/services">Browse Services</Link>
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
                    onClick={handleRazorpayPayment}
                    disabled={isProcessing || totalAmountInPaise <= 0}
                  >
                    {isProcessing ? 'Processing...' : (
                      <>
                        <CreditCard className="mr-2 h-5 w-5" /> Pay with Razorpay
                      </>
                    )}
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="w-full" 
                    onClick={handlePhonePePayment}
                    disabled={isProcessing || totalAmountInPaise <= 0}
                  >
                    <Smartphone className="mr-2 h-5 w-5" /> Pay with PhonePe (Coming Soon)
                  </Button>
                  <Button variant="outline" className="w-full mt-2" asChild disabled={isProcessing}>
                    <Link href="/services">Continue Shopping</Link>
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

    
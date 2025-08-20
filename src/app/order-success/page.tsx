
"use client";

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/layout/navbar';
import { CategoriesNavbar } from '@/components/layout/categories-navbar';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, ShoppingBag, LayoutDashboard, FileText } from 'lucide-react';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const [orderId, setOrderId] = useState<string | null>(null);
  const [paymentId, setPaymentId] = useState<string | null>(null);

  useEffect(() => {
    setOrderId(searchParams.get('orderId'));
    setPaymentId(searchParams.get('paymentId'));
  }, [searchParams]);

  return (
    <main className="flex-grow container mx-auto py-12 px-5 flex flex-col items-center justify-center">
      <Card className="w-full max-w-lg shadow-xl text-center">
        <CardHeader className="items-center">
          <CheckCircle className="h-20 w-20 text-green-500 mb-4" />
          <CardTitle className="text-3xl font-bold font-headline">Payment Successful!</CardTitle>
          <CardDescription className="text-lg text-muted-foreground mt-2">
            Thank you for your order. Your design journey begins now!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {orderId && (
            <p className="text-md">
              Your Order ID: <span className="font-semibold text-primary">{orderId}</span>
            </p>
          )}
          {paymentId && (
             <p className="text-sm text-muted-foreground">
              Payment ID: {paymentId}
            </p>
          )}
          <p className="text-muted-foreground">
            You will receive an email confirmation shortly with your order details.
            You can view your invoice and manage your order from your dashboard.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-center gap-4 pt-6">
          {orderId && (
             <Button asChild size="lg">
                <Link href={`/invoice/${orderId}`}> 
                  <FileText className="mr-2 h-5 w-5" /> View Your Invoice
                </Link>
              </Button>
          )}
          <Button variant="outline" asChild size="lg">
            <Link href="/client/dashboard">
              <LayoutDashboard className="mr-2 h-5 w-5" /> Go to Dashboard
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}


export default function OrderSuccessPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <CategoriesNavbar />
      <Suspense fallback={<div className="flex-grow container mx-auto py-12 px-5 text-center">Loading...</div>}>
        <OrderSuccessContent />
      </Suspense>
      <Footer />
    </div>
  );
}

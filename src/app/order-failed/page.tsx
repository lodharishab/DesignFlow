
"use client";

import Link from 'next/link';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/layout/navbar';
import { CategoriesNavbar } from '@/components/layout/categories-navbar';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { XCircle, ShoppingCart, MessageSquare } from 'lucide-react';

function OrderFailedContent() {
  const searchParams = useSearchParams();
  const [orderId, setOrderId] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [errorDesc, setErrorDesc] = useState<string | null>(null);

  useEffect(() => {
    setOrderId(searchParams.get('orderId'));
    setErrorCode(searchParams.get('errorCode'));
    setErrorDesc(searchParams.get('errorDesc'));
  }, [searchParams]);
  
  return (
     <main className="flex-grow container mx-auto py-12 px-5 flex flex-col items-center justify-center">
      <Card className="w-full max-w-lg shadow-xl text-center">
        <CardHeader className="items-center">
          <XCircle className="h-20 w-20 text-destructive mb-4" />
          <CardTitle className="text-3xl font-bold font-headline">Payment Failed</CardTitle>
          <CardDescription className="text-lg text-muted-foreground mt-2">
            Unfortunately, we couldn't process your payment.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {orderId && (
            <p className="text-md">
              Order ID: <span className="font-semibold">{orderId}</span>
            </p>
          )}
          {errorCode && errorDesc && (
             <p className="text-sm text-destructive">
              Reason: {errorDesc} (Code: {errorCode})
            </p>
          )}
           <p className="text-muted-foreground">
            Please try again with a different payment method or contact your bank.
            If the problem persists, feel free to reach out to our support team.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-center gap-4 pt-6">
          <Button asChild size="lg">
            <Link href="/cart">
              <ShoppingCart className="mr-2 h-5 w-5" /> Try Again
            </Link>
          </Button>
          <Button variant="outline" asChild size="lg">
            {/* This should link to a proper contact page or open a support modal */}
            <Link href="/contact-support"> 
              <MessageSquare className="mr-2 h-5 w-5" /> Contact Support
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}


export default function OrderFailedPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <CategoriesNavbar />
      <Suspense fallback={<div className="flex-grow container mx-auto py-12 px-5 text-center">Loading...</div>}>
        <OrderFailedContent />
      </Suspense>
      <Footer />
    </div>
  );
}

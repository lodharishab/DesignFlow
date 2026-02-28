
"use client";

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/navbar';
import { CategoriesNavbar } from '@/components/layout/categories-navbar';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, Printer, Download, Brush, PackageSearch } from 'lucide-react';
import { getOrderById, type Order } from '@/lib/orders-db';
import { format } from 'date-fns';

function InvoiceContent() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.orderId as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      getOrderById(orderId).then(found => {
        setOrder(found);
        setIsLoading(false);
      });
    }
  }, [orderId]);
  
  const subtotal = order?.totalAmount ? order.totalAmount / 1.18 : 0;
  const tax = order?.totalAmount ? order.totalAmount - subtotal : 0;

  const handlePrint = () => {
    window.print();
  };


  if (isLoading) {
    return <div className="container mx-auto py-12 px-5 text-center">Loading invoice...</div>;
  }

  if (!order) {
    return (
      <div className="container mx-auto py-12 px-5 text-center">
        <PackageSearch className="mx-auto h-24 w-24 text-muted-foreground opacity-50" />
        <h1 className="mt-6 text-2xl font-semibold">Invoice Not Found</h1>
        <p className="mt-2 text-muted-foreground">
          The invoice for order ID: {orderId} could not be found.
        </p>
      </div>
    );
  }

  return (
    <main className="flex-grow container mx-auto py-12 px-5">
      <Card className="max-w-4xl mx-auto shadow-lg print:shadow-none print:border-none">
        <CardHeader className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Brush className="h-8 w-8 text-primary" />
              <span className="font-bold font-headline text-3xl">DesignFlow</span>
            </div>
            <p className="text-muted-foreground">Invoice #{order.id}</p>
            <p className="text-muted-foreground">Date: {format(order.orderDate, 'PPP')}</p>
          </div>
          <div className="text-left md:text-right">
            <h2 className="font-semibold text-lg">Billed To:</h2>
            <p className="text-muted-foreground">{order.clientName}</p>
            <p className="text-muted-foreground">client.email@example.com</p>
             <div className="mt-2 flex items-center gap-1 text-green-600">
                <CheckCircle className="h-5 w-5" />
                <span className="font-semibold">Paid</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Separator className="my-4" />
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service Description</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>
                  <p className="font-medium">{order.serviceName}</p>
                  <p className="text-sm text-muted-foreground">{order.serviceTier && `Tier: ${order.serviceTier}`}</p>
                </TableCell>
                <TableCell className="text-right">₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <Separator className="my-4" />
          <div className="flex justify-end">
            <div className="w-full max-w-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">GST (18%)</span>
                <span>₹{tax.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-bold text-lg">
                <span>Total Paid</span>
                <span>₹{order.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>
           <div className="mt-8 text-center text-xs text-muted-foreground">
                <p>Thank you for your business!</p>
                <p>DesignFlow | contact@designflow.com | Bangalore, India</p>
            </div>
        </CardContent>
      </Card>
      <div className="flex justify-center gap-4 mt-8 print:hidden">
          <Button onClick={handlePrint}><Printer className="mr-2 h-4 w-4" /> Print Invoice</Button>
          <Button variant="outline"><Download className="mr-2 h-4 w-4" /> Download PDF (Soon)</Button>
      </div>
    </main>
  );
}

export default function InvoicePage() {
    // Correct way to add dynamic styles for printing
    useEffect(() => {
        const style = document.createElement('style');
        style.innerHTML = `
        @media print {
            body {
            -webkit-print-color-adjust: exact;
            }
        }
        `;
        document.head.appendChild(style);
        return () => {
        document.head.removeChild(style);
        };
    }, []);

    return (
        <div className="flex flex-col min-h-screen">
            <div className="print:hidden">
                <Navbar />
                <CategoriesNavbar />
            </div>
            <Suspense fallback={<div className="flex-grow container mx-auto py-12 px-5 text-center">Loading invoice...</div>}>
                <InvoiceContent />
            </Suspense>
            <div className="print:hidden">
                <Footer />
            </div>
        </div>
    );
}

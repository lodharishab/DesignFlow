
"use client";

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, ShoppingBag, Calendar, FileText, MessageSquare, User, PackageSearch, IndianRupee, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';

// Mock data structure for an order - replace with actual data fetching
interface OrderDetail {
  id: string;
  serviceName: string;
  serviceTier?: string;
  status: string;
  orderDate: string;
  deliveryDate?: string;
  totalAmount: string;
  designerName?: string;
  briefSummary?: string;
  deliverables?: Array<{ name: string; url: string; date: string }>;
  messages?: Array<{ sender: string; text: string; date: string }>;
}

const mockOrdersData: { [key: string]: OrderDetail } = {
  'ORD7361P': {
    id: 'ORD7361P',
    serviceName: 'E-commerce Website UI/UX',
    serviceTier: 'Premium',
    status: 'In Progress',
    orderDate: '2024-07-01',
    deliveryDate: '2024-07-25',
    totalAmount: '₹24,999.00',
    designerName: 'Rohan K.',
    briefSummary: 'Modern UI/UX for Indian handicrafts e-commerce. Mobile-first, vernacular support.',
    deliverables: [{ name: 'Initial Wireframes v1.pdf', url: '#', date: '2024-07-10'}],
    messages: [
      { sender: 'Rohan K.', text: 'Hi Priya, I\'ve uploaded the initial wireframes for your review. Let me know your thoughts!', date: '2024-07-10 11:00 AM' },
      { sender: 'Priya S.', text: 'Thanks Rohan! Looking good. I have a few comments on the homepage layout.', date: '2024-07-10 03:00 PM' },
    ]
  },
  'ORD1038K': {
    id: 'ORD1038K',
    serviceName: 'Social Media Campaign Graphics',
    serviceTier: 'Standard',
    status: 'Pending Assignment',
    orderDate: '2024-07-05',
    totalAmount: '₹7,999.00',
    briefSummary: 'Engaging graphics for Diwali campaign. Traditional yet modern theme.',
  },
   'ORD2945S': {
    id: 'ORD2945S',
    serviceName: 'Startup Logo & Brand Identity',
    serviceTier: 'Premium',
    status: 'Completed',
    orderDate: '2024-06-20',
    deliveryDate: '2024-07-10',
    totalAmount: '₹19,999.00',
    designerName: 'Aisha K.',
    briefSummary: 'Brand identity for health-tech startup SwasthyaLink.',
    deliverables: [{ name: 'Final_Brand_Guidelines.pdf', url: '#', date: '2024-07-10'}, { name: 'Logo_Assets.zip', url: '#', date: '2024-07-10'}]
  }
};


export default function ClientOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.orderId as string;
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      // Simulate data fetching
      const foundOrder = mockOrdersData[orderId];
      setOrder(foundOrder || null);
      setIsLoading(false);
    }
  }, [orderId]);

  if (isLoading) {
    return <div className="container mx-auto py-12 px-5 text-center">Loading order details...</div>;
  }

  if (!order) {
    return (
      <div className="container mx-auto py-12 px-5 text-center">
        <PackageSearch className="mx-auto h-24 w-24 text-muted-foreground opacity-50" />
        <h1 className="mt-6 text-2xl font-semibold">Order Not Found</h1>
        <p className="mt-2 text-muted-foreground">
          The order (ID: {orderId}) you are looking for does not exist or you may not have access to it.
        </p>
        <Button asChild className="mt-6" onClick={() => router.back()}>
          <span>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to My Orders
          </span>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <Button variant="outline" onClick={() => router.back()} className="">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to My Orders
        </Button>
        <div className="flex items-center gap-2">
            <Button variant="secondary" asChild>
                <Link href={`/invoice/${order.id}`}>
                    <FileText className="mr-2 h-4 w-4" /> View Invoice
                </Link>
            </Button>
            {order.status === 'Completed' ? (
                <Button variant="default" asChild>
                  <Link href={`/client/review/${order.id}`}>
                    <Star className="mr-2 h-4 w-4" /> Leave a Review
                  </Link>
                </Button>
            ) : (
                <Button variant="destructive" disabled>Cancel Order</Button>
            )}
        </div>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
            <div>
                <CardTitle className="font-headline text-2xl flex items-center">
                <ShoppingBag className="mr-3 h-7 w-7 text-primary" />
                Order Details: {order.id}
                </CardTitle>
                <CardDescription>
                {order.serviceName} {order.serviceTier && `(${order.serviceTier})`}
                </CardDescription>
            </div>
            <Badge variant={order.status === 'Completed' ? 'default' : order.status === 'Pending Assignment' ? 'outline' : 'secondary'} className="text-base px-4 py-1.5 self-start sm:self-auto">
                {order.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
            <div>
              <p className="font-semibold text-muted-foreground flex items-center"><IndianRupee className="mr-1 h-4 w-4" />Total Amount</p>
              <p className="text-lg font-bold text-primary">{order.totalAmount}</p>
            </div>
            <div>
              <p className="font-semibold text-muted-foreground flex items-center"><Calendar className="mr-2 h-4 w-4" />Order Date</p>
              <p>{order.orderDate}</p>
            </div>
            {order.deliveryDate && (
              <div>
                <p className="font-semibold text-muted-foreground flex items-center"><Calendar className="mr-2 h-4 w-4" />Expected/Completed Date</p>
                <p>{order.deliveryDate}</p>
              </div>
            )}
            {order.designerName && (
              <div>
                <p className="font-semibold text-muted-foreground flex items-center"><User className="mr-2 h-4 w-4" />Designer</p>
                <p>{order.designerName}</p>
              </div>
            )}
          </div>

          {order.briefSummary && (
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold mb-2 flex items-center"><FileText className="mr-2 h-5 w-5 text-primary" />Brief Summary</h3>
                <p className="text-muted-foreground bg-secondary/50 p-3 rounded-md">{order.briefSummary}</p>
              </div>
            </>
          )}

          {order.deliverables && order.deliverables.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold mb-2 flex items-center"><PackageSearch className="mr-2 h-5 w-5 text-primary" />Deliverables</h3>
                <ul className="space-y-2">
                  {order.deliverables.map((del, index) => (
                    <li key={index} className="p-3 border rounded-md flex justify-between items-center bg-secondary/30">
                      <div>
                        <Link href={del.url} className="font-medium hover:underline text-primary">{del.name}</Link>
                        <p className="text-xs text-muted-foreground">Submitted: {del.date}</p>
                      </div>
                      <Button variant="outline" size="sm">Download</Button>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
          
          <Separator />
          <div>
             <h3 className="text-lg font-semibold mb-3 flex items-center"><MessageSquare className="mr-2 h-5 w-5 text-primary" />Communication Log</h3>
             {order.messages && order.messages.length > 0 ? (
                <div className="space-y-4 max-h-80 overflow-y-auto p-1">
                    {order.messages.map((msg, index) => (
                        <div key={index} className={`p-3 rounded-lg ${msg.sender === order.designerName ? 'bg-muted' : 'bg-primary/10 ml-auto max-w-[85%]'}`}>
                            <p className="text-xs font-semibold">{msg.sender}</p>
                            <p className="text-sm">{msg.text}</p>
                            <p className="text-xs text-muted-foreground text-right mt-1">{msg.date}</p>
                        </div>
                    ))}
                </div>
             ) : (
                <p className="text-muted-foreground italic">No messages for this order yet.</p>
             )}
              <div className="mt-4">
                <textarea className="w-full p-2 border rounded-md" rows={3} placeholder="Type your message to the designer (feature coming soon)..." disabled></textarea>
                <Button className="mt-2" disabled>Send Message</Button>
              </div>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}

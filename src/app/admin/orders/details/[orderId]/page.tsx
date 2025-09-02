

"use client";

import { useState, useEffect, type ReactElement } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ClipboardList, 
  User, 
  Brush, 
  CalendarDays, 
  IndianRupee, 
  FileText,
  Clock,
  CreditCard,
  Hash,
  Briefcase,
  MessageSquare,
  ArrowLeft,
  Edit,
  ListChecks,
  Loader2,
  Tag,
  Paperclip,
  Image as ImageIconLucide,
  Download
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";
import { format, formatDistanceToNow, isPast } from 'date-fns';
import { cn } from '@/lib/utils';
import { initialOrdersData } from '@/components/admin/orders/orders-table-view';
import type { Order } from '@/components/admin/orders/orders-table-view';

const getStatusBadgeVariant = (status: Order['status']) => {
  switch (status) {
    case 'Completed': return 'default'; 
    case 'In Progress': return 'secondary'; 
    case 'Pending Assignment': return 'outline'; 
    case 'Awaiting Client Review': return 'outline'; 
    case 'Cancelled': return 'destructive';
    case 'Refunded': return 'destructive';
    case 'Revision Requested': return 'secondary'; 
    default: return 'secondary';
  }
};

const activeOrderStatusesForDeadline: Order['status'][] = ['In Progress', 'Awaiting Client Review', 'Revision Requested'];

export default function AdminOrderDetailPage(): ReactElement {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  
  const orderId = params.orderId as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      setIsLoading(true);
      const foundOrder = initialOrdersData.find(o => o.id === orderId);
      if (foundOrder) {
        setOrder(foundOrder);
      } else {
        toast({
          title: "Error",
          description: "Order not found.",
          variant: "destructive",
          duration: 3000,
        });
        router.push('/admin/orders');
      }
      setIsLoading(false);
    }
  }, [orderId, router, toast]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2 text-muted-foreground">Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return <p>Order not found.</p>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => router.back()} className="mb-4 sm:mb-0">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Orders
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="outline"><Edit className="mr-2 h-4 w-4" />Update Status (Simulated)</Button>
          <Button><ListChecks className="mr-2 h-4 w-4" />Manage Deliverables (Simulated)</Button>
        </div>
      </div>

      <Card className="shadow-lg">
        <CardHeader className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
          <div>
            <CardTitle className="font-headline text-2xl flex items-center">
              <ClipboardList className="mr-3 h-7 w-7 text-primary" />
              Order Details: {order.id}
            </CardTitle>
            <CardDescription>
              Placed on {format(order.orderDate, 'PPPp')}
            </CardDescription>
          </div>
           <Badge variant={getStatusBadgeVariant(order.status)} className="text-base px-4 py-1.5 self-start sm:self-auto">
            {order.status}
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
            <div className="space-y-1">
              <h4 className="font-semibold text-foreground flex items-center"><User className="mr-2 h-4 w-4 text-muted-foreground"/>Client Details</h4>
              <p>Name: {order.clientName} ({order.clientId})</p>
            </div>
            <div className="space-y-1">
              <h4 className="font-semibold text-foreground flex items-center"><Brush className="mr-2 h-4 w-4 text-muted-foreground"/>Designer Details</h4>
              <p>
                Name: {order.designerName ? (
                  order.designerId ? (
                    <Link href={`/admin/designers/view/${order.designerId}`} className="text-primary hover:underline">
                      {order.designerName} ({order.designerId})
                    </Link>
                  ) : (
                    `${order.designerName} (ID not available)`
                  )
                ) : (
                  <span className="italic text-muted-foreground">Not Assigned</span>
                )}
              </p>
            </div>
             <div className="space-y-1">
              <h4 className="font-semibold text-foreground flex items-center"><FileText className="mr-2 h-4 w-4 text-muted-foreground"/>Service Details</h4>
              <p>Name: {order.serviceName} ({order.serviceId})</p>
              {order.serviceTier && (
                <p className="flex items-center"><Tag className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />Tier: {order.serviceTier}</p>
              )}
              {order.dueDate && 
                <div>
                  <p>Due Date: {format(order.dueDate, 'PPP')}</p>
                  {activeOrderStatusesForDeadline.includes(order.status) && (
                     <p className={`text-xs font-medium mt-0.5 ${isPast(order.dueDate) ? 'text-destructive' : 'text-green-600 dark:text-green-500'}`}>
                      {isPast(order.dueDate)
                        ? `Overdue by ${formatDistanceToNow(order.dueDate, { addSuffix: false })}`
                        : `Due in ${formatDistanceToNow(order.dueDate, { addSuffix: false })}`}
                    </p>
                  )}
                </div>
              }
            </div>
            <div className="space-y-1">
              <h4 className="font-semibold text-foreground flex items-center"><CreditCard className="mr-2 h-4 w-4 text-muted-foreground"/>Payment Information</h4>
              <p>Total: {order.currency} {order.totalAmount.toFixed(2)}</p>
              <p>Method: {order.paymentMethod || 'N/A'}</p>
              <p>Transaction ID: {order.transactionId || 'N/A'}</p>
            </div>
            {order.clientBrief && (
              <div className="md:col-span-2 lg:col-span-3 space-y-2">
                <h4 className="font-semibold text-foreground flex items-center"><MessageSquare className="mr-2 h-4 w-4 text-muted-foreground"/>Client Brief</h4>
                <p className="whitespace-pre-line bg-muted p-3 rounded-md text-muted-foreground">{order.clientBrief}</p>

                {order.briefAttachments && order.briefAttachments.length > 0 && (
                    <div className="pt-2">
                        <h5 className="text-sm font-semibold text-foreground mb-2 flex items-center"><Paperclip className="mr-2 h-4 w-4 text-muted-foreground"/>Client Attachments</h5>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                            {order.briefAttachments.map((file, idx) => (
                                <div key={idx} className="p-2 border rounded-md bg-background flex justify-between items-center text-sm">
                                    <div className="flex items-center gap-2 overflow-hidden">
                                        {file.type === 'image' && <ImageIconLucide className="h-4 w-4 text-muted-foreground flex-shrink-0"/>}
                                        {file.type === 'pdf' && <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0"/>}
                                        {file.type === 'file' && <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0"/>}
                                        <span className="truncate" title={file.name}>{file.name}</span>
                                    </div>
                                    <Button variant="ghost" size="icon" asChild className="h-7 w-7 flex-shrink-0">
                                        <Link href={file.url} target="_blank" rel="noopener noreferrer"><Download className="h-4 w-4"/></Link>
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
              </div>
            )}
          </div>

          <Separator className="my-8" />

          <div>
            <h3 className="text-xl font-semibold font-headline mb-4 flex items-center">
              <Clock className="mr-2 h-5 w-5 text-primary" />
              Order History & Updates
            </h3>
            {order.orderEvents.length > 0 ? (
              <ul className="space-y-6">
                {order.orderEvents.slice().reverse().map((event, index) => (
                  <li key={index} className="flex space-x-4">
                    <div className="flex flex-col items-center">
                      <div className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-full",
                        index === 0 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                      )}>
                        {index === 0 ? <ListChecks className="h-4 w-4" /> : <Hash className="h-4 w-4" />}
                      </div>
                      {index < order.orderEvents.length - 1 && (
                        <div className="h-full w-px bg-border mt-1"></div>
                      )}
                    </div>
                    <div className={cn("pb-1 flex-1", index < order.orderEvents.length -1 ? "" : "")}>
                      <p className="font-medium text-foreground">{event.event}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(event.timestamp, 'MMM d, yyyy, HH:mm:ss')} ({formatDistanceToNow(event.timestamp, { addSuffix: true })})
                        {event.actor && ` by ${event.actor}`}
                      </p>
                      {event.notes && <p className="text-xs text-muted-foreground mt-1 italic">Note: {event.notes}</p>}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No updates recorded for this order yet.</p>
            )}
          </div>
          
           {order.deliverables && order.deliverables.length > 0 && (
             <>
              <Separator className="my-8" />
              <div>
                <h3 className="text-xl font-semibold font-headline mb-4 flex items-center">
                  <Briefcase className="mr-2 h-5 w-5 text-primary" />
                  Submitted Deliverables
                </h3>
                <ul className="space-y-3">
                  {order.deliverables.map((file, idx) => (
                    <li key={idx} className="p-3 border rounded-md bg-secondary/30 flex justify-between items-center">
                      <div>
                        <Link href={file.url} target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline">
                          {file.name}
                        </Link>
                        <p className="text-xs text-muted-foreground">Submitted: {format(file.submittedAt, 'PPp')}</p>
                      </div>
                      <Button variant="outline" size="sm">Download</Button>
                    </li>
                  ))}
                </ul>
              </div>
             </>
           )}

        </CardContent>
      </Card>
    </div>
  );
}

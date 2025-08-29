

"use client";

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, ShoppingBag, Calendar, FileText, MessageSquare, User, PackageSearch, IndianRupee, Star, Users as UsersIcon, Loader2, Save, History } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { initialOrdersData, type Order as BaseOrder, PublicNoteHistoryItem } from '@/components/admin/orders/orders-table-view';
import { format, formatDistanceToNow } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';

// Mock data structure for an order - replace with actual data fetching
interface OrderDetail extends BaseOrder {}

const mockOrdersData: { [key: string]: OrderDetail } = initialOrdersData.reduce((acc, order) => {
    acc[order.id] = order;
    return acc;
}, {} as { [key: string]: OrderDetail });


export default function ClientOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.orderId as string;
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [sharedNotes, setSharedNotes] = useState('');
  const [isSavingSharedNotes, setIsSavingSharedNotes] = useState(false);

  useEffect(() => {
    if (orderId) {
      // Simulate data fetching
      const foundOrder = mockOrdersData[orderId];
      setOrder(foundOrder || null);
      setSharedNotes(foundOrder?.publicNotes || '');
      setIsLoading(false);
    }
  }, [orderId]);

  const handleSaveSharedNotes = () => {
    if (!order) return;
    setIsSavingSharedNotes(true);
    console.log("Saving shared notes for order:", order.id, { sharedNotes });
    
    const newHistoryEntry: PublicNoteHistoryItem = {
      text: sharedNotes,
      editedBy: order.clientName, // Assuming client is editing
      timestamp: new Date(),
    };

    setTimeout(() => {
      setOrder(prev => prev ? ({
        ...prev, 
        publicNotes: sharedNotes, 
        publicNotesLastEdited: new Date(),
        publicNotesHistory: [newHistoryEntry, ...(prev.publicNotesHistory || [])]
      }) : null);
      toast({ title: "Shared Notes Updated (Simulated)", description: "The shared project notes have been saved." });
      setIsSavingSharedNotes(false);
    }, 1000);
  };

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
              <p className="text-lg font-bold text-primary">₹{order.totalAmount.toLocaleString('en-IN')}</p>
            </div>
            <div>
              <p className="font-semibold text-muted-foreground flex items-center"><Calendar className="mr-2 h-4 w-4" />Order Date</p>
              <p>{format(order.orderDate, 'PPp')}</p>
            </div>
            {order.deliveryDate && (
              <div>
                <p className="font-semibold text-muted-foreground flex items-center"><Calendar className="mr-2 h-4 w-4" />Expected/Completed Date</p>
                <p>{format(new Date(order.deliveryDate), 'PPp')}</p>
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

          <Separator/>
          <SharedNotesClient order={order} sharedNotes={sharedNotes} setSharedNotes={setSharedNotes} isSaving={isSavingSharedNotes} onSave={handleSaveSharedNotes} />


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
                        <p className="text-xs text-muted-foreground">Submitted: {format(new Date(del.submittedAt), 'PPp')}</p>
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
             {order.orderEvents && order.orderEvents.length > 0 ? (
                <div className="space-y-4 max-h-80 overflow-y-auto p-1">
                    {order.orderEvents.map((msg, index) => (
                        <div key={index} className={`p-3 rounded-lg ${msg.actor === order.designerName ? 'bg-muted max-w-[85%]' : 'bg-primary/10 ml-auto max-w-[85%] text-right'}`}>
                            <p className="text-xs font-semibold">{msg.actor}</p>
                            <p className="text-sm">{msg.event}</p>
                            <p className="text-xs text-muted-foreground text-right mt-1">{format(new Date(msg.timestamp), 'PPpp')}</p>
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

function SharedNotesClient({ order, sharedNotes, setSharedNotes, isSaving, onSave }: { order: OrderDetail; sharedNotes: string; setSharedNotes: (notes: string) => void; isSaving: boolean; onSave: () => void; }) {
  const [showHistory, setShowHistory] = useState(false);
  return (
    <Card className="shadow-none border bg-secondary/30">
        <CardHeader>
            <CardTitle className="font-headline text-xl flex items-center">
                <UsersIcon className="mr-2 h-5 w-5 text-primary"/>
                Shared Project Notes
            </CardTitle>
            <CardDescription>Visible to both you and the designer. Use for important project-wide information.</CardDescription>
        </CardHeader>
        <CardContent>
            <Textarea 
                placeholder="e.g., Please use the attached logo files. Our main brand color is #0A2540."
                rows={5}
                value={sharedNotes}
                onChange={(e) => setSharedNotes(e.target.value)}
                disabled={isSaving}
            />
             {order.publicNotesLastEdited && (
                <p className="text-xs text-muted-foreground mt-2">Last updated by {order.publicNotesHistory?.[0]?.editedBy || 'N/A'} - {formatDistanceToNow(new Date(order.publicNotesLastEdited), { addSuffix: true })}</p>
             )}
        </CardContent>
        <CardFooter className="flex-wrap justify-between gap-2">
            <Button onClick={onSave} disabled={isSaving}>
                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Save className="mr-2 h-4 w-4"/>}
                {isSaving ? 'Saving...' : 'Save Shared Notes'}
            </Button>
            {order.publicNotesHistory && order.publicNotesHistory.length > 0 && (
                <Button variant="outline" onClick={() => setShowHistory(!showHistory)}>
                    {showHistory ? 'Hide History' : 'Show History'}
                </Button>
            )}
        </CardFooter>
        {showHistory && order.publicNotesHistory && (
            <CardContent className="border-t pt-4 mt-4">
                <h4 className="text-sm font-semibold mb-2">Edit History</h4>
                <ul className="space-y-3 text-xs max-h-40 overflow-y-auto">
                    {order.publicNotesHistory.map((entry, index) => (
                        <li key={index} className="border-l-2 pl-3">
                            <p className="italic text-muted-foreground whitespace-pre-line">"{entry.text}"</p>
                            <p className="font-medium mt-1">
                                by {entry.editedBy} - {formatDistanceToNow(new Date(entry.timestamp), { addSuffix: true })}
                            </p>
                        </li>
                    ))}
                </ul>
            </CardContent>
        )}
    </Card>
  )
}

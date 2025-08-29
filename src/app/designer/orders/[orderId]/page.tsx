
"use client";

import { useState, useEffect, type ReactElement, Suspense } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Briefcase, 
  User, 
  CalendarDays, 
  MessageSquare,
  ArrowLeft,
  ClipboardList,
  Paperclip,
  Send,
  Upload,
  Tag,
  ListChecks,
  Loader2,
  Info,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Eye,
  Star,
  GitPullRequest,
  IndianRupee as IndianRupeeIcon,
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";
import { format, formatDistanceToNow, isPast } from 'date-fns';
import { initialOrdersData, type Order, type OrderStatus, type OrderEvent } from '@/components/admin/orders/orders-table-view'; 
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

const MOCK_DESIGNER_ID = 'des002'; // Bob The Builder from initialOrdersData example

const getStatusBadgeVariant = (status: OrderStatus) => {
  switch (status) {
    case 'Completed': return 'default';
    case 'In Progress': return 'secondary';
    case 'Awaiting Client Review': return 'outline';
    case 'Revision Requested': return 'secondary'; 
    case 'Cancelled': return 'destructive';
    default: return 'secondary';
  }
};

const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'In Progress': return <Clock className="mr-1.5 h-4 w-4" />;
      case 'Awaiting Client Review': return <Eye className="mr-1.5 h-4 w-4" />;
      case 'Revision Requested': return <AlertTriangle className="mr-1.5 h-4 w-4 text-orange-500" />;
      case 'Completed': return <CheckCircle2 className="mr-1.5 h-4 w-4 text-green-500" />;
      default: return <Info className="mr-1.5 h-4 w-4" />;
    }
  };


function DesignerOrderDetailPageContent(): ReactElement {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  
  const orderId = params.orderId as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [isSubmittingDeliverable, setIsSubmittingDeliverable] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [deliverableDescription, setDeliverableDescription] = useState('');
  const [showRevisionModal, setShowRevisionModal] = useState(false);


  useEffect(() => {
    if (orderId) {
      setIsLoading(true);
      const foundOrder = initialOrdersData.find(o => o.id === orderId && o.designerId === MOCK_DESIGNER_ID);
      if (foundOrder) {
        setOrder({...foundOrder, orderEvents: [...foundOrder.orderEvents].sort((a,b) => b.timestamp.getTime() - a.timestamp.getTime())});
        // Check if a new revision request exceeds the limit
        if (foundOrder.status === 'Revision Requested' && foundOrder.revisionsUsed >= foundOrder.revisionsAllowed) {
            setShowRevisionModal(true);
        }
      } else {
        toast({
          title: "Error",
          description: "Order not found or not assigned to you.",
          variant: "destructive",
          duration: 3000,
        });
        router.push('/designer/orders');
      }
      setIsLoading(false);
    }
  }, [orderId, router, toast]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !order) return;
    setIsSendingMessage(true);
    const newEvent: OrderEvent = {
        timestamp: new Date(),
        event: `Message from Designer: ${newMessage}`,
        actor: order.designerName || 'Designer',
    };
    setOrder(prevOrder => prevOrder ? ({ ...prevOrder, orderEvents: [newEvent, ...prevOrder.orderEvents] }) : null);
    
    setTimeout(() => {
        setNewMessage('');
        toast({ title: "Message Sent (Simulated)", description: "Your message has been sent to the client." });
        setIsSendingMessage(false);
    }, 1000);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFileToUpload(event.target.files[0]);
    }
  };

  const handleSubmitDeliverable = () => {
    if (!fileToUpload || !deliverableDescription.trim() || !order) {
      toast({ title: "Error", description: "Please select a file and add a description.", variant: "destructive"});
      return;
    }
    setIsSubmittingDeliverable(true);
    const newDeliverable = {
        name: fileToUpload.name,
        url: '#', 
        submittedAt: new Date(),
    };
    const submissionType = order.status === 'Revision Requested' ? 'Revisions' : 'Deliverable';
    const newEvent: OrderEvent = {
        timestamp: new Date(),
        event: `${submissionType} submitted: ${fileToUpload.name} (${deliverableDescription})`,
        actor: order.designerName || 'Designer',
    };
    
    setOrder(prevOrder => prevOrder ? ({ 
        ...prevOrder, 
        deliverables: [...(prevOrder.deliverables || []), newDeliverable],
        orderEvents: [newEvent, ...prevOrder.orderEvents],
        status: 'Awaiting Client Review',
        revisionNotes: order.status === 'Revision Requested' ? undefined : prevOrder.revisionNotes,
        revisionRequestDate: order.status === 'Revision Requested' ? undefined : prevOrder.revisionRequestDate,
    }) : null);

    setTimeout(() => {
        setFileToUpload(null);
        setDeliverableDescription('');
        toast({ title: `${submissionType} Submitted (Simulated)`, description: `${fileToUpload.name} has been sent to the client for review.`});
        setIsSubmittingDeliverable(false);
    }, 1500);
  };

  const handleExtraPaymentRequest = () => {
    toast({ title: "Action Required (Simulated)", description: "A request for extra payment would be sent to the client." });
    setShowRevisionModal(false);
  };
  
  const handleContactAdmin = () => {
    toast({ title: "Action Required (Simulated)", description: "An admin would be notified to mediate this order." });
    setShowRevisionModal(false);
  };


  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2 text-muted-foreground">Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return <p>Order not found or not accessible.</p>;
  }
  
  const canSubmitDeliverables = order.status === 'In Progress' || (order.status === 'Revision Requested' && !showRevisionModal);
  const unlimitedRevisions = order.revisionsAllowed >= 99;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <Button variant="outline" onClick={() => router.back()} className="w-full md:w-auto">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to My Orders
        </Button>
        <div className="flex items-center gap-2">
            {order.status === 'Completed' && (
                <Button asChild>
                    <Link href={`/designer/review/${order.id}`}>
                        <Star className="mr-2 h-4 w-4"/> Leave Review
                    </Link>
                </Button>
            )}
             <Badge variant={getStatusBadgeVariant(order.status)} className="text-base px-4 py-2 self-start md:self-center">
                {getStatusIcon(order.status)}
                {order.status}
            </Badge>
        </div>
      </div>

      <Card className="shadow-lg">
        <CardHeader className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
          <div>
            <CardTitle className="font-headline text-2xl flex items-center">
              <Briefcase className="mr-3 h-7 w-7 text-primary" />
              Order: {order.id}
            </CardTitle>
            <CardDescription>
              Service: {order.serviceName} {order.serviceTier && `(${order.serviceTier})`}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
            <div className="space-y-1">
              <h4 className="font-semibold text-foreground flex items-center"><User className="mr-2 h-4 w-4 text-muted-foreground"/>Client Details</h4>
              <p>Name: {order.clientName} ({order.clientId})</p>
            </div>
            <div className="space-y-1">
              <h4 className="font-semibold text-foreground flex items-center"><CalendarDays className="mr-2 h-4 w-4 text-muted-foreground"/>Key Dates</h4>
              <p>Ordered: {format(order.orderDate, 'PPp')}</p>
              {order.dueDate && 
                <div>
                  <p>Due: {format(order.dueDate, 'PPp')}</p>
                  {order.status !== 'Completed' && order.status !== 'Cancelled' && (
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
                <h4 className="font-semibold text-foreground flex items-center"><GitPullRequest className="mr-2 h-4 w-4 text-muted-foreground"/>Revisions</h4>
                <p>{unlimitedRevisions ? `Unlimited Revisions` : `${order.revisionsUsed} of ${order.revisionsAllowed} used`}</p>
            </div>
            {order.serviceScope && order.serviceScope.length > 0 && (
                <div className="md:col-span-2 lg:col-span-3 space-y-1">
                    <h4 className="font-semibold text-foreground flex items-center"><ListChecks className="mr-2 h-4 w-4 text-muted-foreground"/>Service Scope</h4>
                    <ul className="list-disc list-inside pl-1 space-y-0.5 text-muted-foreground columns-1 sm:columns-2">
                        {order.serviceScope.map((item, idx) => <li key={idx}>{item}</li>)}
                    </ul>
                </div>
            )}
          </div>
          
          {order.clientBrief && (
            <>
              <Separator />
              <div className="space-y-2">
                <h4 className="font-semibold text-foreground flex items-center"><ClipboardList className="mr-2 h-4 w-4 text-muted-foreground"/>Client Brief</h4>
                <p className="whitespace-pre-line bg-muted p-4 rounded-md text-muted-foreground">{order.clientBrief}</p>
              </div>
            </>
          )}
           {order.status === 'Revision Requested' && order.revisionNotes && !showRevisionModal && (
            <>
              <Separator />
              <Card className="bg-destructive/10 border-destructive/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-headline flex items-center text-destructive">
                    <AlertTriangle className="mr-2 h-5 w-5" /> Client Revision Request
                  </CardTitle>
                  {order.revisionRequestDate && (
                    <CardDescription className="text-xs text-destructive/80">
                        Requested on: {format(order.revisionRequestDate, 'PPp')}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-line text-destructive/90">{order.revisionNotes}</p>
                </CardContent>
              </Card>
            </>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={showRevisionModal} onOpenChange={setShowRevisionModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center">
              <AlertTriangle className="mr-2 h-6 w-6 text-orange-500" />
              Revision Limit Exceeded
            </AlertDialogTitle>
            <AlertDialogDescription>
              The client has requested a revision, but the included {order.revisionsAllowed} revision(s) for this tier have already been used. Please choose how to proceed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4 space-y-2">
            <p className="font-semibold">Client's Request:</p>
            <blockquote className="border-l-2 pl-4 italic text-muted-foreground">
                {order.revisionNotes || "No specific notes provided."}
            </blockquote>
          </div>
          <AlertDialogFooter>
            <Button variant="outline" onClick={handleContactAdmin}>
              Contact Admin to Mediate
            </Button>
            <Button onClick={handleExtraPaymentRequest}>
              <IndianRupeeIcon className="mr-2 h-4 w-4" /> Request Extra Payment
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="grid lg:grid-cols-2 gap-8">
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle className="font-headline text-xl flex items-center"><Upload className="mr-2 h-5 w-5 text-primary"/>
                {order.status === 'Revision Requested' ? 'Submit Revisions' : 'Submit Deliverables'}
                </CardTitle>
                {order.status === 'Awaiting Client Review' && <CardDescription className="text-green-600">Deliverable(s) submitted. Waiting for client review.</CardDescription>}
                {(order.status === 'Completed' || order.status === 'Cancelled' || showRevisionModal) && <CardDescription className="text-muted-foreground">This order is not currently awaiting a submission.</CardDescription>}
            </CardHeader>
            {canSubmitDeliverables && (
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="deliverableFile">Upload File</Label>
                        <Input id="deliverableFile" type="file" onChange={handleFileChange} disabled={isSubmittingDeliverable}/>
                        {fileToUpload && <p className="text-xs text-muted-foreground">Selected: {fileToUpload.name}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="deliverableDescription">Description/Notes for Client</Label>
                        <Textarea 
                            id="deliverableDescription" 
                            value={deliverableDescription}
                            onChange={(e) => setDeliverableDescription(e.target.value)}
                            placeholder="e.g., First draft of logo concepts, Version 2 with color variations..."
                            rows={3}
                            disabled={isSubmittingDeliverable}
                        />
                    </div>
                    <Button 
                        onClick={handleSubmitDeliverable} 
                        disabled={isSubmittingDeliverable || !fileToUpload || !deliverableDescription.trim()}
                        className="w-full"
                    >
                        {isSubmittingDeliverable ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Paperclip className="mr-2 h-4 w-4" />}
                        {isSubmittingDeliverable ? 'Submitting...' : 'Submit to Client'}
                    </Button>
                </CardContent>
            )}
            {order.deliverables && order.deliverables.length > 0 && (
                <CardContent className={canSubmitDeliverables ? "pt-4" : ""}>
                    <Separator className={canSubmitDeliverables ? "mb-4" : "hidden"} />
                    <h5 className="text-sm font-medium text-muted-foreground mb-2">Submission History:</h5>
                    <ul className="space-y-2 text-xs max-h-40 overflow-y-auto">
                        {order.deliverables.map((file, idx) => (
                        <li key={idx} className="p-2 border rounded-md bg-secondary/50 flex justify-between items-center">
                            <span>{file.name} ({format(file.submittedAt, 'PPp')})</span>
                            <Button variant="ghost" size="xs" asChild><Link href={file.url} target="_blank">Download</Link></Button>
                        </li>
                        ))}
                    </ul>
                </CardContent>
            )}
        </Card>

        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle className="font-headline text-xl flex items-center"><MessageSquare className="mr-2 h-5 w-5 text-primary"/>Communication Log</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="newMessage">Send a Message to Client</Label>
                    <Textarea 
                        id="newMessage" 
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message here..."
                        rows={3}
                        disabled={isSendingMessage || order.status === 'Completed' || order.status === 'Cancelled'}
                    />
                </div>
                <Button onClick={handleSendMessage} disabled={isSendingMessage || !newMessage.trim() || order.status === 'Completed' || order.status === 'Cancelled'} className="w-full">
                    {isSendingMessage ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                    {isSendingMessage ? 'Sending...' : 'Send Message'}
                </Button>
                
                <Separator className="my-4" />
                <h5 className="text-sm font-medium text-muted-foreground mb-2">Message History:</h5>
                <div className="max-h-60 overflow-y-auto space-y-3 pr-2">
                    {order.orderEvents.length > 0 ? (
                        order.orderEvents.map((event, index) => (
                        <div key={index} className={cn(
                            "p-2.5 rounded-lg text-xs break-words",
                            event.actor === (order.designerName || 'Designer') ? "bg-primary/10 text-primary-foreground ml-auto max-w-[85%]" : "bg-muted text-muted-foreground mr-auto max-w-[85%]",
                             (event.actor === (order.designerName || 'Designer') ? "self-end text-right" : "self-start text-left")
                        )}>
                            <p className="font-medium">
                                {event.event}
                            </p>
                            <p className="text-xs opacity-80 mt-0.5">
                            {event.actor || 'System'} - {format(event.timestamp, 'MMM d, HH:mm')} ({formatDistanceToNow(event.timestamp, { addSuffix: true })})
                            </p>
                             {event.notes && <p className="text-xs mt-1 italic">Note: {event.notes}</p>}
                        </div>
                        ))
                    ) : (
                        <p className="text-xs text-muted-foreground italic">No messages or updates yet.</p>
                    )}
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function DesignerOrderDetailWrapper(): ReactElement {
    return (
        <Suspense fallback={<div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /><p className="ml-2 text-muted-foreground">Loading order...</p></div>}>
            <DesignerOrderDetailPageContent />
        </Suspense>
    )
}

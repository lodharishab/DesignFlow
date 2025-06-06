
"use client";

import { useState, type ReactElement, useEffect, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  ClipboardList, 
  MoreHorizontal, 
  User, 
  Brush, 
  CalendarDays, 
  IndianRupee, 
  Edit3,
  FileText,
  Clock,
  CreditCard,
  Eye,
  Filter,
  CheckCircle2,
  Loader2,
  AlertTriangle,
  XCircle as XCircleIcon, // Renamed to avoid conflict if any
  Archive
} from 'lucide-react';
import Link from 'next/link';
import { useToast } from "@/hooks/use-toast";
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

type OrderStatus = 'Pending Assignment' | 'In Progress' | 'Awaiting Client Review' | 'Revision Requested' | 'Completed' | 'Cancelled' | 'Refunded';

interface OrderEvent {
  timestamp: Date;
  event: string;
  actor?: string;
  notes?: string;
}

interface Order {
  id: string;
  clientName: string;
  clientId: string;
  designerName?: string;
  designerId?: string;
  serviceName: string;
  serviceId: string;
  serviceTier?: string;
  orderDate: Date;
  dueDate?: Date;
  status: OrderStatus;
  totalAmount: number;
  currency: string;
  paymentMethod?: string;
  transactionId?: string;
  orderEvents: OrderEvent[];
  clientBrief?: string;
  deliverables?: { name: string, url: string, submittedAt: Date }[];
}

const initialOrdersData: Order[] = [
  { 
    id: 'order001', 
    clientName: 'Alice Johnson', clientId: 'cli001', 
    designerName: 'Bob The Builder', designerId: 'des002',
    serviceName: 'Modern Logo Design', serviceId: 'svc001', serviceTier: 'Standard',
    orderDate: new Date(2024, 5, 1, 10, 30), 
    dueDate: new Date(2024, 5, 15),
    status: 'In Progress', 
    totalAmount: 199, currency: 'INR',
    paymentMethod: 'Razorpay',
    transactionId: 'pay_Nlcftg87sHjkl',
    orderEvents: [
      { timestamp: new Date(2024, 5, 1, 10, 30), event: 'Order Placed', actor: 'Alice Johnson' },
      { timestamp: new Date(2024, 5, 1, 11, 0), event: 'Payment Successful (Razorpay)', actor: 'System' },
      { timestamp: new Date(2024, 5, 2, 9, 0), event: 'Designer Assigned: Bob The Builder', actor: 'Admin' },
      { timestamp: new Date(2024, 5, 2, 9, 5), event: 'Status changed to In Progress', actor: 'System' },
      { timestamp: new Date(2024, 5, 10, 17, 0), event: 'First draft submitted by designer.', actor: 'Bob The Builder', notes: 'Attached logo_concept_v1.zip' },
      { timestamp: new Date(2024, 5, 11, 10, 0), event: 'Client requested revisions.', actor: 'Alice Johnson', notes: 'Needs more color options.' },
      { timestamp: new Date(2024, 5, 11, 10, 5), event: 'Status changed to Revision Requested', actor: 'System' },
      { timestamp: new Date(2024, 5, 12, 14,0), event: 'Revised draft submitted by designer.', actor: 'Bob The Builder', notes: 'logo_concept_v2.zip attached with new color palettes.' },
      { timestamp: new Date(2024, 5, 12, 14,5), event: 'Status changed to Awaiting Client Review', actor: 'System' },
    ],
    clientBrief: "Looking for a minimalist logo for a new tech startup 'InnovateX'. Colors: prefer blues and silvers. Icon should represent innovation and connection. Modern and sleek feel.",
    deliverables: [
      { name: 'logo_concept_v1.zip', url: '#', submittedAt: new Date(2024, 5, 10, 17, 0)},
      { name: 'logo_concept_v2.zip', url: '#', submittedAt: new Date(2024, 5, 12, 14, 0)},
    ]
  },
  { 
    id: 'order002', 
    clientName: 'Charlie Brown', clientId: 'cli003', 
    serviceName: 'Social Media Post Pack', serviceId: 'svc002', serviceTier: 'Basic',
    orderDate: new Date(2024, 5, 5, 14, 0), 
    status: 'Pending Assignment', 
    totalAmount: 99, currency: 'INR',
    paymentMethod: 'PhonePe',
    transactionId: 'txn_GhtrDEWAq789',
     orderEvents: [
      { timestamp: new Date(2024, 5, 5, 14, 0), event: 'Order Placed', actor: 'Charlie Brown' },
      { timestamp: new Date(2024, 5, 5, 14, 5), event: 'Payment Successful (PhonePe)', actor: 'System' },
      { timestamp: new Date(2024, 5, 5, 14, 10), event: 'Status changed to Pending Assignment', actor: 'System' },
    ],
    clientBrief: "Need 5 engaging posts for a summer sale campaign on Instagram and Facebook. Theme: Bright and sunny. Target audience: Young adults (18-25)."
  },
  { 
    id: 'order003', 
    clientName: 'Diana Prince', clientId: 'cli004',
    designerName: 'Alice Wonderland', designerId: 'des001',
    serviceName: 'UI/UX Web Design Mockup', serviceId: 'svc004', serviceTier: 'Premium',
    orderDate: new Date(2024, 4, 20, 16, 45), 
    dueDate: new Date(2024, 5, 10),
    status: 'Completed', 
    totalAmount: 399, currency: 'INR',
    paymentMethod: 'Razorpay',
    transactionId: 'pay_Mnbvcxz87Uyt',
    orderEvents: [ /* ... events ... */ ],
    clientBrief: "Design a modern and clean homepage mockup for an e-commerce store selling eco-friendly products.",
    deliverables: [{ name: 'Homepage_mockup_final.fig', url: '#', submittedAt: new Date(2024, 5, 8, 12, 0)}],
  },
  { 
    id: 'order004', 
    clientName: 'Edward Scissorhands', clientId: 'cli005',
    serviceName: 'Custom Illustration', serviceId: 'svc005', serviceTier: 'Standard',
    orderDate: new Date(2024, 5, 8, 9, 15), 
    status: 'Cancelled', 
    totalAmount: 149, currency: 'INR',
    paymentMethod: 'Razorpay',
    transactionId: 'pay_Lkjhgf56Qwe',
    orderEvents: [ /* ... events ... */ ]
  },
   { 
    id: 'order005', 
    clientName: 'Fiona Gallagher', clientId: 'cli006',
    designerName: 'Carol Danvers', designerId: 'des003',
    serviceName: 'Professional Brochure Design', serviceId: 'svc003', serviceTier: 'Standard',
    orderDate: new Date(2024, 5, 10, 11, 20), 
    dueDate: new Date(2024, 5, 25),
    status: 'Awaiting Client Review', 
    totalAmount: 249, currency: 'INR',
    paymentMethod: 'PhonePe',
    transactionId: 'txn_Poiuyt09Mnb',
    orderEvents: [ /* ... events ... */ ],
    deliverables: [ { name: 'brochure_draft_v1.pdf', url: '#', submittedAt: new Date(2024, 5, 18, 17, 0)} ]
  },
];


const statusFilters: { label: string; value: OrderStatus | 'All'; icon: React.ElementType }[] = [
  { label: 'All Orders', value: 'All', icon: ClipboardList },
  { label: 'Pending Assignment', value: 'Pending Assignment', icon: Loader2 },
  { label: 'In Progress', value: 'In Progress', icon: Clock },
  { label: 'Awaiting Review', value: 'Awaiting Client Review', icon: Eye },
  { label: 'Completed', value: 'Completed', icon: CheckCircle2 },
  { label: 'Cancelled', value: 'Cancelled', icon: XCircleIcon },
];


export default function AdminOrdersPage(): ReactElement {
  const [allOrders, setAllOrders] = useState<Order[]>(initialOrdersData);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'All'>('All');
  const { toast } = useToast();

  const displayedOrders = useMemo(() => {
    return allOrders.filter(order => 
      statusFilter === 'All' || order.status === statusFilter
    );
  }, [allOrders, statusFilter]);

  const getStatusBadgeVariant = (status: OrderStatus) => {
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
  
  const handleUpdateStatus = (orderId: string, newStatus: OrderStatus) => {
    setAllOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
    toast({
      title: "Order Status Updated (Simulated)",
      description: `Order ${orderId} status changed to ${newStatus}.`,
      duration: 3000,
    });
  };


  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-headline flex items-center">
          <ClipboardList className="mr-3 h-8 w-8 text-primary" />
          Manage Orders
        </h1>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>All Customer Orders</CardTitle>
          <CardDescription>View, track, and manage all orders placed on the platform. Status updates are simulated.</CardDescription>
          <div className="pt-4 flex flex-wrap gap-2">
            {statusFilters.map(filter => (
              <Button
                key={filter.value}
                variant={statusFilter === filter.value ? 'default' : 'outline'}
                onClick={() => setStatusFilter(filter.value)}
                size="sm"
                className="text-xs sm:text-sm"
              >
                <filter.icon className={cn("mr-1.5 h-3.5 w-3.5 sm:mr-2 sm:h-4 sm:w-4", filter.value === 'Pending Assignment' && 'animate-spin')} />
                {filter.label}
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Order ID</TableHead>
                <TableHead><User className="inline-block mr-1 h-4 w-4 text-muted-foreground" />Client</TableHead>
                <TableHead><FileText className="inline-block mr-1 h-4 w-4 text-muted-foreground" />Service</TableHead>
                <TableHead><CalendarDays className="inline-block mr-1 h-4 w-4 text-muted-foreground" />Order Date</TableHead>
                <TableHead><Clock className="inline-block mr-1 h-4 w-4 text-muted-foreground" />Status</TableHead>
                <TableHead><Brush className="inline-block mr-1 h-4 w-4 text-muted-foreground" />Designer</TableHead>
                <TableHead className="text-right"><IndianRupee className="inline-block mr-1 h-4 w-4 text-muted-foreground" />Total</TableHead>
                <TableHead className="text-right w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayedOrders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center h-24">
                    No orders match the current filter.
                  </TableCell>
                </TableRow>
              )}
              {displayedOrders.map(order => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">
                    <Link href={`/admin/orders/details/${order.id}`} className="text-primary hover:underline">
                      {order.id}
                    </Link>
                  </TableCell>
                  <TableCell>{order.clientName}</TableCell>
                  <TableCell className="max-w-[200px] truncate" title={`${order.serviceName} ${order.serviceTier ? `(Tier: ${order.serviceTier})` : ''}`}>
                    {order.serviceName} {order.serviceTier ? <span className="text-xs text-muted-foreground">(Tier: {order.serviceTier})</span> : ''}
                  </TableCell>
                  <TableCell>{format(order.orderDate, 'MMM d, yyyy, p')}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(order.status)}>{order.status}</Badge>
                  </TableCell>
                  <TableCell>
                    {order.designerId && order.designerName ? (
                      <Link href={`/admin/designers/edit/${order.designerId}`} className="text-primary hover:underline">
                        {order.designerName}
                      </Link>
                    ) : (
                      <span className="text-muted-foreground italic">N/A</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">₹{order.totalAmount.toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/orders/details/${order.id}`} className="flex items-center">
                            <Eye className="mr-2 h-4 w-4" /> View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem disabled> <Edit3 className="mr-2 h-4 w-4" /> Assign Designer</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleUpdateStatus(order.id, 'In Progress')}>Set to In Progress</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleUpdateStatus(order.id, 'Completed')}>Set to Completed</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleUpdateStatus(order.id, 'Cancelled')} className="text-destructive">Cancel Order</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
    

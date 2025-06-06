
"use client";

import { useState, type ReactElement, useEffect, useMemo, Fragment } from 'react'; // Added Fragment
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
  Eye,
  CheckCircle2,
  Loader2,
  XCircle as XCircleIcon, 
  Tag,
  ChevronDown, 
  ChevronUp, 
  ListChecks
} from 'lucide-react'; // Added ChevronDown, ChevronUp, ListChecks
import Link from 'next/link';
import { useToast } from "@/hooks/use-toast";
import { format, formatDistanceToNow, isPast } from 'date-fns';
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
  serviceScope?: string[]; // Added for expandable details
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
    serviceScope: ['3 Initial concepts', '3 Rounds of revisions', 'Full vector files (AI, EPS, SVG, PNG, JPG)', 'Basic brand guide (colors, fonts)'],
    orderDate: new Date(2024, 5, 1, 10, 30), 
    dueDate: new Date(new Date().setDate(new Date().getDate() + 3)), 
    status: 'In Progress', 
    totalAmount: 199, currency: 'INR',
    paymentMethod: 'Razorpay',
    transactionId: 'pay_Nlcftg87sHjkl',
    orderEvents: [ /* ... */ ],
    clientBrief: "Looking for a minimalist logo for a new tech startup 'InnovateX'.",
    deliverables: [ /* ... */ ]
  },
  { 
    id: 'order002', 
    clientName: 'Charlie Brown', clientId: 'cli003', 
    serviceName: 'Social Media Post Pack', serviceId: 'svc002', serviceTier: 'Basic',
    serviceScope: ['5 social media posts', '1 Platform choice', '1 Round of revisions', 'Optimized JPG/PNG'],
    orderDate: new Date(2024, 5, 5, 14, 0), 
    dueDate: new Date(new Date().setDate(new Date().getDate() - 2)), 
    status: 'In Progress', 
    totalAmount: 99, currency: 'INR',
    paymentMethod: 'PhonePe',
    transactionId: 'txn_GhtrDEWAq789',
    orderEvents: [ /* ... */ ],
    clientBrief: "Need 5 engaging posts for a summer sale."
  },
  { 
    id: 'order003', 
    clientName: 'Diana Prince', clientId: 'cli004',
    designerName: 'Alice Wonderland', designerId: 'des001',
    serviceName: 'UI/UX Web Design Mockup', serviceId: 'svc004', serviceTier: 'Premium',
    serviceScope: ['Up to 3 key pages UI/UX design', 'Mobile, tablet, and desktop views', 'Interactive prototype (clickable)', '3 revision rounds', 'Component style guide', 'Figma/XD source files'],
    orderDate: new Date(2024, 4, 20, 16, 45), 
    dueDate: new Date(2024, 5, 10),
    status: 'Completed', 
    totalAmount: 399, currency: 'INR',
    paymentMethod: 'Razorpay',
    transactionId: 'pay_Mnbvcxz87Uyt',
    orderEvents: [ /* ... */ ],
  },
  { 
    id: 'order004', 
    clientName: 'Edward Scissorhands', clientId: 'cli005',
    serviceName: 'Custom Illustration', serviceId: 'svc005', serviceTier: 'Standard',
    serviceScope: ['1 custom illustration (e.g., character, small scene)', 'Medium detail', '3 revision rounds', 'Source file (AI, PSD, or other)', 'Commercial use license'],
    orderDate: new Date(2024, 5, 8, 9, 15), 
    status: 'Cancelled', 
    totalAmount: 149, currency: 'INR',
    paymentMethod: 'Razorpay',
    transactionId: 'pay_Lkjhgf56Qwe',
    orderEvents: [ /* ... */ ]
  },
   { 
    id: 'order005', 
    clientName: 'Fiona Gallagher', clientId: 'cli006',
    designerName: 'Carol Danvers', designerId: 'des003',
    serviceName: 'Professional Brochure Design', serviceId: 'svc003', serviceTier: 'Standard',
    serviceScope: ['Custom brochure design (up to 6 panels)', 'Stock imagery included (up to 3 images)', '3 revision rounds', 'Print-ready PDF'],
    orderDate: new Date(2024, 5, 10, 11, 20), 
    dueDate: new Date(new Date().setDate(new Date().getDate() + 7)), 
    status: 'Awaiting Client Review', 
    totalAmount: 249, currency: 'INR',
    paymentMethod: 'PhonePe',
    transactionId: 'txn_Poiuyt09Mnb',
    orderEvents: [ /* ... */ ],
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
  const [expandedOrderIds, setExpandedOrderIds] = useState<Set<string>>(new Set());

  const displayedOrders = useMemo(() => {
    return allOrders.filter(order => 
      statusFilter === 'All' || order.status === statusFilter
    ).sort((a,b) => b.orderDate.getTime() - a.orderDate.getTime()); 
  }, [allOrders, statusFilter]);

  const toggleExpandOrder = (orderId: string) => {
    setExpandedOrderIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

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
        order.id === orderId ? { ...order, status: newStatus, 
          orderEvents: [...order.orderEvents, { timestamp: new Date(), event: `Status changed to ${newStatus}`, actor: 'Admin' }]
        } : order
      )
    );
    toast({
      title: "Order Status Updated (Simulated)",
      description: `Order ${orderId} status changed to ${newStatus}.`,
      duration: 3000,
    });
  };

  const activeOrderStatusesForDeadline: OrderStatus[] = ['In Progress', 'Awaiting Client Review', 'Revision Requested'];


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
                <TableHead className="w-[50px]"></TableHead> 
                <TableHead className="w-[100px]">Order ID</TableHead>
                <TableHead><User className="inline-block mr-1 h-4 w-4 text-muted-foreground" />Client</TableHead>
                <TableHead><FileText className="inline-block mr-1 h-4 w-4 text-muted-foreground" />Service</TableHead>
                <TableHead><CalendarDays className="inline-block mr-1 h-4 w-4 text-muted-foreground" />Date / Deadline</TableHead>
                <TableHead><Clock className="inline-block mr-1 h-4 w-4 text-muted-foreground" />Status</TableHead>
                <TableHead><Brush className="inline-block mr-1 h-4 w-4 text-muted-foreground" />Designer</TableHead>
                <TableHead className="text-right"><IndianRupee className="inline-block mr-1 h-4 w-4 text-muted-foreground" />Total</TableHead>
                <TableHead className="text-right w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayedOrders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} className="text-center h-24"> {/* Adjusted colSpan */}
                    No orders match the current filter.
                  </TableCell>
                </TableRow>
              )}
              {displayedOrders.map(order => (
                <Fragment key={order.id}>
                  <TableRow>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => toggleExpandOrder(order.id)} aria-label={expandedOrderIds.has(order.id) ? "Collapse details" : "Expand details"}>
                        {expandedOrderIds.has(order.id) ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </Button>
                    </TableCell>
                    <TableCell className="font-medium">
                      <Link href={`/admin/orders/details/${order.id}`} className="text-primary hover:underline">
                        {order.id}
                      </Link>
                    </TableCell>
                    <TableCell>{order.clientName}</TableCell>
                    <TableCell>
                      <div>{order.serviceName}</div>
                      {order.serviceTier && (
                        <div className="text-xs text-muted-foreground flex items-center">
                          <Tag className="mr-1 h-3 w-3" /> Tier: {order.serviceTier}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {activeOrderStatusesForDeadline.includes(order.status) && order.dueDate ? (
                          <div>
                              <div>{format(order.dueDate, 'MMM d, yyyy')} <span className="text-xs">(Due)</span></div>
                              <div className={`text-xs font-medium ${isPast(order.dueDate) ? 'text-destructive' : 'text-green-600 dark:text-green-500'}`}>
                                  {isPast(order.dueDate)
                                  ? `Overdue by ${formatDistanceToNow(order.dueDate, { addSuffix: false })}`
                                  : `Due in ${formatDistanceToNow(order.dueDate, { addSuffix: false })}`}
                              </div>
                          </div>
                      ) : (
                          format(order.orderDate, 'MMM d, yyyy, p')
                      )}
                    </TableCell>
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
                          <DropdownMenuItem 
                              disabled={order.status === 'Pending Assignment' ? false : true}
                              onClick={() => order.status === 'Pending Assignment' ? handleUpdateStatus(order.id, 'In Progress') : null}
                          > 
                              <Edit3 className="mr-2 h-4 w-4" /> Assign Designer & Start
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                              onClick={() => handleUpdateStatus(order.id, 'Completed')}
                              disabled={order.status === 'Completed' || order.status === 'Cancelled' || order.status === 'Refunded'}
                          >
                              <CheckCircle2 className="mr-2 h-4 w-4" /> Mark as Completed
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                              onClick={() => handleUpdateStatus(order.id, 'Cancelled')} 
                              className="text-destructive"
                              disabled={order.status === 'Completed' || order.status === 'Cancelled' || order.status === 'Refunded'}
                          >
                              <XCircleIcon className="mr-2 h-4 w-4" /> Cancel Order
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                  {expandedOrderIds.has(order.id) && (
                    <TableRow className="bg-secondary/30 hover:bg-secondary/40">
                      <TableCell colSpan={9} className="p-0"> {/* Adjusted colSpan */}
                        <div className="p-4 ">
                          <h4 className="font-semibold text-sm mb-2 flex items-center">
                            <ListChecks className="h-4 w-4 mr-2 text-primary" />
                            Committed Service Scope for <span className="italic mx-1">{order.serviceName} ({order.serviceTier})</span>:
                          </h4>
                          {order.serviceScope && order.serviceScope.length > 0 ? (
                            <ul className="list-disc list-inside pl-2 space-y-1 text-xs text-muted-foreground">
                              {order.serviceScope.map((item, idx) => (
                                <li key={idx}>{item}</li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-xs text-muted-foreground italic">No specific scope details available for this tier/order.</p>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </Fragment>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
    

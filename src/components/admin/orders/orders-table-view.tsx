
"use client";

import { useState, type ReactElement, useMemo, Fragment, ChangeEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
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
  XCircle as XCircleIcon,
  Tag,
  ChevronDown,
  ChevronUp,
  ListChecks,
  ArrowUpDown,
  Search
} from 'lucide-react';
import Link from 'next/link';
import { useToast } from "@/hooks/use-toast";
import { format, formatDistanceToNow, isPast, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';
import { designersData } from '@/lib/designer-data'; // For linking designers

export type OrderStatus = 'Pending Assignment' | 'In Progress' | 'Awaiting Client Review' | 'Revision Requested' | 'Completed' | 'Cancelled' | 'Refunded';

export interface OrderEvent {
  timestamp: Date;
  event: string;
  actor?: string;
  notes?: string;
}

export interface Order {
  id: string;
  clientName: string;
  clientId: string;
  designerName?: string;
  designerId?: string;
  serviceName: string;
  serviceId: string;
  serviceTier?: string;
  serviceScope?: string[];
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

export const initialOrdersData: Order[] = [
  {
    id: 'ORD7361P',
    clientName: 'Priya Sharma', clientId: 'CLI001P',
    designerName: designersData.find(d => d.slug === 'rohan-kapoor')?.name,
    designerId: designersData.find(d => d.slug === 'rohan-kapoor')?.id,
    serviceName: 'E-commerce Website UI/UX', serviceId: 'SVC004IN', serviceTier: 'Premium',
    serviceScope: ['Up to 5 pages UI/UX design', 'Mobile, tablet, and desktop views', 'Interactive prototype', 'Full style guide'],
    orderDate: new Date(2024, 6, 1, 10, 30), // July 1st, 2024
    dueDate: new Date(2024, 6, 11, 10, 30), // Static: July 1st + 10 days
    status: 'In Progress',
    totalAmount: 24999, currency: 'INR',
    paymentMethod: 'Razorpay',
    transactionId: 'pay_Olcftg87sHjkl',
    orderEvents: [
      { timestamp: new Date(2024, 6, 1, 10, 30), event: 'Order Placed', actor: 'Priya Sharma' },
      { timestamp: new Date(2024, 6, 1, 11, 0), event: 'Payment Successful (Razorpay)', actor: 'System' },
      { timestamp: new Date(2024, 6, 2, 9, 0), event: `Designer Assigned: ${designersData.find(d => d.slug === 'rohan-kapoor')?.name}`, actor: 'Admin' },
      { timestamp: new Date(2024, 6, 2, 9, 5), event: 'Status changed to In Progress', actor: 'System' },
    ],
    clientBrief: "Need a modern and clean UI/UX for a new e-commerce platform selling Indian handicrafts. Focus on mobile-first design and easy navigation for a diverse audience. Include vernacular language support considerations."
  },
  {
    id: 'ORD1038K',
    clientName: 'Rajesh Kumar', clientId: 'CLI003K',
    designerName: designersData.find(d => d.slug === 'aisha-khan')?.name,
    designerId: designersData.find(d => d.slug === 'aisha-khan')?.id,
    serviceName: 'Social Media Campaign Graphics', serviceId: 'SVC002IN', serviceTier: 'Standard',
    serviceScope: ['15 social media posts', 'Up to 3 platforms', '3 Rounds of revisions', 'Source files'],
    orderDate: new Date(2024, 6, 5, 14, 0), // July 5th, 2024
    dueDate: new Date(2024, 6, 8, 14, 0), // Static: July 5th + 3 days
    status: 'Pending Assignment',
    totalAmount: 7999, currency: 'INR',
    paymentMethod: 'PhonePe',
    transactionId: 'txn_HghtrDEWAq789',
     orderEvents: [
      { timestamp: new Date(2024, 6, 5, 14, 0), event: 'Order Placed', actor: 'Rajesh Kumar' },
      { timestamp: new Date(2024, 6, 5, 14, 5), event: 'Payment Successful (PhonePe)', actor: 'System' },
      { timestamp: new Date(2024, 6, 5, 14, 10), event: 'Status changed to Pending Assignment', actor: 'System' },
    ],
    clientBrief: "Require engaging graphics for a Diwali festival campaign on Instagram, Facebook, and WhatsApp. Theme: Traditional yet modern, vibrant colors. Target audience: Indian families."
  },
  {
    id: 'ORD2945S',
    clientName: 'Sunita Rao', clientId: 'CLI004S',
    designerName: designersData.find(d => d.slug === 'priya-sharma')?.name,
    designerId: designersData.find(d => d.slug === 'priya-sharma')?.id,
    serviceName: 'Startup Logo & Brand Identity', serviceId: 'SVC001IN', serviceTier: 'Premium',
    serviceScope: ['5 Initial concepts', 'Unlimited revisions', 'Full vector & source files', 'Detailed brand guidelines', 'Social media kit', 'Business card design'],
    orderDate: new Date(2024, 5, 20, 16, 45),
    dueDate: new Date(2024, 6, 15),
    status: 'Completed',
    totalAmount: 19999, currency: 'INR',
    paymentMethod: 'Razorpay',
    transactionId: 'pay_Nnbvcxz87Uyt',
    orderEvents: [
        { timestamp: new Date(2024, 5, 20, 16, 45), event: 'Order Placed', actor: 'Sunita Rao' },
        { timestamp: new Date(2024, 6, 12, 12, 0), event: 'Final delivery approved by client.', actor: 'Sunita Rao' },
        { timestamp: new Date(2024, 6, 12, 12, 5), event: 'Status changed to Completed', actor: 'System' },
    ],
    deliverables: [{ name: 'BrandIdentity_Final.zip', url: '#', submittedAt: new Date(2024, 6, 12, 12, 0)}],
    clientBrief: "Brand identity for a new health-tech startup in Bangalore. Name: 'SwasthyaLink'. Logo should evoke trust, technology, and wellness. Prefer blues and greens."
  },
  {
    id: 'ORD8872V',
    clientName: 'Vikram Mehta', clientId: 'CLI005V',
    serviceName: 'Festival Banner Design', serviceId: 'SVC005IN', serviceTier: 'Basic',
    serviceScope: ['2 Banner concepts (e.g., for Ganesh Chaturthi)', '1 Revision round', 'Print-ready files'],
    orderDate: new Date(2024, 6, 8, 9, 15),
    status: 'Cancelled',
    totalAmount: 2499, currency: 'INR',
    paymentMethod: 'Razorpay',
    transactionId: 'pay_Kkjhgf56Qwe',
    orderEvents: [
        { timestamp: new Date(2024, 6, 8, 9, 15), event: 'Order Placed', actor: 'Vikram Mehta' },
        { timestamp: new Date(2024, 6, 9, 10, 0), event: 'Order Cancelled by Client', actor: 'Vikram Mehta' },
    ],
    clientBrief: "Need vibrant banners for Ganesh Chaturthi celebrations for our community. Traditional motifs with a modern touch."
  },
   {
    id: 'ORD6531A',
    clientName: 'Anjali Iyer', clientId: 'CLI006A',
    designerName: designersData.find(d => d.slug === 'vikram-singh')?.name,
    designerId: designersData.find(d => d.slug === 'vikram-singh')?.id,
    serviceName: 'Restaurant Menu Design', serviceId: 'SVC003IN', serviceTier: 'Standard',
    serviceScope: ['Custom menu design (up to 4 pages)', 'Stock imagery included (if needed)', '3 revision rounds', 'Print-ready PDF'],
    orderDate: new Date(2024, 6, 10, 11, 20), // July 10th, 2024
    dueDate: new Date(2024, 6, 15, 11, 20), // Static: July 10th + 5 days
    status: 'Awaiting Client Review',
    totalAmount: 6999, currency: 'INR',
    paymentMethod: 'PhonePe',
    transactionId: 'txn_Qoiuyt09Mnb',
    orderEvents: [
        { timestamp: new Date(2024, 6, 10, 11, 20), event: 'Order Placed', actor: 'Anjali Iyer' },
        { timestamp: new Date(2024, 6, 15, 17, 0), event: 'Menu draft submitted by designer.', actor: designersData.find(d => d.slug === 'vikram-singh')?.name },
        { timestamp: new Date(2024, 6, 15, 17, 5), event: 'Status changed to Awaiting Client Review', actor: 'System' },
    ],
    deliverables: [ { name: 'RestaurantMenu_Draft_v1.pdf', url: '#', submittedAt: new Date(2024, 6, 15, 17, 0)} ],
    clientBrief: "Menu design for a new South Indian fusion restaurant in Chennai. Needs to be elegant, easy to read, and reflect a modern take on tradition."
  },
  {
    id: 'ORD4011M',
    clientName: 'Mohan Das', clientId: 'CLI007M',
    designerName: designersData.find(d => d.slug === 'sunita-reddy')?.name,
    designerId: designersData.find(d => d.slug === 'sunita-reddy')?.id,
    serviceName: 'Mobile App Icon Set', serviceId: 'SVC006IN', serviceTier: 'Standard',
    serviceScope: ['Set of 10 custom icons', 'Consistent style', 'Multiple sizes (iOS & Android)', '2 revision rounds'],
    orderDate: new Date(2024, 5, 25, 9, 0), // June 25th, 2024
    dueDate: new Date(2024, 6, 2, 9, 0),   // Static: June 25th + 7 days = July 2nd
    status: 'In Progress',
    totalAmount: 4999, currency: 'INR',
    paymentMethod: 'Razorpay',
    transactionId: 'pay_Xyz123abcDef',
    orderEvents: [
        { timestamp: new Date(2024, 5, 25, 9, 0), event: 'Order Placed', actor: 'Mohan Das' },
        { timestamp: new Date(2024, 5, 26, 10, 0), event: `Designer Assigned: ${designersData.find(d => d.slug === 'sunita-reddy')?.name}`, actor: 'Admin' },
        { timestamp: new Date(2024, 5, 26, 10, 5), event: 'Status changed to In Progress', actor: 'System' },
    ],
    clientBrief: "Need a set of 10 unique icons for a new travel app focusing on Indian destinations. Icons should be modern, flat, and easily recognizable."
  },
  {
    id: 'ORD9274R',
    clientName: 'Riya Sen', clientId: 'CLI008R',
    designerName: designersData.find(d => d.slug === 'arjun-mehta')?.name,
    designerId: designersData.find(d => d.slug === 'arjun-mehta')?.id,
    serviceName: 'Wedding Invitation Design', serviceId: 'SVC007IN', serviceTier: 'Premium',
    serviceScope: ['Custom invitation design (main + 2 inserts)', 'Digital and print-ready files', 'Envelope design', '3 revision rounds'],
    orderDate: new Date(2024, 4, 15, 15, 30),
    dueDate: new Date(2024, 5, 10),
    status: 'Revision Requested',
    totalAmount: 9999, currency: 'INR',
    paymentMethod: 'Bank Transfer',
    transactionId: 'BT_WEDINV_RIYA01',
    orderEvents: [
        { timestamp: new Date(2024, 4, 15, 15, 30), event: 'Order Placed', actor: 'Riya Sen' },
        { timestamp: new Date(2024, 5, 5, 18, 0), event: 'Initial invitation drafts submitted.', actor: designersData.find(d => d.slug === 'arjun-mehta')?.name },
        { timestamp: new Date(2024, 5, 7, 10, 0), event: 'Client requested revisions on color palette.', actor: 'Riya Sen' },
        { timestamp: new Date(2024, 5, 7, 10, 5), event: 'Status changed to Revision Requested', actor: 'System' },
    ],
    clientBrief: "Elegant and traditional Indian wedding invitation. Theme: Peacock feathers and gold accents. Need main invite, RSVP card, and Sangeet details card."
  }
];


interface OrdersTableViewProps {
  fixedStatusFilter: OrderStatus | 'All';
}

type SortableOrderKeys = 'id' | 'clientName' | 'serviceName' | 'orderDate' | 'totalAmount' | 'designerName';

export function OrdersTableView({ fixedStatusFilter }: OrdersTableViewProps): ReactElement {
  const [allOrdersData, setAllOrdersData] = useState<Order[]>(initialOrdersData); // Renamed to avoid conflict with argument
  const { toast } = useToast();
  const [expandedOrderIds, setExpandedOrderIds] = useState<Set<string>>(new Set());

  const [searchFilters, setSearchFilters] = useState({
    orderId: '',
    clientName: '',
    serviceName: '',
    designerName: '',
  });

  const [sortConfig, setSortConfig] = useState<{ key: SortableOrderKeys | null; direction: 'ascending' | 'descending' }>({
    key: 'orderDate',
    direction: 'descending',
  });

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearchFilters(prev => ({ ...prev, [name]: value }));
  };

  const requestSort = (key: SortableOrderKeys) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (key: SortableOrderKeys) => {
    if (sortConfig.key !== key) {
      return <ArrowUpDown className="ml-2 h-3 w-3 text-muted-foreground/50" />;
    }
    return sortConfig.direction === 'ascending' ?
      <ChevronUp className="ml-2 h-4 w-4" /> :
      <ChevronDown className="ml-2 h-4 w-4" />;
  };


  const displayedOrders = useMemo(() => {
    let sortableItems = [...allOrdersData];

    if (fixedStatusFilter !== 'All') {
      sortableItems = sortableItems.filter(order => order.status === fixedStatusFilter);
    }

    if (searchFilters.orderId) {
      sortableItems = sortableItems.filter(order => order.id.toLowerCase().includes(searchFilters.orderId.toLowerCase()));
    }
    if (searchFilters.clientName) {
      sortableItems = sortableItems.filter(order => order.clientName.toLowerCase().includes(searchFilters.clientName.toLowerCase()));
    }
    if (searchFilters.serviceName) {
      sortableItems = sortableItems.filter(order => order.serviceName.toLowerCase().includes(searchFilters.serviceName.toLowerCase()));
    }
    if (searchFilters.designerName) {
      sortableItems = sortableItems.filter(order => order.designerName?.toLowerCase().includes(searchFilters.designerName.toLowerCase()) ?? false);
    }

    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        const valA = a[sortConfig.key!];
        const valB = b[sortConfig.key!];

        let comparison = 0;
        if (valA === undefined || valA === null) comparison = -1;
        else if (valB === undefined || valB === null) comparison = 1;
        else if (typeof valA === 'number' && typeof valB === 'number') {
          comparison = valA - valB;
        } else if (valA instanceof Date && valB instanceof Date) {
          comparison = valA.getTime() - valB.getTime();
        } else {
          comparison = String(valA).toLowerCase().localeCompare(String(valB).toLowerCase());
        }
        return sortConfig.direction === 'ascending' ? comparison : comparison * -1;
      });
    }
    return sortableItems;
  }, [allOrdersData, fixedStatusFilter, searchFilters, sortConfig]);

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
    setAllOrdersData(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? {
          ...order, status: newStatus,
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
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 border rounded-lg bg-card">
        <div className="space-y-1">
          <Label htmlFor="searchOrderId" className="text-xs text-muted-foreground">Search Order ID</Label>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="searchOrderId"
              name="orderId"
              placeholder="e.g., ORD7361P"
              value={searchFilters.orderId}
              onChange={handleSearchChange}
              className="pl-9"
            />
          </div>
        </div>
        <div className="space-y-1">
          <Label htmlFor="searchClientName" className="text-xs text-muted-foreground">Search Client</Label>
           <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="searchClientName"
              name="clientName"
              placeholder="e.g., Priya Sharma"
              value={searchFilters.clientName}
              onChange={handleSearchChange}
              className="pl-9"
            />
          </div>
        </div>
        <div className="space-y-1">
          <Label htmlFor="searchServiceName" className="text-xs text-muted-foreground">Search Service</Label>
           <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="searchServiceName"
              name="serviceName"
              placeholder="e.g., Logo Design"
              value={searchFilters.serviceName}
              onChange={handleSearchChange}
              className="pl-9"
            />
          </div>
        </div>
        <div className="space-y-1">
          <Label htmlFor="searchDesignerName" className="text-xs text-muted-foreground">Search Designer</Label>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="searchDesignerName"
              name="designerName"
              placeholder="e.g., Rohan Kapoor"
              value={searchFilters.designerName}
              onChange={handleSearchChange}
              className="pl-9"
            />
          </div>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[120px]">
              <Button variant="ghost" onClick={() => requestSort('id')} className="px-1 text-xs sm:text-sm -ml-2">
                Order ID {getSortIndicator('id')}
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => requestSort('clientName')} className="px-1 text-xs sm:text-sm -ml-2">
                <User className="inline-block mr-1 h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />Client {getSortIndicator('clientName')}
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => requestSort('serviceName')} className="px-1 text-xs sm:text-sm -ml-2">
                <FileText className="inline-block mr-1 h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />Service & Details {getSortIndicator('serviceName')}
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => requestSort('orderDate')} className="px-1 text-xs sm:text-sm -ml-2">
                <CalendarDays className="inline-block mr-1 h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />Date / Deadline {getSortIndicator('orderDate')}
              </Button>
            </TableHead>
            <TableHead><Clock className="inline-block mr-1 h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />Status</TableHead>
            <TableHead>
               <Button variant="ghost" onClick={() => requestSort('designerName')} className="px-1 text-xs sm:text-sm -ml-2">
                <Brush className="inline-block mr-1 h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />Designer {getSortIndicator('designerName')}
              </Button>
            </TableHead>
            <TableHead className="text-right">
              <Button variant="ghost" onClick={() => requestSort('totalAmount')} className="px-1 text-xs sm:text-sm -ml-2">
                <IndianRupee className="inline-block mr-1 h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />Total {getSortIndicator('totalAmount')}
              </Button>
            </TableHead>
            <TableHead className="text-right w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayedOrders.length === 0 && (
            <TableRow>
              <TableCell colSpan={8} className="text-center h-24">
                No orders match the current filters.
              </TableCell>
            </TableRow>
          )}
          {displayedOrders.map(order => (
            <Fragment key={order.id}>
              <TableRow>
                <TableCell className="font-medium text-xs sm:text-sm">
                  <Link href={`/admin/orders/details/${order.id}`} className="text-primary hover:underline">
                    {order.id}
                  </Link>
                </TableCell>
                <TableCell className="text-xs sm:text-sm">{order.clientName}</TableCell>
                <TableCell className="text-xs sm:text-sm">
                    <div className="flex items-start">
                        <div className="flex-grow">
                            <span className="font-medium">{order.serviceName}</span>
                            {order.serviceTier && (
                                <div className="text-xs text-muted-foreground flex items-center mt-0.5">
                                <Tag className="mr-1 h-3 w-3" /> Tier: {order.serviceTier}
                                </div>
                            )}
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleExpandOrder(order.id)}
                            aria-label={expandedOrderIds.has(order.id) ? "Collapse details" : "Expand details"}
                            className="ml-2 p-1 h-auto self-center"
                        >
                            {expandedOrderIds.has(order.id) ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </Button>
                    </div>
                </TableCell>
                <TableCell className="text-xs sm:text-sm">
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
                  <Badge variant={getStatusBadgeVariant(order.status)} className="text-xs sm:text-sm whitespace-nowrap">{order.status}</Badge>
                </TableCell>
                <TableCell className="text-xs sm:text-sm">
                  {order.designerId && order.designerName ? (
                    <Link href={`/admin/designers/view/${order.designerId}`} className="text-primary hover:underline">
                      {order.designerName}
                    </Link>
                  ) : (
                    <span className="text-muted-foreground italic">N/A</span>
                  )}
                </TableCell>
                <TableCell className="text-right text-xs sm:text-sm">₹{order.totalAmount.toFixed(2)}</TableCell>
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
                  <TableCell colSpan={8} className="p-0">
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
    </>
  );
}

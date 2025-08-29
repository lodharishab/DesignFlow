
"use client";

import { useState, useEffect, useMemo, type ReactElement, ChangeEvent, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Briefcase, 
  User, 
  CalendarDays, 
  Info, 
  Eye, 
  ArrowRight, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ArrowUpDown, 
  ChevronUp, 
  ChevronDown,
  ListFilter,
  Search,
  PanelLeftClose,
  IndianRupee,
  MessageSquare,
  Upload,
  HandCoins,
  Send,
  Star,
  ListChecks,
  GitPullRequest,
  BarChart,
} from 'lucide-react';
import { Progress } from "@/components/ui/progress"
import Link from 'next/link';
import { format, isPast, formatDistanceToNow, differenceInDays } from 'date-fns';
import { initialOrdersData as allOrders, type Order as BaseOrder, type OrderStatus } from '@/components/admin/orders/orders-table-view';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetClose } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';

const MOCK_DESIGNER_ID = 'des002';

type SortableDesignerOrderKeys = 'id' | 'serviceName' | 'clientName' | 'dueDate' | 'status';

const designerOrderStatusFilters: { label: string; value: OrderStatus | 'All'; icon?: React.ElementType }[] = [
  { label: 'All My Orders', value: 'All', icon: ListFilter },
  { label: 'In Progress', value: 'In Progress', icon: Clock },
  { label: 'Awaiting Client Review', value: 'Awaiting Client Review', icon: Eye },
  { label: 'Revision Requested', value: 'Revision Requested', icon: AlertTriangle },
  { label: 'Completed', value: 'Completed', icon: CheckCircle2 },
];

// Extend the Order interface for new features
interface Milestone {
  id: string;
  title: string;
  dueDate: Date;
  amount: number;
  status: 'Pending' | 'Delivered' | 'Paid';
}

interface Analytics {
    completionDate: Date;
    totalDeliveryTimeDays: number;
    revisionsCount: number;
    clientRating: number;
    paymentReleaseDate: Date;
}

interface Order extends BaseOrder {
  milestones?: Milestone[];
  analytics?: Analytics;
}

// Add mock milestone and analytics data to some orders
const ordersWithMilestones: Order[] = allOrders.map(order => {
  if (order.id === 'ORD7361P') {
    return {
      ...order,
      milestones: [
        { id: 'm1', title: 'Phase 1: Wireframes & UX Flow', dueDate: new Date(2024, 6, 8), amount: 8000, status: 'Paid' },
        { id: 'm2', title: 'Phase 2: UI Design & Style Guide', dueDate: new Date(2024, 6, 20), amount: 12000, status: 'Delivered' },
        { id: 'm3', title: 'Phase 3: Final Assets & Prototype', dueDate: new Date(2024, 6, 28), amount: 4999, status: 'Pending' },
      ]
    };
  }
  if (order.id === 'ORD4011M') {
      return {
          ...order,
          milestones: [
              { id: 'm4', title: 'Initial Icon Concepts (5 icons)', dueDate: new Date(2024, 5, 28), amount: 2500, status: 'Paid' },
              { id: 'm5', title: 'Final Icon Set (10 icons)', dueDate: new Date(2024, 6, 2), amount: 2499, status: 'Pending' },
          ]
      }
  }
  // Add analytics to a completed order
  if (order.id === 'ORD2945S' && order.designerId === MOCK_DESIGNER_ID) {
    return {
        ...order,
        analytics: {
            completionDate: new Date(2024, 6, 12),
            totalDeliveryTimeDays: differenceInDays(new Date(2024, 6, 12), order.orderDate),
            revisionsCount: 1,
            clientRating: 4.5,
            paymentReleaseDate: new Date(2024, 6, 26),
        }
    }
  }
  return order;
});

const getStatusBadgeVariant = (status: OrderStatus) => {
    switch (status) {
      case 'Completed': return 'default';
      case 'In Progress': return 'secondary';
      case 'Pending Assignment': return 'outline'; 
      case 'Awaiting Client Review': return 'outline';
      case 'Revision Requested': return 'secondary';
      case 'Cancelled': return 'destructive';
      default: return 'secondary';
    }
};

export default function DesignerOrdersPage(): ReactElement {
  const [assignedOrders, setAssignedOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'All'>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: SortableDesignerOrderKeys | null; direction: 'ascending' | 'descending' }>({
    key: 'dueDate',
    direction: 'ascending',
  });

  useEffect(() => {
    const designerOrders = ordersWithMilestones.filter(order => order.designerId === MOCK_DESIGNER_ID);
    setAssignedOrders(designerOrders);
    setIsLoading(false);
  }, []);
  
  const handleSelectOrder = (order: Order) => {
    setSelectedOrder(order);
  }

  const handleMilestoneAction = (orderId: string, milestoneId: string) => {
    setSelectedOrder(prevOrder => {
      if (!prevOrder || prevOrder.id !== orderId) return prevOrder;
      
      const updatedMilestones = prevOrder.milestones?.map(m => 
        m.id === milestoneId ? { ...m, status: 'Delivered' as const } : m
      );

      return { ...prevOrder, milestones: updatedMilestones };
    });
  };

  const requestSort = (key: SortableDesignerOrderKeys) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (key: SortableDesignerOrderKeys) => {
    if (sortConfig.key !== key) {
      return <ArrowUpDown className="ml-2 h-3 w-3 text-muted-foreground/50" />;
    }
    return sortConfig.direction === 'ascending' ?
      <ChevronUp className="ml-1 h-4 w-4" /> :
      <ChevronDown className="ml-1 h-4 w-4" />;
  };

  const displayedOrders = useMemo(() => {
    let filtered = [...assignedOrders];

    if (statusFilter !== 'All') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(order =>
        order.id.toLowerCase().includes(lowerSearchTerm) ||
        order.clientName.toLowerCase().includes(lowerSearchTerm) ||
        order.serviceName.toLowerCase().includes(lowerSearchTerm)
      );
    }
    
    if (sortConfig.key !== null) {
      filtered.sort((a, b) => {
        const valA = a[sortConfig.key!];
        const valB = b[sortConfig.key!];

        let comparison = 0;
        if (valA === undefined || valA === null) comparison = -1;
        else if (valB === undefined || valB === null) comparison = 1;
        else if (valA instanceof Date && valB instanceof Date) {
          comparison = valA.getTime() - valB.getTime();
        } else if (typeof valA === 'string' && typeof valB === 'string') {
          comparison = valA.localeCompare(valB);
        } else if (typeof valA === 'number' && typeof valB === 'number') {
          comparison = valA - valB;
        }
        
        return sortConfig.direction === 'ascending' ? comparison : comparison * -1;
      });
    }
    return filtered;
  }, [assignedOrders, statusFilter, searchTerm, sortConfig]);

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'In Progress': return <Clock className="mr-1.5 h-3.5 w-3.5" />;
      case 'Awaiting Client Review': return <Eye className="mr-1.5 h-3.5 w-3.5" />;
      case 'Revision Requested': return <AlertTriangle className="mr-1.5 h-3.5 w-3.5 text-orange-500" />;
      case 'Completed': return <CheckCircle2 className="mr-1.5 h-3.5 w-3.5 text-green-500" />;
      default: return <Info className="mr-1.5 h-3.5 w-3.5" />;
    }
  };

  if (isLoading) {
    return <div className="text-center py-10">Loading your orders...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold font-headline flex items-center">
          <Briefcase className="mr-3 h-8 w-8 text-primary" />
          Manage Your Projects
        </h1>
         <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search Order, Client..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
        </div>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <div className="pt-4 flex flex-wrap gap-2">
            {designerOrderStatusFilters.map(filter => (
              <Button
                key={filter.value}
                variant={statusFilter === filter.value ? 'default' : 'outline'}
                onClick={() => setStatusFilter(filter.value)}
                size="sm"
              >
                {filter.icon && <filter.icon className="mr-2 h-4 w-4" />}
                {filter.label}
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          {displayedOrders.length === 0 ? (
             <div className="text-center py-10">
                <Briefcase className="mx-auto h-16 w-16 text-muted-foreground opacity-50" />
                <p className="mt-4 text-lg font-semibold">No orders match your current filters.</p>
                {statusFilter !== 'All' && (
                    <Button variant="link" onClick={() => setStatusFilter('All')}>Show all my orders</Button>
                )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                     <Button variant="ghost" onClick={() => requestSort('id')} className="px-1 text-xs sm:text-sm -ml-2">
                        Order ID {getSortIndicator('id')}
                    </Button>
                  </TableHead>
                   <TableHead>
                     <Button variant="ghost" onClick={() => requestSort('serviceName')} className="px-1 text-xs sm:text-sm -ml-2">
                        Service {getSortIndicator('serviceName')}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" onClick={() => requestSort('clientName')} className="px-1 text-xs sm:text-sm -ml-2">
                        <User className="inline-block mr-1 h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" /> Client {getSortIndicator('clientName')}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" onClick={() => requestSort('dueDate')} className="px-1 text-xs sm:text-sm -ml-2">
                        <CalendarDays className="inline-block mr-1 h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" /> Due Date {getSortIndicator('dueDate')}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" onClick={() => requestSort('status')} className="px-1 text-xs sm:text-sm -ml-2">
                        <Clock className="inline-block mr-1 h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />Status {getSortIndicator('status')}
                    </Button>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayedOrders.map(order => (
                  <TableRow key={order.id} onClick={() => handleSelectOrder(order)} className="cursor-pointer">
                    <TableCell className="font-medium text-primary hover:underline text-xs sm:text-sm">
                      {order.id}
                    </TableCell>
                    <TableCell className="text-xs sm:text-sm">
                        {order.serviceName}
                        {order.serviceTier && <span className="block text-xs text-muted-foreground mt-0.5">({order.serviceTier})</span>}
                    </TableCell>
                    <TableCell className="text-xs sm:text-sm">
                      {order.clientName}
                    </TableCell>
                    <TableCell className="text-xs sm:text-sm">
                      {order.dueDate ? (
                        <>
                          {format(order.dueDate, 'MMM d, yyyy')}
                          {order.status !== 'Completed' && order.status !== 'Cancelled' && isPast(order.dueDate) && (
                            <span className="block text-xs text-destructive mt-0.5">
                              Overdue by {formatDistanceToNow(order.dueDate, { addSuffix: false })}
                            </span>
                          )}
                           {order.status !== 'Completed' && order.status !== 'Cancelled' && !isPast(order.dueDate) && (
                            <span className="block text-xs text-green-600 mt-0.5">
                              Due in {formatDistanceToNow(order.dueDate, { addSuffix: false })}
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="text-muted-foreground italic">N/A</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(order.status)} className="text-xs whitespace-nowrap">
                        {getStatusIcon(order.status)}
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" asChild>
                        <span onClick={(e) => { e.stopPropagation(); handleSelectOrder(order); }}>
                          Details <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                        </span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      
       <OrderDetailsDrawer 
          order={selectedOrder} 
          isOpen={!!selectedOrder} 
          onClose={() => setSelectedOrder(null)} 
          onMilestoneAction={handleMilestoneAction}
        />
    </div>
  );
}

function OrderDetailsDrawer({ order, isOpen, onClose, onMilestoneAction }: { order: Order | null; isOpen: boolean; onClose: () => void; onMilestoneAction: (orderId: string, milestoneId: string) => void; }) {
  if (!order) return null;

  const getStatusBadgeVariant = (status: OrderStatus) => {
    switch (status) {
      case 'Completed': return 'default';
      case 'In Progress': return 'secondary';
      case 'Pending Assignment': return 'outline'; 
      case 'Awaiting Client Review': return 'outline';
      case 'Revision Requested': return 'secondary';
      case 'Cancelled': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-[400px] sm:w-[540px] flex flex-col">
        <SheetHeader className="pr-12">
          <SheetTitle className="font-headline text-xl">Order: {order.id}</SheetTitle>
          <SheetDescription>
            {order.serviceName} - {order.serviceTier}
          </SheetDescription>
        </SheetHeader>
        <Separator className="my-4"/>
        <div className="flex-grow overflow-y-auto pr-4 space-y-6">
            <div className="space-y-3 text-sm">
                <p><strong className="font-medium text-muted-foreground">Client:</strong> {order.clientName}</p>
                <p><strong className="font-medium text-muted-foreground">Status:</strong> <Badge variant={getStatusBadgeVariant(order.status)}>{order.status}</Badge></p>
                <p><strong className="font-medium text-muted-foreground">Total:</strong> ₹{order.totalAmount.toLocaleString('en-IN')}</p>
                {order.dueDate && <p><strong className="font-medium text-muted-foreground">Deadline:</strong> {format(order.dueDate, 'PPP')}</p>}
            </div>

            {order.status === 'Completed' && order.analytics && (
              <AnalyticsSummary analytics={order.analytics} />
            )}
            
            <MilestoneView order={order} onMilestoneAction={onMilestoneAction} />
        </div>
        <Separator className="mt-4"/>
        <div className="pt-4 grid grid-cols-2 gap-2">
            <Button variant="outline"><MessageSquare className="mr-2 h-4 w-4"/>Message Client</Button>
            <Button variant="outline"><Upload className="mr-2 h-4 w-4"/>Upload File</Button>
            <Button className="col-span-2"><Send className="mr-2 h-4 w-4"/>Submit for Review</Button>
            <Button variant="secondary" className="col-span-2"><HandCoins className="mr-2 h-4 w-4"/>Request Advance</Button>
        </div>
        <SheetClose asChild><Button variant="ghost" className="absolute top-4 right-4 h-8 w-8 p-0"><PanelLeftClose/></Button></SheetClose>
      </SheetContent>
    </Sheet>
  );
}

function MilestoneView({ order, onMilestoneAction }: { order: Order, onMilestoneAction: (orderId: string, milestoneId: string) => void; }) {
  const { milestones = [] } = order;

  const getMilestoneStatusBadge = (status: Milestone['status']) => {
    switch (status) {
      case 'Paid': return <Badge variant="default">Paid</Badge>;
      case 'Delivered': return <Badge variant="secondary">Delivered</Badge>;
      case 'Pending': return <Badge variant="outline">Pending</Badge>;
    }
  };
  
  const totalAmount = milestones.reduce((acc, m) => acc + m.amount, 0);
  const paidAmount = milestones.filter(m => m.status === 'Paid').reduce((acc, m) => acc + m.amount, 0);
  const progressPercentage = totalAmount > 0 ? (paidAmount / totalAmount) * 100 : 0;


  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold flex items-center"><ListChecks className="mr-2 h-5 w-5 text-primary"/>Milestones</CardTitle>
        <Progress value={progressPercentage} className="mt-2 h-2" />
        <CardDescription className="text-xs pt-1">
          {progressPercentage.toFixed(0)}% of total payment released.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {milestones.length > 0 ? (
          <div className="space-y-4">
            {milestones.map(milestone => (
              <div key={milestone.id} className="p-3 border rounded-md bg-background/50">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-sm">{milestone.title}</p>
                    <p className="text-xs text-muted-foreground">Due: {format(milestone.dueDate, 'MMM d, yyyy')}</p>
                    <p className="text-xs text-muted-foreground">Amount: ₹{milestone.amount.toLocaleString('en-IN')}</p>
                  </div>
                  {getMilestoneStatusBadge(milestone.status)}
                </div>
                {milestone.status === 'Pending' && (
                  <div className="text-right mt-2">
                    <Button size="sm" variant="outline" onClick={() => onMilestoneAction(order.id, milestone.id)}>
                      Mark as Delivered
                    </Button>
                  </div>
                )}
                {milestone.status === 'Delivered' && (
                  <div className="text-right mt-2">
                    <Button size="sm" variant="outline" disabled>
                      Payment Requested
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground italic text-center">This order is not milestone-based.</p>
        )}
      </CardContent>
    </Card>
  )
}

function AnalyticsSummary({ analytics }: { analytics: Analytics }) {
  return (
    <Card className="bg-secondary/50">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold flex items-center">
            <BarChart className="mr-2 h-5 w-5 text-primary"/>
            Project Analytics
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4 text-sm">
        <div className="flex items-start space-x-3">
          <Clock className="h-5 w-5 mt-0.5 text-muted-foreground shrink-0"/>
          <div>
            <p className="font-medium">Delivery Time</p>
            <p className="text-muted-foreground">{analytics.totalDeliveryTimeDays} days</p>
          </div>
        </div>
         <div className="flex items-start space-x-3">
          <GitPullRequest className="h-5 w-5 mt-0.5 text-muted-foreground shrink-0"/>
          <div>
            <p className="font-medium">Revisions</p>
            <p className="text-muted-foreground">{analytics.revisionsCount} round(s)</p>
          </div>
        </div>
         <div className="flex items-start space-x-3">
          <Star className="h-5 w-5 mt-0.5 text-muted-foreground shrink-0"/>
          <div>
            <p className="font-medium">Client Rating</p>
            <p className="text-muted-foreground">{analytics.clientRating}/5</p>
          </div>
        </div>
         <div className="flex items-start space-x-3">
          <IndianRupee className="h-5 w-5 mt-0.5 text-muted-foreground shrink-0"/>
          <div>
            <p className="font-medium">Payment Released</p>
            <p className="text-muted-foreground">{format(analytics.paymentReleaseDate, 'MMM d, yyyy')}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

    
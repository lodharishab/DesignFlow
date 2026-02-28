

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
import { format, formatDistanceToNow, isPast } from 'date-fns';
import type { Order, OrderStatus, OrderEvent } from '@/lib/orders-db';

export type { Order, OrderStatus, OrderEvent } from '@/lib/orders-db';
export type { Milestone } from '@/lib/orders-db';


interface OrdersTableViewProps {
  fixedStatusFilter: OrderStatus | 'All';
  initialOrders: Order[];
}

type SortableOrderKeys = 'id' | 'clientName' | 'serviceName' | 'orderDate' | 'totalAmount' | 'designerName';

export function OrdersTableView({ fixedStatusFilter, initialOrders }: OrdersTableViewProps): ReactElement {
  const [allOrdersData, setAllOrdersData] = useState<Order[]>(initialOrders); 
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
          orderEvents: [...order.orderEvents, { id: `evt_admin_${Date.now()}`, orderId: order.id, timestamp: new Date(), event: `Status changed to ${newStatus}`, actor: 'Admin' }].sort((a,b) => b.timestamp.getTime() - a.timestamp.getTime())
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

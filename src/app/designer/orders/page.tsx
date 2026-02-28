
"use client";

import { useState, useEffect, useMemo, type ReactElement, ChangeEvent, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from '@/components/ui/input';
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
} from 'lucide-react';
import Link from 'next/link';
import { format, isPast, formatDistanceToNow } from 'date-fns';
import { getOrdersByDesignerId, type Order as BaseOrder, type OrderStatus } from '@/lib/orders-db';

const MOCK_DESIGNER_ID = 'des002';

type SortableDesignerOrderKeys = 'id' | 'serviceName' | 'clientName' | 'dueDate' | 'status';

interface Order extends BaseOrder {}

const designerOrderStatusFilters: { label: string; value: OrderStatus | 'All'; icon?: React.ElementType }[] = [
  { label: 'All My Orders', value: 'All', icon: ListFilter },
  { label: 'In Progress', value: 'In Progress', icon: Clock },
  { label: 'Awaiting Client Review', value: 'Awaiting Client Review', icon: Eye },
  { label: 'Revision Requested', value: 'Revision Requested', icon: AlertTriangle },
  { label: 'Completed', value: 'Completed', icon: CheckCircle2 },
];


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
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'All'>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: SortableDesignerOrderKeys | null; direction: 'ascending' | 'descending' }>({
    key: 'dueDate',
    direction: 'ascending',
  });

  useEffect(() => {
    getOrdersByDesignerId(MOCK_DESIGNER_ID).then(orders => {
      setAssignedOrders(orders as Order[]);
      setIsLoading(false);
    });
  }, []);

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
                  <TableRow key={order.id}>
                    <TableCell className="font-medium text-primary hover:underline text-xs sm:text-sm">
                      <Link href={`/designer/orders/${order.id}`}>
                        {order.id}
                      </Link>
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
                         <Link href={`/designer/orders/${order.id}`}>
                           Details <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                         </Link>
                       </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

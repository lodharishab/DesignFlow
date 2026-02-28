
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, PackageSearch, ArrowRight, Info, CalendarDays, FileText, IndianRupee, Clock, CheckCircle2, ListFilter, AlertTriangle, Eye, ArrowUpDown, ChevronUp, ChevronDown, Star } from 'lucide-react';
import { format } from 'date-fns';
import { useState, useEffect, useMemo, type ReactElement } from 'react';
import { getOrdersByClientId, type Order } from '@/lib/orders-db';

const CURRENT_CLIENT_ID = 'client001';

type OrderStatus = 'In Progress' | 'Pending Assignment' | 'Completed' | 'Awaiting Client Review' | 'Cancelled';
type SortableOrderKeys = 'id' | 'serviceName' | 'orderDate' | 'status' | 'total';

interface ClientOrder {
  id: string;
  serviceName: string;
  status: OrderStatus;
  orderDate: Date;
  total: number;
}

function mapDbToClientOrder(o: Order): ClientOrder {
  return {
    id: o.id,
    serviceName: o.serviceName,
    status: o.status as OrderStatus,
    orderDate: o.orderDate,
    total: o.totalAmount,
  };
}

const statusFilters: { label: string; value: OrderStatus | 'All'; icon?: React.ElementType }[] = [
  { label: 'All', value: 'All', icon: ListFilter },
  { label: 'In Progress', value: 'In Progress', icon: Clock },
  { label: 'Awaiting Review', value: 'Awaiting Client Review', icon: Eye },
  { label: 'Completed', value: 'Completed', icon: CheckCircle2 },
];


export default function ClientOrdersPage(): ReactElement {
  const [orders, setOrders] = useState<ClientOrder[]>([]);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'All'>('All');

  useEffect(() => {
    getOrdersByClientId(CURRENT_CLIENT_ID).then(dbOrders =>
      setOrders(dbOrders.map(mapDbToClientOrder))
    );
  }, []);
  const [sortConfig, setSortConfig] = useState<{ key: SortableOrderKeys | null; direction: 'ascending' | 'descending' }>({
    key: 'orderDate',
    direction: 'descending',
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Completed': return 'default';
      case 'In Progress': return 'secondary';
      case 'Pending Assignment': return 'outline';
      case 'Awaiting Client Review': return 'outline';
      case 'Cancelled': return 'destructive';
      default: return 'secondary';
    }
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
      <ChevronUp className="ml-1 h-4 w-4" /> :
      <ChevronDown className="ml-1 h-4 w-4" />;
  };

  const displayedOrders = useMemo(() => {
    let sortableItems = [...orders];

    if (statusFilter !== 'All') {
      sortableItems = sortableItems.filter(order => order.status === statusFilter);
    }
    
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        const valA = a[sortConfig.key!];
        const valB = b[sortConfig.key!];

        let comparison = 0;
        if (typeof valA === 'number' && typeof valB === 'number') {
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
  }, [orders, statusFilter, sortConfig]);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold font-headline flex items-center">
        <ShoppingCart className="mr-3 h-8 w-8 text-primary" />
        My Orders
      </h1>

      {orders.length === 0 ? (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline">No Orders Yet</CardTitle>
            <CardDescription>You haven't placed any orders.</CardDescription>
          </CardHeader>
          <CardContent className="text-center py-16">
            <PackageSearch className="mx-auto h-24 w-24 text-muted-foreground opacity-50" />
            <p className="mt-4 text-muted-foreground">Ready to start your next design project?</p>
            <Button asChild className="mt-6">
              <Link href="/design-services">Browse Services</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline">Order History</CardTitle>
            <CardDescription>Track your current and past design orders.</CardDescription>
            <div className="pt-4 flex flex-wrap gap-2">
              {statusFilters.map(filter => (
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
                       <FileText className="inline-block mr-1 h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />Service Name {getSortIndicator('serviceName')}
                    </Button>
                  </TableHead>
                   <TableHead>
                    <Button variant="ghost" onClick={() => requestSort('orderDate')} className="px-1 text-xs sm:text-sm -ml-2">
                       <CalendarDays className="inline-block mr-1 h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />Order Date {getSortIndicator('orderDate')}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" onClick={() => requestSort('status')} className="px-1 text-xs sm:text-sm -ml-2">
                      <Info className="inline-block mr-1 h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />Status {getSortIndicator('status')}
                    </Button>
                  </TableHead>
                   <TableHead className="text-right">
                    <Button variant="ghost" onClick={() => requestSort('total')} className="px-1 text-xs sm:text-sm -ml-2">
                       <IndianRupee className="inline-block mr-1 h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />Total {getSortIndicator('total')}
                    </Button>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayedOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium text-primary hover:underline">
                      <Link href={`/client/orders/${order.id}`}>
                        {order.id}
                      </Link>
                    </TableCell>
                    <TableCell>{order.serviceName}</TableCell>
                    <TableCell>{format(order.orderDate, 'MMM d, yyyy')}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(order.status)}>{order.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">₹{order.total.toLocaleString('en-IN')}</TableCell>
                    <TableCell className="text-right">
                      {order.status === 'Completed' ? (
                         <Button variant="default" size="sm" asChild>
                            <Link href={`/client/review/${order.id}`}>
                              <Star className="mr-1.5 h-3.5 w-3.5" /> Leave Review
                            </Link>
                          </Button>
                      ) : (
                         <Button variant="outline" size="sm" asChild>
                          <Link href={`/client/orders/${order.id}`}>
                            View Details <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                          </Link>
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

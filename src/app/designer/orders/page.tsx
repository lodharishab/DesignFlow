
"use client";

import { useState, useEffect, useMemo, type ReactElement } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Briefcase, User, CalendarDays, Info, Eye, ArrowRight, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import Link from 'next/link';
import { format, isPast, formatDistanceToNow } from 'date-fns';
import { initialOrdersData as allOrders, type Order, type OrderStatus } from '@/components/admin/orders/orders-table-view'; // Reusing admin types and data

// Hardcoded designer ID for prototype
const MOCK_DESIGNER_ID = 'des002'; // Bob The Builder (order001 is 'In Progress' for him)

export default function DesignerOrdersPage(): ReactElement {
  const [assignedOrders, setAssignedOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching orders for the designer
    const designerOrders = allOrders.filter(order => order.designerId === MOCK_DESIGNER_ID);
    setAssignedOrders(designerOrders);
    setIsLoading(false);
  }, []);

  const getStatusBadgeVariant = (status: OrderStatus) => {
    switch (status) {
      case 'Completed': return 'default'; // Greenish or positive
      case 'In Progress': return 'secondary'; // Blueish or neutral active
      case 'Pending Assignment': return 'outline'; // Should not appear here ideally
      case 'Awaiting Client Review': return 'outline'; // Yellowish or pending
      case 'Revision Requested': return 'secondary'; // Orange/yellowish
      case 'Cancelled': return 'destructive';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'In Progress': return <Clock className="mr-1.5 h-3.5 w-3.5" />;
      case 'Awaiting Client Review': return <Eye className="mr-1.5 h-3.5 w-3.5" />;
      case 'Revision Requested': return <AlertTriangle className="mr-1.5 h-3.5 w-3.5" />;
      case 'Completed': return <CheckCircle2 className="mr-1.5 h-3.5 w-3.5 text-green-500" />;
      default: return <Info className="mr-1.5 h-3.5 w-3.5" />;
    }
  };

  if (isLoading) {
    return <div className="text-center py-10">Loading your orders...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-headline flex items-center">
          <Briefcase className="mr-3 h-8 w-8 text-primary" />
          My Assigned Orders
        </h1>
      </div>

      {assignedOrders.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <Briefcase className="mx-auto h-16 w-16 text-muted-foreground opacity-50" />
            <p className="mt-4 text-lg font-semibold">No Orders Assigned</p>
            <p className="text-muted-foreground">
              You currently have no active orders assigned to you.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Current Projects</CardTitle>
            <CardDescription>Manage your active and upcoming design projects.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assignedOrders.map(order => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium text-primary hover:underline">
                      <Link href={`/designer/orders/${order.id}`}>
                        {order.id}
                      </Link>
                    </TableCell>
                    <TableCell>
                        {order.serviceName}
                        {order.serviceTier && <span className="text-xs text-muted-foreground ml-1">({order.serviceTier})</span>}
                    </TableCell>
                    <TableCell className="flex items-center">
                      <User className="mr-2 h-4 w-4 text-muted-foreground" />
                      {order.clientName}
                    </TableCell>
                    <TableCell>
                      {order.dueDate ? (
                        <>
                          {format(order.dueDate, 'MMM d, yyyy')}
                          {order.status !== 'Completed' && order.status !== 'Cancelled' && isPast(order.dueDate) && (
                            <span className="block text-xs text-destructive">
                              Overdue by {formatDistanceToNow(order.dueDate, { addSuffix: false })}
                            </span>
                          )}
                           {order.status !== 'Completed' && order.status !== 'Cancelled' && !isPast(order.dueDate) && (
                            <span className="block text-xs text-green-600">
                              Due in {formatDistanceToNow(order.dueDate, { addSuffix: false })}
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="text-muted-foreground italic">N/A</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(order.status)} className="text-xs">
                        {getStatusIcon(order.status)}
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/designer/orders/${order.id}`}>
                          View Details <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                        </Link>
                      </Button>
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

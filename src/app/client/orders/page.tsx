
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, PackageSearch, ArrowRight, FileText, CalendarDays, Info, IndianRupee } from 'lucide-react';
import { format } from 'date-fns';

// Mock data for client orders - replace with actual data fetching
const mockClientOrders = [
  { id: 'ORD7361P', serviceName: 'E-commerce Website UI/UX', status: 'In Progress', orderDate: new Date(2024, 6, 1), total: 24999.00 },
  { id: 'ORD1038K', serviceName: 'Social Media Campaign Graphics', status: 'Pending Assignment', orderDate: new Date(2024, 6, 5), total: 7999.00 },
  { id: 'ORD2945S', serviceName: 'Startup Logo & Brand Identity', status: 'Completed', orderDate: new Date(2024, 5, 20), total: 19999.00 },
  { id: 'ORD5050T', serviceName: 'Mobile App Icon Set', status: 'Awaiting Client Review', orderDate: new Date(2024, 6, 10), total: 4999.00 },
  { id: 'ORD0112C', serviceName: 'Festival Banner Design', status: 'Cancelled', orderDate: new Date(2024, 6, 12), total: 2499.00 },
];

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case 'Completed': return 'default'; // Greenish or primary
    case 'In Progress': return 'secondary'; // Blueish or yellowish
    case 'Pending Assignment': return 'outline'; // Neutral
    case 'Awaiting Client Review': return 'outline';
    case 'Cancelled': return 'destructive';
    default: return 'secondary';
  }
};


export default function ClientOrdersPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold font-headline flex items-center">
        <ShoppingCart className="mr-3 h-8 w-8 text-primary" />
        My Orders
      </h1>

      {mockClientOrders.length === 0 ? (
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
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">Order ID</TableHead>
                  <TableHead><FileText className="inline-block mr-1 h-4 w-4 text-muted-foreground" />Service Name</TableHead>
                  <TableHead><CalendarDays className="inline-block mr-1 h-4 w-4 text-muted-foreground" />Order Date</TableHead>
                  <TableHead><Info className="inline-block mr-1 h-4 w-4 text-muted-foreground" />Status</TableHead>
                  <TableHead className="text-right"><IndianRupee className="inline-block mr-1 h-4 w-4 text-muted-foreground" />Total</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockClientOrders.map((order) => (
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
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/client/orders/${order.id}`}>
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

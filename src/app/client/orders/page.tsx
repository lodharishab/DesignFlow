
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart, PackageSearch } from 'lucide-react';

// Mock data for client orders - replace with actual data fetching
const mockClientOrders = [
  { id: 'ORD7361P', serviceName: 'E-commerce Website UI/UX', status: 'In Progress', orderDate: '2024-07-01', total: '₹24,999.00' },
  { id: 'ORD1038K', serviceName: 'Social Media Campaign Graphics', status: 'Pending Assignment', orderDate: '2024-07-05', total: '₹7,999.00' },
  { id: 'ORD2945S', serviceName: 'Startup Logo & Brand Identity', status: 'Completed', orderDate: '2024-06-20', total: '₹19,999.00' },
];

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
            <CardTitle>No Orders Yet</CardTitle>
            <CardDescription>You haven't placed any orders.</CardDescription>
          </CardHeader>
          <CardContent className="text-center py-12">
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
            <CardTitle>Order History</CardTitle>
            <CardDescription>Track your current and past orders.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockClientOrders.map((order) => (
                <Card key={order.id} className="bg-secondary/30">
                  <CardContent className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                    <div className="flex-grow">
                      <h3 className="font-semibold text-lg">{order.serviceName}</h3>
                      <p className="text-sm text-muted-foreground">Order ID: {order.id}</p>
                      <p className="text-sm text-muted-foreground">Date: {order.orderDate} | Status: <span className="font-medium text-primary">{order.status}</span></p>
                    </div>
                    <div className="flex flex-col items-start sm:items-end gap-1">
                       <p className="text-lg font-semibold">{order.total}</p>
                       <Button variant="outline" size="sm" asChild>
                        <Link href={`/client/orders/${order.id}`}>View Details</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

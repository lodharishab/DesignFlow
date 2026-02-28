
import { Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from 'lucide-react';
import { OrdersTableView } from '@/components/admin/orders/orders-table-view';
import { getAllOrders } from '@/lib/orders-db';

export const dynamic = 'force-dynamic';

export default async function AdminInProgressOrdersPage() {
  const orders = await getAllOrders();
  return (
    <Suspense fallback={<div className="flex-grow container mx-auto py-12 px-5 text-center">Loading orders...</div>}>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold font-headline flex items-center">
            <Clock className="mr-3 h-8 w-8 text-primary" />
            In Progress Orders
          </h1>
        </div>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Orders Currently In Progress</CardTitle>
            <CardDescription>These orders have been assigned to a designer and are actively being worked on.</CardDescription>
          </CardHeader>
          <CardContent>
            <OrdersTableView fixedStatusFilter="In Progress" initialOrders={orders} />
          </CardContent>
        </Card>
      </div>
    </Suspense>
  );
}

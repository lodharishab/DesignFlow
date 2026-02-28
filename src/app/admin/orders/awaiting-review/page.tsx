
import { Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye } from 'lucide-react';
import { OrdersTableView } from '@/components/admin/orders/orders-table-view';
import { getAllOrders } from '@/lib/orders-db';

export const dynamic = 'force-dynamic';

export default async function AdminAwaitingReviewOrdersPage() {
  const orders = await getAllOrders();
  return (
    <Suspense fallback={<div className="flex-grow container mx-auto py-12 px-5 text-center">Loading orders...</div>}>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold font-headline flex items-center">
            <Eye className="mr-3 h-8 w-8 text-primary" />
            Orders Awaiting Client Review
          </h1>
        </div>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Orders Awaiting Client Review</CardTitle>
            <CardDescription>Deliverables have been submitted by the designer and are pending client approval or revision requests.</CardDescription>
          </CardHeader>
          <CardContent>
            <OrdersTableView fixedStatusFilter="Awaiting Client Review" initialOrders={orders} />
          </CardContent>
        </Card>
      </div>
    </Suspense>
  );
}

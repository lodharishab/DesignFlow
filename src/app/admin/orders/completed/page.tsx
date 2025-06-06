
"use client";

import type { ReactElement } from 'react';
import { Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from 'lucide-react';
import { OrdersTableView } from '@/components/admin/orders/orders-table-view';

function AdminCompletedOrdersPageContent(): ReactElement {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-headline flex items-center">
          <CheckCircle2 className="mr-3 h-8 w-8 text-primary" />
          Completed Orders
        </h1>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Completed Orders</CardTitle>
          <CardDescription>These orders have been successfully delivered and approved by the client.</CardDescription>
        </CardHeader>
        <CardContent>
          <OrdersTableView fixedStatusFilter="Completed" />
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminCompletedOrdersPage(): ReactElement {
  return (
    <Suspense fallback={<div className="flex-grow container mx-auto py-12 px-5 text-center">Loading orders...</div>}>
      <AdminCompletedOrdersPageContent />
    </Suspense>
  )
}

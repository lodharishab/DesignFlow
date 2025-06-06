
"use client";

import type { ReactElement } from 'react';
import { Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { XCircle } from 'lucide-react';
import { OrdersTableView } from '@/components/admin/orders/orders-table-view';

function AdminCancelledOrdersPageContent(): ReactElement {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-headline flex items-center">
          <XCircle className="mr-3 h-8 w-8 text-destructive" />
          Cancelled Orders
        </h1>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Cancelled Orders</CardTitle>
          <CardDescription>These orders were cancelled by the client or admin before completion.</CardDescription>
        </CardHeader>
        <CardContent>
          <OrdersTableView fixedStatusFilter="Cancelled" />
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminCancelledOrdersPage(): ReactElement {
  return (
    <Suspense fallback={<div className="flex-grow container mx-auto py-12 px-5 text-center">Loading orders...</div>}>
      <AdminCancelledOrdersPageContent />
    </Suspense>
  )
}

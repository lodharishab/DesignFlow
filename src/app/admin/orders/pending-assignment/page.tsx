
"use client";

import type { ReactElement } from 'react';
import { Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from 'lucide-react'; // Icon for pending
import { OrdersTableView } from '@/components/admin/orders/orders-table-view';

function AdminPendingAssignmentOrdersPageContent(): ReactElement {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-headline flex items-center">
          <Loader2 className="mr-3 h-8 w-8 text-primary animate-spin" />
          Pending Assignment Orders
        </h1>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Orders Pending Assignment</CardTitle>
          <CardDescription>These orders have been placed and paid, and are awaiting designer assignment.</CardDescription>
        </CardHeader>
        <CardContent>
          <OrdersTableView fixedStatusFilter="Pending Assignment" />
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminPendingAssignmentOrdersPage(): ReactElement {
  return (
    <Suspense fallback={<div className="flex-grow container mx-auto py-12 px-5 text-center">Loading orders...</div>}>
      <AdminPendingAssignmentOrdersPageContent />
    </Suspense>
  )
}

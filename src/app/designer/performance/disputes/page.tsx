
"use client";

import type { ReactElement } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldAlert } from 'lucide-react';

export default function DesignerDisputesPage(): ReactElement {
  return (
     <Card className="text-center py-16 shadow-lg border-dashed">
        <CardContent className="space-y-4">
            <ShieldAlert className="mx-auto h-20 w-20 text-muted-foreground opacity-50" />
            <h2 className="text-2xl font-semibold font-headline">Disputes Page</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              A dedicated area for managing any payment or project disputes will be available here soon.
            </p>
        </CardContent>
    </Card>
  );
}

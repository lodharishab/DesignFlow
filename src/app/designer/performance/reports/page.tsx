
"use client";

import type { ReactElement } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileWarning } from 'lucide-react';

export default function DesignerReportsPage(): ReactElement {
  return (
    <Card className="text-center py-16 shadow-lg border-dashed">
        <CardContent className="space-y-4">
            <FileWarning className="mx-auto h-20 w-20 text-muted-foreground opacity-50" />
            <h2 className="text-2xl font-semibold font-headline">Reports Page</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              This section for viewing and managing reports against your account or projects is coming soon.
            </p>
        </CardContent>
    </Card>
  );
}

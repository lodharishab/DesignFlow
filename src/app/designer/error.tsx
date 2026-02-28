'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function DesignerError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Designer area error:', error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="rounded-full bg-destructive/10 p-4">
        <AlertTriangle className="h-10 w-10 text-destructive" />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold font-headline">Something went wrong</h2>
        <p className="text-muted-foreground max-w-md">
          We encountered an error loading this page. Please try again.
        </p>
      </div>
      <div className="flex gap-3">
        <Button onClick={reset} variant="default">Try Again</Button>
        <Button variant="outline" asChild>
          <Link href="/designer/dashboard">Back to Dashboard</Link>
        </Button>
      </div>
    </div>
  );
}

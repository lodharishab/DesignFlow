import { Button } from '@/components/ui/button';
import { FileQuestion } from 'lucide-react';
import Link from 'next/link';

export default function DesignerNotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="rounded-full bg-muted p-4">
        <FileQuestion className="h-10 w-10 text-muted-foreground" />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold font-headline">Page Not Found</h2>
        <p className="text-muted-foreground max-w-md">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
      </div>
      <Button asChild>
        <Link href="/designer/dashboard">Back to Dashboard</Link>
      </Button>
    </div>
  );
}

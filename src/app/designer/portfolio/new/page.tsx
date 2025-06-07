
import { PortfolioForm } from '@/app/designer/portfolio/components/portfolio-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AddNewPortfolioItemPage() {
  return (
    <div className="space-y-6">
      <Button variant="outline" asChild className="mb-4">
        <Link href="/designer/portfolio">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Portfolio
        </Link>
      </Button>
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Add New Portfolio Project</CardTitle>
          <CardDescription>Showcase your best work by filling out the details below.</CardDescription>
        </CardHeader>
        <CardContent>
          <PortfolioForm />
        </CardContent>
      </Card>
    </div>
  );
}

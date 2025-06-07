
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PlusCircle, Edit, Trash2, PackageSearch } from 'lucide-react';
import Image from 'next/image';
import { getPortfolioItemsByDesignerId } from '@/lib/portfolio-db';
import type { PortfolioItem } from '@/components/shared/portfolio-item-card';
import { Badge } from '@/components/ui/badge';

// Hardcoded designerId for now, replace with actual auth logic
const MOCK_DESIGNER_ID = "des001";

async function DesignerPortfolioList() {
  const portfolioItems: PortfolioItem[] = await getPortfolioItemsByDesignerId(MOCK_DESIGNER_ID);

  if (portfolioItems.length === 0) {
    return (
      <div className="text-center py-12">
        <PackageSearch className="mx-auto h-24 w-24 text-muted-foreground opacity-50" />
        <h2 className="mt-6 text-2xl font-semibold">Your Portfolio is Empty</h2>
        <p className="mt-2 text-muted-foreground">Start by adding your first project.</p>
        <Button asChild className="mt-6">
          <Link href="/designer/portfolio/new">
            <PlusCircle className="mr-2 h-5 w-5" /> Add New Project
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {portfolioItems.map((item) => (
        <Card key={item._id || item.id} className="overflow-hidden flex flex-col">
          <div className="relative aspect-video w-full">
            <Image
              src={item.coverImageUrl}
              alt={item.title}
              fill
              style={{ objectFit: 'cover' }}
              data-ai-hint={item.coverImageHint}
            />
          </div>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-headline group-hover:text-primary transition-colors">
              {item.title}
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Category: <Badge variant="outline" className="ml-1">{item.category}</Badge>
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground flex-grow">
            <p className="line-clamp-3">{item.projectDescription}</p>
          </CardContent>
          <CardContent className="pt-3 pb-4 border-t">
            <div className="flex justify-end space-x-2">
              <Button variant="outline" size="sm" asChild disabled>
                <Link href={`/designer/portfolio/edit/${item._id || item.id}`}>
                  <Edit className="mr-1.5 h-3.5 w-3.5" /> Edit (Soon)
                </Link>
              </Button>
              <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10 hover:text-destructive" disabled>
                <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Delete (Soon)
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}


export default async function DesignerPortfolioPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-headline">Manage Your Portfolio</h1>
        <Button asChild>
          <Link href="/designer/portfolio/new">
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Project
          </Link>
        </Button>
      </div>
      <DesignerPortfolioList />
    </div>
  );
}

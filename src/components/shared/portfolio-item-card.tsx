
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Eye } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  categorySlug: string;
  imageUrls: string[];
  imageHints: string[];
  description?: string;
}

interface PortfolioItemCardProps {
  item: PortfolioItem;
  className?: string;
}

export function PortfolioItemCard({ item, className }: PortfolioItemCardProps) {
  const firstImage = item.imageUrls[0] || 'https://placehold.co/600x400.png?text=No+Image';
  const firstImageHint = item.imageHints[0] || 'portfolio item';

  return (
    <Card className={cn("flex flex-col h-full shadow-lg hover:shadow-xl transition-shadow duration-300 group", className)}>
      <Link href={`/portfolio/${item.id}`} passHref legacyBehavior>
        <a className="block">
          <div className="relative aspect-video w-full rounded-t-lg overflow-hidden">
            <Image 
              src={firstImage} 
              alt={item.title} 
              fill
              style={{ objectFit: "cover" }}
              className="transition-transform duration-300 group-hover:scale-105"
              data-ai-hint={firstImageHint}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        </a>
      </Link>
      <CardHeader className="pb-3 pt-4">
        <div className="flex justify-between items-center mb-1">
           <Badge variant="outline" className="text-xs">{item.category}</Badge>
        </div>
        <Link href={`/portfolio/${item.id}`} passHref legacyBehavior>
          <a className="block">
            <CardTitle className="font-headline text-xl font-semibold leading-tight group-hover:text-primary transition-colors">
              {item.title}
            </CardTitle>
          </a>
        </Link>
      </CardHeader>
      {item.description && (
        <CardContent className="flex-grow pt-0 pb-4">
          <p className="text-sm text-muted-foreground line-clamp-3">
            {item.description}
          </p>
        </CardContent>
      )}
      <CardFooter className="pt-0">
        <Button variant="outline" asChild className="w-full">
          <Link href={`/portfolio/${item.id}`}>
            <Eye className="mr-2 h-4 w-4" /> View Project
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

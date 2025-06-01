
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ServiceCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  // tier?: 'Basic' | 'Standard' | 'Premium' | string; // Tier prop removed
  imageUrl: string;
  imageHint?: string;
}

export function ServiceCard({ id, name, description, price, category, imageUrl, imageHint = "design service" }: ServiceCardProps) {
  
  // getTierBadgeVariant function is no longer needed here

  return (
    <Card className="flex flex-col h-full shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <div className="relative aspect-video w-full mb-4 rounded-md overflow-hidden">
          <Image 
            src={imageUrl} 
            alt={name} 
            layout="fill" 
            objectFit="cover"
            data-ai-hint={imageHint}
          />
        </div>
        <div className="flex justify-between items-center mb-1">
          <Badge variant="secondary" className="w-fit">{category}</Badge>
          {/* Tier badge removed from here */}
        </div>
        <CardTitle className="mt-1 font-headline text-xl">{name}</CardTitle>
        <CardDescription className="text-sm h-16 overflow-hidden text-ellipsis">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-2xl font-semibold text-primary">${price}</p>
        <p className="text-xs text-muted-foreground">Starting price</p>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href={`/services/${id}`}>
            View Details <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

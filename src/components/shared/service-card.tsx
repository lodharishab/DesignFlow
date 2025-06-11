
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ServiceTierInfo {
  name: 'Basic' | 'Standard' | 'Premium';
  price: number;
}

interface ServiceCardProps {
  id: string;
  name: string;
  description: string;
  category: string;
  tiers: ServiceTierInfo[];
  imageUrl: string;
  imageHint?: string;
}

export function ServiceCard({ id, name, description, category, tiers, imageUrl, imageHint = "design service" }: ServiceCardProps) {
  
  const startingPrice = tiers && tiers.length > 0 
    ? Math.min(...tiers.map(tier => tier.price)) 
    : 0;

  return (
    <Card className="flex flex-col h-full shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <div className="relative aspect-video w-full mb-4 rounded-md overflow-hidden">
          <Image 
            src={imageUrl} 
            alt={name} 
            fill
            style={{ objectFit: "cover" }}
            data-ai-hint={imageHint}
          />
        </div>
        <div className="flex justify-between items-center mb-1">
          <Badge variant="secondary" className="w-fit">{category}</Badge>
        </div>
        <h3 className="mt-1 font-headline text-xl font-semibold leading-none tracking-tight">{name}</h3>
        <CardDescription className="text-sm h-16 overflow-hidden text-ellipsis">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-2xl font-semibold text-primary">₹{startingPrice.toLocaleString('en-IN')}</p>
        <p className="text-xs text-muted-foreground">Starting at</p>
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

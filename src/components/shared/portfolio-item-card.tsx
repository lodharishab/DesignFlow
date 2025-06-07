
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { UserCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export interface PortfolioItem {
  _id?: string; // MongoDB ID
  id: string; // Slug / friendly ID
  designerId?: string; // ID of the designer who created this
  title: string; // Specific project title
  category: string; // Service category - this will be the main "title" on the card
  categorySlug: string;
  clientName?: string;
  projectDate?: string;
  coverImageUrl: string;
  coverImageHint: string;
  projectDescription: string;
  galleryImages: Array<{ url: string; hint: string; caption?: string }>;
  tags?: string[];
  designer?: { 
    id: string;
    slug: string; 
    name: string; 
    avatarUrl?: string; 
    imageHint?: string;
  };
}

interface PortfolioItemCardProps {
  item: PortfolioItem;
  className?: string;
}

export function PortfolioItemCard({ item, className }: PortfolioItemCardProps) {
  return (
    <Card className={cn("flex flex-col h-full shadow-lg hover:shadow-xl transition-shadow duration-300 group overflow-hidden", className)}>
      <Link href={`/portfolio/${item.id}`} passHref legacyBehavior>
        <a className="block relative aspect-[4/3] w-full overflow-hidden rounded-t-lg">
          <Image 
            src={item.coverImageUrl} 
            alt={item.title} // Alt tag should still be specific
            fill
            style={{ objectFit: "cover" }}
            className="transition-transform duration-500 ease-in-out group-hover:scale-110"
            data-ai-hint={item.coverImageHint}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {/* Removed hover overlay with specific title for simplicity */}
        </a>
      </Link>
      <CardContent className="p-4 flex-grow flex flex-col">
        {/* Display Category as the main title */}
        <Link href={`/portfolio?category=${item.categorySlug}`} passHref legacyBehavior>
            <a className="inline-block">
                 <h3 className="font-headline text-lg text-foreground group-hover:text-primary transition-colors mb-2 leading-tight">
                    {item.category}
                </h3>
            </a>
        </Link>

        {/* Display specific project title more subtly or not at all if too much */}
        <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{item.title}</p>
        
        <div className="mt-auto flex items-center justify-between pt-2 border-t border-border/50">
          {item.designer && (
            <Link href={`/designers/${item.designer.slug}`} passHref legacyBehavior>
              <a className="flex items-center space-x-1.5 text-xs text-muted-foreground hover:text-primary group/designer">
                {item.designer.avatarUrl ? (
                  <Image src={item.designer.avatarUrl} alt={item.designer.name} width={20} height={20} className="rounded-full group-hover/designer:ring-2 group-hover/designer:ring-primary transition-all" data-ai-hint={item.designer.imageHint || 'designer avatar'} />
                ) : (
                  <UserCircle className="h-5 w-5 group-hover/designer:text-primary transition-colors" />
                )}
                <span className="group-hover/designer:underline">{item.designer.name}</span>
              </a>
            </Link>
          )}
           {/* Optionally, keep a category badge if visual distinction is still desired */}
           {/* <Badge variant="outline" className="text-xs">{item.category}</Badge> */}
        </div>
      </CardContent>
    </Card>
  );
}



"use client";

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Eye, UserCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  categorySlug: string;
  clientName?: string;
  projectDate?: string;
  coverImageUrl: string;
  coverImageHint: string;
  projectDescription: string;
  galleryImages: Array<{ url: string; hint: string; caption?: string }>;
  tags?: string[];
  designer?: { name: string; avatarUrl?: string; profileUrl?: string; imageHint?: string };
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
            alt={item.title} 
            fill
            style={{ objectFit: "cover" }}
            className="transition-transform duration-500 ease-in-out group-hover:scale-110"
            data-ai-hint={item.coverImageHint}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
            <h3 className="font-headline text-lg text-white drop-shadow-md">{item.title}</h3>
          </div>
        </a>
      </Link>
      <CardContent className="p-4 flex-grow">
        <div className="flex items-center justify-between">
            <Link href={`/portfolio?category=${item.categorySlug}`} passHref legacyBehavior>
                <a className="inline-block">
                    <Badge variant="secondary" className="text-xs hover:bg-primary/10 hover:text-primary transition-colors">
                        {item.category}
                    </Badge>
                </a>
            </Link>
          {item.designer && (
            <Link href={item.designer.profileUrl || '#'} passHref legacyBehavior>
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
        </div>
      </CardContent>
      {/* Optional: Could add a small footer with a "View Project" button if needed, but Behance style is often minimal here */}
    </Card>
  );
}

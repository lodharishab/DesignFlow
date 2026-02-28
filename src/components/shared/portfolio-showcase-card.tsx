"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { ExternalLink, PackageSearch } from 'lucide-react';
import type { PortfolioItem } from '@/components/shared/portfolio-item-card';

interface PortfolioShowcaseCardProps {
  item: PortfolioItem;
}

export const PortfolioShowcaseCard: React.FC<PortfolioShowcaseCardProps> = ({ item }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const imagesToShow = item.galleryImages && item.galleryImages.length > 0 ? item.galleryImages : [{ url: item.coverImageUrl, hint: item.coverImageHint || item.title, caption: item.title }];

  useEffect(() => {
    if (imagesToShow.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imagesToShow.length);
    }, 3500);

    return () => clearInterval(timer);
  }, [imagesToShow, imagesToShow.length]);

  if (imagesToShow.length === 0) {
    return (
      <Card className="overflow-hidden shadow-lg h-full flex flex-col group">
        <div className="block relative aspect-[4/3] w-full bg-muted flex items-center justify-center">
           <PackageSearch className="w-16 h-16 text-muted-foreground opacity-50" />
        </div>
        <CardContent className="p-4 bg-card flex-grow">
          <h3 className="font-headline text-lg font-semibold group-hover:text-primary transition-colors">{item.category}</h3>
           <p className="text-xs text-destructive mt-1">Image(s) missing</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden shadow-lg h-full flex flex-col group">
        <Link href={`/portfolio/${item.id}`} className="block relative aspect-[4/3] w-full">
            <Image
            key={imagesToShow[currentImageIndex].url}
            src={imagesToShow[currentImageIndex].url}
            alt={imagesToShow[currentImageIndex].caption || item.title}
            fill
            style={{ objectFit: 'cover' }}
            className="transition-all duration-500 ease-in-out group-hover:scale-105"
            data-ai-hint={imagesToShow[currentImageIndex].hint}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={currentImageIndex === 0}
            />
             <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                 <ExternalLink className="h-5 w-5 text-white/80" />
            </div>
        </Link>
      <CardContent className="p-4 bg-card flex-grow">
        <Link href={`/services?category=${item.categorySlug}`} className="inline-block">
           <h3 className="font-headline text-xl text-foreground group-hover:text-primary transition-colors leading-tight">
              {item.category}
           </h3>
        </Link>
        {item.designer && (
            <Link href={`/designers/${item.designer.slug}`} className="text-xs text-muted-foreground mt-1 hover:text-primary hover:underline block">
                By {item.designer.name}
            </Link>
        )}
      </CardContent>
    </Card>
  );
};

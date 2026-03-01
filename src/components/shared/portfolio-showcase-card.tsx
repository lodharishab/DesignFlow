"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardBody } from '@heroui/react';
import { ExternalLink, PackageSearch } from 'lucide-react';
import type { PortfolioItem } from '@/components/shared/portfolio-item-card';
import { motion } from 'framer-motion';

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
      <Card className="overflow-hidden h-full bg-content1/60 border border-divider/50">
        <div className="relative aspect-[4/3] w-full bg-content2 flex items-center justify-center">
          <PackageSearch className="w-16 h-16 text-default-300" />
        </div>
        <CardBody className="p-4">
          <h3 className="font-headline text-lg font-semibold">{item.category}</h3>
          <p className="text-xs text-danger mt-1">Image(s) missing</p>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card
      as={motion.div}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="overflow-hidden h-full bg-content1/60 backdrop-blur-sm border border-divider/50 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 group"
    >
      <Link href={`/portfolio/${item.id}`} className="block relative aspect-[4/3] w-full overflow-hidden">
        <Image
          key={imagesToShow[currentImageIndex].url}
          src={imagesToShow[currentImageIndex].url}
          alt={imagesToShow[currentImageIndex].caption || item.title}
          fill
          style={{ objectFit: 'cover' }}
          className="transition-transform duration-500 group-hover:scale-105"
          data-ai-hint={imagesToShow[currentImageIndex].hint}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={currentImageIndex === 0}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
          <ExternalLink className="h-5 w-5 text-white/90" />
        </div>
      </Link>
      <CardBody className="p-4">
        <Link href={`/services?category=${item.categorySlug}`} className="inline-block">
          <h3 className="font-headline text-lg text-foreground group-hover:text-primary transition-colors leading-tight font-semibold">
            {item.category}
          </h3>
        </Link>
        {item.designer && (
          <Link href={`/designers/${item.designer.slug}`} className="text-xs text-default-400 mt-1 hover:text-primary block transition-colors">
            By {item.designer.name}
          </Link>
        )}
      </CardBody>
    </Card>
  );
};

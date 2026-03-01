
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, IndianRupee } from 'lucide-react';
import { Card, CardBody, CardFooter, CardHeader, Chip, Button } from '@heroui/react';
import { motion } from 'framer-motion';

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
    <Link href={`/services/${id}`} className="block h-full group">
      <Card
        as={motion.div}
        whileHover={{ y: -6 }}
        transition={{ duration: 0.25 }}
        className="h-full bg-content1/60 backdrop-blur-sm border border-divider/50 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 overflow-hidden"
      >
        <CardHeader className="p-0 overflow-hidden">
          <div className="relative aspect-[16/10] w-full">
            <Image
              src={imageUrl}
              alt={name}
              fill
              style={{ objectFit: "cover" }}
              data-ai-hint={imageHint}
              className="group-hover:scale-105 transition-transform duration-700"
            />
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute top-3 left-3">
              <Chip size="sm" color="primary" variant="solid" className="shadow-md text-[11px]">
                {category}
              </Chip>
            </div>
            {/* Price badge — positioned at bottom-right of image */}
            <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
              <div className="bg-white/95 dark:bg-content1/95 backdrop-blur-sm rounded-lg px-3 py-1.5 shadow-lg">
                <span className="text-sm font-bold text-primary">₹{startingPrice.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardBody className="px-5 pt-4 pb-2 flex-grow">
          <h3 className="font-headline text-lg font-semibold mb-1 line-clamp-1 group-hover:text-primary transition-colors">{name}</h3>
          <p className="text-default-500 text-sm line-clamp-2 leading-relaxed">{description}</p>
        </CardBody>
        <CardFooter className="px-5 pb-4 flex items-center justify-between">
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              ₹{startingPrice.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-default-400">onwards</span>
          </div>
          <span className="text-xs text-primary font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            View <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
}

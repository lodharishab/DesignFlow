
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
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
    <Card
      as={motion.div}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="h-full bg-content1/60 backdrop-blur-sm border border-divider/50 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 overflow-hidden"
    >
      <CardHeader className="p-0 overflow-hidden">
        <div className="relative aspect-video w-full group">
          <Image
            src={imageUrl}
            alt={name}
            fill
            style={{ objectFit: "cover" }}
            data-ai-hint={imageHint}
            className="group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 left-3">
            <Chip size="sm" color="primary" variant="flat" className="backdrop-blur-sm">
              {category}
            </Chip>
          </div>
        </div>
      </CardHeader>
      <CardBody className="px-4 pt-4 pb-2 flex-grow">
        <h3 className="font-headline text-lg font-semibold mb-1 line-clamp-1">{name}</h3>
        <p className="text-default-500 text-sm line-clamp-2 mb-3">{description}</p>
        <div>
          <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            ₹{startingPrice.toLocaleString('en-IN')}
          </span>
          <span className="text-xs text-default-400 ml-1">starting at</span>
        </div>
      </CardBody>
      <CardFooter className="px-4 pb-4">
        <Button
          as={Link}
          href={`/services/${id}`}
          color="primary"
          variant="flat"
          fullWidth
          radius="lg"
          endContent={<ArrowRight className="h-4 w-4" />}
          className="font-medium"
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}

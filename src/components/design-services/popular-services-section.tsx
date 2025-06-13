
"use client";

import { useState }  from 'react';
import { ServiceCard } from '@/components/shared/service-card';
import { Button } from '@/components/ui/button';
import { ArrowDown } from 'lucide-react';

interface ServiceTierInfo {
  name: 'Basic' | 'Standard' | 'Premium'; // Adjust if tiers can have other names
  price: number;
}

export interface ServiceData { // Exporting for use in the parent page
  id: string;
  name: string;
  description: string;
  tiers: ServiceTierInfo[];
  category: string;
  imageUrl: string;
  imageHint: string;
}

interface PopularServicesSectionProps {
  initialServices: ServiceData[];
  allServices: ServiceData[]; // All available popular services
}

const ITEMS_PER_LOAD = 6;

export function PopularServicesSection({ initialServices, allServices }: PopularServicesSectionProps) {
  const [displayedServices, setDisplayedServices] = useState<ServiceData[]>(initialServices);
  const [loadedCount, setLoadedCount] = useState<number>(initialServices.length);

  const handleLoadMore = () => {
    const newLoadedCount = loadedCount + ITEMS_PER_LOAD;
    const nextServices = allServices.slice(loadedCount, newLoadedCount);
    setDisplayedServices(prevServices => [...prevServices, ...nextServices]);
    setLoadedCount(newLoadedCount);
  };

  const canLoadMore = loadedCount < allServices.length;

  return (
    <>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {displayedServices.map(service => (
          <ServiceCard key={service.id} {...service} />
        ))}
      </div>
      {canLoadMore && (
        <div className="text-center mt-12">
          <Button size="lg" variant="outline" onClick={handleLoadMore}>
            <ArrowDown className="mr-2 h-4 w-4" /> Load More Services
          </Button>
        </div>
      )}
    </>
  );
}

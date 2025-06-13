
"use client";

import { useState, useEffect, useCallback }  from 'react';
import { ServiceCard } from '@/components/shared/service-card';
import { Loader2 } from 'lucide-react'; 

interface ServiceTierInfo {
  name: 'Basic' | 'Standard' | 'Premium'; 
  price: number;
}

export interface ServiceData { 
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
  allServices: ServiceData[]; 
}

const ITEMS_PER_LOAD = 6;
const MAX_SCROLL_LOADS = 2; // Maximum number of times to auto-load on scroll

export function PopularServicesSection({ initialServices, allServices }: PopularServicesSectionProps) {
  const [displayedServices, setDisplayedServices] = useState<ServiceData[]>(initialServices);
  const [loadedCount, setLoadedCount] = useState<number>(initialServices.length);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [scrollLoadsCount, setScrollLoadsCount] = useState<number>(0);

  const canLoadMoreItems = loadedCount < allServices.length;
  const canAutoLoadOnScroll = scrollLoadsCount < MAX_SCROLL_LOADS;

  const handleLoadMore = useCallback(() => {
    if (!canLoadMoreItems || isLoadingMore) return;

    setIsLoadingMore(true);
    
    setTimeout(() => {
      const newLoadedCount = Math.min(loadedCount + ITEMS_PER_LOAD, allServices.length);
      const nextServicesToLoad = allServices.slice(loadedCount, newLoadedCount);
      
      setDisplayedServices(prevServices => {
        const existingIds = new Set(prevServices.map(s => s.id));
        const uniqueNextServices = nextServicesToLoad.filter(s => !existingIds.has(s.id));
        return [...prevServices, ...uniqueNextServices];
      });

      setLoadedCount(newLoadedCount);
      if (nextServicesToLoad.length > 0) { // Only increment if new items were actually attempted to be loaded
        setScrollLoadsCount(prevCount => prevCount + 1); 
      }
      setIsLoadingMore(false);
    }, 500); 
  }, [allServices, canLoadMoreItems, isLoadingMore, loadedCount]);

  useEffect(() => {
    const handleScroll = () => {
      const buffer = 200; 
      if (
        window.innerHeight + window.scrollY >= document.documentElement.offsetHeight - buffer &&
        canLoadMoreItems &&
        canAutoLoadOnScroll && 
        !isLoadingMore
      ) {
        handleLoadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll); 

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [canLoadMoreItems, canAutoLoadOnScroll, isLoadingMore, handleLoadMore]);


  return (
    <>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {displayedServices.map(service => (
          <ServiceCard key={service.id} {...service} />
        ))}
      </div>
      {isLoadingMore && (
        <div className="text-center mt-12 py-6 flex justify-center items-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mr-3" />
          <p className="text-muted-foreground">Loading more services...</p>
        </div>
      )}
      {!isLoadingMore && !canLoadMoreItems && displayedServices.length > initialServices.length && (
         <div className="text-center mt-12 py-6">
          <p className="text-muted-foreground">You've reached the end of our popular services!</p>
        </div>
      )}
    </>
  );
}

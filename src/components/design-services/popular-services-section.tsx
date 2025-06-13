
"use client";

import { useState, useEffect, useCallback }  from 'react';
import { ServiceCard } from '@/components/shared/service-card';
// Removed Button and ArrowDown import as they are no longer used.
import { Loader2 } from 'lucide-react'; // For a subtle loading indicator

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

export function PopularServicesSection({ initialServices, allServices }: PopularServicesSectionProps) {
  const [displayedServices, setDisplayedServices] = useState<ServiceData[]>(initialServices);
  const [loadedCount, setLoadedCount] = useState<number>(initialServices.length);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

  const canLoadMore = loadedCount < allServices.length;

  const handleLoadMore = useCallback(() => {
    if (!canLoadMore || isLoadingMore) return;

    setIsLoadingMore(true);
    
    // Simulate network delay for loading
    setTimeout(() => {
      const newLoadedCount = loadedCount + ITEMS_PER_LOAD;
      const nextServices = allServices.slice(loadedCount, newLoadedCount);
      setDisplayedServices(prevServices => [...prevServices, ...nextServices]);
      setLoadedCount(newLoadedCount);
      setIsLoadingMore(false);
    }, 500); // Adjust delay as needed
  }, [allServices, canLoadMore, isLoadingMore, loadedCount]);

  useEffect(() => {
    const handleScroll = () => {
      // Check if user is near the bottom of the page
      // window.innerHeight: The height of the browser window's viewport.
      // window.scrollY: The number of pixels that the document is currently scrolled vertically.
      // document.documentElement.offsetHeight: The height of the entire HTML document.
      // Buffer: Load a bit before reaching the absolute bottom
      const buffer = 200; 
      if (
        window.innerHeight + window.scrollY >= document.documentElement.offsetHeight - buffer &&
        canLoadMore &&
        !isLoadingMore
      ) {
        handleLoadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll); // Also check on resize

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [canLoadMore, isLoadingMore, handleLoadMore]);


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
      {!isLoadingMore && !canLoadMore && displayedServices.length > initialServices.length && (
         <div className="text-center mt-12 py-6">
          <p className="text-muted-foreground">You've reached the end of our popular services!</p>
        </div>
      )}
    </>
  );
}


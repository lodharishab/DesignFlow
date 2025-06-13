
"use client";

import { useState, useEffect, useCallback, useRef }  from 'react';
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
const MAX_SCROLL_LOADS = 3; 

export function PopularServicesSection({ initialServices, allServices }: PopularServicesSectionProps) {
  const [displayedServices, setDisplayedServices] = useState<ServiceData[]>(initialServices);
  const [loadedCount, setLoadedCount] = useState<number>(initialServices.length);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [scrollLoadsCount, setScrollLoadsCount] = useState<number>(0); 
  const sentinelRef = useRef<HTMLDivElement>(null); // Ref for the sentinel element

  const canLoadMoreItems = loadedCount < allServices.length;
  const canAutoLoadOnScroll = scrollLoadsCount < MAX_SCROLL_LOADS;

  const handleLoadMore = useCallback(() => {
    if (!canLoadMoreItems || isLoadingMore || !canAutoLoadOnScroll) return;

    setIsLoadingMore(true);
    
    setTimeout(() => {
      const newLoadedCount = Math.min(loadedCount + ITEMS_PER_LOAD, allServices.length);
      const nextServicesToLoad = allServices.slice(loadedCount, newLoadedCount);
      
      if (nextServicesToLoad.length > 0) {
        setDisplayedServices(prevServices => {
          const existingIds = new Set(prevServices.map(s => s.id));
          const uniqueNextServices = nextServicesToLoad.filter(s => !existingIds.has(s.id));
          return [...prevServices, ...uniqueNextServices];
        });
        setLoadedCount(newLoadedCount);
        setScrollLoadsCount(prevCount => prevCount + 1);
      }
      setIsLoadingMore(false);
    }, 500); 
  }, [allServices, canLoadMoreItems, isLoadingMore, loadedCount, canAutoLoadOnScroll]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && canLoadMoreItems && canAutoLoadOnScroll && !isLoadingMore) {
          handleLoadMore();
        }
      },
      { threshold: 1.0 } // Trigger when sentinel is fully visible
    );

    const currentSentinel = sentinelRef.current;
    if (currentSentinel) {
      observer.observe(currentSentinel);
    }

    return () => {
      if (currentSentinel) {
        observer.unobserve(currentSentinel);
      }
    };
  }, [canLoadMoreItems, canAutoLoadOnScroll, isLoadingMore, handleLoadMore]);


  return (
    <>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {displayedServices.map(service => (
          <ServiceCard key={service.id} {...service} />
        ))}
      </div>
      
      {/* Sentinel element for intersection observer */}
      <div ref={sentinelRef} style={{ height: '1px' }} />

      {isLoadingMore && (
        <div className="text-center mt-12 py-6 flex justify-center items-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mr-3" />
          <p className="text-muted-foreground">Loading more services...</p>
        </div>
      )}
      
      {!isLoadingMore && !canLoadMoreItems && displayedServices.length > 0 && (
        <div className="text-center mt-12 py-6">
          <p className="text-muted-foreground">
            You've seen all our popular highlights! For even more options, explore our full service catalog using the button below on this page.
          </p>
        </div>
      )}

      {!isLoadingMore && canLoadMoreItems && !canAutoLoadOnScroll && (
         <div className="text-center mt-12 py-6">
          <p className="text-muted-foreground">
            You've seen our initial popular services. For more, explore our full service catalog using the button below on this page.
          </p>
        </div>
      )}
    </>
  );
}

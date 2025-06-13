
"use client";

import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { PortfolioItemCard, type PortfolioItem } from '@/components/shared/portfolio-item-card';
import { PackageSearch, ListFilter, X, Tag, Palette, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { allPortfolioItemsData } from './page'; // Import from the page.tsx which exports it

const ITEMS_PER_LOAD = 6;
const MAX_SCROLL_LOADS = 2;

export const PortfolioPageContent = () => {
  const searchParams = useSearchParams();
  const initialCategorySlug = searchParams.get('category');

  const [activeCategorySlug, setActiveCategorySlug] = useState<string | null>(initialCategorySlug);
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());

  useEffect(() => {
    setActiveCategorySlug(initialCategorySlug);
  }, [initialCategorySlug]);

  const uniqueCategories = useMemo(() => {
    const categoriesMap = new Map<string, { name: string, slug: string }>();
    allPortfolioItemsData.forEach(item => {
      if (!categoriesMap.has(item.categorySlug)) {
        categoriesMap.set(item.categorySlug, { name: item.category, slug: item.categorySlug });
      }
    });
    return Array.from(categoriesMap.values()).sort((a,b) => a.name.localeCompare(b.name));
  }, []);

  const uniqueTags = useMemo(() => {
    const tagsSet = new Set<string>();
    allPortfolioItemsData.forEach(item => {
      item.tags?.forEach(tag => tagsSet.add(tag.toLowerCase()));
    });
    return Array.from(tagsSet).sort();
  }, []);

  const handleCategoryClick = useCallback((slug: string | null) => {
    setActiveCategorySlug(slug);
  }, []);

  const handleTagChange = useCallback((tag: string, checked: boolean) => {
    setSelectedTags(prev => {
      const newSet = new Set(prev);
      if (checked) newSet.add(tag);
      else newSet.delete(tag);
      return newSet;
    });
  }, []);

  const clearAllFilters = useCallback(() => {
    setActiveCategorySlug(null);
    setSelectedTags(new Set());
  }, []);

  const filteredPortfolioItems = useMemo(() => {
    return allPortfolioItemsData.filter(item => {
      const categoryMatch = !activeCategorySlug || item.categorySlug === activeCategorySlug;
      const tagsMatch = selectedTags.size === 0 || item.tags?.some(tag => selectedTags.has(tag.toLowerCase()));
      return categoryMatch && tagsMatch;
    });
  }, [activeCategorySlug, selectedTags]);

  // State for pagination/infinite scroll
  const [displayedPortfolioItems, setDisplayedPortfolioItems] = useState<PortfolioItem[]>([]);
  const [loadedCount, setLoadedCount] = useState<number>(0);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [scrollLoadsCount, setScrollLoadsCount] = useState<number>(0);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Effect to initialize/reset displayed items when filters change
  useEffect(() => {
    const initialDisplay = filteredPortfolioItems.slice(0, ITEMS_PER_LOAD);
    setDisplayedPortfolioItems(initialDisplay);
    setLoadedCount(initialDisplay.length);
    setScrollLoadsCount(0);
    setIsLoadingMore(false); // Reset loading state
  }, [filteredPortfolioItems]);

  const canLoadMoreItems = loadedCount < filteredPortfolioItems.length;
  const canAutoLoadOnScroll = scrollLoadsCount < MAX_SCROLL_LOADS;

  const handleLoadMore = useCallback(() => {
    if (!canLoadMoreItems || isLoadingMore || !canAutoLoadOnScroll) return;

    setIsLoadingMore(true);

    setTimeout(() => {
      const nextItemsToLoad = filteredPortfolioItems.slice(loadedCount, loadedCount + ITEMS_PER_LOAD);

      if (nextItemsToLoad.length > 0) {
        setDisplayedPortfolioItems(prevItems => {
          const existingIds = new Set(prevItems.map(item => item.id));
          const uniqueNextItems = nextItemsToLoad.filter(item => !existingIds.has(item.id));
          return [...prevItems, ...uniqueNextItems];
        });
        setLoadedCount(prevLoaded => prevLoaded + nextItemsToLoad.length);
        setScrollLoadsCount(prev => prev + 1);
      }
      setIsLoadingMore(false);
    }, 500); // Simulate network delay
  }, [canLoadMoreItems, isLoadingMore, canAutoLoadOnScroll, loadedCount, filteredPortfolioItems, scrollLoadsCount]);

  // IntersectionObserver effect
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && canLoadMoreItems && canAutoLoadOnScroll && !isLoadingMore) {
          handleLoadMore();
        }
      },
      { threshold: 1.0 }
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
  
  const noItemsMatchFilters = filteredPortfolioItems.length === 0;

  return (
    <>
      <div className="text-center mb-12">
          <h1 className="text-4xl font-bold font-headline mb-4">Explore Our Work</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Dive into a curated collection of projects crafted by our talented designers. Get inspired and see the quality we deliver.
          </p>
      </div>

      <div className="md:grid md:grid-cols-[300px_1fr] md:gap-8">
        <aside className="mb-8 md:mb-0 md:sticky md:top-24 md:h-[calc(100vh-7rem)] md:overflow-y-auto pr-4">
          <Card className="shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-lg font-headline flex items-center"><ListFilter className="mr-2 h-5 w-5 text-primary" /> Filters</CardTitle>
              {(activeCategorySlug || selectedTags.size > 0) && (
                <Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-xs">
                  <X className="mr-1 h-3 w-3" /> Clear All
                </Button>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              <section>
                <h3 className="text-md font-semibold mb-3 flex items-center"><Palette className="mr-2 h-4 w-4 text-muted-foreground" />Categories</h3>
                <ul className="space-y-1.5">
                  <li>
                    <Button
                      variant={!activeCategorySlug ? 'secondary' : 'ghost'}
                      className="w-full justify-start text-sm h-8 px-2"
                      onClick={() => handleCategoryClick(null)}
                    >
                      All Projects
                    </Button>
                  </li>
                  {uniqueCategories.map(category => (
                    <li key={category.slug}>
                      <Button
                        variant={activeCategorySlug === category.slug ? 'secondary' : 'ghost'}
                        className="w-full justify-start text-sm h-8 px-2"
                        onClick={() => handleCategoryClick(category.slug)}
                      >
                        {category.name}
                      </Button>
                    </li>
                  ))}
                </ul>
              </section>
              <Separator />
              {uniqueTags.length > 0 && (
                <section>
                  <h3 className="text-md font-semibold mb-3 flex items-center"><Tag className="mr-2 h-4 w-4 text-muted-foreground" />Tags</h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {uniqueTags.map(tag => (
                      <div key={tag} className="flex items-center space-x-2">
                        <Checkbox
                          id={`tag-${tag.replace(/\s+/g, '-')}`}
                          checked={selectedTags.has(tag)}
                          onCheckedChange={(checked) => handleTagChange(tag, !!checked)}
                        />
                        <Label htmlFor={`tag-${tag.replace(/\s+/g, '-')}`} className="text-sm font-normal capitalize cursor-pointer">
                          {tag}
                        </Label>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </CardContent>
          </Card>
        </aside>

        <div className="min-w-0">
          {noItemsMatchFilters && !isLoadingMore ? (
            <div className="text-center py-16 col-span-full flex flex-col items-center justify-center h-full">
              <PackageSearch className="mx-auto h-24 w-24 text-muted-foreground opacity-50" />
              <h2 className="mt-6 text-2xl font-semibold">No Projects Found</h2>
              <p className="mt-2 text-muted-foreground">
                Try adjusting your filters or check back later for new projects.
              </p>
              <Button variant="link" onClick={clearAllFilters} className="mt-4">
                Clear All Filters
              </Button>
            </div>
          ) : (
            displayedPortfolioItems.length > 0 && (
                 <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
                    {displayedPortfolioItems.map(item => (
                        <PortfolioItemCard key={item.id} item={item} />
                    ))}
                </div>
            )
          )}

          <div ref={sentinelRef} style={{ height: '1px' }} />

          {isLoadingMore && (
            <div className="text-center mt-12 py-6 flex justify-center items-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary mr-3" />
              <p className="text-muted-foreground">Loading more projects...</p>
            </div>
          )}

          {!isLoadingMore && !canLoadMoreItems && displayedPortfolioItems.length > 0 && !noItemsMatchFilters && (
            <div className="text-center mt-12 py-6">
              <p className="text-muted-foreground">You've reached the end of the portfolio results for the current filters.</p>
            </div>
          )}
          {!isLoadingMore && canLoadMoreItems && !canAutoLoadOnScroll && displayedPortfolioItems.length > 0 && !noItemsMatchFilters && (
             <div className="text-center mt-12 py-6">
              <p className="text-muted-foreground">Scroll limit reached. Refine filters or browse other categories for more.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};



"use client";

import { useState, useMemo, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { PortfolioItemCard } from '@/components/shared/portfolio-item-card';
// type PortfolioItem is defined in page.tsx and passed via allPortfolioItemsData
import { PackageSearch, ListFilter, X, Tag, Users, Palette } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { designersData } from '@/lib/designer-data';
import { allPortfolioItemsData } from './page'; // Import from the page.tsx which exports it

export const PortfolioPageContent = () => {
  const searchParams = useSearchParams();
  const initialCategorySlug = searchParams.get('category');

  const [activeCategorySlug, setActiveCategorySlug] = useState<string | null>(initialCategorySlug);
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [selectedDesigners, setSelectedDesigners] = useState<Set<string>>(new Set());

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

  const uniqueDesigners = useMemo(() => {
    const designersMap = new Map<string, { id: string, name: string, slug: string }>();
    allPortfolioItemsData.forEach(item => {
      if (item.designer && !designersMap.has(item.designer.id)) {
        designersMap.set(item.designer.id, { id: item.designer.id, name: item.designer.name, slug: item.designer.slug });
      }
    });
    return Array.from(designersMap.values()).sort((a,b) => a.name.localeCompare(b.name));
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

  const handleDesignerChange = useCallback((designerName: string, checked: boolean) => {
    setSelectedDesigners(prev => {
      const newSet = new Set(prev);
      if (checked) newSet.add(designerName);
      else newSet.delete(designerName);
      return newSet;
    });
  }, []);

  const clearAllFilters = useCallback(() => {
    setActiveCategorySlug(null);
    setSelectedTags(new Set());
    setSelectedDesigners(new Set());
  }, []);

  const filteredPortfolioItems = useMemo(() => {
    return allPortfolioItemsData.filter(item => {
      const categoryMatch = !activeCategorySlug || item.categorySlug === activeCategorySlug;
      const tagsMatch = selectedTags.size === 0 || item.tags?.some(tag => selectedTags.has(tag.toLowerCase()));
      const designerMatch = selectedDesigners.size === 0 || (item.designer?.name && selectedDesigners.has(item.designer.name));
      return categoryMatch && tagsMatch && designerMatch;
    });
  }, [activeCategorySlug, selectedTags, selectedDesigners]);

  return (
    <>
      <div className="text-center mb-12">
          <h1 className="text-4xl font-bold font-headline mb-4">Explore Our Work</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Dive into a curated collection of projects crafted by our talented designers. Get inspired and see the quality we deliver.
          </p>
      </div>

      <div className="md:grid md:grid-cols-[300px_1fr] md:gap-8">
        {/* Filter Sidebar */}
        <aside className="mb-8 md:mb-0 md:sticky md:top-24 md:h-[calc(100vh-7rem)] md:overflow-y-auto pr-4">
          <Card className="shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-lg font-headline flex items-center"><ListFilter className="mr-2 h-5 w-5 text-primary" /> Filters</CardTitle>
              {(activeCategorySlug || selectedTags.size > 0 || selectedDesigners.size > 0) && (
                <Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-xs">
                  <X className="mr-1 h-3 w-3" /> Clear All
                </Button>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Categories Filter */}
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
              {/* Tags Filter */}
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
              <Separator />
              {/* Designers Filter */}
              {uniqueDesigners.length > 0 && (
                <section>
                  <h3 className="text-md font-semibold mb-3 flex items-center"><Users className="mr-2 h-4 w-4 text-muted-foreground" />Designers</h3>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {uniqueDesigners.map(designer => (
                      <div key={designer.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`designer-${designer.id}`}
                          checked={selectedDesigners.has(designer.name)}
                          onCheckedChange={(checked) => handleDesignerChange(designer.name, !!checked)}
                        />
                        <Label htmlFor={`designer-${designer.id}`} className="text-sm font-normal cursor-pointer">
                          {designer.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </CardContent>
          </Card>
        </aside>

        {/* Portfolio Grid */}
        <div className="min-w-0">
          {filteredPortfolioItems.length > 0 ? (
            <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
              {filteredPortfolioItems.map(item => (
                <PortfolioItemCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
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
          )}
        </div>
      </div>
    </>
  );
};

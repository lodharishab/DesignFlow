
"use client";

import { ServiceCard } from '@/components/shared/service-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Palette, Share2, Printer, Laptop, Brush as BrushIcon, Package as PackageIconLucide, ListFilter, Search, Check, Tag, Film, Presentation, Camera } from 'lucide-react'; 
import type { LucideIcon } from 'lucide-react'; 
import { useState, useMemo, useEffect } from 'react'; 
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useSearchParams } from 'next/navigation';
import { getAllServices, type ServiceData as DbServiceData } from '@/lib/services-db';

interface ServiceTier {
  name: 'Basic' | 'Standard' | 'Premium';
  price: number;
}

interface Service {
  id: string;
  name: string;
  description: string; 
  category: string;
  categorySlug: string;
  imageUrl: string;
  imageHint: string;
  tiers: ServiceTier[];
  tags?: string[];
}

// Map DB service to local Service type
function mapDbService(s: DbServiceData): Service {
  return {
    id: s.id,
    name: s.name,
    description: s.generalDescription || '',
    category: s.category || '',
    categorySlug: s.categorySlug || '',
    imageUrl: s.imageUrl || 'https://placehold.co/600x400.png',
    imageHint: s.imageHint || s.name.toLowerCase(),
    tiers: s.tiers.map(t => ({ name: t.name as 'Basic' | 'Standard' | 'Premium', price: t.price })),
    tags: s.tags || [],
  };
}

interface CategoryFilterItem {
  name: string;
  icon: LucideIcon;
  slug: string;
}

const categoryFilters: CategoryFilterItem[] = [
  { name: 'Logo Design', icon: Palette, slug: 'logo-design' },
  { name: 'Social Media', icon: Share2, slug: 'social-media' },
  { name: 'Print Design', icon: Printer, slug: 'print-design' },
  { name: 'UI/UX Design', icon: Laptop, slug: 'ui-ux-design' },
  { name: 'Illustration', icon: BrushIcon, slug: 'illustration' },
  { name: 'Packaging', icon: PackageIconLucide, slug: 'packaging' },
  { name: 'Motion Graphics', icon: Film, slug: 'motion-graphics' },
  { name: 'Presentations', icon: Presentation, slug: 'presentations' },
  { name: 'Photography', icon: Camera, slug: 'photography' },
];

const sortOptions = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
];

export function ServicesPageClientContent() {
  const searchParams = useSearchParams(); 
  const initialCategorySlug = searchParams.get('category');

  const [services, setServices] = useState<Service[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [selectedTiers, setSelectedTiers] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<string>('relevance');

  // Load services from DB
  useEffect(() => {
    getAllServices().then(dbServices => setServices(dbServices.map(mapDbService)));
  }, []);

  // Derived filter values
  const uniqueTags = useMemo(() => 
    Array.from(new Set(services.flatMap(service => service.tags || []).map(tag => tag.toLowerCase()))).sort(),
    [services]
  );
  const uniqueTierNames = useMemo(() => 
    Array.from(new Set(services.flatMap(service => service.tiers.map(tier => tier.name)))).sort(),
    [services]
  );

  useEffect(() => {
    if (initialCategorySlug) {
      const categoryFromUrl = categoryFilters.find(cat => cat.slug === initialCategorySlug);
      if (categoryFromUrl) {
        setActiveCategory(categoryFromUrl.name);
      }
    } else {
      setActiveCategory(null); // Ensure it resets if param is removed
    }
  }, [initialCategorySlug]);

  const handleCategoryClick = (categoryName: string | null) => {
    setActiveCategory(prev => prev === categoryName ? null : categoryName);
  };

  const handleTagChange = (tag: string, checked: boolean) => {
    setSelectedTags(prev => {
      const newSet = new Set(prev);
      if (checked) newSet.add(tag);
      else newSet.delete(tag);
      return newSet;
    });
  };

  const handleTierChange = (tierName: string, checked: boolean) => {
    setSelectedTiers(prev => {
      const newSet = new Set(prev);
      if (checked) newSet.add(tierName);
      else newSet.delete(tierName);
      return newSet;
    });
  };
  
  const clearAllFilters = () => {
    setActiveCategory(null);
    setSelectedTags(new Set());
    setSelectedTiers(new Set());
    setSearchTerm('');
  };


  const displayedServices = useMemo(() => {
    let filtered = [...services];

    if (activeCategory) {
      filtered = filtered.filter(service => service.category === activeCategory);
    }

    if (selectedTags.size > 0) {
      filtered = filtered.filter(service => 
        service.tags?.some(tag => selectedTags.has(tag.toLowerCase()))
      );
    }

    if (selectedTiers.size > 0) {
      filtered = filtered.filter(service => 
        service.tiers.some(tier => selectedTiers.has(tier.name))
      );
    }
    
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(service => 
        service.name.toLowerCase().includes(lowerSearchTerm) ||
        service.description.toLowerCase().includes(lowerSearchTerm) ||
        service.category.toLowerCase().includes(lowerSearchTerm) ||
        service.tags?.some(tag => tag.toLowerCase().includes(lowerSearchTerm))
      );
    }
    
    if (sortBy === 'price-asc') {
      filtered.sort((a, b) => Math.min(...a.tiers.map(t => t.price)) - Math.min(...b.tiers.map(t => t.price)));
    } else if (sortBy === 'price-desc') {
      filtered.sort((a, b) => Math.min(...b.tiers.map(t => t.price)) - Math.min(...a.tiers.map(t => t.price)));
    }

    return filtered;
  }, [services, activeCategory, selectedTags, selectedTiers, searchTerm, sortBy]);


  return (
    <>
      <h1 className="text-4xl font-bold font-headline mb-8 text-center">Explore Our Design Services</h1>
      
      <div className="md:grid md:grid-cols-[300px_1fr] md:gap-8">
        <aside className="mb-8 md:mb-0 md:sticky md:top-24 md:self-start md:h-[calc(100vh-8rem)] md:overflow-y-auto pr-2 pb-4">
          <Card className="shadow-md">
             <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-lg font-headline flex items-center"><ListFilter className="mr-2 h-5 w-5 text-primary" /> Filters</CardTitle>
              {(activeCategory || selectedTags.size > 0 || selectedTiers.size > 0 || searchTerm) && (
                <Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-xs">
                  <Check className="mr-1 h-3 w-3" /> Clear All
                </Button>
              )}
            </CardHeader>
            <CardContent className="space-y-5">
              <section>
                <h3 className="text-md font-semibold mb-2 flex items-center"><Palette className="mr-2 h-4 w-4 text-muted-foreground" />Categories</h3>
                <ul className="space-y-1">
                  <li>
                    <Button
                      variant={!activeCategory ? 'secondary' : 'ghost'}
                      className="w-full justify-start text-sm h-8 px-2"
                      onClick={() => handleCategoryClick(null)}
                    >
                      All Services
                    </Button>
                  </li>
                  {categoryFilters.map(category => (
                    <li key={category.slug}>
                      <Button
                        variant={activeCategory === category.name ? 'secondary' : 'ghost'}
                        className="w-full justify-start text-sm h-8 px-2"
                        onClick={() => handleCategoryClick(category.name)}
                      >
                        <category.icon className="mr-2 h-4 w-4 text-primary/80" />
                        {category.name}
                      </Button>
                    </li>
                  ))}
                </ul>
              </section>

              {uniqueTags.length > 0 && (
                <section>
                  <h3 className="text-md font-semibold mb-2 flex items-center"><Tag className="mr-2 h-4 w-4 text-muted-foreground" />Tags</h3>
                  <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
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

              {uniqueTierNames.length > 0 && (
                <section>
                  <h3 className="text-md font-semibold mb-2 flex items-center"><PackageIconLucide className="mr-2 h-4 w-4 text-muted-foreground" />Tiers</h3>
                  <div className="space-y-1.5">
                    {uniqueTierNames.map(tierName => (
                      <div key={tierName} className="flex items-center space-x-2">
                        <Checkbox
                          id={`tier-${tierName.replace(/\s+/g, '-')}`}
                          checked={selectedTiers.has(tierName)}
                          onCheckedChange={(checked) => handleTierChange(tierName, !!checked)}
                        />
                        <Label htmlFor={`tier-${tierName.replace(/\s+/g, '-')}`} className="text-sm font-normal cursor-pointer">
                          {tierName}
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
          <div className="mb-6 p-4 bg-card border rounded-lg shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-grow w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input 
                placeholder="Search services, categories, tags..." 
                className="pl-10 text-base py-3 w-full" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="text-base py-3 w-full md:w-[200px] shrink-0">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {displayedServices.length > 0 ? (
            <div className="grid sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
              {displayedServices.map(service => (
                <ServiceCard 
                  key={service.id} 
                  id={service.id}
                  name={service.name}
                  description={service.description}
                  category={service.category}
                  imageUrl={service.imageUrl}
                  imageHint={service.imageHint}
                  tiers={service.tiers}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 col-span-full flex flex-col items-center justify-center h-full">
              <PackageIconLucide className="mx-auto h-24 w-24 text-muted-foreground opacity-50" />
              <h2 className="mt-6 text-2xl font-semibold">No Services Found</h2>
              <p className="mt-2 text-muted-foreground">
                Try adjusting your filters or search term.
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
}

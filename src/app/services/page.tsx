
"use client"; 

import { Navbar } from '@/components/layout/navbar';
import { CategoriesNavbar } from '@/components/layout/categories-navbar';
import { Footer } from '@/components/layout/footer';
import { ServiceCard } from '@/components/shared/service-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Palette, Share2, Printer, Laptop, Brush as BrushIcon, Package as PackageIcon, ListFilter, Search, ChevronLeft, ChevronRight, Film, Presentation } from 'lucide-react'; 
import type { Icon } from 'lucide-react'; 
import { useState, useRef, useEffect, useCallback } from 'react'; 
import { cn } from '@/lib/utils';

interface ServiceTier {
  name: 'Basic' | 'Standard' | 'Premium';
  price: number;
}

interface Service {
  id: string;
  name: string;
  description: string; 
  category: string;
  imageUrl: string;
  imageHint: string;
  tiers: ServiceTier[];
}

const services: Service[] = [
  { 
    id: '1', name: 'Modern Logo Design', 
    description: 'Get a unique and memorable logo for your brand. Includes multiple concepts and revisions.', 
    category: 'Logo Design', 
    imageUrl: 'https://placehold.co/600x400.png', imageHint: 'abstract logo',
    tiers: [
      { name: 'Basic', price: 99 },
      { name: 'Standard', price: 199 },
      { name: 'Premium', price: 299 },
    ]
  },
  { 
    id: '2', name: 'Social Media Post Pack', 
    description: 'Engaging posts designed for your social media channels. Perfect for Instagram, Facebook, and Twitter.', 
    category: 'Social Media', 
    imageUrl: 'https://placehold.co/600x400.png', imageHint: 'social media graphics',
    tiers: [
      { name: 'Basic', price: 49 },
      { name: 'Standard', price: 99 },
    ]
  },
  { 
    id: '3', name: 'Professional Brochure Design', 
    description: 'Stunning tri-fold or bi-fold brochures to showcase your business effectively.', 
    category: 'Print Design', 
    imageUrl: 'https://placehold.co/600x400.png', imageHint: 'brochure layout',
    tiers: [
      { name: 'Standard', price: 249 },
      { name: 'Premium', price: 349 },
    ]
  },
  { 
    id: '4', name: 'UI/UX Web Design Mockup', 
    description: 'High-fidelity mockup for one key page of your website or app.', 
    category: 'UI/UX Design', 
    imageUrl: 'https://placehold.co/600x400.png', imageHint: 'website mockup',
    tiers: [
      { name: 'Standard', price: 399 },
      { name: 'Premium', price: 599 },
    ]
  },
  { 
    id: '5', name: 'Custom Illustration', 
    description: 'Unique vector or raster illustration based on your brief.', 
    category: 'Illustration', 
    imageUrl: 'https://placehold.co/600x400.png', imageHint: 'character illustration',
    tiers: [
      { name: 'Basic', price: 79 },
      { name: 'Standard', price: 149 },
      { name: 'Premium', price: 249 },
    ]
  },
  { 
    id: '6', name: 'Packaging Design Concept', 
    description: 'Creative packaging concept for your product.', 
    category: 'Packaging', 
    imageUrl: 'https://placehold.co/600x400.png', imageHint: 'product packaging',
    tiers: [
      { name: 'Standard', price: 299 },
      { name: 'Premium', price: 499 },
    ]
  },
  { 
    id: '7', name: 'Basic Logo Sketch', 
    description: 'Quick logo sketches for initial ideas.', 
    category: 'Logo Design', 
    imageUrl: 'https://placehold.co/600x400.png', imageHint: 'logo sketch',
    tiers: [
      { name: 'Basic', price: 49 },
    ]
  },
];

interface CategoryFilterItem {
  name: string;
  icon: Icon;
  slug: string;
}

const categoryFilters: CategoryFilterItem[] = [
  { name: 'Logo Design', icon: Palette, slug: 'logo-design' },
  { name: 'Social Media', icon: Share2, slug: 'social-media' },
  { name: 'Print Design', icon: Printer, slug: 'print-design' },
  { name: 'UI/UX Design', icon: Laptop, slug: 'ui-ux-design' },
  { name: 'Illustration', icon: BrushIcon, slug: 'illustration' },
  { name: 'Packaging', icon: PackageIcon, slug: 'packaging' },
  { name: 'Motion Graphics', icon: Film, slug: 'motion-graphics' }, 
  { name: 'Presentations', icon: Presentation, slug: 'presentations' },
];

const sortOptions = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest First' },
];

export default function ServicesPage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>('relevance');
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const displayedServices = services.filter(service => {
    const categoryMatch = activeCategory ? service.category === activeCategory : true;
    return categoryMatch;
  });

  const handleCategoryClick = (categoryName: string) => {
    setActiveCategory(prev => prev === categoryName ? null : categoryName);
  };

  const checkScrollability = useCallback(() => {
    const container = scrollContainerRef.current;
    if (container) {
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(container.scrollLeft < container.scrollWidth - container.clientWidth -1); // -1 for precision
    }
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      checkScrollability(); // Initial check
      container.addEventListener('scroll', checkScrollability);
      window.addEventListener('resize', checkScrollability); // Re-check on resize

      // Ensure right arrow is visible if content overflows initially
      if (container.scrollWidth > container.clientWidth) {
        setCanScrollRight(true);
      }

      return () => {
        container.removeEventListener('scroll', checkScrollability);
        window.removeEventListener('resize', checkScrollability);
      };
    }
  }, [checkScrollability]);


  const handleScroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = 200; // Adjust as needed
      container.scrollBy({ 
        left: direction === 'left' ? -scrollAmount : scrollAmount, 
        behavior: 'smooth' 
      });
    }
  };
  
  // CSS class to hide scrollbar (requires Tailwind JIT or a plugin for full cross-browser)
  const scrollbarHideClass = "scrollbar-hide"; // This is a common utility class name
                                             // For Webkit: [&::-webkit-scrollbar]:hidden
                                             // For Firefox: scrollbar-width-none
                                             // For IE/Edge: -ms-overflow-style-none
                                             // We'll use a placeholder class and rely on global CSS if needed for full hiding.


  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <CategoriesNavbar />
      <main className="flex-grow container mx-auto py-12 px-5">
        <h1 className="text-4xl font-bold font-headline mb-8 text-center">Explore Our Design Services</h1>
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold font-headline mb-4 text-center md:text-left">Browse by Category</h2>
          <div className="relative">
            {canScrollLeft && (
              <Button
                variant="outline"
                size="icon"
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-12 w-8 rounded-full shadow-md bg-background/80 hover:bg-background"
                onClick={() => handleScroll('left')}
                aria-label="Scroll left"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
            )}
            <div 
              ref={scrollContainerRef}
              className={cn(
                "flex space-x-3 md:space-x-4 overflow-x-auto pb-4",
                "scrollbar-hide" // Attempt to hide scrollbar; best effort without global CSS/plugin
              )}
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' } as React.CSSProperties}
            >
               <style jsx global>{`
                .scrollbar-hide::-webkit-scrollbar {
                  display: none;
                }
              `}</style>
              {categoryFilters.map(category => (
                <Button
                  key={category.slug}
                  variant={activeCategory === category.name ? "default" : "outline"}
                  onClick={() => handleCategoryClick(category.name)}
                  className="flex flex-col items-center justify-center h-24 md:h-28 text-center p-2 md:p-3 shadow-sm hover:shadow-md transition-shadow shrink-0 w-32 md:w-36 whitespace-nowrap"
                >
                  <category.icon className="h-7 w-7 md:h-8 md:w-8 mb-1.5 md:mb-2 text-primary group-hover:text-primary-foreground" />
                  <span className="text-xs sm:text-sm">{category.name}</span>
                </Button>
              ))}
            </div>
            {canScrollRight && (
              <Button
                variant="outline"
                size="icon"
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-12 w-8 rounded-full shadow-md bg-background/80 hover:bg-background"
                onClick={() => handleScroll('right')}
                aria-label="Scroll right"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>

        <div className="mb-8 p-4 bg-card border rounded-lg shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
          <div>
            <Button variant="outline" className="text-base py-3">
              <ListFilter className="mr-2 h-5 w-5" />
              Filters
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative flex-grow w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input placeholder="Search services..." className="pl-10 text-base py-3 w-full" />
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="text-base py-3 w-full sm:w-[200px]">
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
        </div>

        {displayedServices.length > 0 ? (
           <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
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
          <div className="text-center py-10">
            <p className="text-xl text-muted-foreground">No services match your current filters.</p>
            <Button variant="link" onClick={() => { setActiveCategory(null); }} className="mt-2">
              Clear all filters
            </Button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

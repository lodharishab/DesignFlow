
"use client"; 

import { Navbar } from '@/components/layout/navbar';
import { CategoriesNavbar } from '@/components/layout/categories-navbar';
import { Footer } from '@/components/layout/footer';
import { ServiceCard } from '@/components/shared/service-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Palette, Share2, Printer, Laptop, Brush as BrushIcon, Package as PackageIcon, ListFilter, Search, Star, Shield, Zap } from 'lucide-react'; 
import type { Icon } from 'lucide-react'; 
import { useState } from 'react'; 

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  tier: 'Basic' | 'Standard' | 'Premium';
  imageUrl: string;
  imageHint: string;
}

const services: Service[] = [
  { id: '1', name: 'Modern Logo Design', description: 'Get a unique and memorable logo for your brand. Includes multiple concepts and revisions.', price: 199, category: 'Logo Design', tier: 'Standard', imageUrl: 'https://placehold.co/600x400.png', imageHint: 'abstract logo' },
  { id: '2', name: 'Social Media Post Pack', description: 'Engaging posts designed for your social media channels. Perfect for Instagram, Facebook, and Twitter.', price: 99, category: 'Social Media', tier: 'Basic', imageUrl: 'https://placehold.co/600x400.png', imageHint: 'social media graphics' },
  { id: '3', name: 'Professional Brochure Design', description: 'Stunning tri-fold or bi-fold brochures to showcase your business effectively.', price: 249, category: 'Print Design', tier: 'Standard', imageUrl: 'https://placehold.co/600x400.png', imageHint: 'brochure layout' },
  { id: '4', name: 'UI/UX Web Design Mockup', description: 'High-fidelity mockup for one key page of your website or app.', price: 399, category: 'UI/UX Design', tier: 'Premium', imageUrl: 'https://placehold.co/600x400.png', imageHint: 'website mockup' },
  { id: '5', name: 'Custom Illustration', description: 'Unique vector or raster illustration based on your brief.', price: 149, category: 'Illustration', tier: 'Standard', imageUrl: 'https://placehold.co/600x400.png', imageHint: 'character illustration' },
  { id: '6', name: 'Packaging Design Concept', description: 'Creative packaging concept for your product.', price: 299, category: 'Packaging', tier: 'Premium', imageUrl: 'https://placehold.co/600x400.png', imageHint: 'product packaging' },
  { id: '7', name: 'Basic Logo Sketch', description: 'Quick logo sketches for initial ideas.', price: 49, category: 'Logo Design', tier: 'Basic', imageUrl: 'https://placehold.co/600x400.png', imageHint: 'logo sketch' },
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
];

interface TierFilterItem {
  name: 'Basic' | 'Standard' | 'Premium';
  icon: Icon;
  slug: 'basic' | 'standard' | 'premium';
}

const tierFilters: TierFilterItem[] = [
  { name: 'Basic', icon: Shield, slug: 'basic' },
  { name: 'Standard', icon: Star, slug: 'standard' },
  { name: 'Premium', icon: Zap, slug: 'premium' },
];

const sortOptions = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest First' },
];

export default function ServicesPage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeTier, setActiveTier] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>('relevance');
  
  // Placeholder until combined filtering logic is implemented
  const displayedServices = services.filter(service => {
    const categoryMatch = activeCategory ? service.category === activeCategory : true;
    const tierMatch = activeTier ? service.tier.toLowerCase() === activeTier.toLowerCase() : true;
    return categoryMatch && tierMatch;
  });

  const handleCategoryClick = (categoryName: string) => {
    setActiveCategory(prev => prev === categoryName ? null : categoryName);
    console.log("Selected category:", categoryName);
  };

  const handleTierClick = (tierName: string) => {
    setActiveTier(prev => prev === tierName ? null : tierName);
    console.log("Selected tier:", tierName);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <CategoriesNavbar />
      <main className="flex-grow container mx-auto py-12 px-5">
        <h1 className="text-4xl font-bold font-headline mb-8 text-center">Explore Our Design Services</h1>
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold font-headline mb-4 text-center md:text-left">Browse by Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
            {categoryFilters.map(category => (
              <Button
                key={category.slug}
                variant={activeCategory === category.name ? "default" : "outline"}
                onClick={() => handleCategoryClick(category.name)}
                className="flex flex-col items-center justify-center h-24 md:h-28 text-center p-2 md:p-3 shadow-sm hover:shadow-md transition-shadow"
              >
                <category.icon className="h-7 w-7 md:h-8 md:w-8 mb-1.5 md:mb-2 text-primary group-hover:text-primary-foreground" />
                <span className="text-xs sm:text-sm">{category.name}</span>
              </Button>
            ))}
          </div>
        </div>

        <div className="mb-10">
          <h2 className="text-xl font-semibold font-headline mb-4 text-center md:text-left">Filter by Tier</h2>
          <div className="grid grid-cols-3 gap-3 md:gap-4">
            {tierFilters.map(tier => (
              <Button
                key={tier.slug}
                variant={activeTier === tier.name ? "default" : "outline"}
                onClick={() => handleTierClick(tier.name)}
                className="flex flex-col items-center justify-center h-24 md:h-28 text-center p-2 md:p-3 shadow-sm hover:shadow-md transition-shadow"
              >
                <tier.icon className="h-7 w-7 md:h-8 md:w-8 mb-1.5 md:mb-2 text-primary group-hover:text-primary-foreground" />
                <span className="text-sm sm:text-base">{tier.name}</span>
              </Button>
            ))}
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
              <ServiceCard key={service.id} {...service} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-xl text-muted-foreground">No services match your current filters.</p>
            <Button variant="link" onClick={() => { setActiveCategory(null); setActiveTier(null); }} className="mt-2">
              Clear all filters
            </Button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

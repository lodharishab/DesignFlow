
"use client"; 

import { Navbar } from '@/components/layout/navbar';
import { CategoriesNavbar } from '@/components/layout/categories-navbar';
import { Footer } from '@/components/layout/footer';
import { ServiceCard } from '@/components/shared/service-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, Search, Palette, Share2, Printer, Laptop, Brush, Package as PackageIcon, ListFilter } from 'lucide-react'; 
import type { Icon } from 'lucide-react'; 
import { useState } from 'react'; 

const services = [
  { id: '1', name: 'Modern Logo Design', description: 'Get a unique and memorable logo for your brand. Includes multiple concepts and revisions.', price: 199, category: 'Logo Design', imageUrl: 'https://placehold.co/600x400.png', imageHint: 'abstract logo' },
  { id: '2', name: 'Social Media Post Pack', description: 'Engaging posts designed for your social media channels. Perfect for Instagram, Facebook, and Twitter.', price: 99, category: 'Social Media', imageUrl: 'https://placehold.co/600x400.png', imageHint: 'social media graphics' },
  { id: '3', name: 'Professional Brochure Design', description: 'Stunning tri-fold or bi-fold brochures to showcase your business effectively.', price: 249, category: 'Print Design', imageUrl: 'https://placehold.co/600x400.png', imageHint: 'brochure layout' },
  { id: '4', name: 'UI/UX Web Design Mockup', description: 'High-fidelity mockup for one key page of your website or app.', price: 399, category: 'UI/UX Design', imageUrl: 'https://placehold.co/600x400.png', imageHint: 'website mockup' },
  { id: '5', name: 'Custom Illustration', description: 'Unique vector or raster illustration based on your brief.', price: 149, category: 'Illustration', imageUrl: 'https://placehold.co/600x400.png', imageHint: 'character illustration' },
  { id: '6', name: 'Packaging Design Concept', description: 'Creative packaging concept for your product.', price: 299, category: 'Packaging', imageUrl: 'https://placehold.co/600x400.png', imageHint: 'product packaging' },
];

interface CategoryFilter {
  name: string;
  icon: Icon;
  slug: string;
}

const categoryFilters: CategoryFilter[] = [
  { name: 'Logo Design', icon: Palette, slug: 'logo-design' },
  { name: 'Social Media', icon: Share2, slug: 'social-media' },
  { name: 'Print Design', icon: Printer, slug: 'print-design' },
  { name: 'UI/UX Design', icon: Laptop, slug: 'ui-ux-design' },
  { name: 'Illustration', icon: Brush, slug: 'illustration' },
  { name: 'Packaging', icon: PackageIcon, slug: 'packaging' },
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
  // In a real app, you'd filter services based on activeCategory
  // const filteredServices = activeCategory ? services.filter(s => s.category === activeCategory) : services;
  const displayedServices = services; // Placeholder until filtering is implemented

  const handleCategoryClick = (categoryName: string) => {
    setActiveCategory(prev => prev === categoryName ? null : categoryName);
    // Here you would typically trigger a re-fetch or client-side filter of services
    console.log("Selected category:", categoryName);
  };


  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <CategoriesNavbar />
      <main className="flex-grow container mx-auto py-12 px-5">
        <h1 className="text-4xl font-bold font-headline mb-8 text-center">Explore Our Design Services</h1>
        
        <div className="mb-10">
          <h2 className="text-2xl font-semibold font-headline mb-6 text-center md:text-left">Browse by Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categoryFilters.map(category => (
              <Button
                key={category.slug}
                variant={activeCategory === category.name ? "default" : "outline"}
                onClick={() => handleCategoryClick(category.name)}
                className="flex flex-col items-center justify-center h-28 text-center p-3 shadow-sm hover:shadow-md transition-shadow"
              >
                <category.icon className="h-8 w-8 mb-2 text-primary group-hover:text-primary-foreground" />
                <span className="text-xs sm:text-sm">{category.name}</span>
              </Button>
            ))}
          </div>
        </div>

        <div className="mb-8 p-4 bg-card border rounded-lg shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Left side: Filters button */}
          <div>
            <Button variant="outline" className="text-base py-3">
              <ListFilter className="mr-2 h-5 w-5" />
              Filters
            </Button>
          </div>

          {/* Right side: Search and Sort By */}
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

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedServices.map(service => (
            <ServiceCard key={service.id} {...service} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}


"use client";

import { useState, useMemo, useEffect, Suspense } from 'react';
import { Navbar } from '@/components/layout/navbar';
import { CategoriesNavbar } from '@/components/layout/categories-navbar';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { PortfolioItemCard } from '@/components/shared/portfolio-item-card';
import type { PortfolioItem } from '@/components/shared/portfolio-item-card'; // Assuming type export
import { useSearchParams } from 'next/navigation';
import { PackageSearch, ListFilter } from 'lucide-react';

// Data - In a real app, this would come from a CMS or database
const portfolioItemsData: PortfolioItem[] = [
  {
    id: 'ecomm-reimagined',
    title: 'E-commerce Reimagined',
    category: 'Web UI/UX',
    categorySlug: 'web-ui-ux',
    imageUrls: [
      'https://placehold.co/600x400.png',
      'https://placehold.co/600x400.png',
      'https://placehold.co/600x400.png',
    ],
    imageHints: ['website interface', 'product detail', 'checkout flow'],
    description: 'A modern and intuitive e-commerce platform design focusing on user experience and conversion.',
  },
  {
    id: 'fintech-mobile-suite',
    title: 'Fintech Mobile Suite',
    category: 'App Design',
    categorySlug: 'app-design',
    imageUrls: [
      'https://placehold.co/600x400.png',
      'https://placehold.co/600x400.png',
      'https://placehold.co/600x400.png',
    ],
    imageHints: ['mobile finance app', 'app dashboard', 'transaction screen'],
    description: 'Sleek and secure mobile application design for a financial technology startup.',
  },
  {
    id: 'startup-brand-identity',
    title: 'Startup Brand Identity',
    category: 'Logo & Branding',
    categorySlug: 'logo-branding',
    imageUrls: [
      'https://placehold.co/600x400.png',
      'https://placehold.co/600x400.png',
      'https://placehold.co/600x400.png',
    ],
    imageHints: ['modern tech logo', 'brand styleguide', 'social branding'],
    description: 'Complete brand identity package for a new tech startup, including logo, color palette, and typography.',
  },
  {
    id: 'gourmet-restaurant-menus',
    title: 'Gourmet Restaurant Menus',
    category: 'Print Design',
    categorySlug: 'print-design',
    imageUrls: [
      'https://placehold.co/600x400.png',
      'https://placehold.co/600x400.png',
    ],
    imageHints: ['elegant menu', 'restaurant branding'],
    description: 'Beautifully designed print menus for an upscale gourmet restaurant.',
  },
  {
    id: 'fantasy-game-assets',
    title: 'Fantasy Game Assets',
    category: 'Illustration & Icons',
    categorySlug: 'illustration-icons',
    imageUrls: [
      'https://placehold.co/600x400.png',
      'https://placehold.co/600x400.png',
      'https://placehold.co/600x400.png',
    ],
    imageHints: ['digital painting game', 'icon design game', 'concept art creature'],
    description: 'A collection of character designs, icons, and environmental art for a fantasy game.',
  },
  {
    id: 'corporate-explainer-stills',
    title: 'Corporate Explainer Stills',
    category: 'Animation & Motion',
    categorySlug: 'animation-motion',
    imageUrls: [
      'https://placehold.co/600x400.png',
      'https://placehold.co/600x400.png',
    ],
    imageHints: ['motion design still', 'animated characters'],
    description: 'Key visual stills from a corporate explainer video project.',
  },
   {
    id: 'eco-packaging-line',
    title: 'Eco-Friendly Packaging Line',
    category: 'Packaging Design',
    categorySlug: 'packaging-design',
    imageUrls: [
      'https://placehold.co/600x400.png',
      'https://placehold.co/600x400.png',
    ],
    imageHints: ['sustainable packaging', 'product box eco'],
    description: 'A line of sustainable and visually appealing packaging designs for an eco-conscious brand.',
  },
  {
    id: 'mobile-dashboard-ui',
    title: 'Analytics Mobile Dashboard',
    category: 'App Design',
    categorySlug: 'app-design',
    imageUrls: [
      'https://placehold.co/600x400.png',
      'https://placehold.co/600x400.png',
    ],
    imageHints: ['mobile dashboard', 'data visualization app'],
    description: 'Clean and data-rich UI for a mobile analytics dashboard application.',
  },
];

const PortfolioPageContent = () => {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category');
  
  const [activeCategory, setActiveCategory] = useState<string | null>(initialCategory);

  useEffect(() => {
    setActiveCategory(initialCategory);
  }, [initialCategory]);

  const uniqueCategories = useMemo(() => {
    const categories = new Set(portfolioItemsData.map(item => item.category));
    return Array.from(categories).sort();
  }, []);

  const filteredPortfolioItems = useMemo(() => {
    if (!activeCategory) {
      return portfolioItemsData;
    }
    const activeCategoryDetails = portfolioItemsData.find(item => item.categorySlug === activeCategory);
    return portfolioItemsData.filter(item => item.category === (activeCategoryDetails?.category || activeCategory) );
  }, [activeCategory]);

  const getCategorySlug = (categoryName: string): string => {
    const item = portfolioItemsData.find(p => p.category === categoryName);
    return item?.categorySlug || categoryName.toLowerCase().replace(/\s+/g, '-');
  };


  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <CategoriesNavbar />
      <main className="flex-grow container mx-auto py-12 px-5">
        <h1 className="text-4xl font-bold font-headline mb-4 text-center">Our Portfolio</h1>
        <p className="text-lg text-muted-foreground text-center mb-10 max-w-2xl mx-auto">
          Discover a collection of our finest work. See how we've helped businesses like yours achieve their design goals.
        </p>

        <div className="mb-10 flex flex-wrap justify-center gap-2 md:gap-3">
          <Button
            variant={!activeCategory ? 'default' : 'outline'}
            onClick={() => setActiveCategory(null)}
            className="rounded-full px-4 py-2 text-sm"
          >
            All Categories
          </Button>
          {uniqueCategories.map(category => (
            <Button
              key={category}
              variant={activeCategory === getCategorySlug(category) || activeCategory === category ? 'default' : 'outline'}
              onClick={() => setActiveCategory(getCategorySlug(category))}
              className="rounded-full px-4 py-2 text-sm"
            >
              {category}
            </Button>
          ))}
        </div>
        
        {/* Future: Advanced Filters Button */}
        {/* <div className="mb-8 flex justify-center">
          <Button variant="outline">
            <ListFilter className="mr-2 h-4 w-4" /> Advanced Filters (Tags, etc.)
          </Button>
        </div> */}

        {filteredPortfolioItems.length > 0 ? (
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPortfolioItems.map(item => (
              <PortfolioItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <PackageSearch className="mx-auto h-24 w-24 text-muted-foreground opacity-50" />
            <h2 className="mt-6 text-2xl font-semibold">No Projects Found</h2>
            <p className="mt-2 text-muted-foreground">
              {activeCategory 
                ? `There are no projects in the "${portfolioItemsData.find(p => p.categorySlug === activeCategory)?.category || activeCategory}" category yet.`
                : "We're constantly adding new projects. Check back soon!"}
            </p>
            {activeCategory && (
              <Button variant="link" onClick={() => setActiveCategory(null)} className="mt-4">
                Show All Categories
              </Button>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default function PortfolioPage() {
  return (
    <Suspense fallback={<div className="flex-grow container mx-auto py-12 px-5 text-center">Loading portfolio...</div>}>
      <PortfolioPageContent />
    </Suspense>
  );
}

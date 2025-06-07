
"use client";

import { useState, useMemo, useEffect, Suspense, useCallback } from 'react';
import { Navbar } from '@/components/layout/navbar';
import { CategoriesNavbar } from '@/components/layout/categories-navbar';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { PortfolioItemCard, type PortfolioItem } from '@/components/shared/portfolio-item-card';
import { useSearchParams } from 'next/navigation';
import { PackageSearch, ListFilter, X, Tag, Users, Palette } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

// Enhanced Portfolio Data Structure - IMPORTANT: Keep this in sync with other uses
export const allPortfolioItemsData: PortfolioItem[] = [
  {
    id: 'ecomm-reimagined-platform', 
    title: 'E-commerce Reimagined Platform',
    category: 'Web UI/UX',
    categorySlug: 'web-ui-ux',
    clientName: 'FutureRetail Inc.',
    projectDate: 'July 2024',
    coverImageUrl: 'https://placehold.co/600x450.png',
    coverImageHint: 'modern website homepage',
    projectDescription: 'A complete overhaul of a multi-vendor e-commerce platform, focusing on a streamlined user journey, enhanced product discovery, and a modern, clean aesthetic. The project involved extensive UX research, interactive prototyping, and a comprehensive UI style guide.',
    galleryImages: [
      { url: 'https://placehold.co/1200x800.png', hint: 'dashboard analytics view', caption: 'Dashboard Overview' },
      { url: 'https://placehold.co/1200x800.png', hint: 'product listing page', caption: 'Product Grid' },
      { url: 'https://placehold.co/1200x800.png', hint: 'mobile app checkout', caption: 'Mobile Checkout Flow' },
    ],
    tags: ['e-commerce', 'ux design', 'ui design', 'web application', 'figma', 'responsive'],
    designer: { id: 'des001', slug: 'alice-wonderland', name: 'Alice Wonderland', avatarUrl: 'https://placehold.co/40x40.png', imageHint: 'woman avatar' },
  },
  {
    id: 'fintech-mobile-banking-app',
    title: 'Fintech Mobile Banking App',
    category: 'App Design',
    categorySlug: 'app-design',
    clientName: 'InnovateBank Corp.',
    projectDate: 'May 2024',
    coverImageUrl: 'https://placehold.co/600x450.png',
    coverImageHint: 'finance app screen',
    projectDescription: 'Sleek and secure mobile application design for a new-age digital bank. Features include intuitive navigation, personalized dashboards, and gamified savings goals. Designed for iOS and Android.',
    galleryImages: [
      { url: 'https://placehold.co/1200x800.png', hint: 'app login screen', caption: 'Secure Login' },
      { url: 'https://placehold.co/1200x800.png', hint: 'app transaction history', caption: 'Transaction Details' },
    ],
    tags: ['mobile app', 'fintech', 'ios', 'android', 'ui/ux', 'security'],
    designer: { id: 'des002', slug: 'bob-the-builder', name: 'Bob The Builder', avatarUrl: 'https://placehold.co/40x40.png', imageHint: 'man avatar' },
  },
  {
    id: 'eco-startup-brand-identity',
    title: 'Eco Startup Brand Identity',
    category: 'Logo & Branding',
    categorySlug: 'logo-branding',
    clientName: 'GreenLeaf Goods',
    projectDate: 'April 2024',
    coverImageUrl: 'https://placehold.co/600x450.png',
    coverImageHint: 'nature logo design',
    projectDescription: 'Complete brand identity package for an eco-conscious startup, including logo, color palette, typography, and brand guidelines. The identity aims to convey sustainability and trustworthiness.',
    galleryImages: [
      { url: 'https://placehold.co/1200x800.png', hint: 'brand stationery mockup', caption: 'Stationery Design' },
      { url: 'https://placehold.co/1200x800.png', hint: 'brand style guide page', caption: 'Brand Guidelines Snippet' },
    ],
    tags: ['branding', 'logo design', 'sustainability', 'identity system', 'startup'],
    designer: { id: 'des003', slug: 'carol-danvers', name: 'Carol Danvers', avatarUrl: 'https://placehold.co/40x40.png', imageHint: 'woman avatar' },
  },
  {
    id: 'artisanal-cafe-print-suite',
    title: 'Artisanal Cafe Print Suite',
    category: 'Print Design',
    categorySlug: 'print-design',
    clientName: 'The Daily Grind Cafe',
    projectDate: 'March 2024',
    coverImageUrl: 'https://placehold.co/600x450.png',
    coverImageHint: 'coffee shop menu',
    projectDescription: 'A cohesive set of print materials for a local artisanal cafe, including menus, loyalty cards, and promotional flyers, all reflecting a rustic yet modern brand aesthetic.',
    galleryImages: [
      { url: 'https://placehold.co/1200x800.png', hint: 'loyalty card design', caption: 'Loyalty Card' },
    ],
    tags: ['print design', 'menu design', 'cafe branding', 'local business', 'rustic'],
    designer: { id: 'des004', slug: 'david-copperfield', name: 'David Copperfield', avatarUrl: 'https://placehold.co/40x40.png', imageHint: 'man avatar' },
  },
  {
    id: 'whimsical-childrens-book-illustrations',
    title: 'Whimsical Children\'s Book',
    category: 'Illustration',
    categorySlug: 'illustration',
    clientName: 'Little Readers Publishing',
    projectDate: 'June 2024',
    coverImageUrl: 'https://placehold.co/600x450.png',
    coverImageHint: 'storybook character art',
    projectDescription: 'A series of enchanting illustrations for a children\'s storybook, featuring vibrant characters and imaginative scenes. The style is playful and engaging for young readers.',
    galleryImages: [
      { url: 'https://placehold.co/1200x800.png', hint: 'book spread illustration', caption: 'Sample Spread 1' },
      { url: 'https://placehold.co/1200x800.png', hint: 'character sketches book', caption: 'Character Development' },
    ],
    tags: ['illustration', 'childrens book', 'character design', 'digital art', 'vibrant'],
    designer: { id: 'des001', slug: 'alice-wonderland', name: 'Alice Wonderland', avatarUrl: 'https://placehold.co/40x40.png', imageHint: 'woman avatar' },
  },
  {
    id: 'sustainable-cosmetics-packaging',
    title: 'Sustainable Cosmetics Packaging',
    category: 'Packaging Design',
    categorySlug: 'packaging-design',
    clientName: 'Aura Organics',
    projectDate: 'February 2024',
    coverImageUrl: 'https://placehold.co/600x450.png',
    coverImageHint: 'cosmetic product packaging',
    projectDescription: 'A line of eco-friendly and visually appealing packaging designs for an organic cosmetics brand. The design emphasizes natural ingredients and minimalist luxury.',
    galleryImages: [
      { url: 'https://placehold.co/1200x800.png', hint: 'product label detail', caption: 'Label Close-up' },
    ],
    tags: ['packaging design', 'cosmetics', 'sustainability', 'brand identity', 'minimalist'],
    designer: { id: 'des002', slug: 'bob-the-builder', name: 'Bob The Builder', avatarUrl: 'https://placehold.co/40x40.png', imageHint: 'man avatar' },
  },
  {
    id: 'tech-conference-motion-graphics',
    title: 'Tech Conference Opener',
    category: 'Animation & Motion',
    categorySlug: 'animation-motion',
    clientName: 'Innovate Summit',
    projectDate: 'January 2024',
    coverImageUrl: 'https://placehold.co/600x450.png',
    coverImageHint: 'abstract motion design',
    projectDescription: 'Dynamic motion graphics package for a major tech conference, including an event opener, speaker intros, and lower thirds. The style is futuristic and energetic.',
    galleryImages: [
      { url: 'https://placehold.co/1200x800.png', hint: 'conference title screen', caption: 'Main Title Card' },
    ],
    tags: ['motion graphics', 'animation', 'event branding', 'after effects', 'futuristic'],
    designer: { id: 'des003', slug: 'carol-danvers', name: 'Carol Danvers', avatarUrl: 'https://placehold.co/40x40.png', imageHint: 'woman avatar' },
  },
   {
    id: 'corporate-pitch-deck-redesign',
    title: 'Investor Pitch Deck Redesign',
    category: 'Presentation Design',
    categorySlug: 'presentation-design',
    clientName: 'Alpha Solutions Ltd.',
    projectDate: 'December 2023',
    coverImageUrl: 'https://placehold.co/600x450.png',
    coverImageHint: 'modern presentation slide',
    projectDescription: 'A complete redesign of a corporate investor pitch deck, focusing on clear data visualization, compelling storytelling, and a professional, modern aesthetic to secure funding.',
    galleryImages: [
      { url: 'https://placehold.co/1200x800.png', hint: 'data chart slide', caption: 'Data Visualization' },
      { url: 'https://placehold.co/1200x800.png', hint: 'team slide design', caption: 'Team Introduction Slide' },
    ],
    tags: ['presentation design', 'pitch deck', 'powerpoint', 'keynote', 'corporate', 'data visualization'],
    designer: { id: 'des004', slug: 'david-copperfield', name: 'David Copperfield', avatarUrl: 'https://placehold.co/40x40.png', imageHint: 'man avatar' },
  }
];


const PortfolioPageContent = () => {
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
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <CategoriesNavbar />
      <main className="flex-grow container mx-auto py-12 px-5">
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

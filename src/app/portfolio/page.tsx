
"use client";

import { useState, useMemo, useEffect, Suspense } from 'react';
import { Navbar } from '@/components/layout/navbar';
import { CategoriesNavbar } from '@/components/layout/categories-navbar';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { PortfolioItemCard, type PortfolioItem } from '@/components/shared/portfolio-item-card';
import { useSearchParams } from 'next/navigation';
import { PackageSearch, ListFilter } from 'lucide-react';

// Enhanced Portfolio Data Structure
const portfolioItemsData: PortfolioItem[] = [
  {
    id: 'ecomm-reimagined-platform', // More unique ID
    title: 'E-commerce Reimagined Platform',
    category: 'Web UI/UX',
    categorySlug: 'web-ui-ux',
    clientName: 'FutureRetail Inc.',
    projectDate: 'July 2024',
    coverImageUrl: 'https://placehold.co/600x450.png', // 4:3 aspect ratio
    coverImageHint: 'modern website homepage',
    projectDescription: 'A complete overhaul of a multi-vendor e-commerce platform, focusing on a streamlined user journey, enhanced product discovery, and a modern, clean aesthetic. The project involved extensive UX research, interactive prototyping, and a comprehensive UI style guide.',
    galleryImages: [
      { url: 'https://placehold.co/1200x800.png', hint: 'dashboard analytics view', caption: 'Dashboard Overview' },
      { url: 'https://placehold.co/1200x800.png', hint: 'product listing page', caption: 'Product Grid' },
      { url: 'https://placehold.co/1200x800.png', hint: 'mobile app checkout', caption: 'Mobile Checkout Flow' },
    ],
    tags: ['e-commerce', 'ux design', 'ui design', 'web application', 'figma'],
    designer: { name: 'Alice Wonderland', avatarUrl: 'https://placehold.co/40x40.png', imageHint: 'woman avatar', profileUrl: '/designers/alice-wonderland' },
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
    tags: ['mobile app', 'fintech', 'ios', 'android', 'ui/ux'],
    designer: { name: 'Bob The Builder', avatarUrl: 'https://placehold.co/40x40.png', imageHint: 'man avatar', profileUrl: '/designers/bob-the-builder' },
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
    tags: ['branding', 'logo design', 'sustainability', 'identity system'],
    designer: { name: 'Carol Danvers', avatarUrl: 'https://placehold.co/40x40.png', imageHint: 'woman avatar', profileUrl: '/designers/carol-danvers' },
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
    tags: ['print design', 'menu design', 'cafe branding', 'local business'],
    designer: { name: 'David Copperfield', avatarUrl: 'https://placehold.co/40x40.png', imageHint: 'man avatar', profileUrl: '/designers/david-copperfield' },
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
    tags: ['illustration', 'childrens book', 'character design', 'digital art'],
    designer: { name: 'Alice Wonderland', avatarUrl: 'https://placehold.co/40x40.png', imageHint: 'woman avatar', profileUrl: '/designers/alice-wonderland' },
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
    tags: ['packaging design', 'cosmetics', 'sustainability', 'brand identity'],
    designer: { name: 'Bob The Builder', avatarUrl: 'https://placehold.co/40x40.png', imageHint: 'man avatar', profileUrl: '/designers/bob-the-builder' },
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
    tags: ['motion graphics', 'animation', 'event branding', 'after effects'],
    designer: { name: 'Carol Danvers', avatarUrl: 'https://placehold.co/40x40.png', imageHint: 'woman avatar', profileUrl: '/designers/carol-danvers' },
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
    tags: ['presentation design', 'pitch deck', 'powerpoint', 'keynote', 'corporate'],
    designer: { name: 'David Copperfield', avatarUrl: 'https://placehold.co/40x40.png', imageHint: 'man avatar', profileUrl: '/designers/david-copperfield' },
  }
];


const PortfolioPageContent = () => {
  const searchParams = useSearchParams();
  const initialCategorySlug = searchParams.get('category');
  
  const [activeCategorySlug, setActiveCategorySlug] = useState<string | null>(initialCategorySlug);

  useEffect(() => {
    setActiveCategorySlug(initialCategorySlug);
  }, [initialCategorySlug]);

  const uniqueCategories = useMemo(() => {
    const categoriesMap = new Map<string, { name: string, slug: string }>();
    portfolioItemsData.forEach(item => {
      if (!categoriesMap.has(item.categorySlug)) {
        categoriesMap.set(item.categorySlug, { name: item.category, slug: item.categorySlug });
      }
    });
    return Array.from(categoriesMap.values()).sort((a,b) => a.name.localeCompare(b.name));
  }, []);

  const filteredPortfolioItems = useMemo(() => {
    if (!activeCategorySlug) {
      return portfolioItemsData;
    }
    return portfolioItemsData.filter(item => item.categorySlug === activeCategorySlug);
  }, [activeCategorySlug]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <CategoriesNavbar />
      <main className="flex-grow container mx-auto py-12 px-5">
        <h1 className="text-4xl font-bold font-headline mb-4 text-center">Explore Our Work</h1>
        <p className="text-lg text-muted-foreground text-center mb-10 max-w-2xl mx-auto">
          Dive into a curated collection of projects crafted by our talented designers. Get inspired and see the quality we deliver.
        </p>

        <div className="mb-10 flex flex-wrap justify-center gap-2 md:gap-3">
          <Button
            variant={!activeCategorySlug ? 'default' : 'outline'}
            onClick={() => setActiveCategorySlug(null)}
            className="rounded-full px-4 py-2 text-sm"
          >
            All Projects
          </Button>
          {uniqueCategories.map(category => (
            <Button
              key={category.slug}
              variant={activeCategorySlug === category.slug ? 'default' : 'outline'}
              onClick={() => setActiveCategorySlug(category.slug)}
              className="rounded-full px-4 py-2 text-sm"
            >
              {category.name}
            </Button>
          ))}
        </div>
        
        {filteredPortfolioItems.length > 0 ? (
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {filteredPortfolioItems.map(item => (
              <PortfolioItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <PackageSearch className="mx-auto h-24 w-24 text-muted-foreground opacity-50" />
            <h2 className="mt-6 text-2xl font-semibold">No Projects Found</h2>
            <p className="mt-2 text-muted-foreground">
              {activeCategorySlug 
                ? `There are no projects in the "${uniqueCategories.find(c => c.slug === activeCategorySlug)?.name}" category yet.`
                : "We're constantly adding new projects. Check back soon!"}
            </p>
            {activeCategorySlug && (
              <Button variant="link" onClick={() => setActiveCategorySlug(null)} className="mt-4">
                Show All Projects
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

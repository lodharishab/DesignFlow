
"use client"; // This line will be removed

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
import { designersData } from '@/lib/designer-data'; 
import type { Metadata } from 'next';

// Enhanced Portfolio Data Structure - IMPORTANT: Keep this in sync with other uses
export const allPortfolioItemsData: PortfolioItem[] = [
  {
    id: 'ecomm-reimagined-platform-india', 
    title: 'E-commerce Reimagined for Indian Market',
    category: 'Web UI/UX',
    categorySlug: 'web-ui-ux',
    clientName: 'BharatRetail Solutions',
    projectDate: 'July 2024',
    coverImageUrl: 'https://placehold.co/600x450.png',
    coverImageHint: 'indian e-commerce website',
    projectDescription: 'Complete overhaul of a multi-vendor e-commerce platform, focusing on vernacular support, streamlined user journey for diverse Indian users, enhanced product discovery for local artisans, and a modern, clean aesthetic. The project involved extensive UX research with Indian user groups.',
    galleryImages: [
      { url: 'https://placehold.co/1200x800.png', hint: 'website homepage india', caption: 'Homepage - Festive Offer' },
      { url: 'https://placehold.co/1200x800.png', hint: 'product page indian dress', caption: 'Saree Product Detail' },
      { url: 'https://placehold.co/1200x800.png', hint: 'mobile app upi payment', caption: 'Mobile UPI Checkout Flow' },
    ],
    tags: ['e-commerce', 'ux design', 'ui design', 'vernacular ui', 'figma', 'indian market'],
    designer: designersData.find(d => d.slug === 'priya-sharma'),
  },
  {
    id: 'fintech-mobile-banking-app-india',
    title: 'Digital Rupee Mobile Banking App',
    category: 'App Design',
    categorySlug: 'app-design',
    clientName: 'NayaBank Technologies',
    projectDate: 'May 2024',
    coverImageUrl: 'https://placehold.co/600x450.png',
    coverImageHint: 'indian finance app',
    projectDescription: 'Sleek and secure mobile application design for a new-age digital bank in India, focusing on UPI integration and financial literacy tools. Features include intuitive navigation, personalized dashboards, and gamified savings goals. Designed for iOS and Android.',
    galleryImages: [
      { url: 'https://placehold.co/1200x800.png', hint: 'upi payment app screen', caption: 'UPI Transaction' },
      { url: 'https://placehold.co/1200x800.png', hint: 'investment app dashboard india', caption: 'Mutual Fund Dashboard' },
    ],
    tags: ['mobile app', 'fintech', 'upi', 'ios', 'android', 'financial literacy'],
    designer: designersData.find(d => d.slug === 'rohan-kapoor'),
  },
  {
    id: 'eco-startup-brand-identity-india',
    title: 'Sustainable Indian Lifestyle Brand Identity',
    category: 'Logo & Branding',
    categorySlug: 'logo-branding',
    clientName: 'Prakriti Living',
    projectDate: 'April 2024',
    coverImageUrl: 'https://placehold.co/600x450.png',
    coverImageHint: 'indian sustainable brand logo',
    projectDescription: 'Complete brand identity package for an eco-conscious Indian lifestyle startup, including logo, color palette inspired by Indian nature, typography, and brand guidelines. The identity aims to convey sustainability, tradition, and trustworthiness.',
    galleryImages: [
      { url: 'https://placehold.co/1200x800.png', hint: 'packaging design india', caption: 'Eco-friendly Product Packaging' },
      { url: 'https://placehold.co/1200x800.png', hint: 'brand guidelines indian motif', caption: 'Brand Guidelines with Paisley Motif' },
    ],
    tags: ['branding', 'logo design', 'sustainability', 'indian motif', 'startup'],
    designer: designersData.find(d => d.slug === 'aisha-khan'),
  },
  {
    id: 'artisanal-cafe-print-suite-jaipur',
    title: 'Jaipur Cafe Print & Menu Design',
    category: 'Print Design',
    categorySlug: 'print-design',
    clientName: 'Chaiwala Cafe Jaipur',
    projectDate: 'March 2024',
    coverImageUrl: 'https://placehold.co/600x450.png',
    coverImageHint: 'indian cafe menu design',
    projectDescription: 'A cohesive set of print materials for a local artisanal cafe in Jaipur, including menus with Rajasthani design elements, loyalty cards, and promotional flyers, reflecting a rustic yet modern brand aesthetic.',
    galleryImages: [
      { url: 'https://placehold.co/1200x800.png', hint: 'menu design rajasthani art', caption: 'Menu with Rajasthani Motifs' },
    ],
    tags: ['print design', 'menu design', 'cafe branding', 'jaipur', 'rajasthani art'],
    designer: designersData.find(d => d.slug === 'vikram-singh'),
  },
  {
    id: 'childrens-book-indian-mythology',
    title: 'Illustrations for "Tales of Krishna"',
    category: 'Illustration',
    categorySlug: 'illustration',
    clientName: 'Bal Sahitya Prakashan',
    projectDate: 'June 2024',
    coverImageUrl: 'https://placehold.co/600x450.png',
    coverImageHint: 'krishna illustration book',
    projectDescription: 'A series of enchanting illustrations for a children\'s storybook based on Indian mythology, featuring vibrant characters like Krishna and Radha, and imaginative scenes. The style is playful and engaging for young Indian readers.',
    galleryImages: [
      { url: 'https://placehold.co/1200x800.png', hint: 'indian mythology art children', caption: 'Krishna and Gopis' },
      { url: 'https://placehold.co/1200x800.png', hint: 'storybook art ganesha', caption: 'Baby Ganesha Scene' },
    ],
    tags: ['illustration', 'childrens book', 'indian mythology', 'krishna', 'digital art'],
    designer: designersData.find(d => d.slug === 'arjun-mehta'),
  },
  {
    id: 'sustainable-cosmetics-packaging-ayurveda',
    title: 'Ayurvedic Cosmetics Packaging Design',
    category: 'Packaging Design',
    categorySlug: 'packaging-design',
    clientName: 'Veda Organics',
    projectDate: 'February 2024',
    coverImageUrl: 'https://placehold.co/600x450.png',
    coverImageHint: 'ayurvedic product packaging',
    projectDescription: 'A line of eco-friendly and visually appealing packaging designs for an organic Ayurvedic cosmetics brand. The design emphasizes natural ingredients, traditional Indian patterns, and minimalist luxury.',
    galleryImages: [
      { url: 'https://placehold.co/1200x800.png', hint: 'beauty product label india', caption: 'Herbal Face Wash Label' },
    ],
    tags: ['packaging design', 'cosmetics', 'ayurveda', 'sustainability', 'indian patterns'],
    designer: designersData.find(d => d.slug === 'neha-joshi'),
  },
  {
    id: 'tech-conference-motion-graphics-bangalore',
    title: 'Bangalore Tech Summit Opener',
    category: 'Animation & Motion',
    categorySlug: 'animation-motion',
    clientName: 'Innovate India Summit',
    projectDate: 'January 2024',
    coverImageUrl: 'https://placehold.co/600x450.png',
    coverImageHint: 'tech event motion graphics',
    projectDescription: 'Dynamic motion graphics package for a major tech conference in Bangalore, including an event opener, speaker intros, and lower thirds. The style is futuristic, energetic, and incorporates subtle Indian tech motifs.',
    galleryImages: [
      { url: 'https://placehold.co/1200x800.png', hint: 'conference intro animation', caption: 'Main Title Animation Sequence' },
    ],
    tags: ['motion graphics', 'animation', 'event branding', 'after effects', 'bangalore tech'],
    designer: designersData.find(d => d.slug === 'aisha-khan'),
  },
   {
    id: 'corporate-pitch-deck-redesign-mumbai',
    title: 'Mumbai Fintech Investor Pitch Deck',
    category: 'Presentation Design',
    categorySlug: 'presentation-design',
    clientName: ' paisa Growth Capital',
    projectDate: 'December 2023',
    coverImageUrl: 'https://placehold.co/600x450.png',
    coverImageHint: 'financial presentation slide',
    projectDescription: 'A complete redesign of a corporate investor pitch deck for a Mumbai-based fintech startup, focusing on clear data visualization of Indian market opportunities, compelling storytelling, and a professional, modern aesthetic to secure funding.',
    galleryImages: [
      { url: 'https://placehold.co/1200x800.png', hint: 'indian market growth chart', caption: 'Market Growth Projection Chart' },
      { url: 'https://placehold.co/1200x800.png', hint: 'startup team slide india', caption: 'Founding Team Introduction' },
    ],
    tags: ['presentation design', 'pitch deck', 'fintech india', 'powerpoint', 'corporate'],
    designer: designersData.find(d => d.slug === 'vikram-singh'),
  },
  {
    id: 'yoga-studio-branding-rishikesh',
    title: 'Rishikesh Yoga Studio Branding',
    category: 'Logo & Branding',
    categorySlug: 'logo-branding',
    clientName: 'Ananda Yoga Shala',
    projectDate: 'August 2023',
    coverImageUrl: 'https://placehold.co/600x450.png',
    coverImageHint: 'yoga logo design india',
    projectDescription: 'Branding package for a new yoga studio in Rishikesh, including logo design with a meditative feel, color palette reflecting the Ganges, and social media templates. Focus on tranquility and spiritual wellness.',
    galleryImages: [
      { url: 'https://placehold.co/1200x800.png', hint: 'meditation app icon', caption: 'Logo & App Icon' },
      { url: 'https://placehold.co/1200x800.png', hint: 'yoga class poster', caption: 'Promotional Poster' },
    ],
    tags: ['branding', 'logo design', 'yoga', 'wellness', 'rishikesh', 'spiritual'],
    designer: designersData.find(d => d.slug === 'priya-sharma'),
  },
  {
    id: 'food-delivery-app-ui-pune',
    title: 'Pune Food Delivery App UI',
    category: 'App Design',
    categorySlug: 'app-design',
    clientName: 'Swad Connect',
    projectDate: 'September 2023',
    coverImageUrl: 'https://placehold.co/600x450.png',
    coverImageHint: 'indian food app ui',
    projectDescription: 'User interface design for a food delivery application targeting Pune, focusing on ease of use, quick order placement, and vibrant visuals of Indian cuisine. Included restaurant listing, menu browsing, and checkout flow.',
    galleryImages: [
      { url: 'https://placehold.co/1200x800.png', hint: 'restaurant menu app screen', caption: 'Restaurant Menu Screen' },
      { url: 'https://placehold.co/1200x800.png', hint: 'order tracking map india', caption: 'Live Order Tracking' },
    ],
    tags: ['mobile app', 'ui design', 'food delivery', 'pune', 'indian cuisine'],
    designer: designersData.find(d => d.slug === 'sunita-reddy'),
  }
];

export const metadata: Metadata = {
  title: 'Design Portfolio | DesignFlow India',
  description: 'Explore a curated collection of stunning design projects by talented Indian designers on DesignFlow. Get inspired for your next creative endeavor.',
  openGraph: {
    title: 'Design Portfolio Showcase | DesignFlow India',
    description: 'Discover exceptional design work across various categories, from branding to UI/UX, crafted by our expert designers.',
  },
};


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

    
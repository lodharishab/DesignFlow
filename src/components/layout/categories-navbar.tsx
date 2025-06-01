
"use client";

import Link from 'next/link';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ChevronDown, LayoutGrid, Sparkles } from 'lucide-react'; // Added Sparkles

// Mock data for categories and sub-categories
const mockCategories = [
  { id: 'cat001', name: 'Logo Design', slug: 'logo-design' },
  { id: 'cat002', name: 'Web UI/UX', slug: 'web-ui-ux' },
  { id: 'cat003', name: 'Print Materials', slug: 'print-materials' },
  { id: 'cat004', name: 'Custom Illustrations', slug: 'custom-illustrations' },
  { id: 'cat005', name: 'Social Media Graphics', slug: 'social-media-graphics' },
];

const mockSubCategories = [
  { id: 'subcat001', name: 'Minimalist Logos', parentCategoryId: 'cat001', slug: 'minimalist-logos' },
  { id: 'subcat002', name: 'Vintage Logos', parentCategoryId: 'cat001', slug: 'vintage-logos' },
  { id: 'subcat003', name: 'Mobile App UI', parentCategoryId: 'cat002', slug: 'mobile-app-ui' },
  { id: 'subcat004', name: 'Landing Page UX', parentCategoryId: 'cat002', slug: 'landing-page-ux' },
  { id: 'subcat005', name: 'Business Cards', parentCategoryId: 'cat003', slug: 'business-cards' },
  { id: 'subcat006', name: 'Flyers & Posters', parentCategoryId: 'cat003', slug: 'flyers-posters' },
  { id: 'subcat007', name: 'Character Design', parentCategoryId: 'cat004', slug: 'character-design' },
  { id: 'subcat008', name: 'Instagram Stories', parentCategoryId: 'cat005', slug: 'instagram-stories' },
];

const menuStructure = mockCategories.map(category => ({
  ...category,
  subcategories: mockSubCategories.filter(sub => sub.parentCategoryId === category.id)
}));

// Selecting a few popular categories
const popularCategories = [
  mockCategories.find(cat => cat.slug === 'logo-design'),
  mockCategories.find(cat => cat.slug === 'web-ui-ux'),
  mockCategories.find(cat => cat.slug === 'social-media-graphics'),
].filter(Boolean) as { id: string; name: string; slug: string }[];


export function CategoriesNavbar() {
  return (
    <nav className="sticky top-16 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/50 shadow-sm">
      <div className="container mx-auto px-5 flex h-14 items-center">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" className="text-md font-medium text-foreground hover:text-primary px-3">
              <LayoutGrid className="mr-2 h-5 w-5" />
              All Categories
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[700px] p-6 shadow-xl mt-1" align="start">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-6">
              {menuStructure.map((category) => (
                <div key={category.id}>
                  <h3 className="mb-3 font-semibold text-foreground text-md">
                    <Link 
                      href={`/services?category=${category.slug}`} 
                      className="hover:text-primary hover:underline flex items-center group"
                    >
                      {/* Optional: Add an icon per category if desired */}
                      {category.name}
                      <span className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity text-primary">&rarr;</span>
                    </Link>
                  </h3>
                  {category.subcategories.length > 0 && (
                    <ul className="space-y-1.5 pl-4 border-l border-border ml-1">
                      {category.subcategories.map((sub) => (
                        <li key={sub.id}>
                          <Link 
                            href={`/services?category=${category.slug}&subcategory=${sub.slug}`} 
                            className="text-sm text-muted-foreground hover:text-primary hover:underline block py-0.5"
                          >
                            {sub.name}
                          </Link>
                        </li>
                      ))}
                       <li>
                          <Link 
                            href={`/services?category=${category.slug}`} 
                            className="text-sm font-medium text-primary/90 hover:text-primary hover:underline pt-1.5 block mt-1.5"
                          >
                            View all in {category.name}
                          </Link>
                        </li>
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>
        
        {/* Popular Category Links */}
        {popularCategories.length > 0 && (
          <div className="ml-6 flex items-center space-x-4">
            <span className="text-sm font-medium text-muted-foreground flex items-center">
              <Sparkles className="mr-2 h-4 w-4 text-primary/80" />
              Popular:
            </span>
            {popularCategories.map(cat => (
              <Link
                key={cat.id}
                href={`/services?category=${cat.slug}`}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        )}

        {/* Other links for the secondary navbar could go here, e.g., "Newest Additions" */}
        {/* Example:
        <Link href="/how-it-works" className="ml-4 text-sm font-medium text-muted-foreground hover:text-primary">
          How It Works
        </Link>
        */}
      </div>
    </nav>
  );
}


"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ChevronDown, LayoutGrid, Briefcase, Palette, Laptop, Printer, Brush as BrushIconLucide, ArrowRight, Film, Presentation, Share2, Package as PackageIcon, Newspaper } from 'lucide-react';
import { getAllSubCategories, type ServiceSubCategory } from '@/lib/services-db';

// Standardized category data, aligned with /services page filters
const standardizedCategories = [
  { id: 'cat001', name: 'Logo Design', slug: 'logo-design', icon: Palette },
  { id: 'cat002', name: 'UI/UX Design', slug: 'ui-ux-design', icon: Laptop },
  { id: 'cat003', name: 'Print Design', slug: 'print-design', icon: Printer },
  { id: 'cat004', name: 'Illustration', slug: 'illustration', icon: BrushIconLucide },
  { id: 'cat005', name: 'Social Media', slug: 'social-media', icon: Share2 },
  { id: 'cat006', name: 'Packaging', slug: 'packaging', icon: PackageIcon },
  { id: 'cat007', name: 'Motion Graphics', slug: 'motion-graphics', icon: Film },
  { id: 'cat008', name: 'Presentations', slug: 'presentations', icon: Presentation },
];

// Key categories to feature directly in the navbar, using standardized data
const featuredCategoriesInNavbar = [
  standardizedCategories.find(c => c.slug === 'logo-design')!,
  standardizedCategories.find(c => c.slug === 'ui-ux-design')!,
  standardizedCategories.find(c => c.slug === 'print-design')!,
  standardizedCategories.find(c => c.slug === 'illustration')!,
].filter(Boolean);


export function CategoriesNavbar() {
  const [subCategories, setSubCategories] = useState<ServiceSubCategory[]>([]);

  useEffect(() => {
    getAllSubCategories().then(setSubCategories);
  }, []);

  const menuStructure = standardizedCategories.map(category => ({
    ...category,
    subcategories: subCategories.filter(sub => sub.parentCategoryId === category.id)
  }));
  return (
    <nav className="sticky top-16 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/50 shadow-sm hidden md:block">
      <div className="container mx-auto px-5 flex h-14 items-center">
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="ghost" 
              className="text-md font-medium text-foreground hover:bg-primary hover:text-primary-foreground px-3 py-2 h-auto"
            >
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
        
        {/* Featured Category Links */}
        <div className="ml-6 flex items-center space-x-1"> 
          {featuredCategoriesInNavbar.map(cat => (
            <Button variant="ghost" asChild key={cat.slug} className="px-3 py-2 h-auto text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/5">
              <Link
                href={`/services?category=${cat.slug}`}
              >
                <cat.icon className="mr-1.5 h-4 w-4" />
                {cat.name}
              </Link>
            </Button>
          ))}
        </div>

        <div className="ml-auto flex items-center space-x-1">
           <Button variant="ghost" asChild className="px-3 py-2 h-auto text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/5">
             <Link
                href="/blog"
              >
                <Newspaper className="mr-1.5 h-4 w-4" /> Blog
              </Link>
           </Button>
           <Button variant="ghost" asChild className="px-3 py-2 h-auto text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/5">
             <Link
                href="/portfolio"
              >
                <Briefcase className="mr-1.5 h-4 w-4" /> Portfolio
              </Link>
           </Button>
        </div>
      </div>
    </nav>
  );
}

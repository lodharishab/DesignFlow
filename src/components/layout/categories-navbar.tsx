
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Divider,
} from '@heroui/react';
import { ChevronDown, LayoutGrid, Briefcase, Palette, Laptop, Printer, Brush as BrushIconLucide, ArrowRight, Film, Presentation, Share2, Package as PackageIcon, Newspaper } from 'lucide-react';
import { getAllSubCategories, type ServiceSubCategory } from '@/lib/services-db';
import { motion } from 'framer-motion';

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
    <nav className="sticky top-16 z-40 w-full border-b border-divider/50 bg-background/70 backdrop-blur-xl shadow-sm hidden md:block">
      <div className="container mx-auto px-5 flex h-12 items-center">
        <Popover placement="bottom-start" showArrow>
          <PopoverTrigger>
            <Button
              variant="light"
              radius="full"
              size="sm"
              startContent={<LayoutGrid className="h-4 w-4" />}
              endContent={<ChevronDown className="h-3 w-3" />}
              className="text-default-700 font-medium hover:text-primary"
            >
              All Categories
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[700px] p-6">
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-6"
            >
              {menuStructure.map((category) => (
                <div key={category.id}>
                  <h3 className="mb-3 font-semibold text-foreground text-sm">
                    <Link
                      href={`/services?category=${category.slug}`}
                      className="hover:text-primary flex items-center group transition-colors"
                    >
                      <category.icon className="h-4 w-4 mr-2 text-primary" />
                      {category.name}
                      <ArrowRight className="ml-1 h-3 w-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-primary" />
                    </Link>
                  </h3>
                  {category.subcategories.length > 0 && (
                    <ul className="space-y-1 pl-6 border-l border-divider ml-2">
                      {category.subcategories.map((sub) => (
                        <li key={sub.id}>
                          <Link
                            href={`/services?category=${category.slug}&subcategory=${sub.slug}`}
                            className="text-xs text-default-500 hover:text-primary transition-colors block py-0.5"
                          >
                            {sub.name}
                          </Link>
                        </li>
                      ))}
                      <li>
                        <Link
                          href={`/services?category=${category.slug}`}
                          className="text-xs font-medium text-primary/80 hover:text-primary pt-1 block mt-1"
                        >
                          View all in {category.name}
                        </Link>
                      </li>
                    </ul>
                  )}
                </div>
              ))}
            </motion.div>
          </PopoverContent>
        </Popover>

        {/* Featured Category Links */}
        <div className="ml-4 flex items-center gap-1">
          {featuredCategoriesInNavbar.map(cat => (
            <Button
              key={cat.slug}
              as={Link}
              href={`/services?category=${cat.slug}`}
              variant="light"
              size="sm"
              radius="full"
              startContent={<cat.icon className="h-3.5 w-3.5" />}
              className="text-default-500 text-xs font-medium hover:text-primary"
            >
              {cat.name}
            </Button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-1">
          <Button
            as={Link}
            href="/blog"
            variant="light"
            size="sm"
            radius="full"
            startContent={<Newspaper className="h-3.5 w-3.5" />}
            className="text-default-500 text-xs font-medium hover:text-primary"
          >
            Blog
          </Button>
          <Button
            as={Link}
            href="/portfolio"
            variant="light"
            size="sm"
            radius="full"
            startContent={<Briefcase className="h-3.5 w-3.5" />}
            className="text-default-500 text-xs font-medium hover:text-primary"
          >
            Portfolio
          </Button>
        </div>
      </div>
    </nav>
  );
}

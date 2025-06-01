
import Link from 'next/link';
import { LogIn, UserPlus, Brush, ChevronDown, LayoutGrid } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/shared/mode-toggle';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Mock data for categories and sub-categories (similar to admin panel data)
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


export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Brush className="h-6 w-6 text-primary" />
          <span className="font-bold font-headline text-lg">DesignFlow</span>
        </Link>
        <nav className="flex flex-1 items-center space-x-4 lg:space-x-6">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                Categories <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[600px] p-4 shadow-xl" align="start">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
                {menuStructure.map((category) => (
                  <div key={category.id}>
                    <h3 className="mb-2 font-semibold text-foreground">
                      <Link 
                        href={`/services?category=${category.slug}`} 
                        className="hover:text-primary hover:underline flex items-center"
                      >
                        <LayoutGrid className="mr-2 h-4 w-4 text-primary/70" /> 
                        {category.name}
                      </Link>
                    </h3>
                    {category.subcategories.length > 0 && (
                      <ul className="space-y-1 pl-4">
                        {category.subcategories.map((sub) => (
                          <li key={sub.id}>
                            <Link 
                              href={`/services?category=${category.slug}&subcategory=${sub.slug}`} 
                              className="text-sm text-muted-foreground hover:text-primary hover:underline"
                            >
                              {sub.name}
                            </Link>
                          </li>
                        ))}
                         <li>
                            <Link 
                              href={`/services?category=${category.slug}`} 
                              className="text-sm font-medium text-primary/90 hover:text-primary hover:underline pt-1 block"
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
          {/* Example of other links if needed */}
          {/* <Link
            href="/how-it-works"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            How it Works
          </Link> */}
        </nav>
        <div className="flex items-center space-x-2">
          <ModeToggle />
          <Button variant="ghost" asChild>
            <Link href="/login">
              <LogIn className="mr-2 h-4 w-4" />
              Login
            </Link>
          </Button>
          <Button asChild>
            <Link href="/signup">
              <UserPlus className="mr-2 h-4 w-4" />
              Sign Up
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

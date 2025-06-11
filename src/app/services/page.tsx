
"use client"; 

import { Navbar } from '@/components/layout/navbar';
import { CategoriesNavbar } from '@/components/layout/categories-navbar';
import { Footer } from '@/components/layout/footer';
import { ServiceCard } from '@/components/shared/service-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Palette, Share2, Printer, Laptop, Brush as BrushIcon, Package as PackageIcon, ListFilter, Search, Check, Tag, Film, Presentation, Camera } from 'lucide-react'; 
import type { Icon as LucideIconType } from 'lucide-react'; 
import { useState, useMemo, useEffect } from 'react'; 
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useSearchParams } from 'next/navigation';
import type { Metadata } from 'next';

interface ServiceTier {
  name: 'Basic' | 'Standard' | 'Premium';
  price: number;
}

interface Service {
  id: string;
  name: string;
  description: string; 
  category: string;
  categorySlug: string;
  imageUrl: string;
  imageHint: string;
  tiers: ServiceTier[];
  tags?: string[];
}

const services: Service[] = [
  { 
    id: '1', name: 'Modern Logo Design', 
    description: 'Unique logos for Indian brands, startups, and businesses. Get a memorable identity that resonates with your target audience.', 
    category: 'Logo Design', categorySlug: 'logo-design',
    imageUrl: 'https://placehold.co/600x400.png', imageHint: 'indian startup logo',
    tags: ['branding', 'startup india', 'vector logo', 'e-commerce logo', 'brand identity'],
    tiers: [
      { name: 'Basic', price: 4999 }, { name: 'Standard', price: 9999 }, { name: 'Premium', price: 14999 },
    ]
  },
  { 
    id: '2', name: 'Social Media Pack', 
    description: 'Engaging posts for Instagram, Facebook, optimized for Indian festivals, regional trends, and audience engagement.', 
    category: 'Social Media', categorySlug: 'social-media',
    imageUrl: 'https://placehold.co/600x400.png', imageHint: 'diwali social media graphics',
    tags: ['instagram marketing', 'festival creatives', 'regional content', 'whatsapp status', 'social media marketing'],
    tiers: [
      { name: 'Basic', price: 2499 }, { name: 'Standard', price: 4999 },
    ]
  },
  { 
    id: '3', name: 'Professional Brochure Design', 
    description: 'Tri-fold or bi-fold brochures for Indian businesses and events. Ideal for marketing collateral and corporate profiles.', 
    category: 'Print Design', categorySlug: 'print-design',
    imageUrl: 'https://placehold.co/600x400.png', imageHint: 'indian company brochure',
    tags: ['marketing material', 'event brochure', 'corporate profile', 'print ads india', 'catalogue design'],
    tiers: [
      { name: 'Standard', price: 7999 }, { name: 'Premium', price: 12999 },
    ]
  },
  { 
    id: '4', name: 'UI/UX Web Design Mockup', 
    description: 'High-fidelity mockups for websites targeting Indian users, considering local UI patterns and accessibility.', 
    category: 'UI/UX Design', categorySlug: 'ui-ux-design',
    imageUrl: 'https://placehold.co/600x400.png', imageHint: 'website design india',
    tags: ['responsive design', 'mobile first india', 'figma design', 'e-commerce ui', 'landing page design'],
    tiers: [
      { name: 'Standard', price: 15999 }, { name: 'Premium', price: 23999 },
    ]
  },
  { 
    id: '5', name: 'Custom Illustration', 
    description: 'Unique illustrations with options for Indian art styles like Madhubani, Warli, or modern digital art for various applications.', 
    category: 'Illustration', categorySlug: 'illustration',
    imageUrl: 'https://placehold.co/600x400.png', imageHint: 'madhubani art digital',
    tags: ['digital art india', 'character design', 'indian folk art', 'custom graphics', 'vector illustration'],
    tiers: [
      { name: 'Basic', price: 3999 }, { name: 'Standard', price: 7999 }, { name: 'Premium', price: 11999 },
    ]
  },
  { 
    id: '6', name: 'Packaging Design Concept', 
    description: 'Creative packaging concepts for Indian FMCG, sweets, or artisanal products, designed for the local retail landscape.', 
    category: 'Packaging', categorySlug: 'packaging',
    imageUrl: 'https://placehold.co/600x400.png', imageHint: 'indian sweet box packaging',
    tags: ['product packaging', 'fmcg design', 'label design', 'sustainable packaging india', 'box design'],
    tiers: [
      { name: 'Standard', price: 12999 }, { name: 'Premium', price: 19999 },
    ]
  },
  { 
    id: '7', name: 'Basic Logo Sketch', 
    description: 'Quick logo sketches exploring Indian motifs and modern design ideas for initial concept development.', 
    category: 'Logo Design', categorySlug: 'logo-design',
    imageUrl: 'https://placehold.co/600x400.png', imageHint: 'indian elephant logo sketch',
    tags: ['logo ideation', 'concept sketch', 'indian motifs', 'quick design', 'brainstorming'],
    tiers: [ { name: 'Basic', price: 2499 }, ]
  },
  { 
    id: '8', name: 'Animated Explainer Video', 
    description: 'Short animated videos (2D) to explain your product/service, with Hinglish voiceover option for wider reach in India.', 
    category: 'Motion Graphics', categorySlug: 'motion-graphics',
    imageUrl: 'https://placehold.co/600x400.png', imageHint: 'explainer video animation',
    tags: ['2d animation', 'marketing video', 'product demo', 'hinglish content', 'video marketing'],
    tiers: [ { name: 'Standard', price: 19999 }, { name: 'Premium', price: 34999 } ]
  },
  { 
    id: '9', name: 'Business Presentation Design', 
    description: 'Professional presentations for Indian businesses, investors, and conferences, ensuring clarity and impact.', 
    category: 'Presentations', categorySlug: 'presentations',
    imageUrl: 'https://placehold.co/600x400.png', imageHint: 'business ppt slide india',
    tags: ['pitch deck india', 'corporate presentation', 'powerpoint design', 'investor deck', 'keynote slides'],
    tiers: [ { name: 'Standard', price: 8999 }, { name: 'Premium', price: 15999 } ]
  },
  {
    id: '10', name: 'App Icon Design',
    description: 'Memorable and scalable app icons for iOS and Android, designed to appeal to the Indian mobile user base.',
    category: 'UI/UX Design', categorySlug: 'ui-ux-design',
    imageUrl: 'https://placehold.co/600x400.png', imageHint: 'mobile app icon india',
    tags: ['app icon', 'ios design', 'android design', 'mobile branding', 'icon set'],
    tiers: [{ name: 'Standard', price: 3999 }, { name: 'Premium', price: 6999 }],
  },
  {
    id: '11', name: 'E-commerce Product Photography Editing',
    description: 'Professional editing and retouching for e-commerce product photos, suitable for Indian online marketplaces.',
    category: 'Photography', categorySlug: 'photography',
    imageUrl: 'https://placehold.co/600x400.png', imageHint: 'product photo editing',
    tags: ['photo retouching', 'background removal', 'amazon india', 'flipkart', 'image enhancement'],
    tiers: [{ name: 'Basic', price: 1999 }, { name: 'Standard', price: 4999 }],
  },
  {
    id: '12', name: 'Infographic Design',
    description: 'Visually compelling infographics to present data and information clearly for Indian audiences.',
    category: 'Illustration', categorySlug: 'illustration',
    imageUrl: 'https://placehold.co/600x400.png', imageHint: 'data infographic india',
    tags: ['data visualization', 'report design', 'visual content', 'content marketing india'],
    tiers: [{ name: 'Standard', price: 6999 }, { name: 'Premium', price: 11999 }],
  },
];

interface CategoryFilterItem {
  name: string;
  icon: LucideIconType;
  slug: string;
}

const categoryFilters: CategoryFilterItem[] = [
  { name: 'Logo Design', icon: Palette, slug: 'logo-design' },
  { name: 'Social Media', icon: Share2, slug: 'social-media' },
  { name: 'Print Design', icon: Printer, slug: 'print-design' },
  { name: 'UI/UX Design', icon: Laptop, slug: 'ui-ux-design' },
  { name: 'Illustration', icon: BrushIcon, slug: 'illustration' },
  { name: 'Packaging', icon: PackageIcon, slug: 'packaging' },
  { name: 'Motion Graphics', icon: Film, slug: 'motion-graphics' }, 
  { name: 'Presentations', icon: Presentation, slug: 'presentations' },
  { name: 'Photography', icon: Camera, slug: 'photography' },
];

const sortOptions = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
];

const uniqueTags = Array.from(new Set(services.flatMap(service => service.tags || []).map(tag => tag.toLowerCase()))).sort();
const uniqueTierNames = Array.from(new Set(services.flatMap(service => service.tiers.map(tier => tier.name)))).sort();

export const metadata: Metadata = {
  title: 'All Design Services | DesignFlow India',
  description: 'Browse all design services offered on DesignFlow. Find solutions for logo design, UI/UX, print, social media, and more, tailored for the Indian market.',
  openGraph: {
    title: 'All Design Services | DesignFlow India',
    description: 'Explore our full catalog of creative design services. Connect with expert Indian designers today.',
  },
};


export default function ServicesPage() {
  const searchParams = useSearchParams(); 
  const initialCategorySlug = searchParams.get('category');

  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [selectedTiers, setSelectedTiers] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<string>('relevance');

  useEffect(() => {
    if (initialCategorySlug) {
      const categoryFromUrl = categoryFilters.find(cat => cat.slug === initialCategorySlug);
      if (categoryFromUrl) {
        setActiveCategory(categoryFromUrl.name);
      }
    }
  }, [initialCategorySlug]);

  const handleCategoryClick = (categoryName: string | null) => {
    setActiveCategory(prev => prev === categoryName ? null : categoryName);
  };

  const handleTagChange = (tag: string, checked: boolean) => {
    setSelectedTags(prev => {
      const newSet = new Set(prev);
      if (checked) newSet.add(tag);
      else newSet.delete(tag);
      return newSet;
    });
  };

  const handleTierChange = (tierName: string, checked: boolean) => {
    setSelectedTiers(prev => {
      const newSet = new Set(prev);
      if (checked) newSet.add(tierName);
      else newSet.delete(tierName);
      return newSet;
    });
  };
  
  const clearAllFilters = () => {
    setActiveCategory(null);
    setSelectedTags(new Set());
    setSelectedTiers(new Set());
    setSearchTerm('');
    // Optionally reset URL query params if desired, but might be better handled by navigation
    // router.push('/services', { scroll: false });
  };


  const displayedServices = useMemo(() => {
    let filtered = [...services];

    if (activeCategory) {
      filtered = filtered.filter(service => service.category === activeCategory);
    }

    if (selectedTags.size > 0) {
      filtered = filtered.filter(service => 
        service.tags?.some(tag => selectedTags.has(tag.toLowerCase()))
      );
    }

    if (selectedTiers.size > 0) {
      filtered = filtered.filter(service => 
        service.tiers.some(tier => selectedTiers.has(tier.name))
      );
    }
    
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(service => 
        service.name.toLowerCase().includes(lowerSearchTerm) ||
        service.description.toLowerCase().includes(lowerSearchTerm) ||
        service.category.toLowerCase().includes(lowerSearchTerm) ||
        service.tags?.some(tag => tag.toLowerCase().includes(lowerSearchTerm))
      );
    }
    
    if (sortBy === 'price-asc') {
      filtered.sort((a, b) => Math.min(...a.tiers.map(t => t.price)) - Math.min(...b.tiers.map(t => t.price)));
    } else if (sortBy === 'price-desc') {
      filtered.sort((a, b) => Math.min(...b.tiers.map(t => t.price)) - Math.min(...a.tiers.map(t => t.price)));
    }

    return filtered;
  }, [activeCategory, selectedTags, selectedTiers, searchTerm, sortBy]);


  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <CategoriesNavbar />
      <main className="flex-grow container mx-auto py-12 px-5">
        <h1 className="text-4xl font-bold font-headline mb-8 text-center">Explore Our Design Services</h1>
        
        <div className="md:grid md:grid-cols-[300px_1fr] md:gap-8">
          <aside className="mb-8 md:mb-0 md:sticky md:top-24 md:self-start md:h-[calc(100vh-8rem)] md:overflow-y-auto pr-2 pb-4">
            <Card className="shadow-md">
               <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-lg font-headline flex items-center"><ListFilter className="mr-2 h-5 w-5 text-primary" /> Filters</CardTitle>
                {(activeCategory || selectedTags.size > 0 || selectedTiers.size > 0 || searchTerm) && (
                  <Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-xs">
                    <Check className="mr-1 h-3 w-3" /> Clear All
                  </Button>
                )}
              </CardHeader>
              <CardContent className="space-y-5">
                <section>
                  <h3 className="text-md font-semibold mb-2 flex items-center"><Palette className="mr-2 h-4 w-4 text-muted-foreground" />Categories</h3>
                  <ul className="space-y-1">
                    <li>
                      <Button
                        variant={!activeCategory ? 'secondary' : 'ghost'}
                        className="w-full justify-start text-sm h-8 px-2"
                        onClick={() => handleCategoryClick(null)}
                      >
                        All Services
                      </Button>
                    </li>
                    {categoryFilters.map(category => (
                      <li key={category.slug}>
                        <Button
                          variant={activeCategory === category.name ? 'secondary' : 'ghost'}
                          className="w-full justify-start text-sm h-8 px-2"
                          onClick={() => handleCategoryClick(category.name)}
                        >
                          <category.icon className="mr-2 h-4 w-4 text-primary/80" />
                          {category.name}
                        </Button>
                      </li>
                    ))}
                  </ul>
                </section>

                {uniqueTags.length > 0 && (
                  <section>
                    <h3 className="text-md font-semibold mb-2 flex items-center"><Tag className="mr-2 h-4 w-4 text-muted-foreground" />Tags</h3>
                    <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
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

                {uniqueTierNames.length > 0 && (
                  <section>
                    <h3 className="text-md font-semibold mb-2 flex items-center"><PackageIcon className="mr-2 h-4 w-4 text-muted-foreground" />Tiers</h3>
                    <div className="space-y-1.5">
                      {uniqueTierNames.map(tierName => (
                        <div key={tierName} className="flex items-center space-x-2">
                          <Checkbox
                            id={`tier-${tierName.replace(/\s+/g, '-')}`}
                            checked={selectedTiers.has(tierName)}
                            onCheckedChange={(checked) => handleTierChange(tierName, !!checked)}
                          />
                          <Label htmlFor={`tier-${tierName.replace(/\s+/g, '-')}`} className="text-sm font-normal cursor-pointer">
                            {tierName}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </CardContent>
            </Card>
          </aside>

          <div className="min-w-0">
            <div className="mb-6 p-4 bg-card border rounded-lg shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative flex-grow w-full md:w-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                  placeholder="Search services, categories, tags..." 
                  className="pl-10 text-base py-3 w-full" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="text-base py-3 w-full md:w-[200px] shrink-0">
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

            {displayedServices.length > 0 ? (
              <div className="grid sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
                {displayedServices.map(service => (
                  <ServiceCard 
                    key={service.id} 
                    id={service.id}
                    name={service.name}
                    description={service.description}
                    category={service.category}
                    imageUrl={service.imageUrl}
                    imageHint={service.imageHint}
                    tiers={service.tiers}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 col-span-full flex flex-col items-center justify-center h-full">
                <PackageIcon className="mx-auto h-24 w-24 text-muted-foreground opacity-50" />
                <h2 className="mt-6 text-2xl font-semibold">No Services Found</h2>
                <p className="mt-2 text-muted-foreground">
                  Try adjusting your filters or search term.
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
}

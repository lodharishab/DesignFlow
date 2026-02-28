
import Link from 'next/link';
import Image from 'next/image';
import { Navbar } from '@/components/layout/navbar';
import { CategoriesNavbar } from '@/components/layout/categories-navbar';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { PortfolioShowcaseCard } from '@/app/page'; 
import type { PortfolioItem } from '@/components/shared/portfolio-item-card';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Palette, Share2, Printer, Laptop, Brush as BrushIconLucide, Package as PackageIcon, Film, Presentation, Camera, ArrowRight, Sparkles, Eye, Briefcase } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { getAllPortfolioItems } from '@/lib/portfolio-db';
import { getAllServices } from '@/lib/services-db';
import type { Metadata } from 'next';
import { PopularServicesSection, type ServiceData } from '@/components/design-services/popular-services-section';

// Data for the Service Categories Carousel
const serviceCategoriesData: Array<{ name: string; slug: string; icon: LucideIcon; description: string; shortDesc: string; }> = [
  { name: 'Logo Design', slug: 'logo-design', icon: Palette, description: 'Craft unique brand identities that resonate with your audience and reflect your business values.', shortDesc: 'Brand identities that resonate.' },
  { name: 'Web UI/UX', slug: 'web-ui-ux', icon: Laptop, description: 'User-centric web and app interfaces designed for seamless experiences on all devices.', shortDesc: 'User-centric web & app UI/UX.' },
  { name: 'Print Materials', slug: 'print-materials', icon: Printer, description: 'Eye-catching brochures, flyers, and business cards that make a lasting impression for your business.', shortDesc: 'Brochures, flyers, cards.' },
  { name: 'Illustrations', slug: 'illustration', icon: BrushIconLucide, description: 'Custom illustrations and graphics, from digital art to traditional styles, to bring your ideas to life.', shortDesc: 'Custom digital art.' },
  { name: 'Social Media Graphics', slug: 'social-media-graphics', icon: Share2, description: 'Engaging visuals for Instagram, Facebook, and other platforms, tailored for events and trends.', shortDesc: 'Engaging social visuals.' },
  { name: 'Packaging Design', slug: 'packaging', icon: PackageIcon, description: 'Innovative packaging concepts that make your products stand out on shelves.', shortDesc: 'Product packaging concepts.' },
  { name: 'Motion Graphics', slug: 'motion-graphics', icon: Film, description: 'Dynamic animations and explainer videos to captivate your audience and tell your story.', shortDesc: 'Animations & explainer videos.' },
  { name: 'Presentations', slug: 'presentations', icon: Presentation, description: 'Professional pitch decks and presentations that convey your message with impact.', shortDesc: 'Impactful pitch decks.' },
];

// ITEMS_PER_PAGE for initial load
const ITEMS_PER_PAGE = 6;

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Discover Design Services | DesignFlow',
  description: 'Explore a wide range of creative design services. Find expert designers for logos, UI/UX, branding, and more on DesignFlow.',
  openGraph: {
    title: 'Discover Design Services | DesignFlow',
    description: 'Browse our comprehensive catalog of design services, from logo creation to web UI/UX, perfect for businesses and startups.',
  },
};


export default async function DesignServicesPage() {
  // Fetch services and portfolio from DB
  const [dbServices, dbPortfolioItems] = await Promise.all([
    getAllServices(),
    getAllPortfolioItems(),
  ]);

  // Map DB ServiceData to PopularServicesSection ServiceData
  const allPopularServices: ServiceData[] = dbServices.map(s => ({
    id: s.id,
    name: s.name,
    description: s.generalDescription || '',
    tiers: s.tiers.map(t => ({ name: t.name as 'Basic' | 'Standard' | 'Premium', price: t.price })),
    category: s.category || '',
    imageUrl: s.imageUrl || 'https://placehold.co/600x400.png',
    imageHint: s.imageHint || s.name.toLowerCase(),
  }));

  const initialPopularServices = allPopularServices.slice(0, ITEMS_PER_PAGE);
  const portfolioGlanceItems: PortfolioItem[] = dbPortfolioItems.slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <CategoriesNavbar />
      <main className="flex-grow">
        {/* Hero Section with Category Carousel */}
        <section className="py-20 md:py-24 bg-muted text-center">
          <div className="container mx-auto px-5">
            <h1 className="text-4xl md:text-5xl font-bold font-headline mb-6">
              Your Vision, <span className="text-primary">Expertly Designed</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-12 max-w-3xl mx-auto">
              Explore a comprehensive range of creative services tailored to elevate your brand. From stunning logos to seamless web experiences, our expert designers are here to bring your ideas to life.
            </p>
            
            <div className="w-full overflow-hidden group">
              <div className="flex animate-marquee group-hover:pause-animation">
                {serviceCategoriesData.map(category => (
                  <Link key={`${category.slug}-1`} href={`/services?category=${category.slug}`} passHref className="flex-shrink-0 mx-3">
                    <Card className="w-[220px] md:w-[260px] h-full shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col items-center text-center p-6 hover:border-primary cursor-pointer bg-card">
                      <CardHeader className="p-0 items-center">
                        <div className="p-4 bg-primary/10 rounded-full mb-4 inline-flex">
                          <category.icon className="h-10 w-10 md:h-12 md:w-12 text-primary" />
                        </div>
                        <CardTitle className="font-headline text-lg md:text-xl mb-2 leading-tight">{category.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="p-0 flex-grow">
                        <CardDescription className="text-sm text-muted-foreground line-clamp-2">
                          {category.shortDesc}
                        </CardDescription>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
                {serviceCategoriesData.map(category => (
                  <Link key={`${category.slug}-2`} href={`/services?category=${category.slug}`} passHref className="flex-shrink-0 mx-3" aria-hidden="true">
                     <Card className="w-[220px] md:w-[260px] h-full shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col items-center text-center p-6 hover:border-primary cursor-pointer bg-card">
                      <CardHeader className="p-0 items-center">
                        <div className="p-4 bg-primary/10 rounded-full mb-4 inline-flex">
                          <category.icon className="h-10 w-10 md:h-12 md:w-12 text-primary" />
                        </div>
                        <CardTitle className="font-headline text-lg md:text-xl mb-2 leading-tight">{category.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="p-0 flex-grow">
                        <CardDescription className="text-sm text-muted-foreground line-clamp-2">
                          {category.shortDesc}
                        </CardDescription>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Popular Services Section */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-5">
            <h2 className="text-3xl md:text-4xl font-bold font-headline text-center mb-4">
              <Sparkles className="inline-block mr-3 h-8 w-8 text-primary mb-1" />
              Popular Design Services
            </h2>
            <p className="text-lg text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
              Check out some of our most sought-after services, crafted by expert designers.
            </p>
            <PopularServicesSection 
              initialServices={initialPopularServices} 
              allServices={allPopularServices} 
            />
            <div className="text-center mt-16">
              <Button size="lg" asChild variant="outline">
                <Link href="/services">
                  Explore Full Service Catalog <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Portfolio Glance Section */}
        <section className="py-16 md:py-24 bg-card">
          <div className="container mx-auto px-5">
            <h2 className="text-3xl md:text-4xl font-bold font-headline text-center mb-4">Portfolio at a Glance</h2>
            <p className="text-lg text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
              Get inspired by the quality and creativity our designers bring to projects for clients.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {portfolioGlanceItems.map(item => (
                <PortfolioShowcaseCard key={item.id} item={item} />
              ))}
            </div>
            <div className="text-center mt-16">
              <Button size="lg" asChild>
                <Link href="/portfolio">
                  View Full Portfolio <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
    
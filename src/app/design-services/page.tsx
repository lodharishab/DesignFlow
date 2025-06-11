
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Navbar } from '@/components/layout/navbar';
import { CategoriesNavbar } from '@/components/layout/categories-navbar';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ServiceCard } from '@/components/shared/service-card';
import { PortfolioShowcaseCard } from '@/app/page';
import type { PortfolioItem } from '@/components/shared/portfolio-item-card';
import { Palette, Share2, Printer, Laptop, Brush as BrushIconLucide, Package as PackageIcon, Film, Presentation, Camera, ArrowRight, Sparkles, Eye, Briefcase } from 'lucide-react';
import type { Icon as LucideIconType } from 'lucide-react';
import { allPortfolioItemsData as globalPortfolioItems } from '@/app/portfolio/page';

// Data for the Service Categories Carousel
const serviceCategoriesData: Array<{ name: string; slug: string; icon: LucideIconType; description: string; shortDesc: string; }> = [
  { name: 'Logo Design', slug: 'logo-design', icon: Palette, description: 'Craft unique brand identities that resonate with your audience and reflect your business values in India.', shortDesc: 'Brand identities that resonate.' },
  { name: 'Web UI/UX', slug: 'web-ui-ux', icon: Laptop, description: 'User-centric web and app interfaces designed for seamless experiences on all devices for the Indian market.', shortDesc: 'User-centric web & app UI/UX.' },
  { name: 'Print Materials', slug: 'print-materials', icon: Printer, description: 'Eye-catching brochures, flyers, and business cards that make a lasting impression for your Indian business.', shortDesc: 'Brochures, flyers, cards.' },
  { name: 'Illustrations', slug: 'illustration', icon: BrushIconLucide, description: 'Custom illustrations and graphics, from digital art to traditional Indian styles, to bring your ideas to life.', shortDesc: 'Custom digital art.' },
  { name: 'Social Media Graphics', slug: 'social-media-graphics', icon: Share2, description: 'Engaging visuals for Instagram, Facebook, and other platforms, tailored for Indian festivals and trends.', shortDesc: 'Engaging social visuals.' },
  { name: 'Packaging Design', slug: 'packaging', icon: PackageIcon, description: 'Innovative packaging concepts that make your products stand out on Indian shelves.', shortDesc: 'Product packaging concepts.' },
  { name: 'Motion Graphics', slug: 'motion-graphics', icon: Film, description: 'Dynamic animations and explainer videos to captivate your audience and tell your story.', shortDesc: 'Animations & explainer videos.' },
  { name: 'Presentations', slug: 'presentations', icon: Presentation, description: 'Professional pitch decks and presentations that convey your message with impact.', shortDesc: 'Impactful pitch decks.' },
];

const featuredServicesData = [
  { id: '1', name: 'Modern Logo Design', description: 'Unique logos for Indian brands and startups, capturing your brand essence.', tiers: [{name: 'Standard', price: 9999}], category: 'Logo Design', imageUrl: 'https://placehold.co/600x400.png', imageHint: 'indian startup logo' },
  { id: '4', name: 'UI/UX Web Design Mockup', description: 'User-friendly web mockups for the Indian market, focusing on great user experience.', tiers: [{name: 'Standard', price: 15999}], category: 'UI/UX Design', imageUrl: 'https://placehold.co/600x400.png', imageHint: 'website design india' },
  { id: '2', name: 'Social Media Pack', description: 'Engaging posts for Indian festivals and social media campaigns. Boost your online presence.', tiers: [{name: 'Standard', price: 4999}], category: 'Social Media', imageUrl: 'https://placehold.co/600x400.png', imageHint: 'diwali social media' },
];

const portfolioGlanceItems: PortfolioItem[] = globalPortfolioItems.slice(0, 3);


export default function DesignServicesPage() {
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
              Explore a comprehensive range of creative services tailored to elevate your brand. From stunning logos to seamless web experiences, our expert Indian designers are here to bring your ideas to life.
            </p>
            
            {/* Category Carousel */}
            <div className="w-full overflow-hidden group">
              <div className="flex animate-marquee group-hover:pause-animation">
                {/* Render items twice for seamless loop */}
                {serviceCategoriesData.map(category => (
                  <Link key={`${category.slug}-1`} href={`/services?category=${category.slug}`} passHref className="flex-shrink-0 mx-3">
                    <Card className="w-[220px] md:w-[260px] h-full shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col items-center text-center p-6 hover:border-primary cursor-pointer bg-card">
                      <div className="p-4 bg-primary/10 rounded-full mb-4 inline-flex">
                        <category.icon className="h-10 w-10 md:h-12 md:w-12 text-primary" />
                      </div>
                      <CardTitle className="font-headline text-lg md:text-xl mb-2 leading-tight">{category.name}</CardTitle>
                      <CardDescription className="text-sm text-muted-foreground flex-grow line-clamp-2">
                        {category.shortDesc}
                      </CardDescription>
                    </Card>
                  </Link>
                ))}
                {serviceCategoriesData.map(category => (
                  <Link key={`${category.slug}-2`} href={`/services?category=${category.slug}`} passHref className="flex-shrink-0 mx-3" aria-hidden="true">
                     <Card className="w-[220px] md:w-[260px] h-full shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col items-center text-center p-6 hover:border-primary cursor-pointer bg-card">
                      <div className="p-4 bg-primary/10 rounded-full mb-4 inline-flex">
                        <category.icon className="h-10 w-10 md:h-12 md:w-12 text-primary" />
                      </div>
                      <CardTitle className="font-headline text-lg md:text-xl mb-2 leading-tight">{category.name}</CardTitle>
                      <CardDescription className="text-sm text-muted-foreground flex-grow line-clamp-2">
                        {category.shortDesc}
                      </CardDescription>
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
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredServicesData.map(service => (
                <ServiceCard key={service.id} {...service} />
              ))}
            </div>
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
              Get inspired by the quality and creativity our designers bring to projects for clients across India.
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

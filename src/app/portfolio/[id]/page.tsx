
"use client";

import { useEffect, useState, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import { CategoriesNavbar } from '@/components/layout/categories-navbar';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Briefcase, CalendarDays, ExternalLink, Tag, UserCircle, Users, PackageSearch, Lightbulb } from 'lucide-react';
import type { PortfolioItem } from '@/components/shared/portfolio-item-card'; // Re-use the rich type

// Re-using the detailed portfolio data from the main portfolio page for simulation
// In a real app, this data would be fetched for the specific [id]
const allPortfolioItemsData: PortfolioItem[] = [
 {
    id: 'ecomm-reimagined-platform',
    title: 'E-commerce Reimagined Platform',
    category: 'Web UI/UX',
    categorySlug: 'web-ui-ux',
    clientName: 'FutureRetail Inc.',
    projectDate: 'July 2024',
    coverImageUrl: 'https://placehold.co/1200x675.png', // Using a 16:9 or similar for hero
    coverImageHint: 'modern website homepage hero',
    projectDescription: 'A complete overhaul of a multi-vendor e-commerce platform, focusing on a streamlined user journey, enhanced product discovery, and a modern, clean aesthetic. The project involved extensive UX research, interactive prototyping, and a comprehensive UI style guide delivered in Figma. We aimed to increase conversion rates and improve overall user satisfaction through intuitive design patterns and a visually appealing interface.',
    galleryImages: [
      { url: 'https://placehold.co/1200x800.png', hint: 'dashboard analytics view', caption: 'Dashboard Overview - Clean data visualization for sellers.' },
      { url: 'https://placehold.co/1200x800.png', hint: 'product listing page detailed', caption: 'Product Grid - Enhanced filtering and quick view options.' },
      { url: 'https://placehold.co/1200x800.png', hint: 'mobile app checkout flow', caption: 'Mobile Checkout Flow - Optimized for speed and ease of use.' },
      { url: 'https://placehold.co/1200x800.png', hint: 'user profile screen', caption: 'User Profile Management.' },
    ],
    tags: ['e-commerce', 'ux design', 'ui design', 'web application', 'figma', 'prototyping', 'user research'],
    designer: { name: 'Alice Wonderland', avatarUrl: 'https://placehold.co/80x80.png', imageHint:'woman avatar', profileUrl: '/designers/alice-wonderland' },
  },
  {
    id: 'fintech-mobile-banking-app',
    title: 'Fintech Mobile Banking App',
    category: 'App Design',
    categorySlug: 'app-design',
    clientName: 'InnovateBank Corp.',
    projectDate: 'May 2024',
    coverImageUrl: 'https://placehold.co/1200x675.png',
    coverImageHint: 'finance app screen interface',
    projectDescription: 'Sleek and secure mobile application design for a new-age digital bank. Features include intuitive navigation, personalized dashboards, and gamified savings goals. Designed for iOS and Android, the app provides a seamless banking experience focusing on clarity and trust. Security features were paramount in the design process.',
    galleryImages: [
      { url: 'https://placehold.co/1200x800.png', hint: 'app login screen security', caption: 'Secure Biometric Login' },
      { url: 'https://placehold.co/1200x800.png', hint: 'app transaction history detailed', caption: 'Detailed Transaction History & Search' },
      { url: 'https://placehold.co/1200x800.png', hint: 'app savings goal tracker', caption: 'Gamified Savings Goals' },
    ],
    tags: ['mobile app', 'fintech', 'ios', 'android', 'ui/ux', 'banking', 'security'],
    designer: { name: 'Bob The Builder', avatarUrl: 'https://placehold.co/80x80.png', imageHint: 'man avatar', profileUrl: '/designers/bob-the-builder' },
  },
  // Add more detailed items if needed for testing, mirroring structure from portfolio/page.tsx
   {
    id: 'eco-startup-brand-identity',
    title: 'Eco Startup Brand Identity',
    category: 'Logo & Branding',
    categorySlug: 'logo-branding',
    clientName: 'GreenLeaf Goods',
    projectDate: 'April 2024',
    coverImageUrl: 'https://placehold.co/1200x675.png',
    coverImageHint: 'nature logo design branding',
    projectDescription: 'Complete brand identity package for an eco-conscious startup, including logo, color palette, typography, and brand guidelines. The identity aims to convey sustainability, trustworthiness, and a connection to nature. The project included extensive competitor research and mood boarding to define a unique visual language.',
    galleryImages: [
      { url: 'https://placehold.co/1200x800.png', hint: 'brand stationery mockup full', caption: 'Full Stationery Suite (Business Cards, Letterhead)' },
      { url: 'https://placehold.co/1200x800.png', hint: 'brand style guide page detailed', caption: 'Detailed Brand Guidelines Page' },
      { url: 'https://placehold.co/1200x800.png', hint: 'social media branding kit', caption: 'Social Media Profile Kit' },
    ],
    tags: ['branding', 'logo design', 'sustainability', 'identity system', 'graphic design', 'startup'],
    designer: { name: 'Carol Danvers', avatarUrl: 'https://placehold.co/80x80.png', imageHint: 'woman avatar', profileUrl: '/designers/carol-danvers' },
  },
];


function PortfolioDetailPageContent() {
  const params = useParams();
  const router = useRouter();
  const [item, setItem] = useState<PortfolioItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const itemId = params.id as string;

  useEffect(() => {
    if (itemId) {
      setIsLoading(true);
      // Simulate fetching data
      const foundItem = allPortfolioItemsData.find(p => p.id === itemId);
      setItem(foundItem || null);
      setIsLoading(false);
    }
  }, [itemId]);

  if (isLoading) {
    return <div className="flex-grow container mx-auto py-12 px-5 text-center">Loading project details...</div>;
  }

  if (!item) {
    return (
      <div className="flex-grow container mx-auto py-12 px-5 text-center">
        <PackageSearch className="mx-auto h-24 w-24 text-muted-foreground opacity-50" />
        <h1 className="mt-6 text-3xl font-bold font-headline">Project Not Found</h1>
        <p className="mt-2 text-muted-foreground">The project you are looking for does not exist or has been moved.</p>
        <Button asChild className="mt-8" size="lg">
          <Link href="/portfolio">
            <ArrowLeft className="mr-2 h-5 w-5" /> Back to Portfolio
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <CategoriesNavbar />
      <main className="flex-grow">
        {/* Hero Section with Cover Image */}
        <div className="relative w-full h-[40vh] md:h-[60vh] bg-muted">
          <Image
            src={item.coverImageUrl}
            alt={`Cover image for ${item.title}`}
            fill
            style={{ objectFit: 'cover' }}
            priority
            data-ai-hint={item.coverImageHint}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
        </div>

        <div className="container mx-auto px-5 py-10 md:py-16 relative -mt-16 md:-mt-24">
          <Card className="shadow-xl p-6 md:p-10 bg-card">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Left Column: Details & Description */}
              <div className="md:col-span-2 space-y-6">
                <Link href={`/portfolio?category=${item.categorySlug}`} passHref legacyBehavior>
                  <a className="inline-block">
                    <Badge variant="outline" className="text-sm py-1 px-3 mb-2 hover:bg-accent">
                        <Tag className="mr-2 h-4 w-4" /> {item.category}
                    </Badge>
                  </a>
                </Link>
                <h1 className="text-3xl md:text-5xl font-bold font-headline">{item.title}</h1>
                
                <div className="text-muted-foreground space-y-1 text-sm">
                  {item.clientName && <p className="flex items-center"><Briefcase className="mr-2 h-4 w-4" />Client: {item.clientName}</p>}
                  {item.projectDate && <p className="flex items-center"><CalendarDays className="mr-2 h-4 w-4" />Completed: {item.projectDate}</p>}
                </div>

                <Separator />
                <h2 className="text-xl font-semibold font-headline">Project Overview</h2>
                <p className="text-foreground leading-relaxed whitespace-pre-line">{item.projectDescription}</p>

                {item.tags && item.tags.length > 0 && (
                  <>
                    <Separator className="my-6" />
                    <h3 className="text-lg font-semibold font-headline mb-3">Technologies & Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {item.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs capitalize">{tag}</Badge>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Right Column: Designer & CTA */}
              <div className="md:col-span-1 space-y-6">
                {item.designer && (
                  <Card className="bg-secondary/30 p-4">
                    <CardHeader className="p-0 pb-3">
                      <CardTitle className="text-lg font-headline flex items-center">
                        <UserCircle className="mr-2 h-5 w-5 text-primary" /> Designer
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 flex items-center space-x-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={item.designer.avatarUrl} alt={item.designer.name} data-ai-hint={item.designer.imageHint || 'designer avatar'} />
                        <AvatarFallback>{item.designer.name.substring(0,1)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{item.designer.name}</p>
                        {item.designer.profileUrl ? (
                           <Link href={item.designer.profileUrl} className="text-xs text-primary hover:underline">View Profile</Link>
                        ) : <p className="text-xs text-muted-foreground">Profile not available</p>}
                      </div>
                    </CardContent>
                  </Card>
                )}
                <Card className="bg-primary/10 p-5 text-center">
                    <Lightbulb className="h-10 w-10 text-primary mx-auto mb-3" />
                    <h3 className="text-lg font-headline font-semibold mb-2">Have a Similar Project?</h3>
                    <p className="text-sm text-muted-foreground mb-4">Let our experts bring your vision to life.</p>
                    <Button size="lg" className="w-full" asChild>
                        <Link href={`/services?category=${item.categorySlug}`}>Browse {item.category} Services</Link>
                    </Button>
                </Card>
                 <Button variant="outline" onClick={() => router.back()} className="w-full">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Portfolio
                </Button>
              </div>
            </div>
            
            {item.galleryImages && item.galleryImages.length > 0 && (
              <>
                <Separator className="my-8 md:my-12" />
                <h2 className="text-2xl md:text-3xl font-bold font-headline text-center mb-8">Project Gallery</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  {item.galleryImages.map((image, index) => (
                    <div key={index} className="group relative aspect-video overflow-hidden rounded-lg shadow-md">
                      <Image
                        src={image.url}
                        alt={image.caption || `Gallery image ${index + 1} for ${item.title}`}
                        fill
                        style={{ objectFit: 'cover' }}
                        className="transition-transform duration-300 group-hover:scale-105"
                        data-ai-hint={image.hint}
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      {image.caption && (
                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          {image.caption}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function PortfolioItemPage() {
  return (
    <Suspense fallback={<div className="flex flex-col min-h-screen"><Navbar /><CategoriesNavbar /><main className="flex-grow container mx-auto py-12 px-5 text-center">Loading project...</main><Footer /></div>}>
      <PortfolioDetailPageContent />
    </Suspense>
  );
}


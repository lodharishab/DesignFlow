
"use client"; 

import { Navbar } from '@/components/layout/navbar';
import { CategoriesNavbar } from '@/components/layout/categories-navbar';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { ServiceCard } from '@/components/shared/service-card';
import { CheckCircle, Users, Briefcase, UserPlus, Award, Tag, Zap, ShieldCheck, Lightbulb, PackageSearch, MessageSquare, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import React, { useState, useEffect } from 'react'; 
import type { PortfolioItem } from '@/components/shared/portfolio-item-card'; // Ensure this path is correct
import { cn } from '@/lib/utils';

const featuredServices = [
  { id: '1', name: 'Modern Logo Design', description: 'Get a unique and memorable logo for your brand.', tiers: [{name: 'Standard', price: 199}], category: 'Logo Design', imageUrl: 'https://placehold.co/600x400.png', imageHint: 'logo design' },
  { id: '2', name: 'Social Media Post Pack', description: 'Engaging posts designed for your social media channels.', tiers: [{name: 'Standard', price: 99}], category: 'Social Media', imageUrl: 'https://placehold.co/600x400.png', imageHint: 'social media' },
  { id: '3', name: 'Professional Brochure Design', description: 'Stunning brochures to showcase your business.', tiers: [{name: 'Standard', price: 249}], category: 'Print Design', imageUrl: 'https://placehold.co/600x400.png', imageHint: 'brochure design' },
  { id: '4', name: 'UI/UX Web Design Mockup', description: 'High-fidelity mockup for one key page of your website or app.', tiers: [{name: 'Standard', price: 399}], category: 'UI/UX Design', imageUrl: 'https://placehold.co/600x400.png', imageHint: 'website mockup' },
  { id: '5', name: 'Custom Illustration', description: 'Unique vector or raster illustration based on your brief.', tiers: [{name: 'Standard', price: 149}], category: 'Illustration', imageUrl: 'https://placehold.co/600x400.png', imageHint: 'character art' },
  { id: '6', name: 'Packaging Design Concept', description: 'Creative packaging concept for your product.', tiers: [{name: 'Standard', price: 299}], category: 'Packaging Design', imageUrl: 'https://placehold.co/600x400.png', imageHint: 'product box' },
];

const clientBenefits = [
  { icon: Award, title: 'Expert Designers', description: 'Connect with vetted, top-tier designers. Our curated network ensures your project is handled by skilled professionals who deliver excellence.' },
  { icon: Tag, title: 'Transparent Pricing', description: 'Say goodbye to budget surprises. Our fixed-price service packages mean you know the cost upfront, ensuring clarity and control over your expenses.' },
  { icon: Zap, title: 'Streamlined Process', description: 'From intuitive briefs to efficient delivery, our platform simplifies every step. Get your designs faster, with less hassle and more collaboration.' },
  { icon: ShieldCheck, title: 'Quality Guaranteed', description: 'Your satisfaction is our success. We stand behind the quality of our designers\' work, offering revisions and support to ensure exceptional results.' },
];

// Data structure from portfolio/page.tsx is richer, let's align
export const portfolioItemsData: PortfolioItem[] = [
  {
    id: 'ecomm-reimagined-platform', 
    title: 'E-commerce Reimagined Platform',
    category: 'Web UI/UX',
    categorySlug: 'web-ui-ux',
    clientName: 'FutureRetail Inc.',
    projectDate: 'July 2024',
    coverImageUrl: 'https://placehold.co/600x450.png',
    coverImageHint: 'modern website homepage',
    projectDescription: 'A complete overhaul of a multi-vendor e-commerce platform, focusing on a streamlined user journey, enhanced product discovery, and a modern, clean aesthetic. The project involved extensive UX research, interactive prototyping, and a comprehensive UI style guide.',
    galleryImages: [
      { url: 'https://placehold.co/600x450.png', hint: 'modern website homepage', caption: 'Dashboard Overview' },
      { url: 'https://placehold.co/1200x800.png', hint: 'dashboard analytics view', caption: 'Dashboard Overview' },
      { url: 'https://placehold.co/1200x800.png', hint: 'product listing page', caption: 'Product Grid' },
      { url: 'https://placehold.co/1200x800.png', hint: 'mobile app checkout', caption: 'Mobile Checkout Flow' },
    ],
    tags: ['e-commerce', 'ux design', 'ui design', 'web application', 'figma', 'responsive'],
    designer: { id:'des001', slug: 'alice-wonderland', name: 'Alice Wonderland', avatarUrl: 'https://placehold.co/40x40.png', imageHint: 'woman avatar' },
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
      { url: 'https://placehold.co/600x450.png', hint: 'finance app screen', caption: 'Secure Login' },
      { url: 'https://placehold.co/1200x800.png', hint: 'app transaction history', caption: 'Transaction Details' },
    ],
    tags: ['mobile app', 'fintech', 'ios', 'android', 'ui/ux', 'security'],
    designer: { id:'des002', slug: 'bob-the-builder', name: 'Bob The Builder', avatarUrl: 'https://placehold.co/40x40.png', imageHint: 'man avatar' },
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
      { url: 'https://placehold.co/600x450.png', hint: 'nature logo design', caption: 'Brand Stationery Mockup' },
      { url: 'https://placehold.co/1200x800.png', hint: 'brand style guide page', caption: 'Brand Guidelines Snippet' },
    ],
    tags: ['branding', 'logo design', 'sustainability', 'identity system', 'startup'],
    designer: { id:'des003', slug: 'carol-danvers', name: 'Carol Danvers', avatarUrl: 'https://placehold.co/40x40.png', imageHint: 'woman avatar' },
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
      { url: 'https://placehold.co/600x450.png', hint: 'coffee shop menu', caption: 'Loyalty Card Design' },
    ],
    tags: ['print design', 'menu design', 'cafe branding', 'local business', 'rustic'],
    designer: { id:'des004', slug: 'david-copperfield', name: 'David Copperfield', avatarUrl: 'https://placehold.co/40x40.png', imageHint: 'man avatar' },
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
      { url: 'https://placehold.co/600x450.png', hint: 'storybook character art', caption: 'Sample Spread 1' },
      { url: 'https://placehold.co/1200x800.png', hint: 'book spread illustration', caption: 'Character Development' },
    ],
    tags: ['illustration', 'childrens book', 'character design', 'digital art', 'vibrant'],
    designer: { id:'des001', slug: 'alice-wonderland', name: 'Alice Wonderland', avatarUrl: 'https://placehold.co/40x40.png', imageHint: 'woman avatar' },
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
      { url: 'https://placehold.co/600x450.png', hint: 'cosmetic product packaging', caption: 'Label Close-up' },
    ],
    tags: ['packaging design', 'cosmetics', 'sustainability', 'brand identity', 'minimalist'],
    designer: { id:'des002', slug: 'bob-the-builder', name: 'Bob The Builder', avatarUrl: 'https://placehold.co/40x40.png', imageHint: 'man avatar' },
  },
];


interface PortfolioShowcaseCardProps {
  item: PortfolioItem;
}

const PortfolioShowcaseCard: React.FC<PortfolioShowcaseCardProps> = ({ item }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const imagesToShow = item.galleryImages && item.galleryImages.length > 0 ? item.galleryImages : [{ url: item.coverImageUrl, hint: item.coverImageHint }];

  useEffect(() => {
    if (imagesToShow.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imagesToShow.length);
    }, 3500); 

    return () => clearInterval(timer);
  }, [imagesToShow, imagesToShow.length]);

  if (imagesToShow.length === 0) {
    return (
      <Card className="overflow-hidden shadow-lg h-full flex flex-col group">
        <div className="block relative aspect-[4/3] w-full bg-muted flex items-center justify-center">
           <PackageSearch className="w-16 h-16 text-muted-foreground opacity-50" />
        </div>
        <CardContent className="p-4 bg-card flex-grow">
          <h3 className="font-headline text-lg font-semibold group-hover:text-primary transition-colors">{item.category}</h3>
          <p className="text-sm text-muted-foreground mt-1">{item.title}</p>
           <p className="text-xs text-destructive mt-1">Image(s) missing</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden shadow-lg h-full flex flex-col group">
        <Link href={`/portfolio/${item.id}`} passHref legacyBehavior>
            <a className="block relative aspect-[4/3] w-full">
                <Image
                key={imagesToShow[currentImageIndex].url} 
                src={imagesToShow[currentImageIndex].url}
                alt={`${item.title} - image ${currentImageIndex + 1}`}
                fill
                style={{ objectFit: 'cover' }}
                className="transition-all duration-500 ease-in-out group-hover:scale-105"
                data-ai-hint={imagesToShow[currentImageIndex].hint} 
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority={currentImageIndex === 0} 
                />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                     <ExternalLink className="h-5 w-5 text-white/80" />
                </div>
            </a>
        </Link>
      <CardContent className="p-4 bg-card flex-grow">
        <Link href={`/services?category=${item.categorySlug}`} passHref legacyBehavior>
          <a className="inline-block">
             <h3 className="font-headline text-xl text-foreground group-hover:text-primary transition-colors leading-tight">
                {item.category}
             </h3>
          </a>
        </Link>
        {/* Specific project title removed for simplicity on card view */}
        {item.designer && (
            <Link href={`/designers/${item.designer.slug}`} className="text-xs text-muted-foreground mt-1 hover:text-primary hover:underline block">
                By {item.designer.name}
            </Link>
        )}
      </CardContent>
    </Card>
  );
};


export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <CategoriesNavbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-20 md:py-32 bg-gradient-to-br from-secondary to-background">
          <div className="container mx-auto px-5 text-center">
            <h1 className="text-4xl md:text-6xl font-bold font-headline mb-6">
              Transform Your Ideas into <span className="text-primary">Stunning Designs</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-3xl mx-auto">
              DesignFlow is your ultimate marketplace for expert design services. Experience high-quality creative work, a hassle-free process, and upfront cost clarity, all in one place.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Button size="lg" asChild className="w-full sm:w-auto">
                <Link href="/services">
                  <PackageSearch className="mr-2 h-5 w-5" /> Browse All Services
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="w-full sm:w-auto">
                <Link href="/signup">
                  <UserPlus className="mr-2 h-5 w-5" /> Create Your Account
                </Link>
              </Button>
            </div>
          </div>
        </section>
        
        {/* How It Works (Client Perspective) Section */}
        <section className="py-16 md:py-24 bg-card">
          <div className="container mx-auto px-5">
            <h2 className="text-3xl md:text-4xl font-bold font-headline text-center mb-12">Getting Your Design is Easy</h2>
            <div className="grid md:grid-cols-3 gap-10">
              <div className="flex flex-col items-center text-center p-6 rounded-lg bg-background shadow-md">
                <div className="bg-primary text-primary-foreground rounded-full h-12 w-12 flex items-center justify-center text-2xl font-bold mb-4">1</div>
                <h3 className="font-headline text-xl font-semibold mb-2">Browse & Select</h3>
                <p className="text-muted-foreground text-sm">Explore our wide array of fixed-scope design services. Find the perfect package with clearly defined deliverables and transparent, upfront pricing. No hidden fees, just straightforward value.</p>
              </div>
              <div className="flex flex-col items-center text-center p-6 rounded-lg bg-background shadow-md">
                <div className="bg-primary text-primary-foreground rounded-full h-12 w-12 flex items-center justify-center text-2xl font-bold mb-4">2</div>
                <h3 className="font-headline text-xl font-semibold mb-2">Submit Your Brief</h3>
                <p className="text-muted-foreground text-sm">Clearly articulate your vision using our intuitive brief submission process. We guide you to provide all necessary details, ensuring designers understand your needs for a successful project launch.</p>
              </div>
              <div className="flex flex-col items-center text-center p-6 rounded-lg bg-background shadow-md">
                <div className="bg-primary text-primary-foreground rounded-full h-12 w-12 flex items-center justify-center text-2xl font-bold mb-4">3</div>
                <h3 className="font-headline text-xl font-semibold mb-2">Collaborate & Approve</h3>
                <p className="text-muted-foreground text-sm">Engage directly with your chosen expert designer through our platform. Provide feedback, track progress, and approve your final design with confidence and ease. We ensure a smooth collaboration.</p>
              </div>
            </div>
          </div>
        </section>

        {/* The DesignFlow Advantage Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-5">
            <h2 className="text-3xl md:text-4xl font-bold font-headline text-center mb-16">The DesignFlow Advantage: Simple, Reliable, Quality.</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {clientBenefits.map((benefit) => (
                <Card key={benefit.title} className="text-center shadow-lg hover:shadow-xl transition-shadow p-2">
                  <CardHeader className="items-center">
                    <div className="bg-primary/10 p-4 rounded-full mb-4 inline-flex">
                      <benefit.icon className="h-10 w-10 text-primary" />
                    </div>
                    <h3 className="font-headline text-xl font-semibold leading-none tracking-tight">{benefit.title}</h3>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm">{benefit.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Services Section */}
        <section className="py-16 md:py-24 bg-secondary/30">
          <div className="container mx-auto px-5">
            <h2 className="text-3xl md:text-4xl font-bold font-headline text-center mb-12">Popular Design Services</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredServices.map(service => (
                <ServiceCard key={service.id} {...service} />
              ))}
            </div>
            <div className="text-center mt-16">
              <Button size="lg" asChild>
                <Link href="/services">
                  <Briefcase className="mr-2 h-5 w-5" /> Explore All Services
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Our Work / Portfolio Section */}
        <section className="py-16 md:py-24 bg-card">
          <div className="container mx-auto px-5">
            <h2 className="text-3xl md:text-4xl font-bold font-headline text-center mb-4">Explore Our Portfolio Highlights</h2>
             <p className="text-lg text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
              Get inspired by the quality and creativity our designers bring to every project.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {portfolioItemsData.map(item => (
                <PortfolioShowcaseCard key={item.id} item={item} />
              ))}
            </div>
             <div className="text-center mt-16">
              <Button size="lg" variant="outline" asChild>
                <Link href="/portfolio">
                  View Full Portfolio
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Final Call to Action Section */}
        <section className="py-20 md:py-28 bg-primary text-primary-foreground">
          <div className="container mx-auto px-5 text-center">
            <h2 className="text-3xl md:text-4xl font-bold font-headline mb-6">Ready to Elevate Your Brand?</h2>
            <p className="text-lg md:text-xl opacity-90 mb-10 max-w-2xl mx-auto">
              Let our expert designers create something amazing for you. Start your project today and experience the DesignFlow difference!
            </p>
            <Button size="lg" variant="secondary" asChild className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
              <Link href="/services">
                <Lightbulb className="mr-2 h-5 w-5" /> Get Started Now
              </Link>
            </Button>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}


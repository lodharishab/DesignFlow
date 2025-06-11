
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
import { ArrowRight, Sparkles, Eye } from 'lucide-react';


const featuredServicesData = [
  { id: '1', name: 'Modern Logo Design', description: 'Unique logos for Indian brands and startups, capturing your brand essence.', tiers: [{name: 'Standard', price: 9999}], category: 'Logo Design', imageUrl: 'https://placehold.co/600x400.png', imageHint: 'indian startup logo' },
  { id: '4', name: 'UI/UX Web Design Mockup', description: 'User-friendly web mockups for the Indian market, focusing on great user experience.', tiers: [{name: 'Standard', price: 15999}], category: 'UI/UX Design', imageUrl: 'https://placehold.co/600x400.png', imageHint: 'website design india' },
  { id: '2', name: 'Social Media Pack', description: 'Engaging posts for Indian festivals and social media campaigns. Boost your online presence.', tiers: [{name: 'Standard', price: 4999}], category: 'Social Media', imageUrl: 'https://placehold.co/600x400.png', imageHint: 'diwali social media' },
];

const portfolioGlanceItems: PortfolioItem[] = [
  {
    id: 'ecomm-reimagined-platform-india',
    title: 'E-commerce Reimagined',
    category: 'Web UI/UX',
    categorySlug: 'web-ui-ux',
    coverImageUrl: 'https://placehold.co/600x450.png',
    coverImageHint: 'e-commerce website design',
    projectDescription: 'Complete overhaul of a multi-vendor e-commerce platform, focusing on vernacular support and enhanced product discovery.',
    galleryImages: [
      { url: 'https://placehold.co/1200x800.png', hint: 'website homepage india', caption: 'Homepage - Festive Offer' },
      { url: 'https://placehold.co/1200x800.png', hint: 'product page indian dress', caption: 'Saree Product Detail' },
    ],
    designer: { id: 'des001', slug: 'priya-sharma', name: 'Priya Sharma', avatarUrl: 'https://placehold.co/40x40.png', imageHint: 'indian woman designer' },
  },
  {
    id: 'eco-startup-brand-identity-india',
    title: 'Sustainable Lifestyle Branding',
    category: 'Logo & Branding',
    categorySlug: 'logo-branding',
    coverImageUrl: 'https://placehold.co/600x450.png',
    coverImageHint: 'sustainable brand logo',
    projectDescription: 'Complete brand identity package for an eco-conscious Indian lifestyle startup.',
    galleryImages: [
      { url: 'https://placehold.co/1200x800.png', hint: 'packaging design india', caption: 'Eco-friendly Product Packaging' },
    ],
    designer: { id: 'des003', slug: 'aisha-khan', name: 'Aisha Khan', avatarUrl: 'https://placehold.co/40x40.png', imageHint: 'indian woman graphic artist' },
  },
  {
    id: 'childrens-book-indian-mythology',
    title: 'Illustrations for "Tales of Krishna"',
    category: 'Illustration',
    categorySlug: 'illustration',
    coverImageUrl: 'https://placehold.co/600x450.png',
    coverImageHint: 'krishna illustration style',
    projectDescription: 'A series of enchanting illustrations for a children\'s storybook based on Indian mythology.',
    galleryImages: [
      { url: 'https://placehold.co/1200x800.png', hint: 'indian mythology art children', caption: 'Krishna and Gopis' },
    ],
    designer: { id: 'des006', slug: 'arjun-mehta', name: 'Arjun Mehta', avatarUrl: 'https://placehold.co/40x40.png', imageHint: 'indian man photographer' },
  },
];


export default function DesignServicesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <CategoriesNavbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-20 md:py-32 bg-gradient-to-br from-secondary to-background text-center">
          <div className="container mx-auto px-5">
            <h1 className="text-4xl md:text-6xl font-bold font-headline mb-6">
              Discover Our Design <span className="text-primary">Services</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-3xl mx-auto">
              From stunning logos to immersive web experiences, find the perfect creative solution tailored for the Indian market. Explore our offerings and let's bring your vision to life.
            </p>
            {/* Button removed from here as per user request */}
          </div>
        </section>

        {/* Service Categories Section REMOVED */}
        {/* This section is now represented in the CategoriesNavbar */}

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

    
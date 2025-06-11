
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
import type { PortfolioItem } from '@/components/shared/portfolio-item-card'; 
import { cn } from '@/lib/utils';
import { allPortfolioItemsData as globalPortfolioItems } from '@/app/portfolio/page'; // Import the Indianized data

const featuredServices = [
  { id: '1', name: 'Modern Logo Design', description: 'Unique logos for Indian brands and startups.', tiers: [{name: 'Standard', price: 9999}], category: 'Logo Design', imageUrl: 'https://placehold.co/600x400.png', imageHint: 'indian startup logo' },
  { id: '2', name: 'Social Media Pack (India)', description: 'Engaging posts for Indian festivals and social media.', tiers: [{name: 'Standard', price: 4999}], category: 'Social Media', imageUrl: 'https://placehold.co/600x400.png', imageHint: 'diwali social media' },
  { id: '3', name: 'Brochure Design (India)', description: 'Professional brochures for Indian businesses.', tiers: [{name: 'Standard', price: 7999}], category: 'Print Design', imageUrl: 'https://placehold.co/600x400.png', imageHint: 'indian business brochure' },
  { id: '4', name: 'UI/UX Web Design (India)', description: 'User-friendly web mockups for the Indian market.', tiers: [{name: 'Standard', price: 15999}], category: 'UI/UX Design', imageUrl: 'https://placehold.co/600x400.png', imageHint: 'website design india' },
  { id: '5', name: 'Custom Illustration (Indian Art)', description: 'Illustrations with traditional or modern Indian styles.', tiers: [{name: 'Standard', price: 7999}], category: 'Illustration', imageUrl: 'https://placehold.co/600x400.png', imageHint: 'indian folk art' },
  { id: '6', name: 'Packaging Design (India)', description: 'Creative packaging for Indian products.', tiers: [{name: 'Standard', price: 12999}], category: 'Packaging Design', imageUrl: 'https://placehold.co/600x400.png', imageHint: 'indian sweet box' },
];

const clientBenefits = [
  { icon: Award, title: 'Expert Indian Designers', description: 'Connect with vetted, top-tier designers from across India. Our curated network ensures your project is handled by skilled professionals who understand local nuances.' },
  { icon: Tag, title: 'Transparent INR Pricing', description: 'Say goodbye to budget surprises. Our fixed-price service packages in Indian Rupees mean you know the cost upfront, ensuring clarity and control.' },
  { icon: Zap, title: 'Streamlined Process', description: 'From intuitive briefs to efficient delivery, our platform simplifies every step. Get your designs faster, with less hassle and more collaboration with designers who get the Indian context.' },
  { icon: ShieldCheck, title: 'Quality Guaranteed', description: 'Your satisfaction is our success. We stand behind the quality of our designers\' work, offering revisions and support to ensure exceptional results that resonate with your audience.' },
];

// Select a subset of the now Indianized globalPortfolioItems for the homepage
const portfolioItemsData: PortfolioItem[] = globalPortfolioItems.slice(0, 6);


interface PortfolioShowcaseCardProps {
  item: PortfolioItem;
}

const PortfolioShowcaseCard: React.FC<PortfolioShowcaseCardProps> = ({ item }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const imagesToShow = item.galleryImages && item.galleryImages.length > 0 ? item.galleryImages : [{ url: item.coverImageUrl, hint: item.coverImageHint || item.title, caption: item.title }];

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
                alt={imagesToShow[currentImageIndex].caption || item.title}
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
              Transform Your Ideas into <span className="text-primary">Stunning Designs</span> for India
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-3xl mx-auto">
              DesignFlow is your ultimate marketplace for expert design services in India. Experience high-quality creative work, hassle-free process, and upfront cost clarity, all in one place.
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
                <p className="text-muted-foreground text-sm">Explore our wide array of fixed-scope design services. Find the perfect package with clearly defined deliverables and transparent, upfront pricing in INR. No hidden fees, just straightforward value.</p>
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


"use client"; // Add this at the top if PortfolioShowcaseCard uses hooks

import { Navbar } from '@/components/layout/navbar';
import { CategoriesNavbar } from '@/components/layout/categories-navbar';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { ServiceCard } from '@/components/shared/service-card';
import { CheckCircle, Users, Briefcase, UserPlus, Award, Tag, Zap, ShieldCheck, Lightbulb, PackageSearch, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import React, { useState, useEffect } from 'react'; // Import useState and useEffect

const featuredServices = [
  { id: '1', name: 'Modern Logo Design', description: 'Get a unique and memorable logo for your brand.', tiers: [{name: 'Standard', price: 199}], category: 'Logo Design', imageUrl: 'https://placehold.co/600x400.png', imageHint: 'logo design' },
  { id: '2', name: 'Social Media Post Pack', description: 'Engaging posts designed for your social media channels.', tiers: [{name: 'Standard', price: 99}], category: 'Social Media', imageUrl: 'https://placehold.co/600x400.png', imageHint: 'social media' },
  { id: '3', name: 'Professional Brochure Design', description: 'Stunning brochures to showcase your business.', tiers: [{name: 'Standard', price: 249}], category: 'Print Design', imageUrl: 'https://placehold.co/600x400.png', imageHint: 'brochure design' },
  { id: '4', name: 'UI/UX Web Design Mockup', description: 'High-fidelity mockup for one key page of your website or app.', tiers: [{name: 'Standard', price: 399}], category: 'UI/UX Design', imageUrl: 'https://placehold.co/600x400.png', imageHint: 'website mockup' },
  { id: '5', name: 'Custom Illustration', description: 'Unique vector or raster illustration based on your brief.', tiers: [{name: 'Standard', price: 149}], category: 'Illustration', imageUrl: 'https://placehold.co/600x400.png', imageHint: 'character art' },
  { id: '6', name: 'Packaging Design Concept', description: 'Creative packaging concept for your product.', tiers: [{name: 'Standard', price: 299}], category: 'Packaging', imageUrl: 'https://placehold.co/600x400.png', imageHint: 'product box' },
];

const clientBenefits = [
  { icon: Award, title: 'Expert Designers', description: 'Connect with vetted, top-tier designers. Our curated network ensures your project is handled by skilled professionals who deliver excellence.' },
  { icon: Tag, title: 'Transparent Pricing', description: 'Say goodbye to budget surprises. Our fixed-price service packages mean you know the cost upfront, ensuring clarity and control over your expenses.' },
  { icon: Zap, title: 'Streamlined Process', description: 'From intuitive briefs to efficient delivery, our platform simplifies every step. Get your designs faster, with less hassle and more collaboration.' },
  { icon: ShieldCheck, title: 'Quality Guaranteed', description: 'Your satisfaction is our success. We stand behind the quality of our designers\' work, offering revisions and support to ensure exceptional results.' },
];


interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  imageUrls: string[];
  imageHints: string[];
}

const portfolioItemsData: PortfolioItem[] = [
  {
    id: 'ecomm-reimagined',
    title: 'E-commerce Reimagined',
    category: 'Web UI/UX',
    imageUrls: [
      'https://placehold.co/600x400.png?text=Ecom+View+Alpha',
      'https://placehold.co/600x400.png?text=Ecom+View+Bravo',
      'https://placehold.co/600x400.png?text=Ecom+View+Charlie',
    ],
    imageHints: ['website interface', 'product detail', 'checkout flow'],
  },
  {
    id: 'fintech-mobile-suite',
    title: 'Fintech Mobile Suite',
    category: 'App Design',
    imageUrls: [
      'https://placehold.co/600x400.png?text=Fintech+App+1',
      'https://placehold.co/600x400.png?text=Fintech+App+2',
      'https://placehold.co/600x400.png?text=Fintech+App+3',
    ],
    imageHints: ['mobile finance app', 'app dashboard', 'transaction screen'],
  },
  {
    id: 'startup-brand-identity',
    title: 'Startup Brand Identity',
    category: 'Logo & Branding',
    imageUrls: [
      'https://placehold.co/600x400.png?text=New+Startup+Logo',
      'https://placehold.co/600x400.png?text=Brand+Guidelines',
      'https://placehold.co/600x400.png?text=Social+Media+Kit',
    ],
    imageHints: ['modern tech logo', 'brand styleguide', 'social branding'],
  },
  {
    id: 'gourmet-restaurant-menus',
    title: 'Gourmet Restaurant Menus',
    category: 'Print Design',
    imageUrls: [
      'https://placehold.co/600x400.png?text=Menu+Design+Cover',
      'https://placehold.co/600x400.png?text=Menu+Interior+Spread',
    ],
    imageHints: ['elegant menu', 'restaurant branding'],
  },
  {
    id: 'fantasy-game-art',
    title: 'Fantasy Game Assets',
    category: 'Illustration & Icons',
    imageUrls: [
      'https://placehold.co/600x400.png?text=Game+Character+Art',
      'https://placehold.co/600x400.png?text=Game+Environment',
      'https://placehold.co/600x400.png?text=Prop+Icons',
    ],
    imageHints: ['digital painting game', 'icon design game', 'concept art creature'],
  },
  {
    id: 'corporate-explainer-video',
    title: 'Corporate Explainer Stills',
    category: 'Animation & Motion',
    imageUrls: [
      'https://placehold.co/600x400.png?text=Explainer+Scene+A',
      'https://placehold.co/600x400.png?text=Explainer+Scene+B',
    ],
    imageHints: ['motion design still', 'animated characters'],
  },
];

const PortfolioShowcaseCard: React.FC<PortfolioItem> = ({ id, title, category, imageUrls, imageHints }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (imageUrls.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imageUrls.length);
    }, 3500); // Change image every 3.5 seconds

    return () => clearInterval(timer);
  }, [imageUrls.length]);

  if (!imageUrls || imageUrls.length === 0) {
    return (
      <Card className="overflow-hidden shadow-lg h-full flex flex-col group">
        <div className="block relative aspect-[4/3] w-full bg-muted flex items-center justify-center">
           <PackageSearch className="w-16 h-16 text-muted-foreground opacity-50" />
        </div>
        <CardContent className="p-4 bg-card flex-grow">
          <h3 className="font-headline text-lg font-semibold group-hover:text-primary transition-colors">{title}</h3>
          <p className="text-sm text-muted-foreground">{category}</p>
           <p className="text-xs text-destructive mt-1">Image(s) missing</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden shadow-lg h-full flex flex-col group">
      <Link href={`/portfolio/${id}`} passHref legacyBehavior>
        <a className="block relative aspect-[4/3] w-full">
          <Image
            key={imageUrls[currentImageIndex]} // Add key to force re-render on src change for transitions
            src={imageUrls[currentImageIndex]}
            alt={`${title} - image ${currentImageIndex + 1}`}
            fill
            style={{ objectFit: 'cover' }}
            className="transition-opacity duration-500 ease-in-out group-hover:scale-105"
            data-ai-hint={imageHints[currentImageIndex % imageHints.length]} // Cycle hints if not enough
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={currentImageIndex === 0} // Prioritize first image
          />
        </a>
      </Link>
      <CardContent className="p-4 bg-card flex-grow">
        <Link href={`/portfolio/${id}`} passHref legacyBehavior>
          <a className="block">
            <h3 className="font-headline text-lg font-semibold group-hover:text-primary transition-colors">{title}</h3>
          </a>
        </Link>
        <p className="text-sm text-muted-foreground">{category}</p>
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
        <section className="py-16 md:py-24 bg-secondary">
          <div className="container mx-auto px-5">
            <h2 className="text-3xl md:text-4xl font-bold font-headline text-center mb-12">Getting Your Design is Easy</h2>
            <div className="grid md:grid-cols-3 gap-10">
              <div className="flex flex-col items-center text-center p-6 rounded-lg bg-card shadow-md">
                <div className="bg-primary text-primary-foreground rounded-full h-12 w-12 flex items-center justify-center text-2xl font-bold mb-4">1</div>
                <h3 className="font-headline text-xl font-semibold mb-2">Browse & Select</h3>
                <p className="text-muted-foreground text-sm">Explore our wide array of fixed-scope design services. Find the perfect package with clearly defined deliverables and transparent, upfront pricing. No hidden fees, just straightforward value.</p>
              </div>
              <div className="flex flex-col items-center text-center p-6 rounded-lg bg-card shadow-md">
                <div className="bg-primary text-primary-foreground rounded-full h-12 w-12 flex items-center justify-center text-2xl font-bold mb-4">2</div>
                <h3 className="font-headline text-xl font-semibold mb-2">Submit Your Brief</h3>
                <p className="text-muted-foreground text-sm">Clearly articulate your vision using our intuitive brief submission process. We guide you to provide all necessary details, ensuring designers understand your needs for a successful project launch.</p>
              </div>
              <div className="flex flex-col items-center text-center p-6 rounded-lg bg-card shadow-md">
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
        <section className="py-16 md:py-24">
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
        <section className="py-16 md:py-24 bg-gradient-to-br from-secondary/50 to-background">
          <div className="container mx-auto px-5">
            <h2 className="text-3xl md:text-4xl font-bold font-headline text-center mb-12">Explore Our Portfolio Highlights</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {portfolioItemsData.map(item => (
                <PortfolioShowcaseCard key={item.id} {...item} />
              ))}
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


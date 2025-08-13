
"use client"; 

import { Navbar } from '@/components/layout/navbar';
import { CategoriesNavbar } from '@/components/layout/categories-navbar';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { ServiceCard } from '@/components/shared/service-card';
import { CheckCircle, Users, Briefcase, UserPlus, Award, Tag, Zap, ShieldCheck, Lightbulb, PackageSearch, MessageSquare, ExternalLink, Camera, Film, Presentation, Search, FileText, ThumbsUp, Star, Palette, IndianRupee } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import React, { useState, useEffect } from 'react'; 
import type { PortfolioItem } from '@/components/shared/portfolio-item-card'; 
import { cn } from '@/lib/utils';
import { allPortfolioItemsData as globalPortfolioItems } from '@/app/portfolio/page'; 
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const featuredServices = [
  { id: '1', name: 'Modern Logo Design', description: 'Unique logos for brands, startups, and businesses. Get a memorable identity that resonates with your target audience.', tiers: [{name: 'Standard', price: 9999}], category: 'Logo Design', imageUrl: 'https://placehold.co/600x400.png', imageHint: 'startup logo' },
  { id: '2', name: 'Social Media Pack', description: 'Engaging posts for festivals and social media campaigns. Boost your online presence effectively.', tiers: [{name: 'Standard', price: 4999}], category: 'Social Media', imageUrl: 'https://placehold.co/600x400.png', imageHint: 'social media graphics' },
  { id: '3', name: 'Professional Brochure Design', description: 'Professional brochures for businesses, perfect for marketing and events. Make a lasting impression.', tiers: [{name: 'Standard', price: 7999}], category: 'Print Design', imageUrl: 'https://placehold.co/600x400.png', imageHint: 'business brochure' },
  { id: '4', name: 'UI/UX Web Design Mockup', description: 'User-friendly web mockups, focusing on great user experience and modern aesthetics.', tiers: [{name: 'Standard', price: 15999}], category: 'UI/UX Design', imageUrl: 'https://placehold.co/600x400.png', imageHint: 'website design' },
  { id: '5', name: 'Custom Illustration', description: 'Illustrations with traditional or modern styles, bringing your unique ideas to life beautifully.', tiers: [{name: 'Standard', price: 7999}], category: 'Illustration', imageUrl: 'https://placehold.co/600x400.png', imageHint: 'digital art' },
  { id: '6', name: 'Packaging Design Concept', description: 'Creative packaging concepts for products, designed to stand out on the shelves.', tiers: [{name: 'Standard', price: 12999}], category: 'Packaging', imageUrl: 'https://placehold.co/600x400.png', imageHint: 'product packaging' },
];

const clientBenefits = [
  { icon: Award, title: 'Expert Designers', description: 'Connect with vetted, top-tier designers. Our curated network ensures your project is handled by skilled professionals who understand your needs.' },
  { icon: Tag, title: 'Transparent Pricing', description: 'Say goodbye to budget surprises. Our fixed-price service packages mean you know the cost upfront, ensuring clarity and control.' },
  { icon: Zap, title: 'Streamlined Process', description: 'From intuitive briefs to efficient delivery, our platform simplifies every step. Get your designs faster, with less hassle and more collaboration.' },
  { icon: ShieldCheck, title: 'Quality Guaranteed', description: 'Your satisfaction is our success. We stand behind the quality of our designers\' work, offering revisions and support to ensure exceptional results.' },
];

const portfolioItemsData: PortfolioItem[] = globalPortfolioItems.slice(0, 6);


const testimonials = [
  {
    name: 'Rohan Sharma',
    title: 'Founder, Edutech Startup',
    avatarUrl: 'https://placehold.co/100x100.png',
    avatarHint: 'indian man startup founder',
    rating: 5,
    review: 'DesignFlow made finding a top-tier designer in India incredibly easy. The quality of work for our branding was exceptional and the process was seamless. Highly recommended!',
  },
  {
    name: 'Priya Patel',
    title: 'Marketing Head, FMCG Brand',
    avatarUrl: 'https://placehold.co/100x100.png',
    avatarHint: 'indian woman marketing professional',
    rating: 5,
    review: 'The designer we worked with for our social media campaign was fantastic. They understood the cultural nuances perfectly. The platform is user-friendly and transparent.',
  },
  {
    name: 'Anil Kumar',
    title: 'Cafe Owner, Jaipur',
    avatarUrl: 'https://placehold.co/100x100.png',
    avatarHint: 'indian man small business owner',
    rating: 4,
    review: 'I needed a new menu and some flyers for my cafe. DesignFlow provided a very professional and affordable solution. The final print designs looked amazing!',
  },
];


interface PortfolioShowcaseCardProps {
  item: PortfolioItem;
}

export const PortfolioShowcaseCard: React.FC<PortfolioShowcaseCardProps> = ({ item }) => {
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
  const [userType, setUserType] = useState<'client' | 'designer'>('client');

  const clientJourney = [
    {
      icon: PackageSearch,
      title: "Fixed-Price Services",
      description: "Browse a catalog of services with clear scope and upfront pricing. No surprises, no hidden costs.",
    },
    {
      icon: FileText,
      title: "Simple, Guided Briefs",
      description: "Our guided process makes it easy to provide all the necessary details for your project to start smoothly.",
    },
    {
      icon: Users,
      title: "Direct Collaboration",
      description: "Communicate directly with your assigned designer to track progress and give feedback effectively.",
    },
  ];
  
  const designerJourney = [
    {
      icon: Briefcase,
      title: "Curated Projects",
      description: "Get matched with high-quality projects that fit your skills, without the hassle of constant bidding.",
    },
    {
      icon: IndianRupee,
      title: "Secure & Timely Payments",
      description: "Focus on your craft. We handle secure payments and ensure you're paid on time for your approved work.",
    },
    {
      icon: Palette,
      title: "Build Your Brand",
      description: "Showcase your best work in a professional portfolio and build a strong reputation on our platform.",
    },
  ];

  const journeySteps = userType === 'client' ? clientJourney : designerJourney;

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
              DesignFlow is your ultimate marketplace for expert design services. Experience high-quality creative work, hassle-free process, and upfront cost clarity, all in one place.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Button size="lg" asChild className="w-full sm:w-auto">
                <Link href="/design-services">
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
        
        {/* How It Works (Client & Designer Perspective) Section */}
        <section className="py-16 md:py-24 bg-card">
          <div className="container mx-auto px-5">
            <h2 className="text-3xl md:text-4xl font-bold font-headline text-center mb-4">A Platform Built For You</h2>
            <p className="text-lg text-muted-foreground text-center mb-10 max-w-2xl mx-auto">
              Whether you're looking for great design or offering your creative expertise, our process is designed for clarity and success.
            </p>
            <div className="flex justify-center items-center space-x-2 mb-12 p-1 bg-muted rounded-lg w-fit mx-auto">
                <Button 
                    variant={userType === 'client' ? 'default' : 'ghost'} 
                    onClick={() => setUserType('client')}
                    className="flex-1 justify-center px-6"
                >
                    For Clients
                </Button>
                <Button 
                    variant={userType === 'designer' ? 'default' : 'ghost'} 
                    onClick={() => setUserType('designer')}
                    className="flex-1 justify-center px-6"
                >
                    For Designers
                </Button>
            </div>

            <div className="grid md:grid-cols-3 gap-8 md:gap-10">
              {journeySteps.map((step, index) => (
                <Card 
                  key={step.title} 
                  className="text-center shadow-lg hover:shadow-xl transition-shadow flex flex-col bg-background/50 border-border"
                >
                  <CardHeader className="items-center pt-8">
                    <div className="bg-primary/10 p-5 rounded-full mb-5 inline-flex">
                      <step.icon className="h-10 w-10 text-primary" />
                    </div>
                    <CardTitle className="font-headline text-xl">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* The DesignFlow Advantage Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-5">
            <h2 className="text-3xl md:text-4xl font-bold font-headline text-center mb-4">The DesignFlow Advantage</h2>
            <p className="text-lg text-muted-foreground text-center mb-16 max-w-2xl mx-auto">
             Simple, Reliable, Quality – We make great design accessible.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {clientBenefits.map((benefit) => (
                <Card key={benefit.title} className="text-center shadow-lg hover:shadow-xl transition-shadow p-6">
                  <CardHeader className="items-center p-0 pb-4">
                    <div className="bg-primary/10 p-5 rounded-full mb-5 inline-flex">
                      <benefit.icon className="h-12 w-12 text-primary" />
                    </div>
                    <h3 className="font-headline text-xl font-semibold leading-none tracking-tight">{benefit.title}</h3>
                  </CardHeader>
                  <CardContent className="p-0">
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
            <h2 className="text-3xl md:text-4xl font-bold font-headline text-center mb-4">Popular Design Services</h2>
            <p className="text-lg text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
              Discover our most sought-after creative solutions, designed by top talent to meet your specific needs.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredServices.map(service => (
                <ServiceCard key={service.id} {...service} />
              ))}
            </div>
            <div className="text-center mt-16">
              <Button size="lg" asChild>
                <Link href="/design-services">
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

        {/* Testimonials Section */}
        <section className="py-16 md:py-24 bg-secondary/30">
          <div className="container mx-auto px-5">
            <h2 className="text-3xl md:text-4xl font-bold font-headline text-center mb-4">What Our Clients Say</h2>
            <p className="text-lg text-muted-foreground text-center mb-16 max-w-2xl mx-auto">
              Discover why businesses across India trust DesignFlow for their creative needs.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="shadow-lg flex flex-col">
                  <CardContent className="p-6 flex-grow">
                    <div className="flex items-center mb-4">
                      <Avatar className="h-12 w-12 mr-4">
                        <AvatarImage src={testimonial.avatarUrl} alt={testimonial.name} data-ai-hint={testimonial.avatarHint} />
                        <AvatarFallback>{testimonial.name.substring(0,1)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-foreground">{testimonial.name}</p>
                        <p className="text-xs text-muted-foreground">{testimonial.title}</p>
                      </div>
                    </div>
                    <blockquote className="text-muted-foreground border-l-2 border-primary pl-4 italic">
                      {testimonial.review}
                    </blockquote>
                  </CardContent>
                  <CardFooter className="p-6 pt-0">
                    <div className="flex items-center">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={cn("h-5 w-5", i < testimonial.rating ? 'text-yellow-400 fill-current' : 'text-muted-foreground/30')} />
                      ))}
                    </div>
                  </CardFooter>
                </Card>
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
              <Link href="/design-services">
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

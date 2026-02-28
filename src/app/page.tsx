
"use client"; 

import { Navbar } from '@/components/layout/navbar';
import { CategoriesNavbar } from '@/components/layout/categories-navbar';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { ServiceCard } from '@/components/shared/service-card';
import { CheckCircle, Users, Briefcase, UserPlus, Award, Tag, Zap, ShieldCheck, Lightbulb, PackageSearch, MessageSquare, ExternalLink, Camera, Film, Presentation, Search, FileText, ThumbsUp, Star, Palette, IndianRupee, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import React, { useState, useEffect, useMemo } from 'react'; 
import type { PortfolioItem } from '@/components/shared/portfolio-item-card'; 
import { cn } from '@/lib/utils';
import { PortfolioShowcaseCard } from '@/components/shared/portfolio-showcase-card';
import { getAllPortfolioItems } from '@/lib/portfolio-db';
import { getAllServices, type ServiceData } from '@/lib/services-db';
import { getFeaturedReviews, type DesignerReview } from '@/lib/reviews-db';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const clientBenefits = [
  { icon: Award, title: 'Expert Designers', description: 'Connect with vetted, top-tier designers. Our curated network ensures your project is handled by skilled professionals who understand your needs.' },
  { icon: Tag, title: 'Transparent Pricing', description: 'Say goodbye to budget surprises. Our fixed-price service packages mean you know the cost upfront, ensuring clarity and control.' },
  { icon: Zap, title: 'Streamlined Process', description: 'From intuitive briefs to efficient delivery, our platform simplifies every step. Get your designs faster, with less hassle and more collaboration.' },
  { icon: ShieldCheck, title: 'Quality Guaranteed', description: 'Your satisfaction is our success. We stand behind the quality of our designers\' work, offering revisions and support to ensure exceptional results.' },
];


export default function HomePage() {
  const [userType, setUserType] = useState<'client' | 'designer'>('client');
  const [featuredServices, setFeaturedServices] = useState<ServiceData[]>([]);
  const [portfolioItemsData, setPortfolioItemsData] = useState<PortfolioItem[]>([]);
  const [testimonials, setTestimonials] = useState<DesignerReview[]>([]);

  useEffect(() => {
    getAllServices().then(services => setFeaturedServices(services.slice(0, 6)));
    getAllPortfolioItems().then(items => setPortfolioItemsData(items.slice(0, 6)));
    getFeaturedReviews(3).then(setTestimonials);
  }, []);

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
            <div className="flex justify-center items-center space-x-2 mb-12 p-1 bg-muted rounded-full w-fit mx-auto shadow-inner">
                <Button 
                    onClick={() => setUserType('client')}
                    className={cn(
                        "rounded-full px-6 py-2.5 text-base transition-all duration-300",
                        userType === 'client' 
                            ? 'bg-background shadow text-primary font-semibold' 
                            : 'bg-transparent text-muted-foreground font-normal'
                    )}
                >
                    For Clients
                </Button>
                <Button 
                    onClick={() => setUserType('designer')}
                    className={cn(
                        "rounded-full px-6 py-2.5 text-base transition-all duration-300",
                        userType === 'designer' 
                            ? 'bg-background shadow text-primary font-semibold' 
                            : 'bg-transparent text-muted-foreground font-normal'
                    )}
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

            <div className="text-center mt-12">
              {userType === 'client' ? (
                <Button size="lg" asChild>
                  <Link href="/design-services">
                    Start Your Project Now <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              ) : (
                <Button size="lg" asChild variant="outline">
                  <Link href="/signup/designer">
                    Join as a Designer <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              )}
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
                <ServiceCard key={service.id} id={service.id} name={service.name} description={service.generalDescription || ''} category={service.category || ''} tiers={service.tiers.map(t => ({name: t.name as 'Basic' | 'Standard' | 'Premium', price: t.price}))} imageUrl={service.imageUrl || 'https://placehold.co/600x400.png'} imageHint={service.imageHint} />
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
                        <AvatarImage src={testimonial.clientAvatarUrl || 'https://placehold.co/100x100.png'} alt={testimonial.clientName} data-ai-hint={testimonial.clientAvatarHint || 'client'} />
                        <AvatarFallback>{testimonial.clientName.substring(0,1)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-foreground">{testimonial.clientName}</p>
                        <p className="text-xs text-muted-foreground">{testimonial.serviceName}</p>
                      </div>
                    </div>
                    <blockquote className="text-muted-foreground border-l-2 border-primary pl-4 italic">
                      {testimonial.reviewText}
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

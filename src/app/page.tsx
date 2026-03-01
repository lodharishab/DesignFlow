
"use client";

import { Navbar } from '@/components/layout/navbar';
import { CategoriesNavbar } from '@/components/layout/categories-navbar';
import { Footer } from '@/components/layout/footer';
import { Button, Card, CardBody, CardFooter, CardHeader, Chip, Avatar, Divider, Tabs, Tab } from '@heroui/react';
import { ServiceCard } from '@/components/shared/service-card';
import { CheckCircle, Users, Briefcase, UserPlus, Award, Tag, Zap, ShieldCheck, Lightbulb, PackageSearch, MessageSquare, ExternalLink, Camera, Film, Presentation, Search, FileText, ThumbsUp, Star, Palette, IndianRupee, ArrowRight, Sparkles, MousePointerClick } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import React, { useState, useEffect, useMemo } from 'react';
import type { PortfolioItem } from '@/components/shared/portfolio-item-card';
import { cn } from '@/lib/utils';
import { PortfolioShowcaseCard } from '@/components/shared/portfolio-showcase-card';
import { getAllPortfolioItems } from '@/lib/portfolio-db';
import { getAllServices, type ServiceData } from '@/lib/services-db';
import { getFeaturedReviews, type DesignerReview } from '@/lib/reviews-db';
import { motion, useScroll, useTransform } from 'framer-motion';
import { fadeInUp, fadeInLeft, fadeInRight, scaleIn, staggerContainer, staggerContainerFast } from '@/lib/animations';
import { MotionWrapper, StaggerContainer, AnimatedCounter } from '@/components/shared/motion-wrapper';

const clientBenefits = [
  { icon: Award, title: 'Expert Designers', description: 'Connect with vetted, top-tier designers. Our curated network ensures your project is handled by skilled professionals.' },
  { icon: Tag, title: 'Transparent Pricing', description: 'Say goodbye to budget surprises. Fixed-price packages mean you know the cost upfront with full clarity.' },
  { icon: Zap, title: 'Streamlined Process', description: 'From intuitive briefs to efficient delivery, our platform simplifies every step of the design journey.' },
  { icon: ShieldCheck, title: 'Quality Guaranteed', description: 'We stand behind quality. Revisions and support ensure exceptional results every time.' },
];

const stats = [
  { value: 500, suffix: '+', label: 'Projects Delivered' },
  { value: 50, suffix: '+', label: 'Expert Designers' },
  { value: 98, suffix: '%', label: 'Client Satisfaction' },
  { value: 24, suffix: 'hr', label: 'Avg Response Time' },
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
    { icon: PackageSearch, title: "Fixed-Price Services", description: "Browse a catalog of services with clear scope and upfront pricing. No surprises, no hidden costs." },
    { icon: FileText, title: "Simple, Guided Briefs", description: "Our guided process makes it easy to provide all the necessary details for your project." },
    { icon: Users, title: "Direct Collaboration", description: "Communicate directly with your assigned designer to track progress and give feedback." },
  ];

  const designerJourney = [
    { icon: Briefcase, title: "Curated Projects", description: "Get matched with high-quality projects that fit your skills, without constant bidding." },
    { icon: IndianRupee, title: "Secure & Timely Payments", description: "Focus on your craft. We handle secure payments and ensure you're paid on time." },
    { icon: Palette, title: "Build Your Brand", description: "Showcase your best work in a professional portfolio and build a strong reputation." },
  ];

  const journeySteps = userType === 'client' ? clientJourney : designerJourney;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <CategoriesNavbar />
      <main className="flex-grow">

        {/* ===== HERO SECTION ===== */}
        <section className="relative overflow-hidden py-24 md:py-36">
          {/* Background effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
          <div className="absolute inset-0 bg-grid opacity-30" />
          <motion.div
            className="absolute top-20 -left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl"
            animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-10 -right-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"
            animate={{ x: [0, -30, 0], y: [0, 20, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />

          <div className="container mx-auto px-5 relative z-10">
            <div className="text-center max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Chip
                  color="primary"
                  variant="flat"
                  size="sm"
                  startContent={<Sparkles className="h-3 w-3" />}
                  className="mb-6"
                >
                  India&apos;s Premium Design Marketplace
                </Chip>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl sm:text-5xl md:text-7xl font-bold font-headline mb-6 leading-tight"
              >
                Transform Your Ideas into{' '}
                <span className="bg-gradient-to-r from-primary via-violet-500 to-secondary bg-clip-text text-transparent">
                  Stunning Designs
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-lg md:text-xl text-default-500 mb-10 max-w-2xl mx-auto leading-relaxed"
              >
                Expert design services with fixed pricing, hassle-free process, and guaranteed quality — all in one place.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col sm:flex-row justify-center items-center gap-4"
              >
                <Button
                  as={Link}
                  href="/design-services"
                  color="primary"
                  variant="shadow"
                  size="lg"
                  radius="full"
                  startContent={<PackageSearch className="h-5 w-5" />}
                  className="font-semibold px-8 shadow-lg shadow-primary/25"
                >
                  Browse Services
                </Button>
                <Button
                  as={Link}
                  href="/signup"
                  variant="bordered"
                  size="lg"
                  radius="full"
                  startContent={<UserPlus className="h-5 w-5" />}
                  className="font-semibold px-8"
                >
                  Create Account
                </Button>
              </motion.div>

              {/* Floating scroll indicator */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-16 flex justify-center"
              >
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="text-default-400"
                >
                  <MousePointerClick className="h-5 w-5" />
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ===== STATS SECTION ===== */}
        <section className="py-12 border-y border-divider/50 bg-content1/50 backdrop-blur-sm">
          <div className="container mx-auto px-5">
            <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat) => (
                <motion.div key={stat.label} variants={fadeInUp} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold font-headline bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    <AnimatedCounter target={stat.value} />{stat.suffix}
                  </div>
                  <p className="text-sm text-default-500 mt-1">{stat.label}</p>
                </motion.div>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* ===== HOW IT WORKS ===== */}
        <section className="py-20 md:py-28 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-content1/30 to-background" />
          <div className="container mx-auto px-5 relative z-10">
            <MotionWrapper className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold font-headline mb-4">A Platform Built For You</h2>
              <p className="text-lg text-default-500 max-w-2xl mx-auto">
                Whether you need design or offer creative expertise, our process is built for clarity and success.
              </p>
            </MotionWrapper>

            <MotionWrapper className="flex justify-center mb-12">
              <Tabs
                selectedKey={userType}
                onSelectionChange={(key) => setUserType(key as 'client' | 'designer')}
                variant="bordered"
                color="primary"
                radius="full"
                size="lg"
                classNames={{
                  tabList: "bg-content2/50 backdrop-blur-sm",
                  cursor: "bg-primary shadow-md",
                  tab: "px-6",
                }}
              >
                <Tab key="client" title="For Clients" />
                <Tab key="designer" title="For Designers" />
              </Tabs>
            </MotionWrapper>

            <StaggerContainer className="grid md:grid-cols-3 gap-8 md:gap-10">
              {journeySteps.map((step, index) => (
                <motion.div key={step.title} variants={fadeInUp}>
                  <Card
                    className="text-center h-full bg-content1/50 backdrop-blur-sm border border-divider/50 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
                    isPressable
                  >
                    <CardHeader className="flex-col items-center pt-8 gap-4">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className="bg-gradient-to-br from-primary/10 to-secondary/10 p-5 rounded-2xl"
                      >
                        <step.icon className="h-10 w-10 text-primary" />
                      </motion.div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-primary bg-primary/10 rounded-full h-6 w-6 flex items-center justify-center">
                          {index + 1}
                        </span>
                        <h3 className="font-headline text-xl font-semibold">{step.title}</h3>
                      </div>
                    </CardHeader>
                    <CardBody className="px-6 pb-8">
                      <p className="text-default-500 text-sm leading-relaxed">{step.description}</p>
                    </CardBody>
                  </Card>
                </motion.div>
              ))}
            </StaggerContainer>

            <MotionWrapper className="text-center mt-12" delay={0.3}>
              {userType === 'client' ? (
                <Button
                  as={Link}
                  href="/design-services"
                  color="primary"
                  variant="shadow"
                  size="lg"
                  radius="full"
                  endContent={<ArrowRight className="h-4 w-4" />}
                  className="font-semibold shadow-lg shadow-primary/25"
                >
                  Start Your Project Now
                </Button>
              ) : (
                <Button
                  as={Link}
                  href="/signup/designer"
                  variant="bordered"
                  size="lg"
                  radius="full"
                  endContent={<ArrowRight className="h-4 w-4" />}
                  className="font-semibold"
                >
                  Join as a Designer
                </Button>
              )}
            </MotionWrapper>
          </div>
        </section>

        {/* ===== ADVANTAGE ===== */}
        <section className="py-20 md:py-28 relative overflow-hidden">
          <div className="absolute inset-0 section-gradient" />
          <div className="container mx-auto px-5 relative z-10">
            <MotionWrapper className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold font-headline mb-4">The DesignFlow Advantage</h2>
              <p className="text-lg text-default-500 max-w-2xl mx-auto">
                Simple, Reliable, Quality — We make great design accessible.
              </p>
            </MotionWrapper>

            <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {clientBenefits.map((benefit) => (
                <motion.div key={benefit.title} variants={fadeInUp}>
                  <Card
                    className="text-center h-full bg-content1/60 backdrop-blur-sm border border-divider/50 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 group"
                    isPressable
                  >
                    <CardHeader className="flex-col items-center pt-8 gap-4">
                      <motion.div
                        whileHover={{ scale: 1.1, y: -4 }}
                        className="bg-gradient-to-br from-primary/10 to-secondary/10 p-5 rounded-2xl group-hover:from-primary/20 group-hover:to-secondary/20 transition-colors"
                      >
                        <benefit.icon className="h-10 w-10 text-primary" />
                      </motion.div>
                      <h3 className="font-headline text-lg font-semibold">{benefit.title}</h3>
                    </CardHeader>
                    <CardBody className="px-6 pb-8">
                      <p className="text-default-500 text-sm leading-relaxed">{benefit.description}</p>
                    </CardBody>
                  </Card>
                </motion.div>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* ===== FEATURED SERVICES ===== */}
        <section className="py-20 md:py-28 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/[0.02] to-background" />
          <div className="container mx-auto px-5 relative z-10">
            <MotionWrapper className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold font-headline mb-4">Popular Design Services</h2>
              <p className="text-lg text-default-500 max-w-2xl mx-auto">
                Discover our most sought-after creative solutions, designed by top talent.
              </p>
            </MotionWrapper>

            <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredServices.map(service => (
                <motion.div key={service.id} variants={fadeInUp}>
                  <ServiceCard
                    id={service.id}
                    name={service.name}
                    description={service.generalDescription || ''}
                    category={service.category || ''}
                    tiers={service.tiers.map(t => ({ name: t.name as 'Basic' | 'Standard' | 'Premium', price: t.price }))}
                    imageUrl={service.imageUrl || 'https://placehold.co/600x400.png'}
                    imageHint={service.imageHint}
                  />
                </motion.div>
              ))}
            </StaggerContainer>

            <MotionWrapper className="text-center mt-16" delay={0.2}>
              <Button
                as={Link}
                href="/design-services"
                color="primary"
                variant="flat"
                size="lg"
                radius="full"
                startContent={<Briefcase className="h-5 w-5" />}
                className="font-semibold"
              >
                Explore All Services
              </Button>
            </MotionWrapper>
          </div>
        </section>

        {/* ===== PORTFOLIO SHOWCASE ===== */}
        <section className="py-20 md:py-28 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-content1/30 to-background" />
          <div className="container mx-auto px-5 relative z-10">
            <MotionWrapper className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold font-headline mb-4">Explore Our Portfolio</h2>
              <p className="text-lg text-default-500 max-w-2xl mx-auto">
                Get inspired by the quality and creativity our designers bring to every project.
              </p>
            </MotionWrapper>

            <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {portfolioItemsData.map(item => (
                <motion.div key={item.id} variants={fadeInUp}>
                  <PortfolioShowcaseCard item={item} />
                </motion.div>
              ))}
            </StaggerContainer>

            <MotionWrapper className="text-center mt-16" delay={0.2}>
              <Button
                as={Link}
                href="/portfolio"
                variant="bordered"
                size="lg"
                radius="full"
                className="font-semibold"
              >
                View Full Portfolio
              </Button>
            </MotionWrapper>
          </div>
        </section>

        {/* ===== TESTIMONIALS ===== */}
        <section className="py-20 md:py-28 relative overflow-hidden">
          <div className="absolute inset-0 section-gradient" />
          <div className="container mx-auto px-5 relative z-10">
            <MotionWrapper className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold font-headline mb-4">What Our Clients Say</h2>
              <p className="text-lg text-default-500 max-w-2xl mx-auto">
                Discover why businesses across India trust DesignFlow for their creative needs.
              </p>
            </MotionWrapper>

            <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div key={index} variants={fadeInUp}>
                  <Card className="h-full bg-content1/60 backdrop-blur-sm border border-divider/50">
                    <CardBody className="p-6">
                      <div className="flex items-center mb-4 gap-3">
                        <Avatar
                          src={testimonial.clientAvatarUrl || 'https://placehold.co/100x100.png'}
                          name={testimonial.clientName}
                          size="md"
                          isBordered
                          color="primary"
                        />
                        <div>
                          <p className="font-semibold text-foreground">{testimonial.clientName}</p>
                          <p className="text-xs text-default-400">{testimonial.serviceName}</p>
                        </div>
                      </div>
                      <blockquote className="text-default-500 text-sm leading-relaxed border-l-2 border-primary/50 pl-4 italic">
                        &ldquo;{testimonial.reviewText}&rdquo;
                      </blockquote>
                    </CardBody>
                    <CardFooter className="px-6 pb-6 pt-0">
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={cn("h-4 w-4", i < testimonial.rating ? 'text-warning fill-current' : 'text-default-200')} />
                        ))}
                      </div>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* ===== FINAL CTA ===== */}
        <section className="py-24 md:py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-violet-600 to-secondary" />
          <div className="absolute inset-0 bg-grid opacity-10" />
          <motion.div
            className="absolute top-10 left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"
            animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
            transition={{ duration: 6, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-10 right-10 w-60 h-60 bg-white/5 rounded-full blur-3xl"
            animate={{ x: [0, -40, 0], y: [0, 30, 0] }}
            transition={{ duration: 8, repeat: Infinity }}
          />

          <div className="container mx-auto px-5 text-center relative z-10">
            <MotionWrapper>
              <h2 className="text-3xl md:text-5xl font-bold font-headline mb-6 text-white">
                Ready to Elevate Your Brand?
              </h2>
            </MotionWrapper>
            <MotionWrapper delay={0.1}>
              <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto">
                Let our expert designers create something amazing for you. Start your project today!
              </p>
            </MotionWrapper>
            <MotionWrapper delay={0.2}>
              <Button
                as={Link}
                href="/design-services"
                size="lg"
                radius="full"
                className="bg-white text-primary font-bold px-10 shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
                startContent={<Lightbulb className="h-5 w-5" />}
              >
                Get Started Now
              </Button>
            </MotionWrapper>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}

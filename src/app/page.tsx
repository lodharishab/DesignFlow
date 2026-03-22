
"use client";

import { Navbar } from '@/components/layout/navbar';
import { CategoriesNavbar } from '@/components/layout/categories-navbar';
import { Footer } from '@/components/layout/footer';
import { Button, Card, CardBody, CardFooter, CardHeader, Chip, Avatar, Divider, Tabs, Tab } from '@heroui/react';
import { ServiceCard } from '@/components/shared/service-card';
import { CheckCircle, Users, Briefcase, UserPlus, Award, Tag, Zap, ShieldCheck, Lightbulb, PackageSearch, MessageSquare, ExternalLink, Camera, Film, Presentation, Search, FileText, ThumbsUp, Star, Palette, IndianRupee, ArrowRight, Sparkles, MousePointerClick, ChevronRight, Quote, Play } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import React, { useState, useEffect, useMemo } from 'react';
import type { PortfolioItem } from '@/components/shared/portfolio-item-card';
import { cn } from '@/lib/utils';
import { PortfolioShowcaseCard } from '@/components/shared/portfolio-showcase-card';
import { getAllPortfolioItems } from '@/lib/portfolio-db';
import { getAllServices, type ServiceData } from '@/lib/services-db';
import { getFeaturedReviews, type DesignerReview } from '@/lib/reviews-db';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { fadeInUp, fadeInLeft, fadeInRight, scaleIn, staggerContainer, staggerContainerFast } from '@/lib/animations';
import { MotionWrapper, StaggerContainer, AnimatedCounter } from '@/components/shared/motion-wrapper';

const clientBenefits = [
  { icon: Award, title: 'Expert Designers', description: 'Vetted, top-tier designers from our curated network handle your project with skill and care.', stat: '50+', statLabel: 'Designers' },
  { icon: Tag, title: 'Transparent Pricing', description: 'Fixed-price packages with full cost clarity upfront. No surprises, ever.', stat: '100%', statLabel: 'Transparent' },
  { icon: Zap, title: 'Fast Turnaround', description: 'Intuitive briefs to efficient delivery — every step of the design journey is streamlined.', stat: '24hr', statLabel: 'Avg Response' },
  { icon: ShieldCheck, title: 'Quality Guaranteed', description: 'Revisions included, quality assured. We stand behind every project delivered.', stat: '98%', statLabel: 'Satisfaction' },
];

const stats = [
  { value: 500, suffix: '+', label: 'Projects Delivered' },
  { value: 50, suffix: '+', label: 'Expert Designers' },
  { value: 98, suffix: '%', label: 'Client Satisfaction' },
  { value: 24, suffix: 'hr', label: 'Avg Response Time' },
];

const marqueeCategories = [
  'Logo Design', 'UI/UX Design', 'Brand Identity', 'Packaging', 'Social Media', 'Illustration', 'Print Design', 'Motion Graphics',
  'Logo Design', 'UI/UX Design', 'Brand Identity', 'Packaging', 'Social Media', 'Illustration', 'Print Design', 'Motion Graphics',
];

export default function HomePage() {
  const [userType, setUserType] = useState<'client' | 'designer'>('client');
  const [featuredServices, setFeaturedServices] = useState<ServiceData[]>([]);
  const [portfolioItemsData, setPortfolioItemsData] = useState<PortfolioItem[]>([]);
  const [testimonials, setTestimonials] = useState<DesignerReview[]>([]);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    getAllServices().then(services => setFeaturedServices(services.slice(0, 6)));
    getAllPortfolioItems().then(items => setPortfolioItemsData(items.slice(0, 8)));
    getFeaturedReviews(3).then(setTestimonials);
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    if (testimonials.length <= 1) return;
    const timer = setInterval(() => {
      setActiveTestimonial(prev => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const clientJourney = [
    { icon: PackageSearch, title: "Browse & Choose", description: "Explore fixed-price services with clear scope. No surprises, no hidden costs.", color: "from-blue-500/20 to-indigo-500/20" },
    { icon: FileText, title: "Submit Your Brief", description: "Our guided process makes it effortless to provide all the details your project needs.", color: "from-violet-500/20 to-purple-500/20" },
    { icon: Users, title: "Collaborate & Receive", description: "Work directly with your designer, track progress, and receive polished deliverables.", color: "from-fuchsia-500/20 to-pink-500/20" },
  ];

  const designerJourney = [
    { icon: Briefcase, title: "Get Matched", description: "High-quality projects delivered to you based on your skills — no constant bidding.", color: "from-blue-500/20 to-indigo-500/20" },
    { icon: IndianRupee, title: "Work & Get Paid", description: "Focus on your craft. Secure payments handled, timely payouts guaranteed.", color: "from-violet-500/20 to-purple-500/20" },
    { icon: Palette, title: "Grow Your Brand", description: "Build a professional portfolio and earn a stellar reputation on the platform.", color: "from-fuchsia-500/20 to-pink-500/20" },
  ];

  const journeySteps = userType === 'client' ? clientJourney : designerJourney;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <CategoriesNavbar />
      <main className="flex-grow">
        <div id="main-content" />

        {/* ===== HERO SECTION — Split layout with asymmetric grid ===== */}
        <section className="relative overflow-hidden min-h-[90vh] flex items-center">
          {/* Complex layered background */}
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
          <div className="absolute inset-0 bg-grid opacity-20" />
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/[0.03] to-transparent" />
          <motion.div
            className="absolute top-20 right-[10%] w-[500px] h-[500px] bg-primary/8 rounded-full blur-[100px] will-change-transform"
            animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-0 left-[5%] w-[300px] h-[300px] bg-secondary/8 rounded-full blur-[80px] will-change-transform"
            animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />

          <div className="container mx-auto px-5 relative z-10 py-16">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              {/* Left column — Content */}
              <div className="order-2 lg:order-1">
                <motion.div
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7 }}
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
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7, delay: 0.1 }}
                  className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold font-headline mb-6 leading-[1.1]"
                >
                  Design That
                  <br />
                  <span className="bg-gradient-to-r from-primary via-violet-500 to-secondary bg-clip-text text-transparent">
                    Speaks Volumes
                  </span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                  className="text-lg text-default-500 mb-8 max-w-lg leading-relaxed"
                >
                  Connect with expert Indian designers for logos, branding, UI/UX, and more — with fixed pricing and guaranteed quality.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7, delay: 0.3 }}
                  className="flex flex-col sm:flex-row items-start gap-4"
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
                    href="/how-it-works"
                    variant="light"
                    size="lg"
                    radius="full"
                    startContent={<Play className="h-4 w-4 fill-current" />}
                    className="font-semibold text-default-600 hover:text-primary"
                  >
                    See How It Works
                  </Button>
                </motion.div>

                {/* Inline stats strip — gives social proof right in the hero */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.5 }}
                  className="mt-12 flex items-center gap-8 flex-wrap"
                >
                  {stats.map(stat => (
                    <div key={stat.label} className="flex items-center gap-2">
                      <span className="text-2xl font-bold font-headline text-foreground">
                        <AnimatedCounter target={stat.value} />{stat.suffix}
                      </span>
                      <span className="text-xs text-default-400 leading-tight max-w-[60px]">{stat.label}</span>
                    </div>
                  ))}
                </motion.div>
              </div>

              {/* Right column — Visual showcase (bento-style grid of images) */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="order-1 lg:order-2"
              >
                <div className="relative">
                  {/* Bento grid layout */}
                  <div className="grid grid-cols-12 grid-rows-6 gap-3 h-[420px] lg:h-[520px]">
                    {/* Large featured image */}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="col-span-7 row-span-4 rounded-2xl overflow-hidden relative group"
                    >
                      <Image
                        src="https://placehold.co/800x600.png"
                        alt="Featured design work showing premium logo mockup"
                        fill
                        priority
                        sizes="(max-width: 1024px) 58vw, 35vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        data-ai-hint="logo design mockup premium"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      <div className="absolute bottom-3 left-3">
                        <Chip size="sm" color="primary" variant="solid" className="text-[10px]">Logo Design</Chip>
                      </div>
                    </motion.div>

                    {/* Top-right tall image */}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="col-span-5 row-span-3 rounded-2xl overflow-hidden relative group"
                    >
                      <Image
                        src="https://placehold.co/500x600.png"
                        alt="Brand identity design with vibrant color palette"
                        fill
                        priority
                        sizes="(max-width: 1024px) 42vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        data-ai-hint="brand identity colorful"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      <div className="absolute bottom-3 left-3">
                        <Chip size="sm" color="secondary" variant="solid" className="text-[10px]">Branding</Chip>
                      </div>
                    </motion.div>

                    {/* Bottom-left wide image */}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="col-span-5 row-span-2 rounded-2xl overflow-hidden relative group"
                    >
                      <Image
                        src="https://placehold.co/600x300.png"
                        alt="Modern UI/UX dashboard design"
                        fill
                        sizes="(max-width: 1024px) 42vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        data-ai-hint="ui design dashboard"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      <div className="absolute bottom-3 left-3">
                        <Chip size="sm" color="success" variant="solid" className="text-[10px]">UI/UX</Chip>
                      </div>
                    </motion.div>

                    {/* Bottom-right images */}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="col-span-4 row-span-3 rounded-2xl overflow-hidden relative group"
                    >
                      <Image
                        src="https://placehold.co/400x500.png"
                        alt="Creative packaging and product design"
                        fill
                        sizes="(max-width: 1024px) 33vw, 20vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        data-ai-hint="packaging product design"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      <div className="absolute bottom-3 left-3">
                        <Chip size="sm" color="warning" variant="solid" className="text-[10px]">Packaging</Chip>
                      </div>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="col-span-3 row-span-2 rounded-2xl overflow-hidden relative bg-gradient-to-br from-primary to-secondary flex items-center justify-center"
                    >
                      <div className="text-center text-white p-3">
                        <p className="text-2xl font-bold font-headline">50+</p>
                        <p className="text-[10px] opacity-80">Expert Designers</p>
                      </div>
                    </motion.div>
                  </div>

                  {/* Floating badge */}
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -bottom-4 -left-4 bg-content1 border border-divider shadow-xl rounded-2xl p-3 flex items-center gap-3 z-10"
                  >
                    <div className="bg-success/10 rounded-xl p-2">
                      <CheckCircle className="h-5 w-5 text-success" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Project Delivered</p>
                      <p className="text-[10px] text-default-400">Just now — Logo Design</p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ===== MARQUEE CATEGORIES — Full-width scrolling ticker ===== */}
        <section className="py-5 border-y border-divider/30 bg-content1/30 overflow-hidden">
          <div className="relative">
            <motion.div
              className="flex gap-6 whitespace-nowrap"
              animate={{ x: ['0%', '-50%'] }}
              transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            >
              {marqueeCategories.map((cat, i) => (
                <span key={i} className="text-sm font-medium text-default-400 flex items-center gap-2 shrink-0">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary/50" />
                  {cat}
                </span>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ===== HOW IT WORKS — Timeline / Stepped layout ===== */}
        <section className="py-24 md:py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-content1/20 to-background" />
          <div className="container mx-auto px-5 relative z-10">
            <div className="grid lg:grid-cols-5 gap-12 items-start">
              {/* Left — Sticky heading */}
              <div className="lg:col-span-2 lg:sticky lg:top-32">
                <MotionWrapper>
                  <Chip size="sm" variant="flat" color="primary" className="mb-4">How It Works</Chip>
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-headline mb-5 leading-tight">
                    A Platform Built{' '}
                    <span className="text-primary">For You</span>
                  </h2>
                  <p className="text-default-500 leading-relaxed mb-8">
                    Whether you need design or offer creative expertise, our streamlined process is built for clarity and success.
                  </p>

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
              </div>

              {/* Right — Steps as vertical timeline */}
              <div className="lg:col-span-3">
                <div className="relative">
                  {/* Vertical line */}
                  <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-primary/50 via-secondary/50 to-transparent hidden md:block" />

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={userType}
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -30 }}
                      transition={{ duration: 0.4 }}
                      className="space-y-8"
                    >
                      {journeySteps.map((step, index) => (
                        <motion.div
                          key={step.title}
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.15 }}
                          className="flex gap-6 group"
                        >
                          {/* Step number node */}
                          <div className="relative shrink-0 hidden md:flex flex-col items-center">
                            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                              {index + 1}
                            </div>
                          </div>

                          {/* Step card */}
                          <Card className={cn(
                            "flex-1 bg-content1/60 backdrop-blur-sm border border-divider/50 hover:border-primary/30 transition-all duration-300",
                            "hover:shadow-lg hover:shadow-primary/5 group-hover:-translate-y-1"
                          )}>
                            <CardBody className="p-6 flex flex-col sm:flex-row gap-5 items-start">
                              <div className={cn("shrink-0 p-4 rounded-2xl bg-gradient-to-br", step.color)}>
                                <step.icon className="h-7 w-7 text-primary" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="text-xs font-bold text-primary md:hidden">Step {index + 1}</span>
                                </div>
                                <h3 className="font-headline text-xl font-semibold mb-2">{step.title}</h3>
                                <p className="text-default-500 text-sm leading-relaxed">{step.description}</p>
                              </div>
                            </CardBody>
                          </Card>
                        </motion.div>
                      ))}
                    </motion.div>
                  </AnimatePresence>

                  {/* CTA under timeline */}
                  <MotionWrapper className="mt-10 ml-0 md:ml-[72px]" delay={0.4}>
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
                        Start Your Project
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
              </div>
            </div>
          </div>
        </section>

        {/* ===== ADVANTAGE — Horizontal scrolling cards with left-aligned heading ===== */}
        <section className="py-24 md:py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] via-background to-secondary/[0.02]" />
          <div className="container mx-auto px-5 relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-6">
              <MotionWrapper>
                <Chip size="sm" variant="flat" color="secondary" className="mb-4">Why DesignFlow</Chip>
                <h2 className="text-3xl md:text-4xl font-bold font-headline mb-3">
                  The DesignFlow{' '}
                  <span className="text-secondary">Advantage</span>
                </h2>
                <p className="text-default-500 max-w-md">
                  Simple, reliable, quality — we make great design accessible to every business in India.
                </p>
              </MotionWrapper>
              <MotionWrapper delay={0.2} className="shrink-0">
                <Button
                  as={Link}
                  href="/about"
                  variant="flat"
                  radius="full"
                  endContent={<ChevronRight className="h-4 w-4" />}
                  className="font-medium"
                >
                  Learn More
                </Button>
              </MotionWrapper>
            </div>

            <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {clientBenefits.map((benefit, index) => (
                <motion.div key={benefit.title} variants={fadeInUp}>
                  <Card
                    className={cn(
                      "h-full border border-divider/50 hover:border-primary/30 transition-all duration-300 group overflow-hidden",
                      "bg-content1/60 backdrop-blur-sm hover:shadow-xl hover:shadow-primary/5"
                    )}
                    isPressable
                  >
                    <CardBody className="p-6 flex flex-col h-full">
                      {/* Icon + stat in a row */}
                      <div className="flex items-start justify-between mb-5">
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: -5 }}
                          className="bg-gradient-to-br from-primary/10 to-secondary/10 p-3.5 rounded-xl group-hover:from-primary/20 group-hover:to-secondary/20 transition-colors"
                        >
                          <benefit.icon className="h-7 w-7 text-primary" />
                        </motion.div>
                        <div className="text-right">
                          <p className="text-xl font-bold font-headline text-foreground">{benefit.stat}</p>
                          <p className="text-[10px] text-default-400">{benefit.statLabel}</p>
                        </div>
                      </div>
                      <h3 className="font-headline text-lg font-semibold mb-2">{benefit.title}</h3>
                      <p className="text-default-500 text-sm leading-relaxed flex-1">{benefit.description}</p>
                      <div className="mt-4 pt-4 border-t border-divider/30">
                        <span className="text-xs text-primary font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                          Learn more <ArrowRight className="h-3 w-3" />
                        </span>
                      </div>
                    </CardBody>
                  </Card>
                </motion.div>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* ===== FEATURED SERVICES — Asymmetric: left heading + right scrollable grid ===== */}
        <section className="py-24 md:py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-content1/30 via-background to-background" />
          <div className="container mx-auto px-5 relative z-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
              <MotionWrapper>
                <Chip size="sm" variant="flat" color="primary" className="mb-4">Services</Chip>
                <h2 className="text-3xl md:text-4xl font-bold font-headline mb-3">
                  Popular Design{' '}
                  <span className="text-primary">Services</span>
                </h2>
                <p className="text-default-500 max-w-md">
                  Our most sought-after creative solutions, crafted by top talent.
                </p>
              </MotionWrapper>
              <MotionWrapper delay={0.2} className="shrink-0">
                <Button
                  as={Link}
                  href="/design-services"
                  color="primary"
                  variant="flat"
                  radius="full"
                  startContent={<Briefcase className="h-4 w-4" />}
                  className="font-medium"
                >
                  Explore All Services
                </Button>
              </MotionWrapper>
            </div>

            {/* 2-row asymmetric layout: first row 2 cards, second row 3 cards (or vice versa) */}
            <StaggerContainer className="space-y-5">
              {/* Top row — 2 wider cards */}
              <div className="grid md:grid-cols-2 gap-5">
                {featuredServices.slice(0, 2).map(service => (
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
              </div>
              {/* Bottom row — 3 or 4 narrower cards */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {featuredServices.slice(2, 6).map(service => (
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
              </div>
            </StaggerContainer>
          </div>
        </section>

        {/* ===== PORTFOLIO SHOWCASE — Masonry-style grid with varying heights ===== */}
        <section className="py-24 md:py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/[0.02] to-background" />
          <div className="container mx-auto px-5 relative z-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
              <MotionWrapper>
                <Chip size="sm" variant="flat" color="secondary" className="mb-4">Portfolio</Chip>
                <h2 className="text-3xl md:text-4xl font-bold font-headline mb-3">
                  Creative{' '}
                  <span className="text-secondary">Showcase</span>
                </h2>
                <p className="text-default-500 max-w-md">
                  Be inspired by the quality and artistry our designers bring to every project.
                </p>
              </MotionWrapper>
              <MotionWrapper delay={0.2} className="shrink-0">
                <Button
                  as={Link}
                  href="/portfolio"
                  variant="bordered"
                  radius="full"
                  endContent={<ArrowRight className="h-4 w-4" />}
                  className="font-medium"
                >
                  View Full Portfolio
                </Button>
              </MotionWrapper>
            </div>

            {/* Masonry-like layout with variable column spans */}
            <StaggerContainer className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
              {portfolioItemsData.map((item, index) => (
                <motion.div
                  key={item.id}
                  variants={fadeInUp}
                  className={cn(
                    "break-inside-avoid",
                    index % 3 === 0 ? "pb-0" : ""
                  )}
                >
                  <PortfolioShowcaseCard item={item} />
                </motion.div>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* ===== TESTIMONIALS — Featured large testimonial with sidebar nav ===== */}
        <section className="py-24 md:py-32 relative overflow-hidden">
          <div className="absolute inset-0 section-gradient" />
          <div className="absolute top-20 left-[5%] w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px]" />
          <div className="container mx-auto px-5 relative z-10">
            <div className="grid lg:grid-cols-5 gap-12 items-center">
              {/* Left — Section header + navigation dots */}
              <div className="lg:col-span-2">
                <MotionWrapper>
                  <Chip size="sm" variant="flat" color="warning" className="mb-4">Testimonials</Chip>
                  <h2 className="text-3xl md:text-4xl font-bold font-headline mb-4">
                    Trusted by{' '}
                    <span className="text-warning">Businesses</span>{' '}
                    Across India
                  </h2>
                  <p className="text-default-500 leading-relaxed mb-8">
                    See what our clients have to say about their experience with DesignFlow.
                  </p>
                </MotionWrapper>

                {/* Testimonial navigation */}
                {testimonials.length > 0 && (
                  <div className="space-y-3">
                    {testimonials.map((t, i) => (
                      <motion.button
                        key={i}
                        onClick={() => setActiveTestimonial(i)}
                        className={cn(
                          "w-full text-left p-3 rounded-xl transition-all duration-300 flex items-center gap-3",
                          activeTestimonial === i
                            ? "bg-primary/10 border border-primary/30"
                            : "hover:bg-content2/50 border border-transparent"
                        )}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Avatar
                          src={t.clientAvatarUrl || 'https://placehold.co/100x100.png'}
                          name={t.clientName}
                          size="sm"
                          isBordered={activeTestimonial === i}
                          color={activeTestimonial === i ? "primary" : "default"}
                        />
                        <div className="flex-1 min-w-0">
                          <p className={cn("text-sm font-medium truncate", activeTestimonial === i ? "text-primary" : "text-foreground")}>{t.clientName}</p>
                          <p className="text-xs text-default-400 truncate">{t.serviceName}</p>
                        </div>
                        <div className="flex items-center gap-0.5 shrink-0">
                          {Array.from({ length: 5 }).map((_, si) => (
                            <Star key={si} className={cn("h-3 w-3", si < t.rating ? 'text-warning fill-current' : 'text-default-200')} />
                          ))}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                )}
              </div>

              {/* Right — Featured testimonial card */}
              <div className="lg:col-span-3">
                <AnimatePresence mode="wait">
                  {testimonials.length > 0 && (
                    <motion.div
                      key={activeTestimonial}
                      initial={{ opacity: 0, y: 20, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -20, scale: 0.98 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                    >
                      <Card className="bg-content1/60 backdrop-blur-sm border border-divider/50 overflow-visible">
                        <CardBody className="p-8 md:p-10 relative">
                          {/* Large quote icon */}
                          <div className="absolute -top-5 -left-3 bg-primary rounded-xl p-3 shadow-lg shadow-primary/20">
                            <Quote className="h-6 w-6 text-white" />
                          </div>
                          <blockquote className="text-lg md:text-xl text-foreground leading-relaxed mb-8 mt-4 italic">
                            &ldquo;{testimonials[activeTestimonial].reviewText}&rdquo;
                          </blockquote>
                          <Divider className="mb-6" />
                          <div className="flex items-center justify-between flex-wrap gap-4">
                            <div className="flex items-center gap-4">
                              <Avatar
                                src={testimonials[activeTestimonial].clientAvatarUrl || 'https://placehold.co/100x100.png'}
                                name={testimonials[activeTestimonial].clientName}
                                size="lg"
                                isBordered
                                color="primary"
                              />
                              <div>
                                <p className="font-semibold text-lg text-foreground">{testimonials[activeTestimonial].clientName}</p>
                                <p className="text-sm text-default-400">{testimonials[activeTestimonial].serviceName}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} className={cn("h-5 w-5", i < testimonials[activeTestimonial].rating ? 'text-warning fill-current' : 'text-default-200')} />
                              ))}
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </section>

        {/* ===== DUAL CTA — Split panel for clients and designers ===== */}
        <section className="py-24 md:py-32 relative overflow-hidden">
          <div className="container mx-auto px-5 relative z-10">
            <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
              {/* Client CTA */}
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <Card className="h-full overflow-hidden border-0 shadow-xl">
                  <CardBody className="p-0 relative min-h-[360px]">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary via-indigo-600 to-violet-700" />
                    <div className="absolute inset-0 bg-grid opacity-10" />
                    <motion.div
                      className="absolute -bottom-20 -right-20 w-60 h-60 bg-white/10 rounded-full blur-3xl"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 6, repeat: Infinity }}
                    />
                    <div className="relative z-10 p-8 md:p-10 flex flex-col justify-between h-full">
                      <div>
                        <Chip variant="flat" size="sm" className="mb-4 bg-white/20 text-white">For Clients</Chip>
                        <h3 className="text-2xl md:text-3xl font-bold font-headline text-white mb-4">
                          Ready to Elevate Your Brand?
                        </h3>
                        <p className="text-white/80 leading-relaxed mb-8 max-w-sm">
                          Get started with expert designers and bring your creative vision to life.
                        </p>
                      </div>
                      <Button
                        as={Link}
                        href="/design-services"
                        size="lg"
                        radius="full"
                        className="bg-white text-primary font-bold px-8 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all w-fit"
                        startContent={<Lightbulb className="h-5 w-5" />}
                      >
                        Browse Services
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              </motion.div>

              {/* Designer CTA */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <Card className="h-full overflow-hidden border-0 shadow-xl">
                  <CardBody className="p-0 relative min-h-[360px]">
                    <div className="absolute inset-0 bg-gradient-to-br from-secondary via-purple-600 to-fuchsia-700" />
                    <div className="absolute inset-0 bg-dots opacity-20" />
                    <motion.div
                      className="absolute -top-20 -left-20 w-60 h-60 bg-white/10 rounded-full blur-3xl"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 8, repeat: Infinity }}
                    />
                    <div className="relative z-10 p-8 md:p-10 flex flex-col justify-between h-full">
                      <div>
                        <Chip variant="flat" size="sm" className="mb-4 bg-white/20 text-white">For Designers</Chip>
                        <h3 className="text-2xl md:text-3xl font-bold font-headline text-white mb-4">
                          Showcase Your Talent
                        </h3>
                        <p className="text-white/80 leading-relaxed mb-8 max-w-sm">
                          Join our curated network, grow your portfolio, and get paid for your best work.
                        </p>
                      </div>
                      <Button
                        as={Link}
                        href="/signup"
                        size="lg"
                        radius="full"
                        className="bg-white text-secondary font-bold px-8 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all w-fit"
                        startContent={<UserPlus className="h-5 w-5" />}
                      >
                        Join DesignFlow
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}

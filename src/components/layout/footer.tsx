
"use client";

import Link from 'next/link';
import { Brush, LogIn, UserPlus, UserCog, Home, Info, Compass, FileText, Shield, HelpCircle, ShoppingBag, Briefcase, Newspaper, ArrowUpRight, Mail } from 'lucide-react';
import { Divider, Button } from '@heroui/react';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '@/lib/animations';

const platformLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About Us' },
  { href: '/how-it-works', label: 'How It Works' },
  { href: '/design-services', label: 'Browse Services' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/blog', label: 'Blog' },
];

const supportLinks = [
  { href: '/contact-support', label: 'Contact Support' },
  { href: '/faq', label: 'FAQ' },
  { href: '/terms-of-service', label: 'Terms of Service' },
  { href: '/privacy-policy', label: 'Privacy Policy' },
  { href: '/refund-policy', label: 'Refund Policy' },
];

const getStartedLinks = [
  { href: '/login', label: 'Client Login' },
  { href: '/login', label: 'Designer Login' },
  { href: '/signup', label: 'Sign Up as Client' },
  { href: '/signup/designer', label: 'Join as Designer' },
  { href: '/login', label: 'Admin Login' },
];

function FooterLinkGroup({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <motion.div variants={fadeInUp}>
      <h3 className="font-semibold font-headline text-sm tracking-wider mb-5 text-foreground uppercase">{title}</h3>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="text-sm text-default-500 hover:text-primary transition-colors duration-200 group inline-flex items-center gap-1"
            >
              {link.label}
              <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 -translate-y-0.5 group-hover:translate-y-0 transition-all" />
            </Link>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-divider/50">
      {/* Top band — CTA strip */}
      <div className="bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 border-b border-divider/30">
        <div className="container mx-auto px-5 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold font-headline text-foreground">Ready to start your project?</h3>
              <p className="text-sm text-default-500">Browse services or join as a designer today.</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                as={Link}
                href="/design-services"
                color="primary"
                variant="shadow"
                radius="full"
                size="sm"
                className="font-medium"
              >
                Browse Services
              </Button>
              <Button
                as={Link}
                href="/signup"
                variant="bordered"
                radius="full"
                size="sm"
                className="font-medium"
              >
                Sign Up Free
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer content */}
      <div className="bg-content1/30 backdrop-blur-sm">
        <div className="container mx-auto px-5 py-14 relative z-10">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-6 gap-10 md:gap-8"
          >
            {/* Brand column — takes 2 cols */}
            <motion.div variants={fadeInUp} className="col-span-2 space-y-5">
              <Link href="/" className="inline-flex items-center space-x-2 group">
                <motion.div whileHover={{ rotate: [0, -10, 10, -5, 0] }} transition={{ duration: 0.5 }}>
                  <Brush className="h-7 w-7 text-primary" />
                </motion.div>
                <span className="font-bold font-headline text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  DesignFlow
                </span>
              </Link>
              <p className="text-sm text-default-500 leading-relaxed max-w-[280px]">
                Your Vision, Our Expertise. Connecting clients with expert Indian designers for logos, UI/UX, branding, and more.
              </p>
              <div className="flex items-center gap-2 text-sm text-default-400">
                <Mail className="h-4 w-4" />
                <span>hello@designflow.in</span>
              </div>
            </motion.div>

            {/* Platform */}
            <FooterLinkGroup title="Platform" links={platformLinks} />

            {/* Support */}
            <FooterLinkGroup title="Support" links={supportLinks} />

            {/* Get Started */}
            <FooterLinkGroup title="Get Started" links={getStartedLinks} />

            {/* Empty col for spacing on desktop */}
            <div className="hidden md:block" />
          </motion.div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-divider/30 bg-content1/50">
        <div className="container mx-auto px-5 py-5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-default-400">
            <p>&copy; {new Date().getFullYear()} DesignFlow. All rights reserved.</p>
            <p>
              Built with <span role="img" aria-label="love">❤️</span> by RISHAB LODHA
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

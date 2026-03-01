
"use client";

import Link from 'next/link';
import { Brush, LogIn, UserPlus, UserCog, Home, Info, Compass, FileText, Shield, HelpCircle, ShoppingBag, Briefcase, Newspaper } from 'lucide-react';
import { Divider } from '@heroui/react';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '@/lib/animations';

const platformLinks = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/about', label: 'About Us', icon: Info },
  { href: '/how-it-works', label: 'How It Works', icon: Compass },
  { href: '/design-services', label: 'Browse Services', icon: ShoppingBag },
  { href: '/portfolio', label: 'Portfolio', icon: Briefcase },
  { href: '/blog', label: 'Blog', icon: Newspaper },
];

const supportLinks = [
  { href: '/contact-support', label: 'Contact Support', icon: HelpCircle },
  { href: '/faq', label: 'FAQ', icon: HelpCircle },
  { href: '/terms-of-service', label: 'Terms of Service', icon: FileText },
  { href: '/privacy-policy', label: 'Privacy Policy', icon: Shield },
  { href: '/refund-policy', label: 'Refund Policy', icon: Shield },
];

const getStartedLinks = [
  { href: '/login', label: 'Client Login', icon: LogIn },
  { href: '/login', label: 'Designer Login', icon: LogIn },
  { href: '/signup', label: 'Sign Up as Client', icon: UserPlus },
  { href: '/signup/designer', label: 'Join as Designer', icon: UserPlus },
  { href: '/login', label: 'Admin Login', icon: UserCog },
];

function FooterLinkGroup({ title, links }: { title: string; links: typeof platformLinks }) {
  return (
    <motion.div variants={fadeInUp} className="space-y-3 text-center md:text-left">
      <h3 className="font-semibold font-headline text-lg mb-4 text-foreground">{title}</h3>
      <ul className="space-y-2.5">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="text-sm text-default-500 hover:text-primary transition-colors duration-200 flex items-center justify-center md:justify-start gap-2 group"
            >
              <link.icon className="h-4 w-4 group-hover:scale-110 transition-transform" />
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-divider/50 bg-content1/50 backdrop-blur-sm">
      {/* Decorative gradient blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 right-0 w-60 h-60 bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-5 py-16 relative z-10">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10"
        >
          {/* Column 1: Brand */}
          <motion.div variants={fadeInUp} className="space-y-4 md:col-span-2 lg:col-span-1 text-center md:text-left">
            <Link href="/" className="inline-flex items-center space-x-2 justify-center md:justify-start group">
              <motion.div whileHover={{ rotate: [0, -10, 10, -5, 0] }} transition={{ duration: 0.5 }}>
                <Brush className="h-8 w-8 text-primary" />
              </motion.div>
              <span className="font-bold font-headline text-2xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                DesignFlow
              </span>
            </Link>
            <p className="text-sm text-default-500 leading-relaxed max-w-xs mx-auto md:mx-0">
              Your Vision, Our Expertise. Simplified. Connecting clients with expert Indian designers for logos, UI/UX, branding, and more.
            </p>
            <p className="text-xs text-default-400 mt-8">
              &copy; {new Date().getFullYear()} DesignFlow. All rights reserved.
            </p>
          </motion.div>

          {/* Column 2: Platform */}
          <FooterLinkGroup title="Platform" links={platformLinks} />

          {/* Column 3: Support & Legal */}
          <FooterLinkGroup title="Support & Legal" links={supportLinks} />

          {/* Column 4: Get Started */}
          <FooterLinkGroup title="Get Started" links={getStartedLinks} />
        </motion.div>

        <Divider className="my-10 opacity-50" />

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center text-xs text-default-400"
        >
          <p>
            Built with <span role="img" aria-label="love">❤️</span> by RISHAB LODHA
          </p>
        </motion.div>
      </div>
    </footer>
  );
}

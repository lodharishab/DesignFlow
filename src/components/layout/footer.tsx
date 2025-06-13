
import Link from 'next/link';
import { Brush, LogIn, UserPlus, UserCog, Home, Info, Compass, FileText, Shield, HelpCircle, ShoppingBag, Briefcase, Newspaper } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t bg-background text-foreground">
      <div className="container mx-auto px-5 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1: Brand and Copyright */}
          <div className="space-y-4 md:col-span-2 lg:col-span-1 text-center md:text-left">
            <Link href="/" className="inline-flex items-center space-x-2 justify-center md:justify-start">
              <Brush className="h-8 w-8 text-primary" />
              <span className="font-bold font-headline text-2xl">DesignFlow</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your Vision, Our Expertise. Simplified. Connecting clients with expert Indian designers for logos, UI/UX, branding, and more.
            </p>
            <p className="text-xs text-muted-foreground mt-8">
              © {new Date().getFullYear()} DesignFlow. All rights reserved.
            </p>
          </div>

          {/* Column 2: Platform */}
          <div className="space-y-3 text-center md:text-left">
            <h3 className="font-semibold font-headline text-lg mb-4">Platform</h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center justify-center md:justify-start gap-2">
                  <Home className="h-4 w-4" /> Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center justify-center md:justify-start gap-2">
                  <Info className="h-4 w-4" /> About Us
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center justify-center md:justify-start gap-2">
                  <Compass className="h-4 w-4" /> How It Works
                </Link>
              </li>
              <li>
                <Link href="/design-services" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center justify-center md:justify-start gap-2">
                  <ShoppingBag className="h-4 w-4" /> Browse Services
                </Link>
              </li>
              <li>
                <Link href="/portfolio" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center justify-center md:justify-start gap-2">
                  <Briefcase className="h-4 w-4" /> Portfolio
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center justify-center md:justify-start gap-2">
                  <Newspaper className="h-4 w-4" /> Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Support & Legal */}
          <div className="space-y-3 text-center md:text-left">
            <h3 className="font-semibold font-headline text-lg mb-4">Support &amp; Legal</h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/contact-support" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center justify-center md:justify-start gap-2">
                  <HelpCircle className="h-4 w-4" /> Contact Support
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center justify-center md:justify-start gap-2">
                  <HelpCircle className="h-4 w-4" /> FAQ
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center justify-center md:justify-start gap-2">
                  <FileText className="h-4 w-4" /> Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center justify-center md:justify-start gap-2">
                  <Shield className="h-4 w-4" /> Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center justify-center md:justify-start gap-2">
                  <Shield className="h-4 w-4" /> Refund Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Get Started / Accounts */}
          <div className="space-y-3 text-center md:text-left">
            <h3 className="font-semibold font-headline text-lg mb-4">Get Started</h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/login" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center justify-center md:justify-start gap-2">
                  <LogIn className="h-4 w-4" /> Client Login
                </Link>
              </li>
               <li>
                <Link href="/login" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center justify-center md:justify-start gap-2">
                  <LogIn className="h-4 w-4" /> Designer Login
                </Link>
              </li>
              <li>
                <Link href="/signup" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center justify-center md:justify-start gap-2">
                  <UserPlus className="h-4 w-4" /> Sign Up as Client
                </Link>
              </li>
              <li>
                <Link href="/signup/designer" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center justify-center md:justify-start gap-2">
                  <UserPlus className="h-4 w-4" /> Join as Designer
                </Link>
              </li>
               <li>
                <Link href="/login" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center justify-center md:justify-start gap-2">
                  <UserCog className="h-4 w-4" /> Admin Login
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-10 border-t text-center text-xs text-muted-foreground">
          <p>
            Built with <span role="img" aria-label="love">❤️</span> by RISHAB LODHA
          </p>
        </div>
      </div>
    </footer>
  );
}


import Link from 'next/link';
import { Brush, LogIn, UserPlus, UserCog } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t bg-background text-foreground">
      <div className="container mx-auto px-5 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 text-center md:text-left">
          {/* Column 1: Brand and Copyright */}
          <div className="space-y-4 md:col-span-1 lg:col-span-2">
            <Link href="/" className="inline-flex items-center space-x-2 justify-center md:justify-start">
              <Brush className="h-7 w-7 text-primary" />
              <span className="font-bold font-headline text-xl">DesignFlow</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Your Vision, Our Expertise. Simplified.
            </p>
            <p className="text-xs text-muted-foreground mt-8">
              &copy; {new Date().getFullYear()} DesignFlow. All rights reserved.
            </p>
          </div>

          {/* Column 2: For Clients & Designers */}
          <div className="space-y-3">
            <h3 className="font-semibold font-headline text-md mb-3">Access Your Account</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/login" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center justify-center md:justify-start">
                  <LogIn className="mr-2 h-4 w-4" /> Client Login
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center justify-center md:justify-start">
                  <LogIn className="mr-2 h-4 w-4" /> Designer Login
                </Link>
              </li>
               <li>
                <Link href="/signup/designer" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center justify-center md:justify-start">
                  <UserPlus className="mr-2 h-4 w-4" /> Join as a Designer
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Platform & Admin */}
          <div className="space-y-3">
             <h3 className="font-semibold font-headline text-md mb-3">Platform Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/services" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Browse Services
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center justify-center md:justify-start">
                  <UserCog className="mr-2 h-4 w-4" /> Admin Login
                </Link>
              </li>
              {/* Add more links like About Us, Contact, Terms, Privacy if needed */}
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-8 border-t text-center text-xs text-muted-foreground">
          <p>
            Built with <span role="img" aria-label="love">❤️</span> by Your Creative Team
          </p>
        </div>
      </div>
    </footer>
  );
}

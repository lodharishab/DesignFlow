
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutGrid, Menu as MenuIcon, Briefcase, Newspaper } from 'lucide-react'; // Added Newspaper for Blog
import { cn } from '@/lib/utils';
import { useUI } from '@/contexts/ui-context';

const navItems = [
  { href: '/client/dashboard', label: 'Home', icon: Home }, // Assuming client dashboard as home when logged in
  { href: '/services', label: 'Services', icon: LayoutGrid },
  { href: '/portfolio', label: 'Portfolio', icon: Briefcase },
  { href: '/blog', label: 'Blog', icon: Newspaper }, // Added Blog
];

export function MobileBottomNav() {
  const pathname = usePathname();
  const { toggleMobileMenu } = useUI();

  // Determine if any main nav item is active.
  // Exclude the "More" button itself from this check.
  const isAnyMainNavItemActive = navItems.some(item => {
    let effectiveIsActive = pathname === item.href;
    // For nested routes, make parent active
    if (item.href !== '/' && item.href.length > 1) { 
      if (item.href === '/services') {
           effectiveIsActive = pathname === '/services' || pathname.startsWith('/services/');
      } else if (item.href === '/portfolio') {
          effectiveIsActive = pathname === '/portfolio' || pathname.startsWith('/portfolio/');
      } else if (item.href === '/blog') { // Check for blog and its children
          effectiveIsActive = pathname === '/blog' || pathname.startsWith('/blog/');
      }
       else {
          effectiveIsActive = effectiveIsActive || pathname.startsWith(item.href);
      }
    }
    return effectiveIsActive;
  });

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-background border-t border-border shadow-md z-50">
      <div className="flex justify-around items-center h-full">
        {navItems.map((item) => {
          let effectiveIsActive = pathname === item.href;
          // For nested routes, make parent active
          if (item.href !== '/' && item.href.length > 1) { 
            if (item.href === '/services') {
                 effectiveIsActive = pathname === '/services' || pathname.startsWith('/services/');
            } else if (item.href === '/portfolio') {
                effectiveIsActive = pathname === '/portfolio' || pathname.startsWith('/portfolio/');
            } else if (item.href === '/blog') { // Check for blog and its children
                effectiveIsActive = pathname === '/blog' || pathname.startsWith('/blog/');
            }
             else {
                effectiveIsActive = effectiveIsActive || pathname.startsWith(item.href);
            }
          }

          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center text-xs w-full h-full transition-colors',
                effectiveIsActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <item.icon className={cn('h-6 w-6 mb-0.5', effectiveIsActive ? 'text-primary' : '')} />
              <span>{item.label}</span>
            </Link>
          );
        })}
        {/* More Button */}
        <button
          onClick={toggleMobileMenu}
          className={cn(
            'flex flex-col items-center justify-center text-xs w-full h-full transition-colors',
            !isAnyMainNavItemActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground' // Active if no other item is active
          )}
          aria-label="Open menu"
        >
          <MenuIcon className="h-6 w-6 mb-0.5" />
          <span>More</span>
        </button>
      </div>
    </nav>
  );
}

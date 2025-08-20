
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutGrid, Menu as MenuIcon, Briefcase, ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUI } from '@/contexts/ui-context';
import { Badge } from '../ui/badge';

const navItems = [
  { href: '/client/dashboard', label: 'Home', icon: Home }, // Assuming client dashboard as home
  { href: '/services', label: 'Services', icon: LayoutGrid },
  { href: '/portfolio', label: 'Portfolio', icon: Briefcase },
  { href: '/cart', label: 'Cart', icon: ShoppingCart }, // Changed from Blog to Cart
];

export function MobileBottomNav() {
  const pathname = usePathname();
  const { toggleMobileMenu } = useUI();
  const mockCartItemCount = 3; // Mock data

  // Determine if any main nav item is active.
  const isAnyMainNavItemActive = navItems.some(item => {
    let effectiveIsActive = pathname === item.href;
    if (item.href !== '/' && item.href.length > 1) { 
      if (item.href === '/services') {
           effectiveIsActive = pathname === '/services' || pathname.startsWith('/services/');
      } else if (item.href === '/portfolio') {
          effectiveIsActive = pathname === '/portfolio' || pathname.startsWith('/portfolio/');
      } else {
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
          if (item.href !== '/' && item.href.length > 1) { 
            if (item.href === '/services') {
                 effectiveIsActive = pathname === '/services' || pathname.startsWith('/services/');
            } else if (item.href === '/portfolio') {
                effectiveIsActive = pathname === '/portfolio' || pathname.startsWith('/portfolio/');
            } else {
                effectiveIsActive = effectiveIsActive || pathname.startsWith(item.href);
            }
          }

          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center text-xs w-full h-full transition-colors relative',
                effectiveIsActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <item.icon className={cn('h-6 w-6 mb-0.5', effectiveIsActive ? 'text-primary' : '')} />
              {item.href === '/cart' && mockCartItemCount > 0 && (
                 <Badge variant="destructive" className="absolute top-1 right-5 h-4 w-4 p-0 flex items-center justify-center text-xs">
                  {mockCartItemCount}
                </Badge>
              )}
              <span>{item.label}</span>
            </Link>
          );
        })}
        {/* More Button */}
        <button
          onClick={toggleMobileMenu}
          className={cn(
            'flex flex-col items-center justify-center text-xs w-full h-full transition-colors',
            !isAnyMainNavItemActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
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

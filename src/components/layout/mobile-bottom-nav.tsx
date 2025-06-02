
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutGrid, Menu as MenuIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUI } from '@/contexts/ui-context';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/services', label: 'Services', icon: LayoutGrid },
];

export function MobileBottomNav() {
  const pathname = usePathname();
  const { toggleMobileMenu } = useUI();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-background border-t border-border shadow-md z-50">
      <div className="flex justify-around items-center h-full">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href) && item.href.length > 1);
          // Special handling for exact match for "/"
          const isHomeActive = item.href === '/' && pathname === '/';
          const effectiveIsActive = item.href === '/' ? isHomeActive : isActive;

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
          className="flex flex-col items-center justify-center text-xs w-full h-full text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Open menu"
        >
          <MenuIcon className="h-6 w-6 mb-0.5" />
          <span>More</span>
        </button>
      </div>
    </nav>
  );
}

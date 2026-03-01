
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutGrid, Menu as MenuIcon, Briefcase, ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUI } from '@/contexts/ui-context';
import { motion } from 'framer-motion';

const navItems = [
  { href: '/client/dashboard', label: 'Home', icon: Home },
  { href: '/services', label: 'Services', icon: LayoutGrid },
  { href: '/portfolio', label: 'Portfolio', icon: Briefcase },
  { href: '/cart', label: 'Cart', icon: ShoppingCart },
];

export function MobileBottomNav() {
  const pathname = usePathname();
  const { toggleMobileMenu } = useUI();
  const mockCartItemCount = 3;

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname === href || pathname.startsWith(href + '/') || pathname.startsWith(href);
  };

  const isAnyMainNavItemActive = navItems.some(item => isActive(item.href));

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-background/80 backdrop-blur-xl border-t border-divider/50 shadow-2xl z-50">
      <div className="flex justify-around items-center h-full">
        {navItems.map((item) => {
          const active = isActive(item.href);

          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center text-xs w-full h-full transition-colors relative',
                active ? 'text-primary' : 'text-default-500'
              )}
            >
              <motion.div
                whileTap={{ scale: 0.85 }}
                className="relative flex flex-col items-center"
              >
                {active && (
                  <motion.div
                    layoutId="bottomNavIndicator"
                    className="absolute -top-3 w-8 h-1 rounded-full bg-primary"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <item.icon className={cn('h-5 w-5 mb-0.5', active ? 'text-primary' : '')} />
                {item.href === '/cart' && mockCartItemCount > 0 && (
                  <span className="absolute -top-1 -right-3 bg-danger text-white text-[9px] font-bold rounded-full h-3.5 w-3.5 flex items-center justify-center">
                    {mockCartItemCount}
                  </span>
                )}
                <span className={cn('text-[10px] mt-0.5', active && 'font-semibold')}>{item.label}</span>
              </motion.div>
            </Link>
          );
        })}
        {/* More Button */}
        <button
          onClick={toggleMobileMenu}
          className={cn(
            'flex flex-col items-center justify-center text-xs w-full h-full transition-colors',
            !isAnyMainNavItemActive ? 'text-primary' : 'text-default-500'
          )}
          aria-label="Open menu"
        >
          <motion.div whileTap={{ scale: 0.85 }} className="flex flex-col items-center">
            <MenuIcon className="h-5 w-5 mb-0.5" />
            <span className="text-[10px] mt-0.5">More</span>
          </motion.div>
        </button>
      </div>
    </nav>
  );
}

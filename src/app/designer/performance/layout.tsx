
"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, ShieldAlert, FileWarning, Activity } from 'lucide-react';

const performanceNavItems = [
  { label: 'Reviews', href: '/designer/performance/reviews', icon: Star },
  { label: 'Reports', href: '/designer/performance/reports', icon: FileWarning },
  { label: 'Disputes', href: '/designer/performance/disputes', icon: ShieldAlert },
];

export default function PerformanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const getCurrentTabValue = () => {
    const currentItem = performanceNavItems.find(item => pathname.startsWith(item.href));
    return currentItem?.href || '/designer/performance/reviews';
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-headline flex items-center">
          <Activity className="mr-3 h-8 w-8 text-primary" />
          Performance & Issues
        </h1>
      </div>
      
      <Tabs value={getCurrentTabValue()} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          {performanceNavItems.map(item => (
            <TabsTrigger key={item.href} value={item.href} asChild>
              <Link href={item.href}>
                 <item.icon className="mr-2 h-4 w-4"/> {item.label}
              </Link>
            </TabsTrigger>
          ))}
        </TabsList>
        <div className="mt-6">
            {children}
        </div>
      </Tabs>
    </div>
  );
}

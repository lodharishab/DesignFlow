
"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Activity } from 'lucide-react';


export default function PerformanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-headline flex items-center">
          <Activity className="mr-3 h-8 w-8 text-primary" />
          Performance & Issues
        </h1>
      </div>
      
      {/* The main content for reviews, reports, disputes will be rendered here */}
      {children}
    </div>
  );
}

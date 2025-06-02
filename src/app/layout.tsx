
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Poppins, Playfair_Display } from 'next/font/google';
import { cn } from '@/lib/utils';
import { UIProvider } from '@/contexts/ui-context';
import { MobileBottomNav } from '@/components/layout/mobile-bottom-nav';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
});

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-playfair-display',
});

export const metadata: Metadata = {
  title: 'DesignFlow - Creative Services Marketplace',
  description: 'Your Vision, Our Expertise. Simplified.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={cn(poppins.variable, playfairDisplay.variable)}>
      <head />
      <body className="font-body antialiased min-h-screen flex flex-col pb-16 md:pb-0">
        <UIProvider>
          {children}
          <MobileBottomNav />
        </UIProvider>
        <Toaster />
      </body>
    </html>
  );
}
